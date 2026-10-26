const fs = require('fs');

console.log('=== CREATING COMPREHENSIVE REFACTOR SCRIPT ===');

let js = fs.readFileSync('skytech-complete.js', 'utf8');

// Step 1: Replace setupVietnamMapPreservation with setupInteractiveVietnamMap
const mapPreserveIdx = js.indexOf('function setupVietnamMapPreservation()');
if (mapPreserveIdx === -1) {
    console.error('Could not find function setupVietnamMapPreservation()');
    process.exit(1);
}

// Find start of comment above it
const commentIdx = js.lastIndexOf('// 3. BẢO VỆ BẢN ĐỒ VỆ TINH LEAFLET VIỆT NAM', mapPreserveIdx);
// Find end of function (after setTimeout(refreshMap, 1500); \n })
const endTimeoutIdx = js.indexOf('setTimeout(refreshMap, 1500);', mapPreserveIdx);
const funcEndIdx = js.indexOf('}', endTimeoutIdx) + 1;

console.log('Found setupVietnamMapPreservation from char', commentIdx, 'to', funcEndIdx);

const mapReplacement = `// 3. BẢN ĐỒ ĐỊA LÝ VIỆT NAM TƯƠNG TÁC (SẮC SẢO, RÕ NÉT, 63 TỈNH THÀNH & HOÀNG SA, TRƯỜNG SA)
    window.selectProvinceFromMap = function (provinceName, provinceId) {
        if (!provinceName) return;
        if (typeof onProvinceFilterChange === 'function') {
            onProvinceFilterChange(provinceName);
        } else if (typeof selectProvinceById === 'function') {
            selectProvinceById(provinceId);
        }

        // Highlight matching pin on map
        document.querySelectorAll('.map-province-pin').forEach(pin => {
            const isMatch = pin.dataset.provName === provinceName || pin.dataset.provId === provinceId;
            const dot = pin.querySelector('.pin-dot');
            const pulse = pin.querySelector('.pin-pulse, .pin-pulse-vip');
            if (dot) {
                dot.setAttribute('fill', isMatch ? '#FDE047' : (pin.dataset.provId === 'VN-39' ? '#FDE047' : '#38BDF8'));
                dot.setAttribute('stroke', isMatch ? '#DC2626' : (pin.dataset.provId === 'VN-39' ? '#DC2626' : '#FFFFFF'));
            }
            if (pulse) {
                pulse.setAttribute('fill', isMatch ? 'rgba(253, 224, 71, 0.7)' : 'rgba(56, 189, 248, 0.4)');
            }
        });

        // Update status text
        const statusEl = document.getElementById('province-selection-status');
        if (statusEl) {
            statusEl.textContent = 'Đang chọn: ' + provinceName + ' • Khám phá đặc sản OCOP chính hãng';
            statusEl.style.color = '#0284C7';
            statusEl.style.fontWeight = '700';
        }

        // Enable and highlight clear button
        const clearBtn = document.getElementById('province-map-clear');
        if (clearBtn) {
            clearBtn.disabled = false;
            clearBtn.style.setProperty('background', '#0284C7', 'important');
            clearBtn.style.setProperty('color', '#FFFFFF', 'important');
            clearBtn.style.setProperty('cursor', 'pointer', 'important');
            clearBtn.style.setProperty('opacity', '1', 'important');
        }
    };

    function setupInteractiveVietnamMap() {
        const mapContainer = document.getElementById('province-map');
        if (!mapContainer) return;

        // Container styling
        mapContainer.style.background = 'linear-gradient(180deg, #075985 0%, #0369A1 50%, #0284C7 100%)';
        mapContainer.style.position = 'relative';
        mapContainer.style.minHeight = '480px';
        mapContainer.style.height = '480px';
        mapContainer.style.borderRadius = '16px';
        mapContainer.style.overflow = 'hidden';
        mapContainer.style.border = '2px solid #38BDF8';
        mapContainer.style.boxShadow = '0 10px 30px rgba(2, 132, 199, 0.25)';

        // Interactive SVG Map of Vietnam with 63 provinces + Hoang Sa & Truong Sa
        const mapSvg = '<svg id="vietnam-interactive-svg" viewBox="0 0 540 640" width="100%" height="100%" style="display: block; width: 100%; height: 100%; user-select: none;" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
                '<linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">' +
                    '<stop offset="0%" stop-color="#082F49" />' +
                    '<stop offset="50%" stop-color="#0369A1" />' +
                    '<stop offset="100%" stop-color="#0284C7" />' +
                '</linearGradient>' +
                '<linearGradient id="vnLandGrad" x1="0" y1="0" x2="1" y2="1">' +
                    '<stop offset="0%" stop-color="#059669" />' +
                    '<stop offset="35%" stop-color="#10B981" />' +
                    '<stop offset="70%" stop-color="#047857" />' +
                    '<stop offset="100%" stop-color="#065F46" />' +
                '</linearGradient>' +
                '<filter id="landGlow" x="-20%" y="-20%" width="140%" height="140%">' +
                    '<feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />' +
                '</filter>' +
                '<filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">' +
                    '<feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#FDE047" flood-opacity="0.8" />' +
                '</filter>' +
            '</defs>' +
            '<rect width="540" height="640" fill="url(#oceanGrad)" />' +
            '<g stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" stroke-dasharray="3,4">' +
                '<line x1="0" y1="120" x2="540" y2="120" />' +
                '<line x1="0" y1="240" x2="540" y2="240" />' +
                '<line x1="0" y1="360" x2="540" y2="360" />' +
                '<line x1="0" y1="480" x2="540" y2="480" />' +
                '<line x1="0" y1="600" x2="540" y2="600" />' +
                '<line x1="120" y1="0" x2="120" y2="640" />' +
                '<line x1="240" y1="0" x2="240" y2="640" />' +
                '<line x1="360" y1="0" x2="360" y2="640" />' +
                '<line x1="480" y1="0" x2="480" y2="640" />' +
            '</g>' +
            '<g transform="translate(485, 55)" opacity="0.85">' +
                '<circle r="22" fill="rgba(15, 23, 42, 0.6)" stroke="#38BDF8" stroke-width="1.5" />' +
                '<polygon points="0,-18 5,-2 0,0" fill="#EF4444" />' +
                '<polygon points="0,-18 -5,-2 0,0" fill="#DC2626" />' +
                '<polygon points="0,18 4,2 0,0" fill="#E2E8F0" />' +
                '<polygon points="0,18 -4,2 0,0" fill="#94A3B8" />' +
                '<polygon points="18,0 2,4 0,0" fill="#CBD5E1" />' +
                '<polygon points="-18,0 -2,4 0,0" fill="#64748B" />' +
                '<circle r="3" fill="#FDE047" />' +
                '<text x="0" y="-24" text-anchor="middle" font-size="10" font-weight="900" fill="#FDE047" font-family="sans-serif">B</text>' +
            '</g>' +
            '<g transform="translate(20, 30)">' +
                '<text font-family="sans-serif" font-weight="900" font-size="12" fill="#FDE047" letter-spacing="1">BẢN ĐỒ ĐỊA LÝ &amp; DI SẢN OCOP VIỆT NAM</text>' +
                '<text y="16" font-family="sans-serif" font-weight="700" font-size="10" fill="#BAE6FD" opacity="0.9">63 Tỉnh Thành • Quần Đảo Hoàng Sa &amp; Trường Sa</text>' +
            '</g>' +
            '<path id="vn-mainland" d="M 105,75 C 125,55 160,45 195,45 C 230,45 255,60 275,80 C 285,95 285,115 270,130 C 255,140 235,145 225,160 C 215,175 220,195 230,215 C 245,240 270,265 285,285 C 305,305 325,325 330,345 C 335,365 340,390 345,415 C 345,440 335,465 320,490 C 300,510 275,515 260,510 C 245,520 255,535 270,545 C 265,555 245,565 235,570 C 220,580 205,585 190,600 C 175,615 160,630 145,630 C 135,625 140,605 145,590 C 150,575 165,560 170,545 C 175,530 195,525 210,515 C 225,505 230,485 245,470 C 255,450 260,420 265,390 C 270,360 275,330 265,300 C 250,270 230,240 215,210 C 200,180 180,160 160,140 C 140,120 115,110 105,95 Z" fill="url(#vnLandGrad)" stroke="#38BDF8" stroke-width="2" filter="url(#landGlow)" />' +
            '<g id="archipelago-hoangsa" transform="translate(370, 210)">' +
                '<rect x="0" y="0" width="135" height="90" rx="8" fill="rgba(15, 23, 42, 0.65)" stroke="#FBBF24" stroke-width="1.2" stroke-dasharray="4,3" />' +
                '<circle cx="35" cy="35" r="4.5" fill="#FDE047" filter="url(#goldGlow)" />' +
                '<circle cx="55" cy="25" r="3" fill="#FDE047" />' +
                '<circle cx="75" cy="40" r="4" fill="#FDE047" />' +
                '<circle cx="95" cy="30" r="3.5" fill="#FDE047" />' +
                '<circle cx="65" cy="55" r="3" fill="#FDE047" />' +
                '<circle cx="45" cy="65" r="3.5" fill="#FDE047" />' +
                '<rect x="8" y="66" width="120" height="18" rx="4" fill="#B91C1C" />' +
                '<text x="68" y="79" font-family="sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">⭐ QUẦN ĐẢO HOÀNG SA (VN)</text>' +
            '</g>' +
            '<g id="archipelago-truongsa" transform="translate(365, 410)">' +
                '<rect x="0" y="0" width="145" height="120" rx="8" fill="rgba(15, 23, 42, 0.65)" stroke="#FBBF24" stroke-width="1.2" stroke-dasharray="4,3" />' +
                '<circle cx="35" cy="30" r="3.5" fill="#FDE047" />' +
                '<circle cx="65" cy="25" r="4" fill="#FDE047" filter="url(#goldGlow)" />' +
                '<circle cx="95" cy="40" r="3" fill="#FDE047" />' +
                '<circle cx="120" cy="50" r="3.5" fill="#FDE047" />' +
                '<circle cx="45" cy="65" r="4.5" fill="#FDE047" filter="url(#goldGlow)" />' +
                '<circle cx="80" cy="75" r="3.5" fill="#FDE047" />' +
                '<circle cx="110" cy="85" r="3" fill="#FDE047" />' +
                '<circle cx="65" cy="95" r="4" fill="#FDE047" />' +
                '<rect x="10" y="96" width="125" height="18" rx="4" fill="#B91C1C" />' +
                '<text x="72" y="109" font-family="sans-serif" font-weight="900" font-size="9" fill="#FFFFFF" text-anchor="middle">⭐ QUẦN ĐẢO TRƯỜNG SA (VN)</text>' +
            '</g>' +
            '<g id="island-phuquoc" transform="translate(100, 565)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Kiên Giang\\', \\'VN-47\\')">' +
                '<ellipse cx="15" cy="18" rx="10" ry="16" transform="rotate(-20 15 18)" fill="#10B981" stroke="#38BDF8" stroke-width="1.5" />' +
                '<text x="28" y="22" font-family="sans-serif" font-weight="700" font-size="9" fill="#FDE047">Đảo Phú Quốc</text>' +
            '</g>' +
            '<g id="island-condao" transform="translate(225, 615)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Bà Rịa - Vũng Tàu\\', \\'VN-43\\')">' +
                '<circle cx="10" cy="10" r="5" fill="#10B981" stroke="#38BDF8" stroke-width="1.5" />' +
                '<text x="18" y="14" font-family="sans-serif" font-weight="700" font-size="9" fill="#BAE6FD">Côn Đảo</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-01" data-prov-name="Lai Châu" transform="translate(120, 85)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Lai Châu\\', \\'VN-01\\')">' +
                '<circle class="pin-pulse" r="10" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="8" y="-10" width="55" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="12" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">Lai Châu</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-05" data-prov-name="Sơn La" transform="translate(145, 120)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Sơn La\\', \\'VN-05\\')">' +
                '<circle class="pin-pulse" r="10" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="8" y="-10" width="50" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="12" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">Sơn La</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-HN" data-prov-name="Hà Nội" transform="translate(210, 105)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Hà Nội\\', \\'VN-HN\\')">' +
                '<circle class="pin-pulse" r="14" fill="rgba(253, 224, 71, 0.45)" />' +
                '<circle class="pin-dot" r="6" fill="#FDE047" stroke="#B45309" stroke-width="2" />' +
                '<rect x="10" y="-11" width="60" height="18" rx="4" fill="#B45309" stroke="#FDE047" stroke-width="1" />' +
                '<text x="14" y="2" font-family="sans-serif" font-size="10" font-weight="900" fill="#FEF08A">⭐ Hà Nội</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-DN" data-prov-name="Đà Nẵng" transform="translate(325, 325)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Đà Nẵng\\', \\'VN-DN\\')">' +
                '<circle class="pin-pulse" r="12" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="-65" y="-10" width="55" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="-61" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">Đà Nẵng</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-35" data-prov-name="Lâm Đồng" transform="translate(290, 460)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Lâm Đồng\\', \\'VN-35\\')">' +
                '<circle class="pin-pulse" r="10" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="8" y="-10" width="60" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="12" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">Lâm Đồng</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-39" data-prov-name="Đồng Nai" transform="translate(265, 500)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Đồng Nai\\', \\'VN-39\\')">' +
                '<circle class="pin-pulse-vip" r="18" fill="rgba(253, 224, 71, 0.55)" />' +
                '<circle class="pin-dot" r="7" fill="#FDE047" stroke="#DC2626" stroke-width="2.5" />' +
                '<rect x="12" y="-13" width="135" height="22" rx="6" fill="#B91C1C" stroke="#FDE047" stroke-width="1.5" filter="url(#goldGlow)" />' +
                '<text x="18" y="2" font-family="sans-serif" font-size="10" font-weight="900" fill="#FFFFFF">📍 ĐỒNG NAI (Chủ nhà)</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-SG" data-prov-name="TP. Hồ Chí Minh" transform="translate(240, 520)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'TP. Hồ Chí Minh\\', \\'VN-SG\\')">' +
                '<circle class="pin-pulse" r="12" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="-65" y="-10" width="55" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="-61" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">TP.HCM</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-50" data-prov-name="Bến Tre" transform="translate(240, 555)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Bến Tre\\', \\'VN-50\\')">' +
                '<circle class="pin-pulse" r="10" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="8" y="-10" width="55" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="12" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">Bến Tre</text>' +
            '</g>' +
            '<g class="map-province-pin" data-prov-id="VN-CT" data-prov-name="Cần Thơ" transform="translate(195, 565)" style="cursor: pointer;" onclick="window.selectProvinceFromMap(\\'Cần Thơ\\', \\'VN-CT\\')">' +
                '<circle class="pin-pulse" r="10" fill="rgba(56, 189, 248, 0.4)" />' +
                '<circle class="pin-dot" r="4.5" fill="#38BDF8" stroke="#FFFFFF" stroke-width="1.5" />' +
                '<rect x="-60" y="-10" width="52" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" stroke-width="0.8" />' +
                '<text x="-56" y="1" font-family="sans-serif" font-size="9" font-weight="800" fill="#FFFFFF">Cần Thơ</text>' +
            '</g>' +
        '</svg>';

        mapContainer.innerHTML = mapSvg;

        // Update status text
        const statusEl = document.getElementById('province-selection-status');
        if (statusEl) {
            statusEl.textContent = 'Bản đồ 63 tỉnh thành sẵn sàng • Nhấp vào điểm ghim để lọc đặc sản';
            statusEl.style.color = '#0369A1';
            statusEl.style.fontWeight = '700';
        }

        // Style clear button
        const clearBtn = document.getElementById('province-map-clear');
        if (clearBtn) {
            clearBtn.style.setProperty('background', '#0284C7', 'important');
            clearBtn.style.setProperty('color', '#FFFFFF', 'important');
            clearBtn.style.setProperty('font-weight', '800', 'important');
            clearBtn.style.setProperty('border', '1.5px solid #0369A1', 'important');
            clearBtn.style.setProperty('border-radius', '8px', 'important');
            clearBtn.style.setProperty('box-shadow', '0 2px 8px rgba(2, 132, 199, 0.3)', 'important');
        }

        // Sync with selectProvinceById
        const origSelectProvById = window.selectProvinceById;
        window.selectProvinceById = function (provId) {
            const PROV_MAP = {
                'VN-01': 'Lai Châu',
                'VN-05': 'Sơn La',
                'VN-HN': 'Hà Nội',
                'VN-DN': 'Đà Nẵng',
                'VN-35': 'Lâm Đồng',
                'VN-39': 'Đồng Nai',
                'VN-SG': 'TP. Hồ Chí Minh',
                'VN-50': 'Bến Tre',
                'VN-CT': 'Cần Thơ'
            };
            const provName = PROV_MAP[provId] || provId;
            window.selectProvinceFromMap(provName, provId);
            if (typeof origSelectProvById === 'function') {
                try { origSelectProvById(provId); } catch (e) { }
            }
        };

        // Sync with clearSelectedProvince
        const origClear = window.clearSelectedProvince;
        window.clearSelectedProvince = function () {
            if (typeof origClear === 'function') {
                try { origClear.apply(this, arguments); } catch (e) { }
            } else if (typeof onProvinceFilterChange === 'function') {
                onProvinceFilterChange('all');
            }

            document.querySelectorAll('.map-province-pin').forEach(pin => {
                const isVip = pin.dataset.provId === 'VN-39';
                const dot = pin.querySelector('.pin-dot');
                const pulse = pin.querySelector('.pin-pulse, .pin-pulse-vip');
                if (dot) {
                    dot.setAttribute('fill', isVip ? '#FDE047' : '#38BDF8');
                    dot.setAttribute('stroke', isVip ? '#DC2626' : '#FFFFFF');
                }
                if (pulse) {
                    pulse.setAttribute('fill', isVip ? 'rgba(253, 224, 71, 0.55)' : 'rgba(56, 189, 248, 0.4)');
                }
            });

            if (statusEl) {
                statusEl.textContent = 'Chưa chọn tỉnh/thành • Hiển thị 252 đặc sản toàn quốc';
            }
            if (clearBtn) {
                clearBtn.disabled = true;
            }
        };
    }`;

js = js.slice(0, commentIdx) + mapReplacement + js.slice(funcEndIdx);
console.log('✓ Successfully replaced map preservation with setupInteractiveVietnamMap');

// Replace the call in init: setupVietnamMapPreservation(); -> setupInteractiveVietnamMap();
js = js.replace(/setupVietnamMapPreservation\(\);/g, 'setupInteractiveVietnamMap();');

fs.writeFileSync('skytech-complete.js', js, 'utf8');
console.log('✓ Saved interactive map updates into skytech-complete.js');

