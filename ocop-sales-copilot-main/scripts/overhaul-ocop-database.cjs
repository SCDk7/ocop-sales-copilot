const fs = require('fs');
const path = require('path');

// 1. Load current PRODUCTS
const currentData = require('../data.js');
const PRODUCTS = currentData.PRODUCTS;

// 2. Define specific overrides for core provinces requested by user
const specificOverrides = {
  'Hà Nội': [
    {
      name: 'Gốm sứ tâm linh dòng men rạn cổ Bát Tràng - Công ty TNHH Gốm sứ Quang Vinh (OCOP 5 Sao Quốc gia)',
      nameEn: 'Bat Trang Ancient Crackle Glaze Spiritual Ceramics - Quang Vinh Ceramics (OCOP 5-star)',
      stars: 5,
      category: 'gift',
      price: 2500000,
      packaging: 'bộ',
      packagingEn: 'set',
      producer: 'Công ty TNHH Gốm sứ Quang Vinh',
      address: 'Xóm 1, Làng cổ Bát Tràng, Gia Lâm, Hà Nội',
      store: 'Showroom Gốm sứ Quang Vinh Bát Tràng Tinh Hoa',
      cert: 'QĐ số 3828/QĐ-UBND TP. Hà Nội (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Trà sen Tây Hồ - Công ty TNHH hương trà sạch Quảng An (OCOP 4 Sao)',
      nameEn: 'Tay Ho Lotus Scented Tea - Quang An Clean Tea (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 1800000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty TNHH hương trà sạch Quảng An',
      address: 'Số 12 Ngõ 50 Đặng Thai Mai, P. Quảng An, Tây Hồ, Hà Nội',
      store: 'Không gian Trà sen Tây Hồ Quảng An',
      cert: 'QĐ số 4125/QĐ-UBND TP. Hà Nội (OCOP 4 Sao)'
    },
    {
      name: 'Giò chả Ước Lễ - Cơ sở giò chả truyền thống Ước Lễ, Thanh Oai (OCOP 4 Sao)',
      nameEn: 'Uoc Le Traditional Pork Roll - Uoc Le Thanh Oai (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 250000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'Cơ sở giò chả truyền thống Ước Lễ, Thanh Oai',
      address: 'Làng Ước Lễ, Xã Tân Ước, Huyện Thanh Oai, Hà Nội',
      store: 'Cửa hàng Giò chả Ước Lễ Gia Truyền',
      cert: 'QĐ số 2190/QĐ-UBND TP. Hà Nội (OCOP 4 Sao)'
    },
    {
      name: 'Gạo tẻ thơm Thượng Cốc - HTX Nông nghiệp Thanh Oai (OCOP 3 Sao)',
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
      name: 'Trà / Chè Shan tuyết cổ thụ Tây Côn Lĩnh - HTX Chè Phìn Hồ (OCOP 5 Sao Quốc gia)',
      nameEn: 'Tay Con Linh Ancient Shan Tuyet Tea - Phin Ho Cooperative (OCOP 5-star)',
      stars: 5,
      category: 'tea',
      price: 850000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Chè Phìn Hồ',
      address: 'Xã Thông Nguyên, Huyện Hoàng Su Phì, Hà Giang',
      store: 'Showroom Trà Shan Tuyết Phìn Hồ Tinh Hoa',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Mật ong bạc hà Cao nguyên đá Mèo Vạc - HTX Tuấn Dũng (OCOP 4 Sao)',
      nameEn: 'Meo Vac Stone Plateau Mint Honey - Tuan Dung Cooperative (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 650000,
      packaging: 'lít',
      packagingEn: 'liter',
      producer: 'HTX Tuấn Dũng',
      address: 'Thị trấn Mèo Vạc, Huyện Mèo Vạc, Hà Giang',
      store: 'Điểm giới thiệu Mật ong Bạc hà Tuấn Dũng Mèo Vạc',
      cert: 'QĐ số 2045/QĐ-UBND Tỉnh Hà Giang (OCOP 4 Sao)'
    },
    {
      name: 'Hồng không hạt Quản Bạ (OCOP 3 Sao)',
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
      name: 'Thảo quả khô Vị Xuyên (OCOP 3 Sao)',
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
      name: 'Cà phê bột Arabica Specialty Sơn La - HTX Cà phê Bích Thao Sơn La (OCOP 5 Sao Quốc gia)',
      nameEn: 'Son La Arabica Specialty Powder Coffee - Bich Thao Cooperative (OCOP 5-star)',
      stars: 5,
      category: 'tea',
      price: 450000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'HTX Cà phê Bích Thao Sơn La',
      address: 'Bản Hoàng Văn Thụ, Xã Hua La, TP. Sơn La, Sơn La',
      store: 'Showroom Cà phê Arabica Bích Thao Sơn La',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Chè Shan tuyết Tà Xùa - Bắc Yên (OCOP 4 Sao)',
      nameEn: 'Ta Xua Shan Tuyet Ancient Tea - Bac Yên (OCOP 4-star)',
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
      name: 'Xoài tròn Yên Châu (OCOP 4 Sao)',
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
      name: 'Mận hậu chín sớm Mộc Châu (OCOP 3 Sao)',
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
  'Quảng Nam': [
    {
      name: 'Sâm Ngọc Linh ngâm mật ong rừng - Công ty CP Thương mại & Dược phẩm Quảng Nam (OCOP 5 Sao)',
      nameEn: 'Ngoc Linh Ginseng in Wild Forest Honey - Quang Nam Pharma (OCOP 5-star)',
      stars: 5,
      category: 'gift',
      price: 3800000,
      packaging: 'hũ',
      packagingEn: 'jar',
      producer: 'Công ty CP Thương mại & Dược phẩm Quảng Nam',
      address: 'Số 222 Huỳnh Thúc Kháng, TP. Tam Kỳ, Quảng Nam',
      store: 'Trung tâm Giới thiệu Sâm Ngọc Linh Quảng Nam',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Nước mắm cốt cá cơm Cửa Khe - HTX Nước mắm Cửa Khe (OCOP 4 Sao)',
      nameEn: 'Cua Khe Traditional Anchovy Fish Sauce - Cua Khe Cooperative (OCOP 4-star)',
      stars: 4,
      category: 'spice',
      price: 160000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'HTX Nước mắm Cửa Khe',
      address: 'Thôn Cửa Khe, Xã Bình Dương, Thăng Bình, Quảng Nam',
      store: 'Cửa hàng Nước mắm Truyền thống Cửa Khe',
      cert: 'QĐ số 2640/QĐ-UBND Tỉnh Quảng Nam (OCOP 4 Sao)'
    },
    {
      name: 'Trà nấm lim xanh Tiên Phước (OCOP 4 Sao)',
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
      name: 'Bánh tráng sắn Lộc Đại (OCOP 3 Sao)',
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
  'Lâm Đồng': [
    {
      name: 'Trà Ô long Cầu Đất - Công ty CP Chè Cầu Đất Đà Lạt (OCOP 5 Sao Quốc gia)',
      nameEn: 'Cau Dat Da Lat High Mountain Oolong Tea - Cau Dat Tea JSC (OCOP 5-star)',
      stars: 5,
      category: 'tea',
      price: 650000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty CP Chè Cầu Đất Đà Lạt',
      address: 'Thôn Trường Thọ, Xã Trạm Hành, TP. Đà Lạt, Lâm Đồng',
      store: 'Showroom Trà Cầu Đất Đà Lạt Tinh Hoa',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Hồng treo gió công nghệ Nhật Bản Mộc Nhiên (OCOP 4 Sao)',
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
      name: 'Chuối Laba sấy dẻo Đơn Dương (OCOP 4 Sao)',
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
      name: 'Đông trùng hạ thảo Đà Lạt (OCOP 4 Sao)',
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
  'Đồng Nai': [
    {
      name: 'Bưởi đường lá cam Tân Triều - HTX Nông nghiệp dịch vụ Tân Triều (OCOP 4 Sao)',
      nameEn: 'Tan Trieu Cam Leaf Sugar Pomelo - Tan Trieu Agricultural Cooperative (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 120000,
      packaging: 'kg',
      packagingEn: 'kg',
      producer: 'HTX Nông nghiệp dịch vụ Tân Triều',
      address: 'Xã Tân Bình, Huyện Vĩnh Cửu, Đồng Nai',
      store: 'Điểm giới thiệu Bưởi Tân Triều Chính Gốc',
      cert: 'QĐ số 3120/QĐ-UBND Tỉnh Đồng Nai (OCOP 4 Sao)'
    },
    {
      name: 'Trà khổ qua rừng túi lọc - Công ty TNHH Khổ qua rừng Hiệp Vân, Long Khánh (OCOP 4 Sao)',
      nameEn: 'Hiep Van Forest Bitter Melon Tea Bags - Long Khanh (OCOP 4-star)',
      stars: 4,
      category: 'tea',
      price: 95000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty TNHH Khổ qua rừng Hiệp Vân, Long Khánh',
      address: 'Phường Suối Tre, TP. Long Khánh, Đồng Nai',
      store: 'Showroom Dược liệu Khổ qua rừng Hiệp Vân',
      cert: 'QĐ số 2890/QĐ-UBND Tỉnh Đồng Nai (OCOP 4 Sao)'
    },
    {
      name: 'Hạt điều rang muối - Công ty TNHH MTV Hạt điều Vinahe, Trảng Bom (OCOP 4 Sao)',
      nameEn: 'Vinahe Salt-roasted Cashews - Trang Bom (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 180000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty TNHH MTV Hạt điều Vinahe, Trảng Bom',
      address: 'Xã Quảng Tiến, Huyện Trảng Bom, Đồng Nai',
      store: 'Showroom Hạt điều Vinahe Đồng Nai',
      cert: 'QĐ số 2750/QĐ-UBND Tỉnh Đồng Nai (OCOP 4 Sao)'
    },
    {
      name: 'Chuối sấy cứng Cường Hoa - Cơ sở chế biến nông sản Cường Hoa, Thống Nhất (OCOP 3 Sao)',
      nameEn: 'Cuong Hoa Crispy Dried Bananas - Thong Nhat (OCOP 3-star)',
      stars: 3,
      category: 'snack',
      price: 45000,
      packaging: 'gói',
      packagingEn: 'pack',
      producer: 'Cơ sở chế biến nông sản Cường Hoa, Thống Nhất',
      address: 'Xã Gia Tân 2, Huyện Thống Nhất, Đồng Nai',
      store: 'Đại lý Nông sản sấy Cường Hoa Đồng Nai',
      cert: 'QĐ số 1940/QĐ-UBND Huyện Thống Nhất (OCOP 3 Sao)'
    }
  ],
  'Bến Tre': [
    {
      name: 'Kẹo dừa gừng đậu phộng Tuyết Phụng - Cơ sở sản xuất kẹo dừa Tuyết Phụng (OCOP 4 Sao)',
      nameEn: 'Tuyet Phung Ginger Peanut Coconut Candy - Tuyet Phung Facility (OCOP 4-star)',
      stars: 4,
      category: 'snack',
      price: 75000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Cơ sở sản xuất kẹo dừa Tuyết Phụng',
      address: 'Số 56 Ấp 4, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre',
      store: 'Showroom Kẹo Dừa Tuyết Phụng Mỏ Cày',
      cert: 'QĐ số 2730/QĐ-UBND Tỉnh Bến Tre (OCOP 4 Sao)'
    },
    {
      name: 'Bưởi da xanh Hàm Luông (OCOP 4 Sao)',
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
      name: 'Dầu dừa nguyên chất tinh khiết Bến Tre (OCOP 3 Sao)',
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
      name: 'Nước màu dừa đậm đặc Mỏ Cày Nam (OCOP 3 Sao)',
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
      name: 'Mật dừa nước tinh chất hữu cơ Bình Chánh - Công ty TNHH Phát triển Dừa nước Việt Nam VIETNIPA (OCOP 4 Sao)',
      nameEn: 'VIETNIPA Organic Nipa Palm Nectar Binh Chanh - VIETNIPA (OCOP 4-star)',
      stars: 4,
      category: 'food',
      price: 145000,
      packaging: 'chai',
      packagingEn: 'bottle',
      producer: 'Công ty TNHH Phát triển Dừa nước Việt Nam VIETNIPA',
      address: 'Xã An Phú Tây, Huyện Bình Chánh, TP. Hồ Chí Minh',
      store: 'Showroom Mật dừa nước VIETNIPA Bình Chánh',
      cert: 'QĐ số 3080/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)'
    },
    {
      name: 'Tổ yến chưng đường phèn Cần Giờ (OCOP 4 Sao)',
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
      name: 'Xoài cát Cần Giờ (OCOP 4 Sao)',
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
      name: 'Khô cá dứa một nắng Cần Giờ (OCOP 4 Sao)',
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
    }
  ],
  'Đồng Tháp': [
    {
      name: 'Bánh phồng tôm Sa Giang - Công ty CP Xuất nhập khẩu Sa Giang (OCOP 5 Sao Quốc gia)',
      nameEn: 'Sa Giang Premium Prawn Crackers - Sa Giang Import Export JSC (OCOP 5-star)',
      stars: 5,
      category: 'snack',
      price: 95000,
      packaging: 'hộp',
      packagingEn: 'box',
      producer: 'Công ty CP Xuất nhập khẩu Sa Giang',
      address: 'Lô CII-3, KCN Sa Đéc, TP. Sa Đéc, Đồng Tháp',
      store: 'Showroom Bánh phồng tôm Sa Giang Sa Đéc',
      cert: 'QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)'
    },
    {
      name: 'Hạt sen sấy giòn bơ tỏi Tháp Mười (OCOP 4 Sao)',
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
      name: 'Mango sấy dẻo Cao Lãnh (OCOP 4 Sao)',
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
    },
    {
      name: 'Nem chua Lai Vung - Cơ sở Giáo Dừa (OCOP 3 Sao)',
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
    }
  ]
};

// 3. Helper to standardize other province product names
function cleanGenericRetailName(name, region, stars) {
  let cleaned = name;
  cleaned = cleaned.replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+hút chân không.*$/i, '').replace(/\s+đóng hũ kín.*$/i, '').replace(/\s+thượng hạng.*$/i, '').replace(/\s+cao cấp.*$/i, '').replace(/\s+xuất khẩu.*$/i, '').trim();
  // Ensure format: [Đặc Sản] - [Địa Danh/Cơ Sở] (OCOP X Sao)
  if (!cleaned.includes(' - ')) {
    cleaned = `${cleaned} - Đặc sản ${region}`;
  }
  return `${cleaned} (OCOP ${stars} Sao)`;
}

// 4. Update PRODUCTS
let updatedCount = 0;
const newProducts = PRODUCTS.map((prod) => {
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
