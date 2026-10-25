const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

// Find all css link tags
const links = html.match(/<link[^>]+stylesheet[^>]*>/gi) || [];
console.log("CSS Links:", links);

// Find all script tags
const scripts = html.match(/<script[^>]*src=["'][^"']+["'][^>]*>/gi) || [];
console.log("Scripts:", scripts);

