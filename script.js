// Quản lý giỏ hàng
let cart = [];

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    alert(`Đã thêm "${name}" vào giỏ hàng!`);
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalQuantity;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Giỏ hàng đang trống.</p>';
        cartTotal.textContent = '0 ₫';
        return;
    }

    let html = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        html += `
            <div class="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h5 class="font-bold text-sm text-gray-800">${item.name}</h5>
                    <p class="text-xs text-gray-500">${item.price.toLocaleString()} ₫ x ${item.quantity}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 text-sm"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.textContent = totalPrice.toLocaleString() + ' ₫';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    alert("Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được ghi nhận.");
    cart = [];
    updateCartUI();
    document.getElementById('cart-drawer').classList.add('hidden');
}

// Bật/Tắt giỏ hàng
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');

cartBtn.addEventListener('click', () => cartDrawer.classList.remove('hidden'));
closeCartBtn.addEventListener('click', () => cartDrawer.classList.add('hidden'));
cartOverlay.addEventListener('click', () => cartDrawer.classList.add('hidden'));

// Bật/Tắt khung chat AI
const toggleChat = document.getElementById('toggle-chat');
const chatBox = document.getElementById('chat-box');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

toggleChat.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
    chatBox.classList.add('hidden');
});

function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Tin nhắn người dùng
    chatMessages.innerHTML += `
        <div class="flex justify-end">
            <div class="bg-ocopGreen text-white p-3 rounded-xl shadow-sm max-w-[85%]">
                ${text}
            </div>
        </div>
    `;
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Phản hồi giả lập từ AI Copilot sau 0.6 giây
    setTimeout(() => {
        let reply = "Cảm ơn bạn đã quan tâm! Trợ lý OCOP ghi nhận yêu cầu và sẽ hỗ trợ bạn kết nối với nhà cung cấp sớm nhất.";
        const lower = text.toLowerCase();
        if (lower.includes('trà') || lower.includes('tam đảo')) {
            reply = "Trà hoa vàng Tam Đảo hiện có giá 450.000 ₫ (Chuẩn OCOP 5 Sao), rất tốt cho sức khỏe và làm quà biếu.";
        } else if (lower.includes('điều') || lower.includes('bình phước')) {
            reply = "Hạt điều rang củi Bình Phước có giá 180.000 ₫ (Chuẩn OCOP 4 Sao), giòn béo tự nhiên.";
        }

        chatMessages.innerHTML += `
            <div class="flex justify-start">
                <div class="bg-white text-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 max-w-[85%]">
                    ${reply}
                </div>
            </div>
        `;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
}

sendChat.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});