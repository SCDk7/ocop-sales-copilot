const fs = require('fs');

const orig = fs.readFileSync('index.backup-safe.html', 'utf8').split('\n');
const curr = fs.readFileSync('index.html', 'utf8').split('\n');

console.log('orig lines:', orig.length, 'curr lines:', curr.length);

let diffs = 0;
for (let i = 0; i < Math.max(orig.length, curr.length); i++) {
  if (orig[i] !== curr[i]) {
    diffs++;
    if (diffs <= 10) {
      console.log(`Line ${i + 1}:`);
      console.log('  ORIG:', orig[i]);
      console.log('  CURR:', curr[i]);
    }
  }
}
console.log('Total diff lines:', diffs);

