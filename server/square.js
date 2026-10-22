// square.js
// Everything that talks to Square lives here, the same way printify.js holds
// everything that talks to Printify.
//
// SANDBOX VS LIVE:
// Square runs two separate worlds. The SANDBOX is a practice copy with fake
// money and test cards; the PRODUCTION world charges real cards. They have
// different web addresses and different access tokens, and a sandbox token
// does nothing in production (and vice versa). SQUARE_ENVIRONMENT picks which
// world this server talks to, so going live is a settings change, not a code change.
//
// API docs: https://developer.squareup.com/reference/square

const crypto = require('crypto');

const BASE_URLS = {
  sandbox: 'https://connect.squareupsandbox.com',
  production: 'https://connect.squareup.com',
};

// Square changes its API over time. Sending a fixed version date means Square
// keeps answering in the format this code was written for, even after they
// release changes. Update it deliberately, after reading Square's changelog.
const SQUARE_VERSION = '2026-09-16';

class SquareError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'SquareError';
    this.status = status;
    this.details = details;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add it to your .env file (the server never reads .env.example).`);
  }
  return value;
}

// Which Square world are we in? Anything other than exactly "sandbox" or
// "production" is a typo, and guessing could mean charging real cards by
// accident, so stop with a clear error instead.
function getEnvironment() {
  const environment = requireEnv('SQUARE_ENVIRONMENT');
  if (!Object.hasOwn(BASE_URLS, environment)) {
    throw new Error(`SQUARE_ENVIRONMENT must be "sandbox" or "production", not "${environment}".`);
  }
  return environment;
}

// The one function that makes HTTP requests to Square, just like
// printifyRequest in printify.js.
async function squareRequest(method, path, body) {
  const accessToken = requireEnv('SQUARE_ACCESS_TOKEN');
  const url = `${BASE_URLS[getEnvironment()]}${path}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Square-Version': SQUARE_VERSION,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });
  } catch (err) {
    console.error(`[square] ${method} ${path} -> no response: ${err.message}`);
    throw new SquareError(`Could not reach Square: ${err.message}`, 502);
  }

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    console.error(`[square] ${method} ${path} -> ${response.status}`, JSON.stringify(data, null, 2));
    // Square reports problems as a list: { errors: [{ code, detail, field }] }.
    const first = data?.errors?.[0];
    const reason = first ? `${first.code}${first.detail ? `: ${first.detail}` : ''}` : response.statusText;
    throw new SquareError(`Square returned ${response.status}: ${reason}`, response.status, data);
  }

  return data;
}

// Creates a Square-hosted checkout page and returns its link.
//
// We send Square a full "order": the line item with the price WE looked up,
// plus a shipping fee. Square shows that page to the customer and handles the
// card. We never see or store card numbers, which is a big part of why using
// a hosted checkout is the safe choice.
//
// `metadata` is a set of little sticky notes we attach to the order (what was
// bought, where to ship it). When the payment webhook arrives later, we read
// the notes back to know what to send to Printify.
async function createPaymentLink({ lineItem, shippingFeeCents, currency, buyerEmail, orderMetadata, redirectUrl }) {
  const locationId = requireEnv('SQUARE_LOCATION_ID');

  const result = await squareRequest('POST', '/v2/online-checkout/payment-links', {
    // If a network hiccup makes us send this request twice, Square sees the
    // same key and creates the checkout only once.
    idempotency_key: crypto.randomUUID(),
    order: {
      location_id: locationId,
      line_items: [
        lineItem,
        // Shipping is its own line item rather than Square's "shipping_fee"
        // option, because that option makes Square's page ask for a second
        // shipping address, which could differ from the one we saved.
        {
          name: 'Shipping (flat rate)',
          quantity: '1',
          base_price_money: { amount: shippingFeeCents, currency },
        },
      ],
      metadata: orderMetadata,
    },
    checkout_options: {
      redirect_url: redirectUrl,
    },
    pre_populated_data: {
      buyer_email: buyerEmail,
    },
  });

  return result.payment_link;
}

// Fetches an order, including the metadata sticky notes we attached.
async function getOrder(orderId) {
  const result = await squareRequest('GET', `/v2/orders/${encodeURIComponent(orderId)}`);
  return result.order;
}

// ---------------------------------------------------------------------------
// WEBHOOK SIGNATURE CHECK
// A webhook is Square phoning our server to say "something happened", e.g.
// "a payment completed". But /square-webhook is a public address, so ANYONE
// can send it a message that looks exactly like Square's. If we believed
// those messages, someone could type up a fake "payment completed" and get
// free prints shipped to their door, paid for by you.
//
// The signature is how we tell real messages from fakes. Square and our
// server share a secret (SQUARE_WEBHOOK_SIGNATURE_KEY) that nobody else knows.
// For every message, Square mixes the secret with the URL and the exact
// message text using HMAC-SHA256, a one-way math recipe, and sends the result
// in a header. We run the same recipe on what we received. A forger can't
// produce a matching result without the secret, and changing even one
// character of the message changes the result completely.
//
// That's why the RAW body matters: we must check the exact bytes Square sent,
// before anything re-formats them.
// ---------------------------------------------------------------------------
function isValidWebhookSignature({ rawBody, signatureHeader }) {
  const signatureKey = requireEnv('SQUARE_WEBHOOK_SIGNATURE_KEY');
  const notificationUrl = requireEnv('SQUARE_WEBHOOK_URL');

  if (typeof rawBody !== 'string' || !signatureHeader) return false;

  const expected = crypto
    .createHmac('sha256', signatureKey)
    .update(notificationUrl + rawBody)
    .digest('base64');

  // Constant-time comparison, for the same reason as the admin token check.
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = {
  SquareError,
  getEnvironment,
  createPaymentLink,
  getOrder,
  isValidWebhookSignature,
};
