// ==========================================================================
// OCOP SALES COPILOT & OCOP AI CHATBOT CONTROLLER
// Seamless backend connection, smart chip handling, and Antigravity FX
// ==========================================================================

// Global Product Catalog reference from data.js or fallback
const localOcopProducts = (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS))
    ? window.PRODUCTS
    : [
        { id: 1, name: 'Yến Sào Khánh Hòa Thượng Hạng', price: 2450000, stars: 5, region: 'Khánh Hòa', category: 'gift' },
        { id: 2, name: 'Trà Shan Tuyết Cổ Thụ Hà Giang', price: 680000, stars: 5, region: 'Hà Giang', category: 'tea' },
        { id: 3, name: 'Trà Đinh Nõn Tân Cương Thái Nguyên', price: 850000, stars: 5, region: 'Thái Nguyên', category: 'tea' },
        { id: 4, name: 'Sâm Ngọc Linh Ngâm Mật Ong Quảng Nam', price: 3200000, stars: 5, region: 'Quảng Nam', category: 'gift' },
        { id: 8, name: 'Mật Ong Hoa Cà Phê Tây Nguyên', price: 180000, stars: 4, region: 'Gia Lai', category: 'food' },
        { id: 14, name: 'Hạt Điều Rang Muối Bình Phước', price: 280000, stars: 5, region: 'Bình Phước', category: 'snack' },
        { id: 17, name: 'Bơ Sáp Đắk Lắk', price: 120000, stars: 4, region: 'Đắk Lắk', category: 'food' },
        { id: 47, name: 'Trà Sen Hồ Tây Hà Nội', price: 720000, stars: 5, region: 'Hà Nội', category: 'tea' }
    ];

// ── 1. CART & WISHLIST HELPERS ─────────────────────────────────────────────
let appCart = [];
function getCartManager() {
    if (typeof window !== 'undefined' && window.CartManager) {
        return new window.CartManager();
    }
    return null;
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const mgr = getCartManager();
    const count = mgr ? mgr.getItemCount() : appCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCountEl) {
        cartCountEl.textContent = String(count);
    }
}

function addProductToCart(productIdOrName) {
    let product = null;
    if (typeof productIdOrName === 'number') {
        product = localOcopProducts.find(p => p.id === productIdOrName);
    } else {
        const needle = String(productIdOrName || '').trim().toLowerCase();
        product = localOcopProducts.find(p => p.name.toLowerCase().includes(needle));
    }
    if (!product) return null;

    const mgr = getCartManager();
    if (mgr) {
        mgr.addToCart(product, 1);
    } else {
        const existing = appCart.find(i => i.id === product.id);
        if (existing) existing.quantity += 1;
        else appCart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    showSingleToast(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
    return product;
}

// ── 2. SMART CHATBOT ENGINE (OCOP AI) ───────────────────────────────────────
function getActiveChatInput() {
    return document.getElementById('ai-chat-input') || document.getElementById('chat-input');
}

function getActiveChatMessages() {
    return document.getElementById('ai-chat-messages') || document.getElementById('chat-messages');
}

function getActiveChatWindow() {
    return document.getElementById('ai-chat-window') || document.getElementById('chat-widget');
}

function appendChatMessageBubble(sender, text, isUser = false) {
    const chatBox = getActiveChatMessages();
    if (!chatBox) return null;

    const bubble = document.createElement('div');
    bubble.className = isUser ? 'flex justify-end' : 'flex items-start space-x-2';

    if (isUser) {
        bubble.innerHTML = `
            <div class="bg-ocopGreen text-white p-3 rounded-2xl rounded-tr-xs shadow-sm max-w-[85%] text-xs leading-relaxed break-words">
                ${String(text).replace(/\n/g, '<br>')}
            </div>
        `;
    } else {
        bubble.innerHTML = `
            <img src="chat-avatar.svg" alt="OCOP AI" class="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5 shadow">
            <div class="bg-white p-3.5 rounded-2xl border border-emerald-100 text-gray-800 shadow-sm leading-relaxed max-w-[90%] space-y-2 break-words text-xs">
                <p class="whitespace-pre-wrap">${String(text).replace(/\n/g, '<br>')}</p>
                <div class="ai-product-recommendations"></div>
            </div>
        `;
    }

    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
    return bubble;
}

function renderChatProducts(bubbleEl, productIds) {
    if (!bubbleEl || !Array.isArray(productIds) || !productIds.length) return;
    const container = bubbleEl.querySelector('.ai-product-recommendations');
    if (!container) return;

    const matchedProducts = productIds
        .map(id => localOcopProducts.find(p => p.id === id))
        .filter(Boolean);

    if (!matchedProducts.length) return;

    let html = '<div class="mt-2 space-y-2 pt-2 border-t border-emerald-50">';
    html += '<p class="text-[11px] font-bold text-ocopGreen">Đặc sản gợi ý phù hợp:</p>';
    matchedProducts.forEach(prod => {
        html += `
            <div class="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                <div class="min-w-0 pr-2">
                    <p class="font-bold text-gray-900 truncate">${prod.name}</p>
                    <p class="text-[10px] text-amber-700 font-semibold">${prod.stars || 5}⭐ OCOP • ${prod.region || ''} • ${(prod.price || 0).toLocaleString('vi-VN')}đ</p>
                </div>
                <button type="button" onclick="addProductToCart(${prod.id})" class="px-2.5 py-1 bg-ocopGreen text-white text-[10px] font-bold rounded-lg hover:bg-ocopGreenLight transition shrink-0 cursor-pointer">
                    + Thêm giỏ
                </button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function updateDynamicChipsUI(chips) {
    if (!Array.isArray(chips) || !chips.length) return;
    const chipBar = document.querySelector('#ai-chat-window .p-2.bg-amber-50\\/80') || document.querySelector('.chat-prompt-bar');
    if (!chipBar) return;

    chipBar.innerHTML = '';
    chips.forEach(label => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-prompt px-2.5 py-1 rounded-full bg-white border border-amber-200 text-ocopGreen hover:bg-ocopGreen hover:text-white transition whitespace-nowrap shadow-2xs cursor-pointer text-[10px] font-bold';
        btn.textContent = label;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            sendChatMessage(label);
        });
        chipBar.appendChild(btn);
    });
}

// ── 3. MAIN MESSAGE DISPATCHER WITH RESILIENT FALLBACK ─────────────────────
async function sendChatMessage(customPrompt) {
    const inputEl = getActiveChatInput();
    const messageText = String(customPrompt || (inputEl ? inputEl.value : '')).trim();
    if (!messageText) return;

    if (inputEl) inputEl.value = '';

    // If main index.html already has an active AI conversation handler, delegate
    if (typeof window.sendAIMessage === 'function' && !customPrompt) {
        // Let inline script handle it if it was typed
    }

    appendChatMessageBubble('User', messageText, true);

    const chatBox = getActiveChatMessages();
    const loadingId = 'ai-loading-' + Date.now();
    if (chatBox) {
        const loadingEl = document.createElement('div');
        loadingEl.id = loadingId;
        loadingEl.className = 'flex items-center space-x-2 text-xs text-gray-400 italic p-2';
        loadingEl.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-ocopGreen"></i> <span>OCOP AI đang tìm kiếm đặc sản phù hợp...</span>`;
        chatBox.appendChild(loadingEl);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    try {
        const endpoint = window.location.protocol === 'file:' ? 'http://localhost:3000/api/ai/chat' : '/api/ai/chat';
        let response = null;

        try {
            response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: 'vi',
                    messages: [{ role: 'user', text: messageText }],
                    products: localOcopProducts
                })
            });
        } catch (fetchErr) {
            // Try fallback route /api/chat
            try {
                const altEndpoint = window.location.protocol === 'file:' ? 'http://localhost:3000/api/chat' : '/api/chat';
                response = await fetch(altEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: 'vi',
                        messages: [{ role: 'user', text: messageText }],
                        products: localOcopProducts
                    })
                });
            } catch (altErr) {
                response = null;
            }
        }

        const data = response ? await response.json().catch(() => ({})) : {};
        const loadingNode = document.getElementById(loadingId);
        if (loadingNode) loadingNode.remove();

        const replyText = data.text_response || data.message || getLocalCatalogFallbackText(messageText);
        const productIds = data.suggested_products || data.productIds || getLocalMatchingProductIds(messageText);
        const dynamicChips = data.dynamic_chips || ["5 sao", "Dưới 200k", "Quà biếu", "Trà đặc sản"];

        const bubble = appendChatMessageBubble('OCOP AI', replyText, false);
        renderChatProducts(bubble, productIds);
        updateDynamicChipsUI(dynamicChips);

    } catch (err) {
        const loadingNode = document.getElementById(loadingId);
        if (loadingNode) loadingNode.remove();

        // Flawless offline fallback
        const fallbackText = getLocalCatalogFallbackText(messageText);
        const productIds = getLocalMatchingProductIds(messageText);
        const bubble = appendChatMessageBubble('OCOP AI', fallbackText, false);
        renderChatProducts(bubble, productIds);
        updateDynamicChipsUI(["5 sao", "Dưới 200k", "Quà biếu", "Trà đặc sản"]);
    }
}

function getLocalCatalogFallbackText(query) {
    const q = query.toLowerCase();
    if (q.includes('trà') || q.includes('chè')) {
        return 'Dạ, vùng cao Tây Bắc và Thái Nguyên nổi tiếng với các dòng trà thượng hạng như Trà Shan Tuyết Cổ Thụ Hà Giang và Trà Đinh Nõn Tân Cương. Em xin gợi ý các loại trà chuẩn 5 sao bên dưới để Anh/Chị tham khảo ạ!';
    }
    if (q.includes('200k') || q.includes('dưới')) {
        return 'Dạ, với mức ngân sách tiết kiệm, OCOP có rất nhiều thức quà tuyệt vời như Mật ong hoa cà phê Tây Nguyên (180.000đ) hay Bơ Sáp Đắk Lắk (120.000đ). Anh/Chị xem ngay danh sách gợi ý dưới đây nhé!';
    }
    if (q.includes('quà biếu') || q.includes('quà')) {
        return 'Dạ, để làm quà biếu trang trọng, Yến Sào Khánh Hòa Thượng Hạng hoặc Sâm Ngọc Linh Quảng Nam là sự lựa chọn đẳng cấp hàng đầu, kết tinh trọn vẹn giá trị sức khỏe và tinh hoa truyền thống.';
    }
    return 'Dạ, em là OCOP AI! Em xin giới thiệu các sản phẩm OCOP tiêu biểu được chứng nhận 4-5 sao vùng miền, mang trọn hương vị thiên nhiên và nghệ thuật ẩm thực truyền thống. Anh/Chị hãy nhấn chọn để thêm vào giỏ hàng nhé!';
}

function getLocalMatchingProductIds(query) {
    const q = query.toLowerCase();
    if (q.includes('trà') || q.includes('chè')) return [2, 3, 47];
    if (q.includes('200k') || q.includes('dưới')) return [8, 17];
    if (q.includes('quà')) return [1, 4];
    return [1, 2, 8];
}

// ── 4. EVENT LISTENERS INITIALIZATION ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Hook Chat Input & Send Button
    const sendBtn = document.getElementById('chat-send-button') || document.getElementById('send-btn');
    const inputEl = getActiveChatInput();

    if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sendChatMessage();
        });
    }

    if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    // 2. Hook Suggestion Chips Click Events
    document.querySelectorAll('.chat-prompt, [data-prompt]').forEach(chip => {
        chip.addEventListener('click', function (e) {
            e.preventDefault();
            const text = this.getAttribute('data-prompt') || this.textContent.trim().replace(/^[^\w\s\u00C0-\u1EF9]+/u, '').trim();
            sendChatMessage(text);
        });
    });

    // 3. Hook Toggle Chatbot Window
    const toggleBtns = document.querySelectorAll('#chatbot-toggle-btn, [onclick*="toggleAIChat"]');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const chatWin = getActiveChatWindow();
            if (chatWin) {
                chatWin.classList.toggle('hidden');
                if (!chatWin.classList.contains('hidden') && inputEl) {
                    inputEl.focus();
                }
            }
        });
    });

    // 4. Hook Header Search Input
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            filterProducts(this.value.trim().toLowerCase());
        });
    }

    // 5. Avatars replacement
    document.querySelectorAll('.ai-avatar, .copilot-avatar, img[alt*="AI"]').forEach((img) => {
        if (!img.src.includes('chat-avatar.svg')) {
            img.src = 'chat-avatar.svg';
        }
    });

    updateCartUI();
});

// Real-time catalog filtering
function filterProducts(keyword) {
    const term = String(keyword || '').toLowerCase();
    const productCards = document.querySelectorAll('.product-card, [class*="card"], .item-san-pham');
    productCards.forEach((card) => {
        const textContent = (card.textContent || '').toLowerCase();
        card.style.display = textContent.includes(term) ? '' : 'none';
    });
}

// Toast notification helper
function showSingleToast(message) {
    const oldToasts = document.querySelectorAll('.custom-toast');
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
        borderRadius: '12px',
        border: '1px solid #d4af37',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        zIndex: '99999',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
    });

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// Expose globals for inline HTML event handlers
if (typeof window !== 'undefined') {
    window.sendQuickPrompt = sendChatMessage;
    window.addProductToCart = addProductToCart;
    window.showSingleToast = showSingleToast;
}

// ── 5. ANTIGRAVITY ENGINE: 3D PARALLAX & SCROLL REVEAL ────────────────────
(function initAntigravityEngine() {
    const floatingElements = document.querySelectorAll('.ag-hero-float');
    floatingElements.forEach((el, index) => {
        if (!el.classList.contains('ag-delay-1') && !el.classList.contains('ag-delay-2')) {
            const dynamicOffset = -((index * 1.618) % 6.0).toFixed(2);
            el.style.animationDelay = `${dynamicOffset}s`;
        }
    });

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0, isMoving = false;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            if (!isMoving) {
                isMoving = true;
                requestAnimationFrame(updateParallax);
            }
        }, { passive: true });

        function updateParallax() {
            currentX += (mouseX - currentX) * 0.065;
            currentY += (mouseY - currentY) * 0.065;
            floatingElements.forEach((el, idx) => {
                const depth = 6 + (idx % 4) * 4;
                const tiltX = (currentY * depth * -0.5).toFixed(2);
                const tiltY = (currentX * depth).toFixed(2);
                el.style.setProperty('--ag-mouse-tx', `${tiltY}px`);
                el.style.setProperty('--ag-mouse-ty', `${tiltX}px`);
            });
            if (Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
                requestAnimationFrame(updateParallax);
            } else {
                isMoving = false;
            }
        }
    }
})();