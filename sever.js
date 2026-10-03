const express = require('express');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === CẤU HÌNH THÔNG TIN CỦA BẠN TẠI ĐÂY ===
const GMAIL_USER = 'email_cua_ban@gmail.com';         // Email dùng để gửi OTP
const GMAIL_PASS = 'abcd efgh ijkl mnop';             // Mật khẩu ứng dụng 16 ký tự từ Bước 2
const GOOGLE_CLIENT_ID = 'THAY_GOOGLE_CLIENT_ID_TAI_DAY.apps.googleusercontent.com';

const otpStore = {}; // Lưu OTP tạm thời
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS }
});

// 1. API: Gửi OTP về Gmail
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Vui lòng cung cấp email!' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 phút hết hạn

  try {
    await transporter.sendMail({
      from: `"Hệ Thống Đăng Ký" <${GMAIL_USER}>`,
      to: email,
      subject: 'Mã xác nhận OTP đăng ký tài khoản',
      html: `<div style="padding: 20px; font-family: sans-serif;">
              <h2>Mã xác nhận của bạn là: <b style="color: #0e3b2e;">${otp}</b></h2>
              <p>Mã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ cho người khác.</p>
             </div>`
    });
    res.json({ success: true, message: 'Đã gửi mã OTP thành công về Gmail của bạn!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Không thể gửi email: ' + err.message });
  }
});

// 2. API: Xác nhận Đăng Ký (Kiểm tra OTP)
app.post('/api/auth/register', (req, res) => {
  const { email, password, otp } = req.body;
  const record = otpStore[email];

  if (!record || record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Mã OTP không đúng!' });
  }
  if (Date.now() > record.expiresAt) {
    return res.status(400).json({ success: false, message: 'Mã OTP đã quá hạn!' });
  }

  delete otpStore[email]; // Xóa mã sau khi dùng thành công
  // -> Lưu email & password vào Database tại đây

  res.json({ success: true, message: 'Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.' });
});

// 3. API: Đăng nhập bằng Email/Password
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // -> Kiểm tra email & password với Database tại đây
  res.json({ success: true, message: `Đăng nhập thành công với tài khoản ${email}!` });
});

// 4. API: Xác thực Đăng nhập Google
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    // Đăng nhập thành công, lấy thông tin Google của người dùng
    res.json({ 
      success: true, 
      message: `Đăng nhập Google thành công! Xin chào ${payload.name}`,
      user: { email: payload.email, name: payload.name, avatar: payload.picture }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Xác thực Google không hợp lệ!' });
  }
});

// Chạy server tại cổng 3000
app.listen(3000, () => {
  console.log('Server đang chạy tại: http://localhost:3000');
});