const fs = require('fs');
const content = fs.readFileSync('scratch/user_prompt_full_10207.txt', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
console.log(lines.slice(70, 150).join('\n'));

