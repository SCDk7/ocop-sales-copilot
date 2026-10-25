const fs = require('fs');

const lines = fs.readFileSync('C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript_full.jsonl', 'utf8').trim().split('\n');

for (let i = lines.length - 1; i >= 0; i--) {
  try {
    const obj = JSON.parse(lines[i]);
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('ROYAL COBALT BLUE')) {
      console.log(`Line ${i}, length: ${obj.content.length}`);
      fs.writeFileSync(`scratch/user_prompt_9_${i}.txt`, obj.content, 'utf8');
      break;
    }
  } catch (e) {}
}

