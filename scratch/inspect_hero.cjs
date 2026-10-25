const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const lines = html.split("\n");

let start = -1;
let end = -1;
lines.forEach((l, i) => {
  if (l.includes('id="shop-hero"')) start = i;
  if (start !== -1 && end === -1 && (l.includes('id="catalog-layout-wrapper"') || l.includes('id="products-section"'))) {
    end = i;
  }
});

console.log("Hero from line", start, "to", end);
console.log(lines.slice(start, start + 120).join("\n"));

