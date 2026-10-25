const fs = require('fs');
const html = fs.readFileSync('ocop-sales-copilot/index.html', 'utf8');

// Check top announcement bar
const topBarMatch = html.includes('<!-- 1. TOP ANNOUNCEMENT BAR -->');
console.log('topBarMatch:', topBarMatch);

// Check header
const headerMatch = html.includes('<!-- 2. HEADER: SINGLE STICKY OCOP AI HUB -->');
console.log('headerMatch:', headerMatch);

// Check hero section
const heroMatch = html.includes('<!-- 3. HERO BANNER SECTION -->');
console.log('heroMatch:', heroMatch);

// Check why choose us section
const whyMatch = html.includes('id="why-choose-us-section"');
console.log('whyMatch:', whyMatch);

// Check judge quick access bar
const judgeMatch = html.includes('id="judge-quick-access-bar"');
console.log('judgeMatch:', judgeMatch);

// Check intro header
const introHeaderMatch = html.includes('<div class="intro-header');
console.log('introHeaderMatch:', introHeaderMatch);

// Check intro actions
const introActionsMatch = html.includes('<!-- MEGA CALL-TO-ACTION (CTA) 3 NÚT HÀNH ĐỘNG HỆ ĐIỀU HÀNH SỐ -->');
console.log('introActionsMatch:', introActionsMatch);

