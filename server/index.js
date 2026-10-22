// index.js
// The Express server. It sets up the app, defines the routes, and starts
// listening for requests.
//
// RENDER FREE TIER NOTE: free services "spin down" after 15 minutes with no
// traffic. The next request then waits ~30-60 seconds while it wakes up. Once
// the store is live, set up a keep-alive ping (like before, e.g. cron-job.org
// or UptimeRobot) that hits GET / every 10-14 minutes so customers never hit
// a cold start. One always-on free service fits in Render's 750 free hours/month.

// Load variables from a local .env file into process.env. On Render there is
// no .env file; Render injects the variables you set in its dashboard, and
// this line quietly does nothing.
require('dotenv').config({ quiet: true });

const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const printify = require('./printify');

// Fail fast: if a required secret is missing, crash on startup with a clear
// message, instead of starting "fine" and failing on the first real request.
const REQUIRED_ENV = ['PRINTIFY_API_KEY', 'PRINTIFY_SHOP_ID'];
const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing ${missing.join(', ')}. Add them to your .env file (the server never reads .env.example).`);
  process.exit(1);
}

const app = express();

// Render tells us which port to use through the PORT variable. Locally we use
// 3001 so it doesn't collide with the Next.js site running on 3000.
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// CORS (Cross-Origin Resource Sharing)
// Browsers block a web page from calling a server on a different domain
// unless that server says "this domain is allowed". This list is that
// permission: only pages on your site may call this server from a browser.
//
// CORS is NOT security on its own. It only controls browsers. Tools like curl
// ignore it completely, which is why sensitive routes also need a password
// (see requireAdmin below).
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = ['https://deeprodraws.com', 'https://www.deeprodraws.com'];
app.use(cors({ origin: ALLOWED_ORIGINS }));

// Parse JSON request bodies so routes can read them as req.body.
app.use(express.json());

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
// GET /  (health check)
// Lets you, Render, and your keep-alive ping confirm the server is up.
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('ok');
});

// ---------------------------------------------------------------------------
// POST /test-printify-order
// Proves the server can talk to Printify, without printing or paying for anything.
//
// What it does:
//   1. Creates an order in Printify from the JSON you send.
//   2. Waits until Printify has finished setting it up (up to 60 seconds).
//   3. Cancels it immediately, so it can never go to production.
// You'll see the canceled order in your Printify dashboard as proof it worked.
//
// TO SWITCH TO REAL ORDERS LATER (payments stage):
//   - Only create the order AFTER a payment is confirmed (from the payment
//     webhook, never directly from the browser).
//   - Remove the cancel step.
//   - Either leave the store on manual approval and approve orders yourself
//     in Printify, or send them straight to production by calling
//     POST /shops/{shop_id}/orders/{order_id}/send_to_production.json.
//   - Build the address from the customer's checkout instead of req.body.
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
    // Step 1: create the order.
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

    // Step 2: a new order moves through setup stages ("pending", then
    // "cost-calculation", ...) and Printify only allows canceling once it
    // reaches one of the stages below. Check every 2 seconds, for up to 60.
    const CANCELABLE = ['on-hold', 'payment-not-received'];
    let order = await printify.getOrder(orderId);
    for (let tries = 0; !CANCELABLE.includes(order.status) && tries < 30; tries++) {
      console.log(`[test-order] order ${orderId} is "${order.status}", waiting...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      order = await printify.getOrder(orderId);
    }
    console.log(`[test-order] order ${orderId} status before cancel: ${order.status}`);

    // Step 3: cancel it.
    await printify.cancelOrder(orderId);
    console.log(`[test-order] canceled order ${orderId}`);

    res.json({
      ok: true,
      message: 'Printify connection works. A test order was created and then canceled.',
      printify_order_id: orderId,
      status_before_cancel: order.status,
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
});
