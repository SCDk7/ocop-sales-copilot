const fs = require('fs');
console.log('vietnam-provinces.geojson exists:', fs.existsSync('data/vietnam-provinces.geojson'));
console.log('vietnam-islands.geojson exists:', fs.existsSync('data/vietnam-islands.geojson'));
if (fs.existsSync('data/vietnam-provinces.geojson')) {
    const data = JSON.parse(fs.readFileSync('data/vietnam-provinces.geojson', 'utf8'));
    console.log('Feature count:', data.features.length);
}

