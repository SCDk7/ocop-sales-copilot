const fs = require('fs');
const files = fs.readdirSync('.');
const testFiles = files.filter(f => f.endsWith('.test.js') || f.endsWith('.test.cjs'));
testFiles.forEach(tf => {
    const content = fs.readFileSync(tf, 'utf8');
    if (/chat-verification|chat-greeting|chat-guidance|chat-disclaimer/i.test(content)) {
        console.log(`Match in ${tf}`);
    }
});
console.log('Checked all test files.');

