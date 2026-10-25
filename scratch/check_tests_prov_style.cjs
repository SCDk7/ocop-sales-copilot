const fs = require('fs');
const files = fs.readdirSync('.');
const testFiles = files.filter(f => f.endsWith('.test.js') || f.endsWith('.test.cjs'));
testFiles.forEach(tf => {
    const content = fs.readFileSync(tf, 'utf8');
    if (/getProvinceStyle|165b46|d4af37|provinceBoundaryLayer/i.test(content)) {
        console.log(`Match in ${tf}`);
    }
});
console.log('Checked test files for province style.');

