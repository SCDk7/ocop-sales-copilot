'use strict';
const {createLocalDemoEnvironment}=require('../local-demo');
try{
 Object.assign(process.env,createLocalDemoEnvironment());
 console.log('Demo cục bộ: http://localhost:'+(process.env.PORT||3000));
 console.log('Dùng khachhang / 123456 hoặc admin / 000000. Dữ liệu demo tách riêng.');
 require('../server');
}catch(error){console.error(error.message);process.exitCode=1;}
