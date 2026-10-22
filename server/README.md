# deeprodraws-server

A small Express backend that lets the static deeprodraws.com site sell prints
fulfilled by Printify. This stage covers the server foundation and the
Printify connection only. Payments come next.

## What's in here

| File | What it does |
| --- | --- |
| `index.js` | The Express server: health check, CORS, admin check, test-order route. |
| `printify.js` | Every call to Printify's API. Nothing else talks to Printify directly. |
| `scripts/list-shops.js` | `npm run shops` prints your Printify shops, to find your shop ID. |
| `scripts/list-products.js` | `npm run products` prints products and variant IDs. |
| `.env.example` | The names of the secrets the server needs, with no values. |
| `test-order.example.json` | A template for the test order request. |

## Environment variables

| Name | Where to get it |
| --- | --- |
| `PRINTIFY_API_KEY` | Printify > Account > Connections > Generate token |
| `PRINTIFY_SHOP_ID` | Run `npm run shops` (needs only the API key) |
| `ADMIN_TOKEN` | Make one up: a long random string. It protects the test route. |

Locally these go in `.env` (git ignores it). On Render they go in the
dashboard. They are never written in the code.

## Before your first test: turn off auto-approval

Printify has no test mode. New stores **automatically send API orders to
production 24 hours after they're created**, which means printing and charging
your card. In Printify, open your API store's settings, find **Order approval**,
and set it to **Manual**.

The test route also cancels its order right away, so this is a second safety net.

## Run it locally

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the values, then:

```bash
npm run dev
```

`npm run dev` restarts the server whenever you save a file. Check it's up at
http://localhost:3001 (you should see `ok`).

## Find your product and variant IDs

```bash
npm run products
```

Copy one `product_id` and one `variant_id` from the output.

## Test the Printify connection

1. Copy `test-order.example.json` to `test-order.json` (git ignores it).
2. Paste in your `product_id` and `variant_id`, and use a real shipping address
   (yours is fine). Printify validates the address, but nothing ships.
3. With the server running, send it (replace `YOUR_ADMIN_TOKEN`):

```bash
curl -X POST http://localhost:3001/test-printify-order -H "Content-Type: application/json" -H "x-admin-token: YOUR_ADMIN_TOKEN" --data @test-order.json
```

In PowerShell, type `curl.exe` instead of `curl`.

A working connection replies with `"ok": true` and a `printify_order_id`. The
order appears in your Printify dashboard as **canceled**. If something fails,
the reply and the server's log both show Printify's exact error.

## Deploy to Render

1. Push this repo to GitHub.
2. In Render: **New > Web Service**, and connect the `deeprodraws.github.io` repo.
3. Settings:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Under **Environment**, add `PRINTIFY_API_KEY`, `PRINTIFY_SHOP_ID`, and `ADMIN_TOKEN`.
5. Optional: under **Advanced**, set **Health Check Path** to `/`.
6. Deploy. When it's live, open `https://YOUR-SERVICE.onrender.com/` and look for `ok`.

Because the root directory is `server`, Render only redeploys when files in
`server/` change, not on every website edit.

Then run the same test against Render:

```bash
curl -X POST https://YOUR-SERVICE.onrender.com/test-printify-order -H "Content-Type: application/json" -H "x-admin-token: YOUR_ADMIN_TOKEN" --data @test-order.json
```

## Free tier: keep-alive

Render's free tier spins the server down after 15 minutes without traffic, and
the next request waits 30 to 60 seconds for it to wake. Before customers use it,
set up a keep-alive ping (cron-job.org or UptimeRobot) that hits `GET /` every
10 to 14 minutes. One always-on free service fits in Render's 750 free hours a month.

## CORS, briefly

The server only accepts browser requests from `https://deeprodraws.com` and
`https://www.deeprodraws.com`. CORS only restricts browsers, though. Tools like
curl ignore it, which is why the test route also requires `x-admin-token`.
