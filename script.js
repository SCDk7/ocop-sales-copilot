// Dữ liệu sản phẩm mẫu của OCOP Sales Copilot (bạn có thể thay thế bằng dữ liệu thực tế)
const ocopProducts = [
    { id: 1, name: "Mật ong rừng U Minh", price: 250000, stock: 15, unit: chai },
    { id: 2, name: "Trà sen Hồ Tây", price: 180000, stock: 30, unit: hộp },
    { id: 3, name: "Cà phê Robusta Đắk Lắk", price: 120000, stock: 50, unit: gói }
];

// Hàm xử lý khi người dùng gửi tin nhắn cho Copilot AI
function handleUserMessage(userMessage) {
    const text = userMessage.toLowerCase();
    let botResponse = "";

    // 1. Xử lý tra cứu số lượng / sản phẩm
    if (text.includes("tra cứu") || text.includes("số lượng") || text.includes("còn không") || text.includes("hàng")) {
        let foundProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()));
        
        if (foundProduct) {
            botResponse = `Sản phẩm **${foundProduct.name}** hiện có sẵn **${foundProduct.stock} ${foundProduct.unit}** trong kho. Giá bán: ${foundProduct.price.toLocaleString('vi-VN')}đ. Bạn có muốn đặt mua không?`;
        } else {
            let productListStr = ocopProducts.map(p => `- ${p.name} (Còn ${p.stock} ${p.unit})`).join('\n');
            botResponse = `Dưới đây là danh sách sản phẩm OCOP hiện có tại cửa hàng:\n${productListStr}\n\nBạn muốn tra cứu chi tiết sản phẩm nào?`;
        }
    } 
    // 2. Xử lý thông tin đặt hàng
    else if (text.includes("đặt hàng") || text.includes("mua") || text.includes("thanh toán")) {
        botResponse = `Để đặt hàng, bạn vui lòng:\n1. Chọn sản phẩm bạn muốn mua và thêm vào **Giỏ hàng**.\n2. Nhấn vào biểu tượng giỏ hàng ở góc trên màn hình để điền thông tin giao hàng.\n3. Xác nhận đơn hàng để hoàn tất. Bạn cần tôi hỗ trợ thêm về sản phẩm nào không?`;
    } 
    // 3. Phản hồi mặc định
    else {
        botResponse = `Chào bạn! Tôi là Copilot AI hỗ trợ bán hàng OCOP. Bạn có thể hỏi tôi về **số lượng hàng hóa**, **thông tin sản phẩm** hoặc **cách thức đặt hàng** nhé!`;
    }

    return botResponse;
}

// Ví dụ tích hợp sự kiện vào giao diện khung chat sẵn có của bạn
document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input"); // Ô nhập tin nhắn của bạn
    const sendBtn = document.getElementById("send-btn");     // Nút gửi
    const chatBox = document.getElementById("chat-messages"); // Khu vực hiển thị tin nhắn

    if (sendBtn && chatInput) {
        sendBtn.addEventListener("click", () => {
            const message = chatInput.value.trim();
            if (!message) return;

            // Hiển thị tin nhắn người dùng
            appendMessage("User", message);
            chatInput.value = "";

            // Bot phản hồi sau 0.5 giây
            setTimeout(() => {
                const reply = handleUserMessage(message);
                appendMessage("Copilot AI", reply);
            }, 500);
        });
    }

    function appendMessage(sender, text) {
        if (!chatBox) return;
        const msgDiv = document.createElement("div");
        msgDiv.className = sender === "User" ? "user-msg" : "bot-msg";
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${text.replace(/\n/g, '<br>')}`;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});