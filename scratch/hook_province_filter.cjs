const fs = require('fs');

let s = fs.readFileSync('index.html', 'utf8');

const targetStr = 'showToast(`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc (63 Tỉnh Thành • ${sortedList.length} Sản phẩm)`, "info");\r\n                }';

const hookCode = `showToast(\`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc (63 Tỉnh Thành • \${sortedList.length} Sản phẩm)\`, "info");
                }

                // Leaflet Map FlyTo, Red Pin, and OCOP Stores synchronization
                if (selectedProvince) {
                    if (provinceMap && provinceBoundaryLayer) {
                        let targetLayer = null;
                        provinceBoundaryLayer.eachLayer(layer => {
                            if (layer.feature && (normalizeProvinceName(layer.feature.properties.name) === normTarget || layer.feature.properties.id === targetProvince)) {
                                targetLayer = layer;
                            }
                        });
                        if (targetLayer && targetLayer.getBounds) {
                            const center = targetLayer.getBounds().getCenter();
                            provinceMap.flyTo(center, 8.5, { duration: 1.2 });
                            placeLeafletRedPin(center);
                        }
                    }
                    if (typeof renderProvinceStoresPanel === 'function') {
                        renderProvinceStoresPanel(selectedProvince.name);
                    }
                } else {
                    if (provinceMap) {
                        provinceMap.flyTo([16.0, 107.8], 5.5, { duration: 1.2 });
                    }
                    if (typeof removeLeafletRedPin === 'function') {
                        removeLeafletRedPin();
                    }
                    if (typeof renderProvinceStoresPanel === 'function') {
                        renderProvinceStoresPanel(null);
                    }
                }`;

if (s.includes(targetStr)) {
    s = s.replace(targetStr, hookCode.replace(/\n/g, '\r\n'));
    fs.writeFileSync('index.html', s, 'utf8');
    console.log('✓ Successfully hooked Leaflet and Stores Panel to onProvinceFilterChange in index.html');
} else {
    // Try with normalized newlines
    console.log('Trying regex match for targetStr...');
    const regex = /showToast\(`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc \(63 Tỉnh Thành • \$\{sortedList\.length\} Sản phẩm\)`, "info"\);[\r\n\s]*\}/;
    if (regex.test(s)) {
        s = s.replace(regex, hookCode.replace(/\n/g, '\r\n'));
        fs.writeFileSync('index.html', s, 'utf8');
        console.log('✓ Successfully hooked via regex in index.html');
    } else {
        console.error('❌ Could not match targetStr in index.html');
    }
}
