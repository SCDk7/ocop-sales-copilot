const fs = require("fs");
const path = require("path");

// 1. Copy index.backup-safe.html to index.html
const backupContent = fs.readFileSync("index.backup-safe.html", "utf8");
fs.writeFileSync("index.html", backupContent, "utf8");
console.log("Restored index.backup-safe.html to index.html");

// 2. Remove obsolete temporary files
const toRemove = [
    "master-upgrade.css",
    "master-upgrade.js",
    "polish-perfect-ui.css",
    "polish-perfect-ui.js",
    ".deploy-update/master-upgrade.css",
    ".deploy-update/master-upgrade.js",
    ".deploy-update/polish-perfect-ui.css",
    ".deploy-update/polish-perfect-ui.js"
];

toRemove.forEach(f => {
    try {
        if (fs.existsSync(f)) {
            fs.unlinkSync(f);
            console.log("Deleted obsolete file:", f);
        }
    } catch (e) {
        console.error("Error deleting", f, e.message);
    }
});

// 3. Clean up index.html:
// - Comment out styledangcap.css, SuaLoiKoClick.css, toiuu.js
// - Add loading="lazy" decoding="async" to images
// - Inject final-perfect.css and final-perfect.js before </body>
let html = fs.readFileSync("index.html", "utf8");

// Comment out styledangcap.css
html = html.replace(
    '<link rel="stylesheet" href="styledangcap.css">',
    '<!-- <link rel="stylesheet" href="styledangcap.css"> -->'
);

// Comment out SuaLoiKoClick.css
html = html.replace(
    '<link rel="stylesheet" href="SuaLoiKoClick.css">',
    '<!-- <link rel="stylesheet" href="SuaLoiKoClick.css"> -->'
);

// Comment out toiuu.js
html = html.replace(
    '<script src="toiuu.js?v=20261006_3"></script>',
    '<!-- <script src="toiuu.js?v=20261006_3"></script> -->'
);

// Inject final-perfect.css and final-perfect.js before </body>
const injection = `
<!-- ROYAL COBALT BLUE (J2TEAM STYLE) & FULL COMMERCIAL ARCHITECTURE -->
<link rel="stylesheet" href="final-perfect.css">
<script src="final-perfect.js"></script>
</body>`;

html = html.replace("</body>", injection);

fs.writeFileSync("index.html", html, "utf8");
console.log("Successfully prepared index.html with final-perfect injection.");

