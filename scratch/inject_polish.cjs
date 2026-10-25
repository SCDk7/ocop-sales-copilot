const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (!html.includes("polish-perfect-ui.css")) {
    const target = `<link rel="stylesheet" href="master-upgrade.css">
<script src="master-upgrade.js"></script>`;
    const replacement = `<link rel="stylesheet" href="master-upgrade.css">
<link rel="stylesheet" href="polish-perfect-ui.css">
<script src="master-upgrade.js"></script>
<script src="polish-perfect-ui.js"></script>`;
    html = html.replace(target, replacement);
    fs.writeFileSync("index.html", html, "utf8");
    console.log("Injected polish-perfect-ui files into index.html successfully");
} else {
    console.log("Already injected polish-perfect-ui files");
}

