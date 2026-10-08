const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const cssPath = path.join(root, 'assets', 'tailwind.css');
fs.mkdirSync(path.dirname(cssPath), { recursive: true });
const result = spawnSync(process.execPath, [
  require.resolve('tailwindcss/lib/cli.js'), '-c', 'tailwind.config.cjs',
  '-i', 'styles/tailwind-input.css', '-o', 'assets/tailwind.css', '--minify'
], { cwd: root, stdio: 'inherit', windowsHide: true });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);

const hash = crypto.createHash('sha256').update(fs.readFileSync(cssPath)).digest('hex').slice(0, 12);
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8').replace(
  /assets\/tailwind\.css\?v=[a-z0-9_]+/g, 'assets/tailwind.css?v=' + hash
);
fs.writeFileSync(file, html.replace(/^\uFEFF/, '').trimEnd() + '\n');
console.log('Built local Tailwind CSS: ' + fs.statSync(cssPath).size + ' bytes');
