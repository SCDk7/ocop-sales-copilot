const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const targetStr = '<button onclick="closeFinancialDashboardModal()" class="w-8 h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 flex items-center justify-center text-sm transition cursor-pointer">\n                    <i class="fa-solid fa-xmark"></i>\n                </button>';

const replacementStr = `<button type="button" onclick="closeFinancialDashboardModal()" id="btn-close-fin-modal-sticky" style="position: sticky; top: 12px; right: 12px; z-index: 999999; background: #EF4444 !important; color: #FFFFFF !important; padding: 8px 18px !important; border-radius: 999px !important; cursor: pointer; font-weight: 700 !important; border: none !important; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4) !important;" title="Đóng Bảng Quản Trị">
                    <i class="fa-solid fa-xmark mr-1"></i> ✖ Đóng
                </button>`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replacementStr);
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✓ Sticky red close button successfully inserted in ai-financial-modal!');
} else {
    // Regex replace
    const regex = /<button onclick="closeFinancialDashboardModal\(\)" class="w-8 h-8 rounded-full[\s\S]*?<\/button>/;
    if (regex.test(html)) {
        html = html.replace(regex, replacementStr);
        fs.writeFileSync(indexPath, html, 'utf8');
        console.log('✓ Sticky red close button successfully inserted (via regex)!');
    } else {
        console.warn('✗ Could not match target');
    }
}

