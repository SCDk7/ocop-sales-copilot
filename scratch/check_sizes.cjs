const fs = require('fs');

console.log('=== PREPARING CLEAN VIDEO & VIETNAM MAP UPDATE ===');

// Check current sizes
const jsPath = 'skytech-complete.js';
const cssPath = 'skytech-complete.css';

console.log('Reading skytech-complete.js (' + fs.statSync(jsPath).size + ' bytes)');
console.log('Reading skytech-complete.css (' + fs.statSync(cssPath).size + ' bytes)');

