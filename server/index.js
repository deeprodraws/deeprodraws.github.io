// index.js
// The Express server. It sets up the app, defines the routes, and starts
// listening for requests.
//
// HOW A SALE FLOWS THROUGH THIS SERVER:
//   1. The website sends POST /create-checkout: "this print, this size, this many".
//   2. We look up the real price in products.js and ask Square for a checkout
//      page for that amount. The website sends the customer to that page.
//   3. The customer enters their address and pays on Square's page (we never
//      touch the card), then Square sends them to the website's thank-you page.
//   4. Square calls POST /square-webhook: "payment completed".
//   5. We check the message really came from Square, then order the print
//      from Printify, shipped to the address Square collected.
//
// RENDER FREE TIER NOTE: free services "spin down" after 15 minutes with no
// traffic. The next request then waits ~30-60 seconds while it wakes up. Once
// the store is live, set up a keep-alive ping (like before, e.g. cron-job.org
// or UptimeRobot) that hits GET / every 10-14 minutes so customers never hit
// a cold start, and so Square's webhooks don't arrive while it's asleep. One
// always-on free service fits in Render's 750 free hours/month.

// Load variables from a local .env file into process.env. On Render there is
// no .env file; Render injects the variables you set in its dashboard, and
// this line quietly does nothing.
require('dotenv').config({ quiet: true });

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const printify = require('./printify');
const square = require('./square');
const { CURRENCY, SHIPPING_COUNTRIES, findPrintSize } = require('./products');

// Fail fast: if a required secret is missing, crash on startup with a clear
// message, instead of starting "fine" and failing on the first real request.
const REQUIRED_ENV = [
  'PRINTIFY_API_KEY',
  'PRINTIFY_SHOP_ID',
  'SQUARE_ACCESS_TOKEN',
  'SQUARE_LOCATION_ID',
  'SQUARE_ENVIRONMENT',
];
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing ${missing.join(', ')}. Add them to your .env file (the server never reads .env.example).`);
  process.exit(1);
}

let squareEnvironment;
try {
  squareEnvironment = square.getEnvironment();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const app = express();

// Render tells us which port to use through the PORT variable. Locally we use
// 3001 so it doesn't collide with the Next.js site running on 3000.
const PORT = process.env.PORT || 3001;

// Where Square sends the customer after they pay. Landing there doesn't prove
// anyone paid (anyone can type the address), so that page only says thanks.
// Orders are placed only by the signed webhook below.
const CHECKOUT_REDIRECT_URL = 'https://deeprodraws.com/thank-you/';

// ---------------------------------------------------------------------------
// CORS (Cross-Origin Resource Sharing)
// Browsers block a web page from calling a server on a different domain
// unless that server says "this domain is allowed". This list is that
// permission: only pages on your site may call this server from a browser.
//
// CORS is NOT security on its own. It only controls browsers. Tools like curl
// ignore it completely, which is why sensitive routes also need a password
// (see requireAdmin below) or a signature (see /square-webhook).
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = ['https://deeprodraws.com', 'https://www.deeprodraws.com'];
// While practicing in sandbox, also allow the website running on your laptop
// (`npm run dev` in the main folder), so you can test the Buy button locally.
if (squareEnvironment === 'sandbox') ALLOWED_ORIGINS.push('http://localhost:3000');
app.use(cors({ origin: ALLOWED_ORIGINS }));

// Parse JSON request bodies so routes can read them as req.body.
// The `verify` step also keeps an untouched copy of the original text in
// req.rawBody, because the Square signature check needs the exact bytes
// Square sent (see square.js).
app.use(
  express.json({
    verify: (req, res, buffer) => {
      req.rawBody = buffer.toString('utf8');
    },
  }),
);

// ---------------------------------------------------------------------------
// Admin check
// The test route creates real orders in your Printify shop, and your Render
// URL is public. Without this, anyone who found the URL could spam your shop
// with orders. Callers must send the ADMIN_TOKEN in an "x-admin-token" header.
// ---------------------------------------------------------------------------
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return res.status(503).json({ error: 'ADMIN_TOKEN is not set on the server, so admin routes are disabled.' });
  }

  const provided = req.get('x-admin-token') || '';
  // timingSafeEqual compares in constant time, so an attacker can't guess the
  // token one character at a time by measuring how fast we say "no".
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: 'Missing or wrong x-admin-token header.' });
  }

  next();
}

// ---------------------------------------------------------------------------
// Shipping address
// Square's checkout page collects the address. After payment, Square saves
// it on the order's "shipment" details, and also copies it onto the payment.
// This turns Square's format into the shape Printify expects.
// ---------------------------------------------------------------------------
function shippingAddressFromSquare(order, payment) {
  const recipient = order.fulfillments?.find((f) => f.type === 'SHIPMENT')?.shipment_details?.recipient || {};
  const address = recipient.address || payment.shipping_address || {};

  // Square may give the name as one "display_name", e.g. "Jane Q Smith".
  const [firstWord = '', ...otherWords] = (recipient.display_name || '').trim().split(/\s+/);

  return {
    first_name: address.first_name || firstWord,
    last_name: address.last_name || otherWords.join(' '),
    email: recipient.email_address || payment.buyer_email_address || '',
    phone: recipient.phone_number || '',
    country: address.country || '',
    region: address.administrative_district_level_1 || '', // the state, e.g. "CA"
    address1: address.address_line_1 || '',
    address2: address.address_line_2 || '',
    city: address.locality || '',
    zip: address.postal_code || '',
  };
}

const REQUIRED_ADDRESS_FIELDS = ['first_name', 'last_name', 'country', 'region', 'address1', 'city', 'zip'];

// ---------------------------------------------------------------------------
// GET /  (health check)
// Lets you, Render, and your keep-alive ping confirm the server is up.
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('ok');
});

// ---------------------------------------------------------------------------
// POST /create-checkout
// Called by the website when a customer clicks "Buy". It expects JSON like:
//   { "product_id": "eagle", "size": "11x14", "quantity": 1 }
// and replies with { "checkout_url": "https://square.link/..." }.
// The website then sends the customer to that URL to pay.
//
// Notice what the website does NOT send: a price. See products.js for why.
// ---------------------------------------------------------------------------
app.post('/create-checkout', async (req, res) => {
  const { product_id, size, quantity = 1 } = req.body || {};

  const match = findPrintSize(product_id, size);
  if (!match) {
    return res.status(400).json({ error: 'That print or size is not available.' });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return res.status(400).json({ error: 'Quantity must be a whole number from 1 to 10.' });
  }

  const { print, size: printSize, sizeKey } = match;

  try {
    const paymentLink = await square.createPaymentLink({
      lineItem: {
        name: `${print.title} print, ${printSize.label}`,
        quantity: String(qty),
        // The price comes from products.js, never from the request.
        base_price_money: { amount: printSize.priceCents, currency: CURRENCY },
        // Sticky notes saying exactly what to order from Printify once paid.
        metadata: {
          product_id: print.id,
          size: sizeKey,
          printify_product_id: String(printSize.printifyProductId),
          printify_variant_id: String(printSize.printifyVariantId),
        },
      },
      redirectUrl: CHECKOUT_REDIRECT_URL,
    });

    console.log(`[checkout] created Square order ${paymentLink.order_id} for ${print.id} ${sizeKey} x${qty}`);
    res.json({ checkout_url: paymentLink.url, square_order_id: paymentLink.order_id });
  } catch (err) {
    // The full error is in the server log. Customers get a plain message,
    // because error details can reveal how the system works inside.
    console.error('[checkout] failed:', err.message);
    res.status(502).json({ error: 'Could not start checkout. Please try again in a moment.' });
  }
});

// ---------------------------------------------------------------------------
// POST /square-webhook
// Square calls this when something happens with a payment. We only act on
// one thing: a payment reaching COMPLETED, meaning the money is ours.
//
// STEP 1, THE CRITICAL ONE: check the signature (see square.js for how).
// This address is public. Without this check, anyone could send a fake
// "payment completed" and get prints shipped for free. Anything that fails
// is rejected before we read a single field of it.
//
// We then reply 200 ("got it") right away and do the Printify work after.
// Square expects a fast answer; if we're slow, it assumes we missed the
// message and sends it again.
// ---------------------------------------------------------------------------

// Square can send the same news more than once (a "payment.created" and a
// "payment.updated" for the same payment, or retries). This remembers which
// Square orders we've already handled, so each sale is ordered only once.
// It resets when the server restarts; Printify's rule that every order must
// have a unique external_id (we use the Square order ID) is the backup guard.
const handledSquareOrders = new Set();

app.post('/square-webhook', (req, res) => {
  let valid;
  try {
    valid = square.isValidWebhookSignature({
      rawBody: req.rawBody,
      signatureHeader: req.get('x-square-hmacsha256-signature'),
    });
  } catch (err) {
    // The key or URL isn't configured. Answer with an error so Square tries
    // again later, after you've fixed the settings.
    console.error('[webhook] cannot check signatures:', err.message);
    return res.sendStatus(500);
  }

  if (!valid) {
    console.warn('[webhook] REJECTED: signature did not match. Ignoring this request.');
    return res.sendStatus(403);
  }

  res.sendStatus(200);

  handleSquareEvent(req.body).catch((err) => {
    console.error('[webhook] failed while handling event:', err.message);
  });
});

async function handleSquareEvent(event) {
  if (event.type !== 'payment.created' && event.type !== 'payment.updated') {
    console.log(`[webhook] ignoring event type ${event.type}`);
    return;
  }

  const payment = event.data?.object?.payment;
  if (!payment || payment.status !== 'COMPLETED') {
    console.log(`[webhook] payment ${payment?.id} is ${payment?.status}, nothing to do yet`);
    return;
  }

  const squareOrderId = payment.order_id;
  if (!squareOrderId) {
    console.log(`[webhook] payment ${payment.id} has no order, so it isn't an online print sale`);
    return;
  }

  if (handledSquareOrders.has(squareOrderId)) {
    console.log(`[webhook] already handled Square order ${squareOrderId}, skipping duplicate`);
    return;
  }
  handledSquareOrders.add(squareOrderId);

  let printifyOrderId;
  try {
    // Read back the sticky notes /create-checkout attached to this order, and
    // the shipping address Square collected.
    const order = await square.getOrder(squareOrderId);
    const item = order.line_items?.find((lineItem) => lineItem.metadata?.printify_variant_id);
    if (!item) {
      // Payments from your Square account that didn't come from
      // /create-checkout (e.g. an in-person sale at an art fair) land here.
      console.log(`[webhook] Square order ${squareOrderId} has no print notes, so it isn't an online print sale`);
      return;
    }

    const address = shippingAddressFromSquare(order, payment);
    const missingFields = REQUIRED_ADDRESS_FIELDS.filter((field) => !address[field]);
    if (missingFields.length > 0) {
      // Square sends more than one message per payment, and the address can
      // arrive a moment after the first one. Throwing here lets a later
      // message try again (see the catch below).
      throw new Error(`shipping address is missing ${missingFields.join(', ')}`);
    }
    if (!SHIPPING_COUNTRIES.includes(address.country)) {
      // Square's page can't limit countries, so this is checked after payment.
      console.error(
        `[webhook] ACTION NEEDED for Square order ${squareOrderId}: the customer paid with an address in ` +
          `country "${address.country}", but we only ship to ${SHIPPING_COUNTRIES.join(', ')}. ` +
          'Refund them in the Square Dashboard.',
      );
      return;
    }

    const created = await printify.createOrder({
      productId: item.metadata.printify_product_id,
      variantId: item.metadata.printify_variant_id,
      quantity: Number(item.quantity),
      address,
      externalId: squareOrderId,
      label: `Square ${squareOrderId}`,
      // Real customers get a shipping email with tracking from Printify.
      sendShippingNotification: true,
    });
    printifyOrderId = created.id;
    console.log(`[webhook] paid! Created Printify order ${printifyOrderId} for Square order ${squareOrderId}`);

    if (squareEnvironment === 'sandbox') {
      // Square's sandbox uses fake money, but Printify has no sandbox: this
      // is a REAL Printify order. Cancel it so a practice purchase never prints.
      console.log('[webhook] sandbox mode: canceling the Printify order so nothing prints');
      await printify.cancelWhenReady(printifyOrderId);
    } else {
      // Live mode: the order waits in Printify as "on-hold" because your
      // store uses manual approval. Approve it in Printify to print and ship.
      // To skip that step later, call Printify's send_to_production endpoint here.
      console.log(`[webhook] Printify order ${printifyOrderId} is waiting for your approval in Printify`);
    }
  } catch (err) {
    if (!printifyOrderId) {
      // Nothing reached Printify, so allow a later retry to try again.
      handledSquareOrders.delete(squareOrderId);
    }
    console.error(
      `[webhook] ACTION NEEDED for Square order ${squareOrderId}` +
        (printifyOrderId ? ` (Printify order ${printifyOrderId})` : '') +
        `: ${err.message.replace(/\.$/, '')}. Check this order by hand in Square and Printify.`,
    );
  }
}

// ---------------------------------------------------------------------------
// POST /test-printify-order
// Proves the server can talk to Printify, without printing or paying for anything.
//
// What it does:
//   1. Creates an order in Printify from the JSON you send.
//   2. Waits until Printify has finished setting it up (up to 60 seconds).
//   3. Cancels it immediately, so it can never go to production.
// You'll see the canceled order in your Printify dashboard as proof it worked.
// ---------------------------------------------------------------------------
app.post('/test-printify-order', requireAdmin, async (req, res) => {
  const { product_id, variant_id, quantity = 1, address_to } = req.body || {};

  if (!product_id || !variant_id || !address_to) {
    return res.status(400).json({
      error: 'Send JSON with product_id, variant_id, and address_to. See test-order.example.json.',
    });
  }

  let orderId;
  try {
    const created = await printify.createOrder({
      productId: product_id,
      variantId: variant_id,
      quantity,
      address: address_to,
      externalId: `test-${Date.now()}`,
      label: 'TEST ORDER - auto-canceled',
    });
    orderId = created.id;
    console.log(`[test-order] created Printify order ${orderId}`);

    const statusBeforeCancel = await printify.cancelWhenReady(orderId);

    res.json({
      ok: true,
      message: 'Printify connection works. A test order was created and then canceled.',
      printify_order_id: orderId,
      status_before_cancel: statusBeforeCancel,
    });
  } catch (err) {
    console.error('[test-order] failed:', err.message);

    // If the order was created but the cancel failed, say so loudly, because
    // that order is still live in your shop and needs canceling by hand.
    const warning = orderId
      ? `Order ${orderId} WAS created but could not be canceled automatically. Cancel it in the Printify dashboard now.`
      : undefined;

    res.status(err.status || 500).json({
      ok: false,
      error: err.message,
      printify_details: err.details,
      warning,
    });
  }
});

app.listen(PORT, () => {
  console.log(`deeprodraws-server listening on port ${PORT}`);
  console.log(`Square mode: ${squareEnvironment}${squareEnvironment === 'sandbox' ? ' (test cards, fake money)' : ' (REAL MONEY)'}`);
  if (!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || !process.env.SQUARE_WEBHOOK_URL) {
    console.warn('SQUARE_WEBHOOK_SIGNATURE_KEY or SQUARE_WEBHOOK_URL is not set, so /square-webhook will refuse events.');
  }
});
