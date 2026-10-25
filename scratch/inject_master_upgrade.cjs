const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Check if already injected
if (!html.includes("master-upgrade.css")) {
    const injection = `
<!-- MASTER UPGRADE 2026: EMERALD & GOLD + HIGH CONTRAST + PIN 2007 -->
<link rel="stylesheet" href="master-upgrade.css">
<script src="master-upgrade.js"></script>
</body>`;
    html = html.replace("</body>", injection);
    fs.writeFileSync("index.html", html, "utf8");
    console.log("Successfully injected master-upgrade.css and master-upgrade.js into index.html");
} else {
    console.log("Already injected master-upgrade.css");
}

