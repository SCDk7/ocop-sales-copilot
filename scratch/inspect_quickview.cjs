const fs = require("fs");
const lines = fs.readFileSync("index.html", "utf8").split("\n");
console.log(lines.slice(10985, 11150).join("\n"));

