const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find province-map in HTML
const idx = html.indexOf('id="province-map"');
console.log('--- province-map in HTML ---');
console.log(html.slice(Math.max(0, idx - 300), idx + 500));

// Check Leaflet container styles in HTML
const leafletMatches = html.match(/\.leaflet-container[^{]*\{[^}]*\}/g);
console.log('--- .leaflet-container in HTML ---', leafletMatches);

