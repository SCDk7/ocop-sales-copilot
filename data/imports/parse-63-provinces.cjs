const fs = require('node:fs');
const path = require('node:path');
function parse(text) {
  const rows = [];
  let province, group, currentStars;
  for (const line of text.split(/\r?\n/)) {
    if (/^# .*PHẦN 1/.test(line)) group = 'bac';
    if (/^# .*PHẦN 2/.test(line)) group = 'trung';
    if (/^# .*PHẦN 3/.test(line)) group = 'nam';
    const heading = line.match(/^#### (\d+)\. (.+)/);
    if (heading) { province = { number: Number(heading[1]), name: heading[2].trim() }; continue; }
    const starHeading = line.match(/^\* \*\*OCOP ([345]) Sao:\*\*/i);
    if (starHeading) { currentStars = Number(starHeading[1]); continue; }
    const numberedProduct = line.match(/^\d+\. (.+?):\s*~([\d.]+)\s*[–-]\s*([\d.]+)\s*VNĐ(.*)$/);
    if (numberedProduct) {
      if (!province || !group || !currentStars) throw Error('Missing province or star heading: ' + line);
      const [, name, min, max, suffix] = numberedProduct;
      rows.push({ row: rows.length + 1, provinceNumber: province.number, region: province.name, macroRegion: group, name, starsMin: currentStars, starsMax: currentStars, priceMin: Number(min.replaceAll('.', '')), priceMax: Number(max.replaceAll('.', '')), priceOpenEnded: suffix.includes('+'), priceSuffix: suffix.trim(), sourceLine: line });
      continue;
    }
    const product = line.match(/^\* \*\*(.+?) \(OCOP (3-5|3-4|4-5|3|4|5) sao\):\*\*\s*~([\d.]+)\s*[–-]\s*([\d.]+)\s*VNĐ(.*)$/);
    if (!product) { if (line.startsWith('* **')) throw Error('Unparsed product: ' + line); continue; }
    const [, name, stars, min, max, suffix] = product;
    rows.push({ row: rows.length + 1, provinceNumber: province.number, region: province.name, macroRegion: group, name, starsMin: Number(stars[0]), starsMax: Number(stars.at(-1)), priceMin: Number(min.replaceAll('.', '')), priceMax: Number(max.replaceAll('.', '')), priceOpenEnded: suffix.includes('+'), priceSuffix: suffix.trim(), sourceLine: line });
  }
  const provinces = [...new Set(rows.map(r => r.region))];
  if (rows.length !== 252 || provinces.length !== 63 || provinces.some(p => rows.filter(r => r.region === p).length !== 4)) throw Error('Expected 63 provinces with exactly 4 products each');
  return rows;
}
if (require.main === module) {
  const rows = parse(fs.readFileSync(path.join(__dirname, 'catalog-63-provinces-source.txt'), 'utf8'));
  fs.writeFileSync(path.join(__dirname, 'catalog-63-provinces-rows.json'), JSON.stringify(rows, null, 2) + '\n');
  for (const row of rows) console.log(`${row.row} | ${row.region} | ${row.name}`);
}
module.exports = { parse };
