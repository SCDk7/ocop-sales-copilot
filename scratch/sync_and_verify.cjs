const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const indexHtml = path.join(baseDir, 'index.html');
const index2Html = path.join(baseDir, 'index_2.html');
const deployIndexHtml = path.join(baseDir, '.deploy-update', 'index.html');

// 1. Sync index.html to index_2.html and .deploy-update/index.html
fs.copyFileSync(indexHtml, index2Html);
fs.copyFileSync(indexHtml, deployIndexHtml);
console.log('✓ Synced index.html to index_2.html and .deploy-update/index.html');

// 2. Sync skytech files to .deploy-update/
const skyCss = path.join(baseDir, 'skytech-complete.css');
const skyJs = path.join(baseDir, 'skytech-complete.js');
const deploySkyCss = path.join(baseDir, '.deploy-update', 'skytech-complete.css');
const deploySkyJs = path.join(baseDir, '.deploy-update', 'skytech-complete.js');

if (fs.existsSync(skyCss)) fs.copyFileSync(skyCss, deploySkyCss);
if (fs.existsSync(skyJs)) fs.copyFileSync(skyJs, deploySkyJs);
console.log('✓ Synced skytech-complete.* to .deploy-update/');

// 3. Verify SHA256 hashes of all 3 HTML files
function sha256(filePath) {
    const data = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
}

const hashIndex = sha256(indexHtml);
const hashIndex2 = sha256(index2Html);
const hashDeploy = sha256(deployIndexHtml);

console.log('index.html:                ', hashIndex);
console.log('index_2.html:              ', hashIndex2);
console.log('.deploy-update/index.html: ', hashDeploy);

if (hashIndex === hashIndex2 && hashIndex === hashDeploy) {
    console.log('✅ ALL 3 HTML MIRRORS MATCH 100% (IDENTICAL SHA-256)!');
} else {
    console.error('❌ MISMATCH in HTML hashes!');
    process.exit(1);
}

