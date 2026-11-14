# Gợi ý combo

Luồng chat văn bản gọi Gemini để đọc toàn bộ ngữ cảnh và trả yêu cầu có cấu trúc trước khi chọn món. Ngân sách, vùng, nhóm hàng và số món khách thực sự yêu cầu được kết hợp với bộ kiểm tra xác định. `combo6tr` là ngân sách 6.000.000 đồng, không phải sáu món; lời gợi ý trước của trợ lý không trở thành yêu cầu số món của khách.

Nếu chỉ nói “combo” mà chưa có ngân sách trong ngữ cảnh, trợ lý hỏi ngân sách. Nếu có ngân sách, hệ thống chọn tối đa ba tập sản phẩm khác nhau, ngẫu nhiên giữa các phương án phù hợp. Ưu tiên món có giá trị trung bình và cao so với ngân sách và danh mục đủ điều kiện. Không đặt trần số món mặc định; khách nêu số món thì phải giữ điều kiện đó. Có thể chỉ trả ít hơn ba phương án nếu danh mục không đủ tổ hợp khác nhau. Mỗi món một đơn vị; tổng theo giá danh mục chính thức, không vượt ngân sách và không gồm vận chuyển/hộp quà.

Gemini nhận các phương án đã được máy chủ kiểm tra để viết lời giới thiệu; Wikipedia bổ sung tri thức liên quan khi có nguồn phù hợp. Wikipedia không quyết định giá, số món, chứng nhận hay chính sách của shop. Tên nguồn phải phù hợp với chủ đề, loại bỏ tin sự kiện/chiến dịch/truyền hình khỏi gợi ý mua hàng. Khi dịch vụ AI không hoạt động, hệ thống vẫn có thể gợi ý bằng danh mục, và `integrations` phản ánh đúng dịch vụ nào đã thành công.

Phản hồi có `combos` (mỗi phương án gồm items, total, budget, remaining), `combo` là phương án đầu để tương thích, `resolvedRequirements` là ràng buộc hiệu lực, `integrations.intentGemini` cho biết bước hiểu câu hỏi thành công. Giao diện hiển thị từng combo riêng; nút thêm vào giỏ chỉ thêm món của phương án khách chọn.

Gemini dùng structured output theo [tài liệu chính thức](https://ai.google.dev/gemini-api/docs/structured-output); khóa API chỉ nằm trên máy chủ. `npm.cmd test` kiểm tra giới hạn tiền, số món, vùng, loại trừ, tổ hợp khác nhau, hơn tám món và đầu ra hiểu yêu cầu. Kiểm tra API thực tế và trình duyệt lưu trong `.private-data`, không tạo đơn thật.
