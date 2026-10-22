// Prints the shops on your Printify account, so you can copy the right ID
// into PRINTIFY_SHOP_ID. Run with: npm run shops
// Only needs PRINTIFY_API_KEY in your .env.

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const { listShops } = require('../printify');

listShops()
  .then((shops) => {
    if (shops.length === 0) {
      console.log('No shops found. In Printify, go to My Stores > Add new store > API.');
      return;
    }
    for (const shop of shops) {
      console.log(`${shop.id}  ${shop.title}  (sales channel: ${shop.sales_channel})`);
    }
    console.log('\nUse the ID of the API store your print products live in. Ignore any marked "disconnected".');
  })
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  });
