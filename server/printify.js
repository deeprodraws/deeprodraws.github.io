// printify.js
// Everything that talks to Printify lives in this one file. The rest of the
// server calls these functions and never builds Printify URLs or headers itself,
// so if Printify changes something, this is the only file to fix.
//
// API docs: https://developers.printify.com/

const BASE_URL = 'https://api.printify.com/v1';

// A custom error type so routes can tell "Printify said no" apart from a bug in
// our own code, and can pass Printify's HTTP status (400, 401, 404...) along.
class PrintifyError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'PrintifyError';
    this.status = status;
    this.details = details;
  }
}

// Read a required environment variable, or fail with a message that says
// exactly which one is missing (much easier to debug than "undefined").
function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add it to your .env file (the server never reads .env.example).`);
  }
  return value;
}

// The one function that actually makes HTTP requests to Printify.
// Every other function below is a thin wrapper around this.
async function printifyRequest(method, path, body) {
  const apiKey = requireEnv('PRINTIFY_API_KEY');

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        // Printify uses "Bearer token" auth: your API key goes in this header.
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Printify requires every request to identify the app making it.
        'User-Agent': 'deeprodraws-server',
      },
      body: body ? JSON.stringify(body) : undefined,
      // Give up after 15 seconds instead of hanging forever.
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    // We never got a response at all: no internet, DNS failure, or timeout.
    console.error(`[printify] ${method} ${path} -> no response: ${err.message}`);
    throw new PrintifyError(`Could not reach Printify: ${err.message}`, 502);
  }

  // Read the body as text first, then try JSON. Printify normally sends JSON,
  // but error pages sometimes aren't, and we still want to log what came back.
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    // Log the full details on the server (visible in Render's "Logs" tab).
    console.error(`[printify] ${method} ${path} -> ${response.status}`, JSON.stringify(data, null, 2));
    // Printify puts the useful explanation in different places depending on
    // the error: validation errors use errors.reason, auth errors use error.
    const reason = data?.errors?.reason || data?.message || data?.error || response.statusText;
    throw new PrintifyError(`Printify returned ${response.status}: ${reason}`, response.status, data);
  }

  return data;
}

// Lists every shop on your Printify account. You only need this once, to find
// the numeric ID to put in PRINTIFY_SHOP_ID.
async function listShops() {
  return printifyRequest('GET', '/shops.json');
}

// Lists the products in your shop, with the variant IDs you need for ordering.
// A "product" is one design (e.g. "Eagle print"); each "variant" is one
// purchasable version of it (e.g. 8x10, 11x14). Orders need both IDs.
async function listProducts() {
  const shopId = requireEnv('PRINTIFY_SHOP_ID');
  const products = [];

  // Printify returns products in pages of up to 50, so keep asking for the
  // next page until we've seen the last one.
  let page = 1;
  let lastPage = 1;
  do {
    const result = await printifyRequest('GET', `/shops/${shopId}/products.json?limit=50&page=${page}`);
    products.push(...result.data);
    lastPage = result.last_page;
    page += 1;
  } while (page <= lastPage);

  // Trim each product down to what you actually need for ordering.
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    variants: product.variants
      .filter((variant) => variant.is_enabled)
      .map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: variant.price, // in cents, e.g. 2500 = $25.00
      })),
  }));
}

// Places an order for one product variant, shipped to the given address.
//
// IMPORTANT: Printify has no "test mode". By default, new stores auto-approve
// API orders and send them to production (printing + charging your card)
// 24 hours after they're created. Before testing, set your store's Order
// approval to Manual in Printify. The test route also cancels its order right
// away, but manual approval is the safety net.
//
// `address` must look like:
// { first_name, last_name, email, phone, country, region, address1, address2, city, zip }
// country is a 2-letter code ("US"); region is the state ("CA").
async function createOrder({ productId, variantId, quantity, address, externalId, label }) {
  const shopId = requireEnv('PRINTIFY_SHOP_ID');

  const order = {
    // Your own ID for this order, so you can match it to a payment later.
    // Printify rejects duplicate external_ids, so each one must be unique.
    external_id: externalId,
    label,
    line_items: [
      {
        product_id: productId,
        variant_id: Number(variantId),
        quantity: Number(quantity),
      },
    ],
    shipping_method: 1, // 1 = standard shipping
    send_shipping_notification: false,
    address_to: address,
  };

  // Printify replies with { id: "..." }, the new order's Printify ID.
  return printifyRequest('POST', `/shops/${shopId}/orders.json`, order);
}

// Fetches one order, including its current status ("pending", "on-hold", ...).
async function getOrder(orderId) {
  const shopId = requireEnv('PRINTIFY_SHOP_ID');
  return printifyRequest('GET', `/shops/${shopId}/orders/${orderId}.json`);
}

// Cancels an order. Printify only allows this while the order is "on-hold"
// or "payment-not-received", i.e. before it has gone to production.
async function cancelOrder(orderId) {
  const shopId = requireEnv('PRINTIFY_SHOP_ID');
  return printifyRequest('POST', `/shops/${shopId}/orders/${orderId}/cancel.json`);
}

module.exports = {
  PrintifyError,
  listShops,
  listProducts,
  createOrder,
  getOrder,
  cancelOrder,
};
