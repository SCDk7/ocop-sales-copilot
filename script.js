// ==========================================
// DỮ LIỆU 40 ĐẶC SẢN OCOP VIỆT NAM
// ==========================================
const products = [
  { id: 1, name: "Yến Sào Khánh Hòa Thượng Hạng", category: "gift", stars: 5, price: 2450000, province: "Khánh Hòa", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80", desc: "Tổ yến đảo thiên nhiên Khánh Hòa tinh chế, giàu dinh dưỡng, OCOP 5 Sao Quốc Gia." },
  { id: 2, name: "Sâm Ngọc Linh Kon Tum", category: "gift", stars: 5, price: 3800000, province: "Kon Tum", image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=500&q=80", desc: "Sâm củ tự nhiên giàu Saponin, bồi bổ sức khỏe toàn diện." },
  { id: 3, name: "Trà Đinh Tân Cương Thái Nguyên", category: "tea", stars: 5, price: 450000, province: "Thái Nguyên", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80", desc: "Trà đinh đọt non hái sớm, hương cốm non đặc trưng." },
  { id: 4, name: "Cà Cốm Mắm Tôm Hải Phòng", category: "spice", stars: 4, price: 85000, province: "Hải Phòng", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80", desc: "Mắm tôm truyền thống vị đậm đà, chuẩn OCOP 4 Sao." },
  { id: 5, name: "Chả Mực Hạ Long", category: "snack", stars: 5, price: 280000, province: "Quảng Ninh", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80", desc: "Chả mực giã tay thơm giòn sần sật, hải sản nổi tiếng Quảng Ninh." },
  { id: 6, name: "Mật Ong Rừng U Minh Cà Mau", category: "gift", stars: 5, price: 320000, province: "Cà Mau", image: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=500&q=80", desc: "Mật ong hoa tràm nguyên chất thu hoạch tự nhiên trong rừng U Minh." },
  { id: 7, name: "Trà Shan Tuyết Cổ Thụ Suối Giàng", category: "tea", stars: 5, price: 520000, province: "Yên Bái", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&q=80", desc: "Thu hái từ cây trà cổ thụ hàng trăm năm tuổi trên núi cao." },
  { id: 8, name: "Tỏi Đen Lý Sơn Single Củ", category: "gift", stars: 5, price: 390000, province: "Quảng Ngãi", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80", desc: "Tỏi cô đơn Lý Sơn lên men tự nhiên, tốt cho tim mạch." },
  { id: 9, name: "Nước Mắm Phú Quốc 40 Độ Đạm", category: "spice", stars: 5, price: 165000, province: "Kiên Giang", image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&q=80", desc: "Ủ chượp thùng gỗ bời lời 12 tháng, màu gián sóng sánh." },
  { id: 10, name: "Trà Đông Trùng Hạ Thảo Tam Đảo", category: "tea", stars: 4, price: 680000, province: "Vĩnh Phúc", image: "https://images.unsplash.com/photo-1563822249510-04678c78fa83?w=500&q=80", desc: "Đông trùng hạ thảo sấy thăng hoa phối vị trà xanh thơm nhẹ." },
  { id: 11, name: "Hạt Điều Rang Salt Bình Phước", category: "snack", stars: 5, price: 180000, province: "Bình Phước", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", desc: "Hạt điều nguyên vỏ lụa rang muối giòn rụm béo ngậy." },
  { id: 12, name: "Gạo Lúa Tôm ST25 Sóc Trăng", category: "food", stars: 5, price: 195000, province: "Sóc Trăng", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80", desc: "Gạo ngon nhất thế giới trồng theo mô hình lúa - tôm sạch." },
  { id: 13, name: "Thịt Trâu Gác Bếp Tây Bắc", category: "snack", stars: 4, price: 420000, province: "Sơn La", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80", desc: "Thịt trâu tươi ướp mắc khén tỏi ớt, hun khói củi bắp." },
  { id: 14, name: "Nước Mắm Phan Thiết Lều Cá", category: "spice", stars: 4, price: 120000, province: "Bình Thuận", image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=500&q=80", desc: "Ủ cá cơm than tươi, mùi thơm dịu đậm đà hậu vị." },
  { id: 15, name: "Bánh Đa Cua Hải Phòng Sấy Khô", category: "food", stars: 4, price: 65000, province: "Hải Phòng", image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&q=80", desc: "Bánh đa đỏ đặc sản giòn dai, không phụ gia bảo quản." },
  { id: 16, name: "Cà Cốm An Giang Ủ Chum", category: "food", stars: 4, price: 90000, province: "An Giang", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80", desc: "Sản phẩm nông sản chế biến truyền thống Nam Bộ." },
  { id: 17, name: "Trà Oolong Mộc Châu", category: "tea", stars: 4, price: 290000, province: "Sơn La", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&q=80", desc: "Hương hoa tự nhiên, vị ngọt hậu kéo dài." },
  { id: 18, name: "Rượu Sim Rừng Phú Quốc", category: "gift", stars: 4, price: 250000, province: "Kiên Giang", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", desc: "Lên men từ trái sim rừng chín mộng tốt cho tiêu hóa." },
  { id: 19, name: "Lạp Xưởng Tôm Cần Thơ", category: "snack", stars: 4, price: 175000, province: "Cần Thơ", image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&q=80", desc: "Lạp xưởng làm từ tôm đất tươi ngọt thanh." },
  { id: 20, name: "Mộc Nhĩ Đen Rừng Cao Bằng", category: "food", stars: 4, price: 110000, province: "Cao Bằng", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", desc: "Mộc nhĩ tự nhiên giòn sần sật bồi bổ cơ thể." },
  { id: 21, name: "Trà Artiso Đà Lạt Cây Đỏ", category: "tea", stars: 5, price: 150000, province: "Lâm Đồng", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80", desc: "Mát gan giải độc, hỗ trợ giấc ngủ ngon." },
  { id: 22, name: "Mật Táo Đỏ Ninh Thuận", category: "gift", stars: 4, price: 135000, province: "Ninh Thuận", image: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=500&q=80", desc: "Chiết xuất táo đỏ sấy dẻo tự nhiên bồi bổ khí huyết." },
  { id: 23, name: "Tiêu Đen Chư Sê Gia Lai", category: "spice", stars: 4, price: 105000, province: "Gia Lai", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80", desc: "Hạt tiêu mẩy tròn, cay thơm nồng nàn." },
  { id: 24, name: "Xoài Sấy Dẻo Cam Lâm", category: "snack", stars: 4, price: 85000, province: "Khánh Hòa", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&q=80", desc: "Xoài chín cây sấy dẻo không đường hóa học." },
  { id: 25, name: "Miến Riềng Làng So Hà Nội", category: "food", stars: 4, price: 75000, province: "Hà Nội", image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&q=80", desc: "Miến dong riềng dai ngon tự nhiên không tẩy trắng." },
  { id: 26, name: "Trà Hoa Cúc Vàng Hưng Yên", category: "tea", stars: 4, price: 140000, province: "Hưng Yên", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&q=80", desc: "Hoa cúc chi sấy lạnh thơm dịu, giảm căng thẳng." },
  { id: 27, name: "Bánh Pia Đậu Xanh Sầu Riêng", category: "snack", stars: 5, price: 115000, province: "Sóc Trăng", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", desc: "Vỏ bánh nhiều lớp bọc nhân sầu riêng tươi quyến rũ." },
  { id: 28, name: "Tương Ớt Mường Khương", category: "spice", stars: 4, price: 55000, province: "Lào Cai", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80", desc: "Làm từ ớt chỉ thiên tươi, tỏi và hạt dổi cay nồng." },
  { id: 29, name: "Cà Phê Măng Đen Arabica", category: "gift", stars: 5, price: 210000, province: "Kon Tum", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80", desc: "Cà phê Arabica trồng trên cao nguyên lạnh Măng Đen." },
  { id: 30, name: "Trà Giảo Cổ Lam Hòa Bình", category: "tea", stars: 4, price: 125000, province: "Hòa Bình", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80", desc: "Hỗ trợ hạ huyết áp, mỡ máu và đường huyết." },
  { id: 31, name: "Hạt Bơ Sấy Dẻo Đắk Lắk", category: "snack", stars: 4, price: 95000, province: "Đắk Lắk", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&q=80", desc: "Món ăn vặt thơm béo độc đáo Tây Nguyên." },
  { id: 32, name: "Đường Thốt Nốt An Giang", category: "food", stars: 5, price: 80000, province: "An Giang", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80", desc: "Đường thốt nốt nguyên chất nấu thủ công thanh mát." },
  { id: 33, name: "Trà Bổ Mát Gan Diệp Hạ Châu", category: "tea", stars: 4, price: 98000, province: "Quảng Nam", image: "https://images.unsplash.com/photo-1563822249510-04678c78fa83?w=500&q=80", desc: "Trà thảo dược mát gan, giải độc rượu bia." },
  { id: 34, name: "Măng Nứa Khô Tuyên Quang", category: "food", stars: 4, price: 230000, province: "Tuyên Quang", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", desc: "Măng nứa rừng phơi nắng tự nhiên vàng ươm." },
  { id: 35, name: "Bánh Khọt tôm tít Cà Mau", category: "snack", stars: 4, price: 140000, province: "Cà Mau", image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80", desc: "Đặc sản làm sẵn đóng gói hút chân không tiện lợi." },
  { id: 36, name: "Mật Thốt Nốt Linh Chi", category: "gift", stars: 5, price: 310000, province: "An Giang", image: "https://images.unsplash.com/photo-1587049352847-81a56d773cae?w=500&q=80", desc: "Kết hợp giữa mật thốt nốt và nấm linh chi đỏ." },
  { id: 37, name: "Trà Sâm Đương Quy Lạng Sơn", category: "tea", stars: 4, price: 215000, province: "Lạng Sơn", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&q=80", desc: "Bổ máu, tăng cường lưu thông khí huyết." },
  { id: 38, name: "Muối Ớt Tây Ninh Hột To", category: "spice", stars: 4, price: 45000, province: "Tây Ninh", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=80", desc: "Gia vị chấm trái cây giòn cay đậm đà." },
  { id: 39, name: "Sữa Bò Tươi Sấy Khô Mộc Châu", category: "snack", stars: 4, price: 110000, province: "Sơn La", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80", desc: "Bánh sữa thơm ngon giàu canxi." },
  { id: 40, name: "Nấm Hương Khô Sa Pa", category: "food", stars: 5, price: 260000, province: "Lào Cai", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80", desc: "Nấm hương cánh dày thơm phức đặc sản núi cao." }
];

// ==========================================
// TRẠNG THÁI ỨNG DỤNG (STATE)
// ==========================================
let cart = [];
let wishlist = [];
let orders = [];
let currentUser = null;
let currentFilter = 'all';

// ==========================================
// RENDER & LỌC SẢN PHẨM
// ==========================================
function renderProducts(list = products) {
  const container = document.getElementById('product-grid');
  const noMsg = document.getElementById('no-products-msg');
  
  if(!container) return;
  container.innerHTML = '';

  if (list.length === 0) {
    noMsg.style.display = 'block';
    return;
  } else {
    noMsg.style.display = 'none';
  }

  list.forEach(p => {
    const isWish = wishlist.some(item => item.id === p.id);
    const starsHtml = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);

    const card = document.createElement('div');
    card.className = "bg-white rounded-3xl border border-amber-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group";
    card.innerHTML = `
      <div class="relative h-48 overflow-hidden bg-amber-50">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
        <span class="absolute top-3 left-3 bg-ocopGreen text-ocopGold text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow border border-ocopGold/30">
          OCOP ${p.stars} Star
        </span>
        <button onclick="toggleWishlist(${p.id})" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm text-red-500 flex items-center justify-center hover:scale-110 transition shadow">
          <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart text-xs"></i>
        </button>
        <span class="absolute bottom-2 left-3 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
          <i class="fa-solid fa-location-dot text-amber-400 mr-1"></i>${p.province}
        </span>
      </div>

      <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div class="text-yellow-500 text-[10px] tracking-wider mb-1">${starsHtml}</div>
          <h3 class="font-extrabold text-sm text-gray-900 line-clamp-1 group-hover:text-ocopGreen transition">${p.name}</h3>
          <p class="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">${p.desc}</p>
        </div>

        <div class="pt-2 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span class="text-[10px] text-gray-400 block font-bold">Giá chuẩn</span>
            <span class="text-sm font-extrabold text-red-600">${p.price.toLocaleString('vi-VN')} ₫</span>
          </div>
          <button onclick="addToCart(${p.id})" class="bg-ocopGreen hover:bg-ocopGreenLight text-white w-9 h-9 rounded-2xl flex items-center justify-center transition shadow-md hover:scale-105">
            <i class="fa-solid fa-cart-plus text-xs"></i>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function setCategoryFilter(category, btn) {
  currentFilter = category;
  
  // Highlight nút sidebar
  document.querySelectorAll('.cat-side-btn').forEach(b => {
    b.classList.remove('bg-ocopGreen', 'text-white', 'border-l-4', 'border-ocopGold');
    b.classList.add('text-gray-700');
  });
  if(btn) {
    btn.classList.add('bg-ocopGreen', 'text-white', 'border-l-4', 'border-ocopGold');
  }

  filterProducts();
}

function filterProducts() {
  const query = document.getElementById('product-search')?.value.toLowerCase() || '';
  let filtered = products;

  if (currentFilter === '5star') {
    filtered = filtered.filter(p => p.stars === 5);
  } else if (currentFilter === '4star') {
    filtered = filtered.filter(p => p.stars === 4);
  } else if (currentFilter !== 'all') {
    filtered = filtered.filter(p => p.category === currentFilter);
  }

  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.province.toLowerCase().includes(query) || 
      p.desc.toLowerCase().includes(query)
    );
  }

  renderProducts(filtered);
}

function filterProductsGlobal(val) {
  const searchInput = document.getElementById('product-search');
  if(searchInput) searchInput.value = val;
  filterProducts();
}

function resetFilters() {
  currentFilter = 'all';
  const searchInput = document.getElementById('product-search');
  if(searchInput) searchInput.value = '';
  renderProducts(products);
}

// ==========================================
// GIỎ HÀNG & YÊU THÍCH
// ==========================================
function addToCart(id) {
  const item = products.find(p => p.id === id);
  const exist = cart.find(c => c.id === id);
  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
  showToast(`Đã thêm "${item.name}" vào giỏ hàng!`);
}

function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  const itemsContainer = document.getElementById('cart-items');
  const totalPriceEl = document.getElementById('cart-total-price');

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if(countEl) countEl.innerText = totalQty;
  if(totalPriceEl) totalPriceEl.innerText = totalPrice.toLocaleString('vi-VN') + ' ₫';

  if (!itemsContainer) return;
  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-8">Giỏ hàng đang trống.</p>';
    return;
  }

  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = "flex items-center justify-between p-3 bg-amber-50/50 rounded-2xl border border-amber-200/60 text-xs";
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover">
        <div>
          <h4 class="font-bold text-gray-900 line-clamp-1">${item.name}</h4>
          <p class="text-red-600 font-extrabold mt-0.5">${item.price.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold">-</button>
        <span class="font-bold">${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold">+</button>
      </div>
    `;
    itemsContainer.appendChild(div);
  });
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
  }
  updateCartUI();
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  if(drawer) drawer.classList.toggle('hidden');
}

function toggleWishlist(id) {
  const idx = wishlist.findIndex(w => w.id === id);
  const item = products.find(p => p.id === id);

  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Đã xóa khỏi danh sách yêu thích.`);
  } else {
    wishlist.push(item);
    showToast(`Đã thêm vào yêu thích!`);
  }

  document.getElementById('wishlist-count').innerText = wishlist.length;
  renderProducts();
  renderWishlistUI();
}

function renderWishlistUI() {
  const container = document.getElementById('wishlist-items');
  if (!container) return;
  container.innerHTML = '';

  if (wishlist.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 text-center py-8">Chưa có sản phẩm yêu thích.</p>';
    return;
  }

  wishlist.forEach(item => {
    const div = document.createElement('div');
    div.className = "flex items-center justify-between p-3 bg-red-50/50 rounded-2xl border border-red-100 text-xs";
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover">
        <div>
          <h4 class="font-bold text-gray-900 line-clamp-1">${item.name}</h4>
          <p class="text-red-600 font-extrabold mt-0.5">${item.price.toLocaleString('vi-VN')} ₫</p>
        </div>
      </div>
      <button onclick="addToCart(${item.id})" class="bg-ocopGreen text-white px-3 py-1.5 rounded-xl font-bold hover:bg-ocopGreenLight">Mua ngay</button>
    `;
    container.appendChild(div);
  });
}

function toggleWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  if(drawer) drawer.classList.toggle('hidden');
}

// ==========================================
// ĐĂNG NHẬP / LỊCH SỬ ĐƠN HÀNG
// ==========================================
function toggleAuthModal() {
  const modal = document.getElementById('auth-modal');
  if(modal) modal.classList.toggle('hidden');
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  currentUser = { email };
  toggleAuthModal();
  showToast(`Xin chào ${email.split('@')[0]}! Đăng nhập thành công.`);
  document.getElementById('user-btn').classList.add('bg-emerald-200', 'text-ocopGreen');
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast('Giỏ hàng trống!');
    return;
  }
  const newOrder = {
    id: 'OCOP-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('vi-VN'),
    total: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
    items: [...cart]
  };
  orders.unshift(newOrder);
  cart = [];
  updateCartUI();
  toggleCart();
  showToast(`Đặt hàng thành công! Mã đơn: ${newOrder.id}`);
  renderOrdersUI();
}

function toggleOrdersModal() {
  const modal = document.getElementById('orders-modal');
  if(modal) modal.classList.toggle('hidden');
}

function renderOrdersUI() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = '<p class="text-xs text-gray-400 text-center py-8">Bạn chưa có đơn hàng nào.</p>';
    return;
  }

  orders.forEach(o => {
    const div = document.createElement('div');
    div.className = "p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-2";
    div.innerHTML = `
      <div class="flex justify-between font-bold text-ocopGreen">
        <span>Mã: ${o.id}</span>
        <span class="text-gray-500">${o.date}</span>
      </div>
      <div class="text-gray-600 space-y-1">
        ${o.items.map(i => `<div class="flex justify-between"><span>${i.name} x${i.qty}</span><span>${(i.price*i.qty).toLocaleString('vi-VN')} ₫</span></div>`).join('')}
      </div>
      <div class="border-t pt-1.5 flex justify-between font-extrabold text-red-600">
        <span>Tổng cộng:</span>
        <span>${o.total.toLocaleString('vi-VN')} ₫</span>
      </div>
    `;
    container.appendChild(div);
  });
}

// ==========================================
// CHATBOT AI TƯ VẤN SẢN PHẨM
// ==========================================
function toggleAIChat() {
  const win = document.getElementById('ai-chat-window');
  if(win) win.classList.toggle('hidden');
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('ai-chat-input');
  if(input) {
    input.value = promptText;
    sendAIMessage();
  }
}

function sendAIMessage() {
  const input = document.getElementById('ai-chat-input');
  const messages = document.getElementById('ai-chat-messages');
  const text = input.value.trim();
  if (!text) return;

  // Render User Message
  const userDiv = document.createElement('div');
  userDiv.className = "flex justify-end";
  userDiv.innerHTML = `<div class="bg-ocopGreen text-white p-3 rounded-2xl text-xs max-w-[80%] shadow">${text}</div>`;
  messages.appendChild(userDiv);

  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // AI Typing State
  setTimeout(() => {
    const replyText = generateAIReply(text);
    const aiDiv = document.createElement('div');
    aiDiv.className = "flex items-start space-x-2";
    aiDiv.innerHTML = `
      <img src="ai-avatar.jpg" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'" class="w-7 h-7 rounded-full object-cover ring-1 ring-ocopGold flex-shrink-0 mt-0.5 shadow">
      <div class="bg-white p-3.5 rounded-2xl border border-amber-200 text-gray-800 shadow-sm leading-relaxed max-w-[85%] text-xs">
        ${replyText}
      </div>
    `;
    messages.appendChild(aiDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 400);
}

function generateAIReply(msg) {
  const q = msg.toLowerCase();

  if (q.includes('5 sao') || q.includes('top')) {
    return "Dạ top đặc sản **OCOP 5 Sao Quốc Gia** nổi bật nhất gồm có:<br>• <b>Yến Sào Khánh Hòa</b> (2.450.000₫)<br>• <b>Sâm Ngọc Linh Kon Tum</b> (3.800.000₫)<br>• <b>Gạo ST25 Sóc Trăng</b> (195.000₫)<br>• <b>Trà Đinh Thái Nguyên</b> (450.000₫). Anh/chị bấm nút Lọc 5 Sao ở thanh bên để xem thêm ạ!";
  }
  if (q.includes('quà biếu') || q.includes('combo')) {
    return "Dạ bộ <b>Combo Quà Biếu Sang Trọng</b> được ưa chuộng nhất là: <b>Trà Shan Tuyết Cổ Thụ + Yến Sào Khánh Hòa + Mật Ong Rừng U Minh</b>. Vừa thể hiện đẳng cấp vừa chăm sóc sức khỏe toàn diện ạ!";
  }
  if (q.includes('dưới 200k') || q.includes('rẻ')) {
    return "Dạ các đặc sản chất lượng giá dưới 200k rất hợp túi tiền:<br>• <b>Gạo Lúa Tôm ST25</b> (195.000₫)<br>• <b>Hạt Điều Rang Salt Bình Phước</b> (180.000₫)<br>• <b>Nước Mắm Phú Quốc 40đп</b> (165.000₫)<br>• <b>Trà Artiso Đà Lạt</b> (150.000₫).";
  }
  if (q.includes('cà mau') || q.includes('miền tây')) {
    return "Dạ đặc sản Cà Mau và Miền Tây bên em có **Mật Ong Rừng U Minh Cà Mau** (320.000₫), **Gạo ST25 Sóc Trăng** và **Bánh Pía Đậu Xanh Sầu Riêng** thơm ngon nức tiếng!";
  }
  if (q.includes('trà') || q.includes('mát gan')) {
    return "Dạ để mát gan thanh nhiệt ngủ ngon, anh/chị chọn **Trà Artiso Đà Lạt Cây Đỏ** (150.000₫) hoặc **Trà Đinh Tân Cương Thái Nguyên** (450.000₫) thưởng thức rất tuyệt ạ.";
  }

  return `Dạ em đã ghi nhận nhu cầu về "<b>${msg}</b>". Hệ thống OCOP hiện có 40 sản phẩm chuẩn quốc gia, anh/chị có thể nhập từ khóa vào ô tìm kiếm phía trên để lọc nhanh nhé!`;
}

// ==========================================
// THÔNG BÁO TOAST
// ==========================================
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if(!container) return;

  const toast = document.createElement('div');
  toast.className = "bg-ocopGreen text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-ocopGold flex items-center space-x-2 pointer-events-auto animate-fade-in";
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-ocopGold text-sm"></i><span>${msg}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Khởi chạy ban đầu
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});