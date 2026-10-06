# Nhập danh mục OCOP từ danh sách chủ shop

- Bảng gốc có 126 dòng. Loại 24 dòng trùng với danh mục hiện có.
- Đã thêm 65 sản phẩm có ảnh đối chiếu phù hợp; 37 dòng còn lại được lưu trong `pending-products.csv` và `ocop-catalog-import.json` để kiểm tra tên/nhãn hàng/ảnh.
- Giá mới là mức cao nhất của khoảng giá tham khảo do chủ shop gửi. Dấu `+` được giữ theo ngưỡng số đã cho, không tự ước lượng phần vượt ngưỡng. Giá cũ của sản phẩm trùng không bị thay đổi.
- Số sao trong dữ liệu mới do chủ shop cung cấp; việc chọn ảnh không đồng nghĩa với xác nhận hiệu lực chứng nhận OCOP hiện tại.
- Không tạo giá gạch ngang, điểm đánh giá, số lượt đánh giá hoặc tuyên bố chữa bệnh cho sản phẩm mới.
- Dòng nhiều lựa chọn chỉ xuất bản món xác định được ảnh phù hợp. Tên gốc được giữ trong hồ sơ nhập. Ảnh mẫu có thể khác quy cách bao bì, nên quy cách bán được ghi trong mô tả và phần xem nhanh.
- `data.js` là nguồn dữ liệu chung cho website, server và chatbot. Không sao chép lại danh mục vào `index.html` hoặc tạo lại các file `.mjs` đã xóa.

Nguồn ảnh được ghi cho từng món tại `imageSource` trong hồ sơ nhập. Nguồn gồm [chuyên trang OCOP Nhân Dân](https://nhandan.vn/ocop/san-pham.html), trang nhà sản xuất, trang thương mại và bài giới thiệu đặc sản theo địa phương. Ảnh được tải về `images/catalog/`; ảnh JPEG/PNG được giảm kích thước khi có thể. Giao diện dùng lazy loading và hiển thị đầy đủ bao bì thay vì cắt ảnh.

Để bổ sung: hoàn thiện ảnh và tên sản phẩm trong hồ sơ, thêm tên tiếng Anh/quy cách vào `product-details.json`, rồi chạy `node data/imports/apply-import.cjs`. Công cụ nhập giữ nguyên ID 1–77 và tái tạo phần sản phẩm nhập theo thứ tự danh sách; nếu có giao dịch với sản phẩm nhập, cần giữ ổn định các ID đã xuất bản khi thay đổi thứ tự. Không chạy `prepare-import.cjs` để sửa giá riêng lẻ: script đó tái áp dụng toàn bộ bảng giá ban đầu.

Đã kiểm tra: cú pháp JavaScript và các script inline; giá khớp bảng nhập; ID không trùng; ảnh local tồn tại và được server phục vụ; API đồng bộ danh mục 142 sản phẩm; Chrome kích thước 390×844 với tìm kiếm, xem nhanh, chuyển Việt/Anh, thẻ gợi ý AI, cỡ chữ tìm kiếm 16px và không tràn ngang.
