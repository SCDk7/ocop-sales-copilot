const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('id="chat-toggle"') || l.includes('id="open-chat') || l.includes('openAIChat') || l.includes('chat-widget') || l.includes('ai-chat-bubble')) {
    console.log(`L${i+1}: ${l}`);
  }
});

