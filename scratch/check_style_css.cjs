const fs = require("fs");
const content = fs.readFileSync("style.css", "utf8");
content.split("\n").forEach((line, i) => {
  if (line.includes("ai-chat-widget") || line.includes("ai-chat-toggle-btn")) {
    console.log(`${i+1}: ${line}`);
  }
});

