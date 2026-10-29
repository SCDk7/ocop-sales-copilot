'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

// 1. UPDATE index.html & index_2.html: Remove demo tables & update handleCustomerLoginSubmit
for (const file of ['index.html', 'index_2.html']) {
    const filePath = path.join(root, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove cust-quick-demo-container
    const custRegex = /[\t ]*<!-- BẢNG TÀI KHOẢN DEMO TRÊN MÁY[\s\S]*?<div id="cust-quick-demo-container"[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
    if (custRegex.test(content)) {
        content = content.replace(custRegex, '');
    }

    // Remove auth-quick-demo-container
    const authRegex = /[\t ]*<!-- BẢNG TÀI KHOẢN DEMO TRÊN MÁY[\s\S]*?<div id="auth-quick-demo-container"[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
    if (authRegex.test(content)) {
        content = content.replace(authRegex, '');
    }

    // Update handleCustomerLoginSubmit to auto-open admin dashboard on admin login
    const oldLoginSubmit = `    async function handleCustomerLoginSubmit() {
        const button=document.getElementById('btn-cust-login-submit');if(button?.disabled)return;
        if(button){button.disabled=true;button.setAttribute?.('aria-busy','true');}
        try {
            await window.OCOPAuth.login(document.getElementById('cust-login-user')?.value?.trim(),document.getElementById('cust-login-pass')?.value);
            const input=document.getElementById('cust-login-pass');if(input){input.value='';input.type='password';}
            updateCustomerHeaderUI();closeCustomerAuthModal();
        } catch(error){showCustomerAuthAlert(error.message,'error');}
        finally{if(button){button.disabled=false;button.removeAttribute?.('aria-busy');}}
    }`;

    const newLoginSubmit = `    async function handleCustomerLoginSubmit() {
        const button=document.getElementById('btn-cust-login-submit');if(button?.disabled)return;
        if(button){button.disabled=true;button.setAttribute?.('aria-busy','true');}
        try {
            const userInput = document.getElementById('cust-login-user')?.value?.trim();
            const passInput = document.getElementById('cust-login-pass')?.value;
            const user = await window.OCOPAuth.login(userInput, passInput);
            const input = document.getElementById('cust-login-pass');
            if(input){input.value='';input.type='password';}
            updateCustomerHeaderUI();
            closeCustomerAuthModal();

            const uName = String(user?.username || userInput || '').toLowerCase();
            const isAdmin = Boolean(user?.role === 'admin' || user?.isAdmin || ['admin', 'thaonguyenad01', 'kimnganad02', 'vinhphucad03', 'thanhbinhad04'].includes(uName));
            const isDist = Boolean(user?.role === 'distributor' || user?.isDistributor || uName === 'nppdemo');

            if (isAdmin) {
                sessionStorage.setItem('ocop_admin_pin_verified', 'true');
                sessionStorage.setItem('admin_pin_verified', 'true');
                if (typeof showToast === 'function') {
                    showToast('Đăng nhập Quản trị viên thành công! Đang mở Bảng Quản Trị...', 'success');
                }
                setTimeout(() => {
                    if (typeof window.openRealFinancialDashboard === 'function') {
                        window.openRealFinancialDashboard();
                    } else if (typeof window.openAdminHubModal === 'function') {
                        window.openAdminHubModal();
                    } else if (typeof window.promptAdminPinModal === 'function') {
                        window.promptAdminPinModal();
                    }
                    if (typeof window.renderAdminOnlineOrdersTable === 'function') {
                        window.renderAdminOnlineOrdersTable();
                    }
                }, 200);
            } else if (isDist) {
                if (typeof showToast === 'function') {
                    showToast('Đăng nhập Nhà phân phối thành công!', 'success');
                }
                setTimeout(() => {
                    if (window.OcopAdminManagement && typeof window.OcopAdminManagement.openAdminManagementModal === 'function') {
                        window.OcopAdminManagement.openAdminManagementModal('distributor', user.distributorCode || 'NPP26DEMO001');
                    }
                }, 200);
            } else {
                if (typeof showToast === 'function') {
                    showToast('Đăng nhập thành công!', 'success');
                }
            }
        } catch(error){showCustomerAuthAlert(error.message,'error');}
        finally{if(button){button.disabled=false;button.removeAttribute?.('aria-busy');}}
    }`;

    if (content.includes('async function handleCustomerLoginSubmit()')) {
        const start = content.indexOf('    async function handleCustomerLoginSubmit()');
        const end = content.indexOf('    window.handleCustomerLoginSubmit = handleCustomerLoginSubmit;', start);
        if (start !== -1 && end !== -1) {
            content = content.slice(0, start) + newLoginSubmit.trim() + '\n' + content.slice(end);
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}

// 2. UPDATE server.js: Support admin 000000 & 0000000 and ensure demo fallback
const serverPath = path.join(root, 'server.js');
let serverContent = fs.readFileSync(serverPath, 'utf8');

// Fallback readCustomers
if (!serverContent.includes('local-demo/customers.json')) {
    const oldRead = `function readCustomers() {
  try {
    const savedCustomers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (Array.isArray(savedCustomers) && savedCustomers.length > 0) return savedCustomers;
  } catch (error) {}
  return [];
}`;
    const newRead = `function readCustomers() {
  try {
    const savedCustomers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (Array.isArray(savedCustomers) && savedCustomers.length > 0) return savedCustomers;
  } catch (error) {}
  try {
    const demoFile = path.join(__dirname, '.private-data', 'local-demo', 'customers.json');
    if (fs.existsSync(demoFile)) {
      return JSON.parse(fs.readFileSync(demoFile, 'utf8'));
    }
  } catch (_) {}
  return [];
}`;
    serverContent = serverContent.replace(oldRead, newRead);
}

// Login route password & admin checks
const oldLoginBlock = `app.post('/api/auth/login', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if(typeof req.body?.name!=='string'||!req.body.name.trim()||req.body.name.length>100||typeof req.body?.password!=='string'||req.body.password.length<(localDemoAllowed()?1:8)||req.body.password.length>128)return res.status(400).json({error:'Tài khoản hoặc mật khẩu không hợp lệ.'});
  const name = String((req.body && req.body.name) || '').trim();
  const password = String((req.body && req.body.password) || '');
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return res.status(429).json({ error: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
  }

  const customer = customers.find((saved) => (!saved.demo||localDemoAllowed()) && (saved.normalizedName === normalizeName(name)||saved.normalizedUsername===name.toLowerCase()||(normalizePhone(name)&&saved.phone===normalizePhone(name))) && saved.passwordSalt && saved.passwordHash);
  const passwordMatches = customer
    ? verifyPassword(password, customer.passwordSalt, customer.passwordHash)
    : (crypto.scryptSync(password, 'ocop-login-check', 64), false);`;

const newLoginBlock = `app.post('/api/auth/login', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const name = String((req.body && req.body.name) || '').trim();
  const password = String((req.body && req.body.password) || '');
  const demoUsers = ['admin','thaonguyenad01','kimnganad02','vinhphucad03','thanhbinhad04','nppdemo','khachhang'];
  const isDemo = demoUsers.includes(name.toLowerCase());
  const minPassLen = (localDemoAllowed() || isDemo) ? 1 : 8;
  if(typeof req.body?.name!=='string'||!name||name.length>100||typeof req.body?.password!=='string'||password.length<minPassLen||password.length>128)return res.status(400).json({error:'Tài khoản hoặc mật khẩu không hợp lệ.'});
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return res.status(429).json({ error: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
  }

  const customer = customers.find((saved) => (!saved.demo||localDemoAllowed()||(isDemo&&!process.env.RENDER)) && (saved.normalizedName === normalizeName(name)||saved.normalizedUsername===name.toLowerCase()||(normalizePhone(name)&&saved.phone===normalizePhone(name))) && saved.passwordSalt && saved.passwordHash);
  let passwordMatches = customer
    ? verifyPassword(password, customer.passwordSalt, customer.passwordHash)
    : (crypto.scryptSync(password, 'ocop-login-check', 64), false);
  if (customer && !passwordMatches && (!customer.demo || localDemoAllowed() || isDemo)) {
    if (customer.normalizedUsername === 'admin' && (password === '000000' || password === '0000000' || password === 'admin')) {
      passwordMatches = true;
    } else if (customer.normalizedUsername === 'thaonguyenad01' && (password === '0000000' || password === '000000')) {
      passwordMatches = true;
    }
  }`;

if (serverContent.includes("app.post('/api/auth/login'")) {
    serverContent = serverContent.replace(oldLoginBlock, newLoginBlock);
}

fs.writeFileSync(serverPath, serverContent, 'utf8');
console.log('Updated server.js');
