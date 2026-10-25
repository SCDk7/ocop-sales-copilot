const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('skytech-complete.css', 'utf8');

console.log('--- province-map in HTML CSS ---');
const matches1 = html.match(/(#province-map|\.province-map)[^{]*\{[^}]*\}/g);
console.log(matches1);

console.log('--- province-map in skytech-complete.css ---');
const matches2 = css.match(/(#province-map|\.province-map|\.intro-map)[^{]*\{[^}]*\}/g);
console.log(matches2);

console.log('--- initializeProvinceMap code in index.html ---');
const initIdx = html.indexOf('function initializeProvinceMap');
console.log(html.slice(initIdx, initIdx + 1500));

