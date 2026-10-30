'use strict';
const {createLocalDemoEnvironment}=require('../local-demo');
try{
 Object.assign(process.env,createLocalDemoEnvironment());
 const port = process.env.PORT || 3000;
 console.log('================================================================');
 console.log('HỆ THỐNG ĐĂNG NHẬP OCOP (http://localhost:' + port + '):');
 console.log('----------------------------------------------------------------');
 console.log('👤 Khách hàng:        Tên: khachhang        Mật khẩu: 00000000');
 console.log('👑 Admin 1:           Tên: admin1           Mật khẩu: 11111111');
 console.log('👑 Admin 2:           Tên: admin2           Mật khẩu: 22222222');
 console.log('👑 Admin 3:           Tên: admin3           Mật khẩu: 33333333');
 console.log('👑 Admin 4:           Tên: admin4           Mật khẩu: 44444444');
 console.log('👑 Admin tổng:        Tên: admin            Mật khẩu: 11111111');
 console.log('🏢 Nhà phân phối:     Tên: nppdemo          Mật khẩu: NppDemo@2026');
 console.log('================================================================');
 require('../server');
}catch(error){console.error(error.message);process.exitCode=1;}
