const fs = require('fs');

fs.readdirSync('.').forEach(f => {
  if (f.endsWith('.js') || f.endsWith('.html') || f.endsWith('.json')) {
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('520+') || content.includes('520 sản phẩm') || content.includes('525')) {
      console.log(f, 'mentions 520 or 525');
    }
  }
});
