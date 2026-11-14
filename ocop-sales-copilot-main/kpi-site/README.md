# Website KPI OCOP độc lập

Giao diện hoàn chỉnh nằm trong **`kpi.html`**: HTML, CSS và JavaScript được đóng gói cùng một file. Website chỉ hiển thị KPI, không có giỏ hàng hoặc liên kết quay về cửa hàng.

## Chạy website

Từ thư mục dự án chính:

```powershell
npm.cmd run start:kpi
```

Hoặc vào riêng thư mục này:

```powershell
cd kpi-site
node server.cjs
```

Mở **http://localhost:3002/** hoặc **http://localhost:3002/kpi.html**.

Máy chủ KPI dùng thư viện có sẵn của Node.js 22 trở lên, không cần cài Express hoặc thư viện biểu đồ. Có thể sao chép nguyên thư mục `kpi-site` sang dự án khác và chạy độc lập. Backend cửa hàng cần hoạt động để cung cấp số liệu thực; website vẫn mở được khi backend ngừng, nhưng hiển thị lỗi kết nối và không tự tạo số liệu.

## File code

- `kpi.html`: toàn bộ giao diện trong một file, được tạo từ các file nguồn bên dưới.
- `public/index.html`: bố cục và nội dung Việt/Anh.
- `public/dashboard.css`: giao diện điện thoại/máy tính.
- `public/dashboard.js`: số liệu, biểu đồ SVG, chọn thời gian, ngôn ngữ và xuất CSV.
- `build.cjs`: đóng gói giao diện; chạy `node build.cjs` sau khi chỉnh các file nguồn.
- `server.cjs`: phục vụ website riêng và lấy số liệu từ backend; tự build giao diện khi khởi động.

Không sửa trực tiếp `kpi.html` nếu muốn giữ thay đổi sau lần build tiếp theo. File này có thể mở để xem giao diện, nhưng số liệu trực tiếp cần chạy qua máy chủ thay vì mở bằng `file://`.

## Cấu hình backend hoặc hosting

Thiết lập biến môi trường trước khi chạy:

```powershell
$env:KPI_PORT = '3002'
$env:OCOP_METRICS_URL = 'http://localhost:3000/api/ai/metrics'
node server.cjs
```

Khi triển khai thành một dịch vụ web Node riêng, đặt `OCOP_METRICS_URL` thành API của backend đang chạy trên HTTPS. Máy chủ hỗ trợ biến `PORT` của hosting nếu chưa đặt `KPI_PORT`. Đường dẫn kiểm tra hoạt động: `/health`.

`.env.example` là mẫu tên biến; server không tự đọc file `.env` của cửa hàng và không sử dụng khóa Gemini/OAuth. Chỉ dữ liệu tổng hợp được gửi tới trình duyệt. Giới hạn thời gian lấy số liệu: 5 giây. Đường dẫn ngoài website và API KPI trả 404.

## Các chỉ số

Có lọc hôm nay / 7 ngày / 30 ngày / lịch sử lưu giữ, 8 thẻ KPI, số liệu kinh doanh đã xác nhận, biểu đồ theo giờ, tỷ trọng sản phẩm và xuất CSV. Tự cập nhật mỗi 10 giây. Ngôn ngữ Việt/Anh được lưu riêng cho website KPI.

Doanh thu chỉ tính đơn được người bán xác nhận đã thu tiền, gồm phí giao. Đơn nháp chưa phải doanh thu. Tự phục vụ là ước tính; độ chính xác RAG chưa có dữ liệu kiểm thử gán nhãn thì hiển thị chưa đo. Không tích hợp đối soát ngân hàng tự động.

Backend lưu tối đa 90 ngày / 50.000 sự kiện; cần ổ đĩa bền vững khi triển khai. KPI không chứa tài khoản, nội dung chat, số điện thoại hoặc địa chỉ khách hàng.

## Kiểm tra

```powershell
npm.cmd test
```

Các kiểm tra xác nhận website hoạt động độc lập, chỉ chuyển tiếp khoảng thời gian hợp lệ, trả đúng số liệu backend, không công khai file cấu hình và không tạo số liệu khi backend mất kết nối.

Website KPI đã được xuất bản riêng tại **https://ocop-sales-copilot-kpi.onrender.com/**. Trang bán hàng tiếp tục ở **https://ocop-sales-copilot.onrender.com/**.

Render chạy KPI từ nhánh `main`, thư mục gốc `kpi-site`, build bằng `node build.cjs`, khởi động bằng `node server.cjs`, kiểm tra hoạt động tại `/health`. Biến `OCOP_METRICS_URL` trỏ tới `https://ocop-sales-copilot.onrender.com/api/ai/metrics`; `NODE_VERSION=22`. Dịch vụ dùng gói miễn phí.

Đã kiểm tra bản công khai: giao diện khớp file build, API trả dữ liệu thực, bộ lọc ngày/tuần hoạt động, 8 thẻ KPI hiển thị trên điện thoại/máy tính và tiếng Việt/Anh không tràn ngang. Sau khi cập nhật code, kiểm tra lại bằng `node scripts/verify-deployment.cjs https://ocop-sales-copilot-kpi.onrender.com --kpi` từ thư mục dự án chính.
