const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Ensure handleOcrFileSelect uses proper UTF-8 string
html = html.replace(
    /showToast\(['"][^'"]*AI OCR[^'"]*['"],\s*['"]success['"]\)/,
    "showToast('✅ AI OCR: Đã trích xuất thành công dữ liệu chứng nhận OCOP!', 'success')"
);

fs.writeFileSync("index.html", html, "utf8");
console.log("UTF-8 normalized for toast in index.html");

