const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const pos = 396222;
console.log(html.slice(pos - 100, pos + 3500));

