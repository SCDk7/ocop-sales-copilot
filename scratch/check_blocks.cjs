const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');

function getBlock(startStr, endStr) {
  const startIdx = html.indexOf(startStr);
  if (startIdx === -1) return 'NOT FOUND: ' + startStr;
  const endIdx = html.indexOf(endStr, startIdx);
  if (endIdx === -1) return 'NOT FOUND: ' + endStr;
  return html.slice(startIdx, endIdx);
}

console.log('--- BLOCK 1: TOP BAR ---');
console.log(getBlock('<!-- 1. TOP ANNOUNCEMENT BAR -->', '<!-- 2. HEADER: SINGLE STICKY OCOP AI HUB -->'));

console.log('--- BLOCK 2: HEADER ---');
console.log(getBlock('<!-- 2. HEADER: SINGLE STICKY OCOP AI HUB -->', '<main class="flex-1"'));

console.log('--- BLOCK 3: HERO ---');
console.log(getBlock('<!-- 3. HERO BANNER SECTION -->', '</section>'));

