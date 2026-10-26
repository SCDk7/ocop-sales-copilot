const fs = require('fs');
const path = require('path');

console.log('=== STARTING LEAFLET VIETNAM MAP & TIKTOK AUDIO OVERHAUL ===');

// ============================================================================
// 1. UPDATE index.html
// ============================================================================
let html = fs.readFileSync('index.html', 'utf8');

// 1.1 Remove (Chủ nhà) from Đồng Nai quick button
const oldDongNaiBtn = `<button type="button" onclick="selectProvinceById('VN-39')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:scale-105" style="background: #0284C7; color: #FFFFFF; border: 1px solid #0369A1; font-weight: 800;">⭐ Đồng Nai (Chủ nhà)</button>`;
const newDongNaiBtn = `<button type="button" onclick="selectProvinceById('VN-39')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer hover:bg-sky-100" style="background: #E0F2FE; color: #0369A1; border: 1px solid #BAE6FD;">Đồng Nai</button>`;

if (html.includes(oldDongNaiBtn)) {
    html = html.replace(oldDongNaiBtn, newDongNaiBtn);
    console.log('✓ Replaced Đồng Nai button in index.html (removed (Chủ nhà))');
} else {
    // Regex fallback
    html = html.replace(/<button[^>]*selectProvinceById\('VN-39'\)[^>]*>[^<]*<\/button>/, newDongNaiBtn);
    console.log('✓ Replaced Đồng Nai button via regex in index.html');
}

// 1.2 Add #province-stores-panel below #province-map-clear
if (!html.includes('id="province-stores-panel"')) {
    const targetMapClearEnd = `</button>
                    </div>`;
    const replacementWithPanel = `</button>
                    </div>
                    <!-- DANH SÁCH CỬA HÀNG & ĐIỂM BÁN CHỨNG NHẬN OCOP TẠI TỈNH -->
                    <div id="province-stores-panel" class="hidden mt-3 transition-all duration-300"></div>`;
    
    if (html.includes(targetMapClearEnd)) {
        html = html.replace(targetMapClearEnd, replacementWithPanel);
        console.log('✓ Inserted #province-stores-panel in index.html');
    } else {
        console.warn('⚠️ Could not find exact targetMapClearEnd in index.html');
    }
}

// 1.3 Update getProvinceStyle in index.html for Sky-Tech Dark-Navy Leaflet Map
const oldGetProvinceStyle = `        function getProvinceStyle(feature) {
            const isSelected = selectedProvince?.id === feature.properties.id;
            return {
                color: isSelected ? '#8c6b16' : '#fffdf7',
                weight: isSelected ? 3 : 1.1,
                opacity: 1,
                fillColor: isSelected ? '#d4af37' : '#165b46',
                fillOpacity: isSelected ? 0.82 : 0.58
            };
        }`;

const newGetProvinceStyle = `        function getProvinceStyle(feature) {
            const isSelected = selectedProvince && (selectedProvince.id === feature.properties.id || normalizeProvinceName(selectedProvince.name) === normalizeProvinceName(feature.properties.name));
            return {
                color: isSelected ? '#FDE047' : '#38BDF8',
                weight: isSelected ? 2.5 : 1,
                opacity: isSelected ? 1 : 0.75,
                fillColor: isSelected ? '#0284C7' : '#075985',
                fillOpacity: isSelected ? 0.75 : 0.35
            };
        }`;

if (html.includes(oldGetProvinceStyle)) {
    html = html.replace(oldGetProvinceStyle, newGetProvinceStyle);
    console.log('✓ Updated getProvinceStyle in index.html');
}

// 1.4 Helper function for stores lookup and store panel rendering in index.html
const storeHelperFunctions = `
        // OCOP Stores lookup & rendering for selected province
        function findStoresForProvinceName(provName) {
            if (!provName) return [];
            const norm = typeof normalizeProvinceName === 'function' 
                ? normalizeProvinceName(provName)
                : provName.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            let list = [];
            if (typeof OcopStores !== 'undefined' && OcopStores.STORE_MAP) {
                list = Object.values(OcopStores.STORE_MAP).filter(s => {
                    if (!s || !s.region) return false;
                    const normRegion = typeof normalizeProvinceName === 'function'
                        ? normalizeProvinceName(s.region)
                        : s.region.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return normRegion.includes(norm) || norm.includes(normRegion);
                });
            }
            if (typeof OcopStores !== 'undefined' && OcopStores.MAJOR_OCOP_CENTERS) {
                const centers = OcopStores.MAJOR_OCOP_CENTERS.filter(c => {
                    const normCity = typeof normalizeProvinceName === 'function'
                        ? normalizeProvinceName(c.city)
                        : c.city.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return normCity.includes(norm) || norm.includes(normCity);
                }).map(c => ({
                    id: 9999,
                    productName: 'Trung tâm Xúc tiến Thương mại & Trưng bày OCOP Quốc Gia (' + c.city + ')',
                    stars: 5,
                    region: c.city,
                    producerName: c.name,
                    producerAddress: c.address,
                    certDecision: 'Điểm OCOP Quốc Gia Đạt Chuẩn 5 Sao',
                    hotline: c.hotline,
                    primaryStore: {
                        name: c.name,
                        address: c.address,
                        phone: c.hotline,
                        hours: c.hours
                    },
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.name + ', ' + c.address)
                }));
                list = [...centers, ...list];
            }
            // Fallback to data.js products if empty
            if (list.length === 0 && Array.isArray(products)) {
                const prodMatches = products.filter(p => {
                    const normReg = typeof normalizeProvinceName === 'function'
                        ? normalizeProvinceName(p.region)
                        : (p.region || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                    return normReg.includes(norm) || norm.includes(normReg);
                });
                list = prodMatches.slice(0, 4).map(p => ({
                    id: p.id,
                    productName: p.name,
                    stars: p.stars || 4,
                    region: p.region || provName,
                    producerName: p.producer || ('Hợp tác xã / Cơ sở ' + p.name),
                    producerAddress: p.address || ('Đặc sản OCOP tỉnh ' + p.region),
                    certDecision: 'Chứng nhận OCOP ' + (p.stars || 4) + ' Sao cấp tỉnh',
                    hotline: '1900.8888',
                    primaryStore: {
                        name: 'Điểm Giới Thiệu & Bán Đặc Sản: ' + p.name,
                        address: p.address || ('Showroom OCOP tỉnh ' + p.region),
                        phone: '1900.8888',
                        hours: '08:00 - 21:00'
                    },
                    mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + (p.address || p.region))
                }));
            }
            const seen = new Set();
            return list.filter(item => {
                const key = (item.primaryStore?.address || item.producerAddress || item.producerName || '').toLowerCase();
                if (key && !seen.has(key)) {
                    seen.add(key);
                    return true;
                }
                return false;
            });
        }

        let activeLeafletRedPin = null;

        function placeLeafletRedPin(latlng) {
            if (activeLeafletRedPin && provinceMap) {
                try { provinceMap.removeLayer(activeLeafletRedPin); } catch (e) {}
                activeLeafletRedPin = null;
            }
            if (!provinceMap || !latlng || typeof L === 'undefined') return;

            const redPinIcon = L.divIcon({
                className: 'leaflet-red-pin-wrapper',
                html: '<div class="pin-ripple-pulse"></div>' +
                      '<svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                      '<path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 46 17 46C17 46 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#DC2626"/>' +
                      '<circle cx="17" cy="17" r="7.5" fill="#FFFFFF"/>' +
                      '<circle cx="17" cy="17" r="4.5" fill="#DC2626"/>' +
                      '</svg>',
                iconSize: [34, 46],
                iconAnchor: [17, 46]
            });

            activeLeafletRedPin = L.marker(latlng, { icon: redPinIcon, zIndexOffset: 2000 }).addTo(provinceMap);
        }

        function removeLeafletRedPin() {
            if (activeLeafletRedPin && provinceMap) {
                try { provinceMap.removeLayer(activeLeafletRedPin); } catch (e) {}
                activeLeafletRedPin = null;
            }
        }

        function renderProvinceStoresPanel(provinceName) {
            const panel = document.getElementById('province-stores-panel');
            if (!panel) return;
            if (!provinceName || provinceName === 'all') {
                panel.classList.add('hidden');
                panel.innerHTML = '';
                return;
            }

            const stores = findStoresForProvinceName(provinceName);
            if (!stores || stores.length === 0) {
                panel.classList.add('hidden');
                panel.innerHTML = '';
                return;
            }

            const storeCardsHtml = stores.map(s => {
                const sName = s.primaryStore?.name || s.producerName || s.productName;
                const sAddress = s.primaryStore?.address || s.producerAddress || 'Địa chỉ đang cập nhật';
                const sPhone = s.primaryStore?.phone || s.hotline || '1900.8888';
                const sHours = s.primaryStore?.hours || '08:00 - 21:00';
                const sStars = s.stars || 4;
                const starIcons = '⭐'.repeat(sStars);
                const mapUrl = s.mapUrl || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(sName + ' ' + sAddress));

                return '<div class="store-item-card bg-white rounded-xl p-3.5 border border-sky-200 shadow-xs hover:shadow-md hover:border-sky-400 transition-all duration-200 flex flex-col justify-between" style="background: #FFFFFF !important; border: 1.5px solid #BAE6FD !important; border-radius: 12px !important;">' +
                    '<div>' +
                        '<div class="flex items-start justify-between gap-2 mb-1.5">' +
                            '<h5 class="text-xs font-black text-slate-800 leading-snug line-clamp-2" style="color: #0F172A !important;">' +
                                '🏪 ' + sName +
                            '</h5>' +
                            '<span class="inline-flex shrink-0 items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200" style="background: #FEF3C7 !important; color: #78350F !important; border: 1px solid #FDE68A !important;">' +
                                starIcons + ' ' + sStars + ' Sao' +
                            '</span>' +
                        '</div>' +
                        '<p class="text-[11px] text-slate-600 mb-1 flex items-start gap-1" style="color: #475569 !important;">' +
                            '<span class="shrink-0 text-sky-600 font-bold">📍</span>' +
                            '<span class="line-clamp-2">' + sAddress + '</span>' +
                        '</p>' +
                        '<div class="flex items-center gap-3 text-[10px] text-slate-500 mb-2" style="color: #64748B !important;">' +
                            '<span>📞 <b>' + sPhone + '</b></span>' +
                            '<span>⏰ ' + sHours + '</span>' +
                        '</div>' +
                        '<p class="text-[10px] text-sky-800 font-semibold line-clamp-1 bg-sky-50 px-2 py-1 rounded-md mb-2" style="background: #F0F9FF !important; color: #0369A1 !important; border: 1px solid #E0F2FE !important;">' +
                            '🌾 Đặc sản: ' + (s.productName || 'Nông sản OCOP') +
                        '</p>' +
                    '</div>' +
                    '<div class="pt-2 border-t border-slate-100 flex items-center justify-between" style="border-top: 1px solid #F1F5F9 !important;">' +
                        '<a href="' + mapUrl + '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-black text-sky-600 hover:text-sky-800 hover:underline" style="color: #0284C7 !important;">' +
                            '<span>🗺️ Chỉ đường Google Maps</span>' +
                            '<i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>' +
                        '</a>' +
                        '<button type="button" onclick="window.askAiAboutStore(' + (s.id || 0) + ')" class="px-2.5 py-1 rounded-lg text-[10px] font-black bg-sky-600 hover:bg-sky-700 text-white transition cursor-pointer" style="background: #0284C7 !important; color: #FFFFFF !important; border-radius: 6px !important;">' +
                            '💬 Hỏi AI điểm bán' +
                        '</button>' +
                    '</div>' +
                '</div>';
            }).join('');

            panel.innerHTML = '<div class="bg-gradient-to-br from-white via-sky-50/40 to-blue-50/50 rounded-2xl p-4 border border-sky-300 shadow-md" style="background: #FFFFFF !important; border: 1.5px solid #7DD3FC !important; border-radius: 16px !important; box-shadow: 0 4px 16px rgba(2, 132, 199, 0.12) !important;">' +
                '<div class="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-sky-100" style="border-bottom: 1.5px solid #E0F2FE !important;">' +
                    '<div class="flex items-center gap-2">' +
                        '<span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-sm shadow-xs" style="background: #0284C7 !important; color: #FFFFFF !important;">' +
                            '🏪' +
                        '</span>' +
                        '<div>' +
                            '<h4 class="text-xs sm:text-sm font-black text-sky-950 uppercase tracking-tight" style="color: #0C4A6E !important; margin: 0;">' +
                                'Các Cửa Hàng & Điểm Bán Chứng Nhận OCOP tại <span style="color: #0284C7;">' + provinceName + '</span>' +
                            '</h4>' +
                            '<p class="text-[10px] text-slate-500 m-0" style="color: #64748B !important;">Mạng lưới phân phối chính thức • Truy xuất nguồn gốc &amp; bản đồ chỉ đường</p>' +
                        '</div>' +
                    '</div>' +
                    '<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-200" style="background: #E0F2FE !important; color: #0369A1 !important; border: 1px solid #BAE6FD !important;">' +
                        '📍 ' + stores.length + ' Điểm Bán OCOP' +
                    '</span>' +
                '</div>' +
                '<div class="grid grid-cols-1 md:grid-cols-2 gap-3">' +
                    storeCardsHtml +
                '</div>' +
            '</div>';

            panel.classList.remove('hidden');
            panel.style.setProperty('display', 'block', 'important');
        }
`;

// Insert storeHelperFunctions right before initializeProvinceMap
if (!html.includes('function findStoresForProvinceName(')) {
    html = html.replace('async function initializeProvinceMap() {', storeHelperFunctions + '\n        async function initializeProvinceMap() {');
    console.log('✓ Inserted storeHelperFunctions in index.html');
}

// 1.5 Update initializeProvinceMap in index.html to use CartoDB dark_nolabels + sovereign maritime markers
const oldMapInitCode = `                const satelliteLayer = L.tileLayer(
                    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                    {
                        maxZoom: 19,
                        attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics, and the GIS User Community'
                    }
                );
                const geographicLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });

                provinceMap = L.map('province-map', {
                    layers: [satelliteLayer],
                    scrollWheelZoom: false,
                    zoomControl: true
                });
                const layerLabels = {
                    vi: { 'Vệ tinh': satelliteLayer, 'Địa lý': geographicLayer },
                    en: { Satellite: satelliteLayer, Geographic: geographicLayer },
                    zh: { '卫星图': satelliteLayer, '地理图': geographicLayer },
                    ko: { '위성 지도': satelliteLayer, '지리 지도': geographicLayer },
                    ja: { '衛星写真': satelliteLayer, '地理地図': geographicLayer }
                };
                L.control.layers(
                    layerLabels[currentLanguage] || layerLabels.vi,
                    null,
                    { collapsed: true }
                ).addTo(provinceMap);`;

const newMapInitCode = `                // CARTO Dark-Navy No-Labels tile layer (Clean, ZERO foreign labels / No East Sea foreign text)
                const darkNavyLayer = L.tileLayer(
                    'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                    {
                        subdomains: 'abcd',
                        maxZoom: 19,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    }
                );

                provinceMap = L.map('province-map', {
                    center: [16.0, 107.8],
                    zoom: 5.5,
                    minZoom: 4.8,
                    maxZoom: 13,
                    layers: [darkNavyLayer],
                    scrollWheelZoom: false,
                    zoomControl: true
                });
                window.provinceMap = provinceMap;

                // 1. CHỦ QUYỀN BIỂN ĐÔNG (Chữ in hoa cố định màu xanh sáng/trắng)
                const bienDongIcon = L.divIcon({
                    className: 'bien-dong-label',
                    html: '<span style="font-size: 13px; font-weight: 900; letter-spacing: 3px; color: #38BDF8; text-shadow: 0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(56,189,248,0.7); text-transform: uppercase;">BIỂN ĐÔNG</span>',
                    iconSize: [140, 24],
                    iconAnchor: [70, 12]
                });
                L.marker([14.5, 111.5], { icon: bienDongIcon, interactive: false }).addTo(provinceMap);

                // 2. QUẦN ĐẢO HOÀNG SA (Đà Nẵng - Việt Nam)
                const hoangSaIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div class="sovereign-island-badge" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; background: rgba(15, 23, 42, 0.9); border: 1.5px solid #F59E0B; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); color: #FFFFFF; font-size: 10.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">' +
                          '<span>🇻🇳</span><span style="color: #FEF08A; font-weight: 900;">Quần đảo Hoàng Sa</span><span style="color: #93C5FD; font-size: 9px;">(Đà Nẵng - VN)</span>' +
                          '</div>',
                    iconSize: [210, 28],
                    iconAnchor: [105, 14]
                });
                L.marker([16.5, 112.0], { icon: hoangSaIcon }).addTo(provinceMap).on('click', () => {
                    provinceMap.flyTo([16.5, 112.0], 8, { duration: 1.2 });
                    if (typeof showToast === 'function') {
                        showToast('🇻🇳 Quần đảo Hoàng Sa thuộc chủ quyền thiêng liêng của nước CHXHCN Việt Nam (Trực thuộc TP. Đà Nẵng)', 'info');
                    }
                });

                // 3. QUẦN ĐẢO TRƯỜNG SA (Khánh Hòa - Việt Nam)
                const truongSaIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div class="sovereign-island-badge" style="display: inline-flex; align-items: center; gap: 5px; padding: 4px 9px; background: rgba(15, 23, 42, 0.9); border: 1.5px solid #F59E0B; border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,0.6); color: #FFFFFF; font-size: 10.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">' +
                          '<span>🇻🇳</span><span style="color: #FEF08A; font-weight: 900;">Quần đảo Trường Sa</span><span style="color: #93C5FD; font-size: 9px;">(Khánh Hòa - VN)</span>' +
                          '</div>',
                    iconSize: [210, 28],
                    iconAnchor: [105, 14]
                });
                L.marker([10.0, 114.0], { icon: truongSaIcon }).addTo(provinceMap).on('click', () => {
                    provinceMap.flyTo([10.0, 114.0], 8, { duration: 1.2 });
                    if (typeof showToast === 'function') {
                        showToast('🇻🇳 Quần đảo Trường Sa thuộc chủ quyền thiêng liêng của nước CHXHCN Việt Nam (Trực thuộc tỉnh Khánh Hòa)', 'info');
                    }
                });

                // 4. ĐẢO PHÚ QUỐC
                const phuQuocIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div style="display: inline-flex; align-items: center; padding: 3px 8px; background: rgba(15, 23, 42, 0.85); border: 1px solid #38BDF8; border-radius: 999px; color: #E0F2FE; font-size: 9.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">' +
                          '<span>🏝️ Đảo Phú Quốc</span></div>',
                    iconSize: [110, 22],
                    iconAnchor: [55, 11]
                });
                L.marker([10.22, 103.96], { icon: phuQuocIcon }).addTo(provinceMap).on('click', () => {
                    selectProvinceById('VN-47');
                });

                // 5. CÔN ĐẢO
                const conDaoIcon = L.divIcon({
                    className: 'sovereign-island-marker',
                    html: '<div style="display: inline-flex; align-items: center; padding: 3px 8px; background: rgba(15, 23, 42, 0.85); border: 1px solid #38BDF8; border-radius: 999px; color: #E0F2FE; font-size: 9.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">' +
                          '<span>🏝️ Côn Đảo</span></div>',
                    iconSize: [85, 22],
                    iconAnchor: [42, 11]
                });
                L.marker([8.68, 106.60], { icon: conDaoIcon }).addTo(provinceMap).on('click', () => {
                    selectProvinceById('VN-43');
                });`;

if (html.includes(oldMapInitCode)) {
    html = html.replace(oldMapInitCode, newMapInitCode);
    console.log('✓ Replaced map tiles and added sovereign island markers in index.html');
}

// 1.6 Update onProvinceFilterChange in index.html to hook flyTo, Red Pin, and Store Panel
const oldProvinceFilterChangeTail = `                } else {
                    showToast(\`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc (63 Tỉnh Thành • \${sortedList.length} Sản phẩm)\`, "info");
                }`;

const newProvinceFilterChangeTail = `                } else {
                    showToast(\`⚡ AI Engine: Đã đồng bộ mạng lưới đặc sản toàn quốc (63 Tỉnh Thành • \${sortedList.length} Sản phẩm)\`, "info");
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
                    renderProvinceStoresPanel(selectedProvince.name);
                } else {
                    if (provinceMap) {
                        provinceMap.flyTo([16.0, 107.8], 5.5, { duration: 1.2 });
                    }
                    removeLeafletRedPin();
                    renderProvinceStoresPanel(null);
                }`;

if (html.includes(oldProvinceFilterChangeTail) && !html.includes('renderProvinceStoresPanel(selectedProvince.name)')) {
    html = html.replace(oldProvinceFilterChangeTail, newProvinceFilterChangeTail);
    console.log('✓ Connected Leaflet flyTo, Red Pin, and Store Panel to onProvinceFilterChange in index.html');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Saved updated index.html');

console.log('=== STEP 1 COMPLETED ===');

