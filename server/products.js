// products.js
// The ONE place that decides what you sell and what it costs.
//
// WHY PRICES LIVE HERE, ON THE SERVER, AND NOT ON THE WEBSITE:
// Anything that runs in a customer's browser can be changed by that customer.
// Browsers have built-in developer tools, and in about ten seconds anyone can
// edit the page, or skip the page entirely and send their own request with
// curl. If the website sent "Eagle print, $45" and the server believed it, a
// customer could send "Eagle print, $0.01" instead, and Square would happily
// charge one cent while Printify printed and shipped a $45 print at your cost.
//
// So the website only ever says WHICH print and WHICH size ("eagle", "11x14").
// The server looks the price up here, in a file customers can't touch.
//
// WHERE THE PRICES COME FROM:
// The prints, sizes, prices, and Printify IDs live in catalog.json, which is
// written by `npm run sync-products` (it copies them from Printify). Don't
// edit prices there by hand: the next sync replaces them with Printify's.
// You CAN edit a print's "id", "title", or "forSale" in catalog.json, and
// syncs keep your edits. Set "forSale": false to stop selling a print.

const catalog = require('./catalog.json');

const CURRENCY = 'USD';

// Flat shipping charged once per order, in cents. Change it here and nowhere else.
const SHIPPING_FEE_CENTS = 800;

// Flat shipping only makes sense for one country, so only US addresses are accepted.
const SHIPPING_COUNTRIES = ['US'];

// The only sizes the store sells. The sync skips any other Printify sizes.
const SIZE_KEYS = ['5x7', '8x10', '11x14'];

const PRINTS = catalog.filter((print) => print.forSale !== false);

// Looks up a print and size. Returns null if the print or size doesn't exist,
// or if that size hasn't been fully set up yet.
function findPrintSize(printId, sizeKey) {
  const print = PRINTS.find((p) => p.id === printId);
  if (!print) return null;

  // Object.hasOwn avoids matching built-in names like "constructor".
  if (!Object.hasOwn(print.sizes, sizeKey)) return null;
  const size = print.sizes[sizeKey];

  const ready = Number.isInteger(size.priceCents) && size.priceCents > 0 && print.printifyProductId && size.printifyVariantId;
  if (!ready) return null;

  return { print, size: { ...size, printifyProductId: print.printifyProductId }, sizeKey };
}

module.exports = {
  CURRENCY,
  SHIPPING_FEE_CENTS,
  SHIPPING_COUNTRIES,
  SIZE_KEYS,
  PRINTS,
  findPrintSize,
};
