# Bản tổng hợp code OCOP — 10/10/2026

Đã lấy `origin/main` tại commit `dab74d1` và gộp với các nâng cấp cục bộ. Bản lưu trước khi gộp nằm trong `.private-data/github-sync-backup-2026-10-10T05-37-48-728Z/`; file `.env` và dữ liệu riêng được giữ ngoài Git.

## Các giao diện

| Giao diện | Địa chỉ cục bộ | Chức năng |
| --- | --- | --- |
| Khách hàng | http://localhost:3000/ | Danh mục, lọc tỉnh, Gemini/Wikipedia, tư vấn theo ngân sách, ảnh, giọng nói, giỏ hàng và đặt hàng |
| Người bán | http://localhost:3000/admin | Cập nhật giá/tồn kho, duyệt đơn nháp và xử lý hội thoại chuyển giao; yêu cầu đăng nhập quản trị |
| KPI riêng | http://localhost:3002/ | Chỉ số từ backend, biểu đồ, lọc thời gian và xuất CSV |

Khởi động cửa hàng bằng `npm.cmd start`; khởi động KPI bằng `npm.cmd run start:kpi`.

## Các quyết định khi gộp

- Giữ các nâng cấp giao diện, lọc tỉnh và đọc câu trả lời bằng `voice-engine.js` từ GitHub. Nhập giọng nói tiếp tục dùng `ChatDictation` với backend Gemini.
- Giữ luồng Gemini hiện tại, ràng buộc ngân sách/địa phương, truy xuất hồ sơ sản phẩm, giá/tồn kho từ backend, đơn nháp và KPI thực tế.
- Giữ giỏ hàng khách hàng với số tiền hàng, mã ưu đãi và nút đặt hàng. Bảng tài chính minh họa có cửa sổ riêng và được đánh dấu mô phỏng.
- Không chèn lợi nhuận, chi phí vận hành hoặc tuyên bố đối soát giả vào câu trả lời khách hàng. Các API đề án/tài chính minh họa trả `dataMode: "simulation"`.
- Danh mục GitHub thay tên toàn bộ 252 sản phẩm nhưng tái sử dụng mã và ảnh của danh mục đang bán. Giữ danh mục bán hàng hiện tại để tránh gắn sai ảnh, tồn kho, đánh giá hoặc đơn hàng; lưu bản GitHub ở `data/imports/github-catalog-dab74d1.json` để đối chiếu trước khi nhập chính thức.
- Điểm bán chỉ được gắn vào sản phẩm khi tên và tỉnh khớp danh mục hiện hành. Dữ liệu điểm bán là tham khảo chưa xác minh; hiện không có bản ghi tương thích để công bố theo mã sản phẩm.
- Giữ cấu hình quyền terminal cục bộ; không nhập quy tắc cho phép mọi lệnh từ GitHub.

## Trạng thái đăng nhập

Google đã có cấu hình và nút mở được trang đăng nhập Google tại localhost. Facebook chưa có cấu hình, đang chờ chủ tài khoản hoàn tất xác minh nhà phát triển Meta. Hai nút hiển thị tiến trình và lỗi trực tiếp trong khung đăng nhập.

## Kiểm tra

- 139 bài kiểm tra tự động đều đạt; build CSS thành công.
- Kiểm tra trình duyệt ở chiều rộng 360, 390, 768 và 1280 px, tiếng Việt/Anh: không tràn ngang, không lỗi JavaScript.
- Chọn Đồng Nai từ trạng thái miền Bắc trả đúng 4 sản phẩm Đồng Nai; giỏ hàng hiển thị đúng tổng tiền và nút đặt hàng.
- Kiểm tra bấm Google/Facebook ở cả đăng nhập và đăng ký, cùng khả năng bấm lại khi mất kết nối.
- Backend khởi động lại thành công; API đơn nháp/hội thoại quản trị yêu cầu xác thực; KPI riêng hoạt động ở cổng 3002.

Bản tổng hợp được lưu trong repository cục bộ. Chưa đẩy lên GitHub hoặc triển khai bản tổng hợp lên hosting.
