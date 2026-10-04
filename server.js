const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Phục vụ file tĩnh trong cùng thư mục
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Server OCOP Sales Copilot đang chạy thành công!`);
  console.log(`👉 Truy cập ngay: http://localhost:${PORT}`);
  console.log(`==================================================`);
});