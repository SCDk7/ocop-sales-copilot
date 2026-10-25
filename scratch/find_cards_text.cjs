const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
html.split("\n").forEach((l, i) => {
  if (l.includes("Pháp lý") || l.includes("Quản lý") || l.includes("100%") || l.includes("why-us-card")) {
    console.log(`${i+1}: ${l.slice(0, 100)}`);
  }
});

