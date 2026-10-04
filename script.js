// ==========================================
// OCOP SALES COPILOT - CHAT + CATALOG HELPERS
// ==========================================
const ocopProducts = [
    { id: 1, name: 'Mật ong rừng U Minh', price: 250000, stock: 15, unit: 'chai' },
    { id: 2, name: 'Trà sen Hồ Tây', price: 180000, stock: 30, unit: 'hộp' },
    { id: 3, name: 'Cà phê Robusta Đắk Lắk', price: 120000, stock: 50, unit: 'gói' },
    { id: 4, name: 'Trà Hoa Vàng Tam Đảo', price: 450000, stock: 20, unit: 'hộp' }
];

let cart = [];

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = String(totalItems);
    }
}

function addProductToCart(productName) {
    const needle = String(productName || '').trim().toLowerCase();
    const product = ocopProducts.find((p) => {
        const name = p.name.toLowerCase();
        return name.includes(needle) || needle.includes(name.split(' ')[0].toLowerCase());
    });

    if (!product) return null;

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    return `Đã thêm thành công **${product.name}** (1 ${product.unit}) vào giỏ hàng của bạn!`;
}

function handleUserMessage(userMessage) {
    const text = String(userMessage || '').toLowerCase();

    if (/(mua|thêm|lấy|chốt)/.test(text)) {
        const matchedProduct = ocopProducts.find((p) => {
            const productText = p.name.toLowerCase();
            return text.includes(productText) || text.includes(productText.split(' ')[0]);
        });

        if (matchedProduct) {
            const resultMsg = addProductToCart(matchedProduct.name);
            if (resultMsg) return resultMsg;
        }
    }

    if (/(tra cứu|số lượng|còn không|hàng|giá|mật ong|trà|cà phê)/.test(text)) {
        const foundProduct = ocopProducts.find((p) => {
            const productText = p.name.toLowerCase();
            return text.includes(productText) || text.includes(productText.split(' ')[0]);
        });

        if (foundProduct) {
            return `Sản phẩm **${foundProduct.name}** hiện có sẵn **${foundProduct.stock} ${foundProduct.unit}** trong kho. Giá bán: ${foundProduct.price.toLocaleString('vi-VN')}đ. Bạn có muốn tôi **thêm vào giỏ hàng** giúp bạn không?`;
        }

        const productListStr = ocopProducts.map((p) => `- ${p.name}: ${p.price.toLocaleString('vi-VN')}đ (Còn ${p.stock} ${p.unit})`).join('\n');
        return `Danh sách sản phẩm OCOP hiện có tại cửa hàng:\n${productListStr}\n\nBạn muốn mua hoặc tra cứu sản phẩm nào?`;
    }

    if (/(đặt hàng|thanh toán|giỏ hàng)/.test(text)) {
        return `Để đặt hàng, bạn hãy:\n1. Kiểm tra biểu tượng **Giỏ hàng** ở góc trên bên phải màn hình.\n2. Điền thông tin giao hàng và xác nhận.\nHoặc bạn có thể chat trực tiếp với tôi: *"mua [tên sản phẩm]"* để tôi bỏ vào giỏ hàng giúp bạn nhé!`;
    }

    return `Chào bạn! Tôi là Copilot AI. Bạn có thể hỏi tôi về **số lượng**, **giá sản phẩm** hoặc gõ lệnh như *"mua mật ong"* để tôi thêm vào giỏ hàng nhé!`;
}

document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBox = document.getElementById('chat-messages');

    if (toggleBtn && chatWidget) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = chatWidget.style.display === 'none' || chatWidget.style.display === '';
            chatWidget.style.display = isHidden ? 'flex' : 'none';
        });
    }

    if (closeBtn && chatWidget) {
        closeBtn.addEventListener('click', () => {
            chatWidget.style.display = 'none';
        });
    }

    if (sendBtn && chatInput && chatBox) {
        const appendMessage = (sender, text) => {
            const msgEl = document.createElement('div');
            msgEl.className = sender === 'User' ? 'user-msg' : 'bot-msg';
            msgEl.innerHTML = `<strong>${sender}:</strong> ${String(text).replace(/\n/g, '<br>')}`;
            chatBox.appendChild(msgEl);
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        const processSend = () => {
            const message = chatInput.value.trim();
            if (!message) return;

            appendMessage('User', message);
            chatInput.value = '';

            setTimeout(() => {
                appendMessage('Copilot AI', handleUserMessage(message));
            }, 500);
        };

        sendBtn.addEventListener('click', processSend);
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                processSend();
            }
        });
    }

    const aiAvatars = document.querySelectorAll('.ai-avatar, .copilot-avatar, img[alt*="AI"]');
    aiAvatars.forEach((img) => {
        img.src = 'ai-avatar.jpg';
    });

    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput && typeof filterProducts === 'function') {
        searchInput.addEventListener('input', function () {
            filterProducts(this.value.trim().toLowerCase());
        });
    }

    const langBtn = document.querySelector('.lang-switcher') || document.querySelector('.lang-btn');
    if (langBtn) {
        let currentLang = localStorage.getItem('app_lang') || 'VI';
        langBtn.addEventListener('click', function (event) {
            event.preventDefault();
            currentLang = currentLang === 'VI' ? 'EN' : 'VI';
            localStorage.setItem('app_lang', currentLang);

            if (typeof translatePage === 'function') {
                translatePage(currentLang);
            }

            if (typeof showSingleToast === 'function') {
                showSingleToast(
                    currentLang === 'VI'
                        ? 'Đã chuyển đổi sang phiên bản Tiếng Việt chuẩn OCOP Quốc Gia!'
                        : 'Switched to English version successfully!'
                );
            }
        });
    }
});

function filterProducts(keyword) {
    const term = String(keyword || '').toLowerCase();
    const productCards = document.querySelectorAll('.product-card, [class*="card"], .item-san-pham');
    productCards.forEach((card) => {
        const textContent = (card.textContent || '').toLowerCase();
        card.style.display = textContent.includes(term) ? '' : 'none';
    });
}

function showSingleToast(message) {
    const oldToasts = document.querySelectorAll('.toast-notification, .custom-toast');
    oldToasts.forEach((toast) => toast.remove());

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerText = String(message || '');

    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: '#0b2720',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: '99999',
        fontSize: '14px',
        transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

