const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('ai-content-studio-section') || l.includes('Hồ Sơ Đề Án') || l.includes('AI Quản Trị Tài Chính') || l.includes('AI Financial Engine') || l.includes('Trợ Lý AI Tạo Nội Dung') || l.includes('AI Báo Cáo Giọng Nói')) {
    console.log(`L${i+1}: ${l}`);
  }
});

