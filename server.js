const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');

function loadEnvironmentFile() {
  const environmentFile = path.join(__dirname, '.env');
  if (!fs.existsSync(environmentFile)) return;

  const lines = fs.readFileSync(environmentFile, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const entry = line.trim();
    if (!entry || entry.startsWith('#')) continue;

    const separator = entry.indexOf('=');
    if (separator < 1) continue;

    const key = entry.slice(0, separator).trim();
    let value = entry.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = value;
    }
  }
}

loadEnvironmentFile();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, '.private-data');
const USERS_FILE = path.join(DATA_DIR, 'customers.json');
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_REGISTRATION_REQUESTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const pendingRegistrations = new Map();
const otpSentAt = new Map();
const loginAttempts = new Map();
const registrationAttempts = new Map();

app.use(express.json({ limit: '10kb' }));

let customers = [];

function readCustomers() {
  try {
    const savedCustomers = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    if (!Array.isArray(savedCustomers)) {
      throw new Error('Customer data must be a JSON array.');
    }
    return savedCustomers;
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function saveCustomers() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temporaryFile = `${USERS_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(customers, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryFile, USERS_FILE);
}

function normalizePhone(value) {
  const cleaned = String(value || '').trim().replace(/[\s()-]/g, '');
  let normalized = cleaned;
  if (/^0\d{9,10}$/.test(cleaned)) normalized = `+84${cleaned.slice(1)}`;
  else if (/^84\d{9,10}$/.test(cleaned)) normalized = `+${cleaned}`;
  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    return null;
  }
  return normalized;
}

function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');
}

function hashPassword(password, salt = crypto.randomBytes(16)) {
  return {
    salt: salt.toString('hex'),
    hash: crypto.scryptSync(password, salt, 64).toString('hex')
  };
}

function verifyPassword(password, saltHex, hashHex) {
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function validateRegistration(body) {
  const name = String(body.name || '').trim().replace(/\s+/g, ' ');
  const phone = normalizePhone(body.phone);
  const address = String(body.address || '').trim();
  const email = String(body.email || '').trim();
  const password = String(body.password || '');
  const passwordConfirm = String(body.passwordConfirm || '');

  if (name.length < 2 || name.length > 100) {
    return { error: 'Họ và tên phải có từ 2 đến 100 ký tự.' };
  }
  if (!phone) {
    return { error: 'Vui lòng nhập số điện thoại hợp lệ để nhận mã OTP.' };
  }
  if (address.length < 3 || address.length > 300) {
    return { error: 'Địa chỉ là bắt buộc và phải có tối đa 300 ký tự.' };
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { error: 'Địa chỉ Gmail / Email không hợp lệ.' };
  }
  if (password.length < 8 || password.length > 128) {
    return { error: 'Mật khẩu phải có từ 8 đến 128 ký tự.' };
  }
  if (password !== passwordConfirm) {
    return { error: 'Mật khẩu xác nhận không khớp.' };
  }

  return { customer: { name, normalizedName: normalizeName(name), phone, address, email, password } };
}

function getTwilioConfiguration() {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    const error = new Error('Dịch vụ gửi SMS chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
    error.status = 503;
    throw error;
  }
  return { accountSid: TWILIO_ACCOUNT_SID, authToken: TWILIO_AUTH_TOKEN, from: TWILIO_FROM_NUMBER };
}

async function sendOtpSms(phone, otp) {
  const configuration = getTwilioConfiguration();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const credentials = Buffer.from(`${configuration.accountSid}:${configuration.authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(configuration.accountSid)}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phone,
          From: configuration.from,
          Body: `Ma xac nhan OCOP cua ban la ${otp}. Ma co hieu luc trong 5 phut.`
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const details = await response.json().catch(() => ({}));
      console.error('Twilio SMS request failed:', details.code || response.status, details.message || 'Provider error');
      const error = new Error('Không gửi được mã OTP. Vui lòng kiểm tra số điện thoại hoặc thử lại sau.');
      error.status = 502;
      throw error;
    }
  } catch (error) {
    if (error.status) throw error;
    console.error('Twilio SMS request failed:', error.message);
    const serviceError = new Error('Không thể kết nối dịch vụ gửi SMS. Vui lòng thử lại sau.');
    serviceError.status = 502;
    throw serviceError;
  } finally {
    clearTimeout(timeout);
  }
}

function publicCustomer(customer) {
  return {
    name: customer.name,
    phone: customer.phone,
    email: customer.email
  };
}

app.post('/api/auth/register', async (req, res) => {
  const validation = validateRegistration(req.body || {});
  if (validation.error) return res.status(400).json({ error: validation.error });

  const customer = validation.customer;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const requests = registrationAttempts.get(ip);
  if (requests && requests.resetAt > now && requests.count >= MAX_REGISTRATION_REQUESTS) {
    return res.status(429).json({ error: 'Bạn đã yêu cầu mã OTP quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
  }
  if (customers.some((saved) => saved.normalizedName === customer.normalizedName)) {
    return res.status(409).json({ error: 'Họ tên này đã được đăng ký. Vui lòng đăng nhập hoặc liên hệ hỗ trợ.' });
  }
  if (customers.some((saved) => saved.phone === customer.phone)) {
    return res.status(409).json({ error: 'Số điện thoại này đã được đăng ký.' });
  }

  const lastSent = otpSentAt.get(customer.phone) || 0;
  const remainingSeconds = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - lastSent)) / 1000);
  if (remainingSeconds > 0) {
    return res.status(429).json({ error: `Vui lòng chờ ${remainingSeconds} giây trước khi yêu cầu mã OTP mới.` });
  }

  const otp = String(crypto.randomInt(100000, 1000000));
  const password = hashPassword(customer.password);
  const requestTime = Date.now();
  const nextRequests = requests && requests.resetAt > now
    ? { count: requests.count + 1, resetAt: requests.resetAt }
    : { count: 1, resetAt: now + LOGIN_WINDOW_MS };
  otpSentAt.set(customer.phone, requestTime);
  registrationAttempts.set(ip, nextRequests);
  try {
    await sendOtpSms(customer.phone, otp);
  } catch (error) {
    if (otpSentAt.get(customer.phone) === requestTime) otpSentAt.delete(customer.phone);
    if (registrationAttempts.get(ip) === nextRequests) {
      if (requests && requests.resetAt > now) registrationAttempts.set(ip, requests);
      else registrationAttempts.delete(ip);
    }
    if (!error.status) throw error;
    return res.status(error.status).json({ error: error.message });
  }

  pendingRegistrations.set(customer.phone, {
    ...customer,
    passwordSalt: password.salt,
    passwordHash: password.hash,
    otpHash: crypto.createHash('sha256').update(otp).digest('hex'),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0
  });

  return res.json({ message: 'Mã OTP đã được gửi.', phone: `${customer.phone.slice(0, 4)}••••${customer.phone.slice(-3)}` });
});

app.post('/api/auth/register/verify-otp', (req, res) => {
  const phone = normalizePhone(req.body && req.body.phone);
  const otp = String((req.body && req.body.otp) || '').trim();
  if (!phone || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: 'Số điện thoại hoặc mã OTP không hợp lệ.' });
  }

  const pending = pendingRegistrations.get(phone);
  if (!pending) {
    return res.status(400).json({ error: 'Không tìm thấy yêu cầu đăng ký. Vui lòng yêu cầu mã OTP mới.' });
  }
  if (pending.expiresAt <= Date.now()) {
    pendingRegistrations.delete(phone);
    return res.status(400).json({ error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' });
  }

  const submittedHash = crypto.createHash('sha256').update(otp).digest();
  const expectedHash = Buffer.from(pending.otpHash, 'hex');
  if (!crypto.timingSafeEqual(submittedHash, expectedHash)) {
    pending.attempts += 1;
    if (pending.attempts >= MAX_OTP_ATTEMPTS) {
      pendingRegistrations.delete(phone);
      return res.status(429).json({ error: 'Bạn đã nhập sai OTP quá số lần cho phép. Vui lòng yêu cầu mã mới.' });
    }
    return res.status(400).json({ error: `Mã OTP không đúng. Bạn còn ${MAX_OTP_ATTEMPTS - pending.attempts} lần thử.` });
  }

  const customer = {
    id: crypto.randomUUID(),
    name: pending.name,
    normalizedName: pending.normalizedName,
    phone: pending.phone,
    address: pending.address,
    email: pending.email,
    passwordSalt: pending.passwordSalt,
    passwordHash: pending.passwordHash,
    verifiedAt: new Date().toISOString()
  };
  customers.push(customer);
  try {
    saveCustomers();
  } catch (error) {
    customers.pop();
    console.error('Unable to save registered customer:', error.message);
    return res.status(500).json({ error: 'Không thể lưu tài khoản lúc này. Vui lòng thử lại sau.' });
  }

  pendingRegistrations.delete(phone);
  otpSentAt.delete(phone);
  return res.status(201).json({ user: publicCustomer(customer) });
});

app.post('/api/auth/login', (req, res) => {
  const name = String((req.body && req.body.name) || '').trim();
  const password = String((req.body && req.body.password) || '');
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return res.status(429).json({ error: 'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.' });
  }

  const customer = customers.find((saved) => saved.normalizedName === normalizeName(name));
  const passwordMatches = customer
    ? verifyPassword(password, customer.passwordSalt, customer.passwordHash)
    : (crypto.scryptSync(password, 'ocop-login-check', 64), false);

  if (!customer || !passwordMatches) {
    const nextAttempts = attempts && attempts.resetAt > now
      ? { count: attempts.count + 1, resetAt: attempts.resetAt }
      : { count: 1, resetAt: now + LOGIN_WINDOW_MS };
    loginAttempts.set(ip, nextAttempts);
    return res.status(401).json({ error: 'Họ tên hoặc mật khẩu không chính xác.' });
  }

  loginAttempts.delete(ip);
  return res.json({ user: publicCustomer(customer) });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error('Request failed:', error.message);
  return res.status(error.status || 500).json({
    error: error.status ? error.message : 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.'
  });
});

app.use(express.static(__dirname, { dotfiles: 'deny' }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

customers = readCustomers();
app.listen(PORT, () => {
  console.log('==================================================');
  console.log('🚀 Server OCOP Sales Copilot đang chạy thành công!');
  console.log(`👉 Truy cập ngay: http://localhost:${PORT}`);
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM_NUMBER) {
    console.warn('⚠️ Chưa cấu hình Twilio; đăng ký OTP sẽ không hoạt động cho đến khi cấu hình biến môi trường.');
  }
  console.log('==================================================');
});
