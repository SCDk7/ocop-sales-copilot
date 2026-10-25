const fs = require('fs');
const files = fs.readdirSync('.');
const testFiles = files.filter(f => f.endsWith('.test.js') || f.endsWith('.test.cjs'));
testFiles.forEach(tf => {
    const content = fs.readFileSync(tf, 'utf8');
    if (/sim-volume|sim-cogs|sim-chm|sim-bar/i.test(content)) {
        console.log(`Match ${tf}`);
    }
});
console.log('Done checking slider tests.');

