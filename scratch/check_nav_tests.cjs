const fs = require('fs');
const testContent = fs.readFileSync('province-filter-sync.test.js', 'utf8');
const lines = testContent.split('\n');

lines.forEach((l, i) => {
  if (l.includes('openChallengeProposalModal') || l.includes('nav-btn-studio') || l.includes('Pitch Deck') || l.includes('header-primary-nav')) {
    console.log(`L${i+1}: ${l}`);
  }
});

