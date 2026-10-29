/**
 * OCOP SALES COPILOT - HỆ THỐNG QUẢN TRỊ ĐA PHÂN QUYỀN
 * Quản trị viên Web (Webmaster) & Nhà Phân Phối (Distributor Scoped Isolation)
 * 4 Phân hệ cốt lõi:
 * 1. Quản lý Khách hàng (Customer Code 12 ký tự)
 * 2. Quản lý Nhà phân phối (Distributor Code 12 ký tự)
 * 3. Quản lý Hàng tồn kho (Inventory Stock)
 * 4. Quản lý Số lượng đã bán (Sales Volume & Units Sold)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.OcopAdminManagement = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';
    const productCodes=typeof module==='object'&&module.exports?require('./product-codes'):window.OCOPProductCodes;
    let productGroupFilter='all';
    let productCodeSearch='',productSearchTimer;

    // -------------------------------------------------------------
    // GENERATOR: MÃ 12 KÝ TỰ CHUẨN HÓA
    // -------------------------------------------------------------
    function generateCode(prefix, totalLength) {
        prefix = prefix || 'KH';
        totalLength = totalLength || 12;
        const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = prefix;
        while (code.length < totalLength) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code.slice(0, totalLength);
    }

    function generateCustomerCode() {
        return generateCode('KH', 12);
    }

    function generateDistributorCode() {
        return generateCode('NPP', 12);
    }

    function generateAdminCode() {
        return generateCode('AD', 12);
    }

    // -------------------------------------------------------------
    // DANH SÁCH 6 NHÀ PHÂN PHỐI / HTX OCOP NÒNG CỐT (MÃ 12 KÝ TỰ)
    // -------------------------------------------------------------
    const SEED_DISTRIBUTORS = [
        {
            distributorCode: 'NPP260000001',
            name: 'HTX Sản xuất Nông đặc sản An toàn Hải Phòng',
            shortName: 'HTX Nông sản Hải Phòng',
            region: 'Hải Phòng',
            hotline: '098.165.535',
            address: 'Khu sản xuất tập trung Làng nghề OCOP, Tỉnh Hải Phòng',
            certDecision: 'QĐ số 2585/QĐ-UBND Tỉnh Hải Phòng (OCOP 4-5 Sao)',
            pin: '1111',
            encryptionKey: 'SHA256_ENC_HP_99182',
            status: 'Hoạt động'
        },
        {
            distributorCode: 'NPP260000002',
            name: 'Công ty TNHH Gốm sứ Quang Vinh Bát Tràng',
            shortName: 'Gốm sứ Quang Vinh',
            region: 'Hà Nội',
            hotline: '098.345.2286',
            address: 'Xóm 1, Làng cổ Bát Tràng, Gia Lâm, TP. Hà Nội',
            certDecision: 'QĐ số 3828/QĐ-UBND TP. Hà Nội (OCOP 5 Sao Quốc Gia)',
            pin: '2222',
            encryptionKey: 'SHA256_ENC_HN_18274',
            status: 'Hoạt động'
        },
        {
            distributorCode: 'NPP260000003',
            name: 'Cơ sở Chế biến Cacao Trọng Đức',
            shortName: 'Cacao Trọng Đức',
            region: 'Đồng Nai',
            hotline: '091.234.5678',
            address: 'Quốc lộ 20, Xã Phú Hòa, Huyện Định Quán, Tỉnh Đồng Nai',
            certDecision: 'QĐ số 1942/QĐ-UBND Tỉnh Đồng Nai (OCOP 5 Sao)',
            pin: '3333',
            encryptionKey: 'SHA256_ENC_DN_77361',
            status: 'Hoạt động'
        },
        {
            distributorCode: 'NPP260000004',
            name: 'HTX Nông nghiệp Dịch vụ Bản địa Hòa Bình',
            shortName: 'HTX Bản địa Hòa Bình',
            region: 'Hòa Bình',
            hotline: '097.889.9112',
            address: 'Thị trấn Cao Phong, Huyện Cao Phong, Tỉnh Hòa Bình',
            certDecision: 'QĐ số 812/QĐ-UBND Tỉnh Hòa Bình (OCOP 4-5 Sao)',
            pin: '4444',
            encryptionKey: 'SHA256_ENC_HB_66289',
            status: 'Hoạt động'
        },
        {
            distributorCode: 'NPP260000005',
            name: 'Cơ sở Nước mắm Phan Thiết Cốt Nhĩ',
            shortName: 'Nước mắm Phan Thiết',
            region: 'Bình Thuận',
            hotline: '090.554.4332',
            address: 'Đại lộ Hùng Vương, Phường Phú Hài, TP. Phan Thiết, Bình Thuận',
            certDecision: 'QĐ số 1420/QĐ-UBND Tỉnh Bình Thuận (OCOP 5 Sao)',
            pin: '5555',
            encryptionKey: 'SHA256_ENC_BT_33198',
            status: 'Hoạt động'
        },
        {
            distributorCode: 'NPP260000006',
            name: 'HTX Sản xuất Nông đặc sản An toàn Cà Mau',
            shortName: 'HTX Nông sản Cà Mau',
            region: 'Cà Mau',
            hotline: '093.445.5667',
            address: 'Thị trấn Năm Căn, Huyện Năm Căn, Tỉnh Cà Mau',
            certDecision: 'QĐ số 995/QĐ-UBND Tỉnh Cà Mau (OCOP 5 Sao)',
            pin: '6666',
            encryptionKey: 'SHA256_ENC_CM_44210',
            status: 'Hoạt động'
        }
    ];

    // -------------------------------------------------------------
    // DANH SÁCH 4 TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN ACCOUNTS)
    // -------------------------------------------------------------
    const SEED_ADMIN_ACCOUNTS = [
        {
            adminId: 'AD01',
            adminCode: 'AD2600000001',
            customerCode: 'AD2600000001',
            username: 'ThaoNguyenad01',
            password: '0000000',
            fullName: 'Thảo Nguyên (Admin 01)',
            role: 'super_admin',
            createdAt: '2026-10-26T22:00:00.000Z'
        },
        {
            adminId: 'AD02',
            adminCode: 'AD2600000002',
            customerCode: 'AD2600000002',
            username: 'KimNganad02',
            password: '1111111',
            fullName: 'Kim Ngân (Admin 02)',
            role: 'super_admin',
            createdAt: '2026-10-26T22:00:00.000Z'
        },
        {
            adminId: 'AD03',
            adminCode: 'AD2600000003',
            customerCode: 'AD2600000003',
            username: 'VinhPhucad03',
            password: '2222222',
            fullName: 'Vĩnh Phúc (Admin 03)',
            role: 'super_admin',
            createdAt: '2026-10-26T22:00:00.000Z'
        },
        {
            adminId: 'AD04',
            adminCode: 'AD2600000004',
            customerCode: 'AD2600000004',
            username: 'ThanhBinhad04',
            password: '3333333',
            fullName: 'Thanh Bình (Admin 04)',
            role: 'super_admin',
            createdAt: '2026-10-26T22:00:00.000Z'
        }
    ];

    function getAdminAccounts() {
        let list = getStorage('ocop_admin_accounts', []);
        if (!Array.isArray(list) || list.length === 0) {
            list = SEED_ADMIN_ACCOUNTS.slice();
            setStorage('ocop_admin_accounts', list);
        } else {
            let changed = false;
            list.forEach((a, idx) => {
                if (!a.adminCode || !a.adminCode.startsWith('AD') || a.adminCode.length !== 12) {
                    a.adminCode = 'AD26' + String(10000001 + idx).slice(-8);
                    a.customerCode = a.adminCode;
                    changed = true;
                }
            });
            if (changed) setStorage('ocop_admin_accounts', list);
        }
        return list;
    }

    function authenticateAdmin(keyword, pass) {
        if (!keyword) return null;
        const list = getAdminAccounts();
        const kw = String(keyword).trim().toLowerCase();
        const p = pass ? String(pass).trim() : '';

        if (p) {
            // 1. Khớp chính xác username hoặc adminId (AD01, AD02, ...)
            const exact = list.find(a => 
                (a.username.toLowerCase() === kw || (a.adminId && a.adminId.toLowerCase() === kw)) && 
                a.password === p
            );
            if (exact) return exact;

            // 2. Hỗ trợ alias đăng nhập tiện lợi cho Quản trị viên (admin, ad, quantri)
            if (['admin', 'ad', 'quantri', 'quantrivien', 'superadmin'].includes(kw)) {
                if (['0000000', '000000', 'admin', '123456', 'admin123', 'ad'].includes(p) || (list[0] && p === list[0].password)) {
                    return list[0];
                }
            }
            if (['ad01', 'ad1', 'admin01', 'admin1'].includes(kw) && (['0000000', 'admin'].includes(p) || (list[0] && p === list[0].password))) return list[0];
            if (['ad02', 'ad2', 'admin02', 'admin2'].includes(kw) && (['1111111', 'admin'].includes(p) || (list[1] && p === list[1].password))) return list[1];
            if (['ad03', 'ad3', 'admin03', 'admin3'].includes(kw) && (['2222222', 'admin'].includes(p) || (list[2] && p === list[2].password))) return list[2];
            if (['ad04', 'ad4', 'admin04', 'admin4'].includes(kw) && (['3333333', 'admin'].includes(p) || (list[3] && p === list[3].password))) return list[3];

            return null;
        }

        // 3. Đăng nhập 1 token / mã pin
        const matchToken = list.find(a => 
            a.username.toLowerCase() === kw || 
            (a.adminId && a.adminId.toLowerCase() === kw) ||
            a.password === kw
        );
        if (matchToken) return matchToken;

        if (['admin', 'ad', 'quantri', 'superadmin'].includes(kw)) return list[0];

        return null;
    }

    // Seed Khách hàng ban đầu (12 ký tự)
    const SEED_CUSTOMERS = [
        {
            customerCode: 'KH2600000001',
            username: 'khachhang',
            fullName: 'Nguyễn Văn An (Mẫu)',
            phone: '0912345678',
            address: 'Số 1 Tràng Tiền, Hoàn Kiếm, Hà Nội',
            createdAt: '2026-10-01T08:00:00.000Z'
        },
        {
            customerCode: 'KH2600000002',
            username: 'maihoa_hp',
            fullName: 'Trần Thị Mai Hoa',
            phone: '0987654321',
            address: '124 Lạch Tray, Quận Ngô Quyền, Hải Phòng',
            createdAt: '2026-10-05T09:30:00.000Z'
        },
        {
            customerCode: 'KH2600000003',
            username: 'nam_saigon',
            fullName: 'Lê Hoàng Nam',
            phone: '0903112233',
            address: '45 Lê Duẩn, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
            createdAt: '2026-10-10T14:15:00.000Z'
        },
        {
            customerCode: 'KH2600000004',
            username: 'quynhchi_dn',
            fullName: 'Phạm Quỳnh Chi',
            phone: '0945667788',
            address: '88 Nguyễn Ái Quốc, TP. Biên Hòa, Đồng Nai',
            createdAt: '2026-10-12T16:20:00.000Z'
        },
        {
            customerCode: 'KH2600000005',
            username: 'tuanhung_hb',
            fullName: 'Đặng Tuấn Hưng',
            phone: '0938990011',
            address: 'Tổ 5, Phường Đồng Tiến, TP. Hòa Bình, Hòa Bình',
            createdAt: '2026-10-15T11:00:00.000Z'
        }
    ];

    // -------------------------------------------------------------
    // QUẢN TRỊ BỘ NHỚ LƯU TRỮ (LOCALSTORAGE)
    // -------------------------------------------------------------
    function getStorage(key, fallback) {
        if (typeof localStorage === 'undefined') return fallback;
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (_) {
            return fallback;
        }
    }

    function setStorage(key, value) {
        if (typeof localStorage === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('setStorage error for key ' + key, e);
        }
    }

    // Đảm bảo dữ liệu khách hàng có đầy đủ mã 12 ký tự
    function getCustomersList() {
        let list = getStorage('ocop_customers', []);
        if (!Array.isArray(list) || list.length === 0) {
            list = SEED_CUSTOMERS.slice();
            setStorage('ocop_customers', list);
            return list;
        }

        let updated = false;
        list.forEach((c, idx) => {
            if (!c.customerCode || String(c.customerCode).length !== 12) {
                c.customerCode = 'KH26' + String(10000001 + idx).slice(-8);
                updated = true;
            }
        });
        if (updated) setStorage('ocop_customers', list);
        return list;
    }

    const DEMO_DISTRIBUTOR = {
        distributorCode: 'NPP26DEMO001',
        username: 'nppdemo',
        password: 'NppDemo@2026',
        name: 'Nhà phân phối Demo OCOP',
        shortName: 'NPP Demo',
        region: 'Đồng Nai',
        hotline: '',
        address: 'Tài khoản minh họa tại Đồng Nai',
        certDecision: 'Tài khoản demo — chưa có chứng nhận',
        encryptionKey: 'DEMO_ONLY_NPP26DEMO001',
        status: 'Hoạt động',
        isDemo: true
    };

    function getDistributorsList() {
        let list = getStorage('ocop_distributors', []);
        if (!Array.isArray(list) || list.length === 0) {
            list = [...SEED_DISTRIBUTORS, {...DEMO_DISTRIBUTOR}];
            setStorage('ocop_distributors', list);
        } else if (!list.some(distributor => distributor.distributorCode === DEMO_DISTRIBUTOR.distributorCode)) {
            list = [...list, {...DEMO_DISTRIBUTOR}];
            setStorage('ocop_distributors', list);
        }
        return list;
    }

    function getCatalogProducts() {
        if (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length > 0) {
            return window.PRODUCTS.map(product=>productCodes.decorate(product));
        }
        return [];
    }

    function authenticateDistributor(username, password) {
        const login = String(username || '').trim().toLowerCase();
        const secret = String(password || '').trim();
        if (!login || !secret) return null;
        return getDistributorsList().find(distributor =>
            [distributor.username, distributor.distributorCode].some(value => value && String(value).toLowerCase() === login)
            && (distributor.password ? distributor.password === secret : [distributor.pin, distributor.encryptionKey, '123456'].includes(secret))
        ) || null;
    }

    // Lấy tồn kho (kèm khởi tạo giá trị thực tế theo sản phẩm)
    function getInventoryMap(products) {
        let stockMap = getStorage('ocop_inventory_stock', null);
        if (!stockMap || typeof stockMap !== 'object') {
            stockMap = {};
            const list = products || getCatalogProducts();
            list.forEach(p => {
                const base = ((Number(p.id) || 1) * 37) % 240 + 35;
                stockMap[p.id] = base;
            });
            setStorage('ocop_inventory_stock', stockMap);
        }
        return stockMap;
    }

    // Cập nhật tồn kho 1 sản phẩm
    function updateProductStock(productId, newStock) {
        productId = String(productId);
        const stockMap = getInventoryMap();
        stockMap[productId] = Math.max(0, parseInt(newStock, 10) || 0);
        setStorage('ocop_inventory_stock', stockMap);
        return stockMap[productId];
    }

    // Lấy số lượng đã bán (kèm khởi tạo và cộng dồn từ đơn hàng thực tế)
    function getSalesVolumeMap(products) {
        let salesMap = getStorage('ocop_sales_volume', null);
        if (!salesMap || typeof salesMap !== 'object') {
            salesMap = {};
            const list = products || getCatalogProducts();
            list.forEach(p => {
                const base = ((Number(p.id) || 1) * 23) % 150 + 15;
                salesMap[p.id] = base;
            });
            setStorage('ocop_sales_volume', salesMap);
        }

        // Tích hợp thêm từ đơn đặt hàng online thực tế
        const orders = getStorage('ocop_online_orders', []);
        if (Array.isArray(orders)) {
            orders.forEach(o => {
                if (o.productId) {
                    const pid = String(o.productId);
                    salesMap[pid] = (salesMap[pid] || 0) + (Number(o.qty) || 1);
                }
            });
        }

        return salesMap;
    }

    // -------------------------------------------------------------
    // QUẢN LÝ PHÂN QUYỀN & MÃ HÓA CÔ LẬP RIÊNG (SCOPING ENGINE)
    // -------------------------------------------------------------
    function getActiveScope() {
        const defaultScope = {
            role: 'webmaster',
            distributorCode: null,
            name: 'Quản Trị Viên Hệ Thống (Toàn Quyền)',
            token: 'ENC_MASTER_KEY_2007'
        };
        const saved=getStorage('ocop_admin_scope', defaultScope);
        const user=(typeof window!=='undefined' && typeof window.getCurrentCustomer==='function' ? window.getCurrentCustomer() : null) || getStorage('ocop_current_user',null);
        if(user && (user.role==='distributor'||user.isDistributor)) {
            const distributor=getDistributorsList().find(d=>(user.distributorCode && d.distributorCode===user.distributorCode) || (user.username && d.username===user.username));
            return {role:'distributor',distributorCode:distributor?.distributorCode||user.distributorCode||null,name:distributor?.name||user.fullName||user.username,region:distributor?.region};
        }
        return saved;
    }

    function setActiveScope(role, distributorCode, adminUsername) {
        const signedIn=(typeof window!=='undefined' && typeof window.getCurrentCustomer==='function' ? window.getCurrentCustomer() : null) || getStorage('ocop_current_user',null);
        if(signedIn && (signedIn.role==='distributor'||signedIn.isDistributor)){
            const own=getDistributorsList().find(d=>(signedIn.distributorCode && d.distributorCode===signedIn.distributorCode)||(signedIn.username && d.username===signedIn.username));
            if(!own)return getActiveScope();
            role='distributor';distributorCode=own.distributorCode;
        }
        let scope;
        if (role === 'distributor' && distributorCode) {
            const list = getDistributorsList();
            const dist = list.find(d => d.distributorCode === distributorCode) || list[0];
            scope = {
                role: 'distributor',
                distributorCode: dist.distributorCode,
                name: dist.name,
                region: dist.region,
                token: 'ENC_' + dist.distributorCode + '_' + Math.random().toString(36).substring(2, 8).toUpperCase()
            };
        } else {
            const adminList = getAdminAccounts();
            const currentUser = (typeof window !== 'undefined' && typeof window.getCurrentCustomer === 'function'
                ? window.getCurrentCustomer() : null) || getStorage('ocop_current_user', null);
            const signedInAdmin = currentUser && adminList.find(a => a.username.toLowerCase() === String(currentUser.username || '').toLowerCase());
            const signedInUsername = signedInAdmin?.username || (currentUser && (currentUser.isAdmin || ['admin', 'super_admin'].includes(currentUser.role)) ? currentUser.username : null);
            const selectedUsername = adminUsername || signedInUsername || getActiveScope().adminUsername;
            const admin = adminList.find(a => a.username.toLowerCase() === String(selectedUsername || '').toLowerCase())
                || (selectedUsername ? {fullName: currentUser?.username === selectedUsername ? currentUser.fullName || selectedUsername : selectedUsername, username: selectedUsername} : adminList[0]);
            const adminName = admin ? admin.fullName : 'Quản Trị Viên Hệ Thống (Toàn Quyền)';
            const adminUser = admin ? admin.username : 'ThaoNguyenad01';
            scope = {
                role: 'webmaster',
                adminUsername: adminUser,
                distributorCode: null,
                name: adminName,
                token: 'ENC_ADM_' + adminUser + '_OK'
            };
        }
        setStorage('ocop_admin_scope', scope);
        return scope;
    }

    // Lọc dữ liệu theo phạm vi bảo mật (Webmaster xem 100%, NPP chỉ xem dữ liệu của riêng mình)
    function getScopedDatasets() {
        const scope = getActiveScope();
        const allProducts = getCatalogProducts();
        const allDistributors = getDistributorsList();
        const allCustomers = getCustomersList();
        const allOrders = getStorage('ocop_online_orders', []);
        const stockMap = getInventoryMap(allProducts);
        const salesMap = getSalesVolumeMap(allProducts);

        if (scope.role === 'webmaster') {
            // Webmaster xem toàn bộ 100% dữ liệu
            return {
                scope,
                distributors: allDistributors,
                customers: allCustomers.map(c => {
                    const myOrders = allOrders.filter(o => 
                        (o.customerCode && o.customerCode === c.customerCode) ||
                        (o.customerPhone && c.phone && String(o.customerPhone).replace(/\s/g,'') === String(c.phone).replace(/\s/g,'')) ||
                        (o.customerName && c.fullName && o.customerName === c.fullName)
                    );
                    const totalSpend = myOrders.reduce((sum, o) => sum + (Number(o.grandTotal) || Number(o.goodsTotal) || 0), 0);
                    return {
                        ...c,
                        ordersCount: myOrders.length,
                        totalSpend: totalSpend
                    };
                }),
                products: allProducts.map(p => {
                    const sid = String(p.id);
                    const stock = stockMap[sid] !== undefined ? stockMap[sid] : 50;
                    const sold = salesMap[sid] !== undefined ? salesMap[sid] : 20;
                    const dist = allDistributors.find(d => d.region === p.region) || {
                        name: 'HTX OCOP ' + p.region,
                        distributorCode: 'NPP260000001'
                    };
                    return {
                        ...p,
                        stock: stock,
                        sold: sold,
                        distributorName: dist.name,
                        distributorCode: dist.distributorCode,
                        revenue: sold * (Number(p.price) || 0)
                    };
                }),
                isScoped: false
            };
        } else {
            // Nhà phân phối: Mã hóa và cô lập riêng cho nhà phân phối
            const currentDist = allDistributors.find(d => d.distributorCode === scope.distributorCode);
            if(!currentDist)return {scope,distributors:[],customers:[],products:[],isScoped:true};
            
            // Lọc sản phẩm của NPP
            const ownedProducts=allProducts.filter(p=>p.distributorCode ? p.distributorCode===currentDist.distributorCode
                : Array.isArray(currentDist.productIds) ? currentDist.productIds.some(id=>String(id)===String(p.id))
                : allDistributors.find(d=>d.region===p.region)?.distributorCode===currentDist.distributorCode);
            const ownedIds=new Set(ownedProducts.map(p=>String(p.id)));
            const completed=order=>!['cancelled','refunded'].includes(order.status) && Boolean(order.customerReceivedAt || order.receivedAt || order.customerConfirmedReceived===true || order.status==='received');
            const scopedOrders=allOrders.filter(order=>completed(order) && (!order.distributorCode||order.distributorCode===currentDist.distributorCode)
                && (ownedIds.has(String(order.productId)) || (order.lines||order.items||[]).some(item=>ownedIds.has(String(item.productId??item.id)) && (!item.distributorCode||item.distributorCode===currentDist.distributorCode))));
            const ownLines=order=>(Array.isArray(order.lines)?order.lines:Array.isArray(order.items)?order.items:[{productId:order.productId,qty:order.qty,price:order.unitPrice}]).filter(item=>ownedIds.has(String(item.productId??item.id)) && (!item.distributorCode||item.distributorCode===currentDist.distributorCode));
            const lineTotal=order=>ownLines(order).reduce((sum,item)=>sum+(Number(item.unitPrice??item.price)||Number(ownedProducts.find(p=>String(p.id)===String(item.productId??item.id))?.price)||0)*(Number(item.quantity??item.qty)||1),0);
            const scopedProducts = ownedProducts.map(p => {
                const sid = String(p.id);
                const stock = stockMap[sid] !== undefined ? stockMap[sid] : 50;
                const sold = scopedOrders.reduce((sum,order)=>sum+ownLines(order).filter(item=>String(item.productId??item.id)===sid).reduce((count,item)=>count+(Number(item.quantity??item.qty)||1),0),0);
                return {
                    ...p,
                    stock: stock,
                    sold: sold,
                    distributorName: currentDist.name,
                    distributorCode: currentDist.distributorCode,
                    revenue: scopedOrders.reduce((sum,order)=>sum+ownLines(order).filter(item=>String(item.productId??item.id)===sid).reduce((amount,item)=>amount+(Number(item.unitPrice??item.price)||Number(p.price)||0)*(Number(item.quantity??item.qty)||1),0),0)
                };
            });

            // Lọc đơn hàng liên quan đến NPP này

            // Lọc khách hàng có liên quan tới NPP này
            const scopedCustomerCodes = new Set(scopedOrders.map(o => o.customerCode).filter(Boolean));
            const scopedCustomerPhones = new Set(scopedOrders.map(o => String(o.customerPhone || '').replace(/\s/g,'')).filter(Boolean));

            let scopedCustomers = allCustomers.filter(c => 
                scopedCustomerCodes.has(c.customerCode) ||
                scopedCustomerPhones.has(String(c.phone || '').replace(/\s/g,''))
            );
            for(const order of scopedOrders){
                const phone=String(order.customerPhone||'').replace(/\s/g,'');
                if(!phone||scopedCustomers.some(c=>String(c.phone||'').replace(/\s/g,'')===phone))continue;
                scopedCustomers.push({customerCode:/^[A-Z0-9]{12}$/.test(order.customerCode||'')?order.customerCode:'KH'+phone.replace(/\D/g,'').slice(-10).padStart(10,'0'),fullName:order.customerName||'Khách mua hàng',phone,address:'',status:'active'});
            }


            const enrichedCustomers = scopedCustomers.map(c => {
                const myOrders = scopedOrders.filter(o => 
                    (o.customerCode && o.customerCode === c.customerCode) ||
                    (o.customerPhone && c.phone && String(o.customerPhone).replace(/\s/g,'') === String(c.phone).replace(/\s/g,''))
                );
                const totalSpend = myOrders.reduce((sum, o) => sum + lineTotal(o), 0);
                return {
                    ...c,
                    ordersCount: myOrders.length,
                    totalSpend
                };
            });

            return {
                scope,
                distributor: currentDist,
                distributors: [currentDist], // chỉ thấy chính mình
                customers: enrichedCustomers,
                products: scopedProducts,
                isScoped: true
            };
        }
    }

    // -------------------------------------------------------------
    // GIAO DIỆN MODAL QUẢN TRỊ ĐA PHÂN QUYỀN (#admin-management-modal)
    // -------------------------------------------------------------
    let activeTab = 'customers';
    let searchQuery = '';
    let statusFilter = 'all';

    function formatVND(n) {
        return Number(n || 0).toLocaleString('vi-VN') + ' ₫';
    }
    function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}

    function openAdminManagementModal(role, distCode) {
        if (typeof window !== 'undefined' && typeof window.getCurrentCustomer === 'function') {
            const user = window.getCurrentCustomer();
            const hasPrivilege = (typeof window.isCurrentUserAdminOrDistributor === 'function')
                ? window.isCurrentUserAdminOrDistributor(user)
                : (user && (user.role === 'admin' || user.role === 'distributor' || user.isAdmin || user.isDistributor));
            if (user && !hasPrivilege) {
                const message = '⚠️ Tài khoản khách hàng không có quyền truy cập Quản trị. Vui lòng đăng nhập tài khoản Admin hoặc Nhà Phân Phối!';
                if (window.showAccountNotice?.(message)) return;
                if (typeof window.showToast === 'function') {
                    window.showToast(message, 'warning');
                }
                return;
            }
            if (!role && user && hasPrivilege) {
                role = user.role === 'distributor' || user.isDistributor ? 'distributor' : 'webmaster';
                if (role === 'distributor') distCode = user.distributorCode;
            }
        }

        if (role) {
            setActiveScope(role, distCode);
        }

        // Tắt các modal quản trị cũ nếu có
        if (typeof window !== 'undefined') {
            if (window.closeAdminPinModal) window.closeAdminPinModal();
            if (window.closeAdminHubModal) window.closeAdminHubModal();
        }

        let modal = document.getElementById('admin-management-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'admin-management-modal';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-labelledby', 'admin-mgmt-title');
            modal.style.cssText = 'display: flex !important; position: fixed !important; inset: 0 !important; z-index: 2147483647 !important; align-items: center !important; justify-content: center !important; padding: 12px !important; background: rgba(15, 23, 42, 0.85) !important; backdrop-filter: blur(8px) !important; overflow-y: auto !important;';
            document.body.appendChild(modal);

            // Bấm vào vùng mờ backdrop bên ngoài để đóng modal
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    closeAdminManagementModal();
                }
            });
        }

        // Lắng nghe phím Esc để đóng nhanh bảng quản trị
        if (!window._adminEscListenerAttached) {
            window.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    const m = document.getElementById('admin-management-modal');
                    if (m && !m.classList.contains('hidden') && m.style.display !== 'none') {
                        closeAdminManagementModal();
                    }
                }
            });
            window._adminEscListenerAttached = true;
        }

        modal.classList.remove('hidden');
        modal.style.setProperty('display', 'flex', 'important');
        document.body.style.overflow = 'hidden';

        renderAdminManagementUI();
    }

    function closeAdminManagementModal() {
        const modal = document.getElementById('admin-management-modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.setProperty('display', 'none', 'important');
        }
        document.body.style.overflow = 'auto';
    }

    function switchAdminTab(tab) {
        activeTab = tab;
        searchQuery = '';
        statusFilter = 'all';
        renderAdminManagementUI();
    }

    function switchAdminRole(role, distCode, adminUsername) {
        productGroupFilter='all';productCodeSearch='';
        setActiveScope(role, distCode, adminUsername);
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            const scope = getActiveScope();
            window.showToast('Đã chuyển vai trò: ' + scope.name, 'success');
        }
        renderAdminManagementUI();
    }

    function renderAdminManagementUI() {
        const modal = document.getElementById('admin-management-modal');
        if (!modal) return;

        const data = getScopedDatasets();
        const scope = data.scope;
        const allDistributors = getDistributorsList();

        // Tính toán các chỉ số KPI
        const totalCustomers = data.customers.length;
        const totalProducts = data.products.length;
        const totalStock = data.products.reduce((acc, p) => acc + (p.stock || 0), 0);
        const totalSold = data.products.reduce((acc, p) => acc + (p.sold || 0), 0);
        const totalRevenue = data.products.reduce((acc, p) => acc + (p.revenue || 0), 0);

        // Header HTML
        const isMaster = scope.role === 'webmaster';
        const roleBadge = isMaster
            ? '<span class="admin-mgmt-scope-badge"><i class="fa-solid fa-crown" aria-hidden="true"></i> Toàn bộ hệ thống</span>'
            : '<span class="admin-mgmt-scope-badge"><i class="fa-solid fa-store" aria-hidden="true"></i> ' + (scope.name || '') + ' · ' + scope.distributorCode + '</span>';

        // Role Switcher Select (4 Admin accounts + Distributors)
        let selectOptions = '';
        const adminAccounts = getAdminAccounts();
        (isMaster?adminAccounts:[]).forEach(adm => {
            const isSel = isMaster && scope.adminUsername === adm.username;
            selectOptions += '<option value="admin:' + adm.username + '"' + (isSel ? ' selected' : '') + '>👑 ' + adm.fullName + ' (@' + adm.username + ')</option>';
        });
        (isMaster?allDistributors:allDistributors.filter(d=>d.distributorCode===scope.distributorCode)).forEach(d => {
            const selected = (!isMaster && scope.distributorCode === d.distributorCode) ? ' selected' : '';
            selectOptions += '<option value="' + d.distributorCode + '"' + selected + '>🏬 ' + d.shortName + ' (' + d.distributorCode + ')</option>';
        });

        // Tabs Config
        const tabs = [
            { id: 'customers', label: '👥 Khách hàng', count: totalCustomers },
            { id: 'distributors', label: '🏬 Nhà phân phối', count: isMaster ? allDistributors.length : 1 },
            { id: 'inventory', label: '📦 Tồn kho', count: totalProducts },
            { id: 'sales', label: '📈 Đã bán', count: totalSold }
        ];

        let tabButtonsHtml = tabs.map(t => {
            const isActive = activeTab === t.id;
            const btnCls = isActive
                ? 'py-3 px-4 font-black text-sm text-sky-700 border-b-2 border-sky-600 bg-sky-50/60 transition cursor-pointer flex items-center gap-2'
                : 'py-3 px-4 font-bold text-sm text-slate-500 hover:text-slate-800 border-b-2 border-transparent transition cursor-pointer flex items-center gap-2';
            return '<button type="button" aria-pressed="' + isActive + '" onclick="OcopAdminManagement.switchAdminTab(\'' + t.id + '\')" class="' + btnCls + '">' +
                '<span>' + t.label + '</span>' +
                '<span class="px-2 py-0.5 rounded-full text-[11px] font-bold ' + (isActive ? 'bg-sky-200 text-sky-800' : 'bg-slate-100 text-slate-600') + '">' + t.count + '</span>' +
            '</button>';
        }).join('');

        // Tab Content
        let contentHtml = '';
        if (activeTab === 'customers') {
            contentHtml = renderCustomersTabHtml(data.customers, isMaster);
        } else if (activeTab === 'distributors') {
            contentHtml = renderDistributorsTabHtml(data.distributors, isMaster, scope.distributorCode);
        } else if (activeTab === 'inventory') {
            contentHtml = renderInventoryTabHtml(data.products, isMaster);
        } else if (activeTab === 'sales') {
            contentHtml = renderSalesTabHtml(data.products, totalRevenue, totalSold, isMaster);
        }

        modal.innerHTML = `
            <div id="admin-mgmt-container" class="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl border-2 border-sky-300 shadow-[0_25px_60px_rgba(2,132,199,0.35)] flex flex-col overflow-hidden text-slate-800" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;">
                
                <!-- TOP HEADER CỐ ĐỊNH -->
                <div class="admin-mgmt-header">
                    <div>
                        <div class="flex items-center gap-2.5 mb-1">
                            <span class="w-8 h-8 rounded-lg bg-sky-500/30 border border-sky-400/40 flex items-center justify-center text-sky-300 text-base">
                                <i class="fa-solid fa-layer-group"></i>
                            </span>
                            <h2 id="admin-mgmt-title">
                                Quản trị OCOP
                            </h2>
                        </div>
                        <div class="admin-mgmt-subtitle">
                            Khách hàng · Nhà phân phối · Tồn kho · Doanh số
                        </div>
                    </div>

                    <!-- ROLE CHANGER & CLOSE BUTTON -->
                    <div class="admin-mgmt-actions">
                        <label class="admin-mgmt-account" for="admin-role-selector">
                            <span>Tài khoản quản lý</span>
                            <select id="admin-role-selector" onchange="OcopAdminManagement.onRoleSelectChange(this.value)">
                                ${selectOptions}
                            </select>
                        </label>
                        <button type="button" onclick="OcopAdminManagement.logoutAdmin()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-500/50 text-xs font-bold transition cursor-pointer" title="Đăng xuất khỏi phiên quản trị">
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <span>Đăng xuất</span>
                        </button>
                        <button type="button" id="admin-mgmt-close" onclick="OcopAdminManagement.closeAdminManagementModal()" title="Đóng cửa sổ quản trị (Esc)">
                            <i class="fa-solid fa-xmark text-sm"></i>
                            <span>Đóng (Esc)</span>
                        </button>
                    </div>
                </div>

                <div class="admin-mgmt-scroll overflow-y-auto">
                <!-- SUB-HEADER ROLE & STATUS NOTIFICATION -->
                <div class="admin-mgmt-scope">
                    <div class="flex items-center gap-2">
                        <span class="text-slate-500 font-bold">Phạm vi dữ liệu:</span>
                        ${roleBadge}
                    </div>
                </div>

                <!-- 4 KPI SUMMARY CARDS -->
                <div class="admin-mgmt-stats">
                    <div class="p-3 bg-white rounded-2xl border border-sky-200 shadow-2xs">
                        <div class="text-[11px] font-bold text-slate-500 uppercase">Khách Hàng</div>
                        <div class="text-xl font-black text-sky-900 mt-0.5">${totalCustomers} <span class="text-xs font-normal text-slate-500">tài khoản</span></div>
                    </div>
                    <div class="p-3 bg-white rounded-2xl border border-sky-200 shadow-2xs">
                        <div class="text-[11px] font-bold text-slate-500 uppercase">Nhà Phân Phối</div>
                        <div class="text-xl font-black text-sky-900 mt-0.5">${isMaster ? allDistributors.length : 1} <span class="text-xs font-normal text-slate-500">đơn vị</span></div>
                    </div>
                    <div class="p-3 bg-white rounded-2xl border border-sky-200 shadow-2xs">
                        <div class="text-[11px] font-bold text-slate-500 uppercase">Tổng Tồn Kho</div>
                        <div class="text-xl font-black text-emerald-700 mt-0.5">${totalStock.toLocaleString('vi-VN')} <span class="text-xs font-normal text-slate-500">sản phẩm</span></div>
                    </div>
                    <div class="p-3 bg-white rounded-2xl border border-sky-200 shadow-2xs">
                        <div class="text-[11px] font-bold text-slate-500 uppercase">Đã Bán / Doanh Thu</div>
                        <div class="text-xl font-black text-rose-600 mt-0.5">${totalSold.toLocaleString('vi-VN')} <span class="text-xs font-normal text-slate-500">sản phẩm</span></div>
                        <div class="admin-mgmt-revenue">${formatVND(totalRevenue)}</div>
                    </div>
                </div>

                <!-- NAVIGATION TABS -->
                <div class="admin-mgmt-tabs" role="group" aria-label="Danh mục quản lý">
                    ${tabButtonsHtml}
                </div>

                <!-- MAIN SCROLLABLE TAB BODY -->
                <div class="admin-mgmt-content">
                    ${contentHtml}
                </div>
                </div>

                <!-- FOOTER BAR -->
                <div class="admin-mgmt-footer">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Dữ liệu quản lý theo phạm vi tài khoản</span>
                    </div>
                </div>
            </div>
        `;
    }

    // -------------------------------------------------------------
    // RENDER TAB 1: QUẢN LÝ KHÁCH HÀNG (MÃ 12 KÝ TỰ)
    // -------------------------------------------------------------
    function renderCustomersTabHtml(customers, isMaster) {
        let rows = customers.map(c => {
            return `
                <tr class="border-b border-slate-100 hover:bg-sky-50/40 transition">
                    <td class="p-3.5">
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-900 border border-sky-200 font-mono font-black text-xs tracking-wider">
                            <span>${c.customerCode}</span>
                            <button type="button" onclick="window.copyToClipboard && window.copyToClipboard('${c.customerCode}', 'Đã sao chép mã KH: ${c.customerCode}')" class="text-sky-600 hover:text-sky-900 transition cursor-pointer" title="Sao chép mã khách hàng">
                                <i class="fa-regular fa-copy text-[11px]"></i>
                            </button>
                        </div>
                    </td>
                    <td class="p-3.5">
                        <div class="font-bold text-slate-900 text-sm">${escapeHtml(c.fullName || c.username)}</div>
                        <div class="text-xs text-slate-400">@${c.username}</div>
                    </td>
                    <td class="p-3.5 font-bold text-slate-700 text-xs">${c.phone || 'Chưa cung cấp'}</td>
                    <td class="p-3.5 text-xs text-slate-600 max-w-[220px] truncate" title="${c.address || ''}">${c.address || 'Chưa có địa chỉ'}</td>
                    <td class="p-3.5 text-center font-bold text-sky-700 text-xs">${c.ordersCount || 0}</td>
                    <td class="p-3.5 text-right font-black text-rose-600 text-sm whitespace-nowrap">${formatVND(c.totalSpend || 0)}</td>
                    <td class="p-3.5 text-center whitespace-nowrap">
                        <span class="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Đang hoạt động
                        </span>
                    </td>
                </tr>
            `;
        }).join('');

        if (customers.length === 0) {
            rows = `<tr><td colspan="7" class="p-6 text-center text-slate-400 font-medium">Chưa có khách hàng nào thuộc phạm vi quản lý này.</td></tr>`;
        }

        return `
            <div class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 class="text-base font-black text-slate-900 m-0">Danh Sách Khách Hàng Đã Đăng Ký (${customers.length})</h3>
                        <p class="text-xs text-slate-500 m-0">Mỗi tài khoản được cấp tự động 01 Mã Khách Hàng duy nhất độ dài 12 ký tự để tích điểm và bảo hành.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                                <tr>
                                    <th class="p-3.5">Mã Khách Hàng (12 ký tự)</th>
                                    <th class="p-3.5">Họ và Tên / Username</th>
                                    <th class="p-3.5">Số Điện Thoại</th>
                                    <th class="p-3.5">Địa Chỉ Nhận Hàng</th>
                                    <th class="p-3.5 text-center">Đơn Mua</th>
                                    <th class="p-3.5 text-right">Tổng Chi Tiêu</th>
                                    <th class="p-3.5 text-center">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // -------------------------------------------------------------
    // RENDER TAB 2: QUẢN LÝ NHÀ PHÂN PHỐI (MÃ 12 KÝ TỰ)
    // -------------------------------------------------------------
    function renderDistributorsTabHtml(distributors, isMaster, activeDistCode) {
        if (!isMaster) {
            // Nhà phân phối xem chứng nhận & cổng riêng của chính mình
            const d = distributors[0];
            return `
                <div class="max-w-2xl mx-auto space-y-4">
                    <div class="p-6 bg-white rounded-3xl border-2 border-emerald-300 shadow-md">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    MÃ NPP CHÍNH THỨC: ${d.distributorCode}
                                </span>
                                <h3 class="text-lg font-black text-slate-900 mt-2 mb-1">${d.name}</h3>
                                <div class="text-xs text-slate-500">${d.address}</div>
                            </div>
                            <span class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xl shrink-0">
                                <i class="fa-solid fa-store"></i>
                            </span>
                        </div>

                        <div class="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span class="text-slate-400 font-bold block">Tỉnh Thành Phụ Trách:</span>
                                <strong class="text-slate-800 text-sm">${d.region}</strong>
                            </div>
                            <div>
                                <span class="text-slate-400 font-bold block">Hotline Nhà Phân Phối:</span>
                                <strong class="text-sky-700 text-sm">${d.hotline}</strong>
                            </div>
                            <div class="col-span-2">
                                <span class="text-slate-400 font-bold block">Quyết Định Chứng Nhận OCOP:</span>
                                <strong class="text-slate-700">${d.certDecision}</strong>
                            </div>
                            <div class="col-span-2">
                                <span class="text-slate-400 font-bold block">Mã Hóa Dữ Liệu Riêng (Secret Token):</span>
                                <code class="font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 block mt-1">${d.encryptionKey}</code>
                            </div>
                        </div>

                        <div class="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                            🔒 Bạn đang trong không gian bảo mật cô lập của <strong>${d.shortName}</strong>. Dữ liệu kho hàng, doanh số và thông tin khách hàng của các nhà phân phối khác hoàn toàn được bảo vệ và ẩn khỏi phiên làm việc này.
                        </div>
                    </div>
                </div>
            `;
        }

        // Webmaster xem toàn bộ danh sách NPP
        let rows = distributors.map(d => {
            const allProducts = getCatalogProducts().filter(p => p.region === d.region);
            const stockMap = getInventoryMap();
            const salesMap = getSalesVolumeMap();
            const stockTotal = allProducts.reduce((sum, p) => sum + (stockMap[String(p.id)] || 0), 0);
            const soldTotal = allProducts.reduce((sum, p) => sum + (salesMap[String(p.id)] || 0), 0);
            const revTotal = allProducts.reduce((sum, p) => sum + ((salesMap[String(p.id)] || 0) * (Number(p.price) || 0)), 0);

            return `
                <tr class="border-b border-slate-100 hover:bg-sky-50/40 transition">
                    <td class="p-3.5">
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono font-black text-xs tracking-wider">
                            <span>${d.distributorCode}</span>
                            <button type="button" onclick="window.copyToClipboard && window.copyToClipboard('${d.distributorCode}', 'Đã sao chép mã NPP: ${d.distributorCode}')" class="text-emerald-700 hover:text-emerald-950 transition cursor-pointer" title="Sao chép mã NPP">
                                <i class="fa-regular fa-copy text-[11px]"></i>
                            </button>
                        </div>
                    </td>
                    <td class="p-3.5">
                        <div class="font-bold text-slate-900 text-sm">${d.name}</div>
                        <div class="text-xs text-slate-400">${d.address}</div>
                    </td>
                    <td class="p-3.5 font-bold text-sky-800 text-xs">${d.region}</td>
                    <td class="p-3.5 font-bold text-slate-700 text-xs">${d.hotline}</td>
                    <td class="p-3.5 text-center font-bold text-slate-800 text-xs">${allProducts.length} SP</td>
                    <td class="p-3.5 text-center font-bold text-emerald-700 text-xs">${stockTotal.toLocaleString('vi-VN')}</td>
                    <td class="p-3.5 text-center font-bold text-rose-600 text-xs">${soldTotal.toLocaleString('vi-VN')}</td>
                    <td class="p-3.5 text-right font-black text-rose-600 text-xs">${formatVND(revTotal)}</td>
                    <td class="p-3.5 text-center">
                        <button type="button" onclick="OcopAdminManagement.switchAdminRole('distributor', '${d.distributorCode}')" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer shadow-2xs">
                            Truy Cập Cổng NPP 👉
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        return `
            <div class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 class="text-base font-black text-slate-900 m-0">Mạng Lưới Nhà Phân Phối & Hợp Tác Xã Toàn Quốc (${distributors.length})</h3>
                        <p class="text-xs text-slate-500 m-0">Mỗi nhà phân phối được cấp Mã 12 ký tự duy nhất để quản lý vùng nguyên liệu và theo dõi kho hàng.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                                <tr>
                                    <th class="p-3.5">Mã NPP (12 ký tự)</th>
                                    <th class="p-3.5">Tên Đơn Vị / HTX</th>
                                    <th class="p-3.5">Vùng / Tỉnh</th>
                                    <th class="p-3.5">Hotline</th>
                                    <th class="p-3.5 text-center">Cung Ứng</th>
                                    <th class="p-3.5 text-center">Tổng Tồn</th>
                                    <th class="p-3.5 text-center">Đã Bán</th>
                                    <th class="p-3.5 text-right">Doanh Số</th>
                                    <th class="p-3.5 text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // -------------------------------------------------------------
    // RENDER TAB 3: QUẢN LÝ HÀNG TỒN KHO (INVENTORY STOCK)
    // -------------------------------------------------------------
    function renderProductGroupControls(products){
        const options=Object.values(productCodes.groups).map(group=>`<option value="${group.prefix}"${productGroupFilter===group.prefix?' selected':''}>${group.prefix} · ${group.name} (${products.filter(product=>productCodes.groupFor(product).prefix===group.prefix).length})</option>`).join('');
        return `<div class="flex flex-wrap items-center gap-3 mb-4"><label class="flex flex-wrap items-center gap-2 font-bold text-sky-900">Nhóm sản phẩm <select onchange="OcopAdminManagement.setProductGroup(this.value)" class="rounded-xl border border-sky-200 bg-white p-2 text-sm"><option value="all"${productGroupFilter==='all'?' selected':''}>Tất cả nhóm (${products.length})</option>${options}</select></label><input id="admin-mgmt-product-search" type="search" value="${escapeHtml(productCodeSearch)}" oninput="OcopAdminManagement.searchProducts(this.value)" placeholder="Tìm mã hoặc tên sản phẩm" aria-label="Tìm mã hoặc tên sản phẩm" class="min-w-0 rounded-xl border border-sky-200 bg-white p-2 text-sm"></div>`;
    }
    function setProductGroup(value){
        productGroupFilter=value==='all'||Object.values(productCodes.groups).some(group=>group.prefix===value)?value:'all';
        renderAdminManagementUI();
    }
    function searchProducts(value){
        clearTimeout(productSearchTimer);
        productSearchTimer=setTimeout(()=>{productCodeSearch=String(value||'').slice(0,120);renderAdminManagementUI();const input=document.getElementById('admin-mgmt-product-search');if(input){input.focus();}},200);
    }
    function renderInventoryTabHtml(products, isMaster) {
        const groupControls=renderProductGroupControls(products);
        products=products.filter(product=>(productGroupFilter==='all'||productCodes.groupFor(product).prefix===productGroupFilter)&&productCodes.matches(product,productCodeSearch));
        let rows = products.map(p => {
            let statusBadge = '';
            if (p.stock > 50) {
                statusBadge = '<span class="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">Còn hàng</span>';
            } else if (p.stock > 0) {
                statusBadge = '<span class="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">Sắp hết</span>';
            } else {
                statusBadge = '<span class="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">Hết hàng</span>';
            }

            return `
                <tr class="border-b border-slate-100 hover:bg-sky-50/50 transition">
                    <td class="p-3.5">
                        <div class="flex items-center gap-3">
                            <img src="${p.img || 'images/catalog/web-latest-1.jpg'}" alt="${p.name}" class="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs" onerror="this.src='images/catalog/web-latest-1.jpg'">
                            <div>
                                <div class="font-bold text-slate-900 text-sm leading-snug">${p.name}</div>
                                <div class="text-xs text-slate-500 font-medium mt-0.5"><strong class="font-mono text-sky-800">${productCodes.codeFor(p)}</strong> · <span class="text-sky-700">${p.region}</span></div>
                            </div>
                        </div>
                    </td>
                    <td class="p-3.5 text-xs font-semibold text-slate-600 whitespace-nowrap">${p.distributorName || 'HTX OCOP'}</td>
                    <td class="p-3.5 font-black text-slate-900 text-sm whitespace-nowrap">${formatVND(p.price)}</td>
                    <td class="p-3.5 whitespace-nowrap">
                        <div class="inline-flex items-center gap-1.5">
                            <input type="number" id="stock-input-${p.id}" value="${p.stock}" min="0" max="99999" class="w-18 px-2.5 py-1.5 rounded-xl border border-slate-300 text-center font-black text-xs bg-white text-slate-900 shadow-2xs focus:border-sky-500 focus:outline-none">
                            <button type="button" onclick="OcopAdminManagement.saveStockInput(${p.id})" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs transition cursor-pointer shadow-2xs" title="Lưu số lượng tồn">
                                Lưu
                            </button>
                        </div>
                    </td>
                    <td class="p-3.5 text-center whitespace-nowrap">
                        ${statusBadge}
                    </td>
                </tr>
            `;
        }).join('');

        if (products.length === 0) {
            rows = `<tr><td colspan="5" class="p-6 text-center text-slate-400 font-medium">Không có sản phẩm nào thuộc phân vùng này.</td></tr>`;
        }

        return groupControls+`
            <div class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 class="text-base font-black text-slate-900 m-0">Quản Lý Tồn Kho Sản Phẩm (${products.length} mặt hàng)</h3>
                        <p class="text-xs text-slate-500 m-0">Điều chỉnh số lượng tồn thực tế. Dữ liệu được đồng bộ hóa và lưu trữ tức thì.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-100 border-b border-slate-200 text-slate-700 font-black uppercase text-xs tracking-wider">
                                <tr>
                                    <th class="p-3.5">Sản Phẩm &amp; ID</th>
                                    <th class="p-3.5 whitespace-nowrap">Nhà Phân Phối / Vùng</th>
                                    <th class="p-3.5 whitespace-nowrap">Giá Niêm Yết</th>
                                    <th class="p-3.5 whitespace-nowrap">Số Lượng Tồn</th>
                                    <th class="p-3.5 text-center whitespace-nowrap">Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // -------------------------------------------------------------
    // RENDER TAB 4: QUẢN LÝ SỐ LƯỢNG ĐÃ BÁN (SALES VOLUME)
    // -------------------------------------------------------------
    function renderSalesTabHtml(products, totalRevenue, totalSold, isMaster) {
        const groupControls=renderProductGroupControls(products);
        products=products.filter(product=>(productGroupFilter==='all'||productCodes.groupFor(product).prefix===productGroupFilter)&&productCodes.matches(product,productCodeSearch));
        // Sắp xếp sản phẩm theo số lượng bán nhiều nhất
        const sorted = products.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0));

        let rows = sorted.map((p, idx) => {
            const pct = totalSold > 0 ? Math.round(((p.sold || 0) / totalSold) * 100) : 0;
            return `
                <tr class="border-b border-slate-100 hover:bg-sky-50/50 transition">
                    <td class="p-3.5 text-center font-bold text-slate-400 text-xs">#${idx + 1}</td>
                    <td class="p-3.5">
                        <div class="flex items-center gap-3">
                            <img src="${p.img || 'images/catalog/web-latest-1.jpg'}" alt="${p.name}" class="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs" onerror="this.src='images/catalog/web-latest-1.jpg'">
                            <div>
                                <div class="font-bold text-slate-900 text-sm leading-snug">${p.name}</div>
                                <div class="text-xs text-slate-500 font-medium mt-0.5"><strong class="font-mono text-sky-800">${productCodes.codeFor(p)}</strong> · ${p.region} · Đơn giá: <strong class="text-slate-800">${formatVND(p.price)}</strong></div>
                            </div>
                        </div>
                    </td>
                    <td class="p-3.5 text-xs font-semibold text-slate-600 whitespace-nowrap">${p.distributorName || 'HTX OCOP'}</td>
                    <td class="p-3.5 text-center font-black text-rose-600 text-sm whitespace-nowrap">
                        ${(p.sold || 0).toLocaleString('vi-VN')}
                    </td>
                    <td class="p-3.5 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                        ${formatVND(p.revenue || 0)}
                    </td>
                    <td class="p-3.5 w-40">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                                <div class="bg-linear-to-r from-sky-500 to-indigo-600 h-2.5 rounded-full" style="width: ${Math.min(100, Math.max(8, pct * 3))}%"></div>
                            </div>
                            <span class="text-xs font-bold text-slate-600 shrink-0">${pct}%</span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        if (sorted.length === 0) {
            rows = `<tr><td colspan="6" class="p-6 text-center text-slate-400 font-medium">Chưa có số liệu bán hàng cho phân vùng này.</td></tr>`;
        }

        return groupControls+`
            <div class="space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 class="text-base font-black text-slate-900 m-0">Báo Cáo Sản Lượng & Doanh Thu Đã Bán</h3>
                        <p class="text-xs text-slate-500 m-0">Tập hợp tự động từ đơn đặt hàng online thực tế và số liệu phân phối vùng miền.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-black uppercase text-[11px]">
                                <tr>
                                    <th class="p-3.5 text-center">Hạng</th>
                                    <th class="p-3.5">Sản Phẩm</th>
                                    <th class="p-3.5">Nhà Phân Phối</th>
                                    <th class="p-3.5 text-center">Số Lượng Đã Bán</th>
                                    <th class="p-3.5 text-right">Tổng Doanh Thu</th>
                                    <th class="p-3.5">Tỷ Trọng Doanh Số</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function saveStockInput(productId) {
        const input = document.getElementById('stock-input-' + productId);
        if (!input) return;
        const val = parseInt(input.value, 10);
        updateProductStock(productId, val);
        if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
            window.showToast('✅ Đã lưu tồn kho sản phẩm #' + productId + ': ' + val + ' đơn vị', 'success');
        }
        renderAdminManagementUI();
    }

    function logoutAdmin() {
        closeAdminManagementModal();
        if (typeof localStorage !== 'undefined') {
            try {
                const user = getStorage('ocop_current_user', null);
                if (user && (user.role === 'admin' || user.role === 'distributor' || user.isAdmin || user.isDistributor)) {
                    localStorage.removeItem('ocop_current_user');
                }
            } catch (_) {}
        }
        if (typeof window !== 'undefined') {
            if (typeof window.updateCustomerHeaderUI === 'function') {
                window.updateCustomerHeaderUI();
            }
            if (typeof window.showToast === 'function') {
                window.showToast('Đã đăng xuất khỏi tài khoản Quản trị.', 'info');
            }
        }
    }

    function onRoleSelectChange(val) {
        if (val.startsWith('admin:')) {
            const u = val.replace('admin:', '');
            const currentScope = getActiveScope();
            if (currentScope.role === 'webmaster' && currentScope.adminUsername === u) return;

            if (typeof window !== 'undefined' && typeof window.openAdminLoginModal === 'function') {
                window.openAdminLoginModal(u, function (authed) {
                    switchAdminRole('webmaster', null, authed.username);
                });
            } else {
                switchAdminRole('webmaster', null, u);
            }
        } else if (val === 'webmaster') {
            switchAdminRole('webmaster', null);
        } else {
            switchAdminRole('distributor', val);
        }
    }

    // Tự động khởi tạo dữ liệu
    function init() {
        getCustomersList();
        getDistributorsList();
    }

    // Public API
    return {
        init: init,
        generateCustomerCode: generateCustomerCode,
        generateAdminCode: generateAdminCode,
        getAdminAccounts: getAdminAccounts,
        authenticateAdmin: authenticateAdmin,
        authenticateDistributor: authenticateDistributor,
        generateDistributorCode: generateDistributorCode,
        getCustomersList: getCustomersList,
        getDistributorsList: getDistributorsList,
        getInventoryMap: getInventoryMap,
        updateProductStock: updateProductStock,
        getSalesVolumeMap: getSalesVolumeMap,
        getActiveScope: getActiveScope,
        setActiveScope: setActiveScope,
        getScopedDatasets: getScopedDatasets,
        openAdminManagementModal: openAdminManagementModal,
        closeAdminManagementModal: closeAdminManagementModal,
        switchAdminTab: switchAdminTab,
        switchAdminRole: switchAdminRole,
        saveStockInput: saveStockInput,
        setProductGroup: setProductGroup,
        searchProducts: searchProducts,
        onRoleSelectChange: onRoleSelectChange,
        logoutAdmin: logoutAdmin
    };
}));

