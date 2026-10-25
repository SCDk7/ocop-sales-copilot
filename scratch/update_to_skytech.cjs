const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace old controller tags with skytech-complete tags
const target1 = `<!-- EMERALD OCOP LUXURY (J2TEAM GREEN TECH PRODUCTION) -->
<link rel="stylesheet" href="ocop-ultimate-production.css">
<script src="ocop-ultimate-production.js"></script>`;

const replacement = `<!-- MODERN SKY-TECH & CLEAN SAPPHIRE (100% COMPLETE OVERHAUL) -->
<link rel="stylesheet" href="skytech-complete.css">
<script src="skytech-complete.js"></script>`;

if (html.includes(target1)) {
    html = html.replace(target1, replacement);
    console.log('Replaced target1 (LF)');
} else if (html.includes(target1.replace(/\n/g, '\r\n'))) {
    html = html.replace(target1.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
    console.log('Replaced target1 (CRLF)');
} else {
    // If not found, use regex
    html = html.replace(/<link\s+rel=["']stylesheet["']\s+href=["']ocop-ultimate-production\.css["']\s*\/?>\s*<script\s+src=["']ocop-ultimate-production\.js["']\s*><\/script>/gi, replacement);
    console.log('Replaced via regex');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');

