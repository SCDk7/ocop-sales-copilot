const fs = require('fs');
const readline = require('readline');

async function getLine(filePath, targetLine) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  let idx = 0;
  for await (const line of rl) {
    if (idx === targetLine) {
      return line;
    }
    idx++;
  }
  return null;
}

async function run() {
  const line = await getLine('C:/Users/Thanh Binh/.gemini/antigravity/brain/f15559b8-9767-466f-9539-efcd898a4361/.system_generated/logs/transcript_full.jsonl', 10207);
  if (line) {
    const obj = JSON.parse(line);
    console.log('Got obj, content length:', obj.content ? obj.content.length : 0);
    fs.writeFileSync('scratch/prompt_10_full_raw.txt', obj.content, 'utf8');
  } else {
    console.log('Line not found');
  }
}

run();

