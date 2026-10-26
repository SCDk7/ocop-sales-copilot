const fs = require('fs');

let css = fs.readFileSync('skytech-complete.css', 'utf8');

// 1. Replace #province-map-select
const oldSelect = `#province-map-select {
    background: #0369A1 !important;
    color: #FFFFFF !important;
    border: 1px solid #38BDF8 !important;
    border-radius: 12px !important;
    font-weight: 700 !important;
}`;

const newSelect = `#province-map-select,
select#province-map-select {
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    border: 1.5px solid #38BDF8 !important;
    border-radius: 10px !important;
    font-weight: 700 !important;
    padding: 6px 12px !important;
    outline: none !important;
    box-shadow: 0 1px 4px rgba(2, 132, 199, 0.1) !important;
}`;

if (css.includes(oldSelect)) {
    css = css.replace(oldSelect, newSelect);
    console.log('✓ Replaced #province-map-select (LF)');
} else if (css.includes(oldSelect.replace(/\n/g, '\r\n'))) {
    css = css.replace(oldSelect.replace(/\n/g, '\r\n'), newSelect.replace(/\n/g, '\r\n'));
    console.log('✓ Replaced #province-map-select (CRLF)');
} else {
    console.error('❌ Could not find oldSelect in skytech-complete.css');
}

// 2. Replace #province-map in 2026 edition section
const oldMap = `#province-map {
    position: relative !important;
    width: 100% !important;
    min-height: 480px !important;
    height: 480px !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    border: 2px solid #38BDF8 !important;
    box-shadow: 0 10px 30px rgba(2, 132, 199, 0.25) !important;
    background: linear-gradient(180deg, #075985 0%, #0369A1 50%, #0284C7 100%) !important;
}`;

const newMap = `#province-map {
    position: relative !important;
    width: 100% !important;
    min-height: 440px !important;
    height: 440px !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    border: 2px solid #38BDF8 !important;
    box-shadow: 0 10px 30px rgba(11, 25, 44, 0.45) !important;
    background: #0B192C !important;
}`;

if (css.includes(oldMap)) {
    css = css.replace(oldMap, newMap);
    console.log('✓ Replaced #province-map (LF)');
} else if (css.includes(oldMap.replace(/\n/g, '\r\n'))) {
    css = css.replace(oldMap.replace(/\n/g, '\r\n'), newMap.replace(/\n/g, '\r\n'));
    console.log('✓ Replaced #province-map (CRLF)');
} else {
    console.error('❌ Could not find oldMap in skytech-complete.css');
}

// 3. Append Leaflet Dark-Navy, Maritime Sovereignty, Red Pin & Store Cards styles
const additionalCss = `
/* LEAFLET DARK-NAVY VIETNAM MAP & SOVEREIGNTY STYLING */
#province-map .leaflet-container {
    background: #0B192C !important;
    font-family: inherit !important;
}

.bien-dong-label {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    pointer-events: none !important;
    user-select: none !important;
}

.sovereign-island-marker {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

.sovereign-island-badge:hover {
    transform: scale(1.05);
    border-color: #FDE047 !important;
    box-shadow: 0 6px 18px rgba(245, 158, 11, 0.7) !important;
}

/* LARGE RED GOOGLE MAPS PIN (SVG) WITH RIPPLE WAVE */
.leaflet-red-pin-wrapper {
    position: relative;
    width: 34px;
    height: 46px;
    transform: translate(-17px, -46px);
    pointer-events: none;
}

.leaflet-red-pin-wrapper svg {
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.65));
    animation: pinDropBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pinDropBounce {
    0% { transform: translateY(-30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}

.pin-ripple-pulse {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 8px;
    background: rgba(220, 38, 38, 0.45);
    border-radius: 50%;
    animation: pinPulseWave 1.6s infinite ease-out;
}

@keyframes pinPulseWave {
    0% { transform: translateX(-50%) scale(0.6); opacity: 0.9; }
    100% { transform: translateX(-50%) scale(2.4); opacity: 0; }
}

/* OCOP PROVINCE STORES PANEL */
#province-stores-panel .store-item-card {
    transition: all 0.25s ease;
}

#province-stores-panel .store-item-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(2, 132, 199, 0.15) !important;
    border-color: #38BDF8 !important;
}
`;

if (!css.includes('.bien-dong-label')) {
    css += (css.includes('\r\n') ? additionalCss.replace(/\n/g, '\r\n') : additionalCss);
    console.log('✓ Appended additional CSS');
}

fs.writeFileSync('skytech-complete.css', css, 'utf8');
console.log('✓ Saved updated skytech-complete.css');
