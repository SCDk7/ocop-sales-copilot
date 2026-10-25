const fs = require('fs');

console.log('=== APPENDING SUPER VIP RULES TO skytech-complete.css ===');

let css = fs.readFileSync('skytech-complete.css', 'utf8');

const vipRules = `
/* ==========================================================================
   SUPER VIP: ZERO TEXT-SHADOW, SHARP CONTRAST, STANDALONE TIKTOK STUDIO MODAL
   ========================================================================== */

* {
    text-shadow: none !important;
}

#i18n-hero-title1 {
    overflow: visible !important;
    padding-left: 12px !important;
    margin-left: 0 !important;
    text-indent: 0 !important;
    display: inline-block !important;
    color: #0F172A !important;
}

#shop-hero h2,
#shop-hero .lg\\:col-span-7,
#shop-hero .lg\\:col-span-7 > div {
    overflow: visible !important;
}

#shop-hero .absolute h3,
#shop-hero .absolute p,
#shop-hero .absolute #i18n-hero-banner-sub {
    color: #FFFFFF !important;
    text-shadow: none !important;
}

#shop-hero .absolute #i18n-hero-badge-tag {
    background: #0284C7 !important;
    color: #FFFFFF !important;
    border: 1px solid #38BDF8 !important;
}

.lang-dropdown-btn,
#header-lang-dropdown-btn,
#intro-lang-dropdown-btn {
    background: #F0F9FF !important;
    border: 1.5px solid #7DD3FC !important;
    color: #0369A1 !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08) !important;
}

.lang-dropdown-btn span,
.lang-dropdown-btn i,
#header-lang-dropdown-btn span,
#header-lang-dropdown-btn i,
#intro-lang-dropdown-btn span,
#intro-lang-dropdown-btn i {
    color: #0369A1 !important;
    font-weight: 800 !important;
}

#btn-header-tiktok {
    background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%) !important;
    color: #FFFFFF !important;
    border: 1px solid #38BDF8 !important;
    box-shadow: 0 2px 10px rgba(2, 132, 199, 0.25) !important;
}

#btn-header-tiktok span,
#btn-header-tiktok i {
    color: #FFFFFF !important;
}

#tiktok-studio-modal {
    z-index: 999999 !important;
}

#tiktok-studio-modal > div {
    background: #FFFFFF !important;
    border: 2px solid #7DD3FC !important;
    border-radius: 24px !important;
    box-shadow: 0 25px 60px rgba(2, 132, 199, 0.25) !important;
}

#product-grid p,
.product-card p {
    color: #334155 !important;
    font-weight: 500 !important;
}

.intro-province-quick-chips button:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 10px rgba(2, 132, 199, 0.2) !important;
}
`;

if (!css.includes('SUPER VIP: ZERO TEXT-SHADOW')) {
    css += '\n' + vipRules;
    fs.writeFileSync('skytech-complete.css', css, 'utf8');
    console.log('✓ Appended SUPER VIP rules to skytech-complete.css');
} else {
    console.log('• skytech-complete.css already contains SUPER VIP rules');
}

console.log('=== DONE ===');

