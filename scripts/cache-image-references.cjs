const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const {publicURL, writeSummary, outputPath} = require('./build-chatbot-image-references.cjs');
const root = path.resolve(__dirname, '..');
const maxBytes = 3 * 1024 * 1024;

function imageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return {extension: 'jpg', mimeType: 'image/jpeg'};
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return {extension: 'png', mimeType: 'image/png'};
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return {extension: 'webp', mimeType: 'image/webp'};
  if (/^GIF8[79]a/.test(bytes.toString('ascii', 0, 6))) return {extension: 'gif', mimeType: 'image/gif'};
  if (bytes.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(bytes.toString('ascii', 8, 32))) return {extension: 'avif', mimeType: 'image/avif'};
  return null;
}

async function fetchImage(url, fetcher = fetch) {
  if (!publicURL(url)) throw new Error('Unsafe image URL');
  const response = await fetcher(url, {signal: AbortSignal.timeout(10000), headers: {'User-Agent': 'OCOP-ImageReferenceIndexer/1.0', Accept: 'image/*'}});
  if (!response.ok) throw new Error('HTTP ' + response.status);
  if (!publicURL(response.url || url)) { await response.body?.cancel(); throw new Error('Unsafe redirect'); }
  if (Number(response.headers.get('content-length')) > maxBytes) { await response.body?.cancel(); throw new Error('Image exceeds cache size limit'); }
  const chunks = []; let total = 0;
  for await (const chunk of response.body) {
    total += chunk.length;
    if (total > maxBytes) throw new Error('Image exceeds cache size limit');
    chunks.push(chunk);
  }
  const bytes = Buffer.concat(chunks);
  const type = imageType(bytes);
  if (!type) throw new Error('Response is not a supported raster image');
  return {bytes, ...type, finalUrl: response.url || url};
}

async function cacheImageReferences({file = outputPath, maxPerProduct = 2, maxAttempts = 8, concurrency = 6} = {}) {
  const knowledge = JSON.parse(await fs.readFile(file, 'utf8'));
  const cacheDirectory = path.join(root, 'data/image-references');
  await fs.mkdir(cacheDirectory, {recursive: true});
  const requests = new Map();
  let next = 0, complete = 0;
  await Promise.all(Array.from({length: concurrency}, async () => {
    while (next < knowledge.length) {
      const product = knowledge[next++];
      const hashes = new Set(); let attempts = 0;
      for (const image of product.googleImages) {
        if (hashes.size >= maxPerProduct || attempts++ >= maxAttempts) break;
        try {
          if (image.downloadStatus === 'ready' && image.localPath?.startsWith('data/image-references/')) {
            const existing = await fs.readFile(path.join(root, image.localPath));
            if (crypto.createHash('sha256').update(existing).digest('hex') === image.sha256) { hashes.add(image.sha256); continue; }
          }
          if (!requests.has(image.imageUrl)) requests.set(image.imageUrl, fetchImage(image.imageUrl));
          const {bytes, extension, mimeType, finalUrl} = await requests.get(image.imageUrl);
          const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
          const localPath = 'data/image-references/' + sha256.slice(0, 24) + '.' + extension;
          await fs.writeFile(path.join(root, localPath), bytes);
          Object.assign(image, {downloadStatus: 'ready', downloadedAt: new Date().toISOString(), localPath, sha256, bytes: bytes.length, mimeType, finalUrl});
          delete image.downloadError;
          hashes.add(sha256);
        } catch (error) {
          if (['EACCES', 'EPERM'].includes(error.cause?.code) || ['EACCES', 'EPERM'].includes(error.code)) throw error;
          image.downloadStatus = 'failed'; image.downloadError = error.message.slice(0, 180);
        }
      }
      complete++;
      if (complete % 12 === 0) console.log('Checked reference downloads for ' + complete + '/' + knowledge.length + ' products');
    }
  }));
  await fs.writeFile(file, JSON.stringify(knowledge, null, 2) + '\n');
  const summary = writeSummary(knowledge);
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}
if (require.main === module) cacheImageReferences().catch(error => {console.error(error.message, error.cause?.code || ''); process.exitCode = 1;});
module.exports = {cacheImageReferences, fetchImage, imageType};
