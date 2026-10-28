# Tra cứu web cho chatbot OCOP

Các câu hỏi công khai về sản phẩm, đặc sản vùng miền và quà biếu được đưa qua bước Google Search, kể cả câu trả lời từ danh mục và FAQ có sẵn. Ảnh được tra cứu sau khi có tên hoặc loại sản phẩm để đối chiếu.

- Ưu tiên cổng thông tin OCOP của nhà nước, nguồn nhà sản xuất được đối chiếu và báo chí uy tín.
- Chỉ hiển thị nguồn thực sự do kết quả tìm kiếm trả về. Không coi Wikipedia hoặc nội dung mô hình tự sinh là bằng chứng đã tìm Google.
- Giá cửa hàng lấy từ danh mục; giá web là tham khảo. Nếu chứng nhận trên nguồn chính thống khác danh mục, cần nêu rõ sự khác biệt.
- Câu hỏi về tài khoản, mã đơn, khiếu nại, số điện thoại, địa chỉ và dữ liệu cá nhân không được gửi lên tìm kiếm công khai.
- Nếu công cụ lỗi hoặc không có nguồn, chatbot báo thiếu xác minh và chỉ cung cấp dữ liệu cơ bản đã có.

## Cấu hình backend

Thiết lập `GEMINI_API_KEY` hợp lệ có quyền sử dụng Gemini API và công cụ Google Search trong `.env` của máy chạy hoặc biến môi trường của dịch vụ triển khai. Không đưa khóa vào HTML/JavaScript phía trình duyệt hoặc commit lên GitHub.

`GEMINI_SEARCH_MODEL` là tùy chọn chọn mô hình riêng cho tra cứu; mặc định dùng `GEMINI_MODEL` của dự án. Sau khi cập nhật biến môi trường cần khởi động lại backend.

Phản hồi có `webResearch` để phân biệt `success`, `no_results`, `not_configured`, `http_401` và lỗi tạm thời. `googleSources` chỉ chứa nguồn từ một lần tìm kiếm có bằng chứng thực thi công cụ và có kết quả sử dụng được.

Ở lượt kiểm tra ngày 28/10/2026, yêu cầu trực tiếp bằng cấu hình cục bộ trả HTTP 401. Vì vậy chưa xác nhận được tra cứu trực tiếp hoạt động; cần kiểm tra khóa/quyền truy cập của dịch vụ. Các kiểm thử dùng dữ liệu mô phỏng không thay thế việc kiểm tra kết nối thật.
