const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

console.log("Length:", html.length);
console.log("Has intro overlay:", html.includes("ocop-intro-overlay"));
console.log("Has judge bar:", html.includes("judge-quick-access-bar"));
console.log("Has copilot js:", html.includes("ocop-copilot.js"));
console.log("Has styledangcap:", html.includes("styledangcap.css"));
console.log("Has SuaLoiKoClick:", html.includes("SuaLoiKoClick.css"));
console.log("Has toiuu.js:", html.includes("toiuu.js"));
console.log("Has financial modal:", html.includes("ai-financial-modal"));
console.log("Has story modal:", html.includes("story-modal") || html.includes("storyModal") || html.includes("aiStoryModal"));
console.log("Has sidebar:", html.includes("sidebar") || html.includes("aside") || html.includes("filter"));

