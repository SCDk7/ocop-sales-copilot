const fs = require('fs/promises');
const path = require('path');
const assets = [
  ['https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', 'fontawesome/css/all.min.css'],
  ...['fa-solid-900.woff2', 'fa-regular-400.woff2', 'fa-brands-400.woff2'].map(name => [`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/${name}`, `fontawesome/webfonts/${name}`]),
  ...['leaflet.css', 'leaflet.js', 'images/layers.png', 'images/layers-2x.png', 'images/marker-icon.png', 'images/marker-icon-2x.png', 'images/marker-shadow.png'].map(name => [`https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/${name}`, `leaflet/${name}`]),
  ['https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap', 'fonts/jakarta.css']
];
async function download(url, relative) {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const file = path.resolve(__dirname, '../assets/vendor', relative);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${relative}`);
  return file;
}
(async () => {
  const results = await Promise.allSettled(assets.map(([url, relative]) => download(url, relative)));
  for (const result of results) if (result.status === 'rejected') throw result.reason;
  const cssPath = path.resolve(__dirname, '../assets/vendor/fonts/jakarta.css');
  let css = await fs.readFile(cssPath, 'utf8');
  const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(match => match[1]))];
  for (const [index, url] of urls.entries()) {
    const name = `jakarta-${index}.${url.includes('.woff2') ? 'woff2' : 'ttf'}`;
    await download(url, `fonts/${name}`);
    css = css.split(url).join(name);
  }
  await fs.writeFile(cssPath, css);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
