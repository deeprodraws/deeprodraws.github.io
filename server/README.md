# deeprodraws-server

A small Express backend that lets the static deeprodraws.com site sell prints.
Customers pay through Square's hosted checkout, and paid orders are sent to
Printify to print and ship.

## How a sale works

1. The website calls `POST /create-checkout` with a print id, size, quantity, and shipping address.
2. The server looks up the real price in `products.js` and asks Square for a checkout page.
3. The website sends the customer to that page, and they pay on Square's site.
4. Square calls `POST /square-webhook` to say the payment completed.
5. The server checks the message's signature, then places the Printify order.

## What's in here

| File | What it does |
| --- | --- |
| `index.js` | The Express server and all routes. |
| `products.js` | Store settings (shipping, sizes) and price lookup. |
| `catalog.json` | Prints, sizes, prices, and Printify IDs. Written by `npm run sync-products`. |
| `square.js` | Every call to Square, plus the webhook signature check. |
| `printify.js` | Every call to Printify. |
| `scripts/list-shops.js` | `npm run shops` prints your Printify shops. |
| `scripts/list-products.js` | `npm run products` prints Printify product and variant IDs. |
| `scripts/sync-products.js` | `npm run sync-products` copies products and prices from Printify. |
| `scripts/send-test-webhook.js` | `npm run test-webhook` fakes a signed Square webhook, for local testing. |
| `.env.example` | The names of all the secrets, with no values. |

## Routes

| Route | Who calls it | What it does |
| --- | --- | --- |
| `GET /` | You, Render, keep-alive ping | Replies `ok`. |
| `POST /create-checkout` | The website | Returns a Square checkout URL. |
| `POST /square-webhook` | Square | Places the Printify order once a payment completes. |
| `POST /test-printify-order` | You (needs `x-admin-token`) | Creates and cancels a Printify order. |

## Environment variables

| Name | Where to get it |
| --- | --- |
| `PRINTIFY_API_KEY` | Printify > Account > Connections > Generate token |
| `PRINTIFY_SHOP_ID` | `npm run shops` |
| `ADMIN_TOKEN` | Make one up (long and random). Protects the test route. |
| `SQUARE_ENVIRONMENT` | `sandbox` while testing, `production` when live |
| `SQUARE_ACCESS_TOKEN` | Square Developer Console > your app > Credentials |
| `SQUARE_LOCATION_ID` | Square Developer Console > your app > Locations |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square Developer Console > Webhooks > your subscription |
| `SQUARE_WEBHOOK_URL` | The exact URL your webhook subscription points at |

Sandbox and production have **different** access tokens, location IDs, and
webhook subscriptions. Always use a matching set.

## Update prints and prices

Prices and products come from Printify. After changing anything there:

```bash
npm run sync-products -- --dry-run
```

This lists what changed (new prints, removed prints, price changes) without
touching anything. If it looks right, run it for real:

```bash
npm run sync-products
```

That rewrites `catalog.json`. Commit and push it to put the new prices live.

In `catalog.json` you can edit a print's `id`, `title`, or `forSale`
(`false` stops selling it), and syncs keep your edits. Don't edit prices
there, because the next sync replaces them with Printify's. Only sizes
5×7, 8×10, and 11×14 are sold (`SIZE_KEYS` in `products.js`). The flat
shipping fee is `SHIPPING_FEE_CENTS` in `products.js`.

## Printify safety

Printify has no test mode. Keep your store's **Order approval** set to
**Manual**. While `SQUARE_ENVIRONMENT=sandbox`, the webhook also cancels every
Printify order it creates, so practice purchases never print.

## Test locally (sandbox)

Start the server:

```bash
npm run dev
```

The second line of the log says `Square mode: sandbox`. In another window,
copy `checkout-request.example.json` to `checkout-request.json`, fill in a
print, size, and address, and send it:

```bash
curl -X POST http://localhost:3001/create-checkout -H "Content-Type: application/json" --data @checkout-request.json
```

In PowerShell, type `curl.exe` instead of `curl`, and keep the `@` filename in quotes.

The reply has a `checkout_url` and a `square_order_id`. Open the URL to see
Square's checkout with your price and shipping, and pay with Square's sandbox
test card: `4111 1111 1111 1111`, any future date, CVV `111`.

Square can't send webhooks to your laptop, so fake one instead. In `.env`, set
`SQUARE_WEBHOOK_URL=http://localhost:3001/square-webhook` and any made-up
`SQUARE_WEBHOOK_SIGNATURE_KEY`, then:

```bash
npm run test-webhook -- SQUARE_ORDER_ID
```

To see the server reject a forged message:

```bash
npm run test-webhook -- SQUARE_ORDER_ID --bad-signature
```

## Deploy to Render

The service already exists. Add the five Square variables under **Environment**.
Then in the Square Developer Console, under **Webhooks**, add a sandbox
subscription:

- **URL:** `https://YOUR-SERVICE.onrender.com/square-webhook`
- **Events:** `payment.created` and `payment.updated`

Copy its **signature key** into Render as `SQUARE_WEBHOOK_SIGNATURE_KEY`, and
the same URL as `SQUARE_WEBHOOK_URL`. Then create a checkout against the
Render URL, pay with the test card, and watch Render's **Logs** tab.

## Going live

1. In Square, create a **production** webhook subscription with the same URL and events.
2. In Render, switch all five Square variables to their production values,
   including `SQUARE_ENVIRONMENT=production`.
3. Paid orders now wait in Printify as on-hold. Approve them there to print and ship.

## Free tier: keep-alive

Render's free tier spins the server down after 15 minutes without traffic.
A sleeping server answers slowly, and Square may give up on a webhook and
retry later. Before launch, set up a keep-alive ping (cron-job.org or
UptimeRobot) that hits `GET /` every 10 to 14 minutes.

## CORS, briefly

The server only accepts browser requests from `https://deeprodraws.com` and
`https://www.deeprodraws.com`. CORS only restricts browsers, though. Tools like
curl ignore it, which is why the test route requires `x-admin-token` and the
webhook requires Square's signature.
