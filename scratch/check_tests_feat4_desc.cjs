const fs = require('fs');
const files = fs.readdirSync('.');
const testFiles = files.filter(f => f.endsWith('.test.js') || f.endsWith('.test.cjs'));
testFiles.forEach(tf => {
    const content = fs.readFileSync(tf, 'utf8');
    if (/Tự động hóa tính toán doanh thu|i18n-hero-feat4-desc/i.test(content)) {
        console.log(`Match in ${tf}`);
    }
});
console.log('Checked test files for feat4 desc.');

