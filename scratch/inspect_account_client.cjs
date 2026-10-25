const fs = require('fs');
const code = fs.readFileSync('account-client.js', 'utf8');
const lines = code.split('\n');
lines.forEach((l, i) => {
  if (l.includes('PartnerRegistration') || l.includes('openPartner') || l.includes('submitPartner')) {
    console.log(`L${i+1}: ${l}`);
  }
});

