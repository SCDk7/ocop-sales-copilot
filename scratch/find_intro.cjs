const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const lines = html.split("\n");
lines.forEach((l, i) => {
  if (l.includes("ocop-intro-overlay") || l.includes("Bản Đồ Số OCOP") || l.includes("Khám phá đặc sản trên bản đồ")) {
    console.log(`${i+1}: ${l.slice(0, 100)}`);
  }
});

