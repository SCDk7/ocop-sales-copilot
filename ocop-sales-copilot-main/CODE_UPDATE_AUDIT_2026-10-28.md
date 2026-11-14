# Rà soát và đồng bộ giao diện — 28/10/2026

Đã lấy hai commit mới trên `origin/main` bằng fast-forward đến `4dbcb13` trước khi sửa, giữ các thay đổi Gemini đã lưu trong lịch sử Git.

## Các xung đột đã xử lý

- Tiêu đề HTML và các hàm đổi ngôn ngữ từng dùng nội dung khác nhau. Trang chính và trang chờ nay dùng “ĐẶC SẢN OCOP VIỆT NAM”, với chung từ điển dịch.
- Bỏ bản Tailwind tải hai lần và các bản font/icon CDN trùng với tài nguyên đã có trong dự án.
- Bỏ hai bộ kích thước chat cũ trong `style.css` và HTML. Kích thước chat được quản lý trong CSS dùng chung, giới hạn theo chiều rộng và chiều cao màn hình hiện tại.
- Giới hạn lại vị trí chat đã kéo khi đổi kích thước màn hình; xử lý màn hình ngang và chiều cao bàn phím qua `visualViewport`.
- Khôi phục liên kết `admin-management.css` bị mất sau cập nhật; thêm kiểm tra để tránh mất liên kết này lần nữa.
- Gỡ quy tắc toàn cục ép chiều cao mọi ảnh/SVG và biến mọi bảng thành block, vì chúng ghi đè kích thước riêng của từng thành phần.
- Khôi phục các class nối bố cục hai cột hero với CSS cân chiều cao; giữ bố cục xếp dọc trên điện thoại.
- Giữ một nút đăng nhập hiển thị, bỏ giao diện nút tương thích bị lặp; thanh điều hướng tự xuống hàng.
- Loại bỏ ô tính năng thứ tư đã ngừng dùng và dòng phụ nhỏ trong tiêu đề chat.
- Cập nhật mã phiên bản JS/CSS theo nội dung thực tế trên các trang để tránh tải lại tài nguyên cũ.

## Giao diện đặt hàng

Nền trang, khung voucher, tổng tiền, thông tin xác nhận và lựa chọn thanh toán chuyển sang xanh nhạt. Chữ dùng màu xanh đậm/đen; ô nhập trắng và nút chính xanh đậm. Bố cục co giãn cho màn hình nhỏ.

## Xác minh

- Bộ kiểm thử đầy đủ: **293/293 đạt**, bao gồm các bài voucher trước đây chưa được đưa vào lệnh `npm test`.
- Kiểm tra Chrome ở 320×568, 390×844, 768×1024, 1024×768, 1440×900, 1920×1080 và 844×390; kiểm tra thay đổi kích thước và xoay màn hình khi chat đang mở.
- Tiêu đề giữ đúng sau đổi Anh → Việt; nút đăng nhập mở được; giỏ hàng và danh sách điểm bán vừa khung điện thoại.
- Không ghi nhận ngoại lệ JavaScript trong các lượt kiểm tra giao diện trên.
- Hai trang `index.html` và `index_2.html` được đồng bộ cùng nội dung.
