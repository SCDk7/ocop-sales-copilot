const fs = require('fs');
const transcriptPath = 'C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
const lastObj = JSON.parse(lines[lines.length - 1]);
console.log('Type:', lastObj.type);
console.log('Content length:', lastObj.content ? lastObj.content.length : 0);
console.log('Last 200 chars:\n', lastObj.content ? lastObj.content.slice(-200) : '');

