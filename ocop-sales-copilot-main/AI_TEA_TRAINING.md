# Kho kiến thức tư vấn trà OCOP

Chatbot dùng `data.js` để kiểm tra tên, giá, số sao, vùng miền và quy cách trước khi trả lời. Câu chuyện và hướng dẫn bảo quản là nội dung do chủ shop cung cấp trong `data/tea-knowledge.json`, không phải kết quả xác minh độc lập.

## Nội dung đã tích hợp

- Trà xanh cổ thụ Phìn Hồ: nguồn gốc, vị trà, bảo quản khô ráo, tránh nắng, hộp 100g hút chân không; hạn dùng 24 tháng theo thông tin shop, đối chiếu nhãn thực tế.
- Trà Actiso Sa Pa: nguồn nguyên liệu Hoàng Liên Sơn, dạng túi lọc; công dụng sức khỏe cần tài liệu nhãn xác nhận.
- Trà Phúc / Trà Lộc / Trà Thọ và Hồng trà Phìn Hồ: gợi ý quà biếu, lấy giá và sao hiện tại trong danh mục.

## Kịch bản mẫu

**Khách:** Trà xanh cổ thụ Phìn Hồ mấy sao OCOP? Giá bao nhiêu?

**Chatbot:** Nêu tên, số sao và giá hiện tại từ danh mục; giới thiệu nguồn nguyên liệu, vị chát dịu và hậu ngọt; hỏi khách cần xem ảnh hoặc tư vấn quà biếu.

**Khách:** Shop có trà nào thích hợp làm quà biếu cao cấp?

**Chatbot:** Gợi ý các dòng trà có trong danh mục, đúng điều kiện khách đưa ra; hỏi ngân sách nếu chưa rõ. Không tự thêm chính sách giảm giá.

**Khách:** Có gửi đi tỉnh hoặc nước ngoài không?

**Chatbot:** Hỏi sản phẩm, số lượng, nơi nhận để shop xác nhận khả năng giao, phí, thời gian và đóng gói. Gửi nước ngoài cần kiểm tra điều kiện trước khi cam kết.

## Cập nhật

1. Sửa giá và sao trong `data.js`; không chép giá cố định vào câu trả lời mẫu.
2. Sửa câu chuyện, bảo quản và tên gọi tương đương trong `data/tea-knowledge.json`. Hồ sơ phải khớp cả ID và tên sản phẩm.
3. Chạy `node scripts/build-tea-knowledge.cjs` để đồng bộ dữ liệu cho trình duyệt.
4. Khởi động lại server và tải lại trang. FAQ hoạt động bằng dữ liệu ngay cả khi dịch vụ AI chưa có hạn mức sử dụng.

Đây là kho kiến thức được tra cứu khi trả lời; không phải quá trình huấn luyện lại trọng số mô hình và chưa tự tải tài liệu lên Biglead.
