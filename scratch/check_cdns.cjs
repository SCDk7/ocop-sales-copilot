const fs = require("fs");
const html = fs.readFileSync("index.backup-safe.html", "utf8");

// Find all script tags
const scripts = html.match(/<script[^>]*>/gi) || [];
console.log("=== SCRIPTS in index.backup-safe.html ===");
scripts.forEach(s => console.log(s));

// Find all external stylesheets
const links = html.match(/<link[^>]+stylesheet[^>]*>/gi) || [];
console.log("=== STYLESHEETS in index.backup-safe.html ===");
links.forEach(l => console.log(l));

// Find any tesseract or audio or CDN tags
console.log("Contains tesseract:", html.includes("tesseract"));
console.log("Contains leaflet:", html.includes("leaflet"));
console.log("Contains font-awesome:", html.includes("font-awesome"));

