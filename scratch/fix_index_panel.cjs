const fs = require('fs');

let s = fs.readFileSync('index.html', 'utf8');

const targetStr = '<button id="province-map-clear"';
const pos = s.indexOf(targetStr);
console.log('Found targetStr at pos:', pos);

if (pos !== -1) {
    const afterBtn = s.indexOf('</div>', pos);
    console.log('Found </div> at:', afterBtn);
    const divEnd = afterBtn + '</div>'.length;
    console.log('Context:', JSON.stringify(s.substring(pos, divEnd + 50)));

    if (!s.includes('id="province-stores-panel"')) {
        const insertion = '\r\n                    <!-- DANH SÁCH CỬA HÀNG & ĐIỂM BÁN CHỨNG NHẬN OCOP TẠI TỈNH -->\r\n                    <div id="province-stores-panel" class="hidden mt-3 transition-all duration-300"></div>';
        s = s.substring(0, divEnd) + insertion + s.substring(divEnd);
        fs.writeFileSync('index.html', s, 'utf8');
        console.log('✓ Successfully inserted #province-stores-panel into index.html!');
    } else {
        console.log('Already includes #province-stores-panel');
    }
}
