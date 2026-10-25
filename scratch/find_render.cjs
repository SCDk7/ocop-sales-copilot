const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

// Search for renderProducts or product card creation
function findOccurrences(str, query) {
  const res = [];
  str.split("\n").forEach((l, i) => {
    if (l.includes(query)) res.push(`${i+1}: ${l.slice(0, 100)}`);
  });
  return res;
}

console.log("renderProducts in index.html:", findOccurrences(html, "renderProducts"));
console.log("displayProducts in index.html:", findOccurrences(html, "displayProducts"));
console.log("createProductCard in index.html:", findOccurrences(html, "createProductCard"));
console.log("renderProductCard in index.html:", findOccurrences(html, "renderProductCard"));
console.log("product-card in index.html:", findOccurrences(html, "product-card").slice(0, 15));

