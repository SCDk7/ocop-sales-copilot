(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    } else {
        root.OcopDongNaiCertified = api;
    }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const source = Object.freeze({
        decisionNumber: '125/QĐ-UBND',
        decisionDate: '14/01/2026',
        batch: 'Đợt 2 năm 2025',
        url: 'https://dongnai.gov.vn/uploads/binhphuoc/news/2026_01/09pl-kemtheo-125qd-ubnd.pdf'
    });

    const records = Object.freeze([
        { sourceItemNumber: 4, name: 'Mật ong tách nước – Tách tạp chất bằng máy hạ thủy phân', producer: 'Hộ kinh doanh Mật ong Vàng Anh', address: 'Xã An Viễn, tỉnh Đồng Nai', score: 54, stars: 3, coordinates: null },
        { sourceItemNumber: 5, name: 'Trà Phú Hội', producer: 'Hộ kinh doanh Phúc Bảo', address: 'Xã Nhơn Trạch, tỉnh Đồng Nai', score: 57, stars: 3, coordinates: null },
        { sourceItemNumber: 6, name: 'Yến tinh chế', producer: 'Hộ kinh doanh Yến sào Gia Huy', address: 'Xã Thanh Sơn, tỉnh Đồng Nai', score: 58, stars: 3, coordinates: null },
        { sourceItemNumber: 7, name: 'Tổ yến chưng', producer: 'Hộ kinh doanh Yến sào Gia Huy', address: 'Xã Thanh Sơn, tỉnh Đồng Nai', score: 60, stars: 3, coordinates: null },
        { sourceItemNumber: 8, name: 'Cà phê chồn rang mộc', producer: 'Công ty TNHH MTV An Khang sản xuất và chế biến thực phẩm', address: 'Xã Long Thành, tỉnh Đồng Nai', score: 53, stars: 3, coordinates: null },
        { sourceItemNumber: 9, name: 'Sầu riêng sấy thăng hoa', producer: 'Công ty TNHH MTV An Khang sản xuất và chế biến thực phẩm', address: 'Xã Long Thành, tỉnh Đồng Nai', score: 55, stars: 3, coordinates: null },
        { sourceItemNumber: 10, name: 'Mít ướt sấy thăng hoa', producer: 'Công ty TNHH MTV An Khang sản xuất và chế biến thực phẩm', address: 'Xã Long Thành, tỉnh Đồng Nai', score: 58, stars: 3, coordinates: null },
        { sourceItemNumber: 11, name: 'Xoài sấy thăng hoa', producer: 'Công ty TNHH MTV An Khang sản xuất và chế biến thực phẩm', address: 'Xã Long Thành, tỉnh Đồng Nai', score: 58, stars: 3, coordinates: null },
        { sourceItemNumber: 12, name: 'Yến thô', producer: 'Hộ kinh doanh Cửa hàng', address: 'Phường Phước Bình', addressNote: 'Phụ lục không ghi thêm địa chỉ hành chính.', score: 62, stars: 3, coordinates: null },
        { sourceItemNumber: 13, name: 'Yến tinh chế', producer: 'Yến sào Kim Liên', address: 'Tỉnh Đồng Nai', score: 68, stars: 3, coordinates: null },
        { sourceItemNumber: 14, name: 'Yến hũ chưng đường phèn', producer: 'Yến sào Kim Liên', address: 'Tỉnh Đồng Nai', score: 66, stars: 3, coordinates: null },
        { sourceItemNumber: 15, name: 'Yến hũ chưng không đường', producer: 'Yến sào Kim Liên', address: 'Tỉnh Đồng Nai', score: 67, stars: 3, coordinates: null },
        { sourceItemNumber: 16, name: 'Rượu điều', producer: 'Hộ kinh doanh Thanh long ANNA', address: 'Xã Dầu Giây, tỉnh Đồng Nai', score: 56, stars: 3, coordinates: null },
        { sourceItemNumber: 17, name: 'Nước ép Điều lên men Anna', producer: 'Hộ kinh doanh Thanh long ANNA', address: 'Xã Dầu Giây, tỉnh Đồng Nai', score: 55, stars: 3, coordinates: null },
        { sourceItemNumber: 18, name: 'Rượu tắc', producer: 'Hộ kinh doanh Thanh long ANNA', address: 'Xã Dầu Giây, tỉnh Đồng Nai', score: 53, stars: 3, coordinates: null },
        { sourceItemNumber: 19, name: 'Nước ép tắc lên men', producer: 'Hộ kinh doanh Thanh long ANNA', address: 'Xã Dầu Giây, tỉnh Đồng Nai', score: 53, stars: 3, coordinates: null },
        { sourceItemNumber: 20, name: 'Chuối bàn tay phật hữu cơ', producer: 'Hộ kinh doanh - Cơ sở nuôi trồng và chế biến nông sản Núi Cúi', address: 'Xã Gia Kiệm, tỉnh Đồng Nai', score: 57, stars: 3, coordinates: null },
        { sourceItemNumber: 21, name: 'Rau hữu cơ', producer: 'Hộ kinh doanh - Cơ sở nuôi trồng và chế biến nông sản Núi Cúi', address: 'Xã Gia Kiệm, tỉnh Đồng Nai', score: 58, stars: 3, coordinates: null },
        { sourceItemNumber: 22, name: 'Bánh sữa non sầu riêng', producer: 'Hộ kinh doanh sản phẩm sản xuất bánh kẹo Long Thành', address: 'Xã Long Phước, tỉnh Đồng Nai', score: 64, stars: 3, coordinates: null },
        { sourceItemNumber: 23, name: 'Bánh sữa nguyên chất Long Thành', producer: 'Hộ kinh doanh sản phẩm sản xuất bánh kẹo Long Thành', address: 'Xã Long Phước, tỉnh Đồng Nai', score: 65, stars: 3, coordinates: null },
        { sourceItemNumber: 24, name: 'Bánh sữa sô cô la', producer: 'Hộ kinh doanh sản phẩm sản xuất bánh kẹo Long Thành', address: 'Xã Long Phước, tỉnh Đồng Nai', score: 63, stars: 3, coordinates: null },
        { sourceItemNumber: 25, name: 'Bánh sữa ít đường', producer: 'Hộ kinh doanh sản phẩm sản xuất bánh kẹo Long Thành', address: 'Xã Long Phước, tỉnh Đồng Nai', score: 64, stars: 3, coordinates: null },
        { sourceItemNumber: 26, name: 'Bánh sữa non cao cấp Long Thành', producer: 'Hộ kinh doanh sản phẩm sản xuất bánh kẹo Long Thành', address: 'Xã Long Phước, tỉnh Đồng Nai', score: 64, stars: 3, coordinates: null },
        { sourceItemNumber: 27, name: 'Rau Nhíp', producer: 'HTX NN điều hữu cơ Trảng Cỏ Bù Lạch', address: 'Xã Thọ Sơn, tỉnh Đồng Nai', score: 62, stars: 3, coordinates: null },
        { sourceItemNumber: 28, name: 'Mật ong Hoa nhãn', producer: 'Hộ kinh doanh Trại ong Thành Tâm – Mật ong lá ủ', address: 'Xã Phú Lâm, tỉnh Đồng Nai', score: 65, stars: 3, coordinates: null }
    ].map(record => Object.freeze({ ...record, province: 'Đồng Nai' })));

    function normalize(value) {
        return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    }

    function filterRecords(query) {
        const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
        if (!terms.length) return records.slice();
        return records.filter(record => {
            const searchable = normalize([record.name, record.producer, record.address, record.province].join(' '));
            return terms.every(term => searchable.includes(term));
        });
    }

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]);
    }

    function renderPublicList(query) {
        const matches = filterRecords(query);
        if (!matches.length) return '<p class="text-sm text-slate-600">Không tìm thấy hồ sơ phù hợp trong danh sách chứng nhận.</p>';
        return matches.map(record => `
            <article class="product-card lofi-organic-card group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
                <div class="product-card-top flex flex-1 flex-col">
                    <div class="product-card-image-wrap relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 sm:h-36">
                        <i class="fa-solid fa-certificate absolute right-3 top-1 text-8xl text-white/10" aria-hidden="true"></i>
                        <div class="absolute left-2 top-2 z-10">
                            <span class="flex w-fit items-center gap-1 rounded-full border border-yellow-200 bg-amber-400 px-2 py-1 text-[9px] font-black uppercase text-amber-950 shadow-sm">
                                <i class="fa-solid fa-star text-[8px]" aria-hidden="true"></i>
                                3★ SAO OCOP
                            </span>
                        </div>
                        <div class="relative z-10 text-center text-amber-100">
                            <div class="text-2xl tracking-[0.3em]" aria-label="3 sao">★★★</div>
                            <div class="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">Chứng nhận OCOP · Đồng Nai</div>
                        </div>
                    </div>
                    <div class="product-card-body flex flex-1 flex-col space-y-2 bg-white px-3 py-3">
                        <div class="flex items-center justify-between gap-2 text-[10px] font-bold">
                            <span class="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-100/90 px-1.5 py-1 text-[9.5px] font-semibold text-sky-900">
                                <i class="fa-solid fa-location-dot text-[8.5px] text-sky-600" aria-hidden="true"></i>
                                Đồng Nai
                            </span>
                            <span class="inline-flex shrink-0 items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-1 text-[9.5px] font-bold text-amber-800">
                                <i class="fa-solid fa-star text-[8.5px] text-amber-500" aria-hidden="true"></i>
                                ${record.score} điểm
                            </span>
                        </div>
                        <h3 class="m-0 line-clamp-2 min-h-[2.5rem] break-words text-sm font-bold leading-snug text-slate-800">${escapeHtml(record.name)}</h3>
                        <div class="rounded-lg border border-slate-100 bg-slate-50 p-2">
                            <p class="m-0 text-[9px] font-extrabold uppercase tracking-wide text-slate-500">Chủ thể OCOP</p>
                            <p class="mb-0 mt-1 break-words text-xs font-semibold leading-relaxed text-slate-700">${escapeHtml(record.producer)}</p>
                        </div>
                        <p class="mb-0 flex gap-1.5 break-words text-xs leading-relaxed text-slate-600">
                            <i class="fa-solid fa-map-pin mt-0.5 shrink-0 text-emerald-700" aria-hidden="true"></i>
                            <span>${escapeHtml(record.address)}${record.addressNote ? ` · ${escapeHtml(record.addressNote)}` : ''}</span>
                        </p>
                    </div>
                </div>
                <div class="product-card-footer mt-auto border-t border-emerald-100 bg-emerald-50/70 px-3 py-2">
                    <span class="text-[10px] font-bold text-emerald-900"><i class="fa-solid fa-circle-check mr-1" aria-hidden="true"></i>Hồ sơ chứng nhận chính thức</span>
                </div>
            </article>
        `).join('');
    }

    return { source, records, filterRecords, renderPublicList };
}));
