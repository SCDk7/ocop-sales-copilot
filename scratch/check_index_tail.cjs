const fs = require("fs");
const lines = fs.readFileSync("index.html", "utf8").split("\n");
console.log(lines.slice(lines.length - 25).join("\n"));

