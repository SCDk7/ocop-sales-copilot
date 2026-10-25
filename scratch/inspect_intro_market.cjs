const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('id="ocop-intro-overlay"') || lines[i].includes('enterOcopMarket(')) {
    console.log(`Line ${i + 1}: ${lines[i]}`);
  }
}

