const fs = require('fs');
const crypto = require('crypto');

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

console.log('index.html == .deploy-update/index.html:            ', hash('index.html') === hash('.deploy-update/index.html'));
console.log('index.html == index_2.html:                         ', hash('index.html') === hash('index_2.html'));
console.log('css root == .deploy-update/css:                     ', hash('ocop-ultimate-production.css') === hash('.deploy-update/ocop-ultimate-production.css'));
console.log('js root == .deploy-update/js:                       ', hash('ocop-ultimate-production.js') === hash('.deploy-update/ocop-ultimate-production.js'));

