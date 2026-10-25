const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const target = `<!-- ROYAL COBALT BLUE (J2TEAM STYLE) & FULL COMMERCIAL ARCHITECTURE -->
<link rel="stylesheet" href="final-perfect.css">
<script src="final-perfect.js"></script>`;

const replacement = `<!-- EMERALD OCOP LUXURY (J2TEAM GREEN TECH STYLE) -->
<link rel="stylesheet" href="ocop-emerald-final.css">
<script src="ocop-emerald-final.js"></script>`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully replaced in index.html (LF)');
} else if (html.includes(target.replace(/\n/g, '\r\n'))) {
  html = html.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Successfully replaced in index.html (CRLF)');
} else {
  console.log('Target not found!');
}

