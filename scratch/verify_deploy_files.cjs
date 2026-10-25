const fs = require('fs');
const crypto = require('crypto');

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

console.log('css root == deploy:', hash('ocop-emerald-final.css') === hash('.deploy-update/ocop-emerald-final.css'));
console.log('js root == deploy: ', hash('ocop-emerald-final.js') === hash('.deploy-update/ocop-emerald-final.js'));

