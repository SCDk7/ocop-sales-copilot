// ==========================================
// 1. DỮ LIỆU SẢN PHẨM VÀ GIỎ HÀNG
// ==========================================
const ocopProducts = [
    { id: 1, name: "Mật ong rừng U Minh", price: 250000, stock: 15, unit: "chai" },
    { id: 2, name: "Trà sen Hồ Tây", price: 180000, stock: 30, unit: "hộp" },
    { id: 3, name: "Cà phê Robusta Đắk Lắk", price: 120000, stock: 50, unit: "gói" }
];

let cart = [];

// ==========================================
// 2. HÀM CẬP NHẬT GIAO DIỆN GIỎ HÀNG
// ==========================================
function updateCartUI() {
    const cartCountEl = document.getElementById("cart-count"); // Thẻ hiển thị số lượng trên icon giỏ hàng
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

// Hàm tự động thêm sản phẩm vào giỏ hàng thông qua yêu cầu từ chatbot
function addProductToCart(productName) {
    let product = ocopProducts.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
    if (product) {
        let existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI(); // Cập nhật số lượng lên giao diện ngay lập tức
        return `Đã thêm thành công **${product.name}** (Số lượng: 1 ${product.unit}) vào giỏ hàng của bạn! Bạn có muốn kiểm tra giỏ hàng không?`;
    }
    return null;
}

// ==========================================
// 3. HÀM XỬ LÝ TRÍ TUỆ CHATBOT (COPILOT AI)
// ==========================================
function handleUserMessage(userMessage) {
    const text = userMessage.toLowerCase();
    let botResponse = "";

    // Kiểm tra nếu người dùng muốn mua / thêm vào giỏ hàng qua chat
    if (text.includes("mua") || text.includes("thêm") || text.includes("lấy cho tôi") || text.includes("chốt")) {
        let matchedProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.name.split(" ")[0].toLowerCase()));
        if (matchedProduct) {
            let resultMsg = addProductToCart(matchedProduct.name);
            if (resultMsg) return resultMsg;
        }
    }

    // 1. Xử lý tra cứu số lượng / sản phẩm
    if (text.includes("tra cứu") || text.includes("số lượng") || text.includes("còn không") || text.includes("hàng") || text.includes("giá")) {
        let foundProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()));
        
        if (foundProduct) {
            botResponse = `Sản phẩm **${foundProduct.name}** hiện có sẵn **${foundProduct.stock} ${foundProduct.unit}** trong kho. Giá bán: ${foundProduct.price.toLocaleString('vi-VN')}đ. Bạn có muốn tôi **thêm vào giỏ hàng** giúp bạn không?`;
        } else {
            let productListStr = ocopProducts.map(p => `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ (Còn ${p.stock} ${p.unit})`).join('\n');
            botResponse = `Dưới đây là danh sách sản phẩm OCOP hiện có tại cửa hàng:\n${productListStr}\n\nBạn muốn tra cứu hoặc mua sản phẩm nào?`;
        }
    } 
    // 2. Xử lý thông tin đặt hàng
    else if (text.includes("đặt hàng") || text.includes("thanh toán") || text.includes("giỏ hàng")) {
        botResponse = `Để hoàn tất đơn hàng, bạn vui lòng:\n1. Kiểm tra lại sản phẩm trong biểu tượng **Giỏ hàng** ở góc trên trang web.\n2. Điền thông tin giao hàng và xác nhận đơn.\nBạn cũng có thể gõ tên sản phẩm trực tiếp ở đây (ví dụ: *"mua mật ong"*) để tôi thêm vào giỏ hàng cho bạn nhé!`;
    } 
    // 3. Phản hồi mặc định
    else {
        botResponse = `Chào bạn! Tôi là Copilot AI hỗ trợ bán hàng OCOP. Bạn có thể hỏi tôi về **số lượng hàng hóa**, **giá sản phẩm** hoặc yêu cầu **"mua [tên sản phẩm]"** để tôi bỏ vào giỏ hàng giúp bạn nhé!`;
    }

    return botResponse;
}

// ==========================================
// 4. GẮN SỰ KIỆN TƯƠNG TÁC GIAO DIỆN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input"); // Ô nhập tin nhắn
    const sendBtn = document.getElementById("send-btn");     // Nút gửi
    const chatBox = document.getElementById("chat-messages"); // Khung hiển thị tin nhắn

    if (sendBtn && chatInput) {
        sendBtn.addEventListener("click", () => {
            const message = chatInput.value.trim();
            if (!message) return;

            // Hiển thị tin nhắn của người dùng
            appendMessage("User", message);
            chatInput.value = "";

            // Bot phản hồi sau 0.5 giây
            setTimeout(() => {
                const reply = handleUserMessage(message);
                appendMessage("Copilot AI", reply);
            }, 500);
        });

        // Hỗ trợ bấm phím Enter để gửi tin nhắn
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendBtn.click();
            }
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