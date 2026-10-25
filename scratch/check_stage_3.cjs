const fs = require('fs');
const transcriptPath = 'C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript_full.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
const obj = JSON.parse(lines[10438]);
const userReq = obj.content;
const idx = userReq.indexOf('GIAI ĐOẠN 3');
console.log(userReq.slice(idx));

