// Copies your products, sizes, and prices from Printify into catalog.json,
// and prints a list of what changed so you can review it before pushing.
//
// Usage:
//   npm run sync-products              (update catalog.json)
//   npm run sync-products -- --dry-run (only show what WOULD change)
//
// What it keeps from your existing catalog.json: each print's "id", "title",
// and "forSale", matched by Printify product ID. Everything else (sizes,
// prices, variant IDs) comes fresh from Printify.

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const { listProducts } = require('../printify');
const { SIZE_KEYS } = require('../products');

const CATALOG_PATH = path.join(__dirname, '..', 'catalog.json');
const dryRun = process.argv.includes('--dry-run');

// Turns a Printify variant title like '14″ x 11″ (Horizontal) / Matte' into
// our size key ("11x14") and a label for the checkout page ('14×11" (horizontal)').
// The key always puts the smaller number first, so 7x5 and 5x7 are the same size.
function parseSize(variantTitle) {
  const dimensions = variantTitle.split('/')[0];
  const match = dimensions.match(/(\d+)\D+(\d+)/);
  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);
  const horizontal = width > height;
  return {
    key: `${Math.min(width, height)}x${Math.max(width, height)}`,
    label: `${width}×${height}"${horizontal ? ' (horizontal)' : ''}`,
  };
}

// 'Dog Drawing Charcoal Print | Archival Matte Wall Art' -> 'Dog'.
// Only used for brand-new products; you can rename them in catalog.json.
function shortTitle(printifyTitle) {
  const filler = new Set(['charcoal', 'drawing', 'print']);
  return printifyTitle
    .split('|')[0]
    .split(/\s+/)
    .filter((word) => word && !filler.has(word.toLowerCase()))
    .join(' ');
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

async function main() {
  const oldCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const oldByProductId = new Map(oldCatalog.map((print) => [print.printifyProductId, print]));
  const usedIds = new Set(oldCatalog.map((print) => print.id));

  const products = await listProducts();
  const changes = [];
  const warnings = [];

  const newCatalog = products.map((product) => {
    const old = oldByProductId.get(product.id);

    const sizes = {};
    for (const variant of product.variants) {
      const size = parseSize(variant.title);
      if (!size || !SIZE_KEYS.includes(size.key)) continue;
      sizes[size.key] = { label: size.label, priceCents: variant.price, printifyVariantId: variant.id };
    }
    // Keep sizes in the store's order (5x7, 8x10, 11x14).
    const orderedSizes = {};
    for (const key of SIZE_KEYS) if (sizes[key]) orderedSizes[key] = sizes[key];

    let entry;
    if (old) {
      entry = { id: old.id, title: old.title, forSale: old.forSale, printifyProductId: product.id, sizes: orderedSizes };
    } else {
      const title = shortTitle(product.title);
      let id = slugify(title);
      for (let n = 2; usedIds.has(id); n++) id = `${slugify(title)}-${n}`;
      usedIds.add(id);
      entry = { id, title, forSale: true, printifyProductId: product.id, sizes: orderedSizes };
      changes.push(`+ NEW: "${title}" (id "${id}"), now for sale`);
    }

    // Describe what changed for this print, size by size.
    for (const key of SIZE_KEYS) {
      const before = old?.sizes?.[key];
      const after = orderedSizes[key];
      if (old && before && !after) changes.push(`- ${entry.title} ${key}: no longer in Printify`);
      if (old && !before && after) changes.push(`+ ${entry.title} ${key}: added at ${money(after.priceCents)}`);
      if (before && after && before.priceCents !== after.priceCents) {
        changes.push(`~ ${entry.title} ${key}: ${money(before.priceCents)} -> ${money(after.priceCents)}`);
      }
      if (before && after && before.printifyVariantId !== after.printifyVariantId) {
        changes.push(`~ ${entry.title} ${key}: Printify variant changed`);
      }
    }
    if (Object.keys(orderedSizes).length === 0) {
      warnings.push(`"${entry.title}" has none of the store's sizes (${SIZE_KEYS.join(', ')}), so it can't be sold.`);
    }

    return entry;
  });

  // Prints that were in catalog.json but are gone from Printify.
  const currentIds = new Set(products.map((product) => product.id));
  for (const print of oldCatalog) {
    if (!currentIds.has(print.printifyProductId)) changes.push(`- REMOVED: "${print.title}" is no longer in Printify`);
  }

  // Keep the old order, with new prints at the end, so the review is easy to read.
  const position = new Map(oldCatalog.map((print, i) => [print.printifyProductId, i]));
  newCatalog.sort((a, b) => (position.get(a.printifyProductId) ?? Infinity) - (position.get(b.printifyProductId) ?? Infinity));

  if (changes.length === 0) {
    console.log('No changes. catalog.json already matches Printify.');
  } else {
    console.log('Changes from Printify:');
    for (const line of changes) console.log(`  ${line}`);
  }
  for (const line of warnings) console.log(`  WARNING: ${line}`);

  if (dryRun) {
    console.log('\nDry run: catalog.json was not changed.');
    return;
  }
  if (changes.length === 0) return;

  fs.writeFileSync(CATALOG_PATH, `${JSON.stringify(newCatalog, null, 2)}\n`);
  console.log('\ncatalog.json updated. Review it, then commit and push to put it live.');
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
