const fs = require('fs');
const crypto = require('crypto');

function sha256(filePath) {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
}

console.log('=== SYNCHRONIZING HTML AND ASSET MIRRORS ===');

// Copy index.html -> index_2.html
fs.copyFileSync('index.html', 'index_2.html');
console.log('✓ Copied index.html -> index_2.html');

// Copy index.html -> .deploy-update/index.html
fs.copyFileSync('index.html', '.deploy-update/index.html');
console.log('✓ Copied index.html -> .deploy-update/index.html');

// Copy skytech-complete.css -> .deploy-update/skytech-complete.css
fs.copyFileSync('skytech-complete.css', '.deploy-update/skytech-complete.css');
console.log('✓ Copied skytech-complete.css -> .deploy-update/skytech-complete.css');

// Copy skytech-complete.js -> .deploy-update/skytech-complete.js
fs.copyFileSync('skytech-complete.js', '.deploy-update/skytech-complete.js');
console.log('✓ Copied skytech-complete.js -> .deploy-update/skytech-complete.js');

// Verify SHA-256 for index files
const hash1 = sha256('index.html');
const hash2 = sha256('index_2.html');
const hash3 = sha256('.deploy-update/index.html');

console.log('index.html SHA-256:              ', hash1);
console.log('index_2.html SHA-256:            ', hash2);
console.log('.deploy-update/index.html SHA-256:', hash3);

if (hash1 === hash2 && hash2 === hash3) {
    console.log('✅ ALL 3 HTML MIRRORS HAVE 100% IDENTICAL SHA-256 HASHES!');
} else {
    console.error('❌ HASH MISMATCH!');
    process.exit(1);
}

