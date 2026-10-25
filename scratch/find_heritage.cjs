const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('getHeritageStory') || l.includes('getOcopStoreInfo')) {
    console.log(`L${i+1}: ${l}`);
  }
});

