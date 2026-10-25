const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// 1. Search for "HỆ THỐNG ONLINE" or catalog header bar
const matchBar = html.match(/.{0,100}HỆ THỐNG ONLINE.{0,200}/g);
console.log('--- Catalog Topbar ---');
console.log(matchBar);

// 2. Search for "BỘ LỌC ĐIỀU PHỐI HỆ SINH THÁI"
const matchFilter = html.match(/.{0,100}BỘ LỌC ĐIỀU PHỐI HỆ SINH THÁI.{0,200}/g);
console.log('--- Sidebar Filter Title ---');
console.log(matchFilter);

// 3. Search for renderProducts template
const renderIdx = html.indexOf('function renderProducts');
console.log('--- renderProducts snippet ---');
console.log(html.slice(renderIdx, renderIdx + 2000));

