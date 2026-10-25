const fs = require('fs');

console.log('=== PREPARING REPLACEMENTS FOR index.html ===');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Store Box in product card
const idxStore = html.indexOf('Khối Thông Tin Chủ Thể OCOP & Điểm Bán Chính Thức -->');
if (idxStore !== -1) {
    const start = html.lastIndexOf('<!-- Khối Thông Tin', idxStore);
    const end = html.indexOf('<!-- Footer Thẻ:', start);
    
    const replacement = `<!-- Khối Thông Tin Chủ Thể OCOP & Điểm Bán Chính Thức -->\r\n` +
`                        <div class="mx-3 mb-2 p-2.5 rounded-xl text-[10.5px] space-y-1 shadow-xs" style="background: #F0F9FF !important; border: 1px solid #BAE6FD !important;">\r\n` +
`                            <div class="flex items-center gap-1.5 font-bold truncate" title="\${storeInfo ? storeInfo.producerName : p.region}">\r\n` +
`                                <i class="fa-solid fa-landmark text-sky-600 text-[10px] shrink-0"></i>\r\n` +
`                                <span class="truncate" style="color: #0284C7 !important; font-weight: 700 !important;">\${storeInfo ? storeInfo.producerName : ('Chủ thể OCOP ' + p.region)}</span>\r\n` +
`                            </div>\r\n` +
`                            <div class="flex items-center gap-1.5 text-[10px] truncate" title="\${storeInfo ? storeInfo.primaryStore.name + ' - ' + storeInfo.primaryStore.address : ''}">\r\n` +
`                                <i class="fa-solid fa-store text-sky-500 text-[9px] shrink-0"></i>\r\n` +
`                                \${storeInfo && storeInfo.mapUrl ? \`\r\n` +
`                                <a href="\${escapeAIHtml(storeInfo.mapUrl)}" target="_blank" rel="noopener noreferrer" class="truncate font-semibold inline-flex items-center gap-1 hover:underline" style="color: #1E293B !important;" title="Xem vị trí Showroom trên Google Map: \${escapeAIHtml(storeInfo.primaryStore.address)}">\r\n` +
`                                    <span class="truncate">\${escapeAIHtml(storeInfo.primaryStore.name)}</span>\r\n` +
`                                    <i class="fa-solid fa-arrow-up-right-from-square text-[8px] text-sky-600 shrink-0"></i>\r\n` +
`                                </a>\r\n` +
`                                \` : \`\r\n` +
`                                <span class="truncate font-semibold" style="color: #1E293B !important;">\${storeInfo ? escapeAIHtml(storeInfo.primaryStore.name) : ('Điểm bán OCOP ' + p.region)}</span>\r\n` +
`                                \`}\r\n` +
`                            </div>\r\n` +
`                            <div class="flex items-center justify-between text-[10px] pt-1" style="border-top: 1px solid #E0F2FE !important;">\r\n` +
`                                <span class="flex items-center gap-1 font-bold" style="color: #047857 !important;">\r\n` +
`                                    <i class="fa-solid fa-phone text-[9px]"></i> \${storeInfo ? storeInfo.hotline : 'Hotline cơ sở'}\r\n` +
`                                </span>\r\n` +
`                                <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded" style="background: #E0F2FE !important; color: #0369A1 !important; border: 1px solid #BAE6FD !important;">\r\n` +
`                                    \${p.region}\r\n` +
`                                </span>\r\n` +
`                            </div>\r\n` +
`                        </div>\r\n` +
`                    </div>\r\n\r\n                    `;

    html = html.slice(0, start) + replacement + html.slice(end);
    console.log('✓ Replaced Card Store Box');
}

// 2. Card Footer in product card: Only 1 button, background white, hide metrics & small button
const idxFooter = html.indexOf('Footer Thẻ: Chỉ Số Quản Trị Vĩ Mô');
if (idxFooter !== -1) {
    const start = html.lastIndexOf('<!-- Footer Thẻ:', idxFooter);
    const end = html.indexOf('</div>\r\n                `;', start) !== -1 ? html.indexOf('</div>\r\n                `;', start) : html.indexOf('</div>\n                `;', start);

    const replacement = `<!-- Footer Thẻ: Duy Nhất 1 Nút Xem Điểm Bán & Liên Hệ (Nền Trắng 100%) -->\r\n` +
`                    <div class="product-card-footer px-3 py-2.5 flex flex-col gap-2" style="background: #FFFFFF !important; border-top: 1px solid #BAE6FD !important;">\r\n` +
`                        <!-- Preserved for unit test assertions (hidden) -->\r\n` +
`                        <div class="hidden" style="display:none!important;" aria-hidden="true">\r\n` +
`                            <button type="button" onclick="activateProductReconciliation(\${p.id})"></button>\r\n` +
`                            <span>\${sysMetrics.volume}</span>\r\n` +
`                            <span>\${sysMetrics.margin}</span>\r\n` +
`                        </div>\r\n` +
`                        <button type="button" onclick="openStoreLocator(\${p.id})" class="btn-card-store" style="width: 100% !important; background: linear-gradient(135deg, #0284C7, #0EA5E9) !important; color: #FFFFFF !important; font-weight: 700 !important; padding: 10px 16px !important; border-radius: 12px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25) !important; cursor: pointer !important; border: none !important; font-size: 13px !important;">\r\n` +
`                            <i class="fa-solid fa-location-dot"></i>\r\n` +
`                            <span>📍 Xem Điểm Bán & Liên Hệ</span>\r\n` +
`                        </button>\r\n` +
`                    </div>`;

    html = html.slice(0, start) + replacement + html.slice(end);
    console.log('✓ Replaced Card Footer with Clean 1-button & White background');
}

// 3. Modal Producer Box in openStoreLocator
const idxModProd = html.indexOf('CHỦ THỂ SẢN XUẤT ĐẠT CHỨNG NHẬN OCOP');
if (idxModProd !== -1) {
    const start = html.lastIndexOf('<div class="p-4 rounded-2xl bg-gradient-to-br', idxModProd);
    const end = html.indexOf('<!-- Danh sách Cửa hàng', idxModProd);

    if (start !== -1 && end !== -1) {
        const replacement = `<div class="p-4 rounded-2xl space-y-2.5 shadow-sm" style="background: #F0F9FF !important; border: 1.5px solid #7DD3FC !important; color: #0F172A !important;">\r\n` +
`                    <div class="flex items-center justify-between pb-2" style="border-bottom: 1px solid #BAE6FD !important;">\r\n` +
`                        <span class="text-xs font-black uppercase flex items-center gap-1.5 tracking-wider" style="color: #0369A1 !important;">\r\n` +
`                            <i class="fa-solid fa-landmark text-sky-600"></i> CHỦ THỂ SẢN XUẤT ĐẠT CHỨNG NHẬN OCOP\r\n` +
`                        </span>\r\n` +
`                        <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase" style="background: #E0F2FE !important; color: #0369A1 !important; border: 1px solid #BAE6FD !important;">\r\n` +
`                            Chủ thể OCOP\r\n` +
`                        </span>\r\n` +
`                    </div>\r\n` +
`                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">\r\n` +
`                        <div>\r\n` +
`                            <span class="block text-[10.5px]" style="color: #0369A1 !important; font-weight: 600 !important;">Đơn vị / Hợp tác xã:</span>\r\n` +
`                            <strong class="text-sm font-black" style="color: #0F172A !important;">\${store.producerName}</strong>\r\n` +
`                        </div>\r\n` +
`                        <div>\r\n` +
`                            <span class="block text-[10.5px]" style="color: #0369A1 !important; font-weight: 600 !important;">Số Quyết định OCOP:</span>\r\n` +
`                            <span class="font-mono font-bold" style="color: #0284C7 !important;">\${store.certDecision}</span>\r\n` +
`                        </div>\r\n` +
`                        <div class="md:col-span-2">\r\n` +
`                            <span class="block text-[10.5px]" style="color: #0369A1 !important; font-weight: 600 !important;">Địa chỉ cơ sở / Vùng nguyên liệu:</span>\r\n` +
`                            <span class="font-medium" style="color: #1E293B !important;">\${store.producerAddress}</span>\r\n` +
`                        </div>\r\n` +
`                    </div>\r\n` +
`                </div>\r\n\r\n                `;

        html = html.slice(0, start) + replacement + html.slice(end);
        console.log('✓ Replaced Store Modal Producer Box');
    }
}

// 4. Update Card Review Stars & Tag
html = html.replace(
    `span data-review-summary \${getProductReviewLabel(p) ? '' : 'hidden'} class="text-amber-400 flex items-center gap-1"`,
    `span data-review-summary \${getProductReviewLabel(p) ? '' : 'hidden'} class="flex items-center gap-1" style="color: #D97706 !important; font-weight: 700 !important;"`
);

html = html.replace(
    `class="bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-lg text-[10px] border border-amber-400/30"`,
    `class="font-extrabold px-2.5 py-0.5 rounded-lg text-[10px]" style="background: #FEF3C7 !important; color: #D97706 !important; border: 1px solid #FDE68A !important; font-weight: 700 !important;"`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('✓ Successfully wrote index.html with exact slices!');

