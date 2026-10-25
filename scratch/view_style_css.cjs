const fs = require("fs");
const lines = fs.readFileSync("style.css", "utf8").split("\n");
console.log(lines.slice(150, 185).join("\n"));

