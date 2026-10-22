// Prints every product in your shop with its variant IDs, so you can pick the
// product_id and variant_id for a test order. Run with: npm run products

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const { listProducts } = require('../printify');

listProducts()
  .then((products) => {
    if (products.length === 0) {
      console.log('No products in this shop yet. Create one in Printify first.');
      return;
    }
    for (const product of products) {
      console.log(`\n${product.title}`);
      console.log(`  product_id: ${product.id}`);
      for (const variant of product.variants) {
        const price = (variant.price / 100).toFixed(2);
        console.log(`    variant_id: ${variant.id}  ${variant.title}  $${price}`);
      }
    }
  })
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
