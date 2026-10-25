const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('function sendAIMessage') || l.includes('function handleChatSubmit') || l.includes('function sendAIMessageExtended')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

