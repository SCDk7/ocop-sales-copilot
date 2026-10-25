const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const lines = html.split("\n");
lines.forEach((l, i) => {
  if (l.includes("Khám phá 3 Miền") || l.includes("sidebar") || l.includes("filter-sidebar") || l.includes("Cột lọc") || l.includes("Bộ lọc 63 Tỉnh Thành")) {
    console.log(`${i+1}: ${l.slice(0, 100)}`);
  }
});

