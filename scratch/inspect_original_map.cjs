const fs = require("fs");
const lines = fs.readFileSync("index.backup-safe.html", "utf8").split("\n");
console.log(lines.slice(6915, 7010).join("\n"));

