const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
function syncClientAssets(directory = root) {
    let changed = 0;
    const pages = fs.readdirSync(directory).filter(name => name.endsWith('.html') && !/^index\.backup/i.test(name));
    for (const page of pages) {
        const filename = path.join(directory, page);
        const html = fs.readFileSync(filename, 'utf8');
        const updated = html.replace(/<!--[\s\S]*?-->|<(?:script|link)\b[^>]*>/gi, tag => {
            if (tag.startsWith('<!--')) return tag;
            return tag.replace(/\b(src|href)="([^"?#]+\.(?:js|css))(?:\?([^"]*))?"/gi, (attribute, name, asset, query) => {
                if (/^(?:[a-z]+:|\/\/)/i.test(asset)) return attribute;
                const assetPath = path.resolve(directory, asset.replace(/^\/+/, ''));
                if (!assetPath.startsWith(directory + path.sep) || !fs.existsSync(assetPath)) throw new Error('Missing local asset: ' + asset);
                const hash = crypto.createHash('sha256').update(fs.readFileSync(assetPath)).digest('hex').slice(0, 12);
                const params = new URLSearchParams(query || '');
                params.set('v', hash);
                return `${name}="${asset}?${params}"`;
            });
        });
        if (html !== updated) { fs.writeFileSync(filename, updated); changed++; }
    }
    return changed;
}

if (require.main === module) { require('./sync-product-codes.cjs').syncProductCodes(); console.log('Updated client asset versions in ' + syncClientAssets() + ' pages.'); }
module.exports = {syncClientAssets};
