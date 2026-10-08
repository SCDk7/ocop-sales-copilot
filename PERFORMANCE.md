# Dựng CSS và tối ưu giao diện

Trang dùng `assets/tailwind.css` đã dựng sẵn, thay cho Tailwind chạy trong trình duyệt.
Sau khi thêm hoặc sửa các lớp Tailwind trong HTML/JavaScript, chạy:

```powershell
npm.cmd run build:css
```

Đưa cả CSS đã dựng và `index.html` lên máy chủ/GitHub Pages. Lệnh tự cập nhật mã phiên bản CSS để trình duyệt nhận bản mới. GitHub Pages dùng trực tiếp file đã dựng, không cần chạy Node.

Danh sách giữ đầy đủ sản phẩm nhưng trì hoãn vẽ các thẻ ngoài màn hình. Tìm kiếm chờ 140 ms sau lần gõ cuối để tránh dựng lại danh sách liên tục; nút xóa, bộ lọc và Enter vẫn cập nhật ngay. Hiệu ứng nền dừng khi đóng trang giới thiệu hoặc chuyển sang tab khác. Trên điện thoại, thẻ sản phẩm không chạy hiệu ứng xuất hiện và làm mờ nền.

Express cho phép lưu đệm tài nguyên có phiên bản và ảnh; HTML luôn kiểm tra cập nhật. API và dữ liệu tài khoản vẫn theo chính sách riêng của các tuyến tương ứng.

Chat gửi lịch sử và yêu cầu của khách, dùng danh mục chuẩn ở máy chủ thay vì tải lên lại 252 sản phẩm ở mỗi lượt. Lượt thử đầu tiên giảm phần thân yêu cầu từ 151.436 xuống 143 byte. Việc đồng bộ danh mục cũng dùng danh mục máy chủ.

Tra Wikipedia cho chủ đề công khai bắt đầu trong lúc Gemini hiểu câu hỏi. Chỉ dùng kết quả tra sớm nếu truy vấn cuối cùng trùng khớp; câu hỏi riêng tư và ảnh được bỏ qua như trước. Phản hồi AI không được lưu đệm dùng chung giữa khách hàng.

Leaflet tải bằng `defer`; GSAP và ScrollTrigger tải bất đồng bộ, chỉ khi thiết bị chạy hiệu ứng máy tính. Điện thoại không tải hai thư viện này. Đom đóm vẫn dùng phiên bản nhẹ trên thiết bị cảm ứng.

Đo sau thay đổi trên local ngày 08/10/2026: hai yêu cầu Gemini thật mất khoảng 3,5 và 3,9 giây. Đây là số đo thử nghiệm; thời gian thực tế phụ thuộc mạng, ảnh, độ dài hội thoại và dịch vụ AI.
