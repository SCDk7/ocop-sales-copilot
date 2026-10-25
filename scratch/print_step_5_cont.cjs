const fs = require('fs');
const content = fs.readFileSync('scratch/user_prompt_9_10169.txt', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(100, 200).join('\n'));

