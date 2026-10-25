const fs = require("fs");
const files = ["index.html", "ai-shopping.js", "chat-language.js", "script.js", "toiuu.js", "style.css", "styledangcap.css"];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, "utf8");
    if (content.includes("ai-chat-widget")) {
      console.log(`Found ai-chat-widget in ${f}`);
    }
  }
});

