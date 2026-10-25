const fs = require('fs');
const content = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (/ai-financial-modal|closeFinancialDashboardModal|updateFinancialSimulator|fin-stat-revenue|fin-stat-profit|sim-bar-cogs/i.test(line)) {
        console.log(`${idx+1}: ${line.trim()}`);
    }
});

