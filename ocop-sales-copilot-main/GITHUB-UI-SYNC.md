# Đồng bộ GitHub và giao diện ngày 26/10/2026

Nguồn: https://github.com/SCDk7/ocop-sales-copilot

Commit: `60df83b5ccdfb0d1bd4b96db81f65c5dbcab15eb`.

Đã cập nhật `index.html`, `index_2.html`, `skytech-complete.css` và `skytech-complete.js` dựa trên bản GitHub, giữ các cập nhật bản đồ, video TikTok, modal tài chính, bảng quản trị doanh thu và footer.

Đã ghép lại các chỉnh sửa giao diện cục bộ:

- Bỏ dòng mô tả dưới thương hiệu, hướng dẫn lọc tỉnh, nút tìm điểm bán O2O và banner đăng ký điểm bán.
- Đổi nút đầu trang thành “Vào trang”.
- Tiêu đề hai dòng, không có dấu phẩy.
- Ba dòng phụ từ ngắn đến dài, thụt dần theo bậc thang và cách tiêu đề chính.
- Tăng độ đậm chữ và viền nút phân hệ, thông tin cuối màn hình mở đầu.
- Giữ bảng màu nền cục bộ và liên kết `dark-theme.css`.

Giữ các tệp dữ liệu, script Excel, cấu hình package và tệp riêng cục bộ. Các tệp ứng dụng còn lại đã được so sánh và trùng với bản GitHub sau khi chuẩn hóa xuống dòng; không thay thế `node_modules` bằng bản trong repo.

Bản sao trước khi ghép: `scratch/backup-before-github-ui-20261026/`.

Kiểm tra: `npm.cmd test` đạt 159/159; kiểm tra cú pháp JavaScript bên ngoài và trong HTML; đối chiếu hai trang HTML và các phần giao diện đã yêu cầu.

Chỉ cập nhật workspace cục bộ; chưa đẩy lên GitHub hoặc triển khai.
