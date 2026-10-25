const fs = require('fs');
const css = fs.readFileSync('ocop-sales-copilot/skytech-complete.css', 'utf8');
const lines = css.split('\n');
console.log(lines.slice(750).map((l, i) => (751 + i) + ': ' + l).join('\n'));

