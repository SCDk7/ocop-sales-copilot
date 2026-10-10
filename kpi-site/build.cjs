'use strict';
const fs = require('node:fs');
const path = require('node:path');

function buildDashboard() {
  const publicDir = path.join(__dirname, 'public');
  const readSource = name => fs.readFileSync(path.join(publicDir, name), 'utf8').replace(/^\uFEFF/, '');
  const css = readSource('dashboard.css');
  const js = readSource('dashboard.js');
  const template = readSource('index.html');
  const html = template
    .replace(/<link rel="stylesheet" href="dashboard\.css(?:\?[^" ]*)?">/, () => '<style>' + css + '</style>')
    .replace(/<script src="dashboard\.js(?:\?[^" ]*)?"><\/script>/, () => '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script>');
  fs.writeFileSync(path.join(__dirname, 'kpi.html'), html);
  return html;
}

if (require.main === module) {
  buildDashboard();
  console.log('Created kpi-site/kpi.html — standalone dashboard interface');
}
module.exports = { buildDashboard };
