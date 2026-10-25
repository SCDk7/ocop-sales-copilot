const fs = require('fs');
if (fs.existsSync('ocop-copilot.test.js')) {
    const content = fs.readFileSync('ocop-copilot.test.js', 'utf8');
    console.log(content.slice(0, 1000));
} else {
    console.log('ocop-copilot.test.js not found in root');
}

