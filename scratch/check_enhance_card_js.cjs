const fs = require('fs');
const js = fs.readFileSync('skytech-complete.js', 'utf8');

const idx = js.indexOf('function enhanceProductCardElements');
console.log(js.slice(idx, idx + 1500));

