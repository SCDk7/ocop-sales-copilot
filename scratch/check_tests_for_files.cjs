const fs = require('fs');
const testContent = fs.readFileSync('province-filter-sync.test.js', 'utf8');

const files = [
  'sualoiclick', 'SuaLoiKoClick', 'toiuu', 'AI tot hon', 'style1.css', 'style3.css', 'styledangcap.css',
  'final-perfect', 'ocop-emerald-final', 'ocop-ultimate-production'
];

files.forEach(f => {
  if (testContent.includes(f)) {
    console.log('Found in test:', f);
  }
});
console.log('Done checking testContent');

