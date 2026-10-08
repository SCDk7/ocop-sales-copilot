const fs = require('node:fs');
const path = require('node:path');
const draftPath = path.join(__dirname, 'ocop-catalog-import.json');
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const selected = JSON.parse(fs.readFileSync(path.join(__dirname, 'selected-image-sources.json'), 'utf8'));
const sourceCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'image-catalog-source.json'), 'utf8'));
// Matches reviewed by product name, brand, and origin; no fuzzy auto-selection.
const exact = {5:27,8:116,9:236,10:233,14:35,23:25,25:219,26:220,29:20,49:13,50:86,51:266,54:347,63:76,105:22,109:9,116:968};
for (const [row, sourceId] of Object.entries(exact)) {
  const source = sourceCatalog.find(p => p.product_id === sourceId);
  if (!source) throw new Error(`Missing image source ${sourceId}`);
  selected[row] = {url: source.avatar_url, page: source.url, sourceName: source.name, review:'product_or_regional_specialty_match'};
}
async function main() {
  fs.mkdirSync(path.join(__dirname, '../../images/catalog'), {recursive:true});
  const items = draft.candidates.filter(p => selected[p.key.replace('import-', '')]);
  for (let start = 0; start < items.length; start += 4) {
    await Promise.all(items.slice(start,start+4).map(async item => {
      const row = item.key.replace('import-', '');
      const source = selected[row];
      if (item.image && fs.existsSync(path.join(__dirname,'../..',item.image))) return;
      try {
        const response = await fetch(source.url, {signal:AbortSignal.timeout(25000)});
        const type = response.headers.get('content-type') || '';
        if (!response.ok || !type.startsWith('image/')) throw new Error(`HTTP ${response.status}: ${type}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length > 6000000) throw new Error('Image too large');
        const ext = {'image/jpg':'jpg','image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/avif':'avif','image/gif':'gif'}[type.split(';')[0]];
        if (!ext) throw new Error(`Unsupported image type ${type}`);
        const relative = `images/catalog/import-${row}.${ext}`;
        fs.writeFileSync(path.join(__dirname,'../..',relative),bytes);
        item.image = relative;
        item.imageSource = source;
        item.imageBytes = bytes.length;
        delete item.imageError;
        console.log(`OK ${row} ${bytes.length} bytes`);
      } catch(error) { item.imageError = error.message; console.log(`PENDING ${row}: ${error.message}`); }
    }));
  }
  fs.writeFileSync(draftPath, JSON.stringify(draft,null,2)+'\n');
}
main().catch(error => {console.error(error);process.exitCode=1;});
