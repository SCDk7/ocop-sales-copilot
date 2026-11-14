# Danh mục mới từ chủ shop, ngày 07/10/2026

252 sản phẩm thuộc 63 tỉnh/thành theo cách chia của nguồn: Bắc 100, Trung & Tây Nguyên 76, Nam & ĐBSCL 76. Mỗi tỉnh có đúng hai mục 5 sao và hai mục 4 sao theo danh sách cung cấp. Sao và giá chưa được xác minh độc lập.

Nguồn nguyên văn: catalog-63-provinces-source.txt. data.js là danh mục duy nhất dùng cho máy tính, điện thoại, giỏ hàng, bộ lọc và chatbot. Tất cả ID cũ đã được thay, không dùng lại ID cũ cho món khác. Tên, đơn vị và sao được thay kể cả món trùng. Theo yêu cầu mới, mỗi món chỉ dùng một mức giá cao nhất trong danh sách gốc; price, priceMin, priceMax và origPrice đều bằng mức này. Khoảng giá gốc chỉ lưu trong hồ sơ nguồn, không hiển thị trên website hoặc chat. Giỏ hàng/combo tính giá tham khảo theo mức cao nhất; cần xác nhận giá và quy cách trước khi đặt hàng.

Danh mục có đủ 252 ảnh web lưu cục bộ. Đã thay 34 ảnh chờ theo yêu cầu chọn ảnh gần nhất với tên món: 6 ảnh khớp sản phẩm/nhà sản xuất/địa phương và 28 ảnh minh họa có nhãn riêng, chưa xác minh đúng nhà sản xuất hoặc quy cách. Không dùng ảnh AI. catalog-latest-image-sources.json lưu URL nguồn, ảnh và ghi chú kiểm tra; catalog-latest-pending-photos.json hiện trống. Bao bì hoặc dạng chế biến của ảnh minh họa có thể khác sản phẩm thực tế. Các file catalog-before-* chỉ là hồ sơ đối chiếu.

Tái tạo: node data/imports/replace-catalog-latest.cjs. Script nhận ảnh đã kiểm tra với trạng thái reviewed_matching_photo hoặc reviewed_reference_photo; loại sau được gắn imageIllustrative; kiểm tra đủ 252 dòng, tên tiếng Anh khớp tên gốc, ID ổn định và file ảnh tồn tại. Script thay dữ liệu cũ đã bị chặn để tránh ghi đè nhầm phiên bản. catalog-latest-english.json lưu bản dịch tên và đơn vị.

Nhãn Bán chạy: catalog-latest-bestsellers.json lưu các món tương ứng với nhãn nổi bật trước khi thay danh mục. Builder đối chiếu dòng, tên và tỉnh rồi ghi isBestSeller vào data.js; website đọc thuộc tính này, không suy ra từ sao hay điểm đánh giá. Đây là danh sách trưng bày của shop, không tạo số lượng bán hoặc đánh giá giả. Món cũ không còn tương ứng trong danh mục mới không được gắn nhãn.

Chat đọc toàn bộ lịch sử và ưu tiên yêu cầu mới. Combo được tính trực tiếp từ danh mục, đúng số món/vùng/ngân sách, không phụ thuộc API ngoài. Gemini và Wikipedia đã có kiểm tra kết nối thật. Google Search được nối bằng công cụ google_search của Gemini, có nguồn HTTPS và khung Search Suggestions riêng; thử nghiệm hiện bị HTTP 429 nên chưa xác nhận truy vấn Google Search thành công. Không gửi câu hỏi kèm thông tin riêng tư, ảnh, khiếu nại hay combo đã tính được ra Google/Wikipedia. Nguồn Wiki nhầm tên người hoặc vùng không liên quan bị loại. Không bịa giấy chứng nhận, QR, giá hay thông tin sản phẩm khi API không hoạt động.

Tài liệu tích hợp: https://ai.google.dev/gemini-api/docs/google-search

Kiểm tra: npm.cmd test (21 bài). Kiểm tra trình duyệt ở 390×844 và 1440×900: đủ món, số vùng, Việt/Anh, xem nhanh, ảnh tải được, không tràn ngang. Chat API đã thử combo 5 món Tây Nguyên 4 triệu, rồi đổi thành 4 món 2 triệu; tổng tiền đúng và câu hỏi về trà Phìn Hồ được Gemini trả lời với Wikipedia.
