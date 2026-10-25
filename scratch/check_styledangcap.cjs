const fs = require("fs");
const lines = fs.readFileSync("styledangcap.css", "utf8").split("\n");
console.log("styledangcap.css line count:", lines.length);
console.log(lines.slice(0, 40).join("\n"));

