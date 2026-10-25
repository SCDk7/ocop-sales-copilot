const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

// Search for chatbox or copilot or ai chat
const matches = [];
const lines = html.split("\n");
lines.forEach((line, i) => {
  if (line.toLowerCase().includes("chat") && (line.includes("id=") || line.includes("class="))) {
    matches.push({ line: i + 1, content: line.trim() });
  }
});
console.log("Chat matches count:", matches.length);
console.log(matches.slice(0, 30));

