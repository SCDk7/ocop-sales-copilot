# Ảnh tham chiếu nội bộ cho chatbot OCOP

Kho dữ liệu phục vụ chatbot tự đối chiếu ảnh rồi trả lời tên sản phẩm, giá và mức khớp; không đưa link Google Images cho khách và không thay ảnh trên thẻ sản phẩm.

## Dữ liệu ngày 29/10/2026

- 252 sản phẩm khớp đúng ID, tên và địa phương trong `data.js`.
- 252 truy vấn Google Images nhập từ `Danh_Sach_SanPham_Ocop_Kem_Link_Anh.xlsx`, lưu tại `data/product-image-search-input.json`, có SHA-256 của file nguồn.
- 2.848 kết quả tìm ảnh đã ghi nhận tại `data/imports/chatbot-image-search-20261028/` được tái sử dụng; không tuyên bố vừa tìm mới toàn bộ.
- Sau lọc loại sản phẩm, nguồn và trùng URL: 2.136 ảnh tham chiếu có kết quả tìm kiếm gốc.
- Giữ 503 lượt gắn ảnh đã tải, tương ứng 495 tệp khác nhau; đủ ảnh đã tải cho cả 252 sản phẩm.
- Đã loại 7.864 URL được script cũ tự ghép từ tên sản phẩm để đủ mốc 10.000. Các URL đó không có kết quả tìm ảnh gốc nên không được dùng làm tri thức.

## Cách chatbot sử dụng

1. `ai-image-match.js` kiểm tra ảnh danh mục và ảnh tham chiếu đã tải, xác minh mã băm, đối chiếu nhãn/loại sản phẩm khi có kết quả nhận diện.
2. Chỉ so khớp trong hồ sơ có đúng ID, tên và địa phương. Không nhận diện ảnh từ tên tệp hoặc lời chú thích.
3. `ai-visual-reply.js` trả lời sản phẩm gần nhất, giá/đơn vị từ danh mục hiện tại và mức khớp. Không tự tạo điểm phần trăm, không suy ra chứng nhận hoặc nguồn gốc từ ảnh tương tự.
4. Link tìm kiếm trong Excel chỉ phục vụ tra cứu nội bộ; không phải ảnh trực tiếp hoặc bằng chứng nhận diện. Khi chưa nhận diện được, chatbot hỏi ảnh nhãn rõ hơn, không đoán sản phẩm.

## Cập nhật

```powershell
node scripts/import-product-image-searches.cjs "C:\duong-dan\Danh_Sach_SanPham_Ocop_Kem_Link_Anh.xlsx"
node scripts/build-product-image-knowledge.js
node --test product-image-references.test.js image-chat.test.js
```

Lệnh build chỉ tái lập kho từ kết quả tìm ảnh đã ghi nhận, giữ ảnh tải sẵn và gắn truy vấn Excel đúng sản phẩm. Nó không tải trang Google hoặc tự sinh URL ảnh. Muốn bổ sung ảnh mới, ghi nhận kết quả tìm ảnh thật vào các batch trước khi build; chỉ dùng ảnh tải được khi cần đối chiếu byte. Điểm liên quan của kết quả tìm kiếm không phải phần trăm khớp ảnh của khách.
