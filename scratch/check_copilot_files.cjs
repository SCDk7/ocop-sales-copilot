const fs = require('fs');
const files = fs.readdirSync('ocop-sales-copilot');
files.filter(f => f.includes('copilot') || f.includes('chat') || f.includes('ai-')).forEach(f => console.log(f));

