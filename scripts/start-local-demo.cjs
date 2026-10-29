'use strict';
const {createLocalDemoEnvironment}=require('../local-demo');
try{
 Object.assign(process.env,createLocalDemoEnvironment());
 const port = process.env.PORT || 3000;
 console.log('================================================================');
 console.log('Hiện tại bạn đăng nhập được bản chạy trên máy tại http://localhost:' + port + ' bằng:');
 console.log('----------------------------------------------------------------');
 console.log('Loại tài khoản          Tên đăng nhập       Mật khẩu');
 console.log('Khách hàng demo         khachhang           123456');
 console.log('Admin demo              admin               000000');
 console.log('Nhà phân phối demo      nppdemo             NppDemo@2026');
 console.log('----------------------------------------------------------------');
 console.log('Vẫn có đủ 4 tài khoản admin trong bản demo trên máy:');
 console.log('Tên đăng nhập           Mật khẩu');
 console.log('ThaoNguyenad01          0000000');
 console.log('KimNganad02             1111111');
 console.log('VinhPhucad03            2222222');
 console.log('ThanhBinhad04           3333333');
 console.log('================================================================');
 require('../server');
}catch(error){console.error(error.message);process.exitCode=1;}
