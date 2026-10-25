const fs = require('fs');

const transcriptPath = 'C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript.jsonl';
const fullTranscriptPath = 'C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript_full.jsonl';

const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
  try {
    const obj = JSON.parse(lines[i]);
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('EMERALD J2TEAM')) {
      console.log(`Found at line ${i}`);
      if (obj.truncated_fields && obj.truncated_fields.includes('content')) {
        const fullLines = fs.readFileSync(fullTranscriptPath, 'utf8').trim().split('\n');
        const fullObj = JSON.parse(fullLines[i]);
        fs.writeFileSync('scratch/prompt_10_full.txt', fullObj.content, 'utf8');
      } else {
        fs.writeFileSync('scratch/prompt_10_full.txt', obj.content, 'utf8');
      }
      console.log('Saved to scratch/prompt_10_full.txt, length:', fs.statSync('scratch/prompt_10_full.txt').size);
      break;
    }
  } catch (e) {}
}

