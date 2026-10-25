const fs = require('fs');
const css = fs.readFileSync('ocop-sales-copilot/skytech-complete.css', 'utf8');
const lines = css.split('\n');

lines.forEach((l, i) => {
  if (l.includes('#province-map') || l.includes('#shop-hero') || l.includes('admin-pin') || l.includes('ai-financial-modal')) {
    console.log((i+1) + ': ' + l.trim());
  }
});

