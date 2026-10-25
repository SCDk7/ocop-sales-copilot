const fs = require('fs');
const transcriptPath = 'C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
  const obj = JSON.parse(lines[i]);
  if (obj.type === 'USER_INPUT') {
    console.log('Found user input at line', i, 'content length:', obj.content.length);
    console.log('Last 300 chars of user input:\n', obj.content.slice(-300));
    break;
  }
}

