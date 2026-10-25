const fs = require('fs');
const crypto = require('crypto');

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

console.log('index.html hash:             ', hash('index.html'));
console.log('index.backup-safe.html hash: ', hash('index.backup-safe.html'));

