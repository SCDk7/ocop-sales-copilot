const fs = require('fs');
const testContent = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = testContent.split('\n');
console.log('Total lines in province-filter-sync.test.js:', lines.length);
// print test names
lines.forEach((l, i) => {
  if (l.includes('test(') || l.includes('assert.')) {
    if (l.includes('test(')) console.log(`L${i+1}: ${l}`);
  }
});

