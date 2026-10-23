// Pretends to be Square and sends your server a signed "payment completed"
// webhook, so you can test /square-webhook on your laptop (Square itself
// can't reach "localhost"). Sandbox only.
//
// Usage (with the server running in another window):
//   npm run test-webhook -- SQUARE_ORDER_ID
//   npm run test-webhook -- SQUARE_ORDER_ID --bad-signature
//
// Get a SQUARE_ORDER_ID by calling /create-checkout first. The second form
// sends a forged signature, to show the server rejecting it.

const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const [squareOrderId, flag] = process.argv.slice(2);
const forge = flag === '--bad-signature';

async function main() {
  if (!squareOrderId) {
    throw new Error('Pass a Square order ID: npm run test-webhook -- SQUARE_ORDER_ID');
  }
  if (process.env.SQUARE_ENVIRONMENT !== 'sandbox') {
    throw new Error('This script only runs when SQUARE_ENVIRONMENT=sandbox.');
  }

  const url = process.env.SQUARE_WEBHOOK_URL;
  const key = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!url || !key) {
    throw new Error('Set SQUARE_WEBHOOK_URL and SQUARE_WEBHOOK_SIGNATURE_KEY in .env first.');
  }

  // The same shape Square sends for a completed payment, trimmed to the
  // fields the server reads.
  const body = JSON.stringify({
    type: 'payment.updated',
    event_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    data: {
      type: 'payment',
      object: {
        payment: {
          id: `TEST_PAYMENT_${Date.now()}`,
          order_id: squareOrderId,
          status: 'COMPLETED',
          // A stand-in address. If you actually paid on the sandbox checkout
          // page, the server uses the real address Square saved instead.
          buyer_email_address: 'test@example.com',
          shipping_address: {
            first_name: 'Test',
            last_name: 'Buyer',
            address_line_1: '123 Example St',
            locality: 'Belmont',
            administrative_district_level_1: 'CA',
            postal_code: '94002',
            country: 'US',
          },
        },
      },
    },
  });

  // Sign it exactly the way Square does: HMAC-SHA256 of (URL + body), using
  // the shared secret key, written in base64.
  const signature = forge
    ? 'this-is-a-forged-signature'
    : crypto.createHmac('sha256', key).update(url + body).digest('base64');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-square-hmacsha256-signature': signature },
    body,
  });

  console.log(`Sent ${forge ? 'a FORGED' : 'a signed'} webhook to ${url}`);
  console.log(`Server answered: ${response.status} ${response.statusText}`);
  console.log('Watch the server window to see what it did next.');
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
