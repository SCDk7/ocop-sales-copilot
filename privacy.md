# Thông tin quyền riêng tư OCOP Sales

Dữ liệu website xử lý, nơi lưu trữ và các lựa chọn của người sử dụng.

## Phạm vi tài liệu

Đây là bản mô tả kỹ thuật để chủ dự án xem xét trước khi công bố chính sách chính thức. Nội dung phản ánh các chức năng đang có trong mã nguồn, không phải cam kết tuân thủ pháp luật hay danh tính pháp nhân đã được xác minh. Kênh tiếp nhận yêu cầu về dữ liệu và thời hạn lưu trữ chính thức cần được chủ dự án xác nhận.

## Dữ liệu được sử dụng

Đăng ký và đăng nhập sử dụng thông tin tài khoản, tên và số điện thoại hoặc thông tin do dịch vụ đăng nhập trả về. Tạo đơn cần thông tin người nhận, số điện thoại, địa chỉ giao hàng và sản phẩm đặt mua. Hệ thống còn có thể xử lý nội dung trò chuyện, hình ảnh sản phẩm hoặc âm thanh khi bạn chủ động dùng chức năng tương ứng. Mật khẩu được lưu dưới dạng băm thay vì nội dung rõ.

## Lưu trữ trên trình duyệt và máy chủ

Trình duyệt dùng localStorage và sessionStorage cho phiên đăng nhập, tùy chọn, giỏ hàng và trạng thái giao diện. Khách chưa đăng nhập được đặt lại chat và giỏ hàng khi tải lại; tài khoản đã đăng nhập có cơ chế lưu và khôi phục dữ liệu. Máy chủ lưu dữ liệu tài khoản và đơn hàng, cùng dữ liệu cần thiết cho các chức năng được bật. Mã chống tạo đơn trùng có thời hạn lưu kết quả ít nhất 24 giờ; việc hết hạn mã này không đồng nghĩa xóa đơn hàng.

## Dịch vụ bên ngoài

Tùy cấu hình của máy chủ, câu hỏi, ảnh hoặc âm thanh có thể được gửi tới nhà cung cấp AI để xử lý. Đăng ký qua SMS, đăng nhập qua dịch vụ bên ngoài, bản đồ và hiển thị QR cũng có thể liên quan đến dịch vụ tương ứng. Website không yêu cầu bạn cung cấp mật khẩu hoặc mã OTP ngân hàng cho chatbot. Không đưa dữ liệu riêng tư không cần thiết vào ảnh hay nội dung tư vấn.

## Lựa chọn và yêu cầu của bạn

Bạn có thể đăng xuất và xóa dữ liệu trình duyệt trên thiết bị của mình. Việc này không tự xóa dữ liệu đã lưu trên máy chủ. Nếu muốn kiểm tra, sửa hoặc yêu cầu xử lý dữ liệu máy chủ, hãy liên hệ CSKH qua website; quy trình và thời hạn giải quyết cần được đơn vị vận hành công bố. Thời hạn lưu ảnh, âm thanh, hội thoại và đơn hàng cần được chủ dự án hoàn thiện trước khi đưa chính sách vào sử dụng chính thức.

## Đọc thêm

- [OCOP Sales — Đặc sản và nông sản OCOP Việt Nam](https://ocop-sales-copilot.onrender.com/)
- [Giới thiệu OCOP Sales](https://ocop-sales-copilot.onrender.com/about)
- [Liên hệ và hỗ trợ OCOP Sales](https://ocop-sales-copilot.onrender.com/contact)
- [Thông tin đặt hàng OCOP Sales](https://ocop-sales-copilot.onrender.com/terms)
- [Danh mục đặc sản và nông sản OCOP](https://ocop-sales-copilot.onrender.com/catalog)
- [Hướng dẫn cho agent](https://ocop-sales-copilot.onrender.com/llms.txt)
