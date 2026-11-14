# Mã sản phẩm dùng chung

Mã có đúng 7 ký tự: hai chữ cái nhóm và năm chữ số. Ví dụ `TD00336`.

| Nhóm danh mục | Tiền tố |
|---|---|
| tea — Thảo dược, trà | TD |
| gift — Quà tặng di sản | QT |
| food — Nông sản chế biến | NS |
| spice — Gia vị, hương liệu | GV |
| snack — Thực phẩm bản địa | TP |

Phần số là ID hiện tại được thêm số 0 ở đầu cho đủ năm chữ số, không phải vị trí trong danh sách. Sắp xếp, tìm kiếm hoặc đổi NPP không đổi mã. Giữ nguyên ID số làm khóa cho kho, giỏ hàng, ảnh và đơn hàng hiện có.

`product-codes.js` là quy tắc chung cho Node và trình duyệt. `data.js` lưu `productCode` cho mỗi sản phẩm. Chạy `node scripts/sync-product-codes.cjs` sau khi nhập danh mục mới; lệnh đồng bộ tài nguyên khi khởi động cũng thực hiện bước này trước khi cập nhật phiên bản file.

Kho và các dòng đơn mới nhận mã từ danh mục trên máy chủ, không nhận mã do trình duyệt tự gán. Đơn cũ chưa có mã được bổ sung khi đọc; không đổi sản phẩm, giá, số lượng, trạng thái hoặc quyền sở hữu của đơn. Admin và NPP dùng cùng mã, với bộ lọc nhóm và tìm theo mã/tên; dữ liệu NPP vẫn giới hạn trong phạm vi được giao.
