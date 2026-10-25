const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.test.js'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  ['partner-registration', 'reg-store-name', 'reg-store', 'simulateOcrScan', 'ocr-dropzone'].forEach(term => {
    if (content.includes(term)) {
      console.log(`Found "${term}" in ${f}`);
    }
  });
});
console.log('Search complete.');

