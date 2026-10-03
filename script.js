// ==========================================
// DỮ LIỆU 40 ĐẶC SẢN OCOP VIỆT NAM
// ==========================================
const ocopProducts = [
    { id: 1, name: "Mật ong rừng U Minh", price: 250000, stock: 15, unit: "chai" },
    { id: 2, name: "Trà sen Hồ Tây", price: 180000, stock: 30, unit: "hộp" },
    { id: 3, name: "Cà phê Robusta Đắk Lắk", price: 120000, stock: 50, unit: "gói" },
    { id: 4, name: "Trà Hoa Vàng Tam Đảo", price: 450000, stock: 20, unit: "hộp" }
];

// ==========================================
// TRẠNG THÁI ỨNG DỤNG (STATE)
// ==========================================
let cart = [];

// Cập nhật số lượng trên giao diện giỏ hàng
function updateCartUI() {
    const cartCountEl = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

// Thêm sản phẩm vào giỏ hàng qua chatbot
function addProductToCart(productName) {
    let product = ocopProducts.find(p => p.name.toLowerCase().includes(productName.toLowerCase()) || productName.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]));
    if (product) {
        let existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        return `Đã thêm thành công **${product.name}** (1 ${product.unit}) vào giỏ hàng của bạn!`;
    }
    return null;
}

// ==========================================
// GIỎ HÀNG & YÊU THÍCH
// ==========================================
function handleUserMessage(userMessage) {
    const text = userMessage.toLowerCase();
    let botResponse = "";

    // Xử lý ý định mua hàng / thêm vào giỏ
    if (text.includes("mua") || text.includes("thêm") || text.includes("lấy") || text.includes("chốt")) {
        let matchedProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.name.split(" ")[0].toLowerCase()));
        if (matchedProduct) {
            let resultMsg = addProductToCart(matchedProduct.name);
            if (resultMsg) return resultMsg;
        }
    }

    // Tra cứu thông tin / số lượng / giá
    if (text.includes("tra cứu") || text.includes("số lượng") || text.includes("còn không") || text.includes("hàng") || text.includes("giá") || text.includes("mật ong") || text.includes("trà") || text.includes("cà phê")) {
        let foundProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.name.split(" ")[0].toLowerCase()));
        
        if (foundProduct) {
            botResponse = `Sản phẩm **${foundProduct.name}** hiện có sẵn **${foundProduct.stock} ${foundProduct.unit}** trong kho. Giá bán: ${foundProduct.price.toLocaleString('vi-VN')}đ. Bạn có muốn tôi **thêm vào giỏ hàng** giúp bạn không?`;
        } else {
            let productListStr = ocopProducts.map(p => `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ (Còn ${p.stock} ${p.unit})`).join('\n');
            botResponse = `Danh sách sản phẩm OCOP hiện có tại cửa hàng:\n${productListStr}\n\nBạn muốn mua hoặc tra cứu sản phẩm nào?`;
        }
    } 
    // Hướng dẫn đặt hàng
    else if (text.includes("đặt hàng") || text.includes("thanh toán") || text.includes("giỏ hàng")) {
        botResponse = `Để đặt hàng, bạn hãy:\n1. Kiểm tra biểu tượng **Giỏ hàng** ở góc trên bên phải màn hình.\n2. Điền thông tin giao hàng và xác nhận.\nHoặc bạn có thể chat trực tiếp với tôi: *"mua [tên sản phẩm]"* để tôi bỏ vào giỏ hàng giúp bạn nhé!`;
    } 
    // Mặc định
    else {
        botResponse = `Chào bạn! Tôi là Copilot AI. Bạn có thể hỏi tôi về **số lượng**, **giá sản phẩm** hoặc gõ lệnh như *"mua mật ong"* để tôi thêm vào giỏ hàng nhé!`;
    }

    return botResponse;
}

// ==========================================
// ĐĂNG NHẬP / LỊCH SỬ ĐƠN HÀNG
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const chatWidget = document.getElementById("chat-widget");
    const toggleBtn = document.getElementById("chatbot-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-messages");

    // Xử lý bật/tắt khung chat khi bấm nút ở góc dưới màn hình
    if (toggleBtn && chatWidget) {
        toggleBtn.addEventListener("click", () => {
            if (chatWidget.style.display === "none" || chatWidget.style.display === "") {
                chatWidget.style.display = "flex";
            } else {
                chatWidget.style.display = "none";
            }
        });
    }

    if (closeBtn && chatWidget) {
        closeBtn.addEventListener("click", () => {
            chatWidget.style.display = "none";
        });
    }

    // Xử lý gửi tin nhắn
    if (sendBtn && chatInput) {
        const processSend = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            appendMessage("User", message);
            chatInput.value = "";

            setTimeout(() => {
                const reply = handleUserMessage(message);
                appendMessage("Copilot AI", reply);
            }, 500);
        };

        sendBtn.addEventListener("click", processSend);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                processSend();
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