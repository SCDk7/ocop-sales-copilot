const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.js'));

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('submitPartnerRegistration') || content.includes('openPartnerRegistrationModal')) {
    console.log(`Found in ${f}`);
  }
});

