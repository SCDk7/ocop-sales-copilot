// ==============================================================
// OCOP STORES & CERTIFIED OUTLETS DIRECTORY
// Cổng thông tin & Mạng lưới Cửa hàng, Hợp tác xã đạt chuẩn OCOP 63 Tỉnh Thành
// ==============================================================

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OcopStores = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const OCOP_STORE_MAP = {
  "336": {
    "id": 336,
    "productName": "Gốm sứ tâm linh dòng men rạn cổ Bát Tràng - Công ty TNHH Gốm sứ Quang Vinh (OCOP 5 Sao Quốc gia)",
    "stars": 5,
    "region": "Hà Nội",
    "producerName": "Công ty TNHH Gốm sứ Quang Vinh",
    "producerAddress": "Xóm 1, Làng cổ Bát Tràng, Gia Lâm, Hà Nội",
    "certDecision": "QĐ số 3828/QĐ-UBND TP. Hà Nội (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.345.2286",
    "primaryStore": {
      "name": "Showroom Gốm sứ Quang Vinh Bát Tràng Tinh Hoa",
      "address": "176 Quang Trung, P. Quang Trung, Q. Hà Đông, Hà Nội",
      "phone": "098.345.2286",
      "hours": "08:00 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm OCOP Big C Thăng Long",
        "address": "222 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
        "phone": "024.3784.8888"
      },
      {
        "name": "Cửa hàng Nông sản An toàn Hà Nội",
        "address": "Số 10 Trịnh Hoài Đức, Cát Linh, Đống Đa, Hà Nội",
        "phone": "024.3845.6789"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20Tr%C3%A0%20Th%E1%BA%A3o%20D%C6%B0%E1%BB%A3c%20SADU%20176%20Quang%20Trung%2C%20P.%20Quang%20Trung%2C%20Q.%20H%C3%A0%20%C4%90%C3%B4ng%2C%20H%C3%A0%20N%E1%BB%99i"
  },
  "337": {
    "id": 337,
    "productName": "Trà sen Tây Hồ - Công ty TNHH hương trà sạch Quảng An (OCOP 4 Sao)",
    "stars": 4,
    "region": "Hà Nội",
    "producerName": "Công ty TNHH hương trà sạch Quảng An",
    "producerAddress": "Số 12 Ngõ 50 Đặng Thai Mai, P. Quảng An, Tây Hồ, Hà Nội",
    "certDecision": "QĐ số 4125/QĐ-UBND TP. Hà Nội (OCOP 4 Sao)",
    "hotline": "091.234.5678",
    "primaryStore": {
      "name": "Không gian Trà sen Tây Hồ Quảng An",
      "address": "Làng nghề Phùng Xá, Huyện Mỹ Đức, Hà Nội",
      "phone": "091.234.5678",
      "hours": "07:30 - 18:30"
    },
    "outlets": [
      {
        "name": "Trung tâm Giới thiệu OCOP Thủ Đô",
        "address": "489 Hoàng Quốc Việt, Nghĩa Tân, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      },
      {
        "name": "Showroom Làng nghề Hà Nội",
        "address": "Phố cổ Hàng Gai, Hoàn Kiếm, Hà Nội",
        "phone": "024.3928.1122"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kh%C3%B4ng%20gian%20Tr%C6%B0ng%20b%C3%A0y%20T%C6%A1%20t%E1%BA%B1m%20Ph%C3%B9ng%20X%C3%A1%20L%C3%A0ng%20ngh%E1%BB%81%20Ph%C3%B9ng%20X%C3%A1%2C%20Huy%E1%BB%87n%20M%E1%BB%B9%20%C4%90%E1%BB%A9c%2C%20H%C3%A0%20N%E1%BB%99i"
  },
  "338": {
    "id": 338,
    "productName": "Giò chả Ước Lễ - Cơ sở giò chả truyền thống Ước Lễ, Thanh Oai (OCOP 4 Sao)",
    "stars": 4,
    "region": "Hà Nội",
    "producerName": "Cơ sở giò chả truyền thống Ước Lễ, Thanh Oai",
    "producerAddress": "Làng Ước Lễ, Xã Tân Ước, Huyện Thanh Oai, Hà Nội",
    "certDecision": "QĐ số 2190/QĐ-UBND TP. Hà Nội (OCOP 4 Sao)",
    "hotline": "097.654.3210",
    "primaryStore": {
      "name": "Cửa hàng Giò chả Ước Lễ Gia Truyền",
      "address": "Đường Làng Dương Liễu, Hoài Đức, Hà Nội",
      "phone": "097.654.3210",
      "hours": "07:00 - 19:00"
    },
    "outlets": [
      {
        "name": "Điểm OCOP Nông sản Hoài Đức",
        "address": "Khu Đô thị Vân Canh, Hoài Đức, Hà Nội",
        "phone": "090.412.3344"
      },
      {
        "name": "Chuỗi Thực phẩm sạch Bác Tôm",
        "address": "Số 11 Hoa Lư, Lê Đại Hành, Hai Bà Trưng, Hà Nội",
        "phone": "090.512.6688"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=C%E1%BB%ADa%20h%C3%A0ng%20Mi%E1%BA%BFn%20dong%20Minh%20H%E1%BB%93ng%20%C4%90%C6%B0%E1%BB%9Dng%20L%C3%A0ng%20D%C6%B0%C6%A1ng%20Li%E1%BB%85u%2C%20Ho%C3%A0i%20%C4%90%E1%BB%A9c%2C%20H%C3%A0%20N%E1%BB%99i"
  },
  "339": {
    "id": 339,
    "productName": "Gạo tẻ thơm Thượng Cốc - HTX Nông nghiệp Thanh Oai (OCOP 3 Sao)",
    "stars": 3,
    "region": "Hà Nội",
    "producerName": "Hợp tác xã Nông nghiệp Thượng Cốc",
    "producerAddress": "Thôn Thượng Cốc, Xã Hồng Dương, Thanh Oai, Hà Nội",
    "certDecision": "QĐ số 1845/QĐ-UBND Huyện Thanh Oai (OCOP 3 Sao)",
    "hotline": "098.876.5432",
    "primaryStore": {
      "name": "Điểm phân phối Gạo thơm Thượng Cốc",
      "address": "Xóm 3, Làng Tranh Khúc, Duyên Hà, Thanh Trì, Hà Nội",
      "phone": "098.876.5432",
      "hours": "06:00 - 20:00"
    },
    "outlets": [
      {
        "name": "Điểm OCOP Thanh Trì",
        "address": "375 Ngọc Hồi, TT. Văn Điển, Thanh Trì, Hà Nội",
        "phone": "024.3861.5566"
      },
      {
        "name": "Hệ thống Cửa hàng Hapro Mart",
        "address": "Số 102 Hàng Bông, Hàng Bông, Hoàn Kiếm, Hà Nội",
        "phone": "024.3828.5577"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=%C4%90i%E1%BB%83m%20B%C3%A1n%20B%C3%A1nh%20ch%C6%B0ng%20Tranh%20Kh%C3%BAc%20X%C3%B3m%203%2C%20L%C3%A0ng%20Tranh%20Kh%C3%BAc%2C%20Duy%C3%AAn%20H%C3%A0%2C%20Thanh%20Tr%C3%AC%2C%20H%C3%A0%20N%E1%BB%99i"
  },
  "340": {
    "id": 340,
    "productName": "Trà / Chè Shan tuyết cổ thụ Tây Côn Lĩnh - HTX Chè Phìn Hồ (OCOP 5 Sao Quốc gia)",
    "stars": 5,
    "region": "Hà Giang",
    "producerName": "HTX Chè Phìn Hồ",
    "producerAddress": "Xã Thông Nguyên, Huyện Hoàng Su Phì, Hà Giang",
    "certDecision": "QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.243.6688",
    "primaryStore": {
      "name": "Showroom Trà Shan Tuyết Phìn Hồ Tinh Hoa",
      "address": "Thôn Phìn Hồ, Thông Nguyên, Hoàng Su Phì, Hà Giang",
      "phone": "098.243.6688",
      "hours": "07:30 - 20:30"
    },
    "outlets": [
      {
        "name": "Siêu thị OCOP Hà Giang",
        "address": "Số 188 Trần Hưng Đạo, P. Nguyễn Trãi, TP. Hà Giang",
        "phone": "0219.386.6789"
      },
      {
        "name": "Điểm OCOP Hà Giang tại Hà Nội",
        "address": "10 Trịnh Hoài Đức, Đống Đa, Hà Nội",
        "phone": "024.3845.6789"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kh%C3%B4ng%20gian%20Tr%C3%A0%20Ph%C3%ACn%20H%E1%BB%93%20Th%C3%B4n%20Ph%C3%ACn%20H%E1%BB%93%2C%20Th%C3%B4ng%20Nguy%C3%AAn%2C%20Ho%C3%A0ng%20Su%20Ph%C3%AC%2C%20H%C3%A0%20Giang"
  },
  "341": {
    "id": 341,
    "productName": "Mật ong bạc hà Cao nguyên đá Mèo Vạc - HTX Tuấn Dũng (OCOP 4 Sao)",
    "stars": 4,
    "region": "Hà Giang",
    "producerName": "HTX Tuấn Dũng",
    "producerAddress": "Thị trấn Mèo Vạc, Huyện Mèo Vạc, Hà Giang",
    "certDecision": "QĐ số 2045/QĐ-UBND Tỉnh Hà Giang (OCOP 4 Sao)",
    "hotline": "098.243.6688",
    "primaryStore": {
      "name": "Điểm giới thiệu Mật ong Bạc hà Tuấn Dũng Mèo Vạc",
      "address": "Km18, TT. Vinh Quang, Hoàng Su Phì, Hà Giang",
      "phone": "098.243.6688",
      "hours": "07:30 - 20:30"
    },
    "outlets": [
      {
        "name": "Trung tâm Giới thiệu Nông sản Hà Giang",
        "address": "Đường Nguyễn Thái Học, TP. Hà Giang",
        "phone": "0219.388.9911"
      },
      {
        "name": "Showroom OCOP Miền Bắc",
        "address": "489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=C%E1%BB%ADa%20h%C3%A0ng%20H%E1%BB%93ng%20Tr%C3%A0%20C%E1%BB%95%20Th%E1%BB%A5%20Ph%C3%ACn%20H%E1%BB%93%20Km18%2C%20TT.%20Vinh%20Quang%2C%20Ho%C3%A0ng%20Su%20Ph%C3%AC%2C%20H%C3%A0%20Giang"
  },
  "342": {
    "id": 342,
    "productName": "Hồng không hạt Quản Bạ (OCOP 3 Sao)",
    "stars": 3,
    "region": "Hà Giang",
    "producerName": "HTX Nông nghiệp Quản Bạ",
    "producerAddress": "Xã Nghĩa Thuận, Huyện Quản Bạ, Hà Giang",
    "certDecision": "QĐ số 1520/QĐ-UBND Huyện Quản Bạ (OCOP 3 Sao)",
    "hotline": "091.567.8910",
    "primaryStore": {
      "name": "Điểm bán Đặc sản Nông sản Quản Bạ",
      "address": "Tổ 2, TT. Mèo Vạc, Huyện Mèo Vạc, Hà Giang",
      "phone": "091.567.8910",
      "hours": "07:00 - 21:00"
    },
    "outlets": [
      {
        "name": "Cửa hàng Đặc sản Cao nguyên đá Đồng Văn",
        "address": "Khu Phố cổ Đồng Văn, Huyện Đồng Văn, Hà Giang",
        "phone": "0219.385.6677"
      },
      {
        "name": "Cửa hàng OCOP Big C Hà Nội",
        "address": "222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        "phone": "024.3784.8888"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20M%E1%BA%ADt%20ong%20B%E1%BA%A1c%20H%C3%A0%20M%C3%A8o%20V%E1%BA%A1c%20T%E1%BB%95%202%2C%20TT.%20M%C3%A8o%20V%E1%BA%A1c%2C%20Huy%E1%BB%87n%20M%C3%A8o%20V%E1%BA%A1c%2C%20H%C3%A0%20Giang"
  },
  "343": {
    "id": 343,
    "productName": "Thảo quả khô Vị Xuyên (OCOP 3 Sao)",
    "stars": 3,
    "region": "Hà Giang",
    "producerName": "HTX Dược liệu Rừng Vị Xuyên",
    "producerAddress": "Xã Lao Chải, Huyện Vị Xuyên, Hà Giang",
    "certDecision": "QĐ số 1432/QĐ-UBND Huyện Vị Xuyên (OCOP 3 Sao)",
    "hotline": "097.321.4567",
    "primaryStore": {
      "name": "Cửa hàng Nông sản Dược liệu Vị Xuyên",
      "address": "Số 45 đường Lý Tự Trọng, TP. Hà Giang",
      "phone": "097.321.4567",
      "hours": "06:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Siêu thị Nông sản Sạch Hà Giang",
        "address": "Bến xe Hà Giang, TP. Hà Giang",
        "phone": "0219.388.1122"
      },
      {
        "name": "Điểm OCOP Đặc sản Tây Bắc",
        "address": "Số 8 Chùa Bộc, Đống Đa, Hà Nội",
        "phone": "094.223.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=%C4%90i%E1%BB%83m%20B%C3%A1n%20Th%E1%BB%8Bt%20tr%C3%A2u%20G%C3%A1c%20b%E1%BA%BFp%20H%C3%A0%20Giang%20S%E1%BB%91%2045%20%C4%91%C6%B0%E1%BB%9Dng%20L%C3%BD%20T%E1%BB%B1%20Tr%E1%BB%8Dng%2C%20TP.%20H%C3%A0%20Giang"
  },
  "344": {
    "id": 344,
    "productName": "Trà phun sương Actiso Sa Pa - Đặc sản Lào Cai (OCOP 5 sao)",
    "stars": 5,
    "region": "Lào Cai",
    "producerName": "Công ty Cổ phần Traphaco Sa Pa",
    "producerAddress": "Tổ 9, Phường Phan Si Păng, Thị xã Sa Pa, Tỉnh Lào Cai",
    "certDecision": "QĐ số 2550/QĐ-UBND Tỉnh Lào Cai (OCOP 5 Sao Quốc Gia)",
    "hotline": "0214.387.1249",
    "primaryStore": {
      "name": "Trung tâm Giới thiệu Dược liệu Sa Pa",
      "address": "Số 02 Ngũ Chỉ Sơn, TT. Sa Pa, Thị xã Sa Pa, Lào Cai",
      "phone": "0214.387.1249",
      "hours": "07:30 - 21:30"
    },
    "outlets": [
      {
        "name": "Showroom OCOP Lào Cai",
        "address": "Số 05 Hoàng Liên, P. Cốc Lếu, TP. Lào Cai",
        "phone": "0214.382.4567"
      },
      {
        "name": "Hệ thống Nhà thuốc Traphaco Hà Nội",
        "address": "Số 75 Yên Ninh, Ba Đình, Hà Nội",
        "phone": "024.3843.0076"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Trung%20t%C3%A2m%20Gi%E1%BB%9Bi%20thi%E1%BB%87u%20D%C6%B0%E1%BB%A3c%20li%E1%BB%87u%20Sa%20Pa%20S%E1%BB%91%2002%20Ng%C5%A9%20Ch%E1%BB%89%20S%C6%A1n%2C%20TT.%20Sa%20Pa%2C%20Th%E1%BB%8B%20x%C3%A3%20Sa%20Pa%2C%20L%C3%A0o%20Cai"
  },
  "345": {
    "id": 345,
    "productName": "Cao mềm Actiso Sa Pa - Đặc sản Lào Cai (OCOP 5 sao)",
    "stars": 5,
    "region": "Lào Cai",
    "producerName": "Công ty Cổ phần Traphaco Sa Pa",
    "producerAddress": "Tổ 9, Phường Phan Si Păng, Thị xã Sa Pa, Tỉnh Lào Cai",
    "certDecision": "QĐ số 2550/QĐ-UBND Tỉnh Lào Cai (OCOP 5 Sao Quốc Gia)",
    "hotline": "0214.387.1249",
    "primaryStore": {
      "name": "Showroom Cao Atiso Sa Pa",
      "address": "Số 02 Ngũ Chỉ Sơn, TT. Sa Pa, Lào Cai",
      "phone": "0214.387.1249",
      "hours": "07:30 - 21:30"
    },
    "outlets": [
      {
        "name": "Điểm Bán Dược liệu Sa Pa",
        "address": "Đường Cầu Mây, Thị xã Sa Pa, Lào Cai",
        "phone": "0214.387.2288"
      },
      {
        "name": "Điểm OCOP Big C Thăng Long",
        "address": "222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        "phone": "024.3784.8888"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20Cao%20Atiso%20Sa%20Pa%20S%E1%BB%91%2002%20Ng%C5%A9%20Ch%E1%BB%89%20S%C6%A1n%2C%20TT.%20Sa%20Pa%2C%20L%C3%A0o%20Cai"
  },
  "346": {
    "id": 346,
    "productName": "Nấm hương rừng Sa Pa khô - Đặc sản Lào Cai (OCOP 4 sao)",
    "stars": 4,
    "region": "Lào Cai",
    "producerName": "HTX Nông nghiệp Bản địa Sa Pa (Sa Pa OCOP)",
    "producerAddress": "Thôn Tả Chải, Xã Tả Phìn, Thị xã Sa Pa, Tỉnh Lào Cai",
    "certDecision": "QĐ số 2310/QĐ-UBND Tỉnh Lào Cai (OCOP 4 Sao)",
    "hotline": "098.665.4321",
    "primaryStore": {
      "name": "Cửa hàng Nông sản Tả Phìn Sa Pa",
      "address": "Làng Tả Phìn, Thị xã Sa Pa, Lào Cai",
      "phone": "098.665.4321",
      "hours": "07:00 - 19:00"
    },
    "outlets": [
      {
        "name": "Chợ Đêm Du Lịch Sa Pa",
        "address": "Đường Điện Biên Phủ, Thị xã Sa Pa, Lào Cai",
        "phone": "098.665.4321"
      },
      {
        "name": "Cửa hàng Đặc sản Tây Bắc Bác Tôm",
        "address": "Số 11 Hoa Lư, Hai Bà Trưng, Hà Nội",
        "phone": "090.512.6688"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=C%E1%BB%ADa%20h%C3%A0ng%20N%C3%B4ng%20s%E1%BA%A3n%20T%E1%BA%A3%20Ph%C3%ACn%20Sa%20Pa%20L%C3%A0ng%20T%E1%BA%A3%20Ph%C3%ACn%2C%20Th%E1%BB%8B%20x%C3%A3%20Sa%20Pa%2C%20L%C3%A0o%20Cai"
  },
  "347": {
    "id": 347,
    "productName": "Tương ớt Mường Khương - Đặc sản Lào Cai (OCOP 4 sao)",
    "stars": 4,
    "region": "Lào Cai",
    "producerName": "HTX Kinh doanh Nông sản Mường Khương",
    "producerAddress": "Thị trấn Mường Khương, Huyện Mường Khương, Tỉnh Lào Cai",
    "certDecision": "QĐ số 2140/QĐ-UBND Tỉnh Lào Cai (OCOP 4 Sao)",
    "hotline": "091.298.7654",
    "primaryStore": {
      "name": "Điểm Giới thiệu Tương ớt Mường Khương",
      "address": "Khu Phố 1, TT. Mường Khương, Lào Cai",
      "phone": "091.298.7654",
      "hours": "07:00 - 18:30"
    },
    "outlets": [
      {
        "name": "Siêu thị OCOP Lào Cai",
        "address": "Khu Thương mại Cửa khẩu Quốc tế Lào Cai",
        "phone": "0214.383.1199"
      },
      {
        "name": "Trung tâm Xúc tiến Thương mại OCOP Hà Nội",
        "address": "489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=%C4%90i%E1%BB%83m%20Gi%E1%BB%9Bi%20thi%E1%BB%87u%20T%C6%B0%C6%A1ng%20%E1%BB%9Bt%20M%C6%B0%E1%BB%9Dng%20Kh%C6%B0%C6%A1ng%20Khu%20Ph%E1%BB%91%201%2C%20TT.%20M%C6%B0%E1%BB%9Dng%20Kh%C6%B0%C6%A1ng%2C%20L%C3%A0o%20Cai"
  },
  "348": {
    "id": 348,
    "productName": "Chè Shan tuyết Suối Giàng - Đặc sản Yên Bái (OCOP 5 sao)",
    "stars": 5,
    "region": "Yên Bái",
    "producerName": "HTX Trà Suối Giàng",
    "producerAddress": "Xã Suối Giàng, Huyện Văn Chấn, Tỉnh Yên Bái",
    "certDecision": "QĐ số 1980/QĐ-UBND Tỉnh Yên Bái (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.901.2345",
    "primaryStore": {
      "name": "Không gian Văn hóa Trà Suối Giàng",
      "address": "Bản Pang Cáng, Xã Suối Giàng, Văn Chấn, Yên Bái",
      "phone": "098.901.2345",
      "hours": "07:00 - 21:00"
    },
    "outlets": [
      {
        "name": "Showroom OCOP Yên Bái",
        "address": "Số 125 Nguyễn Tất Thành, TP. Yên Bái",
        "phone": "0216.385.2288"
      },
      {
        "name": "Không gian Thưởng Trà Suối Giàng Hà Nội",
        "address": "Số 68 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
        "phone": "024.3773.8822"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kh%C3%B4ng%20gian%20V%C4%83n%20h%C3%B3a%20Tr%C3%A0%20Su%E1%BB%91i%20Gi%C3%A0ng%20B%E1%BA%A3n%20Pang%20C%C3%A1ng%2C%20X%C3%A3%20Su%E1%BB%91i%20Gi%C3%A0ng%2C%20V%C4%83n%20Ch%E1%BA%A5n%2C%20Y%C3%AAn%20B%C3%A1i"
  },
  "349": {
    "id": 349,
    "productName": "Quế ống khô bóc vỏ - Đặc sản Yên Bái (OCOP 5 sao)",
    "stars": 5,
    "region": "Yên Bái",
    "producerName": "HTX Quế Hồi Văn Yên",
    "producerAddress": "Xã Đại Sơn, Huyện Văn Yên, Tỉnh Yên Bái",
    "certDecision": "QĐ số 1950/QĐ-UBND Tỉnh Yên Bái (OCOP 5 Sao)",
    "hotline": "097.456.7890",
    "primaryStore": {
      "name": "Trung tâm Giới thiệu Quế Văn Yên",
      "address": "TT. Mậu A, Huyện Văn Yên, Yên Bái",
      "phone": "097.456.7890",
      "hours": "07:30 - 18:00"
    },
    "outlets": [
      {
        "name": "Cửa hàng OCOP Yên Bái",
        "address": "Bến xe Yên Bái, TP. Yên Bái",
        "phone": "0216.386.1155"
      },
      {
        "name": "Điểm OCOP Big C Thăng Long",
        "address": "222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        "phone": "024.3784.8888"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Trung%20t%C3%A2m%20Gi%E1%BB%9Bi%20thi%E1%BB%87u%20Qu%E1%BA%BF%20V%C4%83n%20Y%C3%AAn%20TT.%20M%E1%BA%ADu%20A%2C%20Huy%E1%BB%87n%20V%C4%83n%20Y%C3%AAn%2C%20Y%C3%AAn%20B%C3%A1i"
  },
  "350": {
    "id": 350,
    "productName": "Mật ong nhãn Văn Chấn - Đặc sản Yên Bái (OCOP 4 sao)",
    "stars": 4,
    "region": "Yên Bái",
    "producerName": "HTX Nuôi ong Nghĩa Lộ - Văn Chấn",
    "producerAddress": "Xã Đồng Khê, Huyện Văn Chấn, Tỉnh Yên Bái",
    "certDecision": "QĐ số 1820/QĐ-UBND Tỉnh Yên Bái (OCOP 4 Sao)",
    "hotline": "091.345.6789",
    "primaryStore": {
      "name": "Điểm Bán Mật ong Nhãn Văn Chấn",
      "address": "QL32, TT. Sơn Thịnh, Văn Chấn, Yên Bái",
      "phone": "091.345.6789",
      "hours": "07:00 - 19:00"
    },
    "outlets": [
      {
        "name": "Cửa hàng Đặc sản Cánh đồng Mường Lò",
        "address": "Phường Trung Tâm, Thị xã Nghĩa Lộ, Yên Bái",
        "phone": "0216.387.0099"
      },
      {
        "name": "Siêu thị OCOP Hà Nội",
        "address": "489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=%C4%90i%E1%BB%83m%20B%C3%A1n%20M%E1%BA%ADt%20ong%20Nh%C3%A3n%20V%C4%83n%20Ch%E1%BA%A5n%20QL32%2C%20TT.%20S%C6%A1n%20Th%E1%BB%8Bnh%2C%20V%C4%83n%20Ch%E1%BA%A5n%2C%20Y%C3%AAn%20B%C3%A1i"
  },
  "351": {
    "id": 351,
    "productName": "Miến đao Giới Phiên - Đặc sản Yên Bái (OCOP 4 sao)",
    "stars": 4,
    "region": "Yên Bái",
    "producerName": "HTX Sản xuất Miến đao Giới Phiên",
    "producerAddress": "Xã Giới Phiên, Thành phố Yên Bái, Tỉnh Yên Bái",
    "certDecision": "QĐ số 1760/QĐ-UBND Tỉnh Yên Bái (OCOP 4 Sao)",
    "hotline": "098.223.3445",
    "primaryStore": {
      "name": "Cơ sở Miến đao Giới Phiên",
      "address": "Thôn Xóm Mới, Xã Giới Phiên, TP. Yên Bái",
      "phone": "098.223.3445",
      "hours": "06:30 - 18:30"
    },
    "outlets": [
      {
        "name": "Chợ Yên Thịnh OCOP",
        "address": "P. Yên Thịnh, TP. Yên Bái",
        "phone": "0216.385.1133"
      },
      {
        "name": "Chuỗi Thực phẩm sạch Hà Nội",
        "address": "Số 10 Trịnh Hoài Đức, Đống Đa, Hà Nội",
        "phone": "024.3845.6789"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=C%C6%A1%20s%E1%BB%9F%20Mi%E1%BA%BFn%20%C4%91ao%20Gi%E1%BB%9Bi%20Phi%C3%AAn%20Th%C3%B4n%20X%C3%B3m%20M%E1%BB%9Bi%2C%20X%C3%A3%20Gi%E1%BB%9Bi%20Phi%C3%AAn%2C%20TP.%20Y%C3%AAn%20B%C3%A1i"
  },
  "352": {
    "id": 352,
    "productName": "Gạo nương Điện Biên thơm đặc sản - Đặc sản Điện Biên (OCOP 5 sao)",
    "stars": 5,
    "region": "Điện Biên",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Điện Biên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Điện Biên",
    "certDecision": "QĐ số 3984/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.764.776",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Điện Biên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Điện Biên",
      "phone": "091.764.776",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Điện Biên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Điện Biên",
        "phone": "091.764.776"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90i%E1%BB%87n%20Bi%C3%AAn"
  },
  "353": {
    "id": 353,
    "productName": "Cà phê Mường Ảng hạt rang - Đặc sản Điện Biên (OCOP 5 sao)",
    "stars": 5,
    "region": "Điện Biên",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Điện Biên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Điện Biên",
    "certDecision": "QĐ số 1001/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.771.789",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Điện Biên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Điện Biên",
      "phone": "092.771.789",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Điện Biên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Điện Biên",
        "phone": "092.771.789"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90i%E1%BB%87n%20Bi%C3%AAn"
  },
  "354": {
    "id": 354,
    "productName": "Thịt trâu sấy gác bếp bản địa - Đặc sản Điện Biên (OCOP 4 sao)",
    "stars": 4,
    "region": "Điện Biên",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Điện Biên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Điện Biên",
    "certDecision": "QĐ số 1642/QĐ-UBND Tỉnh Điện Biên (OCOP 4 Sao)",
    "hotline": "093.778.802",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Điện Biên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Điện Biên",
      "phone": "093.778.802",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Điện Biên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Điện Biên",
        "phone": "093.778.802"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90i%E1%BB%87n%20Bi%C3%AAn"
  },
  "355": {
    "id": 355,
    "productName": "Hạt mắc khén khô - Đặc sản Điện Biên (OCOP 4 sao)",
    "stars": 4,
    "region": "Điện Biên",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Điện Biên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Điện Biên",
    "certDecision": "QĐ số 1665/QĐ-UBND Tỉnh Điện Biên (OCOP 4 Sao)",
    "hotline": "094.785.815",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Điện Biên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Điện Biên",
      "phone": "094.785.815",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Điện Biên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Điện Biên",
        "phone": "094.785.815"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90i%E1%BB%87n%20Bi%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90i%E1%BB%87n%20Bi%C3%AAn"
  },
  "356": {
    "id": 356,
    "productName": "Sâm Lai Châu củ tươi / thái lát sấy khô - Đặc sản Lai Châu (OCOP 5 sao)",
    "stars": 5,
    "region": "Lai Châu",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Lai Châu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lai Châu",
    "certDecision": "QĐ số 1052/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.792.828",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lai Châu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lai Châu",
      "phone": "095.792.828",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lai Châu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lai Châu",
        "phone": "095.792.828"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Lai%20Ch%C3%A2u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Lai%20Ch%C3%A2u"
  },
  "357": {
    "id": 357,
    "productName": "Hạt mắc ca Lai Châu tách hạt sấy khô - Đặc sản Lai Châu (OCOP 5 sao)",
    "stars": 5,
    "region": "Lai Châu",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Lai Châu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lai Châu",
    "certDecision": "QĐ số 1069/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.799.841",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lai Châu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lai Châu",
      "phone": "096.799.841",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lai Châu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lai Châu",
        "phone": "096.799.841"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Lai%20Ch%C3%A2u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Lai%20Ch%C3%A2u"
  },
  "358": {
    "id": 358,
    "productName": "Mật ong rừng nguyên chất Lai Châu - Đặc sản Lai Châu (OCOP 4 sao)",
    "stars": 4,
    "region": "Lai Châu",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Lai Châu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lai Châu",
    "certDecision": "QĐ số 1734/QĐ-UBND Tỉnh Lai Châu (OCOP 4 Sao)",
    "hotline": "097.806.854",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lai Châu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lai Châu",
      "phone": "097.806.854",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lai Châu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lai Châu",
        "phone": "097.806.854"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Lai%20Ch%C3%A2u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Lai%20Ch%C3%A2u"
  },
  "359": {
    "id": 359,
    "productName": "Thịt lợn sấy gác bếp - Đặc sản Lai Châu (OCOP 4 sao)",
    "stars": 4,
    "region": "Lai Châu",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Lai Châu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lai Châu",
    "certDecision": "QĐ số 1757/QĐ-UBND Tỉnh Lai Châu (OCOP 4 Sao)",
    "hotline": "098.813.867",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lai Châu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lai Châu",
      "phone": "098.813.867",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lai Châu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lai Châu",
        "phone": "098.813.867"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Lai%20Ch%C3%A2u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Lai%20Ch%C3%A2u"
  },
  "360": {
    "id": 360,
    "productName": "Cà phê bột Arabica Specialty Sơn La - HTX Cà phê Bích Thao Sơn La (OCOP 5 Sao Quốc gia)",
    "stars": 5,
    "region": "Sơn La",
    "producerName": "HTX Cà phê Bích Thao Sơn La",
    "producerAddress": "Bản Hoàng Văn Thụ, Xã Hua La, TP. Sơn La, Sơn La",
    "certDecision": "QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.820.880",
    "primaryStore": {
      "name": "Showroom Cà phê Arabica Bích Thao Sơn La",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sơn La",
      "phone": "090.820.880",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sơn La",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sơn La",
        "phone": "090.820.880"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C6%A1n%20La%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C6%A1n%20La"
  },
  "361": {
    "id": 361,
    "productName": "Chè Shan tuyết Tà Xùa - Bắc Yên (OCOP 4 Sao)",
    "stars": 4,
    "region": "Sơn La",
    "producerName": "HTX Trà Tà Xùa",
    "producerAddress": "Bản Bẹ, Xã Tà Xùa, Huyện Bắc Yên, Sơn La",
    "certDecision": "QĐ số 2580/QĐ-UBND Tỉnh Sơn La (OCOP 4 Sao)",
    "hotline": "091.827.893",
    "primaryStore": {
      "name": "Điểm giới thiệu Trà cổ thụ Tà Xùa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sơn La",
      "phone": "091.827.893",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sơn La",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sơn La",
        "phone": "091.827.893"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C6%A1n%20La%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C6%A1n%20La"
  },
  "362": {
    "id": 362,
    "productName": "Xoài tròn Yên Châu (OCOP 4 Sao)",
    "stars": 4,
    "region": "Sơn La",
    "producerName": "HTX Nông nghiệp Yên Châu",
    "producerAddress": "Tiểu khu 2, Thị trấn Yên Châu, Sơn La",
    "certDecision": "QĐ số 1930/QĐ-UBND Tỉnh Sơn La (OCOP 4 Sao)",
    "hotline": "092.834.906",
    "primaryStore": {
      "name": "Cửa hàng Nông sản An toàn Yên Châu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sơn La",
      "phone": "092.834.906",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sơn La",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sơn La",
        "phone": "092.834.906"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C6%A1n%20La%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C6%A1n%20La"
  },
  "363": {
    "id": 363,
    "productName": "Mận hậu chín sớm Mộc Châu (OCOP 3 Sao)",
    "stars": 3,
    "region": "Sơn La",
    "producerName": "HTX Nông nghiệp Mộc Châu",
    "producerAddress": "Tiểu khu Pa Khen, Thị trấn Nông trường Mộc Châu, Sơn La",
    "certDecision": "QĐ số 1640/QĐ-UBND Huyện Mộc Châu (OCOP 3 Sao)",
    "hotline": "093.841.919",
    "primaryStore": {
      "name": "Điểm dừng chân Nông sản Mộc Châu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sơn La",
      "phone": "093.841.919",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sơn La",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sơn La",
        "phone": "093.841.919"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C6%A1n%20La%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C6%A1n%20La"
  },
  "364": {
    "id": 364,
    "productName": "Măng chua thái sẵn Kim Bôi - Đặc sản Hòa Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Hòa Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hòa Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hòa Bình",
    "certDecision": "QĐ số 1188/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.848.932",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hòa Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hòa Bình",
      "phone": "094.848.932",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hòa Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hòa Bình",
        "phone": "094.848.932"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%B2a%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%B2a%20B%C3%ACnh"
  },
  "365": {
    "id": 365,
    "productName": "Măng nứa khô nấu ngay - Đặc sản Hòa Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Hòa Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hòa Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hòa Bình",
    "certDecision": "QĐ số 1205/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.855.945",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hòa Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hòa Bình",
      "phone": "095.855.945",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hòa Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hòa Bình",
        "phone": "095.855.945"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%B2a%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%B2a%20B%C3%ACnh"
  },
  "366": {
    "id": 366,
    "productName": "Giảo cổ lam sấy khô - Đặc sản Hòa Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Hòa Bình",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Hòa Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hòa Bình",
    "certDecision": "QĐ số 1918/QĐ-UBND Tỉnh Hòa Bình (OCOP 4 Sao)",
    "hotline": "096.862.958",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hòa Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hòa Bình",
      "phone": "096.862.958",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hòa Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hòa Bình",
        "phone": "096.862.958"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%B2a%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%B2a%20B%C3%ACnh"
  },
  "367": {
    "id": 367,
    "productName": "Mật ong rừng Hòa Bình - Đặc sản Hòa Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Hòa Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hòa Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hòa Bình",
    "certDecision": "QĐ số 1941/QĐ-UBND Tỉnh Hòa Bình (OCOP 4 Sao)",
    "hotline": "097.869.971",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hòa Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hòa Bình",
      "phone": "097.869.971",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hòa Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hòa Bình",
        "phone": "097.869.971"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%B2a%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%B2a%20B%C3%ACnh"
  },
  "368": {
    "id": 368,
    "productName": "Chè Đinh - Đặc sản Phú Thọ (OCOP 5 sao)",
    "stars": 5,
    "region": "Phú Thọ",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Phú Thọ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Thọ",
    "certDecision": "QĐ số 1256/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.876.984",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Thọ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Thọ",
      "phone": "098.876.984",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Thọ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Thọ",
        "phone": "098.876.984"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Th%E1%BB%8D%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Th%E1%BB%8D"
  },
  "369": {
    "id": 369,
    "productName": "Mỳ gạo sạch Hùng Lô - Đặc sản Phú Thọ (OCOP 5 sao)",
    "stars": 5,
    "region": "Phú Thọ",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Phú Thọ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Thọ",
    "certDecision": "QĐ số 1273/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.883.997",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Thọ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Thọ",
      "phone": "090.883.997",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Thọ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Thọ",
        "phone": "090.883.997"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Th%E1%BB%8D%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Th%E1%BB%8D"
  },
  "370": {
    "id": 370,
    "productName": "Thịt chua Thanh Sơn - Đặc sản Phú Thọ (OCOP 4 sao)",
    "stars": 4,
    "region": "Phú Thọ",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Phú Thọ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Thọ",
    "certDecision": "QĐ số 2010/QĐ-UBND Tỉnh Phú Thọ (OCOP 4 Sao)",
    "hotline": "091.890.210",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Thọ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Thọ",
      "phone": "091.890.210",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Thọ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Thọ",
        "phone": "091.890.210"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Th%E1%BB%8D%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Th%E1%BB%8D"
  },
  "371": {
    "id": 371,
    "productName": "Chè búp tím Thanh Ba - Đặc sản Phú Thọ (OCOP 4 sao)",
    "stars": 4,
    "region": "Phú Thọ",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Phú Thọ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Thọ",
    "certDecision": "QĐ số 2033/QĐ-UBND Tỉnh Phú Thọ (OCOP 4 Sao)",
    "hotline": "092.897.223",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Thọ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Thọ",
      "phone": "092.897.223",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Thọ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Thọ",
        "phone": "092.897.223"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Th%E1%BB%8D%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Th%E1%BB%8D"
  },
  "372": {
    "id": 372,
    "productName": "Trà hoa vàng Tam Đảo - Đặc sản Vĩnh Phúc (OCOP 5 sao)",
    "stars": 5,
    "region": "Vĩnh Phúc",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Vĩnh Phúc",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Phúc",
    "certDecision": "QĐ số 1324/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.904.236",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Phúc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Phúc",
      "phone": "093.904.236",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Phúc",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Phúc",
        "phone": "093.904.236"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Ph%C3%BAc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Ph%C3%BAc"
  },
  "373": {
    "id": 373,
    "productName": "Cao gắm Tam Đảo hỗ trợ xương khớp - Đặc sản Vĩnh Phúc (OCOP 5 sao)",
    "stars": 5,
    "region": "Vĩnh Phúc",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Vĩnh Phúc",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Phúc",
    "certDecision": "QĐ số 1341/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.911.249",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Phúc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Phúc",
      "phone": "094.911.249",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Phúc",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Phúc",
        "phone": "094.911.249"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Ph%C3%BAc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Ph%C3%BAc"
  },
  "374": {
    "id": 374,
    "productName": "Mật ong Tam Đảo - Đặc sản Vĩnh Phúc (OCOP 4 sao)",
    "stars": 4,
    "region": "Vĩnh Phúc",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Vĩnh Phúc",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Phúc",
    "certDecision": "QĐ số 2102/QĐ-UBND Tỉnh Vĩnh Phúc (OCOP 4 Sao)",
    "hotline": "095.918.262",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Phúc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Phúc",
      "phone": "095.918.262",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Phúc",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Phúc",
        "phone": "095.918.262"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Ph%C3%BAc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Ph%C3%BAc"
  },
  "375": {
    "id": 375,
    "productName": "Trà đinh lăng sấy khô - Đặc sản Vĩnh Phúc (OCOP 4 sao)",
    "stars": 4,
    "region": "Vĩnh Phúc",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Vĩnh Phúc",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Phúc",
    "certDecision": "QĐ số 2125/QĐ-UBND Tỉnh Vĩnh Phúc (OCOP 4 Sao)",
    "hotline": "096.925.275",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Phúc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Phúc",
      "phone": "096.925.275",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Phúc",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Phúc",
        "phone": "096.925.275"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Ph%C3%BAc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Ph%C3%BAc"
  },
  "376": {
    "id": 376,
    "productName": "Chè tôm nõn Hảo Đạt - Đặc sản Thái Nguyên (OCOP 5 sao)",
    "stars": 5,
    "region": "Thái Nguyên",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Thái Nguyên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Nguyên",
    "certDecision": "QĐ số 1392/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.932.288",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Nguyên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Nguyên",
      "phone": "097.932.288",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Nguyên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Nguyên",
        "phone": "097.932.288"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20Nguy%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20Nguy%C3%AAn"
  },
  "377": {
    "id": 377,
    "productName": "Miến Việt Cường - Đặc sản Thái Nguyên (OCOP 5 sao)",
    "stars": 5,
    "region": "Thái Nguyên",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Thái Nguyên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Nguyên",
    "certDecision": "QĐ số 1409/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.939.301",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Nguyên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Nguyên",
      "phone": "098.939.301",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Nguyên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Nguyên",
        "phone": "098.939.301"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20Nguy%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20Nguy%C3%AAn"
  },
  "378": {
    "id": 378,
    "productName": "Cao chè vằng Thái Nguyên - Đặc sản Thái Nguyên (OCOP 4 sao)",
    "stars": 4,
    "region": "Thái Nguyên",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Thái Nguyên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Nguyên",
    "certDecision": "QĐ số 2194/QĐ-UBND Tỉnh Thái Nguyên (OCOP 4 Sao)",
    "hotline": "090.946.314",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Nguyên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Nguyên",
      "phone": "090.946.314",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Nguyên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Nguyên",
        "phone": "090.946.314"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20Nguy%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20Nguy%C3%AAn"
  },
  "379": {
    "id": 379,
    "productName": "Bánh chưng bờ Đậu - Đặc sản Thái Nguyên (OCOP 4 sao)",
    "stars": 4,
    "region": "Thái Nguyên",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Thái Nguyên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Nguyên",
    "certDecision": "QĐ số 2217/QĐ-UBND Tỉnh Thái Nguyên (OCOP 4 Sao)",
    "hotline": "091.953.327",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Nguyên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Nguyên",
      "phone": "091.953.327",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Nguyên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Nguyên",
        "phone": "091.953.327"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20Nguy%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20Nguy%C3%AAn"
  },
  "380": {
    "id": 380,
    "productName": "Miến dong Tài Hoan - Đặc sản Bắc Kạn (OCOP 5 sao)",
    "stars": 5,
    "region": "Bắc Kạn",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bắc Kạn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Kạn",
    "certDecision": "QĐ số 1460/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.960.340",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Kạn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Kạn",
      "phone": "092.960.340",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Kạn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Kạn",
        "phone": "092.960.340"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20K%E1%BA%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20K%E1%BA%A1n"
  },
  "381": {
    "id": 381,
    "productName": "Nano Curcumin Bắc Hà - Đặc sản Bắc Kạn (OCOP 5 sao)",
    "stars": 5,
    "region": "Bắc Kạn",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Bắc Kạn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Kạn",
    "certDecision": "QĐ số 1477/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.967.353",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Kạn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Kạn",
      "phone": "093.967.353",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Kạn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Kạn",
        "phone": "093.967.353"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20K%E1%BA%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20K%E1%BA%A1n"
  },
  "382": {
    "id": 382,
    "productName": "Tinh bột nghệ vàng Bắc Kạn - Đặc sản Bắc Kạn (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Kạn",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bắc Kạn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Kạn",
    "certDecision": "QĐ số 2286/QĐ-UBND Tỉnh Bắc Kạn (OCOP 4 Sao)",
    "hotline": "094.974.366",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Kạn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Kạn",
      "phone": "094.974.366",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Kạn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Kạn",
        "phone": "094.974.366"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20K%E1%BA%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20K%E1%BA%A1n"
  },
  "383": {
    "id": 383,
    "productName": "Trà mướp đắng rừng - Đặc sản Bắc Kạn (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Kạn",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Bắc Kạn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Kạn",
    "certDecision": "QĐ số 2309/QĐ-UBND Tỉnh Bắc Kạn (OCOP 4 Sao)",
    "hotline": "095.981.379",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Kạn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Kạn",
      "phone": "095.981.379",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Kạn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Kạn",
        "phone": "095.981.379"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20K%E1%BA%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20K%E1%BA%A1n"
  },
  "384": {
    "id": 384,
    "productName": "Vải thiều lục ngạn sấy khô - HTX Hồng Xuân (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Giang",
    "producerName": "HTX Nông nghiệp Hồng Xuân",
    "producerAddress": "Xã Quý Sơn, Huyện Lục Ngạn, Bắc Giang",
    "certDecision": "QĐ số 2890/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)",
    "hotline": "096.988.392",
    "primaryStore": {
      "name": "Showroom Vải thiều Lục Ngạn Hồng Xuân",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Giang",
      "phone": "096.988.392",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Giang",
        "phone": "096.988.392"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Giang"
  },
  "385": {
    "id": 385,
    "productName": "Mỳ Chũ đặc biệt Thủ Dương (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Giang",
    "producerName": "HTX Mỳ Chũ Thủ Dương",
    "producerAddress": "Làng Thủ Dương, Xã Nam Dương, Lục Ngạn, Bắc Giang",
    "certDecision": "QĐ số 2140/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)",
    "hotline": "097.995.405",
    "primaryStore": {
      "name": "Cửa hàng Giới thiệu Mỳ Chũ Nam Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Giang",
      "phone": "097.995.405",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Giang",
        "phone": "097.995.405"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Giang"
  },
  "386": {
    "id": 386,
    "productName": "Chè xanh Bản Ven (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Giang",
    "producerName": "HTX Thân Trường Bản Ven",
    "producerAddress": "Bản Ven, Xã Xuân Lương, Huyện Yên Thế, Bắc Giang",
    "certDecision": "QĐ số 2315/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)",
    "hotline": "098.102.418",
    "primaryStore": {
      "name": "Không gian Văn hóa Trà Bản Ven",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Giang",
      "phone": "098.102.418",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Giang",
        "phone": "098.102.418"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Giang"
  },
  "387": {
    "id": 387,
    "productName": "Rượu Làng Vân - Cơ sở chưng cất truyền thống Vân Hà (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Giang",
    "producerName": "Cơ sở sản xuất Rượu Làng Vân",
    "producerAddress": "Làng Vân, Xã Vân Hà, Thị xã Việt Yên, Bắc Giang",
    "certDecision": "QĐ số 1980/QĐ-UBND Tỉnh Bắc Giang (OCOP 4 Sao)",
    "hotline": "090.109.431",
    "primaryStore": {
      "name": "Điểm giới thiệu Rượu Làng Vân Chính Hiệu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Giang",
      "phone": "090.109.431",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Giang",
        "phone": "090.109.431"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Giang"
  },
  "388": {
    "id": 388,
    "productName": "Miến dong Bình Liêu - Đặc sản Quảng Ninh (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Ninh",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ninh",
    "certDecision": "QĐ số 1596/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.116.444",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ninh",
      "phone": "091.116.444",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ninh",
        "phone": "091.116.444"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ninh"
  },
  "389": {
    "id": 389,
    "productName": "Bộ lọ hoa men chảy Gốm sứ Quang Vinh - Đặc sản Quảng Ninh (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Ninh",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Quảng Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ninh",
    "certDecision": "QĐ số 1613/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.123.457",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ninh",
      "phone": "092.123.457",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ninh",
        "phone": "092.123.457"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ninh"
  },
  "390": {
    "id": 390,
    "productName": "Chả mực Hạ Long - Đặc sản Quảng Ninh (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Ninh",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ninh",
    "certDecision": "QĐ số 2470/QĐ-UBND Tỉnh Quảng Ninh (OCOP 4 Sao)",
    "hotline": "093.130.470",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ninh",
      "phone": "093.130.470",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ninh",
        "phone": "093.130.470"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ninh"
  },
  "391": {
    "id": 391,
    "productName": "Trà hoa vàng Ba Chẽ khô - Đặc sản Quảng Ninh (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Ninh",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Quảng Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ninh",
    "certDecision": "QĐ số 2493/QĐ-UBND Tỉnh Quảng Ninh (OCOP 4 Sao)",
    "hotline": "094.137.483",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ninh",
      "phone": "094.137.483",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ninh",
        "phone": "094.137.483"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ninh"
  },
  "392": {
    "id": 392,
    "productName": "Nước mắm Cát Hải đặc biệt - Đặc sản Hải Phòng (OCOP 5 sao)",
    "stars": 5,
    "region": "Hải Phòng",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Hải Phòng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Phòng",
    "certDecision": "QĐ số 1664/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.144.496",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Phòng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Phòng",
      "phone": "095.144.496",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Phòng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Phòng",
        "phone": "095.144.496"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20Ph%C3%B2ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20Ph%C3%B2ng"
  },
  "393": {
    "id": 393,
    "productName": "Hải sản khô - Đặc sản Hải Phòng (OCOP 5 sao)",
    "stars": 5,
    "region": "Hải Phòng",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hải Phòng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Phòng",
    "certDecision": "QĐ số 1681/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.151.509",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Phòng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Phòng",
      "phone": "096.151.509",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Phòng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Phòng",
        "phone": "096.151.509"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20Ph%C3%B2ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20Ph%C3%B2ng"
  },
  "394": {
    "id": 394,
    "productName": "Bánh đa cua khô Hải Phòng - Đặc sản Hải Phòng (OCOP 4 sao)",
    "stars": 4,
    "region": "Hải Phòng",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hải Phòng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Phòng",
    "certDecision": "QĐ số 2562/QĐ-UBND Tỉnh Hải Phòng (OCOP 4 Sao)",
    "hotline": "097.158.522",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Phòng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Phòng",
      "phone": "097.158.522",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Phòng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Phòng",
        "phone": "097.158.522"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20Ph%C3%B2ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20Ph%C3%B2ng"
  },
  "395": {
    "id": 395,
    "productName": "Mật ong rừng Cát Bà - Đặc sản Hải Phòng (OCOP 4 sao)",
    "stars": 4,
    "region": "Hải Phòng",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hải Phòng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Phòng",
    "certDecision": "QĐ số 2585/QĐ-UBND Tỉnh Hải Phòng (OCOP 4 Sao)",
    "hotline": "098.165.535",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Phòng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Phòng",
      "phone": "098.165.535",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Phòng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Phòng",
        "phone": "098.165.535"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20Ph%C3%B2ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20Ph%C3%B2ng"
  },
  "396": {
    "id": 396,
    "productName": "Bình hút lộc / Bình giọt ngọc Gốm Chu Đậu - Đặc sản Hải Dương (OCOP 5 sao)",
    "stars": 5,
    "region": "Hải Dương",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Hải Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Dương",
    "certDecision": "QĐ số 1732/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.172.548",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Dương",
      "phone": "090.172.548",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Dương",
        "phone": "090.172.548"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng"
  },
  "397": {
    "id": 397,
    "productName": "Bánh đậu xanh Rồng Vàng Hoàng Gia - Đặc sản Hải Dương (OCOP 5 sao)",
    "stars": 5,
    "region": "Hải Dương",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hải Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Dương",
    "certDecision": "QĐ số 1749/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.179.561",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Dương",
      "phone": "091.179.561",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Dương",
        "phone": "091.179.561"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng"
  },
  "398": {
    "id": 398,
    "productName": "Bánh gai Ninh Giang - Đặc sản Hải Dương (OCOP 4 sao)",
    "stars": 4,
    "region": "Hải Dương",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hải Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Dương",
    "certDecision": "QĐ số 2654/QĐ-UBND Tỉnh Hải Dương (OCOP 4 Sao)",
    "hotline": "092.186.574",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Dương",
      "phone": "092.186.574",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Dương",
        "phone": "092.186.574"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng"
  },
  "399": {
    "id": 399,
    "productName": "Tỏi đen Chí Linh - Đặc sản Hải Dương (OCOP 4 sao)",
    "stars": 4,
    "region": "Hải Dương",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hải Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Dương",
    "certDecision": "QĐ số 2677/QĐ-UBND Tỉnh Hải Dương (OCOP 4 Sao)",
    "hotline": "093.193.587",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hải Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hải Dương",
      "phone": "093.193.587",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hải Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hải Dương",
        "phone": "093.193.587"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%A3i%20D%C6%B0%C6%A1ng"
  },
  "400": {
    "id": 400,
    "productName": "Long nhãn lồng Hưng Yên - Đặc sản Hưng Yên (OCOP 5 sao)",
    "stars": 5,
    "region": "Hưng Yên",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hưng Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hưng Yên",
    "certDecision": "QĐ số 1800/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.200.600",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hưng Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hưng Yên",
      "phone": "094.200.600",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hưng Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hưng Yên",
        "phone": "094.200.600"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C6%B0ng%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C6%B0ng%20Y%C3%AAn"
  },
  "401": {
    "id": 401,
    "productName": "Hạt sen sấy khô nguyên vị Hưng Yên - Đặc sản Hưng Yên (OCOP 5 sao)",
    "stars": 5,
    "region": "Hưng Yên",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hưng Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hưng Yên",
    "certDecision": "QĐ số 1817/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.207.613",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hưng Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hưng Yên",
      "phone": "095.207.613",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hưng Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hưng Yên",
        "phone": "095.207.613"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C6%B0ng%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C6%B0ng%20Y%C3%AAn"
  },
  "402": {
    "id": 402,
    "productName": "Tinh bột nghệ đỏ Hưng Yên - Đặc sản Hưng Yên (OCOP 4 sao)",
    "stars": 4,
    "region": "Hưng Yên",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Hưng Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hưng Yên",
    "certDecision": "QĐ số 2746/QĐ-UBND Tỉnh Hưng Yên (OCOP 4 Sao)",
    "hotline": "096.214.626",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hưng Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hưng Yên",
      "phone": "096.214.626",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hưng Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hưng Yên",
        "phone": "096.214.626"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C6%B0ng%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C6%B0ng%20Y%C3%AAn"
  },
  "403": {
    "id": 403,
    "productName": "Tương Bần Hưng Yên đóng chai - Đặc sản Hưng Yên (OCOP 4 sao)",
    "stars": 4,
    "region": "Hưng Yên",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Hưng Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hưng Yên",
    "certDecision": "QĐ số 2769/QĐ-UBND Tỉnh Hưng Yên (OCOP 4 Sao)",
    "hotline": "097.221.639",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hưng Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hưng Yên",
      "phone": "097.221.639",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hưng Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hưng Yên",
        "phone": "097.221.639"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C6%B0ng%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C6%B0ng%20Y%C3%AAn"
  },
  "404": {
    "id": 404,
    "productName": "Gạo hữu cơ chất lượng cao Thái Bình - Đặc sản Thái Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Thái Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Thái Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Bình",
    "certDecision": "QĐ số 1868/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.228.652",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Bình",
      "phone": "098.228.652",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Bình",
        "phone": "098.228.652"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20B%C3%ACnh"
  },
  "405": {
    "id": 405,
    "productName": "Rượu nếp cái hoa vàng Kiến Xương - Đặc sản Thái Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Thái Bình",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Thái Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Bình",
    "certDecision": "QĐ số 1885/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.235.665",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Bình",
      "phone": "090.235.665",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Bình",
        "phone": "090.235.665"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20B%C3%ACnh"
  },
  "406": {
    "id": 406,
    "productName": "Bánh cáy làng Nguyễn - Đặc sản Thái Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Thái Bình",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Thái Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Bình",
    "certDecision": "QĐ số 2838/QĐ-UBND Tỉnh Thái Bình (OCOP 4 Sao)",
    "hotline": "091.242.678",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Bình",
      "phone": "091.242.678",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Bình",
        "phone": "091.242.678"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20B%C3%ACnh"
  },
  "407": {
    "id": 407,
    "productName": "Trà hoa hòe sấy khô - Đặc sản Thái Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Thái Bình",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Thái Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thái Bình",
    "certDecision": "QĐ số 2861/QĐ-UBND Tỉnh Thái Bình (OCOP 4 Sao)",
    "hotline": "092.249.691",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thái Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thái Bình",
      "phone": "092.249.691",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thái Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thái Bình",
        "phone": "092.249.691"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A1i%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%C3%A1i%20B%C3%ACnh"
  },
  "408": {
    "id": 408,
    "productName": "Gạo sinh thái ruộng rươi Toản Xuân - Đặc sản Nam Định (OCOP 5 sao)",
    "stars": 5,
    "region": "Nam Định",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Nam Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nam Định",
    "certDecision": "QĐ số 1936/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.256.704",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nam Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nam Định",
      "phone": "093.256.704",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nam Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nam Định",
        "phone": "093.256.704"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Nam%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Nam%20%C4%90%E1%BB%8Bnh"
  },
  "409": {
    "id": 409,
    "productName": "Gạo sạch chất lượng cao Toản Xuân 999 - Đặc sản Nam Định (OCOP 5 sao)",
    "stars": 5,
    "region": "Nam Định",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Nam Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nam Định",
    "certDecision": "QĐ số 1953/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.263.717",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nam Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nam Định",
      "phone": "094.263.717",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nam Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nam Định",
        "phone": "094.263.717"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Nam%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Nam%20%C4%90%E1%BB%8Bnh"
  },
  "410": {
    "id": 410,
    "productName": "Bánh nhãn Hải Hậu - Đặc sản Nam Định (OCOP 4 sao)",
    "stars": 4,
    "region": "Nam Định",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Nam Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nam Định",
    "certDecision": "QĐ số 2930/QĐ-UBND Tỉnh Nam Định (OCOP 4 Sao)",
    "hotline": "095.270.730",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nam Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nam Định",
      "phone": "095.270.730",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nam Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nam Định",
        "phone": "095.270.730"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Nam%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Nam%20%C4%90%E1%BB%8Bnh"
  },
  "411": {
    "id": 411,
    "productName": "Kẹo sìu châu Nam Định - Đặc sản Nam Định (OCOP 4 sao)",
    "stars": 4,
    "region": "Nam Định",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Nam Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nam Định",
    "certDecision": "QĐ số 2953/QĐ-UBND Tỉnh Nam Định (OCOP 4 Sao)",
    "hotline": "096.277.743",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nam Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nam Định",
      "phone": "096.277.743",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nam Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nam Định",
        "phone": "096.277.743"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Nam%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Nam%20%C4%90%E1%BB%8Bnh"
  },
  "412": {
    "id": 412,
    "productName": "Cơm cháy Ninh Bình - Đặc sản Ninh Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Ninh Bình",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Ninh Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Bình",
    "certDecision": "QĐ số 2004/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.284.756",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Bình",
      "phone": "097.284.756",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Bình",
        "phone": "097.284.756"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20B%C3%ACnh"
  },
  "413": {
    "id": 413,
    "productName": "Rượu nếp Kim Sơn hảo hạng - Đặc sản Ninh Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Ninh Bình",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Ninh Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Bình",
    "certDecision": "QĐ số 2021/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.291.769",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Bình",
      "phone": "098.291.769",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Bình",
        "phone": "098.291.769"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20B%C3%ACnh"
  },
  "414": {
    "id": 414,
    "productName": "Mắm tép Gia Viễn - Đặc sản Ninh Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Ninh Bình",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Ninh Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Bình",
    "certDecision": "QĐ số 3022/QĐ-UBND Tỉnh Ninh Bình (OCOP 4 Sao)",
    "hotline": "090.298.782",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Bình",
      "phone": "090.298.782",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Bình",
        "phone": "090.298.782"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20B%C3%ACnh"
  },
  "415": {
    "id": 415,
    "productName": "Hoa cúc chi sấy khô Ninh Bình - Đặc sản Ninh Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Ninh Bình",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Ninh Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Bình",
    "certDecision": "QĐ số 3045/QĐ-UBND Tỉnh Ninh Bình (OCOP 4 Sao)",
    "hotline": "091.305.795",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Bình",
      "phone": "091.305.795",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Bình",
        "phone": "091.305.795"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20B%C3%ACnh"
  },
  "416": {
    "id": 416,
    "productName": "Chuối ngự Đại Hoàng đặc sản tuyển chọn - Đặc sản Hà Nam (OCOP 5 sao)",
    "stars": 5,
    "region": "Hà Nam",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hà Nam",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Nam",
    "certDecision": "QĐ số 2072/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.312.808",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Nam",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Nam",
      "phone": "092.312.808",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Nam",
        "phone": "092.312.808"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20Nam"
  },
  "417": {
    "id": 417,
    "productName": "Bột sắn dây nguyên chất - Đặc sản Hà Nam (OCOP 5 sao)",
    "stars": 5,
    "region": "Hà Nam",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Hà Nam",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Nam",
    "certDecision": "QĐ số 2089/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.319.821",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Nam",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Nam",
      "phone": "093.319.821",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Nam",
        "phone": "093.319.821"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20Nam"
  },
  "418": {
    "id": 418,
    "productName": "Kẹo lạc Duy Tiên - Đặc sản Hà Nam (OCOP 4 sao)",
    "stars": 4,
    "region": "Hà Nam",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hà Nam",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Nam",
    "certDecision": "QĐ số 3114/QĐ-UBND Tỉnh Hà Nam (OCOP 4 Sao)",
    "hotline": "094.326.834",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Nam",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Nam",
      "phone": "094.326.834",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Nam",
        "phone": "094.326.834"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20Nam"
  },
  "419": {
    "id": 419,
    "productName": "Bánh đa nem Chợ Sí - Đặc sản Hà Nam (OCOP 4 sao)",
    "stars": 4,
    "region": "Hà Nam",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hà Nam",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Nam",
    "certDecision": "QĐ số 3137/QĐ-UBND Tỉnh Hà Nam (OCOP 4 Sao)",
    "hotline": "095.333.847",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Nam",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Nam",
      "phone": "095.333.847",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Nam",
        "phone": "095.333.847"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20Nam"
  },
  "420": {
    "id": 420,
    "productName": "Hoa hồi khô nguyên bông Lạng Sơn - Đặc sản Lạng Sơn (OCOP 5 sao)",
    "stars": 5,
    "region": "Lạng Sơn",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Lạng Sơn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lạng Sơn",
    "certDecision": "QĐ số 2140/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.340.860",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lạng Sơn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lạng Sơn",
      "phone": "096.340.860",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lạng Sơn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lạng Sơn",
        "phone": "096.340.860"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%E1%BA%A1ng%20S%C6%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%E1%BA%A1ng%20S%C6%A1n"
  },
  "421": {
    "id": 421,
    "productName": "Tinh dầu hồi Lạng Sơn nguyên chất - Đặc sản Lạng Sơn (OCOP 5 sao)",
    "stars": 5,
    "region": "Lạng Sơn",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Lạng Sơn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lạng Sơn",
    "certDecision": "QĐ số 2157/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.347.873",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lạng Sơn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lạng Sơn",
      "phone": "097.347.873",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lạng Sơn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lạng Sơn",
        "phone": "097.347.873"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%E1%BA%A1ng%20S%C6%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%E1%BA%A1ng%20S%C6%A1n"
  },
  "422": {
    "id": 422,
    "productName": "Thịt quay giòn bì Lạng Sơn - Đặc sản Lạng Sơn (OCOP 4 sao)",
    "stars": 4,
    "region": "Lạng Sơn",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Lạng Sơn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lạng Sơn",
    "certDecision": "QĐ số 3206/QĐ-UBND Tỉnh Lạng Sơn (OCOP 4 Sao)",
    "hotline": "098.354.886",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lạng Sơn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lạng Sơn",
      "phone": "098.354.886",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lạng Sơn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lạng Sơn",
        "phone": "098.354.886"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%E1%BA%A1ng%20S%C6%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%E1%BA%A1ng%20S%C6%A1n"
  },
  "423": {
    "id": 423,
    "productName": "Mạch nha Lạng Sơn - Đặc sản Lạng Sơn (OCOP 4 sao)",
    "stars": 4,
    "region": "Lạng Sơn",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Lạng Sơn",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Lạng Sơn",
    "certDecision": "QĐ số 3229/QĐ-UBND Tỉnh Lạng Sơn (OCOP 4 Sao)",
    "hotline": "090.361.899",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Lạng Sơn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lạng Sơn",
      "phone": "090.361.899",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lạng Sơn",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lạng Sơn",
        "phone": "090.361.899"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%E1%BA%A1ng%20S%C6%A1n%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%E1%BA%A1ng%20S%C6%A1n"
  },
  "424": {
    "id": 424,
    "productName": "Hạt dẻ Trùng Khánh loại 1 tuyển chọn - Đặc sản Cao Bằng (OCOP 5 sao)",
    "stars": 5,
    "region": "Cao Bằng",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Cao Bằng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cao Bằng",
    "certDecision": "QĐ số 2208/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.368.912",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cao Bằng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cao Bằng",
      "phone": "091.368.912",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cao Bằng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cao Bằng",
        "phone": "091.368.912"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Cao%20B%E1%BA%B1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Cao%20B%E1%BA%B1ng"
  },
  "425": {
    "id": 425,
    "productName": "Miến dong Trà Lĩnh - Đặc sản Cao Bằng (OCOP 5 sao)",
    "stars": 5,
    "region": "Cao Bằng",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Cao Bằng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cao Bằng",
    "certDecision": "QĐ số 2225/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.375.925",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cao Bằng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cao Bằng",
      "phone": "092.375.925",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cao Bằng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cao Bằng",
        "phone": "092.375.925"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Cao%20B%E1%BA%B1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Cao%20B%E1%BA%B1ng"
  },
  "426": {
    "id": 426,
    "productName": "Bánh khảo Cao Bằng - Đặc sản Cao Bằng (OCOP 4 sao)",
    "stars": 4,
    "region": "Cao Bằng",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Cao Bằng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cao Bằng",
    "certDecision": "QĐ số 3298/QĐ-UBND Tỉnh Cao Bằng (OCOP 4 Sao)",
    "hotline": "093.382.938",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cao Bằng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cao Bằng",
      "phone": "093.382.938",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cao Bằng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cao Bằng",
        "phone": "093.382.938"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Cao%20B%E1%BA%B1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Cao%20B%E1%BA%B1ng"
  },
  "427": {
    "id": 427,
    "productName": "Thịt lợn xông khói Cao Bằng - Đặc sản Cao Bằng (OCOP 4 sao)",
    "stars": 4,
    "region": "Cao Bằng",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Cao Bằng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cao Bằng",
    "certDecision": "QĐ số 3321/QĐ-UBND Tỉnh Cao Bằng (OCOP 4 Sao)",
    "hotline": "094.389.951",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cao Bằng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cao Bằng",
      "phone": "094.389.951",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cao Bằng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cao Bằng",
        "phone": "094.389.951"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Cao%20B%E1%BA%B1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Cao%20B%E1%BA%B1ng"
  },
  "428": {
    "id": 428,
    "productName": "Rượu làng Hòa Tiến - Đặc sản Bắc Ninh (OCOP 5 sao)",
    "stars": 5,
    "region": "Bắc Ninh",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Bắc Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Ninh",
    "certDecision": "QĐ số 2276/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.396.964",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Ninh",
      "phone": "095.396.964",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Ninh",
        "phone": "095.396.964"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Ninh"
  },
  "429": {
    "id": 429,
    "productName": "Tranh dân tộc Hồ - Đặc sản Bắc Ninh (OCOP 5 sao)",
    "stars": 5,
    "region": "Bắc Ninh",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Bắc Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Ninh",
    "certDecision": "QĐ số 2293/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.403.977",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Ninh",
      "phone": "096.403.977",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Ninh",
        "phone": "096.403.977"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Ninh"
  },
  "430": {
    "id": 430,
    "productName": "Bánh phu thê Đình Bảng - Đặc sản Bắc Ninh (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Ninh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bắc Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Ninh",
    "certDecision": "QĐ số 3390/QĐ-UBND Tỉnh Bắc Ninh (OCOP 4 Sao)",
    "hotline": "097.410.990",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Ninh",
      "phone": "097.410.990",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Ninh",
        "phone": "097.410.990"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Ninh"
  },
  "431": {
    "id": 431,
    "productName": "Nem Bùi Từ Sơn - Đặc sản Bắc Ninh (OCOP 4 sao)",
    "stars": 4,
    "region": "Bắc Ninh",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bắc Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bắc Ninh",
    "certDecision": "QĐ số 3413/QĐ-UBND Tỉnh Bắc Ninh (OCOP 4 Sao)",
    "hotline": "098.417.203",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bắc Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bắc Ninh",
      "phone": "098.417.203",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bắc Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bắc Ninh",
        "phone": "098.417.203"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%AFc%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%AFc%20Ninh"
  },
  "432": {
    "id": 432,
    "productName": "Chè Shan tuyết Na Hang hảo hạng - Đặc sản Tuyên Quang (OCOP 5 sao)",
    "stars": 5,
    "region": "Tuyên Quang",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Tuyên Quang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tuyên Quang",
    "certDecision": "QĐ số 2344/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.424.216",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tuyên Quang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tuyên Quang",
      "phone": "090.424.216",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tuyên Quang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tuyên Quang",
        "phone": "090.424.216"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tuy%C3%AAn%20Quang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tuy%C3%AAn%20Quang"
  },
  "433": {
    "id": 433,
    "productName": "Mật ong phong mật Na Hang nguyên chất - Đặc sản Tuyên Quang (OCOP 5 sao)",
    "stars": 5,
    "region": "Tuyên Quang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Tuyên Quang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tuyên Quang",
    "certDecision": "QĐ số 2361/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.431.229",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tuyên Quang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tuyên Quang",
      "phone": "091.431.229",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tuyên Quang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tuyên Quang",
        "phone": "091.431.229"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tuy%C3%AAn%20Quang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tuy%C3%AAn%20Quang"
  },
  "434": {
    "id": 434,
    "productName": "Miến dong Minh Hương - Đặc sản Tuyên Quang (OCOP 4 sao)",
    "stars": 4,
    "region": "Tuyên Quang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Tuyên Quang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tuyên Quang",
    "certDecision": "QĐ số 3482/QĐ-UBND Tỉnh Tuyên Quang (OCOP 4 Sao)",
    "hotline": "092.438.242",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tuyên Quang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tuyên Quang",
      "phone": "092.438.242",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tuyên Quang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tuyên Quang",
        "phone": "092.438.242"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tuy%C3%AAn%20Quang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tuy%C3%AAn%20Quang"
  },
  "435": {
    "id": 435,
    "productName": "Thịt trâu khô gác bếp Chiêm Hóa - Đặc sản Tuyên Quang (OCOP 4 sao)",
    "stars": 4,
    "region": "Tuyên Quang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Tuyên Quang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tuyên Quang",
    "certDecision": "QĐ số 1005/QĐ-UBND Tỉnh Tuyên Quang (OCOP 4 Sao)",
    "hotline": "093.445.255",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tuyên Quang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tuyên Quang",
      "phone": "093.445.255",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tuyên Quang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tuyên Quang",
        "phone": "093.445.255"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tuy%C3%AAn%20Quang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tuy%C3%AAn%20Quang"
  },
  "436": {
    "id": 436,
    "productName": "Nước mắm Lê Gia cốt đặc biệt - Đặc sản Thanh Hóa (OCOP 5 sao)",
    "stars": 5,
    "region": "Thanh Hóa",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Thanh Hóa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thanh Hóa",
    "certDecision": "QĐ số 2412/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.452.268",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thanh Hóa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thanh Hóa",
      "phone": "094.452.268",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thanh Hóa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thanh Hóa",
        "phone": "094.452.268"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Thanh%20H%C3%B3a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Thanh%20H%C3%B3a"
  },
  "437": {
    "id": 437,
    "productName": "Mắm tôm Lê Gia - Đặc sản Thanh Hóa (OCOP 5 sao)",
    "stars": 5,
    "region": "Thanh Hóa",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Thanh Hóa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thanh Hóa",
    "certDecision": "QĐ số 2429/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.459.281",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thanh Hóa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thanh Hóa",
      "phone": "095.459.281",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thanh Hóa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thanh Hóa",
        "phone": "095.459.281"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Thanh%20H%C3%B3a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Thanh%20H%C3%B3a"
  },
  "438": {
    "id": 438,
    "productName": "Nem chua Thanh Hóa - Đặc sản Thanh Hóa (OCOP 4 sao)",
    "stars": 4,
    "region": "Thanh Hóa",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Thanh Hóa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thanh Hóa",
    "certDecision": "QĐ số 1074/QĐ-UBND Tỉnh Thanh Hóa (OCOP 4 Sao)",
    "hotline": "096.466.294",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thanh Hóa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thanh Hóa",
      "phone": "096.466.294",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thanh Hóa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thanh Hóa",
        "phone": "096.466.294"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Thanh%20H%C3%B3a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Thanh%20H%C3%B3a"
  },
  "439": {
    "id": 439,
    "productName": "Bánh gai Tứ Trụ - Đặc sản Thanh Hóa (OCOP 4 sao)",
    "stars": 4,
    "region": "Thanh Hóa",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Thanh Hóa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Thanh Hóa",
    "certDecision": "QĐ số 1097/QĐ-UBND Tỉnh Thanh Hóa (OCOP 4 Sao)",
    "hotline": "097.473.307",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Thanh Hóa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thanh Hóa",
      "phone": "097.473.307",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thanh Hóa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thanh Hóa",
        "phone": "097.473.307"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Thanh%20H%C3%B3a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Thanh%20H%C3%B3a"
  },
  "440": {
    "id": 440,
    "productName": "Bộ đèn tre Đức Phong - Đặc sản Nghệ An (OCOP 5 sao)",
    "stars": 5,
    "region": "Nghệ An",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Nghệ An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nghệ An",
    "certDecision": "QĐ số 2480/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.480.320",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nghệ An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nghệ An",
      "phone": "098.480.320",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nghệ An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nghệ An",
        "phone": "098.480.320"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ngh%E1%BB%87%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ngh%E1%BB%87%20An"
  },
  "441": {
    "id": 441,
    "productName": "Nước mắm Vạn Phần - Đặc sản Nghệ An (OCOP 5 sao)",
    "stars": 5,
    "region": "Nghệ An",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Nghệ An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nghệ An",
    "certDecision": "QĐ số 2497/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.487.333",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nghệ An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nghệ An",
      "phone": "090.487.333",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nghệ An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nghệ An",
        "phone": "090.487.333"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ngh%E1%BB%87%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ngh%E1%BB%87%20An"
  },
  "442": {
    "id": 442,
    "productName": "Tương Nam Đàn đóng chai - Đặc sản Nghệ An (OCOP 4 sao)",
    "stars": 4,
    "region": "Nghệ An",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Nghệ An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nghệ An",
    "certDecision": "QĐ số 1166/QĐ-UBND Tỉnh Nghệ An (OCOP 4 Sao)",
    "hotline": "091.494.346",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nghệ An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nghệ An",
      "phone": "091.494.346",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nghệ An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nghệ An",
        "phone": "091.494.346"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ngh%E1%BB%87%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ngh%E1%BB%87%20An"
  },
  "443": {
    "id": 443,
    "productName": "Tinh bột nghệ Nghệ An - Đặc sản Nghệ An (OCOP 4 sao)",
    "stars": 4,
    "region": "Nghệ An",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Nghệ An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Nghệ An",
    "certDecision": "QĐ số 1189/QĐ-UBND Tỉnh Nghệ An (OCOP 4 Sao)",
    "hotline": "092.501.359",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Nghệ An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Nghệ An",
      "phone": "092.501.359",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Nghệ An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Nghệ An",
        "phone": "092.501.359"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ngh%E1%BB%87%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ngh%E1%BB%87%20An"
  },
  "444": {
    "id": 444,
    "productName": "Kẹo cu đơ Thư Sơn - Đặc sản Hà Tĩnh (OCOP 5 sao)",
    "stars": 5,
    "region": "Hà Tĩnh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hà Tĩnh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Tĩnh",
    "certDecision": "QĐ số 2548/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.508.372",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Tĩnh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Tĩnh",
      "phone": "093.508.372",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Tĩnh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Tĩnh",
        "phone": "093.508.372"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20T%C4%A9nh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20T%C4%A9nh"
  },
  "445": {
    "id": 445,
    "productName": "Mật ong rừng Vũ Quang nguyên chất - Đặc sản Hà Tĩnh (OCOP 5 sao)",
    "stars": 5,
    "region": "Hà Tĩnh",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hà Tĩnh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Tĩnh",
    "certDecision": "QĐ số 2565/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.515.385",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Tĩnh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Tĩnh",
      "phone": "094.515.385",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Tĩnh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Tĩnh",
        "phone": "094.515.385"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20T%C4%A9nh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20T%C4%A9nh"
  },
  "446": {
    "id": 446,
    "productName": "Bánh đa dừa Độc Lập - Đặc sản Hà Tĩnh (OCOP 4 sao)",
    "stars": 4,
    "region": "Hà Tĩnh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hà Tĩnh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Tĩnh",
    "certDecision": "QĐ số 1258/QĐ-UBND Tỉnh Hà Tĩnh (OCOP 4 Sao)",
    "hotline": "095.522.398",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Tĩnh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Tĩnh",
      "phone": "095.522.398",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Tĩnh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Tĩnh",
        "phone": "095.522.398"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20T%C4%A9nh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20T%C4%A9nh"
  },
  "447": {
    "id": 447,
    "productName": "Hải sản khô Kỳ Anh - Đặc sản Hà Tĩnh (OCOP 4 sao)",
    "stars": 4,
    "region": "Hà Tĩnh",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hà Tĩnh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hà Tĩnh",
    "certDecision": "QĐ số 1281/QĐ-UBND Tỉnh Hà Tĩnh (OCOP 4 Sao)",
    "hotline": "096.529.411",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hà Tĩnh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hà Tĩnh",
      "phone": "096.529.411",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hà Tĩnh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hà Tĩnh",
        "phone": "096.529.411"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%C3%A0%20T%C4%A9nh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%C3%A0%20T%C4%A9nh"
  },
  "448": {
    "id": 448,
    "productName": "Đũa gỗ Quảng Thủy - Đặc sản Quảng Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Bình",
    "certDecision": "QĐ số 2616/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.536.424",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Bình",
      "phone": "097.536.424",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Bình",
        "phone": "097.536.424"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20B%C3%ACnh"
  },
  "449": {
    "id": 449,
    "productName": "Mật ong rừng Lệ Thủy - Đặc sản Quảng Bình (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Bình",
    "certDecision": "QĐ số 2633/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.543.437",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Bình",
      "phone": "098.543.437",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Bình",
        "phone": "098.543.437"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20B%C3%ACnh"
  },
  "450": {
    "id": 450,
    "productName": "Khoai dẻo Quảng Bình - Đặc sản Quảng Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Bình",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Bình",
    "certDecision": "QĐ số 1350/QĐ-UBND Tỉnh Quảng Bình (OCOP 4 Sao)",
    "hotline": "090.550.450",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Bình",
      "phone": "090.550.450",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Bình",
        "phone": "090.550.450"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20B%C3%ACnh"
  },
  "451": {
    "id": 451,
    "productName": "Nước mắm Bảo Ninh - Đặc sản Quảng Bình (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Bình",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Quảng Bình",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Bình",
    "certDecision": "QĐ số 1373/QĐ-UBND Tỉnh Quảng Bình (OCOP 4 Sao)",
    "hotline": "091.557.463",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Bình",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Bình",
      "phone": "091.557.463",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Bình",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Bình",
        "phone": "091.557.463"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20B%C3%ACnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20B%C3%ACnh"
  },
  "452": {
    "id": 452,
    "productName": "Gạo hữu cơ Quảng Trị - Đặc sản Quảng Trị (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Trị",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Trị",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Trị",
    "certDecision": "QĐ số 2684/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.564.476",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Trị",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Trị",
      "phone": "092.564.476",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Trị",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Trị",
        "phone": "092.564.476"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B"
  },
  "453": {
    "id": 453,
    "productName": "Tiêu đen hữu cơ Cam Lộ - Đặc sản Quảng Trị (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Trị",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Quảng Trị",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Trị",
    "certDecision": "QĐ số 2701/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.571.489",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Trị",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Trị",
      "phone": "093.571.489",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Trị",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Trị",
        "phone": "093.571.489"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B"
  },
  "454": {
    "id": 454,
    "productName": "Tinh dầu nén Quảng Trị - Đặc sản Quảng Trị (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Trị",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Quảng Trị",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Trị",
    "certDecision": "QĐ số 1442/QĐ-UBND Tỉnh Quảng Trị (OCOP 4 Sao)",
    "hotline": "094.578.502",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Trị",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Trị",
      "phone": "094.578.502",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Trị",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Trị",
        "phone": "094.578.502"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B"
  },
  "455": {
    "id": 455,
    "productName": "Cao gắm thảo dược - Đặc sản Quảng Trị (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Trị",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Quảng Trị",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Trị",
    "certDecision": "QĐ số 1465/QĐ-UBND Tỉnh Quảng Trị (OCOP 4 Sao)",
    "hotline": "095.585.515",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Trị",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Trị",
      "phone": "095.585.515",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Trị",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Trị",
        "phone": "095.585.515"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Tr%E1%BB%8B"
  },
  "456": {
    "id": 456,
    "productName": "Tinh dầu tràm Huế - Cơ sở Hoa Nén (OCOP 4 sao)",
    "stars": 4,
    "region": "Thừa Thiên Huế",
    "producerName": "Công ty TNHH MTV Sản xuất Tinh dầu Hoa Nén",
    "producerAddress": "Thôn Đông Lâm, Xã Phong An, Huyện Phong Điền, Thừa Thiên Huế",
    "certDecision": "QĐ số 2980/QĐ-UBND Tỉnh Thừa Thiên Huế (OCOP 4 Sao)",
    "hotline": "096.592.528",
    "primaryStore": {
      "name": "Showroom Tinh dầu Tràm Hoa Nén Huế",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thừa Thiên Huế",
      "phone": "096.592.528",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thừa Thiên Huế",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thừa Thiên Huế",
        "phone": "096.592.528"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF"
  },
  "457": {
    "id": 457,
    "productName": "Trà sâm tiến vua xứ Huế (OCOP 4 sao)",
    "stars": 4,
    "region": "Thừa Thiên Huế",
    "producerName": "Công ty Cung đình Thượng uyển Huế",
    "producerAddress": "Đường Nguyễn Huệ, TP. Huế, Thừa Thiên Huế",
    "certDecision": "QĐ số 2750/QĐ-UBND Tỉnh Thừa Thiên Huế (OCOP 4 Sao)",
    "hotline": "097.599.541",
    "primaryStore": {
      "name": "Trà đình Hoàng gia Cố Đô",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thừa Thiên Huế",
      "phone": "097.599.541",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thừa Thiên Huế",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thừa Thiên Huế",
        "phone": "097.599.541"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF"
  },
  "458": {
    "id": 458,
    "productName": "Hạt sen khô tịnh tâm Đại Nội (OCOP 3 sao)",
    "stars": 3,
    "region": "Thừa Thiên Huế",
    "producerName": "HTX Nông nghiệp Hạt sen Tịnh Tâm",
    "producerAddress": "Hồ Tịnh Tâm, P. Thuận Thành, TP. Huế, Thừa Thiên Huế",
    "certDecision": "QĐ số 1820/QĐ-UBND TP. Huế (OCOP 3 Sao)",
    "hotline": "098.606.554",
    "primaryStore": {
      "name": "Đại lý Sen Huế Tịnh Tâm Cố Đô",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thừa Thiên Huế",
      "phone": "098.606.554",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thừa Thiên Huế",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thừa Thiên Huế",
        "phone": "098.606.554"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF"
  },
  "459": {
    "id": 459,
    "productName": "Tôm chua Huế đầm phá Tam Giang - Cơ sở truyền thống (OCOP 4 sao)",
    "stars": 4,
    "region": "Thừa Thiên Huế",
    "producerName": "Cơ sở Tôm chua Tam Giang Cố Đô",
    "producerAddress": "Thị trấn Thuận An, Huyện Phú Vang, Thừa Thiên Huế",
    "certDecision": "QĐ số 2310/QĐ-UBND Tỉnh Thừa Thiên Huế (OCOP 4 Sao)",
    "hotline": "090.613.567",
    "primaryStore": {
      "name": "Đặc sản Tôm chua Huế Truyền thống",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thừa Thiên Huế",
      "phone": "090.613.567",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thừa Thiên Huế",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thừa Thiên Huế",
        "phone": "090.613.567"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%ABa%20Thi%C3%AAn%20Hu%E1%BA%BF"
  },
  "460": {
    "id": 460,
    "productName": "Nước mắm Nam Ô nhĩ đặc biệt - Đặc sản Đà Nẵng (OCOP 5 sao)",
    "stars": 5,
    "region": "Đà Nẵng",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Đà Nẵng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đà Nẵng",
    "certDecision": "QĐ số 2820/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.620.580",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đà Nẵng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đà Nẵng",
      "phone": "091.620.580",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đà Nẵng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đà Nẵng",
        "phone": "091.620.580"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%C3%A0%20N%E1%BA%B5ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%C3%A0%20N%E1%BA%B5ng"
  },
  "461": {
    "id": 461,
    "productName": "Đồ thủ công mỹ nghệ đá non Ngũ Hành Sơn - Đặc sản Đà Nẵng (OCOP 5 sao)",
    "stars": 5,
    "region": "Đà Nẵng",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Đà Nẵng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đà Nẵng",
    "certDecision": "QĐ số 2837/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.627.593",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đà Nẵng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đà Nẵng",
      "phone": "092.627.593",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đà Nẵng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đà Nẵng",
        "phone": "092.627.593"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%C3%A0%20N%E1%BA%B5ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%C3%A0%20N%E1%BA%B5ng"
  },
  "462": {
    "id": 462,
    "productName": "Chả bò Đà Nẵng - Đặc sản Đà Nẵng (OCOP 4 sao)",
    "stars": 4,
    "region": "Đà Nẵng",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Đà Nẵng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đà Nẵng",
    "certDecision": "QĐ số 1626/QĐ-UBND Tỉnh Đà Nẵng (OCOP 4 Sao)",
    "hotline": "093.634.606",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đà Nẵng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đà Nẵng",
      "phone": "093.634.606",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đà Nẵng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đà Nẵng",
        "phone": "093.634.606"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%C3%A0%20N%E1%BA%B5ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%C3%A0%20N%E1%BA%B5ng"
  },
  "463": {
    "id": 463,
    "productName": "Bánh khô mè Cẩm Lệ - Đặc sản Đà Nẵng (OCOP 4 sao)",
    "stars": 4,
    "region": "Đà Nẵng",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Đà Nẵng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đà Nẵng",
    "certDecision": "QĐ số 1649/QĐ-UBND Tỉnh Đà Nẵng (OCOP 4 Sao)",
    "hotline": "094.641.619",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đà Nẵng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đà Nẵng",
      "phone": "094.641.619",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đà Nẵng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đà Nẵng",
        "phone": "094.641.619"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%C3%A0%20N%E1%BA%B5ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%C3%A0%20N%E1%BA%B5ng"
  },
  "464": {
    "id": 464,
    "productName": "Sâm Ngọc Linh ngâm mật ong rừng - Công ty CP Thương mại & Dược phẩm Quảng Nam (OCOP 5 Sao)",
    "stars": 5,
    "region": "Quảng Nam",
    "producerName": "Công ty CP Thương mại & Dược phẩm Quảng Nam",
    "producerAddress": "Số 222 Huỳnh Thúc Kháng, TP. Tam Kỳ, Quảng Nam",
    "certDecision": "QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.648.632",
    "primaryStore": {
      "name": "Trung tâm Giới thiệu Sâm Ngọc Linh Quảng Nam",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Nam",
      "phone": "095.648.632",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Nam",
        "phone": "095.648.632"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Nam"
  },
  "465": {
    "id": 465,
    "productName": "Nước mắm cốt cá cơm Cửa Khe - HTX Nước mắm Cửa Khe (OCOP 4 Sao)",
    "stars": 4,
    "region": "Quảng Nam",
    "producerName": "HTX Nước mắm Cửa Khe",
    "producerAddress": "Thôn Cửa Khe, Xã Bình Dương, Thăng Bình, Quảng Nam",
    "certDecision": "QĐ số 2640/QĐ-UBND Tỉnh Quảng Nam (OCOP 4 Sao)",
    "hotline": "096.655.645",
    "primaryStore": {
      "name": "Cửa hàng Nước mắm Truyền thống Cửa Khe",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Nam",
      "phone": "096.655.645",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Nam",
        "phone": "096.655.645"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Nam"
  },
  "466": {
    "id": 466,
    "productName": "Trà nấm lim xanh Tiên Phước (OCOP 4 Sao)",
    "stars": 4,
    "region": "Quảng Nam",
    "producerName": "HTX Nấm lim xanh Tiên Phước",
    "producerAddress": "Xã Tiên Hiệp, Huyện Tiên Phước, Quảng Nam",
    "certDecision": "QĐ số 2480/QĐ-UBND Tỉnh Quảng Nam (OCOP 4 Sao)",
    "hotline": "097.662.658",
    "primaryStore": {
      "name": "Điểm phân phối Nấm lim xanh Tiên Phước",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Nam",
      "phone": "097.662.658",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Nam",
        "phone": "097.662.658"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Nam"
  },
  "467": {
    "id": 467,
    "productName": "Bánh tráng sắn Lộc Đại (OCOP 3 Sao)",
    "stars": 3,
    "region": "Quảng Nam",
    "producerName": "HTX Nông nghiệp Lộc Đại",
    "producerAddress": "Xã Quế Hiệp, Huyện Quế Sơn, Quảng Nam",
    "certDecision": "QĐ số 1750/QĐ-UBND Huyện Quế Sơn (OCOP 3 Sao)",
    "hotline": "098.669.671",
    "primaryStore": {
      "name": "Điểm bán Đặc sản Bánh tráng sắn Quế Sơn",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Nam",
      "phone": "098.669.671",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Nam",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Nam",
        "phone": "098.669.671"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Nam%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Nam"
  },
  "468": {
    "id": 468,
    "productName": "Tỏi Lý Sơn chính hãng - Đặc sản Quảng Ngãi (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Ngãi",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Quảng Ngãi",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ngãi",
    "certDecision": "QĐ số 2956/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.676.684",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ngãi",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ngãi",
      "phone": "090.676.684",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ngãi",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ngãi",
        "phone": "090.676.684"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ng%C3%A3i%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ng%C3%A3i"
  },
  "469": {
    "id": 469,
    "productName": "Mạch nha Quảng Ngãi đường Mantoza - Đặc sản Quảng Ngãi (OCOP 5 sao)",
    "stars": 5,
    "region": "Quảng Ngãi",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Quảng Ngãi",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ngãi",
    "certDecision": "QĐ số 2973/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.683.697",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ngãi",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ngãi",
      "phone": "091.683.697",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ngãi",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ngãi",
        "phone": "091.683.697"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ng%C3%A3i%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ng%C3%A3i"
  },
  "470": {
    "id": 470,
    "productName": "Đường phèn, đường phổi Quảng Ngãi - Đặc sản Quảng Ngãi (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Ngãi",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Quảng Ngãi",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ngãi",
    "certDecision": "QĐ số 1810/QĐ-UBND Tỉnh Quảng Ngãi (OCOP 4 Sao)",
    "hotline": "092.690.710",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ngãi",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ngãi",
      "phone": "092.690.710",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ngãi",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ngãi",
        "phone": "092.690.710"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ng%C3%A3i%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ng%C3%A3i"
  },
  "471": {
    "id": 471,
    "productName": "Cá bống sông Trà rim khô - Đặc sản Quảng Ngãi (OCOP 4 sao)",
    "stars": 4,
    "region": "Quảng Ngãi",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Quảng Ngãi",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Quảng Ngãi",
    "certDecision": "QĐ số 1833/QĐ-UBND Tỉnh Quảng Ngãi (OCOP 4 Sao)",
    "hotline": "093.697.723",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Quảng Ngãi",
      "address": "Đại lộ Trung tâm Hành chính, TP. Quảng Ngãi",
      "phone": "093.697.723",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Quảng Ngãi",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Quảng Ngãi",
        "phone": "093.697.723"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Qu%E1%BA%A3ng%20Ng%C3%A3i%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Qu%E1%BA%A3ng%20Ng%C3%A3i"
  },
  "472": {
    "id": 472,
    "productName": "Bánh tráng gạo mè Dalop đặc biệt M4 - Đặc sản Bình Định (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Định",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bình Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Định",
    "certDecision": "QĐ số 3024/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.704.736",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Định",
      "phone": "094.704.736",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Định",
        "phone": "094.704.736"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh"
  },
  "473": {
    "id": 473,
    "productName": "Rượu bầu đá truyền thống - Đặc sản Bình Định (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Định",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Bình Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Định",
    "certDecision": "QĐ số 3041/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.711.749",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Định",
      "phone": "095.711.749",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Định",
        "phone": "095.711.749"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh"
  },
  "474": {
    "id": 474,
    "productName": "Bánh tráng dừa Tam Quan - Đặc sản Bình Định (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Định",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bình Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Định",
    "certDecision": "QĐ số 1902/QĐ-UBND Tỉnh Bình Định (OCOP 4 Sao)",
    "hotline": "096.718.762",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Định",
      "phone": "096.718.762",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Định",
        "phone": "096.718.762"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh"
  },
  "475": {
    "id": 475,
    "productName": "Nem chợ Huyện - Đặc sản Bình Định (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Định",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bình Định",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Định",
    "certDecision": "QĐ số 1925/QĐ-UBND Tỉnh Bình Định (OCOP 4 Sao)",
    "hotline": "097.725.775",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Định",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Định",
      "phone": "097.725.775",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Định",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Định",
        "phone": "097.725.775"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh"
  },
  "476": {
    "id": 476,
    "productName": "Bò một nắng hai sương Sơn Hòa - Đặc sản Phú Yên (OCOP 5 sao)",
    "stars": 5,
    "region": "Phú Yên",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Phú Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Yên",
    "certDecision": "QĐ số 3092/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.732.788",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Yên",
      "phone": "098.732.788",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Yên",
        "phone": "098.732.788"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Y%C3%AAn"
  },
  "477": {
    "id": 477,
    "productName": "Hạt đười ươi bay khô nguyên chất - Đặc sản Phú Yên (OCOP 5 sao)",
    "stars": 5,
    "region": "Phú Yên",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Phú Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Yên",
    "certDecision": "QĐ số 3109/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.739.801",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Yên",
      "phone": "090.739.801",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Yên",
        "phone": "090.739.801"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Y%C3%AAn"
  },
  "478": {
    "id": 478,
    "productName": "Bánh tráng Hòa Đa - Đặc sản Phú Yên (OCOP 4 sao)",
    "stars": 4,
    "region": "Phú Yên",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Phú Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Yên",
    "certDecision": "QĐ số 1994/QĐ-UBND Tỉnh Phú Yên (OCOP 4 Sao)",
    "hotline": "091.746.814",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Yên",
      "phone": "091.746.814",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Yên",
        "phone": "091.746.814"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Y%C3%AAn"
  },
  "479": {
    "id": 479,
    "productName": "Cà phê rang xay nguyên chất Phú Yên - Đặc sản Phú Yên (OCOP 4 sao)",
    "stars": 4,
    "region": "Phú Yên",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Phú Yên",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Phú Yên",
    "certDecision": "QĐ số 2017/QĐ-UBND Tỉnh Phú Yên (OCOP 4 Sao)",
    "hotline": "092.753.827",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Phú Yên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Phú Yên",
      "phone": "092.753.827",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Phú Yên",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Phú Yên",
        "phone": "092.753.827"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ph%C3%BA%20Y%C3%AAn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ph%C3%BA%20Y%C3%AAn"
  },
  "480": {
    "id": 480,
    "productName": "Yến sào Khánh Hòa tinh chế - Đặc sản Khánh Hòa (OCOP 5 sao)",
    "stars": 5,
    "region": "Khánh Hòa",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Khánh Hòa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Khánh Hòa",
    "certDecision": "QĐ số 3160/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.760.840",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Khánh Hòa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Khánh Hòa",
      "phone": "093.760.840",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Khánh Hòa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Khánh Hòa",
        "phone": "093.760.840"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kh%C3%A1nh%20H%C3%B2a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kh%C3%A1nh%20H%C3%B2a"
  },
  "481": {
    "id": 481,
    "productName": "Rong biển sấy khô Nha Trang giòn nguyên vị - Đặc sản Khánh Hòa (OCOP 5 sao)",
    "stars": 5,
    "region": "Khánh Hòa",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Khánh Hòa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Khánh Hòa",
    "certDecision": "QĐ số 3177/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.767.853",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Khánh Hòa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Khánh Hòa",
      "phone": "094.767.853",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Khánh Hòa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Khánh Hòa",
        "phone": "094.767.853"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kh%C3%A1nh%20H%C3%B2a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kh%C3%A1nh%20H%C3%B2a"
  },
  "482": {
    "id": 482,
    "productName": "Bánh xoài Cam Ranh - Đặc sản Khánh Hòa (OCOP 4 sao)",
    "stars": 4,
    "region": "Khánh Hòa",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Khánh Hòa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Khánh Hòa",
    "certDecision": "QĐ số 2086/QĐ-UBND Tỉnh Khánh Hòa (OCOP 4 Sao)",
    "hotline": "095.774.866",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Khánh Hòa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Khánh Hòa",
      "phone": "095.774.866",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Khánh Hòa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Khánh Hòa",
        "phone": "095.774.866"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kh%C3%A1nh%20H%C3%B2a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kh%C3%A1nh%20H%C3%B2a"
  },
  "483": {
    "id": 483,
    "productName": "Muối ớt tôm Nha Trang - Đặc sản Khánh Hòa (OCOP 4 sao)",
    "stars": 4,
    "region": "Khánh Hòa",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Khánh Hòa",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Khánh Hòa",
    "certDecision": "QĐ số 2109/QĐ-UBND Tỉnh Khánh Hòa (OCOP 4 Sao)",
    "hotline": "096.781.879",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Khánh Hòa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Khánh Hòa",
      "phone": "096.781.879",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Khánh Hòa",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Khánh Hòa",
        "phone": "096.781.879"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kh%C3%A1nh%20H%C3%B2a%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kh%C3%A1nh%20H%C3%B2a"
  },
  "484": {
    "id": 484,
    "productName": "Tỏi cô đơn Ninh Thuận - Đặc sản Ninh Thuận (OCOP 5 sao)",
    "stars": 5,
    "region": "Ninh Thuận",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Ninh Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Thuận",
    "certDecision": "QĐ số 3228/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.788.892",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Thuận",
      "phone": "097.788.892",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Thuận",
        "phone": "097.788.892"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20Thu%E1%BA%ADn"
  },
  "485": {
    "id": 485,
    "productName": "Nho khô nguyên cành Ninh Thuận nhập/sấy - Đặc sản Ninh Thuận (OCOP 5 sao)",
    "stars": 5,
    "region": "Ninh Thuận",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Ninh Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Thuận",
    "certDecision": "QĐ số 3245/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.795.905",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Thuận",
      "phone": "098.795.905",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Thuận",
        "phone": "098.795.905"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20Thu%E1%BA%ADn"
  },
  "486": {
    "id": 486,
    "productName": "Mật nho nguyên chất - Đặc sản Ninh Thuận (OCOP 4 sao)",
    "stars": 4,
    "region": "Ninh Thuận",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Ninh Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Thuận",
    "certDecision": "QĐ số 2178/QĐ-UBND Tỉnh Ninh Thuận (OCOP 4 Sao)",
    "hotline": "090.802.918",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Thuận",
      "phone": "090.802.918",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Thuận",
        "phone": "090.802.918"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20Thu%E1%BA%ADn"
  },
  "487": {
    "id": 487,
    "productName": "Thịt cừu sấy khô - Đặc sản Ninh Thuận (OCOP 4 sao)",
    "stars": 4,
    "region": "Ninh Thuận",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Ninh Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Ninh Thuận",
    "certDecision": "QĐ số 2201/QĐ-UBND Tỉnh Ninh Thuận (OCOP 4 Sao)",
    "hotline": "091.809.931",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Ninh Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Ninh Thuận",
      "phone": "091.809.931",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Ninh Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Ninh Thuận",
        "phone": "091.809.931"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ninh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ninh%20Thu%E1%BA%ADn"
  },
  "488": {
    "id": 488,
    "productName": "Nước mắm Phan Thiết nhĩ đặc biệt - Đặc sản Bình Thuận (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Thuận",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bình Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Thuận",
    "certDecision": "QĐ số 3296/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.816.944",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Thuận",
      "phone": "092.816.944",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Thuận",
        "phone": "092.816.944"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Thu%E1%BA%ADn"
  },
  "489": {
    "id": 489,
    "productName": "Thanh long sấy dẻo công nghệ cao - Đặc sản Bình Thuận (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Thuận",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bình Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Thuận",
    "certDecision": "QĐ số 3313/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.823.957",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Thuận",
      "phone": "093.823.957",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Thuận",
        "phone": "093.823.957"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Thu%E1%BA%ADn"
  },
  "490": {
    "id": 490,
    "productName": "Mực một nắng Phan Thiết - Đặc sản Bình Thuận (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Thuận",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bình Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Thuận",
    "certDecision": "QĐ số 2270/QĐ-UBND Tỉnh Bình Thuận (OCOP 4 Sao)",
    "hotline": "094.830.970",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Thuận",
      "phone": "094.830.970",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Thuận",
        "phone": "094.830.970"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Thu%E1%BA%ADn"
  },
  "491": {
    "id": 491,
    "productName": "Bánh rế Phan Thiết - Đặc sản Bình Thuận (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Thuận",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bình Thuận",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Thuận",
    "certDecision": "QĐ số 2293/QĐ-UBND Tỉnh Bình Thuận (OCOP 4 Sao)",
    "hotline": "095.837.983",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Thuận",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Thuận",
      "phone": "095.837.983",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Thuận",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Thuận",
        "phone": "095.837.983"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Thu%E1%BA%ADn%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Thu%E1%BA%ADn"
  },
  "492": {
    "id": 492,
    "productName": "Sâm Ngọc Linh Kon Tum ngâm mật ong rừng - Đặc sản Kon Tum (OCOP 5 sao)",
    "stars": 5,
    "region": "Kon Tum",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Kon Tum",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kon Tum",
    "certDecision": "QĐ số 3364/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.844.996",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kon Tum",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kon Tum",
      "phone": "096.844.996",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kon Tum",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kon Tum",
        "phone": "096.844.996"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kon%20Tum%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kon%20Tum"
  },
  "493": {
    "id": 493,
    "productName": "Cà phê hạt rang nguyên chất Măng Đen - Đặc sản Kon Tum (OCOP 5 sao)",
    "stars": 5,
    "region": "Kon Tum",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Kon Tum",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kon Tum",
    "certDecision": "QĐ số 3381/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.851.209",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kon Tum",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kon Tum",
      "phone": "097.851.209",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kon Tum",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kon Tum",
        "phone": "097.851.209"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kon%20Tum%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kon%20Tum"
  },
  "494": {
    "id": 494,
    "productName": "Măng khô rừng Măng Đen - Đặc sản Kon Tum (OCOP 4 sao)",
    "stars": 4,
    "region": "Kon Tum",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Kon Tum",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kon Tum",
    "certDecision": "QĐ số 2362/QĐ-UBND Tỉnh Kon Tum (OCOP 4 Sao)",
    "hotline": "098.858.222",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kon Tum",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kon Tum",
      "phone": "098.858.222",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kon Tum",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kon Tum",
        "phone": "098.858.222"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kon%20Tum%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kon%20Tum"
  },
  "495": {
    "id": 495,
    "productName": "Hạt dổi rừng khô - Đặc sản Kon Tum (OCOP 4 sao)",
    "stars": 4,
    "region": "Kon Tum",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Kon Tum",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kon Tum",
    "certDecision": "QĐ số 2385/QĐ-UBND Tỉnh Kon Tum (OCOP 4 Sao)",
    "hotline": "090.865.235",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kon Tum",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kon Tum",
      "phone": "090.865.235",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kon Tum",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kon Tum",
        "phone": "090.865.235"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Kon%20Tum%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Kon%20Tum"
  },
  "496": {
    "id": 496,
    "productName": "Cà phê Fine Robusta Nam Yang - Đặc sản Gia Lai (OCOP 5 sao)",
    "stars": 5,
    "region": "Gia Lai",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Gia Lai",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Gia Lai",
    "certDecision": "QĐ số 3432/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.872.248",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Gia Lai",
      "address": "Đại lộ Trung tâm Hành chính, TP. Gia Lai",
      "phone": "091.872.248",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Gia Lai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Gia Lai",
        "phone": "091.872.248"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Gia%20Lai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Gia%20Lai"
  },
  "497": {
    "id": 497,
    "productName": "Hạt điều rang muối đặc sản Gia Lai - Đặc sản Gia Lai (OCOP 5 sao)",
    "stars": 5,
    "region": "Gia Lai",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Gia Lai",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Gia Lai",
    "certDecision": "QĐ số 3449/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.879.261",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Gia Lai",
      "address": "Đại lộ Trung tâm Hành chính, TP. Gia Lai",
      "phone": "092.879.261",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Gia Lai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Gia Lai",
        "phone": "092.879.261"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Gia%20Lai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Gia%20Lai"
  },
  "498": {
    "id": 498,
    "productName": "Mật ong hoa cà phê nguyên chất - Đặc sản Gia Lai (OCOP 4 sao)",
    "stars": 4,
    "region": "Gia Lai",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Gia Lai",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Gia Lai",
    "certDecision": "QĐ số 2454/QĐ-UBND Tỉnh Gia Lai (OCOP 4 Sao)",
    "hotline": "093.886.274",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Gia Lai",
      "address": "Đại lộ Trung tâm Hành chính, TP. Gia Lai",
      "phone": "093.886.274",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Gia Lai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Gia Lai",
        "phone": "093.886.274"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Gia%20Lai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Gia%20Lai"
  },
  "499": {
    "id": 499,
    "productName": "Bò một nắng Chư Sê - Đặc sản Gia Lai (OCOP 4 sao)",
    "stars": 4,
    "region": "Gia Lai",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Gia Lai",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Gia Lai",
    "certDecision": "QĐ số 2477/QĐ-UBND Tỉnh Gia Lai (OCOP 4 Sao)",
    "hotline": "094.893.287",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Gia Lai",
      "address": "Đại lộ Trung tâm Hành chính, TP. Gia Lai",
      "phone": "094.893.287",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Gia Lai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Gia Lai",
        "phone": "094.893.287"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Gia%20Lai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Gia%20Lai"
  },
  "500": {
    "id": 500,
    "productName": "Cà phê hạt rang Buôn Ma Thuột - Đặc sản Đắk Lắk (OCOP 5 sao)",
    "stars": 5,
    "region": "Đắk Lắk",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Đắk Lắk",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Lắk",
    "certDecision": "QĐ số 3500/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.900.300",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Lắk",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Lắk",
      "phone": "095.900.300",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Lắk",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Lắk",
        "phone": "095.900.300"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk"
  },
  "501": {
    "id": 501,
    "productName": "Bột cacao nguyên chất Buôn Ma Thuột - Đặc sản Đắk Lắk (OCOP 5 sao)",
    "stars": 5,
    "region": "Đắk Lắk",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Đắk Lắk",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Lắk",
    "certDecision": "QĐ số 3517/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.907.313",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Lắk",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Lắk",
      "phone": "096.907.313",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Lắk",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Lắk",
        "phone": "096.907.313"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk"
  },
  "502": {
    "id": 502,
    "productName": "Bơ sấy dẻo - Đặc sản Đắk Lắk (OCOP 4 sao)",
    "stars": 4,
    "region": "Đắk Lắk",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Đắk Lắk",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Lắk",
    "certDecision": "QĐ số 2546/QĐ-UBND Tỉnh Đắk Lắk (OCOP 4 Sao)",
    "hotline": "097.914.326",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Lắk",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Lắk",
      "phone": "097.914.326",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Lắk",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Lắk",
        "phone": "097.914.326"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk"
  },
  "503": {
    "id": 503,
    "productName": "Hạt mắc ca Krông Năng - Đặc sản Đắk Lắk (OCOP 4 sao)",
    "stars": 4,
    "region": "Đắk Lắk",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Đắk Lắk",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Lắk",
    "certDecision": "QĐ số 2569/QĐ-UBND Tỉnh Đắk Lắk (OCOP 4 Sao)",
    "hotline": "098.921.339",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Lắk",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Lắk",
      "phone": "098.921.339",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Lắk",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Lắk",
        "phone": "098.921.339"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20L%E1%BA%AFk"
  },
  "504": {
    "id": 504,
    "productName": "Hạt điều rang củi Đắk Nông - Đặc sản Đắk Nông (OCOP 5 sao)",
    "stars": 5,
    "region": "Đắk Nông",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Đắk Nông",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Nông",
    "certDecision": "QĐ số 3568/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.928.352",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Nông",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Nông",
      "phone": "090.928.352",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Nông",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Nông",
        "phone": "090.928.352"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20N%C3%B4ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20N%C3%B4ng"
  },
  "505": {
    "id": 505,
    "productName": "Cà phê hạt rang xay Đắk Nông nguyên chất - Đặc sản Đắk Nông (OCOP 5 sao)",
    "stars": 5,
    "region": "Đắk Nông",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Đắk Nông",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Nông",
    "certDecision": "QĐ số 3585/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.935.365",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Nông",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Nông",
      "phone": "091.935.365",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Nông",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Nông",
        "phone": "091.935.365"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20N%C3%B4ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20N%C3%B4ng"
  },
  "506": {
    "id": 506,
    "productName": "Khổ qua rừng sấy khô - Đặc sản Đắk Nông (OCOP 4 sao)",
    "stars": 4,
    "region": "Đắk Nông",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Đắk Nông",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Nông",
    "certDecision": "QĐ số 2638/QĐ-UBND Tỉnh Đắk Nông (OCOP 4 Sao)",
    "hotline": "092.942.378",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Nông",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Nông",
      "phone": "092.942.378",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Nông",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Nông",
        "phone": "092.942.378"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20N%C3%B4ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20N%C3%B4ng"
  },
  "507": {
    "id": 507,
    "productName": "Tinh bột nghệ nguyên chất Đắk Nông - Đặc sản Đắk Nông (OCOP 4 sao)",
    "stars": 4,
    "region": "Đắk Nông",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Đắk Nông",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Đắk Nông",
    "certDecision": "QĐ số 2661/QĐ-UBND Tỉnh Đắk Nông (OCOP 4 Sao)",
    "hotline": "093.949.391",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Đắk Nông",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đắk Nông",
      "phone": "093.949.391",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đắk Nông",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đắk Nông",
        "phone": "093.949.391"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BA%AFk%20N%C3%B4ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BA%AFk%20N%C3%B4ng"
  },
  "508": {
    "id": 508,
    "productName": "Trà Ô long Cầu Đất - Công ty CP Chè Cầu Đất Đà Lạt (OCOP 5 Sao Quốc gia)",
    "stars": 5,
    "region": "Lâm Đồng",
    "producerName": "Công ty CP Chè Cầu Đất Đà Lạt",
    "producerAddress": "Thôn Trường Thọ, Xã Trạm Hành, TP. Đà Lạt, Lâm Đồng",
    "certDecision": "QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.956.404",
    "primaryStore": {
      "name": "Showroom Trà Cầu Đất Đà Lạt Tinh Hoa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lâm Đồng",
      "phone": "094.956.404",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lâm Đồng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lâm Đồng",
        "phone": "094.956.404"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%C3%A2m%20%C4%90%E1%BB%93ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%C3%A2m%20%C4%90%E1%BB%93ng"
  },
  "509": {
    "id": 509,
    "productName": "Hồng treo gió công nghệ Nhật Bản Mộc Nhiên (OCOP 4 Sao)",
    "stars": 4,
    "region": "Lâm Đồng",
    "producerName": "Công ty Nông sản Mộc Nhiên Đà Lạt",
    "producerAddress": "Đường Khe Sanh, Phường 10, TP. Đà Lạt, Lâm Đồng",
    "certDecision": "QĐ số 3120/QĐ-UBND Tỉnh Lâm Đồng (OCOP 4 Sao)",
    "hotline": "095.963.417",
    "primaryStore": {
      "name": "Không gian Nông sản Sấy Mộc Nhiên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lâm Đồng",
      "phone": "095.963.417",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lâm Đồng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lâm Đồng",
        "phone": "095.963.417"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%C3%A2m%20%C4%90%E1%BB%93ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%C3%A2m%20%C4%90%E1%BB%93ng"
  },
  "510": {
    "id": 510,
    "productName": "Chuối Laba sấy dẻo Đơn Dương (OCOP 4 Sao)",
    "stars": 4,
    "region": "Lâm Đồng",
    "producerName": "HTX Nông nghiệp Laba Đơn Dương",
    "producerAddress": "Thị trấn Thạnh Mỹ, Huyện Đơn Dương, Lâm Đồng",
    "certDecision": "QĐ số 2590/QĐ-UBND Tỉnh Lâm Đồng (OCOP 4 Sao)",
    "hotline": "096.970.430",
    "primaryStore": {
      "name": "Điểm phân phối Chuối Laba Tiến Vua",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lâm Đồng",
      "phone": "096.970.430",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lâm Đồng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lâm Đồng",
        "phone": "096.970.430"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%C3%A2m%20%C4%90%E1%BB%93ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%C3%A2m%20%C4%90%E1%BB%93ng"
  },
  "511": {
    "id": 511,
    "productName": "Đông trùng hạ thảo Đà Lạt (OCOP 4 Sao)",
    "stars": 4,
    "region": "Lâm Đồng",
    "producerName": "Công ty TNHH Sinh học Cao nguyên Đà Lạt",
    "producerAddress": "Đường Vạn Hạnh, Phường 8, TP. Đà Lạt, Lâm Đồng",
    "certDecision": "QĐ số 2840/QĐ-UBND Tỉnh Lâm Đồng (OCOP 4 Sao)",
    "hotline": "097.977.443",
    "primaryStore": {
      "name": "Trung tâm Dược liệu Đông trùng Cao nguyên",
      "address": "Đại lộ Trung tâm Hành chính, TP. Lâm Đồng",
      "phone": "097.977.443",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Lâm Đồng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Lâm Đồng",
        "phone": "097.977.443"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Trung tâm OCOP Quốc gia: 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
        "phone": "024.3755.8899"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20L%C3%A2m%20%C4%90%E1%BB%93ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20L%C3%A2m%20%C4%90%E1%BB%93ng"
  },
  "512": {
    "id": 512,
    "productName": "Hạt điều rang muối Bình Phước - Đặc sản Bình Phước (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Phước",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bình Phước",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Phước",
    "certDecision": "QĐ số 3704/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.984.456",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Phước",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Phước",
      "phone": "098.984.456",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Phước",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Phước",
        "phone": "098.984.456"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc"
  },
  "513": {
    "id": 513,
    "productName": "Cà phê Phước Long hạt rang - Đặc sản Bình Phước (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Phước",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Bình Phước",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Phước",
    "certDecision": "QĐ số 3721/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.991.469",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Phước",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Phước",
      "phone": "090.991.469",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Phước",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Phước",
        "phone": "090.991.469"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc"
  },
  "514": {
    "id": 514,
    "productName": "Mật ong hoa điều nguyên chất - Đặc sản Bình Phước (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Phước",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bình Phước",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Phước",
    "certDecision": "QĐ số 2822/QĐ-UBND Tỉnh Bình Phước (OCOP 4 Sao)",
    "hotline": "091.998.482",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Phước",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Phước",
      "phone": "091.998.482",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Phước",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Phước",
        "phone": "091.998.482"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc"
  },
  "515": {
    "id": 515,
    "productName": "Trái cây sấy thập cẩm - Đặc sản Bình Phước (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Phước",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bình Phước",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Phước",
    "certDecision": "QĐ số 2845/QĐ-UBND Tỉnh Bình Phước (OCOP 4 Sao)",
    "hotline": "092.105.495",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Phước",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Phước",
      "phone": "092.105.495",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Phước",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Phước",
        "phone": "092.105.495"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20Ph%C6%B0%E1%BB%9Bc"
  },
  "516": {
    "id": 516,
    "productName": "Bánh tráng phơi sương Trảng Bàng - Đặc sản Tây Ninh (OCOP 5 sao)",
    "stars": 5,
    "region": "Tây Ninh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Tây Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tây Ninh",
    "certDecision": "QĐ số 3772/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.112.508",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tây Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tây Ninh",
      "phone": "093.112.508",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tây Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tây Ninh",
        "phone": "093.112.508"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20T%C3%A2y%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20T%C3%A2y%20Ninh"
  },
  "517": {
    "id": 517,
    "productName": "Muối tôm Tây Ninh - Đặc sản Tây Ninh (OCOP 5 sao)",
    "stars": 5,
    "region": "Tây Ninh",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Tây Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tây Ninh",
    "certDecision": "QĐ số 3789/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.119.521",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tây Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tây Ninh",
      "phone": "094.119.521",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tây Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tây Ninh",
        "phone": "094.119.521"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20T%C3%A2y%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20T%C3%A2y%20Ninh"
  },
  "518": {
    "id": 518,
    "productName": "Bánh tráng me Tây Ninh - Đặc sản Tây Ninh (OCOP 4 sao)",
    "stars": 4,
    "region": "Tây Ninh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Tây Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tây Ninh",
    "certDecision": "QĐ số 2914/QĐ-UBND Tỉnh Tây Ninh (OCOP 4 Sao)",
    "hotline": "095.126.534",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tây Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tây Ninh",
      "phone": "095.126.534",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tây Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tây Ninh",
        "phone": "095.126.534"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20T%C3%A2y%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20T%C3%A2y%20Ninh"
  },
  "519": {
    "id": 519,
    "productName": "Mít sấy dẻo Tây Ninh - Đặc sản Tây Ninh (OCOP 4 sao)",
    "stars": 4,
    "region": "Tây Ninh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Tây Ninh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tây Ninh",
    "certDecision": "QĐ số 2937/QĐ-UBND Tỉnh Tây Ninh (OCOP 4 Sao)",
    "hotline": "096.133.547",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tây Ninh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tây Ninh",
      "phone": "096.133.547",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tây Ninh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tây Ninh",
        "phone": "096.133.547"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20T%C3%A2y%20Ninh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20T%C3%A2y%20Ninh"
  },
  "520": {
    "id": 520,
    "productName": "Hạt điều rang muối Bình Dương - Đặc sản Bình Dương (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Dương",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bình Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Dương",
    "certDecision": "QĐ số 3840/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.140.560",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Dương",
      "phone": "097.140.560",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Dương",
        "phone": "097.140.560"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20D%C6%B0%C6%A1ng"
  },
  "521": {
    "id": 521,
    "productName": "Gốm sứ thủ công mỹ nghệ - Đặc sản Bình Dương (OCOP 5 sao)",
    "stars": 5,
    "region": "Bình Dương",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Bình Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Dương",
    "certDecision": "QĐ số 3857/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.147.573",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Dương",
      "phone": "098.147.573",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Dương",
        "phone": "098.147.573"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20D%C6%B0%C6%A1ng"
  },
  "522": {
    "id": 522,
    "productName": "Tinh bột nghệ Bình Dương - Đặc sản Bình Dương (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Dương",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bình Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Dương",
    "certDecision": "QĐ số 3006/QĐ-UBND Tỉnh Bình Dương (OCOP 4 Sao)",
    "hotline": "090.154.586",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Dương",
      "phone": "090.154.586",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Dương",
        "phone": "090.154.586"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20D%C6%B0%C6%A1ng"
  },
  "523": {
    "id": 523,
    "productName": "Mủ trôm nguyên chất - Đặc sản Bình Dương (OCOP 4 sao)",
    "stars": 4,
    "region": "Bình Dương",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bình Dương",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bình Dương",
    "certDecision": "QĐ số 3029/QĐ-UBND Tỉnh Bình Dương (OCOP 4 Sao)",
    "hotline": "091.161.599",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bình Dương",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bình Dương",
      "phone": "091.161.599",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bình Dương",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bình Dương",
        "phone": "091.161.599"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%ACnh%20D%C6%B0%C6%A1ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%ACnh%20D%C6%B0%C6%A1ng"
  },
  "524": {
    "id": 524,
    "productName": "Bưởi đường lá cam Tân Triều - HTX Nông nghiệp dịch vụ Tân Triều (OCOP 4 Sao)",
    "stars": 4,
    "region": "Đồng Nai",
    "producerName": "HTX Nông nghiệp dịch vụ Tân Triều",
    "producerAddress": "Xã Tân Bình, Huyện Vĩnh Cửu, Đồng Nai",
    "certDecision": "QĐ số 3120/QĐ-UBND Tỉnh Đồng Nai (OCOP 4 Sao)",
    "hotline": "092.168.612",
    "primaryStore": {
      "name": "Điểm giới thiệu Bưởi Tân Triều Chính Gốc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Nai",
      "phone": "092.168.612",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Nai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Nai",
        "phone": "092.168.612"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Nai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Nai"
  },
  "525": {
    "id": 525,
    "productName": "Trà khổ qua rừng túi lọc - Công ty TNHH Khổ qua rừng Hiệp Vân, Long Khánh (OCOP 4 Sao)",
    "stars": 4,
    "region": "Đồng Nai",
    "producerName": "Công ty TNHH Khổ qua rừng Hiệp Vân, Long Khánh",
    "producerAddress": "Phường Suối Tre, TP. Long Khánh, Đồng Nai",
    "certDecision": "QĐ số 2890/QĐ-UBND Tỉnh Đồng Nai (OCOP 4 Sao)",
    "hotline": "093.175.625",
    "primaryStore": {
      "name": "Showroom Dược liệu Khổ qua rừng Hiệp Vân",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Nai",
      "phone": "093.175.625",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Nai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Nai",
        "phone": "093.175.625"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Nai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Nai"
  },
  "526": {
    "id": 526,
    "productName": "Hạt điều rang muối - Công ty TNHH MTV Hạt điều Vinahe, Trảng Bom (OCOP 4 Sao)",
    "stars": 4,
    "region": "Đồng Nai",
    "producerName": "Công ty TNHH MTV Hạt điều Vinahe, Trảng Bom",
    "producerAddress": "Xã Quảng Tiến, Huyện Trảng Bom, Đồng Nai",
    "certDecision": "QĐ số 2750/QĐ-UBND Tỉnh Đồng Nai (OCOP 4 Sao)",
    "hotline": "094.182.638",
    "primaryStore": {
      "name": "Showroom Hạt điều Vinahe Đồng Nai",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Nai",
      "phone": "094.182.638",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Nai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Nai",
        "phone": "094.182.638"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Nai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Nai"
  },
  "527": {
    "id": 527,
    "productName": "Chuối sấy cứng Cường Hoa - Cơ sở chế biến nông sản Cường Hoa, Thống Nhất (OCOP 3 Sao)",
    "stars": 3,
    "region": "Đồng Nai",
    "producerName": "Cơ sở chế biến nông sản Cường Hoa, Thống Nhất",
    "producerAddress": "Xã Gia Tân 2, Huyện Thống Nhất, Đồng Nai",
    "certDecision": "QĐ số 1940/QĐ-UBND Huyện Thống Nhất (OCOP 3 Sao)",
    "hotline": "095.189.651",
    "primaryStore": {
      "name": "Đại lý Nông sản sấy Cường Hoa Đồng Nai",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Nai",
      "phone": "095.189.651",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Nai",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Nai",
        "phone": "095.189.651"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Nai%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Nai"
  },
  "528": {
    "id": 528,
    "productName": "Hạt ca cao nguyên chất Châu Đức - Đặc sản Bà Rịa - Vũng Tàu (OCOP 5 sao)",
    "stars": 5,
    "region": "Bà Rịa - Vũng Tàu",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Bà Rịa - Vũng Tàu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bà Rịa - Vũng Tàu",
    "certDecision": "QĐ số 3976/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.196.664",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bà Rịa - Vũng Tàu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bà Rịa - Vũng Tàu",
      "phone": "096.196.664",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bà Rịa - Vũng Tàu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bà Rịa - Vũng Tàu",
        "phone": "096.196.664"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u"
  },
  "529": {
    "id": 529,
    "productName": "Nước mắm Trí Hải cốt đặc biệt - Đặc sản Bà Rịa - Vũng Tàu (OCOP 5 sao)",
    "stars": 5,
    "region": "Bà Rịa - Vũng Tàu",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bà Rịa - Vũng Tàu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bà Rịa - Vũng Tàu",
    "certDecision": "QĐ số 3993/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.203.677",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bà Rịa - Vũng Tàu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bà Rịa - Vũng Tàu",
      "phone": "097.203.677",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bà Rịa - Vũng Tàu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bà Rịa - Vũng Tàu",
        "phone": "097.203.677"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u"
  },
  "530": {
    "id": 530,
    "productName": "Hải sản khô một nắng Côn Đảo - Đặc sản Bà Rịa - Vũng Tàu (OCOP 4 sao)",
    "stars": 4,
    "region": "Bà Rịa - Vũng Tàu",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bà Rịa - Vũng Tàu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bà Rịa - Vũng Tàu",
    "certDecision": "QĐ số 3190/QĐ-UBND Tỉnh Bà Rịa - Vũng Tàu (OCOP 4 Sao)",
    "hotline": "098.210.690",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bà Rịa - Vũng Tàu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bà Rịa - Vũng Tàu",
      "phone": "098.210.690",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bà Rịa - Vũng Tàu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bà Rịa - Vũng Tàu",
        "phone": "098.210.690"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u"
  },
  "531": {
    "id": 531,
    "productName": "Bánh bông lan trứng muối đóng hộp cứng - Đặc sản Bà Rịa - Vũng Tàu (OCOP 4 sao)",
    "stars": 4,
    "region": "Bà Rịa - Vũng Tàu",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bà Rịa - Vũng Tàu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bà Rịa - Vũng Tàu",
    "certDecision": "QĐ số 3213/QĐ-UBND Tỉnh Bà Rịa - Vũng Tàu (OCOP 4 Sao)",
    "hotline": "090.217.703",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bà Rịa - Vũng Tàu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bà Rịa - Vũng Tàu",
      "phone": "090.217.703",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bà Rịa - Vũng Tàu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bà Rịa - Vũng Tàu",
        "phone": "090.217.703"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%C3%A0%20R%E1%BB%8Ba%20-%20V%C5%A9ng%20T%C3%A0u"
  },
  "532": {
    "id": 532,
    "productName": "Mật dừa nước tinh chất hữu cơ Bình Chánh - Công ty TNHH Phát triển Dừa nước Việt Nam VIETNIPA (OCOP 4 Sao)",
    "stars": 4,
    "region": "Thành phố Hồ Chí Minh",
    "producerName": "Công ty TNHH Phát triển Dừa nước Việt Nam VIETNIPA",
    "producerAddress": "Xã An Phú Tây, Huyện Bình Chánh, TP. Hồ Chí Minh",
    "certDecision": "QĐ số 3080/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)",
    "hotline": "091.224.716",
    "primaryStore": {
      "name": "Showroom Mật dừa nước VIETNIPA Bình Chánh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thủ Đức, TP. Hồ Chí Minh",
      "phone": "091.224.716",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thành phố Hồ Chí Minh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thành phố Hồ Chí Minh",
        "phone": "091.224.716"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh"
  },
  "533": {
    "id": 533,
    "productName": "Tổ yến chưng đường phèn Cần Giờ (OCOP 4 Sao)",
    "stars": 4,
    "region": "Thành phố Hồ Chí Minh",
    "producerName": "Công ty TNHH Yến sào Cần Giờ",
    "producerAddress": "Xã Tam Thôn Hiệp, Huyện Cần Giờ, TP. Hồ Chí Minh",
    "certDecision": "QĐ số 3240/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)",
    "hotline": "092.231.729",
    "primaryStore": {
      "name": "Showroom Yến sào Cần Giờ Tinh Hoa",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thủ Đức, TP. Hồ Chí Minh",
      "phone": "092.231.729",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thành phố Hồ Chí Minh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thành phố Hồ Chí Minh",
        "phone": "092.231.729"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh"
  },
  "534": {
    "id": 534,
    "productName": "Xoài cát Cần Giờ (OCOP 4 Sao)",
    "stars": 4,
    "region": "Thành phố Hồ Chí Minh",
    "producerName": "HTX Nông nghiệp Cần Giờ",
    "producerAddress": "Xã Long Hòa, Huyện Cần Giờ, TP. Hồ Chí Minh",
    "certDecision": "QĐ số 2810/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)",
    "hotline": "093.238.742",
    "primaryStore": {
      "name": "Cửa hàng Nông sản Sinh thái Cần Giờ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thủ Đức, TP. Hồ Chí Minh",
      "phone": "093.238.742",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thành phố Hồ Chí Minh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thành phố Hồ Chí Minh",
        "phone": "093.238.742"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh"
  },
  "535": {
    "id": 535,
    "productName": "Khô cá dứa một nắng Cần Giờ (OCOP 4 Sao)",
    "stars": 4,
    "region": "Thành phố Hồ Chí Minh",
    "producerName": "Cơ sở Thủy hải sản Nắng Cần Giờ",
    "producerAddress": "Thị trấn Cần Thạnh, Huyện Cần Giờ, TP. Hồ Chí Minh",
    "certDecision": "QĐ số 2990/QĐ-UBND TP. Hồ Chí Minh (OCOP 4 Sao)",
    "hotline": "094.245.755",
    "primaryStore": {
      "name": "Đại lý Đặc sản Khô cá dứa Cần Giờ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Thủ Đức, TP. Hồ Chí Minh",
      "phone": "094.245.755",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Thành phố Hồ Chí Minh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Thành phố Hồ Chí Minh",
        "phone": "094.245.755"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Th%E1%BB%A7%20%C4%90%E1%BB%A9c%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh"
  },
  "536": {
    "id": 536,
    "productName": "Gạo Nếp nàng hoa Long An - Đặc sản Long An (OCOP 5 sao)",
    "stars": 5,
    "region": "Long An",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Long An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Long An",
    "certDecision": "QĐ số 1112/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.252.768",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Long An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Long An",
      "phone": "095.252.768",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Long An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Long An",
        "phone": "095.252.768"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Long%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Long%20An"
  },
  "537": {
    "id": 537,
    "productName": "Rượu đế Gò Đen hảo hạng - Đặc sản Long An (OCOP 5 sao)",
    "stars": 5,
    "region": "Long An",
    "producerName": "Công ty TNHH Đặc sản & Quà biếu Long An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Long An",
    "certDecision": "QĐ số 1129/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.259.781",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Long An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Long An",
      "phone": "096.259.781",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Long An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Long An",
        "phone": "096.259.781"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Long%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Long%20An"
  },
  "538": {
    "id": 538,
    "productName": "Thanh long sấy dẻo Châu Thành - Đặc sản Long An (OCOP 4 sao)",
    "stars": 4,
    "region": "Long An",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Long An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Long An",
    "certDecision": "QĐ số 3374/QĐ-UBND Tỉnh Long An (OCOP 4 Sao)",
    "hotline": "097.266.794",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Long An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Long An",
      "phone": "097.266.794",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Long An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Long An",
        "phone": "097.266.794"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Long%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Long%20An"
  },
  "539": {
    "id": 539,
    "productName": "Bánh tráng Long Trì - Đặc sản Long An (OCOP 4 sao)",
    "stars": 4,
    "region": "Long An",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Long An",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Long An",
    "certDecision": "QĐ số 3397/QĐ-UBND Tỉnh Long An (OCOP 4 Sao)",
    "hotline": "098.273.807",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Long An",
      "address": "Đại lộ Trung tâm Hành chính, TP. Long An",
      "phone": "098.273.807",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Long An",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Long An",
        "phone": "098.273.807"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Long%20An%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Long%20An"
  },
  "540": {
    "id": 540,
    "productName": "Bột ca cao nguyên chất Xuân Ron Chợ Gạo - Đặc sản Tiền Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "Tiền Giang",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Tiền Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tiền Giang",
    "certDecision": "QĐ số 1180/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.280.820",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tiền Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tiền Giang",
      "phone": "090.280.820",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tiền Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tiền Giang",
        "phone": "090.280.820"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ti%E1%BB%81n%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ti%E1%BB%81n%20Giang"
  },
  "541": {
    "id": 541,
    "productName": "Kẹo dừa sầu riêng Tiền Giang đặc biệt - Đặc sản Tiền Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "Tiền Giang",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Tiền Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tiền Giang",
    "certDecision": "QĐ số 1197/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.287.833",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tiền Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tiền Giang",
      "phone": "091.287.833",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tiền Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tiền Giang",
        "phone": "091.287.833"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ti%E1%BB%81n%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ti%E1%BB%81n%20Giang"
  },
  "542": {
    "id": 542,
    "productName": "Mít sấy dẻo Cai Lậy - Đặc sản Tiền Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "Tiền Giang",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Tiền Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tiền Giang",
    "certDecision": "QĐ số 3466/QĐ-UBND Tỉnh Tiền Giang (OCOP 4 Sao)",
    "hotline": "092.294.846",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tiền Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tiền Giang",
      "phone": "092.294.846",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tiền Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tiền Giang",
        "phone": "092.294.846"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ti%E1%BB%81n%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ti%E1%BB%81n%20Giang"
  },
  "543": {
    "id": 543,
    "productName": "Nước mắm Gò Công - Đặc sản Tiền Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "Tiền Giang",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Tiền Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Tiền Giang",
    "certDecision": "QĐ số 3489/QĐ-UBND Tỉnh Tiền Giang (OCOP 4 Sao)",
    "hotline": "093.301.859",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Tiền Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Tiền Giang",
      "phone": "093.301.859",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Tiền Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Tiền Giang",
        "phone": "093.301.859"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ti%E1%BB%81n%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ti%E1%BB%81n%20Giang"
  },
  "544": {
    "id": 544,
    "productName": "Kẹo dừa gừng đậu phộng Tuyết Phụng - Cơ sở sản xuất kẹo dừa Tuyết Phụng (OCOP 4 Sao)",
    "stars": 4,
    "region": "Bến Tre",
    "producerName": "Cơ sở sản xuất kẹo dừa Tuyết Phụng",
    "producerAddress": "Số 56 Ấp 4, Thị trấn Mỏ Cày, Huyện Mỏ Cày Nam, Bến Tre",
    "certDecision": "QĐ số 2730/QĐ-UBND Tỉnh Bến Tre (OCOP 4 Sao)",
    "hotline": "094.308.872",
    "primaryStore": {
      "name": "Showroom Kẹo Dừa Tuyết Phụng Mỏ Cày",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bến Tre",
      "phone": "094.308.872",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bến Tre",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bến Tre",
        "phone": "094.308.872"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%BFn%20Tre%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%BFn%20Tre"
  },
  "545": {
    "id": 545,
    "productName": "Bưởi da xanh Hàm Luông (OCOP 4 Sao)",
    "stars": 4,
    "region": "Bến Tre",
    "producerName": "HTX Bưởi da xanh Bến Tre",
    "producerAddress": "Xã Giao Long, Huyện Châu Thành, Bến Tre",
    "certDecision": "QĐ số 2580/QĐ-UBND Tỉnh Bến Tre (OCOP 4 Sao)",
    "hotline": "095.315.885",
    "primaryStore": {
      "name": "Trạm Xúc tiến Bưởi da xanh Bến Tre",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bến Tre",
      "phone": "095.315.885",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bến Tre",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bến Tre",
        "phone": "095.315.885"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%BFn%20Tre%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%BFn%20Tre"
  },
  "546": {
    "id": 546,
    "productName": "Dầu dừa nguyên chất tinh khiết Bến Tre (OCOP 3 Sao)",
    "stars": 3,
    "region": "Bến Tre",
    "producerName": "Cơ sở Dầu dừa Tinh khiết Bến Tre",
    "producerAddress": "Xã Hữu Định, Huyện Châu Thành, Bến Tre",
    "certDecision": "QĐ số 1680/QĐ-UBND Huyện Châu Thành (OCOP 3 Sao)",
    "hotline": "096.322.898",
    "primaryStore": {
      "name": "Cửa hàng Tinh hoa Dừa Bến Tre",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bến Tre",
      "phone": "096.322.898",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bến Tre",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bến Tre",
        "phone": "096.322.898"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%BFn%20Tre%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%BFn%20Tre"
  },
  "547": {
    "id": 547,
    "productName": "Nước màu dừa đậm đặc Mỏ Cày Nam (OCOP 3 Sao)",
    "stars": 3,
    "region": "Bến Tre",
    "producerName": "Cơ sở Nước màu dừa Truyền thống Mỏ Cày",
    "producerAddress": "Thị trấn Mỏ Cày Nam, Bến Tre",
    "certDecision": "QĐ số 1540/QĐ-UBND Huyện Mỏ Cày Nam (OCOP 3 Sao)",
    "hotline": "097.329.911",
    "primaryStore": {
      "name": "Đại lý Nước màu dừa Mỏ Cày Nam",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bến Tre",
      "phone": "097.329.911",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bến Tre",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bến Tre",
        "phone": "097.329.911"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%BFn%20Tre%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%BFn%20Tre"
  },
  "548": {
    "id": 548,
    "productName": "Kẹo dừa sáp nguyên chất Cầu Kè - Đặc sản Trà Vinh (OCOP 5 sao)",
    "stars": 5,
    "region": "Trà Vinh",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Trà Vinh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Trà Vinh",
    "certDecision": "QĐ số 1316/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.336.924",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Trà Vinh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Trà Vinh",
      "phone": "098.336.924",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Trà Vinh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Trà Vinh",
        "phone": "098.336.924"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tr%C3%A0%20Vinh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tr%C3%A0%20Vinh"
  },
  "549": {
    "id": 549,
    "productName": "Kẹo dừa sáp cacao / lá dứa Cầu Kè - Đặc sản Trà Vinh (OCOP 5 sao)",
    "stars": 5,
    "region": "Trà Vinh",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Trà Vinh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Trà Vinh",
    "certDecision": "QĐ số 1333/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.343.937",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Trà Vinh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Trà Vinh",
      "phone": "090.343.937",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Trà Vinh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Trà Vinh",
        "phone": "090.343.937"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tr%C3%A0%20Vinh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tr%C3%A0%20Vinh"
  },
  "550": {
    "id": 550,
    "productName": "Cốm dẹp Trà Vinh - Đặc sản Trà Vinh (OCOP 4 sao)",
    "stars": 4,
    "region": "Trà Vinh",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Trà Vinh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Trà Vinh",
    "certDecision": "QĐ số 1150/QĐ-UBND Tỉnh Trà Vinh (OCOP 4 Sao)",
    "hotline": "091.350.950",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Trà Vinh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Trà Vinh",
      "phone": "091.350.950",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Trà Vinh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Trà Vinh",
        "phone": "091.350.950"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tr%C3%A0%20Vinh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tr%C3%A0%20Vinh"
  },
  "551": {
    "id": 551,
    "productName": "Bánh tét Trà Vinh - Đặc sản Trà Vinh (OCOP 4 sao)",
    "stars": 4,
    "region": "Trà Vinh",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Trà Vinh",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Trà Vinh",
    "certDecision": "QĐ số 1173/QĐ-UBND Tỉnh Trà Vinh (OCOP 4 Sao)",
    "hotline": "092.357.963",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Trà Vinh",
      "address": "Đại lộ Trung tâm Hành chính, TP. Trà Vinh",
      "phone": "092.357.963",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Trà Vinh",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Trà Vinh",
        "phone": "092.357.963"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Tr%C3%A0%20Vinh%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Tr%C3%A0%20Vinh"
  },
  "552": {
    "id": 552,
    "productName": "Tàu hũ ky Bình Minh khô - Đặc sản Vĩnh Long (OCOP 5 sao)",
    "stars": 5,
    "region": "Vĩnh Long",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Vĩnh Long",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Long",
    "certDecision": "QĐ số 1384/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.364.976",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Long",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Long",
      "phone": "093.364.976",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Long",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Long",
        "phone": "093.364.976"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Long%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Long"
  },
  "553": {
    "id": 553,
    "productName": "Mứt bưởi da xanh - Đặc sản Vĩnh Long (OCOP 5 sao)",
    "stars": 5,
    "region": "Vĩnh Long",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Vĩnh Long",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Long",
    "certDecision": "QĐ số 1401/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.371.989",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Long",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Long",
      "phone": "094.371.989",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Long",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Long",
        "phone": "094.371.989"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Long%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Long"
  },
  "554": {
    "id": 554,
    "productName": "Bánh tráng cù lao Mây - Đặc sản Vĩnh Long (OCOP 4 sao)",
    "stars": 4,
    "region": "Vĩnh Long",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Vĩnh Long",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Long",
    "certDecision": "QĐ số 1242/QĐ-UBND Tỉnh Vĩnh Long (OCOP 4 Sao)",
    "hotline": "095.378.202",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Long",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Long",
      "phone": "095.378.202",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Long",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Long",
        "phone": "095.378.202"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Long%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Long"
  },
  "555": {
    "id": 555,
    "productName": "Trà đinh lăng Vĩnh Long - Đặc sản Vĩnh Long (OCOP 4 sao)",
    "stars": 4,
    "region": "Vĩnh Long",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Vĩnh Long",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Vĩnh Long",
    "certDecision": "QĐ số 1265/QĐ-UBND Tỉnh Vĩnh Long (OCOP 4 Sao)",
    "hotline": "096.385.215",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Vĩnh Long",
      "address": "Đại lộ Trung tâm Hành chính, TP. Vĩnh Long",
      "phone": "096.385.215",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Vĩnh Long",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Vĩnh Long",
        "phone": "096.385.215"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20V%C4%A9nh%20Long%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20V%C4%A9nh%20Long"
  },
  "556": {
    "id": 556,
    "productName": "Bánh phồng tôm Sa Giang - Công ty CP Xuất nhập khẩu Sa Giang (OCOP 5 Sao Quốc gia)",
    "stars": 5,
    "region": "Đồng Tháp",
    "producerName": "Công ty CP Xuất nhập khẩu Sa Giang",
    "producerAddress": "Lô CII-3, KCN Sa Đéc, TP. Sa Đéc, Đồng Tháp",
    "certDecision": "QĐ số 3828/QĐ-BNN (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.392.228",
    "primaryStore": {
      "name": "Showroom Bánh phồng tôm Sa Giang Sa Đéc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Tháp",
      "phone": "097.392.228",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Tháp",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Tháp",
        "phone": "097.392.228"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Th%C3%A1p%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Th%C3%A1p"
  },
  "557": {
    "id": 557,
    "productName": "Hạt sen sấy giòn bơ tỏi Tháp Mười (OCOP 4 Sao)",
    "stars": 4,
    "region": "Đồng Tháp",
    "producerName": "Công ty Cổ phần Thực phẩm Sen Đại Việt",
    "producerAddress": "Thị trấn Mỹ An, Huyện Tháp Mười, Đồng Tháp",
    "certDecision": "QĐ số 2950/QĐ-UBND Tỉnh Đồng Tháp (OCOP 4 Sao)",
    "hotline": "098.399.241",
    "primaryStore": {
      "name": "Showroom Sen Đại Việt Tháp Mười",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Tháp",
      "phone": "098.399.241",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Tháp",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Tháp",
        "phone": "098.399.241"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Th%C3%A1p%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Th%C3%A1p"
  },
  "558": {
    "id": 558,
    "productName": "Mango sấy dẻo Cao Lãnh (OCOP 4 Sao)",
    "stars": 4,
    "region": "Đồng Tháp",
    "producerName": "HTX Nông sản Sấy Cao Lãnh",
    "producerAddress": "Xã Tịnh Thới, TP. Cao Lãnh, Đồng Tháp",
    "certDecision": "QĐ số 2820/QĐ-UBND Tỉnh Đồng Tháp (OCOP 4 Sao)",
    "hotline": "090.406.254",
    "primaryStore": {
      "name": "Cửa hàng Nông sản Đất Sen Hồng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Tháp",
      "phone": "090.406.254",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Tháp",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Tháp",
        "phone": "090.406.254"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Th%C3%A1p%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Th%C3%A1p"
  },
  "559": {
    "id": 559,
    "productName": "Nem chua Lai Vung - Cơ sở Giáo Dừa (OCOP 3 Sao)",
    "stars": 3,
    "region": "Đồng Tháp",
    "producerName": "Cơ sở Nem Giáo Dừa Lai Vung",
    "producerAddress": "Thị trấn Lai Vung, Huyện Lai Vung, Đồng Tháp",
    "certDecision": "QĐ số 1890/QĐ-UBND Huyện Lai Vung (OCOP 3 Sao)",
    "hotline": "091.413.267",
    "primaryStore": {
      "name": "Đại lý Nem Lai Vung Giáo Dừa Chính Gốc",
      "address": "Đại lộ Trung tâm Hành chính, TP. Đồng Tháp",
      "phone": "091.413.267",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Đồng Tháp",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Đồng Tháp",
        "phone": "091.413.267"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20%C4%90%E1%BB%93ng%20Th%C3%A1p%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20%C4%90%E1%BB%93ng%20Th%C3%A1p"
  },
  "560": {
    "id": 560,
    "productName": "Đường thốt nốt nguyên chất An Giang - Đặc sản An Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "An Giang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn An Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh An Giang",
    "certDecision": "QĐ số 1520/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.420.280",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản An Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. An Giang",
      "phone": "092.420.280",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP An Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại An Giang",
        "phone": "092.420.280"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20An%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20An%20Giang"
  },
  "561": {
    "id": 561,
    "productName": "Gạo Nếp vú sữa Tân Châu - Đặc sản An Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "An Giang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn An Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh An Giang",
    "certDecision": "QĐ số 1537/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "093.427.293",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản An Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. An Giang",
      "phone": "093.427.293",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP An Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại An Giang",
        "phone": "093.427.293"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20An%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20An%20Giang"
  },
  "562": {
    "id": 562,
    "productName": "Mắm cá linh / Mắm thái Châu Đốc - Đặc sản An Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "An Giang",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống An Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh An Giang",
    "certDecision": "QĐ số 1426/QĐ-UBND Tỉnh An Giang (OCOP 4 Sao)",
    "hotline": "094.434.306",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản An Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. An Giang",
      "phone": "094.434.306",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP An Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại An Giang",
        "phone": "094.434.306"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20An%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20An%20Giang"
  },
  "563": {
    "id": 563,
    "productName": "Khô bò dứa An Phú - Đặc sản An Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "An Giang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn An Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh An Giang",
    "certDecision": "QĐ số 1449/QĐ-UBND Tỉnh An Giang (OCOP 4 Sao)",
    "hotline": "095.441.319",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản An Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. An Giang",
      "phone": "095.441.319",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP An Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại An Giang",
        "phone": "095.441.319"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20An%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20An%20Giang"
  },
  "564": {
    "id": 564,
    "productName": "Nước mắm Phú Quốc Huỳnh Khoa 43°/45° đạm - Đặc sản Kiên Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "Kiên Giang",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Kiên Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kiên Giang",
    "certDecision": "QĐ số 1588/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.448.332",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kiên Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kiên Giang",
      "phone": "096.448.332",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kiên Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kiên Giang",
        "phone": "096.448.332"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ki%C3%AAn%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ki%C3%AAn%20Giang"
  },
  "565": {
    "id": 565,
    "productName": "Rượu sim Phú Quốc - Đặc sản Kiên Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "Kiên Giang",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Kiên Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kiên Giang",
    "certDecision": "QĐ số 1605/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "097.455.345",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kiên Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kiên Giang",
      "phone": "097.455.345",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kiên Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kiên Giang",
        "phone": "097.455.345"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ki%C3%AAn%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ki%C3%AAn%20Giang"
  },
  "566": {
    "id": 566,
    "productName": "Khô cá thiều Phú Quốc - Đặc sản Kiên Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "Kiên Giang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Kiên Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kiên Giang",
    "certDecision": "QĐ số 1518/QĐ-UBND Tỉnh Kiên Giang (OCOP 4 Sao)",
    "hotline": "098.462.358",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kiên Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kiên Giang",
      "phone": "098.462.358",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kiên Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kiên Giang",
        "phone": "098.462.358"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ki%C3%AAn%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ki%C3%AAn%20Giang"
  },
  "567": {
    "id": 567,
    "productName": "Tiêu hạt Phú Quốc khô - Đặc sản Kiên Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "Kiên Giang",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Kiên Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Kiên Giang",
    "certDecision": "QĐ số 1541/QĐ-UBND Tỉnh Kiên Giang (OCOP 4 Sao)",
    "hotline": "090.469.371",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Kiên Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Kiên Giang",
      "phone": "090.469.371",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Kiên Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Kiên Giang",
        "phone": "090.469.371"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20Ki%C3%AAn%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20Ki%C3%AAn%20Giang"
  },
  "568": {
    "id": 568,
    "productName": "Cacao nguyên chất Phong Điền - Đặc sản Cần Thơ (OCOP 5 sao)",
    "stars": 5,
    "region": "Cần Thơ",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Cần Thơ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cần Thơ",
    "certDecision": "QĐ số 1656/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.476.384",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cần Thơ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cần Thơ",
      "phone": "091.476.384",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cần Thơ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cần Thơ",
        "phone": "091.476.384"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%E1%BA%A7n%20Th%C6%A1%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%E1%BA%A7n%20Th%C6%A1"
  },
  "569": {
    "id": 569,
    "productName": "Bánh tráng Thuận Hưng - Đặc sản Cần Thơ (OCOP 5 sao)",
    "stars": 5,
    "region": "Cần Thơ",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Cần Thơ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cần Thơ",
    "certDecision": "QĐ số 1673/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "092.483.397",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cần Thơ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cần Thơ",
      "phone": "092.483.397",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cần Thơ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cần Thơ",
        "phone": "092.483.397"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%E1%BA%A7n%20Th%C6%A1%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%E1%BA%A7n%20Th%C6%A1"
  },
  "570": {
    "id": 570,
    "productName": "Trà đinh lăng Cần Thơ - Đặc sản Cần Thơ (OCOP 4 sao)",
    "stars": 4,
    "region": "Cần Thơ",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Cần Thơ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cần Thơ",
    "certDecision": "QĐ số 1610/QĐ-UBND Tỉnh Cần Thơ (OCOP 4 Sao)",
    "hotline": "093.490.410",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cần Thơ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cần Thơ",
      "phone": "093.490.410",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cần Thơ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cần Thơ",
        "phone": "093.490.410"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%E1%BA%A7n%20Th%C6%A1%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%E1%BA%A7n%20Th%C6%A1"
  },
  "571": {
    "id": 571,
    "productName": "Khô nhái đóng gói - Đặc sản Cần Thơ (OCOP 4 sao)",
    "stars": 4,
    "region": "Cần Thơ",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Cần Thơ",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cần Thơ",
    "certDecision": "QĐ số 1633/QĐ-UBND Tỉnh Cần Thơ (OCOP 4 Sao)",
    "hotline": "094.497.423",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cần Thơ",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cần Thơ",
      "phone": "094.497.423",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cần Thơ",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cần Thơ",
        "phone": "094.497.423"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%E1%BA%A7n%20Th%C6%A1%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%E1%BA%A7n%20Th%C6%A1"
  },
  "572": {
    "id": 572,
    "productName": "Khô cá thát lát Hậu Giang - Đặc sản Hậu Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "Hậu Giang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hậu Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hậu Giang",
    "certDecision": "QĐ số 1724/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.504.436",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hậu Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hậu Giang",
      "phone": "095.504.436",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hậu Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hậu Giang",
        "phone": "095.504.436"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%ADu%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%ADu%20Giang"
  },
  "573": {
    "id": 573,
    "productName": "Trà mãng cầu Hậu Giang nguyên chất - Đặc sản Hậu Giang (OCOP 5 sao)",
    "stars": 5,
    "region": "Hậu Giang",
    "producerName": "HTX Nông nghiệp & Dược liệu Danh trà Hậu Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hậu Giang",
    "certDecision": "QĐ số 1741/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "096.511.449",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hậu Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hậu Giang",
      "phone": "096.511.449",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hậu Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hậu Giang",
        "phone": "096.511.449"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%ADu%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%ADu%20Giang"
  },
  "574": {
    "id": 574,
    "productName": "Khóm Cầu Đúc sấy dẻo - Đặc sản Hậu Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "Hậu Giang",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Hậu Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hậu Giang",
    "certDecision": "QĐ số 1702/QĐ-UBND Tỉnh Hậu Giang (OCOP 4 Sao)",
    "hotline": "097.518.462",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hậu Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hậu Giang",
      "phone": "097.518.462",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hậu Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hậu Giang",
        "phone": "097.518.462"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%ADu%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%ADu%20Giang"
  },
  "575": {
    "id": 575,
    "productName": "Mật ong hoa tràm U Minh - Đặc sản Hậu Giang (OCOP 4 sao)",
    "stars": 4,
    "region": "Hậu Giang",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Hậu Giang",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hậu Giang",
    "certDecision": "QĐ số 1725/QĐ-UBND Tỉnh Hậu Giang (OCOP 4 Sao)",
    "hotline": "098.525.475",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Hậu Giang",
      "address": "Đại lộ Trung tâm Hành chính, TP. Hậu Giang",
      "phone": "098.525.475",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Hậu Giang",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Hậu Giang",
        "phone": "098.525.475"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20H%E1%BA%ADu%20Giang%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20H%E1%BA%ADu%20Giang"
  },
  "576": {
    "id": 576,
    "productName": "Gạo ST25 Sóc Trăng chính hãng Hồ Quang Trí - Đặc sản Sóc Trăng (OCOP 5 sao)",
    "stars": 5,
    "region": "Sóc Trăng",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Sóc Trăng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Sóc Trăng",
    "certDecision": "QĐ số 1792/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.532.488",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Sóc Trăng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sóc Trăng",
      "phone": "090.532.488",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sóc Trăng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sóc Trăng",
        "phone": "090.532.488"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C3%B3c%20Tr%C4%83ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C3%B3c%20Tr%C4%83ng"
  },
  "577": {
    "id": 577,
    "productName": "Bánh pía Sóc Trăng - Đặc sản Sóc Trăng (OCOP 5 sao)",
    "stars": 5,
    "region": "Sóc Trăng",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Sóc Trăng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Sóc Trăng",
    "certDecision": "QĐ số 1809/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "091.539.501",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Sóc Trăng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sóc Trăng",
      "phone": "091.539.501",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sóc Trăng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sóc Trăng",
        "phone": "091.539.501"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C3%B3c%20Tr%C4%83ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C3%B3c%20Tr%C4%83ng"
  },
  "578": {
    "id": 578,
    "productName": "Lạp xưởng tôm Sóc Trăng - Đặc sản Sóc Trăng (OCOP 4 sao)",
    "stars": 4,
    "region": "Sóc Trăng",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Sóc Trăng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Sóc Trăng",
    "certDecision": "QĐ số 1794/QĐ-UBND Tỉnh Sóc Trăng (OCOP 4 Sao)",
    "hotline": "092.546.514",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Sóc Trăng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sóc Trăng",
      "phone": "092.546.514",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sóc Trăng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sóc Trăng",
        "phone": "092.546.514"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C3%B3c%20Tr%C4%83ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C3%B3c%20Tr%C4%83ng"
  },
  "579": {
    "id": 579,
    "productName": "Bánh phồng tôm Miệt Thứ - Đặc sản Sóc Trăng (OCOP 4 sao)",
    "stars": 4,
    "region": "Sóc Trăng",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Sóc Trăng",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Sóc Trăng",
    "certDecision": "QĐ số 1817/QĐ-UBND Tỉnh Sóc Trăng (OCOP 4 Sao)",
    "hotline": "093.553.527",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Sóc Trăng",
      "address": "Đại lộ Trung tâm Hành chính, TP. Sóc Trăng",
      "phone": "093.553.527",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Sóc Trăng",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Sóc Trăng",
        "phone": "093.553.527"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20S%C3%B3c%20Tr%C4%83ng%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20S%C3%B3c%20Tr%C4%83ng"
  },
  "580": {
    "id": 580,
    "productName": "Muối hạt / Muối tinh Bạc Liêu - Đặc sản Bạc Liêu (OCOP 5 sao)",
    "stars": 5,
    "region": "Bạc Liêu",
    "producerName": "Cơ sở Chế biến Gia vị Truyền thống Bạc Liêu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bạc Liêu",
    "certDecision": "QĐ số 1860/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "094.560.540",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bạc Liêu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bạc Liêu",
      "phone": "094.560.540",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bạc Liêu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bạc Liêu",
        "phone": "094.560.540"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%A1c%20Li%C3%AAu%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%A1c%20Li%C3%AAu"
  },
  "581": {
    "id": 581,
    "productName": "Gạo Nếp thơm Bạc Liêu tuyển chọn - Đặc sản Bạc Liêu (OCOP 5 sao)",
    "stars": 5,
    "region": "Bạc Liêu",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bạc Liêu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bạc Liêu",
    "certDecision": "QĐ số 1877/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "095.567.553",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bạc Liêu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bạc Liêu",
      "phone": "095.567.553",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bạc Liêu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bạc Liêu",
        "phone": "095.567.553"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%A1c%20Li%C3%AAu%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%A1c%20Li%C3%AAu"
  },
  "582": {
    "id": 582,
    "productName": "Bánh phồng tôm Bạc Liêu - Đặc sản Bạc Liêu (OCOP 4 sao)",
    "stars": 4,
    "region": "Bạc Liêu",
    "producerName": "HTX Nông nghiệp Dịch vụ Bản địa Bạc Liêu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bạc Liêu",
    "certDecision": "QĐ số 1886/QĐ-UBND Tỉnh Bạc Liêu (OCOP 4 Sao)",
    "hotline": "096.574.566",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bạc Liêu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bạc Liêu",
      "phone": "096.574.566",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bạc Liêu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bạc Liêu",
        "phone": "096.574.566"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%A1c%20Li%C3%AAu%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%A1c%20Li%C3%AAu"
  },
  "583": {
    "id": 583,
    "productName": "Khô cá lóc đồng Bạc Liêu - Đặc sản Bạc Liêu (OCOP 4 sao)",
    "stars": 4,
    "region": "Bạc Liêu",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Bạc Liêu",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Bạc Liêu",
    "certDecision": "QĐ số 1909/QĐ-UBND Tỉnh Bạc Liêu (OCOP 4 Sao)",
    "hotline": "097.581.579",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Bạc Liêu",
      "address": "Đại lộ Trung tâm Hành chính, TP. Bạc Liêu",
      "phone": "097.581.579",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Bạc Liêu",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Bạc Liêu",
        "phone": "097.581.579"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20B%E1%BA%A1c%20Li%C3%AAu%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20B%E1%BA%A1c%20Li%C3%AAu"
  },
  "584": {
    "id": 584,
    "productName": "Tôm khô Cà Mau loại - Đặc sản Cà Mau (OCOP 5 sao)",
    "stars": 5,
    "region": "Cà Mau",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Cà Mau",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cà Mau",
    "certDecision": "QĐ số 1928/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "098.588.592",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cà Mau",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cà Mau",
      "phone": "098.588.592",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cà Mau",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cà Mau",
        "phone": "098.588.592"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%C3%A0%20Mau%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%C3%A0%20Mau"
  },
  "585": {
    "id": 585,
    "productName": "Mật ong rừng U Minh Hạ nguyên chất 100% - Đặc sản Cà Mau (OCOP 5 sao)",
    "stars": 5,
    "region": "Cà Mau",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Cà Mau",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cà Mau",
    "certDecision": "QĐ số 1945/QĐ-TTg (OCOP 5 Sao Quốc Gia)",
    "hotline": "090.595.605",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cà Mau",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cà Mau",
      "phone": "090.595.605",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cà Mau",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cà Mau",
        "phone": "090.595.605"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%C3%A0%20Mau%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%C3%A0%20Mau"
  },
  "586": {
    "id": 586,
    "productName": "Khô cá bổi U Minh - Đặc sản Cà Mau (OCOP 4 sao)",
    "stars": 4,
    "region": "Cà Mau",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Cà Mau",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cà Mau",
    "certDecision": "QĐ số 1978/QĐ-UBND Tỉnh Cà Mau (OCOP 4 Sao)",
    "hotline": "091.602.618",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cà Mau",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cà Mau",
      "phone": "091.602.618",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cà Mau",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cà Mau",
        "phone": "091.602.618"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%C3%A0%20Mau%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%C3%A0%20Mau"
  },
  "587": {
    "id": 587,
    "productName": "Cua biển Cà Mau đóng thùng xốp vận chuyển xa - Đặc sản Cà Mau (OCOP 4 sao)",
    "stars": 4,
    "region": "Cà Mau",
    "producerName": "HTX Sản xuất Nông đặc sản An toàn Cà Mau",
    "producerAddress": "Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Cà Mau",
    "certDecision": "QĐ số 2001/QĐ-UBND Tỉnh Cà Mau (OCOP 4 Sao)",
    "hotline": "092.609.631",
    "primaryStore": {
      "name": "Showroom OCOP & Trưng bày Đặc sản Cà Mau",
      "address": "Đại lộ Trung tâm Hành chính, TP. Cà Mau",
      "phone": "092.609.631",
      "hours": "07:30 - 21:00"
    },
    "outlets": [
      {
        "name": "Điểm Giới thiệu & Bán SP OCOP Cà Mau",
        "address": "Trung tâm Hội chợ Triển lãm & Xúc tiến Thương mại Cà Mau",
        "phone": "092.609.631"
      },
      {
        "name": "Điểm OCOP Liên kết Phân phối tại Hà Nội & TP.HCM",
        "address": "Showroom OCOP TP.HCM: 459 Chu Văn An, P. 12, Q. Bình Thạnh, TP.HCM",
        "phone": "028.3899.6677"
      }
    ],
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Showroom%20OCOP%20%26%20Tr%C6%B0ng%20b%C3%A0y%20%C4%90%E1%BA%B7c%20s%E1%BA%A3n%20C%C3%A0%20Mau%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Trung%20t%C3%A2m%20H%C3%A0nh%20ch%C3%ADnh%2C%20TP.%20C%C3%A0%20Mau"
  }
};

  // IDs in the imported directory were reused for different products.
  // Publish only entries whose name AND province match the live shop catalogue.
  const shopProducts = typeof module === 'object' && module.exports
    ? require('./data.js').PRODUCTS : globalThis.PRODUCTS || [];
  const compatibleStores = Object.fromEntries(Object.entries(OCOP_STORE_MAP).filter(([id, entry]) => {
    const product = shopProducts.find(item => String(item.id) === id);
    return product && product.name === entry.productName && product.region === entry.region;
  }));

  function getOcopStoreInfo(productOrId) {
    if (!productOrId) return null;
    const id = typeof productOrId === 'object' ? productOrId.id : Number(productOrId);
    return compatibleStores[id] || null;
  }

  function getStoresByProvince(provinceName) {
    if (!provinceName) return [];
    const query = String(provinceName).toLowerCase().trim();
    return Object.values(compatibleStores).filter(item =>
      item.region.toLowerCase().includes(query)
    );
  }

  function searchStores(keyword) {
    if (!keyword) return Object.values(compatibleStores);
    const q = String(keyword).toLowerCase().trim();
    return Object.values(compatibleStores).filter(item =>
      item.productName.toLowerCase().includes(q) ||
      item.producerName.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.primaryStore.address.toLowerCase().includes(q)
    );
  }

  const MAJOR_OCOP_CENTERS = [
    {
      city: "Hà Nội",
      name: "Trung tâm Xúc tiến Thương mại & Trưng bày OCOP Quốc Gia",
      address: "Số 489 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
      hotline: "024.3755.8899",
      hours: "08:00 - 21:30"
    },
    {
      city: "Hà Nội",
      name: "Điểm Giới thiệu & Bán SP OCOP Big C Thăng Long",
      address: "Tầng 1, TTTM Big C Thăng Long, 222 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      hotline: "024.3784.8888",
      hours: "08:00 - 22:00"
    },
    {
      city: "TP. Hồ Chí Minh",
      name: "Trung tâm Trưng bày & Phân phối Sản phẩm OCOP Vùng Miền",
      address: "Số 459 Chu Văn An, Phường 12, Quận Bình Thạnh, TP. Hồ Chí Minh",
      hotline: "028.3899.6677",
      hours: "08:00 - 21:00"
    },
    {
      city: "Đà Nẵng",
      name: "Điểm Bán & Quảng bá OCOP Miền Trung - Tây Nguyên",
      address: "Số 08 Cách Mạng Tháng Tám, Quận Cẩm Lệ, TP. Đà Nẵng",
      hotline: "0236.388.9911",
      hours: "08:00 - 21:00"
    }
  ];

  return {
    STORE_MAP: compatibleStores,
    REFERENCE_STORE_MAP: OCOP_STORE_MAP,
    verificationStatus: 'unverified_reference',
    getOcopStoreInfo: getOcopStoreInfo,
    getStoresByProvince: getStoresByProvince,
    searchStores: searchStores,
    MAJOR_OCOP_CENTERS: MAJOR_OCOP_CENTERS
  };
}));
