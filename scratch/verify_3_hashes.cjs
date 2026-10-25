const fs = require('fs');
const crypto = require('crypto');

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const h1 = hash('index.html');
const h2 = hash('index_2.html');
const h3 = hash('.deploy-update/index.html');

console.log('index.html:                ', h1);
console.log('index_2.html:              ', h2);
console.log('.deploy-update/index.html: ', h3);
console.log('All 3 hashes identical?    ', h1 === h2 && h2 === h3);

