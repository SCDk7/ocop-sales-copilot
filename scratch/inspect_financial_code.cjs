const fs = require("fs");
const lines = fs.readFileSync("index.html", "utf8").split("\n");
console.log("=== MODAL HTML (4250-4350) ===");
console.log(lines.slice(4250, 4320).join("\n"));

console.log("=== JS LOGIC (11535-11600) ===");
console.log(lines.slice(11535, 11600).join("\n"));

