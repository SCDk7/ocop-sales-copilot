const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('id="ai-chat-window"') || l.includes('id="ai-chat-toggle-btn"') || l.includes('ocop-copilot.js')) {
    console.log((i+1) + ': ' + l.slice(0, 120));
  }
});

