const fs = require('fs');

console.log('=== PREPARING NEW STUDIO & MAP IMPLEMENTATION ===');

// Read files
let js = fs.readFileSync('skytech-complete.js', 'utf8');
let css = fs.readFileSync('skytech-complete.css', 'utf8');

// 1. UPDATE CSS
// Add map animations & ensure clean player styling & #province-map-clear
const newCss = `
/* ==========================================================================
   VIETNAM INTERACTIVE MAP & CLEAN TIKTOK STUDIO (2026 EDITION)
   ========================================================================== */
#province-map {
    position: relative !important;
    width: 100% !important;
    min-height: 480px !important;
    height: 480px !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    border: 2px solid #38BDF8 !important;
    box-shadow: 0 10px 30px rgba(2, 132, 199, 0.25) !important;
    background: linear-gradient(180deg, #075985 0%, #0369A1 50%, #0284C7 100%) !important;
}

#province-map-clear,
.province-map-clear,
#ocop-intro-overlay .province-map-clear {
    background: #0284C7 !important;
    color: #FFFFFF !important;
    border: 1.5px solid #0369A1 !important;
    border-radius: 8px !important;
    font-weight: 800 !important;
    padding: 6px 14px !important;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3) !important;
    cursor: pointer !important;
    opacity: 1 !important;
    transition: all 0.2s ease !important;
}

#province-map-clear:hover:not(:disabled),
.province-map-clear:hover:not(:disabled),
#ocop-intro-overlay .province-map-clear:hover:not(:disabled) {
    background: #0369A1 !important;
    color: #FFFFFF !important;
    border-color: #38BDF8 !important;
    transform: translateY(-1px) !important;
}

#province-map-clear:disabled,
.province-map-clear:disabled,
#ocop-intro-overlay .province-map-clear:disabled {
    background: #94A3B8 !important;
    color: #F1F5F9 !important;
    border-color: #CBD5E1 !important;
    opacity: 0.65 !important;
    cursor: not-allowed !important;
    box-shadow: none !important;
}

@keyframes pinPulse {
    0% { r: 8px; opacity: 0.8; }
    50% { r: 16px; opacity: 0.2; }
    100% { r: 8px; opacity: 0.8; }
}

@keyframes pinPulseVip {
    0% { r: 10px; opacity: 0.9; }
    50% { r: 22px; opacity: 0.25; }
    100% { r: 10px; opacity: 0.9; }
}

.pin-pulse {
    animation: pinPulse 2s infinite ease-in-out;
}

.pin-pulse-vip {
    animation: pinPulseVip 1.5s infinite ease-in-out;
}

.tiktok-phone-mockup,
.tiktok-video-player {
    width: 300px !important;
    height: 533px !important;
    margin: 0 auto !important;
    border-radius: 12px !important;
    border: 1.5px solid #38BDF8 !important;
    background: #0F172A !important;
    position: relative !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25) !important;
    overflow: hidden !important;
}

.tiktok-phone-island {
    display: none !important;
}
`;

css += '\n' + newCss;
fs.writeFileSync('skytech-complete.css', css, 'utf8');
console.log('✓ Updated skytech-complete.css');

