const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const style = fs.readFileSync("style.css", "utf8");

function findIn(text, query, name) {
  text.split("\n").forEach((l, i) => {
    if (l.includes(query)) console.log(`${name}:${i+1}: ${l}`);
  });
}
findIn(html, "catalog-layout-wrapper", "index.html");
findIn(style, "catalog-layout-wrapper", "style.css");
findIn(html, "catalog-sidebar", "index.html");

