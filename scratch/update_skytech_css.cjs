const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'skytech-complete.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Remove dark blue background from #province-map
const oldMapCss = /#province-map \{[\s\S]*?min-height: 380px !important;\s*\}/;
const newMapCss = `#province-map {
    border: 1.5px solid #7DD3FC !important;
    border-radius: 18px !important;
    overflow: hidden !important;
    box-shadow: 0 8px 30px rgba(2, 132, 199, 0.15) !important;
    min-height: 380px !important;
}`;

if (oldMapCss.test(css)) {
    css = css.replace(oldMapCss, newMapCss);
    console.log('✓ #province-map CSS updated');
} else {
    console.warn('✗ oldMapCss regex did not match');
}

// 2. Unbox #shop-hero > div:first-child
const oldHeroBox = /#shop-hero > div:first-child \{[\s\S]*?padding: 2\.25rem !important;\s*\}/;
const newHeroBox = `#shop-hero > div:first-child {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: #0F172A !important;
    padding: 0 !important;
}`;

if (oldHeroBox.test(css)) {
    css = css.replace(oldHeroBox, newHeroBox);
    console.log('✓ #shop-hero > div:first-child unboxed in CSS');
} else {
    console.warn('✗ oldHeroBox regex did not match');
}

// 3. Set #admin-pin-modal z-index to 999999
if (!css.includes('#admin-pin-modal {')) {
    css += `\n\n/* PIN MODAL HIGHEST Z-INDEX */\n#admin-pin-modal {\n    z-index: 999999 !important;\n}\n`;
}

// 4. Header nav spacing & no wrap
const headerNavRules = `\n/* Header nav 1-row lock */\n.header-primary-nav {\n    display: inline-flex !important;\n    gap: 10px !important;\n    flex-wrap: nowrap !important;\n    white-space: nowrap !important;\n}\n.header-right-actions {\n    display: inline-flex !important;\n    align-items: center !important;\n    gap: 8px !important;\n    flex-shrink: 0 !important;\n    white-space: nowrap !important;\n}\n`;
css += headerNavRules;

fs.writeFileSync(cssPath, css, 'utf8');
console.log('skytech-complete.css updated successfully!');

