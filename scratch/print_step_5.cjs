const fs = require('fs');
const content = fs.readFileSync('scratch/user_prompt_9_10169.txt', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('BƯỚC 5') || lines[i].includes('PIN') || lines[i].includes('2007')) {
    console.log(lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 35)).join('\n'));
    break;
  }
}

