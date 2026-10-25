const fs = require("fs");
const testFile = fs.readFileSync("province-filter-sync.test.js", "utf8");

// Search for index.html reads and assertions
testFile.split("\n").forEach((line, i) => {
  if (line.includes("assert") && (line.includes("html") || line.includes("index"))) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});

