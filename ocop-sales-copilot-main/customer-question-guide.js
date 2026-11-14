(function (root) {
  'use strict';
  const shopping = typeof module === 'object' && module.exports ? require('./ai-shopping') : root.AIShopping;
  const normalize = shopping.normalize;
  const fold = value => normalize(value).replace(/[“”"']/g, '');
  const money = value => Number(value).toLocaleString('vi-VN') + ' đ';
  const productIndexes = new WeakMap();
  const patterns = [
    /nguon goc|giay chung nhan|ma (?:so )?chung nhan|hieu luc|qr truy xuat|vietgap|globalgap|kiem dinh|tem chong gia|logo ocop|dai ly trung gian|hop tac xa goc|chinh goc/,
    /tu nhien|chat bao quan|pham mau|ngay san xuat|han su dung|tieu duong|huyet ap|mang thai|tre nho|thanh phan|dinh duong|huong vi|danh gia cao/,
    /bao quan|khui hop|cach su dung|huong dan su dung|che bien|nhiet do phong|ngan mat|nong am|ben ngoai|may bay|hanh ly/,
    /vat|hoa don|chiet khau|mua si|ma giam gia|trong luong tinh|dinh luong|gia niem yet|cong tac vien|dai ly phan phoi/,
    /qua bieu|(?:dong hop|goi) qua|tui giay|thiep|gio qua|bao bi mau ma|che gia tien/,
    /giao ve|giao hang|shipper|phi van chuyen|doi tra|mop meo|hu hong|hoa toc|vietqr|momo|the tin dung|dong kiem/
  ];
  function findProduct(query, products, history = []) {
    const texts = [query, ...history.slice(-4).reverse().map(item => item.text || item.content || '')];
    let sorted = productIndexes.get(products);
    if (!sorted) {
      sorted = products.map(product => ({product, name:fold(product.name)}))
        .sort((a, b) => b.name.length - a.name.length);
      productIndexes.set(products, sorted);
    }
    for (const text of texts) {
      const q = fold(text);
      const found = sorted.find(row => row.name.length >= 8 && q.includes(row.name));
      if (found) return found.product;
    }
    return null;
  }
  function answer(query, products, language = 'vi', history = []) {
    if (language !== 'vi' || !Array.isArray(products) || !query) return null;
    const q = fold(query);
    if (!patterns.some(pattern => pattern.test(q))) return null;
    const product = findProduct(query, products, history);
    if (!product) return null;
    const name = product.name;
    const details = [];
    if (/mang thai|tre nho|tieu duong|huyet ap|benh nen|cong dung|chua benh/.test(q)) {
      details.push('Danh mục chưa có hướng dẫn sử dụng cho tình trạng sức khỏe này. Anh/chị kiểm tra nhãn và hỏi nhân viên y tế trước khi dùng.');
    } else if (/ngay san xuat|han su dung|lo hang/.test(q)) {
      details.push('Ngày sản xuất, hạn dùng và lô hàng hiện chưa được ghi nhận; cần xem nhãn của sản phẩm thực tế.');
    } else if (/thanh phan|dinh duong|tu nhien|chat bao quan|pham mau|huong vi/.test(q)) {
      details.push('Danh mục chưa xác nhận thành phần, hương vị hoặc cam kết không chất bảo quản; anh/chị nên đối chiếu nhãn sản phẩm.');
    } else if (/giay chung nhan|ma (?:so )?chung nhan|hieu luc|qr truy xuat|vietgap|globalgap|kiem dinh|tem chong gia|logo ocop/.test(q)) {
      details.push('Mức sao trong danh mục do cửa hàng cung cấp; hệ thống chưa lưu bản chứng nhận, thời hạn hiệu lực hoặc mã truy xuất để xác minh.');
    } else if (/nguon goc|hop tac xa goc|dai ly trung gian|chinh goc/.test(q)) {
      details.push(`Danh mục ghi xuất xứ ${product.region || 'chưa rõ'}; đường nhập hàng và hồ sơ chủ thể cần người bán xác nhận.`);
    } else if (/vat|hoa don|chiet khau|mua si|cong tac vien|dai ly phan phoi/.test(q)) {
      details.push('Thuế, hóa đơn và mức chiết khấu sỉ chưa có trong danh mục; nhân viên cần báo giá và xác nhận riêng.');
    } else if (/trong luong tinh|dinh luong/.test(q)) {
      details.push(`Quy cách bán ghi ${product.packaging || product.unit || 'chưa rõ'}; trọng lượng tịnh cần đối chiếu nhãn hoặc người bán xác nhận.`);
    } else if (/ma giam gia|khuyen mai/.test(q)) {
      details.push('Anh/chị xem ưu đãi đang hiển thị trên website; điều kiện áp dụng được kiểm tra tại bước đặt hàng.');
    } else if (/bao quan|khui hop|nhiet do phong|ngan mat|nong am|ben ngoai|cach su dung|huong dan su dung|che bien/.test(q)) {
      details.push('Hệ thống chưa có hướng dẫn bảo quản hoặc chế biến riêng cho món này. Anh/chị làm theo nhãn và hỏi người bán nếu nhãn chưa rõ.');
    } else if (/may bay|hanh ly|nuoc ngoai/.test(q)) {
      details.push('Quy định mang lên máy bay hoặc xuất cảnh tùy hãng bay và nơi đến; chưa thể xác nhận chỉ từ quy cách trong danh mục.');
    } else if (/qua bieu|(?:dong hop|goi) qua|tui giay|thiep|gio qua|che gia|bao bi/.test(q)) {
      details.push('Dịch vụ gói quà, thiệp và hình thức bao bì thực tế chưa được xác nhận cho sản phẩm này; nhân viên có thể kiểm tra trước khi đặt.');
    } else if (/phi van chuyen|giao ve|giao hang/.test(q)) {
      details.push('Dự kiến nội thành 1–2 ngày làm việc, ngoại thành 2–5 ngày sau khi bàn giao vận chuyển; phí và lịch thực tế cần xác nhận theo địa chỉ nhận.');
    } else if (/dong kiem|doi tra|mop meo|hu hong/.test(q)) {
      details.push('Nếu kiện hàng hư hỏng hoặc sai hàng, anh/chị giữ bao bì và mã đơn để nhân viên kiểm tra; chính sách đổi trả cần xác nhận theo đơn.');
    } else if (/hoa toc|ton kho|co san hang/.test(q)) {
      details.push('Tồn kho và giao hỏa tốc chưa được xác nhận; cần kiểm tra với người bán theo địa chỉ giao.');
    } else if (/vietqr|momo|the tin dung|thanh toan/.test(q)) {
      details.push('Trang đặt hàng hiển thị BIDV/VietQR, MoMo và COD ở chế độ dự án; thanh toán thực tế chỉ được xác nhận sau khi có đối soát.');
    } else {
      details.push('Hiện tại dữ liệu hệ thống chưa ghi nhận chi tiết này; nhân viên có thể kiểm tra giúp anh/chị.');
    }
    const price = Number(product.price);
    const facts = [
      `**${name}** · ${product.region || 'chưa rõ'}${product.stars ? ` · OCOP ${product.stars} sao theo danh mục` : ''}.`,
      Number.isFinite(price) && price > 0 ? `Giá niêm yết: ${money(price)} / ${product.packaging || product.unit || 'đơn vị'}.` : null
    ].filter(Boolean);
    const message = ['Dạ, ' + facts.join(' '), ...details, 'Anh/chị muốn xem sản phẩm hay cần em chuyển nhân viên kiểm tra thêm ạ?'].join('\n');
    return {message, text_response:message, productIds:[product.id], suggested_products:[product.id], combos:[], dynamic_chips:[], catalogChecked:true, knowledgeSource:'current_catalog', responseMode:'catalog_customer_question'};
  }
  function answerGeneralCompliance(query, language = 'vi') {
    const q=fold(query);
    const certificate=/giay chung nhan|chung nhan|chung chi|bao dam.*ocop|certificate|certification/.test(q);
    const tax=/\bvat\b|hoa don|thue gia tri gia tang|tax invoice/.test(q);
    if(!certificate&&!tax)return null;
    const messages={
      vi:`Dạ, ${certificate?'mức sao OCOP đang hiển thị theo danh mục cửa hàng; hệ thống chưa có bản chứng nhận để xác minh. ':''}${tax?'Thông tin VAT và hóa đơn chưa được ghi rõ cho từng sản phẩm. ':''}Quý khách cho em tên sản phẩm cụ thể để nhân viên kiểm tra giúp ạ?`,
      en:`Dạ, ${certificate?'OCOP ratings follow the store catalogue; a certificate copy is not available for verification. ':''}${tax?'VAT and invoice details are not recorded for each product. ':''}Which product should our staff check for you?`,
      zh:`Dạ，${certificate?'OCOP 星级以商家目录为准，目前没有证书副本可核验。':''}${tax?'各商品的增值税和发票信息尚未记录。':''}请告知商品名称，以便工作人员核实。`,
      ko:`Dạ, ${certificate?'OCOP 등급은 매장 목록 기준이며 확인할 인증서 사본은 없습니다. ':''}${tax?'상품별 부가세 및 영수증 정보는 기록되어 있지 않습니다. ':''}확인할 상품명을 알려주세요.`,
      ja:`Dạ、${certificate?'OCOPの星評価は店舗の掲載情報に基づき、確認できる証明書の写しはありません。':''}${tax?'商品ごとのVATと請求書情報は未登録です。':''}確認する商品名を教えてください。`
    };
    const message=messages[language]||messages.vi;
    return {message,text_response:message,productIds:[],suggested_products:[],combos:[],dynamic_chips:[],catalogChecked:true,knowledgeSource:'current_catalog',responseMode:'general_compliance'};
  }
  const api = {answer, answerGeneralCompliance, findProduct};
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OCOPCustomerQuestionGuide = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
