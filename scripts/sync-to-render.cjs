'use strict';
/**
 * AI DIGITAL BUSINESS CHALLENGE 2026
 * Script đồng bộ dữ liệu tài chính & pháp lý OCOP sang trang quản trị Render:
 * https://ocop-sales-copilot-kpi.onrender.com/
 */

const targetUrl = process.env.OCOP_KPI_URL || 'https://ocop-sales-copilot-kpi.onrender.com';
const token = process.env.OCOP_KPI_SYNC_TOKEN || 'OCOP_2026_SECURE_TOKEN_AI_CHALLENGE_SYNC_998877';

async function dispatchSync(endpoint, payload) {
  const url = `${targetUrl}${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-ocop-sync-token': token
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    console.log(`[SYNC -> ${endpoint}] Status: ${res.status}`, data);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error(`[SYNC -> ${endpoint}] Lỗi kết nối:`, err.message);
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log(`🚀 Bắt đầu gửi luồng dữ liệu quản trị sang: ${targetUrl}`);

  // 1. Gửi bản ghi doanh thu tài chính (Financial Sync)
  await dispatchSync('/api/sync/financial', {
    id: 'SYNC-CHALLENGE-2026-' + Date.now(),
    type: 'draft_order',
    title: 'Đơn nháp tư vấn AI Copilot: Bưởi Tân Triều & Trà Hiệp Vân (Đồng Nai)',
    grossRevenue: 3450000,
    cogs: 2139000,
    opex: 258750,
    chmCommission: 241500,
    netProfit: 810750,
    province: 'Đồng Nai',
    timestamp: new Date().toISOString()
  });

  // 2. Gửi bản ghi quét mã QR điểm bán O2O
  await dispatchSync('/api/sync/financial', {
    id: 'SYNC-QR-O2O-' + Date.now(),
    type: 'qr_scan',
    title: 'Quét mã QR Showroom O2O Hiệp Vân - Long Khánh',
    grossRevenue: 680000,
    cogs: 421600,
    opex: 51000,
    chmCommission: 47600,
    netProfit: 159800,
    province: 'Đồng Nai',
    timestamp: new Date().toISOString()
  });

  // 3. Đồng bộ danh mục xác thực chứng nhận OCOP đời thực
  await dispatchSync('/api/sync/verify-ocop', {
    products: [
      {
        id: 524,
        name: "Bưởi đường lá cam Tân Triều",
        region: "Đồng Nai",
        hub: "Đồng Nai Hub",
        producer: "HTX Nông nghiệp Dịch vụ Tân Triều",
        decree: "Quyết định số 2145/QĐ-UBND",
        stars: 4,
        status: "VERIFIED_LEGAL_100",
        showroom: "Showroom Tân Triều, TP. Biên Hòa & TP.HCM"
      },
      {
        id: 525,
        name: "Trà khổ qua rừng túi lọc Hiệp Vân",
        region: "Đồng Nai",
        hub: "Đồng Nai Hub",
        producer: "Cơ sở Hiệp Vân, Long Khánh",
        decree: "Quyết định số 1892/QĐ-UBND",
        stars: 4,
        status: "VERIFIED_LEGAL_100",
        showroom: "Điểm bán O2O Hiệp Vân, TP. Long Khánh"
      },
      {
        id: 526,
        name: "Hạt điều rang muối Vinahe",
        region: "Đồng Nai",
        hub: "Đồng Nai Hub",
        producer: "Công ty TNHH Vinahe",
        decree: "Quyết định số 3105/QĐ-UBND",
        stars: 4,
        status: "VERIFIED_LEGAL_100",
        showroom: "Showroom Vinahe Định Quán & Biên Hòa"
      },
      {
        id: 336,
        name: "Gốm sứ Bát Tràng men rạn",
        region: "Hà Nội",
        hub: "Hà Nội Hub",
        producer: "Công ty TNHH Gốm sứ Quang Vinh (Gia Lâm)",
        decree: "Quyết định số 1498/QĐ-TTg (5 Sao Quốc gia)",
        stars: 5,
        status: "VERIFIED_LEGAL_100",
        showroom: "TT XTTM OCOP Quốc gia, 489 Hoàng Quốc Việt, Cầu Giấy"
      },
      {
        id: 348,
        name: "Chè Shan Tuyết cổ thụ Phìn Hồ",
        region: "Hà Giang",
        hub: "Tây Bắc Hub",
        producer: "HTX Chế biến Chè Phìn Hồ, Hoàng Su Phì",
        decree: "Quyết định số 1498/QĐ-TTg (5 Sao Quốc gia)",
        stars: 5,
        status: "VERIFIED_LEGAL_100",
        showroom: "Showroom OCOP Phìn Hồ & Hà Nội"
      }
    ]
  });

  console.log('✅ Hoàn tất phát luồng dữ liệu đồng bộ!');
}

main();
