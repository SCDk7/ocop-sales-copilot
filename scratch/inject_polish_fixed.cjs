const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (!html.includes("polish-perfect-ui.css")) {
    const toInsert = `<!-- POLISH PERFECT UI: HERO CONTRAST, CARDS ALIGNMENT, ROBOT AVATAR & RESPONSIVE -->
<link rel="stylesheet" href="polish-perfect-ui.css">
<script src="polish-perfect-ui.js"></script>
</body>`;
    html = html.replace("</body>", toInsert);
    fs.writeFileSync("index.html", html, "utf8");
    console.log("SUCCESS: Injected polish-perfect-ui tags into index.html");
} else {
    console.log("Already exists in index.html");
}

