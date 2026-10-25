const fs = require("fs");
const lines = fs.readFileSync("index.html", "utf8").split("\n");
console.log(lines.slice(6040, 6180).join("\n"));

