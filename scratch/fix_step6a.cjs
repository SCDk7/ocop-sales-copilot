const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const introHeaderRegex = /<div class="intro-header relative z-50 pointer-events-auto max-w-5xl mx-auto w-full flex items-center justify-between pb-3.5 border-b border-amber-400\/30">[\s\S]*?(?=<div class="lang-dropdown-container" id="intro-lang-dropdown-container">)/;

const replacementIntroHeader = `<div class="intro-header relative z-50 pointer-events-auto max-w-5xl mx-auto w-full flex items-center justify-between pb-3.5 border-b border-sky-300/40" style="background: transparent !important; border-radius: 0 !important; box-shadow: none !important;">
            <div class="flex items-center space-x-3">
                <div class="intro-brand-mark relative w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center text-white text-lg shadow-md group">
                    <i class="fa-solid fa-leaf text-amber-300"></i>
                </div>
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="block text-xs sm:text-sm font-black text-sky-200 tracking-wider leading-none">OCOP SALES COPILOT</span>
                    </div>
                    <span class="text-[9px] sm:text-[10px] text-sky-300 uppercase font-bold tracking-widest" id="i18n-intro-badge">Hệ điều hành số & Trợ lý quản trị đặc sản Việt Nam</span>
                </div>
            </div>

            <div class="flex items-center space-x-2 sm:space-x-3">
                <button type="button" onclick="enterOcopMarket('all')" class="px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer bg-sky-600 hover:bg-sky-500 text-white shadow-sm border border-sky-400">
                    <span>Khám phá đặc sản 63 tỉnh thành →</span>
                </button>
                `;

if (introHeaderRegex.test(html)) {
    html = html.replace(introHeaderRegex, replacementIntroHeader);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✓ Step 6a: Intro header successfully replaced!');
} else {
    console.warn('✗ Step 6a: Regex still did not match');
}

