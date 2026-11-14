# Chatbot Gemini + OpenAI + Claude + Wikipedia

Chatbot sử dụng danh mục sản phẩm làm nguồn cho tên, tỉnh, giá và số sao. Wikipedia chỉ bổ sung bối cảnh công khai về văn hóa hoặc địa phương. Không dùng Wikipedia để khẳng định giá, tồn kho hoặc chứng nhận của một sản phẩm cụ thể.

## Cấu hình

Tạo `.env` theo `.env.example`, điền khóa dịch vụ muốn sử dụng trên máy chủ:

```dotenv
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-4-6
AI_PROVIDER_MODE=ensemble
AI_CHAT_TIMEOUT_MS=18000
```

Khởi động lại bằng `npm.cmd start`. Trên Render, đặt các biến tương ứng trong Environment. Không đưa khóa vào HTML hoặc GitHub.

Chế độ `ensemble` gửi cùng ngữ cảnh và schema cho các dịch vụ có khóa, rồi ưu tiên kết quả có sự đồng thuận về phạm vi tỉnh và mã sản phẩm. Chế độ `fallback` thử lần lượt Gemini, OpenAI, Claude và dừng ở kết quả hợp lệ đầu tiên. Không gọi dịch vụ thiếu khóa. Một dịch vụ lỗi không ngăn các dịch vụ còn lại trả lời trong thời hạn chung.

API trả `aiProvider`, `aiProviders` và `integrations` theo kết quả thực tế, không tự ghi nhận rằng cả ba đã tham gia. Khi không có dịch vụ khả dụng, phản hồi dùng danh mục và nguồn Wikipedia tìm được, không tự nhận là phản hồi của mô hình AI.

Giao diện chờ tối đa 35 giây để máy chủ hoàn tất. Câu trả lời hợp lệ từ máy chủ không bị các kịch bản showroom/tài chính mẫu ghi đè. Nếu máy chủ không kết nối được, dự phòng cục bộ lọc sản phẩm theo yêu cầu và thông báo nguồn `local_catalog`.

## Điểm bán

Chỉ gắn địa chỉ cụ thể khi bản ghi danh bạ khớp cả tên sản phẩm và tỉnh. Mã sản phẩm tái sử dụng cho mặt hàng khác không được kế thừa showroom cũ. Trường hợp chưa có bản ghi khớp sẽ có link tìm trên Google Maps và lời đề nghị xác nhận địa chỉ trước khi đến; link tìm kiếm không phải chứng nhận điểm bán chính hãng.

## Kiểm tra

`npm.cmd test`, `npm.cmd run test:multi-ai`, `npm.cmd run test:storefront`.

Các kiểm tra API nhiều dịch vụ dùng phản hồi mô phỏng để kiểm tra schema, lỗi, thời hạn và lựa chọn kết quả. Cần khóa API hợp lệ để kiểm tra trực tiếp từng dịch vụ.

Tài liệu API: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [Claude Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [Claude Messages](https://platform.claude.com/docs/en/api/messages/create).
