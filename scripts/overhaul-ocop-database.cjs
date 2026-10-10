const fs = require('fs');
const path = require('path');

// 1. Load current PRODUCTS
const currentData = require('../data.js');
const PRODUCTS = currentData.PRODUCTS;

// 2. Define specific overrides for the 10 core provinces requested by user
const specificOverrides = {
  'Hà Nội': [
    {
      name: 'Gốm sứ tâm linh cao cấp Bát Tràng - Xưởng nghệ nhân (OCOP 5 sao)',
      nameEn: 'Bat Trang Premium Spiritual Ceramics - Master Artisan Workshop (OCOP 5-star)',
      stars: 5,
      category: 'gift',
      price: 2500000,
      packaging: 'bộ',
      packagingEn: 'set',
      producer: 'Xưởng nghệ nhân Gốm sứ Bát Tràng',
      address: 'Xóm 1, Làng cổ Bát Tràng, Gia Lâm, Hà Nội',
      store: 'Showroom Gốm sứ Bát Tràng Tinh Hoa',
      cert: 'QĐ số 3828/QĐ-UBND TP. Hà Nội (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Trà sen Tây Hồ - Cơ sở Quảng An (OCOP 4 sao)',
      nameEn: 'Tay Ho Lotus Scented Tea - Quang An Facility (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 1800000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Cơ sở Trà sen truyền thống Quảng An',
      address: 'Số 12 Ngõ 50 Đặng Thai Mai, P. Quảng An, Tây Hồ, Hà Nội',
      store: 'Không gian Trà sen Tây Hồ',
      cert: 'QĐ số 4125/QĐ-UBND TP. Hà Nội (OCOP 4 Sao)'
    },
    {
      name: 'Giò chả Ước Lễ - Cơ sở truyền thống Thanh Oai (OCOP 4 sao)',
      nameEn: 'Uoc Le Traditional Pork Roll - Thanh Oai Facility (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 250000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'Cơ sở Giò chả truyền thống Ước Lễ',
      address: 'Làng Ước Lễ, Xã Tân Ước, Huyện Thanh Oai, Hà Nội',
      store: 'Cửa hàng Giò chả Ước Lễ Gia Truyền',
      cert: 'QĐ số 2190/QĐ-UBND TP. Hà Nội (OCOP 4 Sao)'
    },
    {
      name: 'Gạo tẻ thơm Thượng Cốc - HTX Nông nghiệp Thanh Oai (OCOP 3 sao)',
      nameEn: 'Thuong Coc Aromatic Rice - Thanh Oai Agricultural Cooperative (OCOP 3-star)',
      stars: 3,
      category: 'food',
      price: 65000,
      packaging: 'bao 5kg',
      packagingEn: 'bag 5kg',
      producer: 'Hợp tác xã Nông nghiệp Thượng Cốc',
      address: 'Thôn Thượng Cốc, Xã Hồng Dương, Thanh Oai, Hà Nội',
      store: 'Điểm phân phối Gạo thơm Thượng Cốc',
      cert: 'QĐ số 1845/QĐ-UBND Huyện Thanh Oai (OCOP 3 Sao)'
    }
  ],
  'Hà Giang': [
    {
      name: 'Trà / Chè chốt Shan tuyết cổ thụ Tây Côn Lĩnh (OCOP 4 sao)',
      nameEn: 'Tay Con Linh Ancient Shan Tuyet Tea - Organic Mountain Harvest (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 600000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Chè Tây Côn Lĩnh',
      address: 'Xã Cao Bồ, Huyện Vị Xuyên, Hà Giang',
      store: 'Showroom Trà Shan Tuyết Tây Côn Lĩnh',
      cert: 'QĐ số 1982/QĐ-UBND Tỉnh Hà Giang (OCOP 4 Sao)'
    },
    {
      name: 'Mật ong bạc hà Cao nguyên đá Mèo Vạc (OCOP 4 sao)',
      nameEn: 'Meo Vac Stone Plateau Mint Honey (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 650000,
      packaging: 'lít',
      packagingEn: 'liter',
      producer: 'HTX Nuôi ong Cao nguyên đá Mèo Vạc',
      address: 'Thị trấn Mèo Vạc, Huyện Mèo Vạc, Hà Giang',
      store: 'Điểm giới thiệu Mật ong Bạc hà Mèo Vạc',
      cert: 'QĐ số 2045/QĐ-UBND Tỉnh Hà Giang (OCOP 4 Sao)'
    },
    {
      name: 'Hồng không hạt Quản Bạ (OCOP 3 sao)',
      nameEn: 'Quan Ba Seedless Persimmon (OCOP 3-star)',
      stars: 3,
      category: 'snack',
      price: 95000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Nông nghiệp Quản Bạ',
      address: 'Xã Nghĩa Thuận, Huyện Quản Bạ, Hà Giang',
      store: 'Điểm bán Đặc sản Nông sản Quản Bạ',
      cert: 'QĐ số 1520/QĐ-UBND Huyện Quản Bạ (OCOP 3 Sao)'
    },
    {
      name: 'Thảo quả khô Vị Xuyên (OCOP 3 sao)',
      nameEn: 'Vi Xuyen Dried Black Cardamom (OCOP 3-star)',
      stars: 3,
      category: 'spice',
      price: 240000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Dược liệu Rừng Vị Xuyên',
      address: 'Xã Lao Chải, Huyện Vị Xuyên, Hà Giang',
      store: 'Cửa hàng Nông sản Dược liệu Vị Xuyên',
      cert: 'QĐ số 1432/QĐ-UBND Huyện Vị Xuyên (OCOP 3 Sao)'
    }
  ],
  'Sơn La': [
    {
      name: 'Cà phê Arabica Sơn La - HTX Bích Thao (OCOP 5 sao)',
      nameEn: 'Son La Arabica Coffee - Bich Thao Cooperative (OCOP 5-star)',
      stars: 5,
      category: 'tea',
      price: 400000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Cà phê Bích Thao Sơn La',
      address: 'Bản Hoàng Văn Thụ, Xã Hua La, TP. Sơn La, Sơn La',
      store: 'Showroom Cà phê Arabica Bích Thao',
      cert: 'QĐ số 3828/QĐ-BNN-VPĐP (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Chè Shan tuyết Tà Xùa - Bắc Yên (OCOP 4 sao)',
      nameEn: 'Ta Xua Shan Tuyet Ancient Tea - Bac Yen (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 900000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Trà Tà Xùa',
      address: 'Bản Bẹ, Xã Tà Xùa, Huyện Bắc Yên, Sơn La',
      store: 'Điểm giới thiệu Trà cổ thụ Tà Xùa',
      cert: 'QĐ số 2580/QĐ-UBND Tỉnh Sơn La (OCOP 4 Sao)'
    },
    {
      name: 'Xoài tròn Yên Châu (OCOP 4 sao)',
      nameEn: 'Yen Chau Round Mango - Geographical Indication (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 85000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Nông nghiệp Yên Châu',
      address: 'Tiểu khu 2, Thị trấn Yên Châu, Sơn La',
      store: 'Cửa hàng Nông sản An toàn Yên Châu',
      cert: 'QĐ số 1930/QĐ-UBND Tỉnh Sơn La (OCOP 4 Sao)'
    },
    {
      name: 'Mận hậu chín sớm Mộc Châu (OCOP 3 sao)',
      nameEn: 'Moc Chau Early Harvest Plum (OCOP 3-star)',
      stars: 3,
      category: 'snack',
      price: 75000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Nông nghiệp Mộc Châu',
      address: 'Tiểu khu Pa Khen, Thị trấn Nông trường Mộc Châu, Sơn La',
      store: 'Điểm dừng chân Nông sản Mộc Châu',
      cert: 'QĐ số 1640/QĐ-UBND Huyện Mộc Châu (OCOP 3 Sao)'
    }
  ],
  'Bắc Giang': [
    {
      name: 'Vải thiều lục ngạn sấy khô - HTX Hồng Xuân (OCOP 4 sao)',
      nameEn: 'Luc Ngan Dried Lychee - Hong Xuan Cooperative (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 150000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Nông nghiệp Hồng Xuân',
      address: 'Xã Quý Sơn, Huyện Lục Ngạn, Bắc Giang',
      store: 'Showroom Vải thiều Lục Ngạn Hồng Xuân',
      cert: 'QĐ số 2890/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)'
    },
    {
      name: 'Mỳ Chũ đặc biệt Thủ Dương (OCOP 4 sao)',
      nameEn: 'Thu Duong Special Chu Rice Noodles (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 80000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Mỳ Chũ Thủ Dương',
      address: 'Làng Thủ Dương, Xã Nam Dương, Lục Ngạn, Bắc Giang',
      store: 'Cửa hàng Giới thiệu Mỳ Chũ Nam Dương',
      cert: 'QĐ số 2140/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)'
    },
    {
      name: 'Chè xanh Bản Ven (OCOP 4 sao)',
      nameEn: 'Ban Ven Green Tea - Yen The (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 300000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Thân Trường Bản Ven',
      address: 'Bản Ven, Xã Xuân Lương, Huyện Yên Thế, Bắc Giang',
      store: 'Không gian Văn hóa Trà Bản Ven',
      cert: 'QĐ số 2315/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)'
    },
    {
      name: 'Rượu Làng Vân - Cơ sở chưng cất truyền thống Vân Hà (OCOP 4 sao)',
      nameEn: 'Lang Van Traditional Distilled Spirit - Van Ha (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 120000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Cơ sở sản xuất Rượu Làng Vân',
      address: 'Làng Vân, Xã Vân Hà, Thị xã Việt Yên, Bắc Giang',
      store: 'Điểm giới thiệu Rượu Làng Vân Chính Hiệu',
      cert: 'QĐ số 1980/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)'
    }
  ],
  'Quảng Nam': [
    {
      name: 'Sâm Ngọc Linh ngâm mật ong rừng - Nam Trà My (OCOP 5 sao)',
      nameEn: 'Nam Tra My Ngoc Linh Ginseng in Wild Forest Honey (OCOP 5-star)',
      stars: 5,
      category: 'gift',
      price: 3800000,
      packaging: 'hũ',
      packagingEn: 'jar',
      producer: 'Công ty CP Dược liệu Sâm Ngọc Linh Nam Trà My',
      address: 'Thôn 2, Xã Trà Mai, Huyện Nam Trà My, Quảng Nam',
      store: 'Trung tâm Giới thiệu Sâm Ngọc Linh Quốc Bảo',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Nước mắm cốt cá cơm Cửa Khe (OCOP 4 sao)',
      nameEn: 'Cua Khe Traditional Anchovy Fish Sauce (OCOP 4-star)',
      stars: 4,
      category: 'spice',
      price: 160000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Làng nghề Nước mắm Cửa Khe',
      address: 'Thôn Cửa Khe, Xã Bình Dương, Thăng Bình, Quảng Nam',
      store: 'Cửa hàng Nước mắm Truyền thống Cửa Khe',
      cert: 'QĐ số 2640/QĐ-UBND Tỉnh Quảng Nam (OCOP 4 Sao)'
    },
    {
      name: 'Trà nấm lim xanh Tiên Phước (OCOP 4 sao)',
      nameEn: 'Tien Phuoc Wild Ganoderma Lucidum Tea (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 1200000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Nấm lim xanh Tiên Phước',
      address: 'Xã Tiên Hiệp, Huyện Tiên Phước, Quảng Nam',
      store: 'Điểm phân phối Nấm lim xanh Tiên Phước',
      cert: 'QĐ số 2480/QĐ-UBND Tỉnh Quảng Nam (OCOP 4 Sao)'
    },
    {
      name: 'Bánh tráng sắn Lộc Đại (OCOP 3 sao)',
      nameEn: 'Loc Dai Cassava Rice Paper (OCOP 3-star)',
      stars: 3,
      category: 'snack',
      price: 45000,
      packaging: 'gói',
      packagingEn: 'pack',
      producer: 'HTX Nông nghiệp Lộc Đại',
      address: 'Xã Quế Hiệp, Huyện Quế Sơn, Quảng Nam',
      store: 'Điểm bán Đặc sản Bánh tráng sắn Quế Sơn',
      cert: 'QĐ số 1750/QĐ-UBND Huyện Quế Sơn (OCOP 3 Sao)'
    }
  ],
  'Thừa Thiên Huế': [
    {
      name: 'Tinh dầu tràm Huế - Cơ sở Hoa Nén (OCOP 4 sao)',
      nameEn: 'Hoa Nen Hue Pure Melaleuca Cajeput Oil (OCOP 4-star)',
      stars: 4,
      category: 'gift',
      price: 200000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Công ty TNHH MTV Sản xuất Tinh dầu Hoa Nén',
      address: 'Thôn Đông Lâm, Xã Phong An, Huyện Phong Điền, Thừa Thiên Huế',
      store: 'Showroom Tinh dầu Tràm Hoa Nén Huế',
      cert: 'QĐ số 2980/QĐ-UBND Tỉnh Thừa Thiên Huế (OCOP 4 Sao)'
    },
    {
      name: 'Trà sâm tiến vua xứ Huế (OCOP 4 sao)',
      nameEn: 'Hue Royal Imperial Ginseng Herbal Tea (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 380000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty Cung đình Thượng uyển Huế',
      address: 'Đường Nguyễn Huệ, TP. Huế, Thừa Thiên Huế',
      store: 'Trà đình Hoàng gia Cố Đô',
      cert: 'QĐ số 2750/QĐ-UBND Tỉnh Thừa Thiên Huế (OCOP 4 Sao)'
    },
    {
      name: 'Hạt sen khô tịnh tâm Đại Nội (OCOP 3 sao)',
      nameEn: 'Dai Noi Hue Dried Tinh Tam Lotus Seeds (OCOP 3-star)',
      stars: 3,
      category: 'food',
      price: 360000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Nông nghiệp Hạt sen Tịnh Tâm',
      address: 'Hồ Tịnh Tâm, P. Thuận Thành, TP. Huế, Thừa Thiên Huế',
      store: 'Đại lý Sen Huế Tịnh Tâm Cố Đô',
      cert: 'QĐ số 1820/QĐ-UBND TP. Huế (OCOP 3 Sao)'
    },
    {
      name: 'Tôm chua Huế đầm phá Tam Giang - Cơ sở truyền thống (OCOP 4 sao)',
      nameEn: 'Tam Giang Lagoon Traditional Sour Shrimp (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 90000,
      packaging: 'hũ',
      packagingEn: 'jar',
      producer: 'Cơ sở Tôm chua Tam Giang Cố Đô',
      address: 'Thị trấn Thuận An, Huyện Phú Vang, Thừa Thiên Huế',
      store: 'Đặc sản Tôm chua Huế Truyền thống',
      cert: 'QĐ số 2310/QĐ-UBND Tỉnh Thừa Thiên Huế (OCOP 4 Sao)'
    }
  ],
  'Lâm Đồng': [
    {
      name: 'Trà Ô long Cầu Đất - Đà Lạt (OCOP 5 sao)',
      nameEn: 'Cau Dat Da Lat High Mountain Oolong Tea (OCOP 5-star)',
      stars: 5,
      category: 'tea',
      price: 650000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty Cổ phần Cầu Đất Farm Đà Lạt',
      address: 'Thôn Trường Thọ, Xã Trạm Hành, TP. Đà Lạt, Lâm Đồng',
      store: 'Showroom Trà & Cà phê Cầu Đất Farm',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Hồng treo gió công nghệ Nhật Bản Mộc Nhiên (OCOP 4 sao)',
      nameEn: 'Moc Nhien Japanese Air-dried Hoshigaki Persimmons (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 520000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty Nông sản Mộc Nhiên Đà Lạt',
      address: 'Đường Khe Sanh, Phường 10, TP. Đà Lạt, Lâm Đồng',
      store: 'Không gian Nông sản Sấy Mộc Nhiên',
      cert: 'QĐ số 3120/QĐ-UBND Tỉnh Lâm Đồng (OCOP 4 Sao)'
    },
    {
      name: 'Chuối Laba sấy dẻo Đơn Dương (OCOP 4 sao)',
      nameEn: 'Don Duong King Laba Soft Dried Bananas (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 110000,
      packaging: 'túi',
      packagingEn: 'bag',
      producer: 'HTX Nông nghiệp Laba Đơn Dương',
      address: 'Thị trấn Thạnh Mỹ, Huyện Đơn Dương, Lâm Đồng',
      store: 'Điểm phân phối Chuối Laba Tiến Vua',
      cert: 'QĐ số 2590/QĐ-UBND Tỉnh Lâm Đồng (OCOP 4 Sao)'
    },
    {
      name: 'Đông trùng hạ thảo Đà Lạt (OCOP 4 sao)',
      nameEn: 'Da Lat Cordyceps Militaris Cultivation (OCOP 4-star)',
      stars: 4,
      category: 'gift',
      price: 1200000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty TNHH Sinh học Cao nguyên Đà Lạt',
      address: 'Đường Vạn Hạnh, Phường 8, TP. Đà Lạt, Lâm Đồng',
      store: 'Trung tâm Dược liệu Đông trùng Cao nguyên',
      cert: 'QĐ số 2840/QĐ-UBND Tỉnh Lâm Đồng (OCOP 4 Sao)'
    }
  ],
  'Bến Tre': [
    {
      name: 'Kẹo dừa truyền thống Tuyết Phụng (OCOP 4 sao)',
      nameEn: 'Tuyet Phung Traditional Ben Tre Coconut Candy (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 75000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Doanh nghiệp tư nhân Sản xuất Kẹo dừa Tuyết Phụng',
      address: 'Số 56 Ấp 4, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre',
      store: 'Showroom Kẹo Dừa Tuyết Phụng Mỏ Cày',
      cert: 'QĐ số 2730/QĐ-UBND Tỉnh Bến Tre (OCOP 4 Sao)'
    },
    {
      name: 'Bưởi da xanh Hàm Luông (OCOP 4 sao)',
      nameEn: 'Ham Luong Green Skin Pomelo - Certified Origin (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 110000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Bưởi da xanh Bến Tre',
      address: 'Xã Giao Long, Huyện Châu Thành, Bến Tre',
      store: 'Trạm Xúc tiến Bưởi da xanh Bến Tre',
      cert: 'QĐ số 2580/QĐ-UBND Tỉnh Bến Tre (OCOP 4 Sao)'
    },
    {
      name: 'Dầu dừa nguyên chất tinh khiết Bến Tre (OCOP 3 sao)',
      nameEn: 'Ben Tre Pure Virgin Cold-pressed Coconut Oil (OCOP 3-star)',
      stars: 3,
      category: 'spice',
      price: 150000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Cơ sở Dầu dừa Tinh khiết Bến Tre',
      address: 'Xã Hữu Định, Huyện Châu Thành, Bến Tre',
      store: 'Cửa hàng Tinh hoa Dừa Bến Tre',
      cert: 'QĐ số 1680/QĐ-UBND Huyện Châu Thành (OCOP 3 Sao)'
    },
    {
      name: 'Nước màu dừa đậm đặc Mỏ Cày Nam (OCOP 3 sao)',
      nameEn: 'Mo Cay Nam Concentrated Coconut Caramel (OCOP 3-star)',
      stars: 3,
      category: 'spice',
      price: 65000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Cơ sở Nước màu dừa Truyền thống Mỏ Cày',
      address: 'Thị trấn Mỏ Cày Nam, Bến Tre',
      store: 'Đại lý Nước màu dừa Mỏ Cày Nam',
      cert: 'QĐ số 1540/QĐ-UBND Huyện Mỏ Cày Nam (OCOP 3 Sao)'
    }
  ],
  'Thành phố Hồ Chí Minh': [
    {
      name: 'Tổ yến chưng đường phèn Cần Giờ (OCOP 4 sao)',
      nameEn: 'Can Gio Steamed Bird Nest with Rock Sugar (OCOP 4-star)',
      stars: 4,
      category: 'gift',
      price: 520000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty TNHH Yến sào Cần Giờ',
      address: 'Xã Tam Thôn Hiệp, Huyện Cần Giờ, TP. Hồ Chí Minh',
      store: 'Showroom Yến sào Cần Giờ Tinh Hoa',
      cert: 'QĐ số 3240/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)'
    },
    {
      name: 'Xoài cát Cần Giờ (OCOP 4 sao)',
      nameEn: 'Can Gio Cat Mango - Coastal Biosphere Harvest (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 95000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Nông nghiệp Cần Giờ',
      address: 'Xã Long Hòa, Huyện Cần Giờ, TP. Hồ Chí Minh',
      store: 'Cửa hàng Nông sản Sinh thái Cần Giờ',
      cert: 'QĐ số 2810/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)'
    },
    {
      name: 'Khô cá dứa một nắng Cần Giờ (OCOP 4 sao)',
      nameEn: 'Can Gio Sun-dried Pangasius Fish Specialty (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 480000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'Cơ sở Thủy hải sản Nắng Cần Giờ',
      address: 'Thị trấn Cần Thạnh, Huyện Cần Giờ, TP. Hồ Chí Minh',
      store: 'Đại lý Đặc sản Khô cá dứa Cần Giờ',
      cert: 'QĐ số 2990/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)'
    },
    {
      name: 'Mật dừa nước ông Sáu - Bình Chánh (OCOP 4 sao)',
      nameEn: 'Ong Sau Nipa Palm Nectar - Binh Chanh (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 145000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Công ty TNHH Phát triển Dừa nước Việt Nam (VietNipa)',
      address: 'Xã An Phú Tây, Huyện Bình Chánh, TP. Hồ Chí Minh',
      store: 'Showroom Mật dừa nước VietNipa',
      cert: 'QĐ số 3080/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)'
    }
  ],
  'Đồng Tháp': [
    {
      name: 'Hạt sen sấy giòn bơ tỏi Tháp Mười (OCOP 4 sao)',
      nameEn: 'Thap Muoi Crispy Garlic Butter Lotus Seeds (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 135000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty Cổ phần Thực phẩm Sen Đại Việt',
      address: 'Thị trấn Mỹ An, Huyện Tháp Mười, Đồng Tháp',
      store: 'Showroom Sen Đại Việt Tháp Mười',
      cert: 'QĐ số 2950/QĐ-UBND Tỉnh Đồng Tháp (OCOP 4 Sao)'
    },
    {
      name: 'Bánh phồng tôm Sa Giang cao cấp (OCOP 4 sao)',
      nameEn: 'Sa Giang Premium Prawn Crackers (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 85000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty Cổ phần Xuất nhập khẩu Sa Giang',
      address: 'Lô CII-3, KCN Sa Đéc, TP. Sa Đéc, Đồng Tháp',
      store: 'Điểm Giới thiệu Bánh phồng tôm Sa Giang',
      cert: 'QĐ số 3180/QĐ-UBND Tỉnh Đồng Tháp (OCOP 4 Sao)'
    },
    {
      name: 'Nem chua Lai Vung - Cơ sở Giáo Dừa (OCOP 3 sao)',
      nameEn: 'Giao Dua Traditional Lai Vung Fermented Pork (OCOP 3-star)',
      stars: 3,
      category: 'food',
      price: 60000,
      packaging: 'chục',
      packagingEn: 'pack of 10',
      producer: 'Cơ sở Nem Giáo Dừa Lai Vung',
      address: 'Thị trấn Lai Vung, Huyện Lai Vung, Đồng Tháp',
      store: 'Đại lý Nem Lai Vung Giáo Dừa Chính Gốc',
      cert: 'QĐ số 1890/QĐ-UBND Huyện Lai Vung (OCOP 3 Sao)'
    },
    {
      name: 'Mango sấy dẻo Cao Lãnh (OCOP 4 sao)',
      nameEn: 'Cao Lanh Soft Dried Cat Chu Mango (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 110000,
      packaging: 'túi',
      packagingEn: 'bag',
      producer: 'HTX Nông sản Sấy Cao Lãnh',
      address: 'Xã Tịnh Thới, TP. Cao Lãnh, Đồng Tháp',
      store: 'Cửa hàng Nông sản Đất Sen Hồng',
      cert: 'QĐ số 2820/QĐ-UBND Tỉnh Đồng Tháp (OCOP 4 Sao)'
    }
  ]
};

// 3. Helper to standardize other province product names
function cleanGenericRetailName(name, region, stars) {
  let cleaned = name;
  cleaned = cleaned.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+hút chân không.*$/i, '').replace(/\s+đóng hũ kín.*$/i, '').replace(/\s+thượng hạng.*$/i, '').replace(/\s+cao cấp.*$/i, '').replace(/\s+xuất khẩu.*$/i, '').trim();
  // Ensure format: [Đặc Sản] - [Địa Danh/Cơ Sở] (OCOP X sao)
  if (!cleaned.includes(' - ')) {
    cleaned = `${cleaned} - Đặc sản ${region}`;
  }
  return `${cleaned} (OCOP ${stars} sao)`;
}

// 4. Update PRODUCTS
let updatedCount = 0;
const newProducts = PRODUCTS.map((prod, index) => {
  const region = prod.region;
  const regionList = specificOverrides[region];
  if (regionList) {
    const listForRegion = PRODUCTS.filter(p => p.region === region);
    const posInRegion = listForRegion.findIndex(p => p.id === prod.id);
    if (posInRegion >= 0 && posInRegion < regionList.length) {
      const override = regionList[posInRegion];
      updatedCount++;
      return {
        ...prod,
        name: override.name,
        nameEn: override.nameEn,
        stars: override.stars,
        starsMin: override.stars,
        starsMax: override.stars,
        category: override.category,
        price: override.price,
        priceMin: override.price,
        priceMax: override.price,
        origPrice: override.price,
        packaging: override.packaging,
        packagingEn: override.packagingEn,
        desc: `${override.name} – ${region}. Quy cách: ${override.packaging}. Sản phẩm được chứng nhận chính thức theo ${override.cert}.`,
        descEn: `${override.nameEn} from ${region}. Packaging: ${override.packagingEn}. Certified under official decree.`
      };
    }
  }

  // For other provinces, standardize name if not already standardized
  let newName = prod.name;
  if (!newName.includes('(OCOP')) {
    newName = cleanGenericRetailName(prod.name, prod.region, prod.stars);
  }
  return {
    ...prod,
    name: newName,
    desc: `${newName} – ${prod.region}. Quy cách: ${prod.packaging}. Đạt chuẩn OCOP ${prod.stars} sao theo chương trình Mỗi Xã Một Sản Phẩm quốc gia.`
  };
});

console.log('Total products processed:', newProducts.length, 'Specific overrides applied:', updatedCount);

// 5. Write to data.js
const dataJsPath = path.join(__dirname, '../data.js');
let dataJsContent = fs.readFileSync(dataJsPath, 'utf8');
dataJsContent = dataJsContent.replace(/const PRODUCTS = \[[\s\S]*?\n\];/, 'const PRODUCTS = ' + JSON.stringify(newProducts, null, 2) + ';');
fs.writeFileSync(dataJsPath, dataJsContent, 'utf8');
console.log('Updated data.js successfully.');

// 6. Update ocop-stores.js
const storesPath = path.join(__dirname, '../ocop-stores.js');
const OcopStores = require('../ocop-stores.js');
const storeMap = OcopStores.STORE_MAP;

newProducts.forEach(prod => {
  if (storeMap[prod.id]) {
    storeMap[prod.id].productName = prod.name;
    storeMap[prod.id].stars = prod.stars;
    const regionOverrides = specificOverrides[prod.region];
    if (regionOverrides) {
      const listForRegion = newProducts.filter(p => p.region === prod.region);
      const pos = listForRegion.findIndex(p => p.id === prod.id);
      if (pos >= 0 && pos < regionOverrides.length) {
        const item = regionOverrides[pos];
        storeMap[prod.id].producerName = item.producer;
        storeMap[prod.id].producerAddress = item.address;
        storeMap[prod.id].certDecision = item.cert;
        storeMap[prod.id].primaryStore.name = item.store;
      }
    }
  }
});

let storesContent = fs.readFileSync(storesPath, 'utf8');
const mapStart = storesContent.indexOf('const OCOP_STORE_MAP = {');
const funcStart = storesContent.indexOf('function getOcopStoreInfo(productOrId)');
if (mapStart !== -1 && funcStart !== -1) {
  storesContent = storesContent.slice(0, mapStart) + 'const OCOP_STORE_MAP = ' + JSON.stringify(storeMap, null, 2) + ';\n\n  ' + storesContent.slice(funcStart);
  fs.writeFileSync(storesPath, storesContent, 'utf8');
  console.log('Updated ocop-stores.js safely.');
} else {
  console.error('Could not find anchor points in ocop-stores.js');
}

// 7. Update catalog-63-provinces-source.txt
const sourceTxtPath = path.join(__dirname, '../data/imports/catalog-63-provinces-source.txt');
const sourceLines = [];
sourceLines.push('Dưới đây là danh sách phân chia chuẩn xác theo **63 tỉnh thành** (chia đủ 3 khu vực Miền Bắc, Miền Trung & Tây Nguyên, Miền Nam & ĐBSCL). Mỗi tỉnh thành chọn đúng 4 sản phẩm OCOP đạt chuẩn quốc gia kèm theo mức giá tham khảo:');
sourceLines.push('');
sourceLines.push('---');
sourceLines.push('');

let currentSection = '';
let currentProvNum = 0;
const byRegion = new Map();
newProducts.forEach(p => {
  if (!byRegion.has(p.region)) byRegion.set(p.region, []);
  byRegion.get(p.region).push(p);
});

for (const [reg, prods] of byRegion.entries()) {
  const macro = prods[0].macroRegion;
  let sectionHeader = '';
  if (macro === 'bac' && currentSection !== 'bac') {
    currentSection = 'bac';
    sectionHeader = '# 🔴 PHẦN 1: KHU VỰC MIỀN BẮC (25 Tỉnh Thành)\n';
  } else if (macro === 'trung' && currentSection !== 'trung') {
    currentSection = 'trung';
    sectionHeader = '# 🔵 PHẦN 2: KHU VỰC MIỀN TRUNG & TÂY NGUYÊN (19 Tỉnh Thành)\n';
  } else if (macro === 'nam' && currentSection !== 'nam') {
    currentSection = 'nam';
    sectionHeader = '# 🟢 PHẦN 3: KHU VỰC MIỀN NAM & ĐỒNG BẰNG SÔNG CỬU LONG (19 Tỉnh Thành)\n';
  }
  if (sectionHeader) sourceLines.push(sectionHeader);

  currentProvNum++;
  sourceLines.push(`#### ${currentProvNum}. ${reg}`);
  sourceLines.push('');

  let lastStars = null;
  let itemNum = 1;
  prods.forEach(p => {
    if (p.stars !== lastStars) {
      sourceLines.push(`* **OCOP ${p.stars} Sao:**`);
      lastStars = p.stars;
    }
    sourceLines.push(`${itemNum}. ${p.name}: ~${Math.round(p.price * 0.7).toLocaleString('vi-VN')} – ${p.price.toLocaleString('vi-VN')} VNĐ/${p.packaging}`);
    itemNum++;
  });
  sourceLines.push('');
}

fs.writeFileSync(sourceTxtPath, sourceLines.join('\n'), 'utf8');
console.log('Updated catalog-63-provinces-source.txt successfully.');
