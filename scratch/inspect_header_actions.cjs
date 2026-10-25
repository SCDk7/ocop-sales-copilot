const fs = require("fs");
const lines = fs.readFileSync("index.html", "utf8").split("\n");
console.log(lines.slice(3050, 3090).join("\n"));

