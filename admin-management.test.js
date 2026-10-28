'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

// Mock localStorage for Node.js test environment
const storage = {};
global.localStorage = {
    getItem: key => (Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null),
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: key => { delete storage[key]; },
    clear: () => { for (const k in storage) delete storage[k]; }
};

// Mock products
global.window = {
    PRODUCTS: [
        { id: 101, name: 'Mật ong rừng Cát Bà', region: 'Hải Phòng', price: 500000, img: 'catba.jpg' },
        { id: 102, name: 'Nước mắm Cát Hải 40 độ đạm', region: 'Hải Phòng', price: 250000, img: 'cathai.jpg' },
        { id: 201, name: 'Gốm men rạn Bát Tràng', region: 'Hà Nội', price: 1500000, img: 'battrang.jpg' },
        { id: 301, name: 'Bột cacao nguyên chất Trọng Đức', region: 'Đồng Nai', price: 180000, img: 'cacao.jpg' }
    ]
};

const Admin = require('./admin-management.js');

test('Customer Code generator creates exactly 12 characters with KH prefix', () => {
    for (let i = 0; i < 20; i++) {
        const code = Admin.generateCustomerCode();
        assert.equal(code.length, 12, 'Customer code length must be 12');
        assert.ok(code.startsWith('KH'), 'Customer code must start with KH');
        assert.match(code, /^KH[0-9A-Z]{10}$/, 'Must be alphanumeric uppercase');
    }
});

test('Distributor Code generator creates exactly 12 characters with NPP prefix', () => {
    for (let i = 0; i < 20; i++) {
        const code = Admin.generateDistributorCode();
        assert.equal(code.length, 12, 'Distributor code length must be 12');
        assert.ok(code.startsWith('NPP'), 'Distributor code must start with NPP');
        assert.match(code, /^NPP[0-9A-Z]{9}$/, 'Must be alphanumeric uppercase');
    }
});

test('Seed distributors have exactly 12 characters codes and required credentials', () => {
    const list = Admin.getDistributorsList();
    assert.ok(list.length >= 6, 'Must have at least 6 seed distributors');
    list.forEach(d => {
        assert.equal(d.distributorCode.length, 12, 'Distributor code must be 12 characters: ' + d.distributorCode);
        assert.ok(d.distributorCode.startsWith('NPP'), 'Must start with NPP');
        assert.ok(d.name, 'Must have name');
        assert.ok(d.region, 'Must have region');
        assert.ok(d.hotline, 'Must have hotline');
        assert.ok(d.encryptionKey, 'Must have encryption token');
    });
});

test('Seed customers have 12 characters customer codes', () => {
    const list = Admin.getCustomersList();
    assert.ok(list.length >= 5, 'Must have customers');
    list.forEach(c => {
        assert.equal(c.customerCode.length, 12, 'Customer code must be 12 characters: ' + c.customerCode);
        assert.ok(c.customerCode.startsWith('KH'), 'Must start with KH');
    });
});

test('4 Admin Accounts exist with matching passwords', () => {
    const admins = Admin.getAdminAccounts();
    assert.equal(admins.length, 4, 'Must have 4 admin accounts');

    const expected = [
        { u: 'ThaoNguyenad01', p: '0000000', name: 'Thảo Nguyên' },
        { u: 'KimNganad02', p: '1111111', name: 'Kim Ngân' },
        { u: 'VinhPhucad03', p: '2222222', name: 'Vĩnh Phúc' },
        { u: 'ThanhBinhad04', p: '3333333', name: 'Thanh Bình' }
    ];

    expected.forEach(exp => {
        const found = admins.find(a => a.username === exp.u);
        assert.ok(found, `Admin ${exp.u} must exist`);
        assert.equal(found.password, exp.p, `Password for ${exp.u} must match`);
        assert.ok(found.fullName.includes(exp.name), `Full name must match ${exp.name}`);

        // Test authenticateAdmin helper
        const auth = Admin.authenticateAdmin(exp.u, exp.p);
        assert.ok(auth, `Authentication must succeed for ${exp.u}`);
        assert.equal(auth.username, exp.u);

        // Test single keyword auth (by username or password)
        const authByPass = Admin.authenticateAdmin(exp.p);
        assert.ok(authByPass, `Authentication by password token must succeed for ${exp.p}`);
    });
});

test('Inventory stock management can read and update stock', () => {
    const stockMap = Admin.getInventoryMap(global.window.PRODUCTS);
    assert.ok(stockMap['101'] !== undefined, 'Stock for product 101 must exist');

    const updated = Admin.updateProductStock(101, 88);
    assert.equal(updated, 88, 'Stock must update to 88');

    const stockMap2 = Admin.getInventoryMap(global.window.PRODUCTS);
    assert.equal(stockMap2['101'], 88, 'Updated stock must persist in storage');
});

test('Scoping Engine isolates data between Webmaster and Distributor', () => {
    // 1. Webmaster scope with specific admin
    Admin.setActiveScope('webmaster', null, 'ThaoNguyenad01');
    const masterData = Admin.getScopedDatasets();
    assert.equal(masterData.scope.role, 'webmaster');
    assert.equal(masterData.scope.adminUsername, 'ThaoNguyenad01');
    assert.equal(masterData.isScoped, false);
    assert.equal(masterData.products.length, 4, 'Webmaster sees all 4 products');
    assert.equal(masterData.distributors.length, 6, 'Webmaster sees all distributors');

    // 2. Distributor scope for Hải Phòng (NPP260000001)
    Admin.setActiveScope('distributor', 'NPP260000001');
    const distData = Admin.getScopedDatasets();
    assert.equal(distData.scope.role, 'distributor');
    assert.equal(distData.isScoped, true);
    assert.equal(distData.scope.distributorCode, 'NPP260000001');
    assert.equal(distData.distributors.length, 1, 'Distributor only sees themselves');
    assert.equal(distData.distributors[0].region, 'Hải Phòng');

    // Distributor only sees their own products (Hải Phòng has 2 products: 101 and 102)
    assert.equal(distData.products.length, 2, 'Distributor sees only their 2 products');
    assert.ok(distData.products.every(p => p.region === 'Hải Phòng'), 'All scoped products must be from Hải Phòng');
});

test('Admin separate username and password authentication verification', () => {
    const fs = require('node:fs');
    const skyJs = fs.readFileSync('skytech-complete.js', 'utf8');

    // 1. Each admin has unique separate username and password
    const admins = Admin.getAdminAccounts();
    const usernames = admins.map(a => a.username);
    const passwords = admins.map(a => a.password);
    assert.equal(new Set(usernames).size, 4, 'All 4 usernames must be unique');
    assert.equal(new Set(passwords).size, 4, 'All 4 passwords must be unique');

    // 2. Cross-authentication failure (admin A cannot authenticate with admin B password)
    assert.equal(Admin.authenticateAdmin('ThaoNguyenad01', '1111111'), null, 'ThaoNguyen cannot use KimNgan pass');
    assert.equal(Admin.authenticateAdmin('KimNganad02', '0000000'), null, 'KimNgan cannot use ThaoNguyen pass');
    assert.equal(Admin.authenticateAdmin('VinhPhucad03', '3333333'), null, 'VinhPhuc cannot use ThanhBinh pass');
    assert.equal(Admin.authenticateAdmin('ThanhBinhad04', '2222222'), null, 'ThanhBinh cannot use VinhPhuc pass');
    assert.equal(Admin.authenticateAdmin('ThaoNguyenad01', 'wrong_pass'), null, 'Wrong password must fail');
    assert.equal(Admin.authenticateAdmin('nonexistent', '0000000'), null, 'Nonexistent admin must fail');

    // 3. Correct credentials succeed
    const a1 = Admin.authenticateAdmin('ThaoNguyenad01', '0000000');
    assert.ok(a1);
    assert.equal(a1.username, 'ThaoNguyenad01');

    const a2 = Admin.authenticateAdmin('KimNganad02', '1111111');
    assert.ok(a2);
    assert.equal(a2.username, 'KimNganad02');

    const a3 = Admin.authenticateAdmin('VinhPhucad03', '2222222');
    assert.ok(a3);
    assert.equal(a3.username, 'VinhPhucad03');

    const a4 = Admin.authenticateAdmin('ThanhBinhad04', '3333333');
    assert.ok(a4);
    assert.equal(a4.username, 'ThanhBinhad04');

    // 4. Admin management exports logoutAdmin
    assert.equal(typeof Admin.logoutAdmin, 'function', 'Admin.logoutAdmin must be exported');

    // 5. SkyTech Admin Login Modal Engine validation
    assert.ok(skyJs.includes('window.openAdminLoginModal'), 'openAdminLoginModal is defined in skytech-complete.js');
    assert.ok(skyJs.includes('window.submitAdminLogin'), 'submitAdminLogin is defined in skytech-complete.js');
    assert.ok(skyJs.includes('window.selectAdminLoginAccount'), 'selectAdminLoginAccount is defined in skytech-complete.js');
    assert.ok(skyJs.includes('admin-login-modal'), 'admin-login-modal exists in skytech-complete.js');
    assert.ok(skyJs.includes('openAdminLoginModal()'), 'Card 1 button invokes openAdminLoginModal');
});

test('Role-based Admin access control: strictly visible to Admin and Distributor, hidden for regular customers and guests', () => {
    const fs = require('node:fs');
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const skyJs = fs.readFileSync('skytech-complete.js', 'utf8');

    // 1. Validation in index.html for role-based gating
    assert.ok(indexHtml.includes('function isCurrentUserAdminOrDistributor'), 'isCurrentUserAdminOrDistributor helper must exist');
    assert.ok(indexHtml.includes('id="header-admin-action-wrap"'), 'Header admin wrap element exists');
    assert.ok(indexHtml.includes('id="btn-header-admin-portal"'), 'Header admin portal button exists');
    assert.ok(indexHtml.includes('id="cust-admin-quick-actions"'), 'Customer profile quick actions ID exists');
    assert.ok(indexHtml.includes('id="mobile-cro-admin-btn"'), 'Mobile bottom nav admin button exists');
    assert.ok(indexHtml.includes('id="btn-ordersuccess-admin"'), 'Order success admin button exists');

    // Initial HTML attributes must have hidden styles
    assert.ok(indexHtml.includes('id="header-admin-action-wrap" class="items-center" style="display: none !important;"'), 'Header admin portal wrap is hidden by default');
    assert.ok(indexHtml.includes('id="cust-admin-quick-actions"') && indexHtml.includes('style="display: none !important;"'), 'Profile quick actions is hidden by default');
    assert.ok(indexHtml.includes('id="mobile-cro-admin-btn"') && indexHtml.includes('style="display: none !important;"'), 'Mobile admin button is hidden by default');
    assert.ok(indexHtml.includes('id="btn-ordersuccess-admin"') && indexHtml.includes('style="display: none !important;"'), 'Order success admin button is hidden by default');

    // 2. Login submit in index.html must authenticate Admin and Distributor directly
    assert.ok(indexHtml.includes('authedAdmin = window.OcopAdminManagement.authenticateAdmin(u, p)'), 'Login checks Admin credentials');
    assert.ok(indexHtml.includes('matchedDist = distList.find'), 'Login checks Distributor credentials');
    assert.ok(indexHtml.includes("role: 'admin'"), 'Admin role is assigned upon admin login');
    assert.ok(indexHtml.includes("role: 'distributor'"), 'Distributor role is assigned upon distributor login');
    assert.ok(indexHtml.includes("role: 'customer'"), 'Customer role is assigned for ordinary customers');

    // 3. UI logic in updateCustomerHeaderUI controls elements based on role
    assert.ok(indexHtml.includes("headerAdminWrap.style.setProperty('display', 'flex', 'important')"), 'Displays header portal for privileged roles');
    assert.ok(indexHtml.includes("headerAdminWrap.style.setProperty('display', 'none', 'important')"), 'Hides header portal for regular customers/guests');
    assert.ok(indexHtml.includes("custAdminQuickActions.style.setProperty('display', 'none', 'important')"), 'Hides profile quick actions for regular customers');
    assert.ok(indexHtml.includes("mobileAdminBtn.style.setProperty('display', 'none', 'important')"), 'Hides mobile nav admin for regular customers');
    assert.ok(indexHtml.includes("orderSuccessAdminBtn.style.setProperty('display', 'none', 'important')"), 'Hides order success admin for regular customers');

    // 4. skytech-complete.js modal invocation guards
    assert.ok(skyJs.includes('currentUser && !hasPrivilege'), 'promptAdminPinModal checks for regular customer and guards');
    assert.ok(skyJs.includes('Tài khoản khách hàng không có quyền truy cập Quản trị'), 'Clear warning message for unauthorized customer');
    assert.ok(skyJs.includes('window.openAdminHubModal') && skyJs.includes('!hasPrivilege'), 'openAdminHubModal guards against non-privileged accounts');
});

test('authenticateAdmin supports alias admin and ad with default admin credentials', () => {
    const authAdmin = Admin.authenticateAdmin('admin', '0000000');
    assert.ok(authAdmin, 'admin with 0000000 must succeed');
    assert.equal(authAdmin.username, 'ThaoNguyenad01');

    const authAd = Admin.authenticateAdmin('ad', 'admin');
    assert.ok(authAd, 'ad with admin password must succeed');
    assert.equal(authAd.username, 'ThaoNguyenad01');

    const authId = Admin.authenticateAdmin('AD01', '0000000');
    assert.ok(authId, 'AD01 must succeed');

    const authSingle = Admin.authenticateAdmin('admin');
    assert.ok(authSingle, 'admin token must succeed');
});


test('Admin Code generator and admin accounts strictly use 12-character code starting with AD', () => {
    for (let i = 0; i < 10; i++) {
        const code = Admin.generateAdminCode();
        assert.equal(code.length, 12, 'Admin code length must be 12');
        assert.ok(code.startsWith('AD'), 'Admin code must start with AD');
        assert.match(code, /^AD[0-9A-Z]{10}$/, 'Must be alphanumeric uppercase');
    }

    const admins = Admin.getAdminAccounts();
    admins.forEach(a => {
        const code = a.adminCode || a.customerCode;
        assert.ok(code, 'Admin account must have a code');
        assert.equal(code.length, 12, 'Admin code must have 12 characters: ' + code);
        assert.ok(code.startsWith('AD'), 'Admin code must start with AD: ' + code);
    });

    const authed = Admin.authenticateAdmin('admin');
    assert.ok(authed);
    const authCode = authed.adminCode || authed.customerCode;
    assert.equal(authCode.length, 12);
    assert.ok(authCode.startsWith('AD'));
});
