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

Chat văn bản gộp hiểu yêu cầu và trả lời vào một lượt gọi Gemini Flash-Lite, mức suy nghĩ minimal. Wikipedia được tra cho chủ đề công khai từ ngữ cảnh hội thoại trước khi gọi Gemini, chờ tối đa một giây và chỉ đưa nguồn phù hợp vào lời nhắc. Câu hỏi riêng tư và ảnh không được gửi sang Wikipedia. Phản hồi AI không được lưu đệm dùng chung giữa khách hàng.

Leaflet tải bằng `defer`; GSAP và ScrollTrigger tải bất đồng bộ, chỉ khi thiết bị chạy hiệu ứng máy tính. Điện thoại không tải hai thư viện này. Đom đóm vẫn dùng phiên bản nhẹ trên thiết bị cảm ứng.

Đo trên local ngày 08/10/2026 với Gemini thật: hỏi món giá cao trả lời đúng trong 4.064 ms; hỏi ba combo tối đa sáu triệu trả lời trong 2.636 ms. Yêu cầu bốn món Tây Nguyên dưới năm triệu mất 3.119 ms; sửa sang món rẻ dưới 100k ở Long An mất 2.900 ms, đều giữ đúng giới hạn. Lượt kiểm tra cuối có một yêu cầu giá cao hết thời gian sau 5.125 ms và một yêu cầu combo thành công trong 3.071 ms. Máy chủ kiểm tra lại giá, tổng tiền và giới hạn của combo. Chat văn bản dừng chờ sau năm giây và báo thử lại nếu Gemini chưa trả lời; ảnh vẫn cần thời gian xử lý riêng. Đây là số đo thử nghiệm, không bảo đảm Google luôn trả lời thành công trong năm giây. Cấu hình GEMINI_MODEL trên host phải đổi sang gemini-3.1-flash-lite để dùng cùng bản thử.
