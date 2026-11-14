# Dữ liệu tài khoản và thanh toán

Máy chủ cấp phiên đăng nhập 30 ngày sau khi đăng nhập hoặc xác minh OTP đăng ký. Trình duyệt lưu token để khôi phục phiên; máy chủ chỉ lưu hash của token. Đăng xuất thu hồi phiên hiện tại.

Mỗi ID khách hàng có giỏ hàng, yêu thích, ngôn ngữ, 16 tin nhắn gần nhất của hội thoại AI và lịch sử đơn riêng. Thông tin tên, số điện thoại, email và địa chỉ tiếp tục lưu trong kho khách hàng. Giỏ của khách chưa đăng nhập được giữ trong trình duyệt và nhập vào tài khoản khi đăng nhập. Đổi hoặc đăng xuất tài khoản thay toàn bộ dữ liệu đang hiển thị.

Khách chưa đăng nhập phải đăng ký hoặc đăng nhập trước khi mở thanh toán. Sau đăng nhập, trang tiếp tục thanh toán. Máy chủ kiểm tra phiên, tính tiền theo danh mục gốc và kiểm tra voucher; khách không thể gửi giá tùy ý hoặc xác nhận đơn của tài khoản khác. Nút đã chuyển khoản ghi trạng thái **Chờ xác nhận BIDV**, không tự đánh dấu ngân hàng đã nhận tiền.

Các API `/api/auth/me`, `/api/auth/logout`, `/api/account/state`, `/api/orders` và `/api/orders/:id/payment-reported` dùng `Authorization: Bearer <token>`; ID người sở hữu lấy từ phiên đã xác thực. `/api/account/state` không nhận lịch sử đơn do trình duyệt tự ghi.

File mặc định: `.private-data/customers.json` và `.private-data/account-data.json`. Có thể đặt `CUSTOMERS_FILE` và `ACCOUNT_DATA_FILE` tới thư mục lưu trữ bền vững. Các file tồn tại qua khởi động lại máy chủ địa phương. Khi chạy trên Render, phải dùng persistent disk hoặc chuyển sang cơ sở dữ liệu để giữ dữ liệu qua redeploy; gói free hiện tại không có persistent disk. Không đưa dữ liệu khách hoặc token lên Git.

Luồng đăng ký vẫn yêu cầu SMS OTP và cấu hình Twilio hiện có. Nếu chưa cấu hình Twilio thì API đăng ký báo dịch vụ chưa sẵn sàng; hệ thống không bỏ xác minh số điện thoại.

Kiểm tra: `npm.cmd test` gồm kiểm tra kho tài khoản; kiểm tra HTTP độc lập và trình duyệt dùng tài khoản giả trong file riêng, không ghi dữ liệu thử vào kho khách hàng thật.
