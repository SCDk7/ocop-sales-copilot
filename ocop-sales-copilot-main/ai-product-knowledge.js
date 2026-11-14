// ============================================================
// AI PRODUCT KNOWLEDGE BASE — OCOP Sales Copilot
// Nguồn: Dữ liệu Excel OCOP 5 nhóm hàng
// Mục đích: Hỗ trợ AI trả lời câu hỏi của khách hàng
// KHÔNG liên quan đến hiển thị sản phẩm trên trang web
// Tạo lúc: 10:23:28 26/10/2026
// Tổng: 252 sản phẩm / 5 nhóm
// ============================================================

(function() {
'use strict';

/**
 * Dữ liệu kiến thức sản phẩm OCOP theo nhóm hàng
 * Mỗi nhóm có: group (tên), keywords (từ khoá), products (danh sách SP)
 */
const GROUPS = {
  "do_an_vat_hat_trai_cay_say": {
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy",
    "keywords": [
      "hạt",
      "trái cây sấy",
      "đồ ăn vặt",
      "bánh",
      "kẹo",
      "snack",
      "sấy",
      "khô"
    ],
    "products": [
      {
        "id": 357,
        "name": "Hạt mắc ca Lai Châu tách hạt sấy khô",
        "province": "Lai Châu",
        "stars": "5 sao",
        "price": 450000,
        "unit": "kg"
      },
      {
        "id": 362,
        "name": "Xoài sấy dẻo Yên Châu",
        "province": "Sơn La",
        "stars": "4 sao",
        "price": 120000,
        "unit": "gói 300g"
      },
      {
        "id": 379,
        "name": "Bánh chưng bờ Đậu hút chân không",
        "province": "Thái Nguyên",
        "stars": "4 sao",
        "price": 100000,
        "unit": "chiếc"
      },
      {
        "id": 394,
        "name": "Bánh đa cua khô Hải Phòng",
        "province": "Hải Phòng",
        "stars": "4 sao",
        "price": 60000,
        "unit": "kg"
      },
      {
        "id": 397,
        "name": "Bánh đậu xanh Rồng Vàng Hoàng Gia",
        "province": "Hải Dương",
        "stars": "5 sao",
        "price": 150000,
        "unit": "hộp"
      },
      {
        "id": 398,
        "name": "Bánh gai Ninh Giang",
        "province": "Hải Dương",
        "stars": "4 sao",
        "price": 12000,
        "unit": "chiếc"
      },
      {
        "id": 400,
        "name": "Long nhãn lồng Hưng Yên thượng hạng (Hộp biếu cao cấp)",
        "province": "Hưng Yên",
        "stars": "5 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 401,
        "name": "Hạt sen sấy khô nguyên vị Hưng Yên",
        "province": "Hưng Yên",
        "stars": "5 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 406,
        "name": "Bánh cáy làng Nguyễn",
        "province": "Thái Bình",
        "stars": "4 sao",
        "price": 80000,
        "unit": "hộp"
      },
      {
        "id": 410,
        "name": "Bánh nhãn Hải Hậu",
        "province": "Nam Định",
        "stars": "4 sao",
        "price": 60000,
        "unit": "túi"
      },
      {
        "id": 411,
        "name": "Kẹo sìu châu Nam Định",
        "province": "Nam Định",
        "stars": "4 sao",
        "price": 80000,
        "unit": "hộp"
      },
      {
        "id": 412,
        "name": "Cơm cháy Ninh Bình cao cấp (Đóng gói xuất khẩu)",
        "province": "Ninh Bình",
        "stars": "5 sao",
        "price": 150000,
        "unit": "túi 500g"
      },
      {
        "id": 415,
        "name": "Hoa cúc chi sấy khô Ninh Bình",
        "province": "Ninh Bình",
        "stars": "4 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 418,
        "name": "Kẹo lạc Duy Tiên",
        "province": "Hà Nam",
        "stars": "4 sao",
        "price": 60000,
        "unit": "hộp"
      },
      {
        "id": 419,
        "name": "Bánh đa nem Chợ Sí",
        "province": "Hà Nam",
        "stars": "4 sao",
        "price": 45000,
        "unit": "túi"
      },
      {
        "id": 424,
        "name": "Hạt dẻ Trùng Khánh loại 1 tuyển chọn",
        "province": "Cao Bằng",
        "stars": "5 sao",
        "price": 280000,
        "unit": "kg"
      },
      {
        "id": 426,
        "name": "Bánh khảo Cao Bằng",
        "province": "Cao Bằng",
        "stars": "4 sao",
        "price": 65000,
        "unit": "hộp"
      },
      {
        "id": 430,
        "name": "Bánh phu thê Đình Bảng",
        "province": "Bắc Ninh",
        "stars": "4 sao",
        "price": 8000,
        "unit": "cái"
      },
      {
        "id": 439,
        "name": "Bánh gai Tứ Trụ",
        "province": "Thanh Hóa",
        "stars": "4 sao",
        "price": 10000,
        "unit": "chiếc"
      },
      {
        "id": 444,
        "name": "Kẹo cu đơ Thư Sơn thượng hạng (Hộp ép kín)",
        "province": "Hà Tĩnh",
        "stars": "5 sao",
        "price": 90000,
        "unit": "hộp"
      },
      {
        "id": 446,
        "name": "Bánh đa dừa Độc Lập",
        "province": "Hà Tĩnh",
        "stars": "4 sao",
        "price": 25000,
        "unit": "chiếc"
      },
      {
        "id": 463,
        "name": "Bánh khô mè Cẩm Lệ",
        "province": "Đà Nẵng",
        "stars": "4 sao",
        "price": 60000,
        "unit": "hộp"
      },
      {
        "id": 466,
        "name": "Bánh tráng Đại Lộc",
        "province": "Quảng Nam",
        "stars": "4 sao",
        "price": 50000,
        "unit": "túi"
      },
      {
        "id": 472,
        "name": "Bánh tráng gạo mè Dalop đặc biệt M4",
        "province": "Bình Định",
        "stars": "5 sao",
        "price": 70000,
        "unit": "túi"
      },
      {
        "id": 474,
        "name": "Bánh tráng dừa Tam Quan",
        "province": "Bình Định",
        "stars": "4 sao",
        "price": 25000,
        "unit": "cái"
      },
      {
        "id": 478,
        "name": "Bánh tráng Hòa Đa",
        "province": "Phú Yên",
        "stars": "4 sao",
        "price": 45000,
        "unit": "túi"
      },
      {
        "id": 481,
        "name": "Rong biển sấy khô Nha Trang giòn nguyên vị",
        "province": "Khánh Hòa",
        "stars": "5 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 482,
        "name": "Bánh xoài Cam Ranh",
        "province": "Khánh Hòa",
        "stars": "4 sao",
        "price": 60000,
        "unit": "túi 500g"
      },
      {
        "id": 485,
        "name": "Nho khô nguyên cành Ninh Thuận nhập/sấy xuất khẩu",
        "province": "Ninh Thuận",
        "stars": "5 sao",
        "price": 300000,
        "unit": "kg"
      },
      {
        "id": 489,
        "name": "Thanh long sấy dẻo công nghệ cao (Hộp xuất khẩu)",
        "province": "Bình Thuận",
        "stars": "5 sao",
        "price": 180000,
        "unit": "hộp"
      },
      {
        "id": 491,
        "name": "Bánh rế Phan Thiết",
        "province": "Bình Thuận",
        "stars": "4 sao",
        "price": 50000,
        "unit": "túi"
      },
      {
        "id": 502,
        "name": "Bơ sấy dẻo",
        "province": "Đắk Lắk",
        "stars": "4 sao",
        "price": 150000,
        "unit": "túi"
      },
      {
        "id": 503,
        "name": "Hạt mắc ca Krông Năng",
        "province": "Đắk Lắk",
        "stars": "4 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 504,
        "name": "Hạt điều rang củi Đắk Nông xuất khẩu",
        "province": "Đắk Nông",
        "stars": "5 sao",
        "price": 380000,
        "unit": "kg"
      },
      {
        "id": 509,
        "name": "Hồng treo gió Đà Lạt công nghệ cao (Hút chân không)",
        "province": "Lâm Đồng",
        "stars": "5 sao",
        "price": 550000,
        "unit": "hộp"
      },
      {
        "id": 515,
        "name": "Trái cây sấy thập cẩm",
        "province": "Bình Phước",
        "stars": "4 sao",
        "price": 110000,
        "unit": "kg"
      },
      {
        "id": 516,
        "name": "Bánh tráng phơi sương Trảng Bàng cao cấp (Đóng kín)",
        "province": "Tây Ninh",
        "stars": "5 sao",
        "price": 80000,
        "unit": "túi"
      },
      {
        "id": 518,
        "name": "Bánh tráng me Tây Ninh",
        "province": "Tây Ninh",
        "stars": "4 sao",
        "price": 40000,
        "unit": "túi"
      },
      {
        "id": 519,
        "name": "Mít sấy dẻo Tây Ninh",
        "province": "Tây Ninh",
        "stars": "4 sao",
        "price": 120000,
        "unit": "túi"
      },
      {
        "id": 533,
        "name": "Thực phẩm sấy khô hữu cơ cao cấp TP.HCM",
        "province": "TP. Hồ Chí Minh",
        "stars": "5 sao",
        "price": 400000,
        "unit": "túi"
      },
      {
        "id": 538,
        "name": "Thanh long sấy dẻo Châu Thành",
        "province": "Long An",
        "stars": "4 sao",
        "price": 120000,
        "unit": "gói 300g"
      },
      {
        "id": 539,
        "name": "Bánh tráng Long Trì",
        "province": "Long An",
        "stars": "4 sao",
        "price": 45000,
        "unit": "túi"
      },
      {
        "id": 541,
        "name": "Kẹo dừa sầu riêng Tiền Giang đặc biệt",
        "province": "Tiền Giang",
        "stars": "5 sao",
        "price": 110000,
        "unit": "túi"
      },
      {
        "id": 542,
        "name": "Mít sấy dẻo Cai Lậy",
        "province": "Tiền Giang",
        "stars": "4 sao",
        "price": 140000,
        "unit": "gói 300g"
      },
      {
        "id": 546,
        "name": "Kẹo dừa Bến Tre truyền thống",
        "province": "Bến Tre",
        "stars": "4 sao",
        "price": 70000,
        "unit": "túi"
      },
      {
        "id": 547,
        "name": "Bánh phồng sữa dừa",
        "province": "Bến Tre",
        "stars": "4 sao",
        "price": 55000,
        "unit": "túi"
      },
      {
        "id": 548,
        "name": "Kẹo dừa sáp nguyên chất Cầu Kè",
        "province": "Trà Vinh",
        "stars": "5 sao",
        "price": 350000,
        "unit": "hộp"
      },
      {
        "id": 554,
        "name": "Bánh tráng cù lao Mây",
        "province": "Vĩnh Long",
        "stars": "4 sao",
        "price": 50000,
        "unit": "túi"
      },
      {
        "id": 556,
        "name": "Sen hồng sấy khô / Sữa hạt sen Đồng Tháp",
        "province": "Đồng Tháp",
        "stars": "5 sao",
        "price": 300000,
        "unit": "hộp"
      },
      {
        "id": 557,
        "name": "Xoài cát Cao Lãnh sấy dẻo công nghệ cao",
        "province": "Đồng Tháp",
        "stars": "5 sao",
        "price": 250000,
        "unit": "gói"
      },
      {
        "id": 569,
        "name": "Bánh tráng Thuận Hưng cao cấp",
        "province": "Cần Thơ",
        "stars": "5 sao",
        "price": 90000,
        "unit": "túi"
      },
      {
        "id": 574,
        "name": "Khóm Cầu Đúc sấy dẻo",
        "province": "Hậu Giang",
        "stars": "4 sao",
        "price": 130000,
        "unit": "gói"
      },
      {
        "id": 577,
        "name": "Bánh pía Sóc Trăng cao cấp thượng hạng (Hộp đặc biệt)",
        "province": "Sóc Trăng",
        "stars": "5 sao",
        "price": 180000,
        "unit": "hộp"
      },
      {
        "id": 579,
        "name": "Bánh phồng tôm Miệt Thứ",
        "province": "Sóc Trăng",
        "stars": "4 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 582,
        "name": "Bánh phồng tôm Bạc Liêu",
        "province": "Bạc Liêu",
        "stars": "4 sao",
        "price": 90000,
        "unit": "kg"
      }
    ]
  },
  "tra_thao_moc": {
    "group": "Trà & Thảo Mộc",
    "keywords": [
      "trà",
      "chè",
      "thảo mộc",
      "trà xanh",
      "trà hoa",
      "trà túi lọc",
      "matcha",
      "shan tuyết"
    ],
    "products": [
      {
        "id": 336,
        "name": "Trà Phúc / Trà Lộc / Trà Thọ (Cồ Bắc/Hà Nội)",
        "province": "Hà Nội",
        "stars": "5 sao",
        "price": 2000000,
        "unit": "hộp"
      },
      {
        "id": 340,
        "name": "Trà xanh cổ thụ Phìn Hồ hộp 100g",
        "province": "Hà Giang",
        "stars": "5 sao",
        "price": 600000,
        "unit": "hộp"
      },
      {
        "id": 341,
        "name": "Hồng trà Phìn Hồ hộp 100g",
        "province": "Hà Giang",
        "stars": "5 sao",
        "price": 700000,
        "unit": "hộp"
      },
      {
        "id": 344,
        "name": "Trà phun sương Actiso Sa Pa",
        "province": "Lào Cai",
        "stars": "5 sao",
        "price": 150000,
        "unit": "hộp túi lọc"
      },
      {
        "id": 345,
        "name": "Cao mềm Actiso Sa Pa",
        "province": "Lào Cai",
        "stars": "5 sao",
        "price": 500000,
        "unit": "hũ"
      },
      {
        "id": 348,
        "name": "Chè Shan tuyết Suối Giàng thượng hạng",
        "province": "Yên Bái",
        "stars": "5 sao",
        "price": 1800000,
        "unit": "kg"
      },
      {
        "id": 353,
        "name": "Cà phê Mường Ảng hạt rang cao cấp",
        "province": "Điện Biên",
        "stars": "5 sao",
        "price": 450000,
        "unit": "kg"
      },
      {
        "id": 360,
        "name": "Cà phê bột nguyên chất Bích Thao",
        "province": "Sơn La",
        "stars": "5 sao",
        "price": 400000,
        "unit": "kg"
      },
      {
        "id": 361,
        "name": "Trà Ô Long Mộc Châu cao cấp",
        "province": "Sơn La",
        "stars": "5 sao",
        "price": 1200000,
        "unit": "kg"
      },
      {
        "id": 366,
        "name": "Giảo cổ lam sấy khô",
        "province": "Hòa Bình",
        "stars": "4 sao",
        "price": 150000,
        "unit": "kg"
      },
      {
        "id": 368,
        "name": "Chè Đinh cao cấp Hoài Trung",
        "province": "Phú Thọ",
        "stars": "5 sao",
        "price": 1200000,
        "unit": "kg"
      },
      {
        "id": 371,
        "name": "Chè búp tím Thanh Ba",
        "province": "Phú Thọ",
        "stars": "4 sao",
        "price": 800000,
        "unit": "kg"
      },
      {
        "id": 372,
        "name": "Trà hoa vàng Tam Đảo thượng hạng (Hộp quà tặng)",
        "province": "Vĩnh Phúc",
        "stars": "5 sao",
        "price": 4000000,
        "unit": "hộp"
      },
      {
        "id": 375,
        "name": "Trà đinh lăng sấy khô",
        "province": "Vĩnh Phúc",
        "stars": "4 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 376,
        "name": "Chè tôm nõn Hảo Đạt",
        "province": "Thái Nguyên",
        "stars": "5 sao",
        "price": 800000,
        "unit": "kg"
      },
      {
        "id": 378,
        "name": "Cao chè vằng Thái Nguyên",
        "province": "Thái Nguyên",
        "stars": "4 sao",
        "price": 150000,
        "unit": "kg"
      },
      {
        "id": 383,
        "name": "Trà mướp đắng rừng",
        "province": "Bắc Kạn",
        "stars": "4 sao",
        "price": 200000,
        "unit": "kg"
      },
      {
        "id": 387,
        "name": "Rượu làng Vân",
        "province": "Bắc Giang",
        "stars": "4 sao",
        "price": 100000,
        "unit": "lít"
      },
      {
        "id": 391,
        "name": "Trà hoa vàng Ba Chẽ khô",
        "province": "Quảng Ninh",
        "stars": "4 sao",
        "price": 2500000,
        "unit": "hộp"
      },
      {
        "id": 405,
        "name": "Rượu nếp cái hoa vàng Kiến Xương thượng hạng",
        "province": "Thái Bình",
        "stars": "5 sao",
        "price": 200000,
        "unit": "lít"
      },
      {
        "id": 407,
        "name": "Trà hoa hòe sấy khô",
        "province": "Thái Bình",
        "stars": "4 sao",
        "price": 180000,
        "unit": "kg"
      },
      {
        "id": 413,
        "name": "Rượu nếp Kim Sơn hảo hạng (Bình sứ)",
        "province": "Ninh Bình",
        "stars": "5 sao",
        "price": 350000,
        "unit": "bình"
      },
      {
        "id": 425,
        "name": "Miến dong Trà Lĩnh thượng hạng",
        "province": "Cao Bằng",
        "stars": "5 sao",
        "price": 90000,
        "unit": "kg"
      },
      {
        "id": 432,
        "name": "Chè Shan tuyết Na Hang hảo hạng",
        "province": "Tuyên Quang",
        "stars": "5 sao",
        "price": 900000,
        "unit": "kg"
      },
      {
        "id": 456,
        "name": "Trà cung đình Huế thượng hạng (Hộp quà biếu)",
        "province": "Thừa Thiên Huế",
        "stars": "5 sao",
        "price": 400000,
        "unit": "hộp"
      },
      {
        "id": 471,
        "name": "Cá bống sông Trà rim khô",
        "province": "Quảng Ngãi",
        "stars": "4 sao",
        "price": 150000,
        "unit": "hộp 250g"
      },
      {
        "id": 473,
        "name": "Rượu bầu đá truyền thống (Bình cao cấp)",
        "province": "Bình Định",
        "stars": "5 sao",
        "price": 200000,
        "unit": "lít"
      },
      {
        "id": 479,
        "name": "Cà phê rang xay nguyên chất Phú Yên",
        "province": "Phú Yên",
        "stars": "4 sao",
        "price": 280000,
        "unit": "kg"
      },
      {
        "id": 480,
        "name": "Yến sào Khánh Hòa tinh chế cao cấp (Hộp quà biếu)",
        "province": "Khánh Hòa",
        "stars": "5 sao",
        "price": 5000000,
        "unit": "100g"
      },
      {
        "id": 493,
        "name": "Cà phê hạt rang nguyên chất Măng Đen",
        "province": "Kon Tum",
        "stars": "5 sao",
        "price": 400000,
        "unit": "kg"
      },
      {
        "id": 496,
        "name": "Cà phê Fine Robusta Nam Yang",
        "province": "Gia Lai",
        "stars": "5 sao",
        "price": 400000,
        "unit": "kg"
      },
      {
        "id": 498,
        "name": "Mật ong hoa cà phê nguyên chất",
        "province": "Gia Lai",
        "stars": "4 sao",
        "price": 280000,
        "unit": "lít"
      },
      {
        "id": 500,
        "name": "Cà phê hạt rang Buôn Ma Thuột thượng hạng",
        "province": "Đắk Lắk",
        "stars": "5 sao",
        "price": 400000,
        "unit": "kg"
      },
      {
        "id": 501,
        "name": "Bột cacao nguyên chất Buôn Ma Thuột",
        "province": "Đắk Lắk",
        "stars": "5 sao",
        "price": 250000,
        "unit": "hộp"
      },
      {
        "id": 505,
        "name": "Cà phê hạt rang xay Đắk Nông nguyên chất",
        "province": "Đắk Nông",
        "stars": "5 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 506,
        "name": "Khổ qua rừng sấy khô",
        "province": "Đắk Nông",
        "stars": "4 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 508,
        "name": "Cà phê Arabica Cầu Đất thượng hạng (Hộp thiếc)",
        "province": "Lâm Đồng",
        "stars": "5 sao",
        "price": 700000,
        "unit": "kg"
      },
      {
        "id": 510,
        "name": "Trà Atiso Đà Lạt túi lọc / sấy khô",
        "province": "Lâm Đồng",
        "stars": "4 sao",
        "price": 150000,
        "unit": "hộp"
      },
      {
        "id": 513,
        "name": "Cà phê Phước Long hạt rang thượng hạng",
        "province": "Bình Phước",
        "stars": "5 sao",
        "price": 380000,
        "unit": "kg"
      },
      {
        "id": 525,
        "name": "Bột cacao nguyên chất Trọng Đức",
        "province": "Đồng Nai",
        "stars": "5 sao",
        "price": 250000,
        "unit": "hộp"
      },
      {
        "id": 526,
        "name": "Trà sen Nhơn Trạch",
        "province": "Đồng Nai",
        "stars": "4 sao",
        "price": 500000,
        "unit": "hộp"
      },
      {
        "id": 528,
        "name": "Hạt ca cao nguyên chất Châu Đức thượng hạng",
        "province": "Bà Rịa - Vũng Tàu",
        "stars": "5 sao",
        "price": 280000,
        "unit": "hộp"
      },
      {
        "id": 532,
        "name": "Cà phê hòa tan / rang xay cao cấp xuất khẩu TP.HCM",
        "province": "TP. Hồ Chí Minh",
        "stars": "5 sao",
        "price": 600000,
        "unit": "kg"
      },
      {
        "id": 540,
        "name": "Bột ca cao nguyên chất Xuân Ron Chợ Gạo",
        "province": "Tiền Giang",
        "stars": "5 sao",
        "price": 250000,
        "unit": "hộp"
      },
      {
        "id": 549,
        "name": "Kẹo dừa sáp cacao / lá dứa Cầu Kè",
        "province": "Trà Vinh",
        "stars": "5 sao",
        "price": 380000,
        "unit": "hộp"
      },
      {
        "id": 550,
        "name": "Cốm dẹp Trà Vinh",
        "province": "Trà Vinh",
        "stars": "4 sao",
        "price": 90000,
        "unit": "kg"
      },
      {
        "id": 551,
        "name": "Bánh tét Trà Vinh hút chân không",
        "province": "Trà Vinh",
        "stars": "4 sao",
        "price": 120000,
        "unit": "đòn"
      },
      {
        "id": 555,
        "name": "Trà đinh lăng Vĩnh Long",
        "province": "Vĩnh Long",
        "stars": "4 sao",
        "price": 200000,
        "unit": "kg"
      },
      {
        "id": 565,
        "name": "Rượu sim Phú Quốc thượng hạng",
        "province": "Kiên Giang",
        "stars": "5 sao",
        "price": 280000,
        "unit": "chai"
      },
      {
        "id": 568,
        "name": "Cacao nguyên chất Phong Điền thượng hạng (Hộp thiếc)",
        "province": "Cần Thơ",
        "stars": "5 sao",
        "price": 350000,
        "unit": "hộp"
      },
      {
        "id": 570,
        "name": "Trà đinh lăng Cần Thơ",
        "province": "Cần Thơ",
        "stars": "4 sao",
        "price": 180000,
        "unit": "kg"
      },
      {
        "id": 573,
        "name": "Trà mãng cầu Hậu Giang nguyên chất",
        "province": "Hậu Giang",
        "stars": "5 sao",
        "price": 380000,
        "unit": "kg"
      }
    ]
  },
  "thuc_pham_nong_san": {
    "group": "Thực Phẩm & Nông Sản",
    "keywords": [
      "gạo",
      "mì",
      "bún",
      "miến",
      "nước mắm",
      "dầu",
      "thực phẩm",
      "nông sản",
      "thịt",
      "cá",
      "mật ong"
    ],
    "products": [
      {
        "id": 338,
        "name": "Miến dong Minh Hồng (Hoài Đức)",
        "province": "Hà Nội",
        "stars": "4 sao",
        "price": 70000,
        "unit": "kg"
      },
      {
        "id": 342,
        "name": "Mật ong bạc hà Mèo Vạc",
        "province": "Hà Giang",
        "stars": "4 sao",
        "price": 650000,
        "unit": "lít"
      },
      {
        "id": 343,
        "name": "Thịt trâu gác bếp hút chân không",
        "province": "Hà Giang",
        "stars": "4 sao",
        "price": 1100000,
        "unit": "kg"
      },
      {
        "id": 346,
        "name": "Nấm hương rừng Sa Pa khô",
        "province": "Lào Cai",
        "stars": "4 sao",
        "price": 450000,
        "unit": "túi 500g"
      },
      {
        "id": 350,
        "name": "Mật ong nhãn Văn Chấn",
        "province": "Yên Bái",
        "stars": "4 sao",
        "price": 350000,
        "unit": "lít"
      },
      {
        "id": 351,
        "name": "Miến đao Giới Phiên",
        "province": "Yên Bái",
        "stars": "4 sao",
        "price": 70000,
        "unit": "kg"
      },
      {
        "id": 354,
        "name": "Thịt trâu sấy gác bếp bản địa",
        "province": "Điện Biên",
        "stars": "4 sao",
        "price": 1000000,
        "unit": "kg"
      },
      {
        "id": 358,
        "name": "Mật ong rừng nguyên chất Lai Châu",
        "province": "Lai Châu",
        "stars": "4 sao",
        "price": 600000,
        "unit": "lít"
      },
      {
        "id": 359,
        "name": "Thịt lợn sấy gác bếp",
        "province": "Lai Châu",
        "stars": "4 sao",
        "price": 800000,
        "unit": "kg"
      },
      {
        "id": 363,
        "name": "Thịt bò khô bản địa",
        "province": "Sơn La",
        "stars": "4 sao",
        "price": 850000,
        "unit": "kg"
      },
      {
        "id": 364,
        "name": "Măng chua thái sẵn Kim Bôi",
        "province": "Hòa Bình",
        "stars": "5 sao",
        "price": 70000,
        "unit": "túi"
      },
      {
        "id": 365,
        "name": "Măng nứa khô nấu ngay",
        "province": "Hòa Bình",
        "stars": "5 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 367,
        "name": "Mật ong rừng Hòa Bình",
        "province": "Hòa Bình",
        "stars": "4 sao",
        "price": 450000,
        "unit": "lít"
      },
      {
        "id": 369,
        "name": "Mỳ gạo sạch Hùng Lô",
        "province": "Phú Thọ",
        "stars": "5 sao",
        "price": 60000,
        "unit": "kg"
      },
      {
        "id": 370,
        "name": "Thịt chua Thanh Sơn (Hộp đóng kín)",
        "province": "Phú Thọ",
        "stars": "4 sao",
        "price": 70000,
        "unit": "hộp"
      },
      {
        "id": 374,
        "name": "Mật ong Tam Đảo",
        "province": "Vĩnh Phúc",
        "stars": "4 sao",
        "price": 400000,
        "unit": "lít"
      },
      {
        "id": 377,
        "name": "Miến Việt Cường",
        "province": "Thái Nguyên",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 380,
        "name": "Miến dong Tài Hoan",
        "province": "Bắc Kạn",
        "stars": "5 sao",
        "price": 75000,
        "unit": "kg"
      },
      {
        "id": 385,
        "name": "Mỳ Chũ cao cấp Chũ Xuân Trường",
        "province": "Bắc Giang",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 386,
        "name": "Mật ong hoa vải Lục Ngạn",
        "province": "Bắc Giang",
        "stars": "4 sao",
        "price": 300000,
        "unit": "lít"
      },
      {
        "id": 388,
        "name": "Miến dong Bình Liêu",
        "province": "Quảng Ninh",
        "stars": "5 sao",
        "price": 100000,
        "unit": "kg"
      },
      {
        "id": 390,
        "name": "Chả mực Hạ Long hút chân không cấp đông",
        "province": "Quảng Ninh",
        "stars": "4 sao",
        "price": 550000,
        "unit": "kg"
      },
      {
        "id": 393,
        "name": "Hải sản khô thượng hạng Cát Bà (Tôm/Mực khô đóng hộp)",
        "province": "Hải Phòng",
        "stars": "5 sao",
        "price": 1800000,
        "unit": "kg"
      },
      {
        "id": 395,
        "name": "Mật ong rừng Cát Bà",
        "province": "Hải Phòng",
        "stars": "4 sao",
        "price": 500000,
        "unit": "lít"
      },
      {
        "id": 399,
        "name": "Tỏi đen Chí Linh",
        "province": "Hải Dương",
        "stars": "4 sao",
        "price": 800000,
        "unit": "kg"
      },
      {
        "id": 404,
        "name": "Gạo hữu cơ chất lượng cao Thái Bình (Hút chân không)",
        "province": "Thái Bình",
        "stars": "5 sao",
        "price": 70000,
        "unit": "kg"
      },
      {
        "id": 408,
        "name": "Gạo sinh thái ruộng rươi Toản Xuân",
        "province": "Nam Định",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 409,
        "name": "Gạo sạch chất lượng cao Toản Xuân 999",
        "province": "Nam Định",
        "stars": "5 sao",
        "price": 55000,
        "unit": "kg"
      },
      {
        "id": 416,
        "name": "Chuối ngự Đại Hoàng đặc sản tuyển chọn (Đóng thùng an toàn)",
        "province": "Hà Nam",
        "stars": "5 sao",
        "price": 100000,
        "unit": "nải"
      },
      {
        "id": 422,
        "name": "Thịt quay giòn bì Lạng Sơn hút chân không",
        "province": "Lạng Sơn",
        "stars": "4 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 427,
        "name": "Thịt lợn xông khói Cao Bằng",
        "province": "Cao Bằng",
        "stars": "4 sao",
        "price": 450000,
        "unit": "kg"
      },
      {
        "id": 431,
        "name": "Nem Bùi Từ Sơn hút chân không",
        "province": "Bắc Ninh",
        "stars": "4 sao",
        "price": 50000,
        "unit": "chục"
      },
      {
        "id": 433,
        "name": "Mật ong phong mật Na Hang nguyên chất",
        "province": "Tuyên Quang",
        "stars": "5 sao",
        "price": 600000,
        "unit": "lít"
      },
      {
        "id": 434,
        "name": "Miến dong Minh Hương",
        "province": "Tuyên Quang",
        "stars": "4 sao",
        "price": 70000,
        "unit": "kg"
      },
      {
        "id": 435,
        "name": "Thịt trâu khô gác bếp Chiêm Hóa",
        "province": "Tuyên Quang",
        "stars": "4 sao",
        "price": 1000000,
        "unit": "kg"
      },
      {
        "id": 438,
        "name": "Nem chua Thanh Hóa hút chân không",
        "province": "Thanh Hóa",
        "stars": "4 sao",
        "price": 50000,
        "unit": "chục"
      },
      {
        "id": 445,
        "name": "Mật ong rừng Vũ Quang nguyên chất",
        "province": "Hà Tĩnh",
        "stars": "5 sao",
        "price": 650000,
        "unit": "lít"
      },
      {
        "id": 447,
        "name": "Hải sản khô Kỳ Anh",
        "province": "Hà Tĩnh",
        "stars": "4 sao",
        "price": 800000,
        "unit": "kg"
      },
      {
        "id": 448,
        "name": "Đũa gỗ Quảng Thủy xuất khẩu",
        "province": "Quảng Bình",
        "stars": "5 sao",
        "price": 150000,
        "unit": "bịch"
      },
      {
        "id": 449,
        "name": "Mật ong rừng Lệ Thủy thượng hạng",
        "province": "Quảng Bình",
        "stars": "5 sao",
        "price": 600000,
        "unit": "lít"
      },
      {
        "id": 450,
        "name": "Khoai dẻo Quảng Bình",
        "province": "Quảng Bình",
        "stars": "4 sao",
        "price": 100000,
        "unit": "kg"
      },
      {
        "id": 452,
        "name": "Gạo hữu cơ Quảng Trị cao cấp (Hút chân không)",
        "province": "Quảng Trị",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 457,
        "name": "Sen gật gù / Hạt sen khô Huế tuyển chọn",
        "province": "Thừa Thiên Huế",
        "stars": "5 sao",
        "price": 450000,
        "unit": "kg"
      },
      {
        "id": 458,
        "name": "Tôm chua Huế đóng hũ kín",
        "province": "Thừa Thiên Huế",
        "stars": "4 sao",
        "price": 90000,
        "unit": "hũ 500g"
      },
      {
        "id": 462,
        "name": "Chả bò Đà Nẵng hút chân không",
        "province": "Đà Nẵng",
        "stars": "4 sao",
        "price": 420000,
        "unit": "kg"
      },
      {
        "id": 467,
        "name": "Cao lầu khô Hội An",
        "province": "Quảng Nam",
        "stars": "4 sao",
        "price": 80000,
        "unit": "túi 500g"
      },
      {
        "id": 468,
        "name": "Tỏi Lý Sơn chính hãng (Hộp đóng gói xuất khẩu)",
        "province": "Quảng Ngãi",
        "stars": "5 sao",
        "price": 350000,
        "unit": "túi 250g"
      },
      {
        "id": 475,
        "name": "Nem chợ Huyện hút chân không",
        "province": "Bình Định",
        "stars": "4 sao",
        "price": 60000,
        "unit": "chục"
      },
      {
        "id": 476,
        "name": "Bò một nắng hai sương Sơn Hòa thượng hạng (Hút chân không)",
        "province": "Phú Yên",
        "stars": "5 sao",
        "price": 900000,
        "unit": "kg"
      },
      {
        "id": 477,
        "name": "Hạt đười ươi bay khô nguyên chất",
        "province": "Phú Yên",
        "stars": "5 sao",
        "price": 650000,
        "unit": "kg"
      },
      {
        "id": 484,
        "name": "Tỏi cô đơn Ninh Thuận thượng hạng",
        "province": "Ninh Thuận",
        "stars": "5 sao",
        "price": 1200000,
        "unit": "kg"
      },
      {
        "id": 486,
        "name": "Mật nho nguyên chất",
        "province": "Ninh Thuận",
        "stars": "4 sao",
        "price": 150000,
        "unit": "chai"
      },
      {
        "id": 487,
        "name": "Thịt cừu sấy khô",
        "province": "Ninh Thuận",
        "stars": "4 sao",
        "price": 600000,
        "unit": "kg"
      },
      {
        "id": 490,
        "name": "Mực một nắng Phan Thiết (Hút chân không cấp đông)",
        "province": "Bình Thuận",
        "stars": "4 sao",
        "price": 600000,
        "unit": "kg"
      },
      {
        "id": 494,
        "name": "Măng khô rừng Măng Đen",
        "province": "Kon Tum",
        "stars": "4 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 499,
        "name": "Bò một nắng Chư Sê",
        "province": "Gia Lai",
        "stars": "4 sao",
        "price": 700000,
        "unit": "kg"
      },
      {
        "id": 511,
        "name": "Nước cốt dâu tằm / chanh dây nguyên chất",
        "province": "Lâm Đồng",
        "stars": "4 sao",
        "price": 100000,
        "unit": "chai"
      },
      {
        "id": 514,
        "name": "Mật ong hoa điều nguyên chất",
        "province": "Bình Phước",
        "stars": "4 sao",
        "price": 250000,
        "unit": "lít"
      },
      {
        "id": 523,
        "name": "Mủ trôm nguyên chất",
        "province": "Bình Dương",
        "stars": "4 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 527,
        "name": "Mật ong hoa tràm / hoa cao su Đồng Nai",
        "province": "Đồng Nai",
        "stars": "4 sao",
        "price": 250000,
        "unit": "lít"
      },
      {
        "id": 530,
        "name": "Hải sản khô một nắng Côn Đảo (Mực/Cá thu hút chân không)",
        "province": "Bà Rịa - Vũng Tàu",
        "stars": "4 sao",
        "price": 900000,
        "unit": "kg"
      },
      {
        "id": 536,
        "name": "Gạo Nếp nàng hoa Long An thượng hạng (Hút chân không)",
        "province": "Long An",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 544,
        "name": "Mật hoa dừa cô đặc Bến Tre",
        "province": "Bến Tre",
        "stars": "5 sao",
        "price": 280000,
        "unit": "lọ 250ml"
      },
      {
        "id": 552,
        "name": "Tàu hũ ky Bình Minh khô thượng hạng (Đóng gói xuất khẩu)",
        "province": "Vĩnh Long",
        "stars": "5 sao",
        "price": 280000,
        "unit": "kg"
      },
      {
        "id": 553,
        "name": "Mứt bưởi da xanh cao cấp",
        "province": "Vĩnh Long",
        "stars": "5 sao",
        "price": 250000,
        "unit": "túi"
      },
      {
        "id": 558,
        "name": "Nem Lai Vung hút chân không chuẩn vị",
        "province": "Đồng Tháp",
        "stars": "4 sao",
        "price": 55000,
        "unit": "chục"
      },
      {
        "id": 559,
        "name": "Cá lóc khô một nắng",
        "province": "Đồng Tháp",
        "stars": "4 sao",
        "price": 300000,
        "unit": "kg"
      },
      {
        "id": 560,
        "name": "Đường thốt nốt nguyên chất An Giang (Dạng viên/hũ cao cấp)",
        "province": "An Giang",
        "stars": "5 sao",
        "price": 130000,
        "unit": "kg"
      },
      {
        "id": 561,
        "name": "Gạo Nếp vú sữa Tân Châu thượng hạng (Hút chân không)",
        "province": "An Giang",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      },
      {
        "id": 563,
        "name": "Khô bò dứa An Phú",
        "province": "An Giang",
        "stars": "4 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 566,
        "name": "Khô cá thiều Phú Quốc hút chân không",
        "province": "Kiên Giang",
        "stars": "4 sao",
        "price": 450000,
        "unit": "kg"
      },
      {
        "id": 571,
        "name": "Khô nhái (\"vũ nữ chân dài\") đóng gói",
        "province": "Cần Thơ",
        "stars": "4 sao",
        "price": 600000,
        "unit": "kg"
      },
      {
        "id": 572,
        "name": "Khô cá thát lát Hậu Giang thượng hạng (Hút chân không cấp đông)",
        "province": "Hậu Giang",
        "stars": "5 sao",
        "price": 480000,
        "unit": "kg"
      },
      {
        "id": 575,
        "name": "Mật ong hoa tràm U Minh",
        "province": "Hậu Giang",
        "stars": "4 sao",
        "price": 300000,
        "unit": "lít"
      },
      {
        "id": 576,
        "name": "Gạo ST25 Sóc Trăng chính hãng Hồ Quang Trí (Hút chân không)",
        "province": "Sóc Trăng",
        "stars": "5 sao",
        "price": 70000,
        "unit": "kg"
      },
      {
        "id": 578,
        "name": "Lạp xưởng tôm Sóc Trăng hút chân không",
        "province": "Sóc Trăng",
        "stars": "4 sao",
        "price": 260000,
        "unit": "kg"
      },
      {
        "id": 581,
        "name": "Gạo Nếp thơm Bạc Liêu tuyển chọn",
        "province": "Bạc Liêu",
        "stars": "5 sao",
        "price": 55000,
        "unit": "kg"
      },
      {
        "id": 583,
        "name": "Khô cá lóc đồng Bạc Liêu",
        "province": "Bạc Liêu",
        "stars": "4 sao",
        "price": 260000,
        "unit": "kg"
      },
      {
        "id": 584,
        "name": "Tôm khô Cà Mau loại thượng hạng đặc biệt (Hút chân không)",
        "province": "Cà Mau",
        "stars": "5 sao",
        "price": 2200000,
        "unit": "kg"
      },
      {
        "id": 585,
        "name": "Mật ong rừng U Minh Hạ nguyên chất 100%",
        "province": "Cà Mau",
        "stars": "5 sao",
        "price": 800000,
        "unit": "lít"
      },
      {
        "id": 586,
        "name": "Khô cá bổi U Minh",
        "province": "Cà Mau",
        "stars": "4 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 587,
        "name": "Cua biển Cà Mau đóng thùng xốp vận chuyển xa",
        "province": "Cà Mau",
        "stars": "4 sao",
        "price": 700000,
        "unit": "kg"
      }
    ]
  },
  "gia_vi_nong_san_kho": {
    "group": "Gia Vị & Nông Sản Khô",
    "keywords": [
      "gia vị",
      "tương",
      "muối",
      "hạt tiêu",
      "sả",
      "gừng",
      "tỏi",
      "ớt",
      "khô",
      "bột"
    ],
    "products": [
      {
        "id": 347,
        "name": "Tương ớt Mường Khương",
        "province": "Lào Cai",
        "stars": "4 sao",
        "price": 50000,
        "unit": "chai"
      },
      {
        "id": 349,
        "name": "Quế ống khô bóc vỏ xuất khẩu",
        "province": "Yên Bái",
        "stars": "5 sao",
        "price": 400000,
        "unit": "kg"
      },
      {
        "id": 352,
        "name": "Gạo nương Điện Biên thơm đặc sản (Hút chân không)",
        "province": "Điện Biên",
        "stars": "5 sao",
        "price": 70000,
        "unit": "kg"
      },
      {
        "id": 355,
        "name": "Hạt mắc khén khô",
        "province": "Điện Biên",
        "stars": "4 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 382,
        "name": "Tinh bột nghệ vàng Bắc Kạn",
        "province": "Bắc Kạn",
        "stars": "4 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 384,
        "name": "Vải thiều Lục Ngạn Hồng Xuân (Tiêu chuẩn xuất khẩu)",
        "province": "Bắc Giang",
        "stars": "5 sao",
        "price": 150000,
        "unit": "kg"
      },
      {
        "id": 392,
        "name": "Nước mắm Cát Hải đặc biệt (Thùng quà tặng)",
        "province": "Hải Phòng",
        "stars": "5 sao",
        "price": 400000,
        "unit": "thùng"
      },
      {
        "id": 402,
        "name": "Tinh bột nghệ đỏ Hưng Yên",
        "province": "Hưng Yên",
        "stars": "4 sao",
        "price": 600000,
        "unit": "kg"
      },
      {
        "id": 403,
        "name": "Tương Bần Hưng Yên đóng chai",
        "province": "Hưng Yên",
        "stars": "4 sao",
        "price": 60000,
        "unit": "chai"
      },
      {
        "id": 414,
        "name": "Mắm tép Gia Viễn",
        "province": "Ninh Bình",
        "stars": "4 sao",
        "price": 120000,
        "unit": "hũ"
      },
      {
        "id": 417,
        "name": "Bột sắn dây nguyên chất cao cấp Hà Nam",
        "province": "Hà Nam",
        "stars": "5 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 420,
        "name": "Hoa hồi khô nguyên bông Lạng Sơn xuất khẩu",
        "province": "Lạng Sơn",
        "stars": "5 sao",
        "price": 400000,
        "unit": "kg"
      },
      {
        "id": 423,
        "name": "Mạch nha Lạng Sơn",
        "province": "Lạng Sơn",
        "stars": "4 sao",
        "price": 70000,
        "unit": "hũ"
      },
      {
        "id": 436,
        "name": "Nước mắm Lê Gia cốt đặc biệt",
        "province": "Thanh Hóa",
        "stars": "5 sao",
        "price": 250000,
        "unit": "lít"
      },
      {
        "id": 437,
        "name": "Mắm tôm Lê Gia cao cấp",
        "province": "Thanh Hóa",
        "stars": "5 sao",
        "price": 90000,
        "unit": "chai"
      },
      {
        "id": 441,
        "name": "Nước mắm Vạn Phần thượng hạng",
        "province": "Nghệ An",
        "stars": "5 sao",
        "price": 200000,
        "unit": "lít"
      },
      {
        "id": 442,
        "name": "Tương Nam Đàn đóng chai",
        "province": "Nghệ An",
        "stars": "4 sao",
        "price": 60000,
        "unit": "lít"
      },
      {
        "id": 443,
        "name": "Tinh bột nghệ Nghệ An",
        "province": "Nghệ An",
        "stars": "4 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 451,
        "name": "Nước mắm Bảo Ninh",
        "province": "Quảng Bình",
        "stars": "4 sao",
        "price": 150000,
        "unit": "lít"
      },
      {
        "id": 453,
        "name": "Tiêu đen hữu cơ Cam Lộ thượng hạng",
        "province": "Quảng Trị",
        "stars": "5 sao",
        "price": 300000,
        "unit": "kg"
      },
      {
        "id": 460,
        "name": "Nước mắm Nam Ô nhĩ đặc biệt",
        "province": "Đà Nẵng",
        "stars": "5 sao",
        "price": 300000,
        "unit": "lít"
      },
      {
        "id": 464,
        "name": "Quế Trà My bóc vỏ thượng hạng (Hộp quà)",
        "province": "Quảng Nam",
        "stars": "5 sao",
        "price": 700000,
        "unit": "kg"
      },
      {
        "id": 469,
        "name": "Mạch nha Quảng Ngãi đường Mantoza",
        "province": "Quảng Ngãi",
        "stars": "5 sao",
        "price": 100000,
        "unit": "hũ"
      },
      {
        "id": 470,
        "name": "Đường phèn, đường phổi Quảng Ngãi",
        "province": "Quảng Ngãi",
        "stars": "4 sao",
        "price": 55000,
        "unit": "kg"
      },
      {
        "id": 483,
        "name": "Muối ớt tôm Nha Trang",
        "province": "Khánh Hòa",
        "stars": "4 sao",
        "price": 50000,
        "unit": "hũ"
      },
      {
        "id": 488,
        "name": "Nước mắm Phan Thiết nhĩ đặc biệt (Chai đóng seal)",
        "province": "Bình Thuận",
        "stars": "5 sao",
        "price": 250000,
        "unit": "lít"
      },
      {
        "id": 495,
        "name": "Hạt dổi rừng khô",
        "province": "Kon Tum",
        "stars": "4 sao",
        "price": 2500000,
        "unit": "kg"
      },
      {
        "id": 497,
        "name": "Hạt điều rang muối đặc sản Gia Lai",
        "province": "Gia Lai",
        "stars": "5 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 507,
        "name": "Tinh bột nghệ nguyên chất Đắk Nông",
        "province": "Đắk Nông",
        "stars": "4 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 512,
        "name": "Hạt điều rang muối Bình Phước xuất khẩu (Hộp cao cấp)",
        "province": "Bình Phước",
        "stars": "5 sao",
        "price": 450000,
        "unit": "kg"
      },
      {
        "id": 517,
        "name": "Muối tôm Tây Ninh thượng hạng (Hũ niêm phong)",
        "province": "Tây Ninh",
        "stars": "5 sao",
        "price": 90000,
        "unit": "hũ 500g"
      },
      {
        "id": 520,
        "name": "Hạt điều rang muối Bình Dương thượng hạng",
        "province": "Bình Dương",
        "stars": "5 sao",
        "price": 380000,
        "unit": "kg"
      },
      {
        "id": 522,
        "name": "Tinh bột nghệ Bình Dương",
        "province": "Bình Dương",
        "stars": "4 sao",
        "price": 500000,
        "unit": "kg"
      },
      {
        "id": 524,
        "name": "Hạt điều vị rang muối nguyên bản Nga Biên",
        "province": "Đồng Nai",
        "stars": "5 sao",
        "price": 350000,
        "unit": "kg"
      },
      {
        "id": 529,
        "name": "Nước mắm Trí Hải cốt đặc biệt",
        "province": "Bà Rịa - Vũng Tàu",
        "stars": "5 sao",
        "price": 180000,
        "unit": "lít"
      },
      {
        "id": 531,
        "name": "Bánh bông lan trứng muối đóng hộp cứng",
        "province": "Bà Rịa - Vũng Tàu",
        "stars": "4 sao",
        "price": 70000,
        "unit": "hộp"
      },
      {
        "id": 535,
        "name": "Bánh tráng nướng muối ớt Sài Gòn",
        "province": "TP. Hồ Chí Minh",
        "stars": "4 sao",
        "price": 60000,
        "unit": "túi"
      },
      {
        "id": 543,
        "name": "Nước mắm Gò Công",
        "province": "Tiền Giang",
        "stars": "4 sao",
        "price": 150000,
        "unit": "lít"
      },
      {
        "id": 545,
        "name": "Dầu dừa tinh khiết xuất khẩu Bến Tre",
        "province": "Bến Tre",
        "stars": "5 sao",
        "price": 200000,
        "unit": "chai"
      },
      {
        "id": 562,
        "name": "Mắm cá linh / Mắm thái Châu Đốc (Hũ nhựa kín)",
        "province": "An Giang",
        "stars": "4 sao",
        "price": 100000,
        "unit": "hũ 500g"
      },
      {
        "id": 564,
        "name": "Nước mắm Phú Quốc Huỳnh Khoa 43°/45° đạm",
        "province": "Kiên Giang",
        "stars": "5 sao",
        "price": 500000,
        "unit": "lít"
      },
      {
        "id": 567,
        "name": "Tiêu hạt Phú Quốc khô",
        "province": "Kiên Giang",
        "stars": "4 sao",
        "price": 250000,
        "unit": "kg"
      },
      {
        "id": 580,
        "name": "Muối hạt / Muối tinh Bạc Liêu cao cấp (Hộp xuất khẩu)",
        "province": "Bạc Liêu",
        "stars": "5 sao",
        "price": 80000,
        "unit": "kg"
      }
    ]
  },
  "qua_tang_thu_cong_my_nghe": {
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ",
    "keywords": [
      "quà tặng",
      "thủ công",
      "mỹ nghệ",
      "lụa",
      "thêu",
      "đan",
      "gốm",
      "sứ",
      "chăn",
      "đệm"
    ],
    "products": [
      {
        "id": 337,
        "name": "Chăn bông tơ tằm tự dệt (Mỹ Đức)",
        "province": "Hà Nội",
        "stars": "5 sao",
        "price": 4000000,
        "unit": "chiếc"
      },
      {
        "id": 339,
        "name": "Bánh chưng Tranh Khúc hút chân không",
        "province": "Hà Nội",
        "stars": "4 sao",
        "price": 80000,
        "unit": "chiếc"
      },
      {
        "id": 356,
        "name": "Sâm Lai Châu củ tươi / thái lát sấy khô thượng hạng",
        "province": "Lai Châu",
        "stars": "5 sao",
        "price": 6000000,
        "unit": "hộp"
      },
      {
        "id": 373,
        "name": "Cao gắm Tam Đảo hỗ trợ xương khớp",
        "province": "Vĩnh Phúc",
        "stars": "5 sao",
        "price": 600000,
        "unit": "hộp"
      },
      {
        "id": 381,
        "name": "Nano Curcumin Bắc Hà (Vicumax)",
        "province": "Bắc Kạn",
        "stars": "5 sao",
        "price": 800000,
        "unit": "hộp"
      },
      {
        "id": 389,
        "name": "Bộ lọ hoa men chảy Gốm sứ Quang Vinh",
        "province": "Quảng Ninh",
        "stars": "5 sao",
        "price": 3000000,
        "unit": "bộ"
      },
      {
        "id": 396,
        "name": "Bình hút lộc / Bình giọt ngọc Gốm Chu Đậu",
        "province": "Hải Dương",
        "stars": "5 sao",
        "price": 3500000,
        "unit": "bình"
      },
      {
        "id": 421,
        "name": "Tinh dầu hồi Lạng Sơn nguyên chất",
        "province": "Lạng Sơn",
        "stars": "5 sao",
        "price": 350000,
        "unit": "lọ"
      },
      {
        "id": 428,
        "name": "Rượu làng Hòa Tiến thượng hạng (Bình gốm)",
        "province": "Bắc Ninh",
        "stars": "5 sao",
        "price": 250000,
        "unit": "lít"
      },
      {
        "id": 429,
        "name": "Tranh dân tộc Hồ cao cấp (Thủ công mỹ nghệ 5 sao)",
        "province": "Bắc Ninh",
        "stars": "5 sao",
        "price": 1000000,
        "unit": "tranh"
      },
      {
        "id": 440,
        "name": "Bộ đèn tre Đức Phong (Thủ công mỹ nghệ)",
        "province": "Nghệ An",
        "stars": "5 sao",
        "price": 1500000,
        "unit": "chiếc"
      },
      {
        "id": 454,
        "name": "Tinh dầu nén Quảng Trị",
        "province": "Quảng Trị",
        "stars": "4 sao",
        "price": 150000,
        "unit": "lọ"
      },
      {
        "id": 455,
        "name": "Cao gắm thảo dược",
        "province": "Quảng Trị",
        "stars": "4 sao",
        "price": 400000,
        "unit": "hộp"
      },
      {
        "id": 459,
        "name": "Dầu tràm Huế nguyên chất",
        "province": "Thừa Thiên Huế",
        "stars": "4 sao",
        "price": 200000,
        "unit": "lọ"
      },
      {
        "id": 461,
        "name": "Đồ thủ công mỹ nghệ đá non Ngũ Hành Sơn cao cấp",
        "province": "Đà Nẵng",
        "stars": "5 sao",
        "price": 2000000,
        "unit": "món"
      },
      {
        "id": 465,
        "name": "Trà sâm dược liệu Quế Trà My",
        "province": "Quảng Nam",
        "stars": "5 sao",
        "price": 600000,
        "unit": "hộp"
      },
      {
        "id": 492,
        "name": "Sâm Ngọc Linh Kon Tum ngâm mật ong rừng",
        "province": "Kon Tum",
        "stars": "5 sao",
        "price": 7000000,
        "unit": "hũ"
      },
      {
        "id": 521,
        "name": "Gốm sứ thủ công mỹ nghệ cao cấp Bình Dương",
        "province": "Bình Dương",
        "stars": "5 sao",
        "price": 2500000,
        "unit": "bộ"
      },
      {
        "id": 534,
        "name": "Hàng thủ công mây tre đan Sài Gòn",
        "province": "TP. Hồ Chí Minh",
        "stars": "4 sao",
        "price": 800000,
        "unit": "món"
      },
      {
        "id": 537,
        "name": "Rượu đế Gò Đen hảo hạng (Bình gốm)",
        "province": "Long An",
        "stars": "5 sao",
        "price": 180000,
        "unit": "lít"
      }
    ]
  }
};

/**
 * Index tra cứu theo tỉnh/thành phố
 */
const BY_PROVINCE = {
  "Lai Châu": [
    {
      "id": 357,
      "name": "Hạt mắc ca Lai Châu tách hạt sấy khô",
      "province": "Lai Châu",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 358,
      "name": "Mật ong rừng nguyên chất Lai Châu",
      "province": "Lai Châu",
      "stars": "4 sao",
      "price": 600000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 359,
      "name": "Thịt lợn sấy gác bếp",
      "province": "Lai Châu",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 356,
      "name": "Sâm Lai Châu củ tươi / thái lát sấy khô thượng hạng",
      "province": "Lai Châu",
      "stars": "5 sao",
      "price": 6000000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Sơn La": [
    {
      "id": 362,
      "name": "Xoài sấy dẻo Yên Châu",
      "province": "Sơn La",
      "stars": "4 sao",
      "price": 120000,
      "unit": "gói 300g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 360,
      "name": "Cà phê bột nguyên chất Bích Thao",
      "province": "Sơn La",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 361,
      "name": "Trà Ô Long Mộc Châu cao cấp",
      "province": "Sơn La",
      "stars": "5 sao",
      "price": 1200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 363,
      "name": "Thịt bò khô bản địa",
      "province": "Sơn La",
      "stars": "4 sao",
      "price": 850000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Thái Nguyên": [
    {
      "id": 379,
      "name": "Bánh chưng bờ Đậu hút chân không",
      "province": "Thái Nguyên",
      "stars": "4 sao",
      "price": 100000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 376,
      "name": "Chè tôm nõn Hảo Đạt",
      "province": "Thái Nguyên",
      "stars": "5 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 378,
      "name": "Cao chè vằng Thái Nguyên",
      "province": "Thái Nguyên",
      "stars": "4 sao",
      "price": 150000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 377,
      "name": "Miến Việt Cường",
      "province": "Thái Nguyên",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Hải Phòng": [
    {
      "id": 394,
      "name": "Bánh đa cua khô Hải Phòng",
      "province": "Hải Phòng",
      "stars": "4 sao",
      "price": 60000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 393,
      "name": "Hải sản khô thượng hạng Cát Bà (Tôm/Mực khô đóng hộp)",
      "province": "Hải Phòng",
      "stars": "5 sao",
      "price": 1800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 395,
      "name": "Mật ong rừng Cát Bà",
      "province": "Hải Phòng",
      "stars": "4 sao",
      "price": 500000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 392,
      "name": "Nước mắm Cát Hải đặc biệt (Thùng quà tặng)",
      "province": "Hải Phòng",
      "stars": "5 sao",
      "price": 400000,
      "unit": "thùng",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Hải Dương": [
    {
      "id": 397,
      "name": "Bánh đậu xanh Rồng Vàng Hoàng Gia",
      "province": "Hải Dương",
      "stars": "5 sao",
      "price": 150000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 398,
      "name": "Bánh gai Ninh Giang",
      "province": "Hải Dương",
      "stars": "4 sao",
      "price": 12000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 399,
      "name": "Tỏi đen Chí Linh",
      "province": "Hải Dương",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 396,
      "name": "Bình hút lộc / Bình giọt ngọc Gốm Chu Đậu",
      "province": "Hải Dương",
      "stars": "5 sao",
      "price": 3500000,
      "unit": "bình",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Hưng Yên": [
    {
      "id": 400,
      "name": "Long nhãn lồng Hưng Yên thượng hạng (Hộp biếu cao cấp)",
      "province": "Hưng Yên",
      "stars": "5 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 401,
      "name": "Hạt sen sấy khô nguyên vị Hưng Yên",
      "province": "Hưng Yên",
      "stars": "5 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 402,
      "name": "Tinh bột nghệ đỏ Hưng Yên",
      "province": "Hưng Yên",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 403,
      "name": "Tương Bần Hưng Yên đóng chai",
      "province": "Hưng Yên",
      "stars": "4 sao",
      "price": 60000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Thái Bình": [
    {
      "id": 406,
      "name": "Bánh cáy làng Nguyễn",
      "province": "Thái Bình",
      "stars": "4 sao",
      "price": 80000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 405,
      "name": "Rượu nếp cái hoa vàng Kiến Xương thượng hạng",
      "province": "Thái Bình",
      "stars": "5 sao",
      "price": 200000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 407,
      "name": "Trà hoa hòe sấy khô",
      "province": "Thái Bình",
      "stars": "4 sao",
      "price": 180000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 404,
      "name": "Gạo hữu cơ chất lượng cao Thái Bình (Hút chân không)",
      "province": "Thái Bình",
      "stars": "5 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Nam Định": [
    {
      "id": 410,
      "name": "Bánh nhãn Hải Hậu",
      "province": "Nam Định",
      "stars": "4 sao",
      "price": 60000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 411,
      "name": "Kẹo sìu châu Nam Định",
      "province": "Nam Định",
      "stars": "4 sao",
      "price": 80000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 408,
      "name": "Gạo sinh thái ruộng rươi Toản Xuân",
      "province": "Nam Định",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 409,
      "name": "Gạo sạch chất lượng cao Toản Xuân 999",
      "province": "Nam Định",
      "stars": "5 sao",
      "price": 55000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Ninh Bình": [
    {
      "id": 412,
      "name": "Cơm cháy Ninh Bình cao cấp (Đóng gói xuất khẩu)",
      "province": "Ninh Bình",
      "stars": "5 sao",
      "price": 150000,
      "unit": "túi 500g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 415,
      "name": "Hoa cúc chi sấy khô Ninh Bình",
      "province": "Ninh Bình",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 413,
      "name": "Rượu nếp Kim Sơn hảo hạng (Bình sứ)",
      "province": "Ninh Bình",
      "stars": "5 sao",
      "price": 350000,
      "unit": "bình",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 414,
      "name": "Mắm tép Gia Viễn",
      "province": "Ninh Bình",
      "stars": "4 sao",
      "price": 120000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Hà Nam": [
    {
      "id": 418,
      "name": "Kẹo lạc Duy Tiên",
      "province": "Hà Nam",
      "stars": "4 sao",
      "price": 60000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 419,
      "name": "Bánh đa nem Chợ Sí",
      "province": "Hà Nam",
      "stars": "4 sao",
      "price": 45000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 416,
      "name": "Chuối ngự Đại Hoàng đặc sản tuyển chọn (Đóng thùng an toàn)",
      "province": "Hà Nam",
      "stars": "5 sao",
      "price": 100000,
      "unit": "nải",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 417,
      "name": "Bột sắn dây nguyên chất cao cấp Hà Nam",
      "province": "Hà Nam",
      "stars": "5 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Cao Bằng": [
    {
      "id": 424,
      "name": "Hạt dẻ Trùng Khánh loại 1 tuyển chọn",
      "province": "Cao Bằng",
      "stars": "5 sao",
      "price": 280000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 426,
      "name": "Bánh khảo Cao Bằng",
      "province": "Cao Bằng",
      "stars": "4 sao",
      "price": 65000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 425,
      "name": "Miến dong Trà Lĩnh thượng hạng",
      "province": "Cao Bằng",
      "stars": "5 sao",
      "price": 90000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 427,
      "name": "Thịt lợn xông khói Cao Bằng",
      "province": "Cao Bằng",
      "stars": "4 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Bắc Ninh": [
    {
      "id": 430,
      "name": "Bánh phu thê Đình Bảng",
      "province": "Bắc Ninh",
      "stars": "4 sao",
      "price": 8000,
      "unit": "cái",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 431,
      "name": "Nem Bùi Từ Sơn hút chân không",
      "province": "Bắc Ninh",
      "stars": "4 sao",
      "price": 50000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 428,
      "name": "Rượu làng Hòa Tiến thượng hạng (Bình gốm)",
      "province": "Bắc Ninh",
      "stars": "5 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 429,
      "name": "Tranh dân tộc Hồ cao cấp (Thủ công mỹ nghệ 5 sao)",
      "province": "Bắc Ninh",
      "stars": "5 sao",
      "price": 1000000,
      "unit": "tranh",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Thanh Hóa": [
    {
      "id": 439,
      "name": "Bánh gai Tứ Trụ",
      "province": "Thanh Hóa",
      "stars": "4 sao",
      "price": 10000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 438,
      "name": "Nem chua Thanh Hóa hút chân không",
      "province": "Thanh Hóa",
      "stars": "4 sao",
      "price": 50000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 436,
      "name": "Nước mắm Lê Gia cốt đặc biệt",
      "province": "Thanh Hóa",
      "stars": "5 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 437,
      "name": "Mắm tôm Lê Gia cao cấp",
      "province": "Thanh Hóa",
      "stars": "5 sao",
      "price": 90000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Hà Tĩnh": [
    {
      "id": 444,
      "name": "Kẹo cu đơ Thư Sơn thượng hạng (Hộp ép kín)",
      "province": "Hà Tĩnh",
      "stars": "5 sao",
      "price": 90000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 446,
      "name": "Bánh đa dừa Độc Lập",
      "province": "Hà Tĩnh",
      "stars": "4 sao",
      "price": 25000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 445,
      "name": "Mật ong rừng Vũ Quang nguyên chất",
      "province": "Hà Tĩnh",
      "stars": "5 sao",
      "price": 650000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 447,
      "name": "Hải sản khô Kỳ Anh",
      "province": "Hà Tĩnh",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Đà Nẵng": [
    {
      "id": 463,
      "name": "Bánh khô mè Cẩm Lệ",
      "province": "Đà Nẵng",
      "stars": "4 sao",
      "price": 60000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 462,
      "name": "Chả bò Đà Nẵng hút chân không",
      "province": "Đà Nẵng",
      "stars": "4 sao",
      "price": 420000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 460,
      "name": "Nước mắm Nam Ô nhĩ đặc biệt",
      "province": "Đà Nẵng",
      "stars": "5 sao",
      "price": 300000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 461,
      "name": "Đồ thủ công mỹ nghệ đá non Ngũ Hành Sơn cao cấp",
      "province": "Đà Nẵng",
      "stars": "5 sao",
      "price": 2000000,
      "unit": "món",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Quảng Nam": [
    {
      "id": 466,
      "name": "Bánh tráng Đại Lộc",
      "province": "Quảng Nam",
      "stars": "4 sao",
      "price": 50000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 467,
      "name": "Cao lầu khô Hội An",
      "province": "Quảng Nam",
      "stars": "4 sao",
      "price": 80000,
      "unit": "túi 500g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 464,
      "name": "Quế Trà My bóc vỏ thượng hạng (Hộp quà)",
      "province": "Quảng Nam",
      "stars": "5 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 465,
      "name": "Trà sâm dược liệu Quế Trà My",
      "province": "Quảng Nam",
      "stars": "5 sao",
      "price": 600000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Bình Định": [
    {
      "id": 472,
      "name": "Bánh tráng gạo mè Dalop đặc biệt M4",
      "province": "Bình Định",
      "stars": "5 sao",
      "price": 70000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 474,
      "name": "Bánh tráng dừa Tam Quan",
      "province": "Bình Định",
      "stars": "4 sao",
      "price": 25000,
      "unit": "cái",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 473,
      "name": "Rượu bầu đá truyền thống (Bình cao cấp)",
      "province": "Bình Định",
      "stars": "5 sao",
      "price": 200000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 475,
      "name": "Nem chợ Huyện hút chân không",
      "province": "Bình Định",
      "stars": "4 sao",
      "price": 60000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Phú Yên": [
    {
      "id": 478,
      "name": "Bánh tráng Hòa Đa",
      "province": "Phú Yên",
      "stars": "4 sao",
      "price": 45000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 479,
      "name": "Cà phê rang xay nguyên chất Phú Yên",
      "province": "Phú Yên",
      "stars": "4 sao",
      "price": 280000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 476,
      "name": "Bò một nắng hai sương Sơn Hòa thượng hạng (Hút chân không)",
      "province": "Phú Yên",
      "stars": "5 sao",
      "price": 900000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 477,
      "name": "Hạt đười ươi bay khô nguyên chất",
      "province": "Phú Yên",
      "stars": "5 sao",
      "price": 650000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Khánh Hòa": [
    {
      "id": 481,
      "name": "Rong biển sấy khô Nha Trang giòn nguyên vị",
      "province": "Khánh Hòa",
      "stars": "5 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 482,
      "name": "Bánh xoài Cam Ranh",
      "province": "Khánh Hòa",
      "stars": "4 sao",
      "price": 60000,
      "unit": "túi 500g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 480,
      "name": "Yến sào Khánh Hòa tinh chế cao cấp (Hộp quà biếu)",
      "province": "Khánh Hòa",
      "stars": "5 sao",
      "price": 5000000,
      "unit": "100g",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 483,
      "name": "Muối ớt tôm Nha Trang",
      "province": "Khánh Hòa",
      "stars": "4 sao",
      "price": 50000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Ninh Thuận": [
    {
      "id": 485,
      "name": "Nho khô nguyên cành Ninh Thuận nhập/sấy xuất khẩu",
      "province": "Ninh Thuận",
      "stars": "5 sao",
      "price": 300000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 484,
      "name": "Tỏi cô đơn Ninh Thuận thượng hạng",
      "province": "Ninh Thuận",
      "stars": "5 sao",
      "price": 1200000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 486,
      "name": "Mật nho nguyên chất",
      "province": "Ninh Thuận",
      "stars": "4 sao",
      "price": 150000,
      "unit": "chai",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 487,
      "name": "Thịt cừu sấy khô",
      "province": "Ninh Thuận",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Bình Thuận": [
    {
      "id": 489,
      "name": "Thanh long sấy dẻo công nghệ cao (Hộp xuất khẩu)",
      "province": "Bình Thuận",
      "stars": "5 sao",
      "price": 180000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 491,
      "name": "Bánh rế Phan Thiết",
      "province": "Bình Thuận",
      "stars": "4 sao",
      "price": 50000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 490,
      "name": "Mực một nắng Phan Thiết (Hút chân không cấp đông)",
      "province": "Bình Thuận",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 488,
      "name": "Nước mắm Phan Thiết nhĩ đặc biệt (Chai đóng seal)",
      "province": "Bình Thuận",
      "stars": "5 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Đắk Lắk": [
    {
      "id": 502,
      "name": "Bơ sấy dẻo",
      "province": "Đắk Lắk",
      "stars": "4 sao",
      "price": 150000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 503,
      "name": "Hạt mắc ca Krông Năng",
      "province": "Đắk Lắk",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 500,
      "name": "Cà phê hạt rang Buôn Ma Thuột thượng hạng",
      "province": "Đắk Lắk",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 501,
      "name": "Bột cacao nguyên chất Buôn Ma Thuột",
      "province": "Đắk Lắk",
      "stars": "5 sao",
      "price": 250000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    }
  ],
  "Đắk Nông": [
    {
      "id": 504,
      "name": "Hạt điều rang củi Đắk Nông xuất khẩu",
      "province": "Đắk Nông",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 505,
      "name": "Cà phê hạt rang xay Đắk Nông nguyên chất",
      "province": "Đắk Nông",
      "stars": "5 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 506,
      "name": "Khổ qua rừng sấy khô",
      "province": "Đắk Nông",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 507,
      "name": "Tinh bột nghệ nguyên chất Đắk Nông",
      "province": "Đắk Nông",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Lâm Đồng": [
    {
      "id": 509,
      "name": "Hồng treo gió Đà Lạt công nghệ cao (Hút chân không)",
      "province": "Lâm Đồng",
      "stars": "5 sao",
      "price": 550000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 508,
      "name": "Cà phê Arabica Cầu Đất thượng hạng (Hộp thiếc)",
      "province": "Lâm Đồng",
      "stars": "5 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 510,
      "name": "Trà Atiso Đà Lạt túi lọc / sấy khô",
      "province": "Lâm Đồng",
      "stars": "4 sao",
      "price": 150000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 511,
      "name": "Nước cốt dâu tằm / chanh dây nguyên chất",
      "province": "Lâm Đồng",
      "stars": "4 sao",
      "price": 100000,
      "unit": "chai",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Bình Phước": [
    {
      "id": 515,
      "name": "Trái cây sấy thập cẩm",
      "province": "Bình Phước",
      "stars": "4 sao",
      "price": 110000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 513,
      "name": "Cà phê Phước Long hạt rang thượng hạng",
      "province": "Bình Phước",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 514,
      "name": "Mật ong hoa điều nguyên chất",
      "province": "Bình Phước",
      "stars": "4 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 512,
      "name": "Hạt điều rang muối Bình Phước xuất khẩu (Hộp cao cấp)",
      "province": "Bình Phước",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Tây Ninh": [
    {
      "id": 516,
      "name": "Bánh tráng phơi sương Trảng Bàng cao cấp (Đóng kín)",
      "province": "Tây Ninh",
      "stars": "5 sao",
      "price": 80000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 518,
      "name": "Bánh tráng me Tây Ninh",
      "province": "Tây Ninh",
      "stars": "4 sao",
      "price": 40000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 519,
      "name": "Mít sấy dẻo Tây Ninh",
      "province": "Tây Ninh",
      "stars": "4 sao",
      "price": 120000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 517,
      "name": "Muối tôm Tây Ninh thượng hạng (Hũ niêm phong)",
      "province": "Tây Ninh",
      "stars": "5 sao",
      "price": 90000,
      "unit": "hũ 500g",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "TP. Hồ Chí Minh": [
    {
      "id": 533,
      "name": "Thực phẩm sấy khô hữu cơ cao cấp TP.HCM",
      "province": "TP. Hồ Chí Minh",
      "stars": "5 sao",
      "price": 400000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 532,
      "name": "Cà phê hòa tan / rang xay cao cấp xuất khẩu TP.HCM",
      "province": "TP. Hồ Chí Minh",
      "stars": "5 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 535,
      "name": "Bánh tráng nướng muối ớt Sài Gòn",
      "province": "TP. Hồ Chí Minh",
      "stars": "4 sao",
      "price": 60000,
      "unit": "túi",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 534,
      "name": "Hàng thủ công mây tre đan Sài Gòn",
      "province": "TP. Hồ Chí Minh",
      "stars": "4 sao",
      "price": 800000,
      "unit": "món",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Long An": [
    {
      "id": 538,
      "name": "Thanh long sấy dẻo Châu Thành",
      "province": "Long An",
      "stars": "4 sao",
      "price": 120000,
      "unit": "gói 300g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 539,
      "name": "Bánh tráng Long Trì",
      "province": "Long An",
      "stars": "4 sao",
      "price": 45000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 536,
      "name": "Gạo Nếp nàng hoa Long An thượng hạng (Hút chân không)",
      "province": "Long An",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 537,
      "name": "Rượu đế Gò Đen hảo hạng (Bình gốm)",
      "province": "Long An",
      "stars": "5 sao",
      "price": 180000,
      "unit": "lít",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Tiền Giang": [
    {
      "id": 541,
      "name": "Kẹo dừa sầu riêng Tiền Giang đặc biệt",
      "province": "Tiền Giang",
      "stars": "5 sao",
      "price": 110000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 542,
      "name": "Mít sấy dẻo Cai Lậy",
      "province": "Tiền Giang",
      "stars": "4 sao",
      "price": 140000,
      "unit": "gói 300g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 540,
      "name": "Bột ca cao nguyên chất Xuân Ron Chợ Gạo",
      "province": "Tiền Giang",
      "stars": "5 sao",
      "price": 250000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 543,
      "name": "Nước mắm Gò Công",
      "province": "Tiền Giang",
      "stars": "4 sao",
      "price": 150000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Bến Tre": [
    {
      "id": 546,
      "name": "Kẹo dừa Bến Tre truyền thống",
      "province": "Bến Tre",
      "stars": "4 sao",
      "price": 70000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 547,
      "name": "Bánh phồng sữa dừa",
      "province": "Bến Tre",
      "stars": "4 sao",
      "price": 55000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 544,
      "name": "Mật hoa dừa cô đặc Bến Tre",
      "province": "Bến Tre",
      "stars": "5 sao",
      "price": 280000,
      "unit": "lọ 250ml",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 545,
      "name": "Dầu dừa tinh khiết xuất khẩu Bến Tre",
      "province": "Bến Tre",
      "stars": "5 sao",
      "price": 200000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Trà Vinh": [
    {
      "id": 548,
      "name": "Kẹo dừa sáp nguyên chất Cầu Kè",
      "province": "Trà Vinh",
      "stars": "5 sao",
      "price": 350000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 549,
      "name": "Kẹo dừa sáp cacao / lá dứa Cầu Kè",
      "province": "Trà Vinh",
      "stars": "5 sao",
      "price": 380000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 550,
      "name": "Cốm dẹp Trà Vinh",
      "province": "Trà Vinh",
      "stars": "4 sao",
      "price": 90000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 551,
      "name": "Bánh tét Trà Vinh hút chân không",
      "province": "Trà Vinh",
      "stars": "4 sao",
      "price": 120000,
      "unit": "đòn",
      "group": "Trà & Thảo Mộc"
    }
  ],
  "Vĩnh Long": [
    {
      "id": 554,
      "name": "Bánh tráng cù lao Mây",
      "province": "Vĩnh Long",
      "stars": "4 sao",
      "price": 50000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 555,
      "name": "Trà đinh lăng Vĩnh Long",
      "province": "Vĩnh Long",
      "stars": "4 sao",
      "price": 200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 552,
      "name": "Tàu hũ ky Bình Minh khô thượng hạng (Đóng gói xuất khẩu)",
      "province": "Vĩnh Long",
      "stars": "5 sao",
      "price": 280000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 553,
      "name": "Mứt bưởi da xanh cao cấp",
      "province": "Vĩnh Long",
      "stars": "5 sao",
      "price": 250000,
      "unit": "túi",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Đồng Tháp": [
    {
      "id": 556,
      "name": "Sen hồng sấy khô / Sữa hạt sen Đồng Tháp",
      "province": "Đồng Tháp",
      "stars": "5 sao",
      "price": 300000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 557,
      "name": "Xoài cát Cao Lãnh sấy dẻo công nghệ cao",
      "province": "Đồng Tháp",
      "stars": "5 sao",
      "price": 250000,
      "unit": "gói",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 558,
      "name": "Nem Lai Vung hút chân không chuẩn vị",
      "province": "Đồng Tháp",
      "stars": "4 sao",
      "price": 55000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 559,
      "name": "Cá lóc khô một nắng",
      "province": "Đồng Tháp",
      "stars": "4 sao",
      "price": 300000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Cần Thơ": [
    {
      "id": 569,
      "name": "Bánh tráng Thuận Hưng cao cấp",
      "province": "Cần Thơ",
      "stars": "5 sao",
      "price": 90000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 568,
      "name": "Cacao nguyên chất Phong Điền thượng hạng (Hộp thiếc)",
      "province": "Cần Thơ",
      "stars": "5 sao",
      "price": 350000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 570,
      "name": "Trà đinh lăng Cần Thơ",
      "province": "Cần Thơ",
      "stars": "4 sao",
      "price": 180000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 571,
      "name": "Khô nhái (\"vũ nữ chân dài\") đóng gói",
      "province": "Cần Thơ",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Hậu Giang": [
    {
      "id": 574,
      "name": "Khóm Cầu Đúc sấy dẻo",
      "province": "Hậu Giang",
      "stars": "4 sao",
      "price": 130000,
      "unit": "gói",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 573,
      "name": "Trà mãng cầu Hậu Giang nguyên chất",
      "province": "Hậu Giang",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 572,
      "name": "Khô cá thát lát Hậu Giang thượng hạng (Hút chân không cấp đông)",
      "province": "Hậu Giang",
      "stars": "5 sao",
      "price": 480000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 575,
      "name": "Mật ong hoa tràm U Minh",
      "province": "Hậu Giang",
      "stars": "4 sao",
      "price": 300000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Sóc Trăng": [
    {
      "id": 577,
      "name": "Bánh pía Sóc Trăng cao cấp thượng hạng (Hộp đặc biệt)",
      "province": "Sóc Trăng",
      "stars": "5 sao",
      "price": 180000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 579,
      "name": "Bánh phồng tôm Miệt Thứ",
      "province": "Sóc Trăng",
      "stars": "4 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 576,
      "name": "Gạo ST25 Sóc Trăng chính hãng Hồ Quang Trí (Hút chân không)",
      "province": "Sóc Trăng",
      "stars": "5 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 578,
      "name": "Lạp xưởng tôm Sóc Trăng hút chân không",
      "province": "Sóc Trăng",
      "stars": "4 sao",
      "price": 260000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Bạc Liêu": [
    {
      "id": 582,
      "name": "Bánh phồng tôm Bạc Liêu",
      "province": "Bạc Liêu",
      "stars": "4 sao",
      "price": 90000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 581,
      "name": "Gạo Nếp thơm Bạc Liêu tuyển chọn",
      "province": "Bạc Liêu",
      "stars": "5 sao",
      "price": 55000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 583,
      "name": "Khô cá lóc đồng Bạc Liêu",
      "province": "Bạc Liêu",
      "stars": "4 sao",
      "price": 260000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 580,
      "name": "Muối hạt / Muối tinh Bạc Liêu cao cấp (Hộp xuất khẩu)",
      "province": "Bạc Liêu",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Hà Nội": [
    {
      "id": 336,
      "name": "Trà Phúc / Trà Lộc / Trà Thọ (Cồ Bắc/Hà Nội)",
      "province": "Hà Nội",
      "stars": "5 sao",
      "price": 2000000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 338,
      "name": "Miến dong Minh Hồng (Hoài Đức)",
      "province": "Hà Nội",
      "stars": "4 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 337,
      "name": "Chăn bông tơ tằm tự dệt (Mỹ Đức)",
      "province": "Hà Nội",
      "stars": "5 sao",
      "price": 4000000,
      "unit": "chiếc",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 339,
      "name": "Bánh chưng Tranh Khúc hút chân không",
      "province": "Hà Nội",
      "stars": "4 sao",
      "price": 80000,
      "unit": "chiếc",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Hà Giang": [
    {
      "id": 340,
      "name": "Trà xanh cổ thụ Phìn Hồ hộp 100g",
      "province": "Hà Giang",
      "stars": "5 sao",
      "price": 600000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 341,
      "name": "Hồng trà Phìn Hồ hộp 100g",
      "province": "Hà Giang",
      "stars": "5 sao",
      "price": 700000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 342,
      "name": "Mật ong bạc hà Mèo Vạc",
      "province": "Hà Giang",
      "stars": "4 sao",
      "price": 650000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 343,
      "name": "Thịt trâu gác bếp hút chân không",
      "province": "Hà Giang",
      "stars": "4 sao",
      "price": 1100000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Lào Cai": [
    {
      "id": 344,
      "name": "Trà phun sương Actiso Sa Pa",
      "province": "Lào Cai",
      "stars": "5 sao",
      "price": 150000,
      "unit": "hộp túi lọc",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 345,
      "name": "Cao mềm Actiso Sa Pa",
      "province": "Lào Cai",
      "stars": "5 sao",
      "price": 500000,
      "unit": "hũ",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 346,
      "name": "Nấm hương rừng Sa Pa khô",
      "province": "Lào Cai",
      "stars": "4 sao",
      "price": 450000,
      "unit": "túi 500g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 347,
      "name": "Tương ớt Mường Khương",
      "province": "Lào Cai",
      "stars": "4 sao",
      "price": 50000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Yên Bái": [
    {
      "id": 348,
      "name": "Chè Shan tuyết Suối Giàng thượng hạng",
      "province": "Yên Bái",
      "stars": "5 sao",
      "price": 1800000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 350,
      "name": "Mật ong nhãn Văn Chấn",
      "province": "Yên Bái",
      "stars": "4 sao",
      "price": 350000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 351,
      "name": "Miến đao Giới Phiên",
      "province": "Yên Bái",
      "stars": "4 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 349,
      "name": "Quế ống khô bóc vỏ xuất khẩu",
      "province": "Yên Bái",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Điện Biên": [
    {
      "id": 353,
      "name": "Cà phê Mường Ảng hạt rang cao cấp",
      "province": "Điện Biên",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 354,
      "name": "Thịt trâu sấy gác bếp bản địa",
      "province": "Điện Biên",
      "stars": "4 sao",
      "price": 1000000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 352,
      "name": "Gạo nương Điện Biên thơm đặc sản (Hút chân không)",
      "province": "Điện Biên",
      "stars": "5 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 355,
      "name": "Hạt mắc khén khô",
      "province": "Điện Biên",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Hòa Bình": [
    {
      "id": 366,
      "name": "Giảo cổ lam sấy khô",
      "province": "Hòa Bình",
      "stars": "4 sao",
      "price": 150000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 364,
      "name": "Măng chua thái sẵn Kim Bôi",
      "province": "Hòa Bình",
      "stars": "5 sao",
      "price": 70000,
      "unit": "túi",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 365,
      "name": "Măng nứa khô nấu ngay",
      "province": "Hòa Bình",
      "stars": "5 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 367,
      "name": "Mật ong rừng Hòa Bình",
      "province": "Hòa Bình",
      "stars": "4 sao",
      "price": 450000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Phú Thọ": [
    {
      "id": 368,
      "name": "Chè Đinh cao cấp Hoài Trung",
      "province": "Phú Thọ",
      "stars": "5 sao",
      "price": 1200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 371,
      "name": "Chè búp tím Thanh Ba",
      "province": "Phú Thọ",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 369,
      "name": "Mỳ gạo sạch Hùng Lô",
      "province": "Phú Thọ",
      "stars": "5 sao",
      "price": 60000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 370,
      "name": "Thịt chua Thanh Sơn (Hộp đóng kín)",
      "province": "Phú Thọ",
      "stars": "4 sao",
      "price": 70000,
      "unit": "hộp",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Vĩnh Phúc": [
    {
      "id": 372,
      "name": "Trà hoa vàng Tam Đảo thượng hạng (Hộp quà tặng)",
      "province": "Vĩnh Phúc",
      "stars": "5 sao",
      "price": 4000000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 375,
      "name": "Trà đinh lăng sấy khô",
      "province": "Vĩnh Phúc",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 374,
      "name": "Mật ong Tam Đảo",
      "province": "Vĩnh Phúc",
      "stars": "4 sao",
      "price": 400000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 373,
      "name": "Cao gắm Tam Đảo hỗ trợ xương khớp",
      "province": "Vĩnh Phúc",
      "stars": "5 sao",
      "price": 600000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Bắc Kạn": [
    {
      "id": 383,
      "name": "Trà mướp đắng rừng",
      "province": "Bắc Kạn",
      "stars": "4 sao",
      "price": 200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 380,
      "name": "Miến dong Tài Hoan",
      "province": "Bắc Kạn",
      "stars": "5 sao",
      "price": 75000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 382,
      "name": "Tinh bột nghệ vàng Bắc Kạn",
      "province": "Bắc Kạn",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 381,
      "name": "Nano Curcumin Bắc Hà (Vicumax)",
      "province": "Bắc Kạn",
      "stars": "5 sao",
      "price": 800000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Bắc Giang": [
    {
      "id": 387,
      "name": "Rượu làng Vân",
      "province": "Bắc Giang",
      "stars": "4 sao",
      "price": 100000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 385,
      "name": "Mỳ Chũ cao cấp Chũ Xuân Trường",
      "province": "Bắc Giang",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 386,
      "name": "Mật ong hoa vải Lục Ngạn",
      "province": "Bắc Giang",
      "stars": "4 sao",
      "price": 300000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 384,
      "name": "Vải thiều Lục Ngạn Hồng Xuân (Tiêu chuẩn xuất khẩu)",
      "province": "Bắc Giang",
      "stars": "5 sao",
      "price": 150000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Quảng Ninh": [
    {
      "id": 391,
      "name": "Trà hoa vàng Ba Chẽ khô",
      "province": "Quảng Ninh",
      "stars": "4 sao",
      "price": 2500000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 388,
      "name": "Miến dong Bình Liêu",
      "province": "Quảng Ninh",
      "stars": "5 sao",
      "price": 100000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 390,
      "name": "Chả mực Hạ Long hút chân không cấp đông",
      "province": "Quảng Ninh",
      "stars": "4 sao",
      "price": 550000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 389,
      "name": "Bộ lọ hoa men chảy Gốm sứ Quang Vinh",
      "province": "Quảng Ninh",
      "stars": "5 sao",
      "price": 3000000,
      "unit": "bộ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Tuyên Quang": [
    {
      "id": 432,
      "name": "Chè Shan tuyết Na Hang hảo hạng",
      "province": "Tuyên Quang",
      "stars": "5 sao",
      "price": 900000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 433,
      "name": "Mật ong phong mật Na Hang nguyên chất",
      "province": "Tuyên Quang",
      "stars": "5 sao",
      "price": 600000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 434,
      "name": "Miến dong Minh Hương",
      "province": "Tuyên Quang",
      "stars": "4 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 435,
      "name": "Thịt trâu khô gác bếp Chiêm Hóa",
      "province": "Tuyên Quang",
      "stars": "4 sao",
      "price": 1000000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Thừa Thiên Huế": [
    {
      "id": 456,
      "name": "Trà cung đình Huế thượng hạng (Hộp quà biếu)",
      "province": "Thừa Thiên Huế",
      "stars": "5 sao",
      "price": 400000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 457,
      "name": "Sen gật gù / Hạt sen khô Huế tuyển chọn",
      "province": "Thừa Thiên Huế",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 458,
      "name": "Tôm chua Huế đóng hũ kín",
      "province": "Thừa Thiên Huế",
      "stars": "4 sao",
      "price": 90000,
      "unit": "hũ 500g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 459,
      "name": "Dầu tràm Huế nguyên chất",
      "province": "Thừa Thiên Huế",
      "stars": "4 sao",
      "price": 200000,
      "unit": "lọ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Quảng Ngãi": [
    {
      "id": 471,
      "name": "Cá bống sông Trà rim khô",
      "province": "Quảng Ngãi",
      "stars": "4 sao",
      "price": 150000,
      "unit": "hộp 250g",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 468,
      "name": "Tỏi Lý Sơn chính hãng (Hộp đóng gói xuất khẩu)",
      "province": "Quảng Ngãi",
      "stars": "5 sao",
      "price": 350000,
      "unit": "túi 250g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 469,
      "name": "Mạch nha Quảng Ngãi đường Mantoza",
      "province": "Quảng Ngãi",
      "stars": "5 sao",
      "price": 100000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 470,
      "name": "Đường phèn, đường phổi Quảng Ngãi",
      "province": "Quảng Ngãi",
      "stars": "4 sao",
      "price": 55000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Kon Tum": [
    {
      "id": 493,
      "name": "Cà phê hạt rang nguyên chất Măng Đen",
      "province": "Kon Tum",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 494,
      "name": "Măng khô rừng Măng Đen",
      "province": "Kon Tum",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 495,
      "name": "Hạt dổi rừng khô",
      "province": "Kon Tum",
      "stars": "4 sao",
      "price": 2500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 492,
      "name": "Sâm Ngọc Linh Kon Tum ngâm mật ong rừng",
      "province": "Kon Tum",
      "stars": "5 sao",
      "price": 7000000,
      "unit": "hũ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Gia Lai": [
    {
      "id": 496,
      "name": "Cà phê Fine Robusta Nam Yang",
      "province": "Gia Lai",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 498,
      "name": "Mật ong hoa cà phê nguyên chất",
      "province": "Gia Lai",
      "stars": "4 sao",
      "price": 280000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 499,
      "name": "Bò một nắng Chư Sê",
      "province": "Gia Lai",
      "stars": "4 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 497,
      "name": "Hạt điều rang muối đặc sản Gia Lai",
      "province": "Gia Lai",
      "stars": "5 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Đồng Nai": [
    {
      "id": 525,
      "name": "Bột cacao nguyên chất Trọng Đức",
      "province": "Đồng Nai",
      "stars": "5 sao",
      "price": 250000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 526,
      "name": "Trà sen Nhơn Trạch",
      "province": "Đồng Nai",
      "stars": "4 sao",
      "price": 500000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 527,
      "name": "Mật ong hoa tràm / hoa cao su Đồng Nai",
      "province": "Đồng Nai",
      "stars": "4 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 524,
      "name": "Hạt điều vị rang muối nguyên bản Nga Biên",
      "province": "Đồng Nai",
      "stars": "5 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Bà Rịa - Vũng Tàu": [
    {
      "id": 528,
      "name": "Hạt ca cao nguyên chất Châu Đức thượng hạng",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "5 sao",
      "price": 280000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 530,
      "name": "Hải sản khô một nắng Côn Đảo (Mực/Cá thu hút chân không)",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "4 sao",
      "price": 900000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 529,
      "name": "Nước mắm Trí Hải cốt đặc biệt",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "5 sao",
      "price": 180000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 531,
      "name": "Bánh bông lan trứng muối đóng hộp cứng",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "4 sao",
      "price": 70000,
      "unit": "hộp",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Kiên Giang": [
    {
      "id": 565,
      "name": "Rượu sim Phú Quốc thượng hạng",
      "province": "Kiên Giang",
      "stars": "5 sao",
      "price": 280000,
      "unit": "chai",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 566,
      "name": "Khô cá thiều Phú Quốc hút chân không",
      "province": "Kiên Giang",
      "stars": "4 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 564,
      "name": "Nước mắm Phú Quốc Huỳnh Khoa 43°/45° đạm",
      "province": "Kiên Giang",
      "stars": "5 sao",
      "price": 500000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 567,
      "name": "Tiêu hạt Phú Quốc khô",
      "province": "Kiên Giang",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Lạng Sơn": [
    {
      "id": 422,
      "name": "Thịt quay giòn bì Lạng Sơn hút chân không",
      "province": "Lạng Sơn",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 420,
      "name": "Hoa hồi khô nguyên bông Lạng Sơn xuất khẩu",
      "province": "Lạng Sơn",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 423,
      "name": "Mạch nha Lạng Sơn",
      "province": "Lạng Sơn",
      "stars": "4 sao",
      "price": 70000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 421,
      "name": "Tinh dầu hồi Lạng Sơn nguyên chất",
      "province": "Lạng Sơn",
      "stars": "5 sao",
      "price": 350000,
      "unit": "lọ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Quảng Bình": [
    {
      "id": 448,
      "name": "Đũa gỗ Quảng Thủy xuất khẩu",
      "province": "Quảng Bình",
      "stars": "5 sao",
      "price": 150000,
      "unit": "bịch",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 449,
      "name": "Mật ong rừng Lệ Thủy thượng hạng",
      "province": "Quảng Bình",
      "stars": "5 sao",
      "price": 600000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 450,
      "name": "Khoai dẻo Quảng Bình",
      "province": "Quảng Bình",
      "stars": "4 sao",
      "price": 100000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 451,
      "name": "Nước mắm Bảo Ninh",
      "province": "Quảng Bình",
      "stars": "4 sao",
      "price": 150000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Quảng Trị": [
    {
      "id": 452,
      "name": "Gạo hữu cơ Quảng Trị cao cấp (Hút chân không)",
      "province": "Quảng Trị",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 453,
      "name": "Tiêu đen hữu cơ Cam Lộ thượng hạng",
      "province": "Quảng Trị",
      "stars": "5 sao",
      "price": 300000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 454,
      "name": "Tinh dầu nén Quảng Trị",
      "province": "Quảng Trị",
      "stars": "4 sao",
      "price": 150000,
      "unit": "lọ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 455,
      "name": "Cao gắm thảo dược",
      "province": "Quảng Trị",
      "stars": "4 sao",
      "price": 400000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "Bình Dương": [
    {
      "id": 523,
      "name": "Mủ trôm nguyên chất",
      "province": "Bình Dương",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 520,
      "name": "Hạt điều rang muối Bình Dương thượng hạng",
      "province": "Bình Dương",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 522,
      "name": "Tinh bột nghệ Bình Dương",
      "province": "Bình Dương",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 521,
      "name": "Gốm sứ thủ công mỹ nghệ cao cấp Bình Dương",
      "province": "Bình Dương",
      "stars": "5 sao",
      "price": 2500000,
      "unit": "bộ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "An Giang": [
    {
      "id": 560,
      "name": "Đường thốt nốt nguyên chất An Giang (Dạng viên/hũ cao cấp)",
      "province": "An Giang",
      "stars": "5 sao",
      "price": 130000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 561,
      "name": "Gạo Nếp vú sữa Tân Châu thượng hạng (Hút chân không)",
      "province": "An Giang",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 563,
      "name": "Khô bò dứa An Phú",
      "province": "An Giang",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 562,
      "name": "Mắm cá linh / Mắm thái Châu Đốc (Hũ nhựa kín)",
      "province": "An Giang",
      "stars": "4 sao",
      "price": 100000,
      "unit": "hũ 500g",
      "group": "Gia Vị & Nông Sản Khô"
    }
  ],
  "Cà Mau": [
    {
      "id": 584,
      "name": "Tôm khô Cà Mau loại thượng hạng đặc biệt (Hút chân không)",
      "province": "Cà Mau",
      "stars": "5 sao",
      "price": 2200000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 585,
      "name": "Mật ong rừng U Minh Hạ nguyên chất 100%",
      "province": "Cà Mau",
      "stars": "5 sao",
      "price": 800000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 586,
      "name": "Khô cá bổi U Minh",
      "province": "Cà Mau",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 587,
      "name": "Cua biển Cà Mau đóng thùng xốp vận chuyển xa",
      "province": "Cà Mau",
      "stars": "4 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    }
  ],
  "Nghệ An": [
    {
      "id": 441,
      "name": "Nước mắm Vạn Phần thượng hạng",
      "province": "Nghệ An",
      "stars": "5 sao",
      "price": 200000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 442,
      "name": "Tương Nam Đàn đóng chai",
      "province": "Nghệ An",
      "stars": "4 sao",
      "price": 60000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 443,
      "name": "Tinh bột nghệ Nghệ An",
      "province": "Nghệ An",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 440,
      "name": "Bộ đèn tre Đức Phong (Thủ công mỹ nghệ)",
      "province": "Nghệ An",
      "stars": "5 sao",
      "price": 1500000,
      "unit": "chiếc",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ]
};

/**
 * Index tra cứu theo số sao OCOP
 */
const BY_STAR = {
  "5 sao": [
    {
      "id": 357,
      "name": "Hạt mắc ca Lai Châu tách hạt sấy khô",
      "province": "Lai Châu",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 397,
      "name": "Bánh đậu xanh Rồng Vàng Hoàng Gia",
      "province": "Hải Dương",
      "stars": "5 sao",
      "price": 150000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 400,
      "name": "Long nhãn lồng Hưng Yên thượng hạng (Hộp biếu cao cấp)",
      "province": "Hưng Yên",
      "stars": "5 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 401,
      "name": "Hạt sen sấy khô nguyên vị Hưng Yên",
      "province": "Hưng Yên",
      "stars": "5 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 412,
      "name": "Cơm cháy Ninh Bình cao cấp (Đóng gói xuất khẩu)",
      "province": "Ninh Bình",
      "stars": "5 sao",
      "price": 150000,
      "unit": "túi 500g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 424,
      "name": "Hạt dẻ Trùng Khánh loại 1 tuyển chọn",
      "province": "Cao Bằng",
      "stars": "5 sao",
      "price": 280000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 444,
      "name": "Kẹo cu đơ Thư Sơn thượng hạng (Hộp ép kín)",
      "province": "Hà Tĩnh",
      "stars": "5 sao",
      "price": 90000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 472,
      "name": "Bánh tráng gạo mè Dalop đặc biệt M4",
      "province": "Bình Định",
      "stars": "5 sao",
      "price": 70000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 481,
      "name": "Rong biển sấy khô Nha Trang giòn nguyên vị",
      "province": "Khánh Hòa",
      "stars": "5 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 485,
      "name": "Nho khô nguyên cành Ninh Thuận nhập/sấy xuất khẩu",
      "province": "Ninh Thuận",
      "stars": "5 sao",
      "price": 300000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 489,
      "name": "Thanh long sấy dẻo công nghệ cao (Hộp xuất khẩu)",
      "province": "Bình Thuận",
      "stars": "5 sao",
      "price": 180000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 504,
      "name": "Hạt điều rang củi Đắk Nông xuất khẩu",
      "province": "Đắk Nông",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 509,
      "name": "Hồng treo gió Đà Lạt công nghệ cao (Hút chân không)",
      "province": "Lâm Đồng",
      "stars": "5 sao",
      "price": 550000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 516,
      "name": "Bánh tráng phơi sương Trảng Bàng cao cấp (Đóng kín)",
      "province": "Tây Ninh",
      "stars": "5 sao",
      "price": 80000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 533,
      "name": "Thực phẩm sấy khô hữu cơ cao cấp TP.HCM",
      "province": "TP. Hồ Chí Minh",
      "stars": "5 sao",
      "price": 400000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 541,
      "name": "Kẹo dừa sầu riêng Tiền Giang đặc biệt",
      "province": "Tiền Giang",
      "stars": "5 sao",
      "price": 110000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 548,
      "name": "Kẹo dừa sáp nguyên chất Cầu Kè",
      "province": "Trà Vinh",
      "stars": "5 sao",
      "price": 350000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 556,
      "name": "Sen hồng sấy khô / Sữa hạt sen Đồng Tháp",
      "province": "Đồng Tháp",
      "stars": "5 sao",
      "price": 300000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 557,
      "name": "Xoài cát Cao Lãnh sấy dẻo công nghệ cao",
      "province": "Đồng Tháp",
      "stars": "5 sao",
      "price": 250000,
      "unit": "gói",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 569,
      "name": "Bánh tráng Thuận Hưng cao cấp",
      "province": "Cần Thơ",
      "stars": "5 sao",
      "price": 90000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 577,
      "name": "Bánh pía Sóc Trăng cao cấp thượng hạng (Hộp đặc biệt)",
      "province": "Sóc Trăng",
      "stars": "5 sao",
      "price": 180000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 336,
      "name": "Trà Phúc / Trà Lộc / Trà Thọ (Cồ Bắc/Hà Nội)",
      "province": "Hà Nội",
      "stars": "5 sao",
      "price": 2000000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 340,
      "name": "Trà xanh cổ thụ Phìn Hồ hộp 100g",
      "province": "Hà Giang",
      "stars": "5 sao",
      "price": 600000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 341,
      "name": "Hồng trà Phìn Hồ hộp 100g",
      "province": "Hà Giang",
      "stars": "5 sao",
      "price": 700000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 344,
      "name": "Trà phun sương Actiso Sa Pa",
      "province": "Lào Cai",
      "stars": "5 sao",
      "price": 150000,
      "unit": "hộp túi lọc",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 345,
      "name": "Cao mềm Actiso Sa Pa",
      "province": "Lào Cai",
      "stars": "5 sao",
      "price": 500000,
      "unit": "hũ",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 348,
      "name": "Chè Shan tuyết Suối Giàng thượng hạng",
      "province": "Yên Bái",
      "stars": "5 sao",
      "price": 1800000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 353,
      "name": "Cà phê Mường Ảng hạt rang cao cấp",
      "province": "Điện Biên",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 360,
      "name": "Cà phê bột nguyên chất Bích Thao",
      "province": "Sơn La",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 361,
      "name": "Trà Ô Long Mộc Châu cao cấp",
      "province": "Sơn La",
      "stars": "5 sao",
      "price": 1200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 368,
      "name": "Chè Đinh cao cấp Hoài Trung",
      "province": "Phú Thọ",
      "stars": "5 sao",
      "price": 1200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 372,
      "name": "Trà hoa vàng Tam Đảo thượng hạng (Hộp quà tặng)",
      "province": "Vĩnh Phúc",
      "stars": "5 sao",
      "price": 4000000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 376,
      "name": "Chè tôm nõn Hảo Đạt",
      "province": "Thái Nguyên",
      "stars": "5 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 405,
      "name": "Rượu nếp cái hoa vàng Kiến Xương thượng hạng",
      "province": "Thái Bình",
      "stars": "5 sao",
      "price": 200000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 413,
      "name": "Rượu nếp Kim Sơn hảo hạng (Bình sứ)",
      "province": "Ninh Bình",
      "stars": "5 sao",
      "price": 350000,
      "unit": "bình",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 425,
      "name": "Miến dong Trà Lĩnh thượng hạng",
      "province": "Cao Bằng",
      "stars": "5 sao",
      "price": 90000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 432,
      "name": "Chè Shan tuyết Na Hang hảo hạng",
      "province": "Tuyên Quang",
      "stars": "5 sao",
      "price": 900000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 456,
      "name": "Trà cung đình Huế thượng hạng (Hộp quà biếu)",
      "province": "Thừa Thiên Huế",
      "stars": "5 sao",
      "price": 400000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 473,
      "name": "Rượu bầu đá truyền thống (Bình cao cấp)",
      "province": "Bình Định",
      "stars": "5 sao",
      "price": 200000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 480,
      "name": "Yến sào Khánh Hòa tinh chế cao cấp (Hộp quà biếu)",
      "province": "Khánh Hòa",
      "stars": "5 sao",
      "price": 5000000,
      "unit": "100g",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 493,
      "name": "Cà phê hạt rang nguyên chất Măng Đen",
      "province": "Kon Tum",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 496,
      "name": "Cà phê Fine Robusta Nam Yang",
      "province": "Gia Lai",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 500,
      "name": "Cà phê hạt rang Buôn Ma Thuột thượng hạng",
      "province": "Đắk Lắk",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 501,
      "name": "Bột cacao nguyên chất Buôn Ma Thuột",
      "province": "Đắk Lắk",
      "stars": "5 sao",
      "price": 250000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 505,
      "name": "Cà phê hạt rang xay Đắk Nông nguyên chất",
      "province": "Đắk Nông",
      "stars": "5 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 508,
      "name": "Cà phê Arabica Cầu Đất thượng hạng (Hộp thiếc)",
      "province": "Lâm Đồng",
      "stars": "5 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 513,
      "name": "Cà phê Phước Long hạt rang thượng hạng",
      "province": "Bình Phước",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 525,
      "name": "Bột cacao nguyên chất Trọng Đức",
      "province": "Đồng Nai",
      "stars": "5 sao",
      "price": 250000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 528,
      "name": "Hạt ca cao nguyên chất Châu Đức thượng hạng",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "5 sao",
      "price": 280000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 532,
      "name": "Cà phê hòa tan / rang xay cao cấp xuất khẩu TP.HCM",
      "province": "TP. Hồ Chí Minh",
      "stars": "5 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 540,
      "name": "Bột ca cao nguyên chất Xuân Ron Chợ Gạo",
      "province": "Tiền Giang",
      "stars": "5 sao",
      "price": 250000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 549,
      "name": "Kẹo dừa sáp cacao / lá dứa Cầu Kè",
      "province": "Trà Vinh",
      "stars": "5 sao",
      "price": 380000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 565,
      "name": "Rượu sim Phú Quốc thượng hạng",
      "province": "Kiên Giang",
      "stars": "5 sao",
      "price": 280000,
      "unit": "chai",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 568,
      "name": "Cacao nguyên chất Phong Điền thượng hạng (Hộp thiếc)",
      "province": "Cần Thơ",
      "stars": "5 sao",
      "price": 350000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 573,
      "name": "Trà mãng cầu Hậu Giang nguyên chất",
      "province": "Hậu Giang",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 364,
      "name": "Măng chua thái sẵn Kim Bôi",
      "province": "Hòa Bình",
      "stars": "5 sao",
      "price": 70000,
      "unit": "túi",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 365,
      "name": "Măng nứa khô nấu ngay",
      "province": "Hòa Bình",
      "stars": "5 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 369,
      "name": "Mỳ gạo sạch Hùng Lô",
      "province": "Phú Thọ",
      "stars": "5 sao",
      "price": 60000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 377,
      "name": "Miến Việt Cường",
      "province": "Thái Nguyên",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 380,
      "name": "Miến dong Tài Hoan",
      "province": "Bắc Kạn",
      "stars": "5 sao",
      "price": 75000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 385,
      "name": "Mỳ Chũ cao cấp Chũ Xuân Trường",
      "province": "Bắc Giang",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 388,
      "name": "Miến dong Bình Liêu",
      "province": "Quảng Ninh",
      "stars": "5 sao",
      "price": 100000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 393,
      "name": "Hải sản khô thượng hạng Cát Bà (Tôm/Mực khô đóng hộp)",
      "province": "Hải Phòng",
      "stars": "5 sao",
      "price": 1800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 404,
      "name": "Gạo hữu cơ chất lượng cao Thái Bình (Hút chân không)",
      "province": "Thái Bình",
      "stars": "5 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 408,
      "name": "Gạo sinh thái ruộng rươi Toản Xuân",
      "province": "Nam Định",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 409,
      "name": "Gạo sạch chất lượng cao Toản Xuân 999",
      "province": "Nam Định",
      "stars": "5 sao",
      "price": 55000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 416,
      "name": "Chuối ngự Đại Hoàng đặc sản tuyển chọn (Đóng thùng an toàn)",
      "province": "Hà Nam",
      "stars": "5 sao",
      "price": 100000,
      "unit": "nải",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 433,
      "name": "Mật ong phong mật Na Hang nguyên chất",
      "province": "Tuyên Quang",
      "stars": "5 sao",
      "price": 600000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 445,
      "name": "Mật ong rừng Vũ Quang nguyên chất",
      "province": "Hà Tĩnh",
      "stars": "5 sao",
      "price": 650000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 448,
      "name": "Đũa gỗ Quảng Thủy xuất khẩu",
      "province": "Quảng Bình",
      "stars": "5 sao",
      "price": 150000,
      "unit": "bịch",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 449,
      "name": "Mật ong rừng Lệ Thủy thượng hạng",
      "province": "Quảng Bình",
      "stars": "5 sao",
      "price": 600000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 452,
      "name": "Gạo hữu cơ Quảng Trị cao cấp (Hút chân không)",
      "province": "Quảng Trị",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 457,
      "name": "Sen gật gù / Hạt sen khô Huế tuyển chọn",
      "province": "Thừa Thiên Huế",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 468,
      "name": "Tỏi Lý Sơn chính hãng (Hộp đóng gói xuất khẩu)",
      "province": "Quảng Ngãi",
      "stars": "5 sao",
      "price": 350000,
      "unit": "túi 250g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 476,
      "name": "Bò một nắng hai sương Sơn Hòa thượng hạng (Hút chân không)",
      "province": "Phú Yên",
      "stars": "5 sao",
      "price": 900000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 477,
      "name": "Hạt đười ươi bay khô nguyên chất",
      "province": "Phú Yên",
      "stars": "5 sao",
      "price": 650000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 484,
      "name": "Tỏi cô đơn Ninh Thuận thượng hạng",
      "province": "Ninh Thuận",
      "stars": "5 sao",
      "price": 1200000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 536,
      "name": "Gạo Nếp nàng hoa Long An thượng hạng (Hút chân không)",
      "province": "Long An",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 544,
      "name": "Mật hoa dừa cô đặc Bến Tre",
      "province": "Bến Tre",
      "stars": "5 sao",
      "price": 280000,
      "unit": "lọ 250ml",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 552,
      "name": "Tàu hũ ky Bình Minh khô thượng hạng (Đóng gói xuất khẩu)",
      "province": "Vĩnh Long",
      "stars": "5 sao",
      "price": 280000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 553,
      "name": "Mứt bưởi da xanh cao cấp",
      "province": "Vĩnh Long",
      "stars": "5 sao",
      "price": 250000,
      "unit": "túi",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 560,
      "name": "Đường thốt nốt nguyên chất An Giang (Dạng viên/hũ cao cấp)",
      "province": "An Giang",
      "stars": "5 sao",
      "price": 130000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 561,
      "name": "Gạo Nếp vú sữa Tân Châu thượng hạng (Hút chân không)",
      "province": "An Giang",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 572,
      "name": "Khô cá thát lát Hậu Giang thượng hạng (Hút chân không cấp đông)",
      "province": "Hậu Giang",
      "stars": "5 sao",
      "price": 480000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 576,
      "name": "Gạo ST25 Sóc Trăng chính hãng Hồ Quang Trí (Hút chân không)",
      "province": "Sóc Trăng",
      "stars": "5 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 581,
      "name": "Gạo Nếp thơm Bạc Liêu tuyển chọn",
      "province": "Bạc Liêu",
      "stars": "5 sao",
      "price": 55000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 584,
      "name": "Tôm khô Cà Mau loại thượng hạng đặc biệt (Hút chân không)",
      "province": "Cà Mau",
      "stars": "5 sao",
      "price": 2200000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 585,
      "name": "Mật ong rừng U Minh Hạ nguyên chất 100%",
      "province": "Cà Mau",
      "stars": "5 sao",
      "price": 800000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 349,
      "name": "Quế ống khô bóc vỏ xuất khẩu",
      "province": "Yên Bái",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 352,
      "name": "Gạo nương Điện Biên thơm đặc sản (Hút chân không)",
      "province": "Điện Biên",
      "stars": "5 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 384,
      "name": "Vải thiều Lục Ngạn Hồng Xuân (Tiêu chuẩn xuất khẩu)",
      "province": "Bắc Giang",
      "stars": "5 sao",
      "price": 150000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 392,
      "name": "Nước mắm Cát Hải đặc biệt (Thùng quà tặng)",
      "province": "Hải Phòng",
      "stars": "5 sao",
      "price": 400000,
      "unit": "thùng",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 417,
      "name": "Bột sắn dây nguyên chất cao cấp Hà Nam",
      "province": "Hà Nam",
      "stars": "5 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 420,
      "name": "Hoa hồi khô nguyên bông Lạng Sơn xuất khẩu",
      "province": "Lạng Sơn",
      "stars": "5 sao",
      "price": 400000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 436,
      "name": "Nước mắm Lê Gia cốt đặc biệt",
      "province": "Thanh Hóa",
      "stars": "5 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 437,
      "name": "Mắm tôm Lê Gia cao cấp",
      "province": "Thanh Hóa",
      "stars": "5 sao",
      "price": 90000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 441,
      "name": "Nước mắm Vạn Phần thượng hạng",
      "province": "Nghệ An",
      "stars": "5 sao",
      "price": 200000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 453,
      "name": "Tiêu đen hữu cơ Cam Lộ thượng hạng",
      "province": "Quảng Trị",
      "stars": "5 sao",
      "price": 300000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 460,
      "name": "Nước mắm Nam Ô nhĩ đặc biệt",
      "province": "Đà Nẵng",
      "stars": "5 sao",
      "price": 300000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 464,
      "name": "Quế Trà My bóc vỏ thượng hạng (Hộp quà)",
      "province": "Quảng Nam",
      "stars": "5 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 469,
      "name": "Mạch nha Quảng Ngãi đường Mantoza",
      "province": "Quảng Ngãi",
      "stars": "5 sao",
      "price": 100000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 488,
      "name": "Nước mắm Phan Thiết nhĩ đặc biệt (Chai đóng seal)",
      "province": "Bình Thuận",
      "stars": "5 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 497,
      "name": "Hạt điều rang muối đặc sản Gia Lai",
      "province": "Gia Lai",
      "stars": "5 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 512,
      "name": "Hạt điều rang muối Bình Phước xuất khẩu (Hộp cao cấp)",
      "province": "Bình Phước",
      "stars": "5 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 517,
      "name": "Muối tôm Tây Ninh thượng hạng (Hũ niêm phong)",
      "province": "Tây Ninh",
      "stars": "5 sao",
      "price": 90000,
      "unit": "hũ 500g",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 520,
      "name": "Hạt điều rang muối Bình Dương thượng hạng",
      "province": "Bình Dương",
      "stars": "5 sao",
      "price": 380000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 524,
      "name": "Hạt điều vị rang muối nguyên bản Nga Biên",
      "province": "Đồng Nai",
      "stars": "5 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 529,
      "name": "Nước mắm Trí Hải cốt đặc biệt",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "5 sao",
      "price": 180000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 545,
      "name": "Dầu dừa tinh khiết xuất khẩu Bến Tre",
      "province": "Bến Tre",
      "stars": "5 sao",
      "price": 200000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 564,
      "name": "Nước mắm Phú Quốc Huỳnh Khoa 43°/45° đạm",
      "province": "Kiên Giang",
      "stars": "5 sao",
      "price": 500000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 580,
      "name": "Muối hạt / Muối tinh Bạc Liêu cao cấp (Hộp xuất khẩu)",
      "province": "Bạc Liêu",
      "stars": "5 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 337,
      "name": "Chăn bông tơ tằm tự dệt (Mỹ Đức)",
      "province": "Hà Nội",
      "stars": "5 sao",
      "price": 4000000,
      "unit": "chiếc",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 356,
      "name": "Sâm Lai Châu củ tươi / thái lát sấy khô thượng hạng",
      "province": "Lai Châu",
      "stars": "5 sao",
      "price": 6000000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 373,
      "name": "Cao gắm Tam Đảo hỗ trợ xương khớp",
      "province": "Vĩnh Phúc",
      "stars": "5 sao",
      "price": 600000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 381,
      "name": "Nano Curcumin Bắc Hà (Vicumax)",
      "province": "Bắc Kạn",
      "stars": "5 sao",
      "price": 800000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 389,
      "name": "Bộ lọ hoa men chảy Gốm sứ Quang Vinh",
      "province": "Quảng Ninh",
      "stars": "5 sao",
      "price": 3000000,
      "unit": "bộ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 396,
      "name": "Bình hút lộc / Bình giọt ngọc Gốm Chu Đậu",
      "province": "Hải Dương",
      "stars": "5 sao",
      "price": 3500000,
      "unit": "bình",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 421,
      "name": "Tinh dầu hồi Lạng Sơn nguyên chất",
      "province": "Lạng Sơn",
      "stars": "5 sao",
      "price": 350000,
      "unit": "lọ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 428,
      "name": "Rượu làng Hòa Tiến thượng hạng (Bình gốm)",
      "province": "Bắc Ninh",
      "stars": "5 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 429,
      "name": "Tranh dân tộc Hồ cao cấp (Thủ công mỹ nghệ 5 sao)",
      "province": "Bắc Ninh",
      "stars": "5 sao",
      "price": 1000000,
      "unit": "tranh",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 440,
      "name": "Bộ đèn tre Đức Phong (Thủ công mỹ nghệ)",
      "province": "Nghệ An",
      "stars": "5 sao",
      "price": 1500000,
      "unit": "chiếc",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 461,
      "name": "Đồ thủ công mỹ nghệ đá non Ngũ Hành Sơn cao cấp",
      "province": "Đà Nẵng",
      "stars": "5 sao",
      "price": 2000000,
      "unit": "món",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 465,
      "name": "Trà sâm dược liệu Quế Trà My",
      "province": "Quảng Nam",
      "stars": "5 sao",
      "price": 600000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 492,
      "name": "Sâm Ngọc Linh Kon Tum ngâm mật ong rừng",
      "province": "Kon Tum",
      "stars": "5 sao",
      "price": 7000000,
      "unit": "hũ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 521,
      "name": "Gốm sứ thủ công mỹ nghệ cao cấp Bình Dương",
      "province": "Bình Dương",
      "stars": "5 sao",
      "price": 2500000,
      "unit": "bộ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 537,
      "name": "Rượu đế Gò Đen hảo hạng (Bình gốm)",
      "province": "Long An",
      "stars": "5 sao",
      "price": 180000,
      "unit": "lít",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ],
  "4 sao": [
    {
      "id": 362,
      "name": "Xoài sấy dẻo Yên Châu",
      "province": "Sơn La",
      "stars": "4 sao",
      "price": 120000,
      "unit": "gói 300g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 379,
      "name": "Bánh chưng bờ Đậu hút chân không",
      "province": "Thái Nguyên",
      "stars": "4 sao",
      "price": 100000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 394,
      "name": "Bánh đa cua khô Hải Phòng",
      "province": "Hải Phòng",
      "stars": "4 sao",
      "price": 60000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 398,
      "name": "Bánh gai Ninh Giang",
      "province": "Hải Dương",
      "stars": "4 sao",
      "price": 12000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 406,
      "name": "Bánh cáy làng Nguyễn",
      "province": "Thái Bình",
      "stars": "4 sao",
      "price": 80000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 410,
      "name": "Bánh nhãn Hải Hậu",
      "province": "Nam Định",
      "stars": "4 sao",
      "price": 60000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 411,
      "name": "Kẹo sìu châu Nam Định",
      "province": "Nam Định",
      "stars": "4 sao",
      "price": 80000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 415,
      "name": "Hoa cúc chi sấy khô Ninh Bình",
      "province": "Ninh Bình",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 418,
      "name": "Kẹo lạc Duy Tiên",
      "province": "Hà Nam",
      "stars": "4 sao",
      "price": 60000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 419,
      "name": "Bánh đa nem Chợ Sí",
      "province": "Hà Nam",
      "stars": "4 sao",
      "price": 45000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 426,
      "name": "Bánh khảo Cao Bằng",
      "province": "Cao Bằng",
      "stars": "4 sao",
      "price": 65000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 430,
      "name": "Bánh phu thê Đình Bảng",
      "province": "Bắc Ninh",
      "stars": "4 sao",
      "price": 8000,
      "unit": "cái",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 439,
      "name": "Bánh gai Tứ Trụ",
      "province": "Thanh Hóa",
      "stars": "4 sao",
      "price": 10000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 446,
      "name": "Bánh đa dừa Độc Lập",
      "province": "Hà Tĩnh",
      "stars": "4 sao",
      "price": 25000,
      "unit": "chiếc",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 463,
      "name": "Bánh khô mè Cẩm Lệ",
      "province": "Đà Nẵng",
      "stars": "4 sao",
      "price": 60000,
      "unit": "hộp",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 466,
      "name": "Bánh tráng Đại Lộc",
      "province": "Quảng Nam",
      "stars": "4 sao",
      "price": 50000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 474,
      "name": "Bánh tráng dừa Tam Quan",
      "province": "Bình Định",
      "stars": "4 sao",
      "price": 25000,
      "unit": "cái",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 478,
      "name": "Bánh tráng Hòa Đa",
      "province": "Phú Yên",
      "stars": "4 sao",
      "price": 45000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 482,
      "name": "Bánh xoài Cam Ranh",
      "province": "Khánh Hòa",
      "stars": "4 sao",
      "price": 60000,
      "unit": "túi 500g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 491,
      "name": "Bánh rế Phan Thiết",
      "province": "Bình Thuận",
      "stars": "4 sao",
      "price": 50000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 502,
      "name": "Bơ sấy dẻo",
      "province": "Đắk Lắk",
      "stars": "4 sao",
      "price": 150000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 503,
      "name": "Hạt mắc ca Krông Năng",
      "province": "Đắk Lắk",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 515,
      "name": "Trái cây sấy thập cẩm",
      "province": "Bình Phước",
      "stars": "4 sao",
      "price": 110000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 518,
      "name": "Bánh tráng me Tây Ninh",
      "province": "Tây Ninh",
      "stars": "4 sao",
      "price": 40000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 519,
      "name": "Mít sấy dẻo Tây Ninh",
      "province": "Tây Ninh",
      "stars": "4 sao",
      "price": 120000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 538,
      "name": "Thanh long sấy dẻo Châu Thành",
      "province": "Long An",
      "stars": "4 sao",
      "price": 120000,
      "unit": "gói 300g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 539,
      "name": "Bánh tráng Long Trì",
      "province": "Long An",
      "stars": "4 sao",
      "price": 45000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 542,
      "name": "Mít sấy dẻo Cai Lậy",
      "province": "Tiền Giang",
      "stars": "4 sao",
      "price": 140000,
      "unit": "gói 300g",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 546,
      "name": "Kẹo dừa Bến Tre truyền thống",
      "province": "Bến Tre",
      "stars": "4 sao",
      "price": 70000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 547,
      "name": "Bánh phồng sữa dừa",
      "province": "Bến Tre",
      "stars": "4 sao",
      "price": 55000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 554,
      "name": "Bánh tráng cù lao Mây",
      "province": "Vĩnh Long",
      "stars": "4 sao",
      "price": 50000,
      "unit": "túi",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 574,
      "name": "Khóm Cầu Đúc sấy dẻo",
      "province": "Hậu Giang",
      "stars": "4 sao",
      "price": 130000,
      "unit": "gói",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 579,
      "name": "Bánh phồng tôm Miệt Thứ",
      "province": "Sóc Trăng",
      "stars": "4 sao",
      "price": 80000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 582,
      "name": "Bánh phồng tôm Bạc Liêu",
      "province": "Bạc Liêu",
      "stars": "4 sao",
      "price": 90000,
      "unit": "kg",
      "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
    },
    {
      "id": 366,
      "name": "Giảo cổ lam sấy khô",
      "province": "Hòa Bình",
      "stars": "4 sao",
      "price": 150000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 371,
      "name": "Chè búp tím Thanh Ba",
      "province": "Phú Thọ",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 375,
      "name": "Trà đinh lăng sấy khô",
      "province": "Vĩnh Phúc",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 378,
      "name": "Cao chè vằng Thái Nguyên",
      "province": "Thái Nguyên",
      "stars": "4 sao",
      "price": 150000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 383,
      "name": "Trà mướp đắng rừng",
      "province": "Bắc Kạn",
      "stars": "4 sao",
      "price": 200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 387,
      "name": "Rượu làng Vân",
      "province": "Bắc Giang",
      "stars": "4 sao",
      "price": 100000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 391,
      "name": "Trà hoa vàng Ba Chẽ khô",
      "province": "Quảng Ninh",
      "stars": "4 sao",
      "price": 2500000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 407,
      "name": "Trà hoa hòe sấy khô",
      "province": "Thái Bình",
      "stars": "4 sao",
      "price": 180000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 471,
      "name": "Cá bống sông Trà rim khô",
      "province": "Quảng Ngãi",
      "stars": "4 sao",
      "price": 150000,
      "unit": "hộp 250g",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 479,
      "name": "Cà phê rang xay nguyên chất Phú Yên",
      "province": "Phú Yên",
      "stars": "4 sao",
      "price": 280000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 498,
      "name": "Mật ong hoa cà phê nguyên chất",
      "province": "Gia Lai",
      "stars": "4 sao",
      "price": 280000,
      "unit": "lít",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 506,
      "name": "Khổ qua rừng sấy khô",
      "province": "Đắk Nông",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 510,
      "name": "Trà Atiso Đà Lạt túi lọc / sấy khô",
      "province": "Lâm Đồng",
      "stars": "4 sao",
      "price": 150000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 526,
      "name": "Trà sen Nhơn Trạch",
      "province": "Đồng Nai",
      "stars": "4 sao",
      "price": 500000,
      "unit": "hộp",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 550,
      "name": "Cốm dẹp Trà Vinh",
      "province": "Trà Vinh",
      "stars": "4 sao",
      "price": 90000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 551,
      "name": "Bánh tét Trà Vinh hút chân không",
      "province": "Trà Vinh",
      "stars": "4 sao",
      "price": 120000,
      "unit": "đòn",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 555,
      "name": "Trà đinh lăng Vĩnh Long",
      "province": "Vĩnh Long",
      "stars": "4 sao",
      "price": 200000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 570,
      "name": "Trà đinh lăng Cần Thơ",
      "province": "Cần Thơ",
      "stars": "4 sao",
      "price": 180000,
      "unit": "kg",
      "group": "Trà & Thảo Mộc"
    },
    {
      "id": 338,
      "name": "Miến dong Minh Hồng (Hoài Đức)",
      "province": "Hà Nội",
      "stars": "4 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 342,
      "name": "Mật ong bạc hà Mèo Vạc",
      "province": "Hà Giang",
      "stars": "4 sao",
      "price": 650000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 343,
      "name": "Thịt trâu gác bếp hút chân không",
      "province": "Hà Giang",
      "stars": "4 sao",
      "price": 1100000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 346,
      "name": "Nấm hương rừng Sa Pa khô",
      "province": "Lào Cai",
      "stars": "4 sao",
      "price": 450000,
      "unit": "túi 500g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 350,
      "name": "Mật ong nhãn Văn Chấn",
      "province": "Yên Bái",
      "stars": "4 sao",
      "price": 350000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 351,
      "name": "Miến đao Giới Phiên",
      "province": "Yên Bái",
      "stars": "4 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 354,
      "name": "Thịt trâu sấy gác bếp bản địa",
      "province": "Điện Biên",
      "stars": "4 sao",
      "price": 1000000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 358,
      "name": "Mật ong rừng nguyên chất Lai Châu",
      "province": "Lai Châu",
      "stars": "4 sao",
      "price": 600000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 359,
      "name": "Thịt lợn sấy gác bếp",
      "province": "Lai Châu",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 363,
      "name": "Thịt bò khô bản địa",
      "province": "Sơn La",
      "stars": "4 sao",
      "price": 850000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 367,
      "name": "Mật ong rừng Hòa Bình",
      "province": "Hòa Bình",
      "stars": "4 sao",
      "price": 450000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 370,
      "name": "Thịt chua Thanh Sơn (Hộp đóng kín)",
      "province": "Phú Thọ",
      "stars": "4 sao",
      "price": 70000,
      "unit": "hộp",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 374,
      "name": "Mật ong Tam Đảo",
      "province": "Vĩnh Phúc",
      "stars": "4 sao",
      "price": 400000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 386,
      "name": "Mật ong hoa vải Lục Ngạn",
      "province": "Bắc Giang",
      "stars": "4 sao",
      "price": 300000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 390,
      "name": "Chả mực Hạ Long hút chân không cấp đông",
      "province": "Quảng Ninh",
      "stars": "4 sao",
      "price": 550000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 395,
      "name": "Mật ong rừng Cát Bà",
      "province": "Hải Phòng",
      "stars": "4 sao",
      "price": 500000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 399,
      "name": "Tỏi đen Chí Linh",
      "province": "Hải Dương",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 422,
      "name": "Thịt quay giòn bì Lạng Sơn hút chân không",
      "province": "Lạng Sơn",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 427,
      "name": "Thịt lợn xông khói Cao Bằng",
      "province": "Cao Bằng",
      "stars": "4 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 431,
      "name": "Nem Bùi Từ Sơn hút chân không",
      "province": "Bắc Ninh",
      "stars": "4 sao",
      "price": 50000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 434,
      "name": "Miến dong Minh Hương",
      "province": "Tuyên Quang",
      "stars": "4 sao",
      "price": 70000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 435,
      "name": "Thịt trâu khô gác bếp Chiêm Hóa",
      "province": "Tuyên Quang",
      "stars": "4 sao",
      "price": 1000000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 438,
      "name": "Nem chua Thanh Hóa hút chân không",
      "province": "Thanh Hóa",
      "stars": "4 sao",
      "price": 50000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 447,
      "name": "Hải sản khô Kỳ Anh",
      "province": "Hà Tĩnh",
      "stars": "4 sao",
      "price": 800000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 450,
      "name": "Khoai dẻo Quảng Bình",
      "province": "Quảng Bình",
      "stars": "4 sao",
      "price": 100000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 458,
      "name": "Tôm chua Huế đóng hũ kín",
      "province": "Thừa Thiên Huế",
      "stars": "4 sao",
      "price": 90000,
      "unit": "hũ 500g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 462,
      "name": "Chả bò Đà Nẵng hút chân không",
      "province": "Đà Nẵng",
      "stars": "4 sao",
      "price": 420000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 467,
      "name": "Cao lầu khô Hội An",
      "province": "Quảng Nam",
      "stars": "4 sao",
      "price": 80000,
      "unit": "túi 500g",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 475,
      "name": "Nem chợ Huyện hút chân không",
      "province": "Bình Định",
      "stars": "4 sao",
      "price": 60000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 486,
      "name": "Mật nho nguyên chất",
      "province": "Ninh Thuận",
      "stars": "4 sao",
      "price": 150000,
      "unit": "chai",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 487,
      "name": "Thịt cừu sấy khô",
      "province": "Ninh Thuận",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 490,
      "name": "Mực một nắng Phan Thiết (Hút chân không cấp đông)",
      "province": "Bình Thuận",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 494,
      "name": "Măng khô rừng Măng Đen",
      "province": "Kon Tum",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 499,
      "name": "Bò một nắng Chư Sê",
      "province": "Gia Lai",
      "stars": "4 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 511,
      "name": "Nước cốt dâu tằm / chanh dây nguyên chất",
      "province": "Lâm Đồng",
      "stars": "4 sao",
      "price": 100000,
      "unit": "chai",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 514,
      "name": "Mật ong hoa điều nguyên chất",
      "province": "Bình Phước",
      "stars": "4 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 523,
      "name": "Mủ trôm nguyên chất",
      "province": "Bình Dương",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 527,
      "name": "Mật ong hoa tràm / hoa cao su Đồng Nai",
      "province": "Đồng Nai",
      "stars": "4 sao",
      "price": 250000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 530,
      "name": "Hải sản khô một nắng Côn Đảo (Mực/Cá thu hút chân không)",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "4 sao",
      "price": 900000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 558,
      "name": "Nem Lai Vung hút chân không chuẩn vị",
      "province": "Đồng Tháp",
      "stars": "4 sao",
      "price": 55000,
      "unit": "chục",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 559,
      "name": "Cá lóc khô một nắng",
      "province": "Đồng Tháp",
      "stars": "4 sao",
      "price": 300000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 563,
      "name": "Khô bò dứa An Phú",
      "province": "An Giang",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 566,
      "name": "Khô cá thiều Phú Quốc hút chân không",
      "province": "Kiên Giang",
      "stars": "4 sao",
      "price": 450000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 571,
      "name": "Khô nhái (\"vũ nữ chân dài\") đóng gói",
      "province": "Cần Thơ",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 575,
      "name": "Mật ong hoa tràm U Minh",
      "province": "Hậu Giang",
      "stars": "4 sao",
      "price": 300000,
      "unit": "lít",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 578,
      "name": "Lạp xưởng tôm Sóc Trăng hút chân không",
      "province": "Sóc Trăng",
      "stars": "4 sao",
      "price": 260000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 583,
      "name": "Khô cá lóc đồng Bạc Liêu",
      "province": "Bạc Liêu",
      "stars": "4 sao",
      "price": 260000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 586,
      "name": "Khô cá bổi U Minh",
      "province": "Cà Mau",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 587,
      "name": "Cua biển Cà Mau đóng thùng xốp vận chuyển xa",
      "province": "Cà Mau",
      "stars": "4 sao",
      "price": 700000,
      "unit": "kg",
      "group": "Thực Phẩm & Nông Sản"
    },
    {
      "id": 347,
      "name": "Tương ớt Mường Khương",
      "province": "Lào Cai",
      "stars": "4 sao",
      "price": 50000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 355,
      "name": "Hạt mắc khén khô",
      "province": "Điện Biên",
      "stars": "4 sao",
      "price": 350000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 382,
      "name": "Tinh bột nghệ vàng Bắc Kạn",
      "province": "Bắc Kạn",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 402,
      "name": "Tinh bột nghệ đỏ Hưng Yên",
      "province": "Hưng Yên",
      "stars": "4 sao",
      "price": 600000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 403,
      "name": "Tương Bần Hưng Yên đóng chai",
      "province": "Hưng Yên",
      "stars": "4 sao",
      "price": 60000,
      "unit": "chai",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 414,
      "name": "Mắm tép Gia Viễn",
      "province": "Ninh Bình",
      "stars": "4 sao",
      "price": 120000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 423,
      "name": "Mạch nha Lạng Sơn",
      "province": "Lạng Sơn",
      "stars": "4 sao",
      "price": 70000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 442,
      "name": "Tương Nam Đàn đóng chai",
      "province": "Nghệ An",
      "stars": "4 sao",
      "price": 60000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 443,
      "name": "Tinh bột nghệ Nghệ An",
      "province": "Nghệ An",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 451,
      "name": "Nước mắm Bảo Ninh",
      "province": "Quảng Bình",
      "stars": "4 sao",
      "price": 150000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 470,
      "name": "Đường phèn, đường phổi Quảng Ngãi",
      "province": "Quảng Ngãi",
      "stars": "4 sao",
      "price": 55000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 483,
      "name": "Muối ớt tôm Nha Trang",
      "province": "Khánh Hòa",
      "stars": "4 sao",
      "price": 50000,
      "unit": "hũ",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 495,
      "name": "Hạt dổi rừng khô",
      "province": "Kon Tum",
      "stars": "4 sao",
      "price": 2500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 507,
      "name": "Tinh bột nghệ nguyên chất Đắk Nông",
      "province": "Đắk Nông",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 522,
      "name": "Tinh bột nghệ Bình Dương",
      "province": "Bình Dương",
      "stars": "4 sao",
      "price": 500000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 531,
      "name": "Bánh bông lan trứng muối đóng hộp cứng",
      "province": "Bà Rịa - Vũng Tàu",
      "stars": "4 sao",
      "price": 70000,
      "unit": "hộp",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 535,
      "name": "Bánh tráng nướng muối ớt Sài Gòn",
      "province": "TP. Hồ Chí Minh",
      "stars": "4 sao",
      "price": 60000,
      "unit": "túi",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 543,
      "name": "Nước mắm Gò Công",
      "province": "Tiền Giang",
      "stars": "4 sao",
      "price": 150000,
      "unit": "lít",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 562,
      "name": "Mắm cá linh / Mắm thái Châu Đốc (Hũ nhựa kín)",
      "province": "An Giang",
      "stars": "4 sao",
      "price": 100000,
      "unit": "hũ 500g",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 567,
      "name": "Tiêu hạt Phú Quốc khô",
      "province": "Kiên Giang",
      "stars": "4 sao",
      "price": 250000,
      "unit": "kg",
      "group": "Gia Vị & Nông Sản Khô"
    },
    {
      "id": 339,
      "name": "Bánh chưng Tranh Khúc hút chân không",
      "province": "Hà Nội",
      "stars": "4 sao",
      "price": 80000,
      "unit": "chiếc",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 454,
      "name": "Tinh dầu nén Quảng Trị",
      "province": "Quảng Trị",
      "stars": "4 sao",
      "price": 150000,
      "unit": "lọ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 455,
      "name": "Cao gắm thảo dược",
      "province": "Quảng Trị",
      "stars": "4 sao",
      "price": 400000,
      "unit": "hộp",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 459,
      "name": "Dầu tràm Huế nguyên chất",
      "province": "Thừa Thiên Huế",
      "stars": "4 sao",
      "price": 200000,
      "unit": "lọ",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    },
    {
      "id": 534,
      "name": "Hàng thủ công mây tre đan Sài Gòn",
      "province": "TP. Hồ Chí Minh",
      "stars": "4 sao",
      "price": 800000,
      "unit": "món",
      "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
    }
  ]
};

/**
 * Top 10 sản phẩm giá rẻ nhất
 */
const CHEAPEST_10 = [
  {
    "id": 430,
    "name": "Bánh phu thê Đình Bảng",
    "province": "Bắc Ninh",
    "stars": "4 sao",
    "price": 8000,
    "unit": "cái",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 439,
    "name": "Bánh gai Tứ Trụ",
    "province": "Thanh Hóa",
    "stars": "4 sao",
    "price": 10000,
    "unit": "chiếc",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 398,
    "name": "Bánh gai Ninh Giang",
    "province": "Hải Dương",
    "stars": "4 sao",
    "price": 12000,
    "unit": "chiếc",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 446,
    "name": "Bánh đa dừa Độc Lập",
    "province": "Hà Tĩnh",
    "stars": "4 sao",
    "price": 25000,
    "unit": "chiếc",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 474,
    "name": "Bánh tráng dừa Tam Quan",
    "province": "Bình Định",
    "stars": "4 sao",
    "price": 25000,
    "unit": "cái",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 518,
    "name": "Bánh tráng me Tây Ninh",
    "province": "Tây Ninh",
    "stars": "4 sao",
    "price": 40000,
    "unit": "túi",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 419,
    "name": "Bánh đa nem Chợ Sí",
    "province": "Hà Nam",
    "stars": "4 sao",
    "price": 45000,
    "unit": "túi",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 478,
    "name": "Bánh tráng Hòa Đa",
    "province": "Phú Yên",
    "stars": "4 sao",
    "price": 45000,
    "unit": "túi",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 539,
    "name": "Bánh tráng Long Trì",
    "province": "Long An",
    "stars": "4 sao",
    "price": 45000,
    "unit": "túi",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  },
  {
    "id": 466,
    "name": "Bánh tráng Đại Lộc",
    "province": "Quảng Nam",
    "stars": "4 sao",
    "price": 50000,
    "unit": "túi",
    "group": "Đồ Ăn Vặt, Hạt & Trái Cây Sấy"
  }
];

/**
 * Top 10 sản phẩm đắt nhất / cao cấp nhất
 */
const PRICIEST_10 = [
  {
    "id": 492,
    "name": "Sâm Ngọc Linh Kon Tum ngâm mật ong rừng",
    "province": "Kon Tum",
    "stars": "5 sao",
    "price": 7000000,
    "unit": "hũ",
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
  },
  {
    "id": 356,
    "name": "Sâm Lai Châu củ tươi / thái lát sấy khô thượng hạng",
    "province": "Lai Châu",
    "stars": "5 sao",
    "price": 6000000,
    "unit": "hộp",
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
  },
  {
    "id": 480,
    "name": "Yến sào Khánh Hòa tinh chế cao cấp (Hộp quà biếu)",
    "province": "Khánh Hòa",
    "stars": "5 sao",
    "price": 5000000,
    "unit": "100g",
    "group": "Trà & Thảo Mộc"
  },
  {
    "id": 372,
    "name": "Trà hoa vàng Tam Đảo thượng hạng (Hộp quà tặng)",
    "province": "Vĩnh Phúc",
    "stars": "5 sao",
    "price": 4000000,
    "unit": "hộp",
    "group": "Trà & Thảo Mộc"
  },
  {
    "id": 337,
    "name": "Chăn bông tơ tằm tự dệt (Mỹ Đức)",
    "province": "Hà Nội",
    "stars": "5 sao",
    "price": 4000000,
    "unit": "chiếc",
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
  },
  {
    "id": 396,
    "name": "Bình hút lộc / Bình giọt ngọc Gốm Chu Đậu",
    "province": "Hải Dương",
    "stars": "5 sao",
    "price": 3500000,
    "unit": "bình",
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
  },
  {
    "id": 389,
    "name": "Bộ lọ hoa men chảy Gốm sứ Quang Vinh",
    "province": "Quảng Ninh",
    "stars": "5 sao",
    "price": 3000000,
    "unit": "bộ",
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
  },
  {
    "id": 391,
    "name": "Trà hoa vàng Ba Chẽ khô",
    "province": "Quảng Ninh",
    "stars": "4 sao",
    "price": 2500000,
    "unit": "hộp",
    "group": "Trà & Thảo Mộc"
  },
  {
    "id": 495,
    "name": "Hạt dổi rừng khô",
    "province": "Kon Tum",
    "stars": "4 sao",
    "price": 2500000,
    "unit": "kg",
    "group": "Gia Vị & Nông Sản Khô"
  },
  {
    "id": 521,
    "name": "Gốm sứ thủ công mỹ nghệ cao cấp Bình Dương",
    "province": "Bình Dương",
    "stars": "5 sao",
    "price": 2500000,
    "unit": "bộ",
    "group": "Quà Tặng & Thủ Công Mỹ Nghệ"
  }
];

// ── API công khai ─────────────────────────────────────────────────

/**
 * Tìm sản phẩm theo từ khoá (tìm trong tên + tỉnh)
 * @param {string} query
 * @returns {Array}
 */
function searchProducts(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const grpData of Object.values(GROUPS)) {
    for (const p of grpData.products) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.province.toLowerCase().includes(q) ||
        grpData.group.toLowerCase().includes(q)
      ) {
        results.push({ ...p, group: grpData.group });
      }
    }
  }
  return results;
}

/**
 * Lấy sản phẩm theo tỉnh/thành phố
 * @param {string} province
 * @returns {Array}
 */
function getByProvince(province) {
  if (!province) return [];
  const p = province.toLowerCase();
  for (const [prov, list] of Object.entries(BY_PROVINCE)) {
    if (prov.toLowerCase().includes(p) || p.includes(prov.toLowerCase())) {
      return list;
    }
  }
  return [];
}

/**
 * Lấy sản phẩm 5 sao
 * @returns {Array}
 */
function getFiveStarProducts() {
  return BY_STAR['5 sao'] || [];
}

/**
 * Lấy sản phẩm theo nhóm
 * @param {string} groupKey - key nhóm hàng
 * @returns {Array}
 */
function getByGroup(groupKey) {
  return GROUPS[groupKey]?.products || [];
}

/**
 * Lấy sản phẩm trong khoảng giá
 * @param {number} minPrice
 * @param {number} maxPrice
 * @returns {Array}
 */
function getByPriceRange(minPrice, maxPrice) {
  const results = [];
  for (const grpData of Object.values(GROUPS)) {
    for (const p of grpData.products) {
      if (p.price >= minPrice && p.price <= maxPrice) {
        results.push({ ...p, group: grpData.group });
      }
    }
  }
  return results.sort((a, b) => a.price - b.price);
}

/**
 * Format giá tiền VNĐ
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  if (!price || price === 0) return 'Liên hệ';
  return price.toLocaleString('vi-VN') + ' đ';
}

/**
 * Lấy tóm tắt context cho AI (dùng trong prompt)
 * @param {string} userQuery - câu hỏi của user
 * @returns {string} context text
 */
function getAIContext(userQuery) {
  if (!userQuery) return '';
  const matches = searchProducts(userQuery);
  if (matches.length === 0) {
    // Thử tìm theo tỉnh
    const byProv = getByProvince(userQuery);
    if (byProv.length > 0) {
      return buildContextText(byProv.slice(0, 8), 'tỉnh/thành này');
    }
    return '';
  }
  return buildContextText(matches.slice(0, 8), 'tìm được');
}

function buildContextText(products, label) {
  if (!products || products.length === 0) return '';
  const lines = products.map(p =>
    `- ${p.name} (${p.province}) | ${p.stars} | ${formatPrice(p.price)}/${p.unit || 'đơn vị'} | Nhóm: ${p.group}`
  );
  return `Các sản phẩm OCOP ${label}:\n${lines.join('\n')}`;
}

/**
 * Gợi ý quà tặng theo ngân sách
 * @param {number} budget
 * @returns {Array}
 */
function suggestGifts(budget) {
  const all = Object.values(GROUPS).flatMap(g => g.products.map(p => ({...p, group: g.group})));
  return all
    .filter(p => p.price > 0 && p.price <= budget)
    .sort((a, b) => {
      // Ưu tiên 5 sao, sau đó giá cao hơn (quà ngon hơn)
      const starA = parseInt(a.stars) || 0;
      const starB = parseInt(b.stars) || 0;
      if (starB !== starA) return starB - starA;
      return b.price - a.price;
    })
    .slice(0, 10);
}

// ── Export toàn cục ────────────────────────────────────────────────
window.OCOP_AI_KNOWLEDGE = {
  // Dữ liệu thô
  groups: GROUPS,
  byProvince: BY_PROVINCE,
  byStar: BY_STAR,
  cheapest10: CHEAPEST_10,
  priciest10: PRICIEST_10,

  // API tìm kiếm & hỗ trợ AI
  searchProducts,
  getByProvince,
  getFiveStarProducts,
  getByGroup,
  getByPriceRange,
  formatPrice,
  getAIContext,
  suggestGifts,

  // Meta
  totalProducts: 252,
  totalGroups: 5,
  provinces: ["An Giang","Bà Rịa - Vũng Tàu","Bình Dương","Bình Phước","Bình Thuận","Bình Định","Bạc Liêu","Bắc Giang","Bắc Kạn","Bắc Ninh","Bến Tre","Cao Bằng","Cà Mau","Cần Thơ","Gia Lai","Hà Giang","Hà Nam","Hà Nội","Hà Tĩnh","Hòa Bình","Hưng Yên","Hải Dương","Hải Phòng","Hậu Giang","Khánh Hòa","Kiên Giang","Kon Tum","Lai Châu","Long An","Lào Cai","Lâm Đồng","Lạng Sơn","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","TP. Hồ Chí Minh","Thanh Hóa","Thái Bình","Thái Nguyên","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang","Tây Ninh","Vĩnh Long","Vĩnh Phúc","Yên Bái","Điện Biên","Đà Nẵng","Đắk Lắk","Đắk Nông","Đồng Nai","Đồng Tháp"],
  groupKeys: ["do_an_vat_hat_trai_cay_say","tra_thao_moc","thuc_pham_nong_san","gia_vi_nong_san_kho","qua_tang_thu_cong_my_nghe"],
};

console.log('[OCOP AI Knowledge] Đã tải:', 252, 'sản phẩm từ', 5, 'nhóm hàng');

})();
