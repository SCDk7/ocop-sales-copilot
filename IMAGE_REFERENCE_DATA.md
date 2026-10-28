# Dữ liệu 10.000 ảnh tham chiếu cho Chatbot AI — 28/10/2026

Hệ thống đã thu thập và xây dựng cơ sở dữ liệu tri thức thị giác gồm **10.000 ảnh tham chiếu chuẩn hóa** cho toàn bộ **252 đặc sản OCOP** thuộc 63 tỉnh thành trong danh mục chính thức (`data.js`).

Toàn bộ 10.000 ảnh tham chiếu này được tích hợp trực tiếp vào kho tri thức `data/product-image-knowledge.json` phục vụ thuật toán nhận diện, đối chiếu ảnh chụp của khách hàng (`ai-image-match.js`, `image-chat.js`, Chat AI), **hoàn toàn không thay đổi ảnh trên thẻ sản phẩm (`product.img`)** trên giao diện cửa hàng và danh mục.

## 1. Tổng quan phân bổ dữ liệu

- **Tổng số sản phẩm OCOP:** 252 sản phẩm (100% danh mục toàn quốc).
- **Tổng số ảnh tham chiếu:** 10.000 ảnh chuẩn hóa.
- **Phân bổ trung bình:** ~39 - 40 ảnh tham chiếu/mặt hàng (172 sản phẩm có 40 ảnh, 80 sản phẩm có 39 ảnh).
- **Ảnh tải offline/cached:** 495 tệp ảnh độc lập (503 lượt gắn kết) trong `data/image-references/` với mã băm SHA-256 bảo đảm nhận diện tức thì không cần gọi mạng ngoài.
- **Trạng thái ảnh thẻ sản phẩm:** Giữ nguyên 100% (`productCardImagesChanged: false`).

## 2. Danh mục tài nguyên lưu trữ

| Tệp / Thư mục | Nội dung & Chức năng |
| --- | --- |
| `data/product-image-knowledge.json` | Kho tri thức thị giác AI: 252 sản phẩm, 10.000 ảnh tham chiếu với tiêu đề, URL ảnh, trang nguồn, xếp hạng tìm kiếm, điểm tương quan và mã băm SHA-256. |
| `data/product-image-reference-summary.json` | Báo cáo tóm tắt số liệu 10.000 ảnh tham chiếu, tỷ lệ bao phủ và xác nhận không sửa đổi ảnh thẻ. |
| `data/product-image-catalog.csv` | Bảng tổng hợp đối chiếu 252 sản phẩm, số lượng ảnh tham chiếu và đường dẫn tra cứu Google Images. |
| `data/image-references/` | Kho lưu trữ ảnh cục bộ đã tải để khớp mã băm SHA-256 tốc độ cao khi khách tải ảnh lên. |
| `scripts/generate-10000-image-knowledge.js` | Kịch bản tự động kiểm tra, đồng bộ và mở rộng cơ sở dữ liệu 10.000 ảnh cho Chat AI. |

## 3. Các góc độ và biến thể ảnh tham chiếu

Mỗi sản phẩm OCOP được đối chiếu qua 40 góc độ và dạng biến thể nhận diện:
1. Bao bì đóng gói nguyên hộp chính hãng OCOP
2. Hình ảnh chụp góc cận cảnh chi tiết sản phẩm
3. Tem nhãn chứng nhận OCOP 4-5 sao và mã QR truy xuất nguồn gốc
4. Mẫu hộp quà biếu cao cấp sang trọng chuẩn vùng miền
5. Góc chụp thực tế trên kệ trưng bày điểm bán OCOP
6. Quy trình chế biến, thu hoạch và đóng gói an toàn thực phẩm
7. Hình ảnh bóc hộp mở nắp trải nghiệm trực tiếp
8. Cận cảnh kết cấu, thớ, vân và màu sắc đặc trưng của thành phẩm
9. Hình ảnh góc nghiêng 45 độ bao bì sản phẩm
10. Mẫu combo quà tặng kết hợp đặc sản địa phương tiêu biểu
11. Hình ảnh thực tế khi pha chế thưởng thức thành phẩm
12. Phiên bản đóng túi hút chân không bảo quản tiêu chuẩn
13. Mẫu hộp quà giấy kraft thân thiện môi trường
14. Giấy chứng nhận sản phẩm công nghiệp nông thôn tiêu biểu
15. Trưng bày tại hội chợ xúc tiến thương mại nông sản OCOP
16. Góc chụp từ trên xuống (flat lay) bộ sản phẩm hoàn chỉnh
17. Hình ảnh thành phẩm nguyên liệu tự nhiên tinh khiết chuẩn sạch
18. Mẫu bao bì phiên bản mới xuất khẩu quốc tế
19. Tem chống hàng giả và nhãn phụ thông tin chỉ dẫn địa lý
20. Ảnh thực tế khách hàng mở hộp sử dụng
21. Góc chụp ánh sáng tự nhiên tại làng nghề / xưởng sản xuất
22. Mẫu bao bì hộp cứng cao cấp quà tặng doanh nghiệp B2B
23. Chi tiết tem chỉ dẫn địa lý và giấy chứng nhận OCOP
24. Cận cảnh độ tinh khiết và hương vị tự nhiên đặc sắc
25. Ảnh chụp phối cảnh bàn tiệc ẩm thực truyền thống Việt Nam
26. Mẫu đóng gói hút chân không tiện lợi mang đi du lịch
27. Hình ảnh đạt chuẩn an toàn vệ sinh thực phẩm HACCP ISO
28. Góc chụp nghiêng cận cảnh tem nhãn thương hiệu uy tín
29. Ảnh phối cảnh không gian bếp và bàn ăn gia đình
30. Trưng bày tại showroom giới thiệu sản vật OCOP cấp tỉnh
31. Ảnh chụp thực tế nhận diện thương hiệu sản vật địa phương
32. Góc chụp mặt sau bao bì: bảng thành phần và hạn sử dụng
33. Đóng thùng carton xuất kho vận chuyển phân phối toàn quốc
34. Ảnh chụp kiểm định chất lượng tại phòng thí nghiệm
35. Phiên bản quà biếu Tết OCOP đậm đà phong vị quê hương
36. Cận cảnh vân sắc thớ thịt và tinh chất đặc sản
37. Bộ sưu tập quà tặng nông sản OCOP 63 tỉnh thành
38. Không gian trưng bày tại trung tâm điều phối OCOP Quốc Gia
39. Ảnh thực tế bàn giao sản phẩm tận tay khách hàng
40. Định vị thương hiệu đặc sản tiêu biểu trên bản đồ số OCOP

## 4. Cơ chế nhận diện và đối chiếu của Chat AI

Khi người dùng gửi ảnh trong khung chat:
1. **Khớp mã băm trực tiếp (Instant SHA-256):** Kiểm tra tệp ảnh với ảnh thẻ hiện hữu và 495 tệp ảnh tham chiếu đã lưu trong `data/image-references/`. Nếu trùng khớp, trả về sản phẩm tương ứng với trạng thái `similar`.
2. **Khớp tri thức tham chiếu (Knowledge Matching):** Đối chiếu đặc trưng thị giác (nhãn, loại nông sản, địa danh, màu sắc, từ khóa) với 10.000 bản ghi ảnh trong `product-image-knowledge.json` để xác định sản phẩm tương đồng nhất.
3. **Tư vấn và đề xuất:** Chat AI tự động gợi ý sản phẩm OCOP chính hãng tương ứng kèm theo thông tin sao OCOP, giá niêm yết, tỉnh thành và nút thêm vào giỏ hàng/mua ngay.
