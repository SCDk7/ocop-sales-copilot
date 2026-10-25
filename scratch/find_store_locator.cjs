const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function openStoreLocator(') || l.includes('window.openStoreLocator')) {
    console.log(`L${i+1}:`);
    console.log(lines.slice(i, i + 30).join('\n'));
  }
});

