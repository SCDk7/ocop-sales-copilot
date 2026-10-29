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
        assert.ok(d.isDemo || d.hotline, 'Real distributors must have a hotline');
        assert.ok(d.encryptionKey, 'Must have encryption token');
    });
});

test('the demo distributor is added once to existing storage without replacing distributor data', () => {
    const previous = storage.ocop_distributors;
    try {
        const existing = Admin.getDistributorsList().filter(row => !row.isDemo);
        existing[0] = {...existing[0], name: 'Tên nhà phân phối đã chỉnh sửa', pin: 'custom-pin'};
        localStorage.setItem('ocop_distributors', JSON.stringify(existing));
        const first = Admin.getDistributorsList();
        const demo = first.find(row => row.username === 'nppdemo');
        assert.equal(demo.distributorCode, 'NPP26DEMO001');
        assert.equal(demo.password, 'NppDemo@2026');
        assert.equal(demo.isDemo, true);
        assert.deepEqual(first.slice(0, existing.length), existing);
        assert.equal(Admin.getDistributorsList().filter(row => row.distributorCode === demo.distributorCode).length, 1);
        const edited = first.map(row => row.isDemo ? {...row, password: 'Changed-demo-password'} : row);
        localStorage.setItem('ocop_distributors', JSON.stringify(edited));
        assert.equal(Admin.getDistributorsList().find(row => row.isDemo).password, 'Changed-demo-password');
    } finally { storage.ocop_distributors = previous; }
});

for(const page of ['index.html','index_2.html']){
 test(page+' delegates login to the server and cannot accept a local demo password',async()=>{
  const html=require('fs').readFileSync(page,'utf8'),vm=require('vm');
  const start=html.indexOf('    async function handleCustomerLoginSubmit()'),end=html.indexOf('    window.handleCustomerLoginSubmit =',start);
  let called=0,alert;const context={document:{getElementById:id=>({value:id==='cust-login-user'?'nppdemo':'NppDemo@2026'})},OCOPAuth:{login:async(name,password)=>{called++;assert.equal(name,'nppdemo');assert.equal(password,'NppDemo@2026');throw Error('Invalid server credentials');}},updateCustomerHeaderUI(){},showCustomerAuthAlert:(text,type)=>alert={text,type}};
  context.window=context;vm.runInNewContext(html.slice(start,end),context);await context.handleCustomerLoginSubmit();assert.equal(called,1);assert.equal(alert.type,'error');
 });
}

test('the management login picker shows NPP Demo, fills its credentials and opens only the distributor scope', () => {
    const fs = require('node:fs'), vm = require('node:vm');
    const source = fs.readFileSync('skytech-complete.js', 'utf8');
    const values = new Map(), opened = [], attributes = {};
    const element = () => ({value: '', style: {setProperty() {}}, classList: {add() {}, remove() {}},
        focus() {}, setAttribute: (key, value) => { attributes[key] = value; }});
    const modal = element(), username = element(), password = element(), error = element();
    const nodes = {'admin-login-modal': modal, 'admin-login-username': username, 'admin-login-password': password, 'admin-login-error': error,
        'admin-login-card': element(), ...Object.fromEntries([...Admin.getAdminAccounts().map(row => row.username), 'nppdemo'].map(name => ['pill-admin-' + name, element()]))};
    let adminCallback = false;
    const context = {document: {getElementById: id => nodes[id] || null},
        localStorage: {setItem: (key, value) => values.set(key, value)},
        OcopAdminManagement: {...Admin, setActiveScope() {}, openAdminManagementModal: (...args) => opened.push(args)},
        closeAdminHubModal() {}, closeAdminLoginModal() {}, updateCustomerHeaderUI() {}, setTimeout: callback => callback()};
    context.window = context;vm.createContext(context);
    vm.runInContext(source.slice(source.indexOf('    function getManagementLoginChoices()'), source.indexOf('    window.openAdminHubCardAction = function')), context);
    context.openAdminLoginModal('ThaoNguyenad01', () => { adminCallback = true; });
    assert.ok(modal.innerHTML.includes('id="pill-admin-nppdemo"'));
    assert.ok(modal.innerHTML.includes('<span>NPP Demo</span>'));
    assert.ok(modal.innerHTML.includes("selectAdminLoginAccount('nppdemo')"));
    context.selectAdminLoginAccount('nppdemo');
    assert.equal(username.value, 'nppdemo');assert.equal(password.value, 'NppDemo@2026');
    password.value = 'wrong';context.submitAdminLogin();
    assert.equal(values.has('ocop_current_user'), false);assert.equal(opened.length, 0);
    context.selectAdminLoginAccount('nppdemo');context.submitAdminLogin();
    assert.equal(JSON.parse(values.get('ocop_current_user')).role, 'distributor');
    assert.deepEqual(opened, [['distributor', 'NPP26DEMO001']]);
    assert.equal(adminCallback, false);
    context.selectAdminLoginAccount('KimNganad02');
    assert.equal(password.value, '', 'real administrator passwords are not filled by the demo picker');
    password.value = '1111111';context.submitAdminLogin();
    assert.equal(JSON.parse(values.get('ocop_current_user')).role, 'admin');
    assert.deepEqual(opened.at(-1), ['webmaster', null]);
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
    assert.equal(masterData.distributors.length, 7, 'Webmaster sees six distributors and the demo account');

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

test('NPP records exclude other sellers, unconfirmed sales and customers who only share an address',()=>{
 const saved={...storage},oldProducts=window.PRODUCTS,oldGet=window.getCurrentCustomer;
 try{
  window.PRODUCTS=oldProducts.map(p=>p.id===102?{...p,distributorCode:'NPP260000002'}:p);
  storage.ocop_customers=JSON.stringify([{customerCode:'OWN',fullName:'Khách mua',phone:'0901000000'},{customerCode:'OTHER',fullName:'Khách khác',phone:'0902000000',address:'Hải Phòng'}]);
  storage.ocop_online_orders=JSON.stringify([
   {productId:101,qty:2,unitPrice:100000,customerCode:'OWN',customerPhone:'0901000000',status:'completed',customerReceivedAt:'2026-10-29T00:00:00Z',distributorCode:'NPP260000001'},
   {productId:101,qty:90,customerCode:'OTHER',status:'completed',distributorCode:'NPP260000002'},
   {productId:101,qty:30,customerCode:'OTHER',status:'pending'}
  ]);
  window.getCurrentCustomer=()=>({role:'distributor',distributorCode:'NPP260000001',username:'npp-test'});
  Admin.setActiveScope('webmaster',null,'ThaoNguyenad01');
  const data=Admin.getScopedDatasets();
  assert.equal(data.scope.role,'distributor');assert.deepEqual(data.products.map(p=>p.id),[101]);
  assert.equal(data.products[0].sold,2);assert.deepEqual(data.customers.map(c=>c.phone),['0901000000']);assert.equal(data.customers[0].totalSpend,200000);
  window.getCurrentCustomer=()=>({role:'distributor',distributorCode:'UNKNOWN'});assert.equal(Admin.getScopedDatasets().products.length,0);
 }finally{localStorage.clear();Object.assign(storage,saved);window.PRODUCTS=oldProducts;window.getCurrentCustomer=oldGet;}
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

test('management header follows each signed-in admin when opening and reopening instead of resetting to the first account', () => {
    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalScope = storage.ocop_admin_scope;
    const originalUser = storage.ocop_current_user;
    const modal = {innerHTML: '', classList: {add() {}, remove() {}}, style: {setProperty() {}}};
    let current;
    try {
        global.window = {...originalWindow, getCurrentCustomer: () => current, addEventListener() {}};
        global.document = {getElementById: id => id === 'admin-management-modal' ? modal : null, body: {style: {}}};
        for (const admin of Admin.getAdminAccounts()) {
            current = {...admin, role: 'admin', isAdmin: true};
            localStorage.setItem('ocop_current_user', JSON.stringify(current));
            Admin.setActiveScope('webmaster', null, 'ThaoNguyenad01');
            Admin.openAdminManagementModal('webmaster', null);
            assert.equal(Admin.getActiveScope().adminUsername, admin.username);
            assert.equal(Admin.getActiveScope().name, admin.fullName);
            const selected = modal.innerHTML.match(/<option value="admin:([^"]+)" selected>([^<]+)<\/option>/);
            assert.equal(selected?.[1], admin.username);
            assert.ok(selected[2].includes(admin.fullName));
            Admin.closeAdminManagementModal();
            Admin.openAdminManagementModal();
            assert.equal(Admin.getActiveScope().adminUsername, admin.username);
        }
        current = null;
        localStorage.removeItem('ocop_current_user');
        Admin.setActiveScope('webmaster', null, 'KimNganad02');
        Admin.openAdminManagementModal('webmaster', null);
        assert.equal(Admin.getActiveScope().adminUsername, 'KimNganad02', 'legacy login scope survives opening the panel');
    } finally {
        global.window = originalWindow;
        if (originalDocument === undefined) delete global.document; else global.document = originalDocument;
        if (originalScope === undefined) localStorage.removeItem('ocop_admin_scope'); else storage.ocop_admin_scope = originalScope;
        if (originalUser === undefined) localStorage.removeItem('ocop_current_user'); else storage.ocop_current_user = originalUser;
    }
});

test('switching to another authenticated admin preserves the identity returned by login', () => {
    const originalWindow = global.window;
    const originalDocument = global.document;
    const originalScope = storage.ocop_admin_scope;
    try {
        const authenticated = Admin.getAdminAccounts()[2];
        global.window = {...originalWindow, openAdminLoginModal: (username, done) => {
            assert.equal(username, authenticated.username);
            done(authenticated);
        }};
        global.document = {getElementById: () => null};
        Admin.setActiveScope('webmaster', null, 'ThaoNguyenad01');
        Admin.onRoleSelectChange('admin:' + authenticated.username);
        assert.equal(Admin.getActiveScope().adminUsername, authenticated.username);
        assert.equal(Admin.getActiveScope().name, authenticated.fullName);
    } finally {
        global.window = originalWindow;
        if (originalDocument === undefined) delete global.document; else global.document = originalDocument;
        if (originalScope === undefined) localStorage.removeItem('ocop_admin_scope'); else storage.ocop_admin_scope = originalScope;
    }
});

test('Role-based Admin access control: strictly visible to Admin and Distributor, hidden for regular customers and guests', () => {
    const fs = require('node:fs');
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const skyJs = fs.readFileSync('skytech-complete.js', 'utf8');

    // 1. Validation in index.html for role-based gating
    assert.ok(indexHtml.includes('function isCurrentUserAdminOrDistributor'), 'isCurrentUserAdminOrDistributor helper must exist');
    assert.ok(!indexHtml.includes('id="header-admin-action-wrap"'), 'Redundant header admin action is removed');
    assert.ok(!indexHtml.includes('id="btn-header-admin-portal"'), 'Redundant header admin button is removed');
    assert.ok(!indexHtml.includes('id="btn-header-admin-pin"'), 'Revenue shortcut is removed from the header');
    assert.ok(!indexHtml.includes('id="btn-header-ocr"'), 'Registration shortcut is removed from the header');
    assert.ok(indexHtml.includes('id="cust-admin-quick-actions"'), 'Customer profile quick actions ID exists');
    assert.ok(indexHtml.includes('id="mobile-cro-admin-btn"'), 'Mobile bottom nav admin button exists');
    assert.ok(indexHtml.includes('id="btn-ordersuccess-admin"'), 'Order success admin button exists');

    // Initial HTML attributes must have hidden styles
    assert.ok(indexHtml.includes('id="cust-admin-quick-actions"') && indexHtml.includes('style="display: none !important;"'), 'Profile quick actions is hidden by default');
    assert.ok(indexHtml.includes('id="mobile-cro-admin-btn"') && indexHtml.includes('style="display: none !important;"'), 'Mobile admin button is hidden by default');
    assert.ok(indexHtml.includes('id="btn-ordersuccess-admin"') && indexHtml.includes('style="display: none !important;"'), 'Order success admin button is hidden by default');

    // UI role hints cannot authenticate backend access.
    assert.ok(indexHtml.includes('await window.OCOPAuth.login('));
    assert.ok(!indexHtml.includes('authedAdmin = window.OcopAdminManagement.authenticateAdmin(u, p)'));

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
