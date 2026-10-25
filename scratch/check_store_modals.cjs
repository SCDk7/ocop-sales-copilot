const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('id="ocop-store-modal"') || l.includes('id="ocop-all-stores-modal"') || l.includes('id="stores-directory-modal"') || l.includes('openStoreLocator') || l.includes('openAllStoresModal')) {
    console.log((i+1) + ': ' + l.slice(0, 120));
  }
});

