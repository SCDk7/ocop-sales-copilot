const fs = require('fs');
const testContent = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = testContent.split('\n');

const asserts = [];
lines.forEach((l, i) => {
  if (l.includes("assert(html.includes(") || l.includes("assert(")) {
    asserts.push(`L${i+1}: ${l.trim()}`);
  }
});
console.log('Total asserts:', asserts.length);
console.log(asserts.join('\n'));

