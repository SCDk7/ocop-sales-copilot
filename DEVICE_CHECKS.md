# Đối chiếu điện thoại và máy tính

Ngày kiểm tra: 08/10/2026. Kiểm tra trên Chrome với các kích thước màn hình giả lập, tại `http://localhost:3000`, bằng cả tiếng Việt và tiếng Anh.

| Màn hình | Kích thước | Kết quả |
| --- | --- | --- |
| Điện thoại nhỏ | 320 × 568 | Đạt |
| Điện thoại | 390 × 844 | Đạt |
| Điện thoại xoay ngang | 844 × 390 | Đạt |
| Máy tính bảng | 768 × 1024 | Đạt |
| Laptop | 1366 × 768 | Đạt |
| Máy tính | 1920 × 1080 | Đạt |

Ở cả 12 trường hợp kích thước/ngôn ngữ:

- Danh mục đủ 252 sản phẩm, 76 sản phẩm giảm giá và 76 giá gạch ngang.
- Không tràn trang theo chiều ngang.
- Khung chat, ô nhập, nút micro và nút gửi nằm trong màn hình.
- Cửa sổ sản phẩm, đăng nhập và giỏ hàng nằm trong màn hình.
- Không phát hiện ngoại lệ JavaScript trong quá trình kiểm tra.

Kiểm tra bổ sung:

- Tìm kiếm bằng tiếng Việt có dấu trả đúng kết quả; gõ liên tiếp chỉ dựng lại danh sách một lần. Xóa tìm kiếm phục hồi đủ sản phẩm.
- Giá gạch ngang hiển thị đúng trong cửa sổ sản phẩm giảm giá.
- Nhập giọng nói dùng kết quả nhận dạng mô phỏng: hiện văn bản, dừng khi đóng chat, không ghi đè từ kết quả đến muộn, chuyển đúng ngôn ngữ Việt/Anh. Các tình huống từ chối quyền micro và trình duyệt không hỗ trợ được kiểm tra tự động.
- 44 bài kiểm tra tự động đạt.

Phạm vi: kết quả trên bản local và màn hình giả lập, chưa xác nhận trên thiết bị thật hoặc bản đã triển khai. Chưa thử âm thanh micro thật. Lần gọi OpenAI thực tế gần nhất trả `credit_balance_exhausted`; cấu hình khóa đã được lưu phía máy chủ nhưng cần số dư API để sử dụng.
