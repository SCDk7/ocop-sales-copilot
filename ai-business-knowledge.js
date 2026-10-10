// ==============================================================
// AI DIGITAL BUSINESS CHALLENGE 2026
// NỀN TẢNG HỆ SINH THÁI SỐ OCOP & BỘ CÔNG CỤ QUẢN TRỊ TÀI CHÍNH THÔNG MINH TÍCH HỢP AI
// (OCOP SALES COPILOT & AI FINANCIAL ENGINE)
// ==============================================================

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AIBusinessKnowledge = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const PROJECT_PROFILE = {
    competition: "AI Digital Business Challenge 2026",
    track: "AI & Digital Business Innovation",
    projectName: "OCOP Sales Copilot & AI Financial Engine",
    tagline: "Hệ sinh thái số đa kết nối O2O/B2B2C định vị đặc sản OCOP và Quản trị dòng tiền thông minh bằng AI cho 63 tỉnh thành",
    modelType: "B2B2C & O2O (Online-to-Offline) Tri-party Digital Ecosystem",
    version: "2026.4.0 (Enterprise MVP)"
  };

  // 1. ĐỊNH VỊ MÔ HÌNH HỆ SINH THÁI SỐ & BỘ CÔNG CỤ TÀI CHÍNH AI
  const BUSINESS_MODEL = {
    triPartyEcosystem: {
      party1_Producers: {
        name: "Nhà Vựa / Hợp Tác Xã / Cửa Hàng Đặc Sản OCOP (B)",
        painPoints: [
          "Bế tắc kênh đầu ra do phụ thuộc thương lái, thiếu hiện diện số",
          "Kế toán thủ công, không tính được chi phí vốn (COGS) và tiền lời thực tế",
          "Khó quản lý chiết khấu khi mở rộng mạng lưới cộng tác viên bán hàng",
          "Chủ cơ sở và nông dân lớn tuổi khó dùng phần mềm ERP/kế toán phức tạp"
        ],
        solution: [
          "Onboarding siêu tốc (Lightweight MVP): Chỉ cần tải ảnh chụp menu/chứng nhận OCOP, AI RAG tự dựng gian hàng số trong vài giờ",
          "Bảng điều khiển tài chính AI (AI Financial Dashboard): Báo cáo Doanh thu, Tiền lời, Chiết khấu bằng giọng nói và đồ họa bình dân",
          "Quảng bá định vị cửa hàng thực tế và chứng nhận OCOP 4-5 sao pháp lý đến hàng triệu du khách"
        ]
      },
      party2_Consumers: {
        name: "Người Tiêu Dùng & Khách Du Lịch (C)",
        painPoints: [
          "Lo ngại hàng giả, hàng nhái nhãn mác OCOP, không rõ nguồn gốc",
          "Không biết tìm mua đặc sản chính gốc tại showroom hoặc cửa hàng thực tế nào ở từng tỉnh",
          "Thiếu thông tin văn hóa, ý nghĩa câu chuyện thổ nhưỡng đằng sau món quà biếu"
        ],
        solution: [
          "Định vị O2O chính xác: Tra cứu địa chỉ showroom, hotline, Quyết định phê duyệt OCOP và chỉ đường Google Maps",
          "Voice AI đa vùng miền: Trợ lý nói chuyện tự nhiên bằng giọng Bắc - Trung - Nam",
          "Storytelling văn hóa: AI kể câu chuyện lịch sử, thổ nhưỡng làm tăng giá trị cảm xúc món quà"
        ]
      },
      party3_Platform: {
        name: "Nền Tảng Điều Phối Số OCOP Sales Copilot (Platform)",
        role: "Trục công nghệ kết nối, điều phối dòng tiền, minh bạch hóa chiết khấu và chuẩn hóa dữ liệu OCOP toàn quốc",
        revenueStreams: [
          "Phí hoa hồng giao dịch thành công (Take rate 5% - 8% trên GMV)",
          "Gói dịch vụ cao cấp AI Financial Engine & Báo cáo thị trường chuyên sâu cho HTX",
          "Phí liên kết xúc tiến thương mại số với Sở NN&PTNT các tỉnh thành"
        ]
      }
    },

    aiFinancialEngine: {
      definition: "Bộ công cụ tự động hóa kế toán dòng tiền bằng AI, thiết kế chuyên biệt cho chủ cửa hàng truyền thống và nông dân",
      modules: {
        revenue: {
          title: "Quản Trị Doanh Thu Theo Thời Gian Thực (Real-time Revenue)",
          mechanism: "Hợp nhất đa luồng: Lượt quét QR thanh toán tại cửa hàng O2O vật lý + Đơn đặt trước (Pre-order) từ hệ thống số. Cập nhật từng phút mà không cần nhập liệu bằng tay."
        },
        profit: {
          title: "Bóc Tách Chi Phí & Tính Tiền Lời Ròng (Net Profit Optimization)",
          mechanism: "AI tự động phân tách chi phí vốn (COGS), chi phí đóng gói, bao bì chống sốc, phí vận chuyển để tính ra biên lợi nhuận ròng thực tế theo từng dòng sản phẩm. AI tự động phát hiện chi phí thừa và đề xuất tối ưu giúp tăng lợi nhuận 15% - 20%."
        },
        commission: {
          title: "Quản Trị Tiền Chiết Khấu & Hoa Hồng Minh Bạch (Commission / CHM)",
          mechanism: "Khấu trừ và phân bổ tự động phần trăm hoa hồng giữa cửa hàng và nền tảng (5%), hoặc trích xuất chiết khấu cho mạng lưới cộng tác viên (CTV) bán hàng bản địa minh bạch 100%, không xảy ra tranh chấp đối soát."
        }
      }
    }
  };

  // 2. HỆ THỐNG CHỈ SỐ ĐÁNH GIÁ HIỆU QUẢ (KPIS & METRICS)
  const KPIS_AND_METRICS = [
    {
      code: "GMV",
      name: "Tổng Giá Trị Giao Dịch Hệ Thống (Gross Merchandise Value)",
      target: "Tăng trưởng 35% mỗi quý",
      currentSimulation: "842.500.000 ₫ / tháng (mạng lưới điểm bán thí điểm)",
      description: "Đo lường toàn bộ dòng tiền lưu thông qua nền tảng từ lượt quét QR tại showroom và đơn đặt trước online."
    },
    {
      code: "PROFIT_GROWTH",
      name: "Mức Tăng Trưởng Biên Lợi Nhuận Ròng (Profit Margin Growth)",
      target: "+15% đến +20%",
      currentSimulation: "+18.4% lợi nhuận tối ưu thêm",
      description: "Nhờ AI Financial Engine phân tích đề xuất cắt giảm chi phí trung gian và nguyên vật liệu bao bì dư thừa cho chủ cửa hàng."
    },
    {
      code: "FINANCIAL_ACCURACY",
      name: "Độ Chính Xác Báo Cáo Tài Chính AI (Financial Data Accuracy)",
      target: "100% (Sai số 0.00%)",
      currentSimulation: "Sai số 0.00%",
      description: "Đối soát và tính toán Doanh thu, Tiền lời, Chiết khấu hoa hồng với thuật toán xác minh tài chính chặt chẽ."
    },
    {
      code: "AI_RAG_ACCURACY",
      name: "Độ Chính Xác Tri Thức OCOP & Cửa Hàng (AI Accuracy Rate)",
      target: "> 95%",
      currentSimulation: "98.2% độ chính xác",
      description: "Trợ lý AI RAG phản hồi đúng nguồn gốc sản phẩm, số quyết định phê duyệt OCOP và địa chỉ showroom thực tế."
    },
    {
      code: "RESPONSE_TIME",
      name: "Thời Gian Phản Hồi Trung Bình (Average Response Time)",
      target: "< 3 giây / truy vấn",
      currentSimulation: "0.8 - 1.6 giây",
      description: "Tối ưu hóa pipeline xử lý đa luồng giúp giữ chân người dùng và nâng cao tỷ lệ chuyển đổi."
    }
  ];

  // 3. ĐIỂM ĐỘC ĐÁO & ĐỘT PHÁ CÔNG NGHỆ (DIFFERENTIATORS)
  const DIFFERENTIATORS = [
    {
      id: "ai_financial_dashboard",
      title: "Bảng Điều Khiển Tài Chính AI (AI Financial Dashboard)",
      tagline: "Bình dân hóa kế toán dòng tiền cho nông dân và chủ HTX",
      details: "Biến các bảng số liệu kế toán phức tạp thành biểu đồ đơn giản 3 màu (Xanh: Doanh thu, Vàng: Tiền lời, Cam: Chiết khấu). Cung cấp tính năng tóm tắt tài chính bằng giọng nói qua loa điện thoại, người lớn tuổi chỉ cần nghe là nắm được hôm nay lời bao nhiêu."
    },
    {
      id: "ai_cultural_storytelling",
      title: "Kể Chuyện Thương Hiệu Tự Động (AI Cultural Storytelling)",
      tagline: "Nâng tầm giá trị cảm xúc đặc sản địa phương",
      details: "Không chỉ hiển thị giá tiền, AI tự động tra cứu tri thức Wikipedia và kho tàng văn hóa dân gian để lồng ghép câu chuyện về thổ nhưỡng, độ cao, khí hậu và bàn tay nghệ nhân làm ra sản phẩm, thúc đẩy quyết định mua quà biếu cao cấp."
    },
    {
      id: "voice_first_multiregion",
      title: "Công Nghệ Giọng Nói Đa Vùng Miền (Voice-First AI)",
      tagline: "Nhận diện mượt mà phương ngữ Bắc - Trung - Nam",
      details: "Tích hợp mô hình nhận diện giọng nói tối ưu cho tiếng Việt bản địa, hiểu rõ tiếng địa phương miền Tây, miền Trung, Tây Bắc; hỗ trợ tra cứu rảnh tay cho du khách và nhập liệu bằng giọng nói cho chủ sạp chợ."
    },
    {
      id: "lightweight_mvp",
      title: "Triển Khai Siêu Tốc 'Lightweight MVP' (Zero-Tech Onboarding)",
      tagline: "Số hóa cửa hàng trong vòng vài giờ",
      details: "Chủ cửa hàng không cần biết lập trình hay quản trị web phức tạp. Chỉ cần chụp ảnh menu bảng giá và giấy chứng nhận OCOP gửi lên, hệ thống AI RAG sẽ tự động bóc tách OCR, cấu hình showroom số và trợ lý ảo độc quyền cho cửa hàng đó trong 2-3 giờ."
    }
  ];

  // 4. CHIẾN LƯỢC PHÁT TRIỂN & MỞ RỘNG (SCALABILITY ROADMAP)
  const SCALABILITY_STRATEGY = [
    {
      phase: "Giai đoạn 1 (Hiện tại - Quý 2/2026)",
      title: "Hoàn thiện MVP & Triển khai 252 Điểm bán tại 63 Tỉnh Thành",
      metrics: "252 sản phẩm OCOP chuẩn 4-5 sao, 500+ điểm bán kết nối, chuẩn hóa bộ công cụ AI Financial Engine."
    },
    {
      phase: "Giai đoạn 2 (Quý 3/2026 - Quý 4/2026)",
      title: "Mở Rộng Liên Kết Vùng (Regional Scale-up)",
      metrics: "Nhân bản từ cửa hàng đơn lẻ lên mô hình quản lý tập trung cấp Huyện/Tỉnh, phối hợp với Trung tâm Khuyến nông & Sở NN&PTNT xây dựng 'Trung tâm thương mại đặc sản OCOP thông minh' đại diện từng địa phương."
    },
    {
      phase: "Giai đoạn 3 (Năm 2027)",
      title: "Đa Kênh (Omnichannel) & Đa Ngôn Ngữ Du Lịch Quốc Tế",
      metrics: "Đồng bộ API quản trị Doanh thu & Tiền lời với TikTok Shop, Shopee. Kích hoạt module AI đa ngữ (Anh, Hàn, Trung, Nhật) hướng dẫn định vị cửa hàng và thanh toán không tiền mặt cho du khách quốc tế du lịch Việt Nam."
    }
  ];

  // 5. DỮ LIỆU TÀI CHÍNH MẪU ĐỂ MÔ PHỎNG TRÊN DASHBOARD
  const SAMPLE_FINANCIAL_SNAPSHOT = {
    overview: {
      period: "Tháng hiện tại (Real-time Analytics)",
      currency: "VND",
      totalRevenue: 842500000,
      totalCOGS: 530775000,
      grossProfit: 311725000,
      totalCommission: 42125000,
      netProfit: 269600000,
      netProfitMargin: "32.0%",
      aiOptimizedGrowth: "+18.4%",
      errorRate: "0.00%",
      channelSplit: {
        offlineQR: { amount: 539200000, percentage: "64%" },
        onlinePreorder: { amount: 303300000, percentage: "36%" }
      }
    },
    topProductsFinancials: [
      {
        id: 336,
        name: "Trà SADU Phúc Lộc Thọ (Hà Nội)",
        retailPrice: 2000000,
        cogs: 1200000,
        platformCommission: 100000, // 5%
        ctvCommission: 140000,      // 7%
        netProfit: 560000,
        margin: "28.0%",
        soldUnits: 124,
        totalRevenue: 248000000,
        totalNetProfit: 69440000
      },
      {
        id: 348,
        name: "Chè Shan tuyết Suối Giàng 5★ (Yên Bái)",
        retailPrice: 1800000,
        cogs: 1050000,
        platformCommission: 90000,
        ctvCommission: 126000,
        netProfit: 534000,
        margin: "29.7%",
        soldUnits: 98,
        totalRevenue: 176400000,
        totalNetProfit: 52332000
      },
      {
        id: 392,
        name: "Nước mắm Cát Hải cốt đặc biệt 5★ (Hải Phòng)",
        retailPrice: 400000,
        cogs: 230000,
        platformCommission: 20000,
        ctvCommission: 28000,
        netProfit: 122000,
        margin: "30.5%",
        soldUnits: 340,
        totalRevenue: 136000000,
        totalNetProfit: 41480000
      },
      {
        id: 480,
        name: "Yến sào đảo thiên nhiên 5★ (Khánh Hòa)",
        retailPrice: 5000000,
        cogs: 3200000,
        platformCommission: 250000,
        ctvCommission: 350000,
        netProfit: 1200000,
        margin: "24.0%",
        soldUnits: 32,
        totalRevenue: 160000000,
        totalNetProfit: 38400000
      },
      {
        id: 492,
        name: "Sâm Ngọc Linh Tu Mơ Rông ngâm mật 5★ (Kon Tum)",
        retailPrice: 7000000,
        cogs: 4600000,
        platformCommission: 350000,
        ctvCommission: 490000,
        netProfit: 1560000,
        margin: "22.3%",
        soldUnits: 17,
        totalRevenue: 119000000,
        totalNetProfit: 26520000
      }
    ]
  };

  return {
    PROJECT_PROFILE,
    BUSINESS_MODEL,
    KPIS_AND_METRICS,
    DIFFERENTIATORS,
    SCALABILITY_STRATEGY,
    SAMPLE_FINANCIAL_SNAPSHOT
  };
}));

