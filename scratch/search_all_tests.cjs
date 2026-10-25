const fs = require('fs');
const testFiles = fs.readdirSync('.').filter(f => f.endsWith('.test.js'));

testFiles.forEach(tf => {
  const c = fs.readFileSync(tf, 'utf8');
  ['sualoiclick', 'SuaLoiKoClick', 'toiuu', 'styledangcap', 'style1.css', 'style3.css'].forEach(kw => {
    if (c.includes(kw)) {
      console.log(`Found "${kw}" in ${tf}`);
    }
  });
});
console.log('Search across all test files complete.');

