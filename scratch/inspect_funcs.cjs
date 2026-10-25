const fs = require('fs');
const code = fs.readFileSync('final-perfect.js', 'utf8');

function extractFunc(name) {
  const idx = code.indexOf(name);
  if (idx === -1) return 'NOT FOUND: ' + name;
  return code.slice(idx, idx + 1200);
}

console.log('--- promptAdminPinModal ---');
console.log(extractFunc('promptAdminPinModal'));
console.log('--- enrichWebmasterRevenueData ---');
console.log(extractFunc('enrichWebmasterRevenueData'));

