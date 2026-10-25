const fs = require("fs");
const html = fs.readFileSync("index.backup-safe.html", "utf8");

html.split("\n").forEach((l, i) => {
  if (l.includes("initMap") || l.includes("L.map") || l.includes("province-map") || l.includes("geojson") || l.includes("vietnam") || l.includes("HOÀNG SA") || l.includes("Hoàng Sa")) {
    console.log(`${i+1}: ${l.slice(0, 100)}`);
  }
});

