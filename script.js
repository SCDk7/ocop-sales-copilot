// ==========================================
// 1. DỮ LIỆU SẢN PHẨM VÀ GIỎ HÀNG
// ==========================================
const ocopProducts = [
    { id: 1, name: "Mật ong rừng U Minh", price: 250000, stock: 15, unit: "chai" },
    { id: 2, name: "Trà sen Hồ Tây", price: 180000, stock: 30, unit: "hộp" },
    { id: 3, name: "Cà phê Robusta Đắk Lắk", price: 120000, stock: 50, unit: "gói" },
    { id: 4, name: "Trà Hoa Vàng Tam Đảo", price: 450000, stock: 20, unit: "hộp" },
    { id: 5, name: "Hạt điều rang củi Bình Phước", price: 180000, stock: 40, unit: "gói" },
    { id: 6, name: "Đồ gốm mỹ nghệ Biên Hòa", price: 650000, stock: 10, unit: "sản phẩm" }
];

let cart = [];

// Cập nhật số lượng trên giao diện giỏ hàng
function updateCartUI() {
    const cartCountEl = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }

    // Hiển thị danh sách giỏ hàng trong modal/drawer nếu có
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    if (cartItemsContainer && cartTotalEl) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Giỏ hàng đang trống.</p>';
            cartTotalEl.textContent = "0 ₫";
            return;
        }

        let html = "";
        let totalMoney = 0;
        cart.forEach(item => {
            let itemTotal = item.price * item.quantity;
            totalMoney += itemTotal;
            html += `
                <div class="flex items-center justify-between border-b pb-3">
                    <div>
                        <h5 class="font-bold text-sm text-gray-800">${item.name}</h5>
                        <p class="text-xs text-gray-500">${item.price.toLocaleString('vi-VN')}₫ x ${item.quantity}</p>
                    </div>
                    <span class="font-bold text-red-600 text-sm">${itemTotal.toLocaleString('vi-VN')}₫</span>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
        cartTotalEl.textContent = totalMoney.toLocaleString('vi-VN') + " ₫";
    }
}

// Thêm sản phẩm vào giỏ hàng
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
    return "Không tìm thấy sản phẩm này trong hệ thống.";
}

// Chức năng thanh toán
function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    alert("Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được ghi nhận.");
    cart = [];
    updateCartUI();
    document.getElementById("cart-drawer").classList.add("hidden");
}

// ==========================================
// 2. XỬ LÝ TRÍ TUỆ CHATBOT (COPILOT AI)
// ==========================================
function handleUserMessage(userMessage) {
    const text = userMessage.toLowerCase();
    let botResponse = "";

    if (text.includes("mua") || text.includes("thêm") || text.includes("lấy") || text.includes("chốt")) {
        let matchedProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.name.split(" ")[0].toLowerCase()));
        if (matchedProduct) {
            let resultMsg = addProductToCart(matchedProduct.name);
            if (resultMsg) return resultMsg;
        }
    }

    if (text.includes("tra cứu") || text.includes("số lượng") || text.includes("còn không") || text.includes("hàng") || text.includes("giá") || text.includes("mật ong") || text.includes("trà") || text.includes("cà phê") || text.includes("hạt điều") || text.includes("gốm")) {
        let foundProduct = ocopProducts.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.name.split(" ")[0].toLowerCase()));
        
        if (foundProduct) {
            botResponse = `Sản phẩm **${foundProduct.name}** hiện có sẵn **${foundProduct.stock} ${foundProduct.unit}** trong kho. Giá bán: ${foundProduct.price.toLocaleString('vi-VN')}đ. Bạn có muốn tôi **thêm vào giỏ hàng** giúp bạn không?`;
        } else {
            let productListStr = ocopProducts.map(p => `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ (Còn ${p.stock} ${p.unit})`).join('\n');
            botResponse = `Danh sách sản phẩm OCOP hiện có tại cửa hàng:\n${productListStr}\n\nBạn muốn mua hoặc tra cứu sản phẩm nào?`;
        }
    } 
    else if (text.includes("đặt hàng") || text.includes("thanh toán") || text.includes("giỏ hàng")) {
        botResponse = `Để đặt hàng, bạn hãy:\n1. Kiểm tra biểu tượng **Giỏ hàng** ở góc trên bên phải màn hình.\n2. Điền thông tin giao hàng và xác nhận.\nHoặc gõ chat trực tiếp: *"mua [tên sản phẩm]"* để tôi bỏ vào giỏ hàng giúp bạn nhé!`;
    } 
    else {
        botResponse = `Chào bạn! Tôi là Copilot AI. Bạn có thể hỏi tôi về **số lượng**, **giá sản phẩm** hoặc gõ lệnh như *"mua mật ong"* để tôi thêm vào giỏ hàng nhé!`;
    }

    return botResponse;
}

// ==========================================
// 3. GẮN SỰ KIỆN GIAO DIỆN & KHUNG CHAT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const chatWidget = document.getElementById("chat-widget");
    const toggleBtn = document.getElementById("chatbot-toggle-btn");
    const closeBtn = document.getElementById("chat-close-btn");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-messages");

    const cartBtn = document.getElementById("cart-btn");
    const cartDrawer = document.getElementById("cart-drawer");
    const closeCart = document.getElementById("close-cart");
    const cartOverlay = document.getElementById("cart-overlay");

    // Bật/tắt giỏ hàng
    if (cartBtn && cartDrawer) {
        cartBtn.addEventListener("click", () => cartDrawer.classList.remove("hidden"));
    }
    if (closeCart && cartDrawer) {
        closeCart.addEventListener("click", () => cartDrawer.classList.add("hidden"));
    }
    if (cartOverlay && cartDrawer) {
        cartOverlay.addEventListener("click", () => cartDrawer.classList.add("hidden"));
    }

    // Xử lý bật/tắt khung chat
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