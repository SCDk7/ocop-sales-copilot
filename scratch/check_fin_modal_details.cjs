const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');
const lines = html.split('\n');

const start = lines.findIndex(l => l.includes('id="ai-financial-modal"'));
const end = lines.findIndex((l, i) => i > start && l.includes('id="partner-registration-modal"'));
console.log('ai-financial-modal from line', start + 1, 'to', end + 1);

let tableFound = false;
for (let i = start; i < end; i++) {
  if (lines[i].includes('<table') || lines[i].includes('fin-stat-') || lines[i].includes('sim-volume')) {
    console.log((i + 1) + ': ' + lines[i].trim().slice(0, 120));
  }
}

