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
// written by `npm run sync-products` (it copies them from Printify). Change
// titles and prices in Printify, then sync; edits made in catalog.json get
// replaced. Two things you CAN edit there, and syncs keep them: a print's
// "id" (its name in website links) and "forSale" (false stops selling it).

const catalog = require('./catalog.json');

const CURRENCY = 'USD';

// Shipping is free (it's built into each print's price), so we only ship to
// countries where that price covers Printify's shipping cost.
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
  SHIPPING_COUNTRIES,
  SIZE_KEYS,
  PRINTS,
  findPrintSize,
};
