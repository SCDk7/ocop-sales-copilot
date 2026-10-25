const fs = require('fs');
const css = fs.readFileSync('ocop-sales-copilot/skytech-complete.css', 'utf8');
const lines = css.split('\n');
console.log(lines.slice(290, 340).map((l, i) => (291 + i) + ': ' + l).join('\n'));

