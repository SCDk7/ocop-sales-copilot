'use strict';
const fs=require('node:fs'),path=require('node:path');
const content=require('../site-content');
const root=path.resolve(__dirname,'..');
function write(file,value){const target=path.join(root,file);fs.mkdirSync(path.dirname(target),{recursive:true});if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==value)fs.writeFileSync(target,value);}
function build(){
 const products=require('../data').PRODUCTS;
 const homeMarkdown=content.markdown('/',products);
 write('index.md',homeMarkdown);
 for(const route of Object.keys(content.pages).filter(route=>route!=='/')){
  write(route.slice(1)+'/index.html',content.html(route,products));
  write(route.slice(1)+'.md',content.markdown(route,products));
 }
 write('llms.txt',content.llms());
 write('robots.txt',`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /kpi-site/\nDisallow: /cart\nDisallow: /gio-hang\nDisallow: /draft-order.html\nSitemap: ${content.absolute('/sitemap.xml')}\n`);
 const fallback=`<noscript id="public-no-js-overview"><style>#ocop-intro-overlay{position:relative!important;inset:auto!important;min-height:100vh;overflow:visible!important}#intro-bg-parallax-layer,#ocop-intro-overlay button,#intro-map-panel{display:none!important}.no-js-overview{text-align:left;max-width:76ch;margin:24px auto;padding:24px;background:#fff;border:1px solid #bae6fd;border-radius:18px;color:#17354e;line-height:1.7}.no-js-overview h2{font-size:20px;margin:0 0 12px}.no-js-overview p{margin:0 0 14px}.no-js-overview a{color:#236b9e;text-decoration:underline}.no-js-overview ul{list-style:disc;padding-left:20px}</style><section class="no-js-overview" aria-label="Danh mục không cần JavaScript"><h2>Khám phá đặc sản khi không bật JavaScript</h2>${content.pages['/'].sections.map(([,text])=>'<p>'+content.escapeHtml(text)+'</p>').join('')}<p><a href="catalog/">Đọc toàn bộ danh mục sản phẩm</a> · <a href="about/">Giới thiệu</a> · <a href="contact/">Liên hệ</a> · <a href="privacy/">Quyền riêng tư</a></p><ul>${products.slice(0,6).map(p=>`<li>${content.escapeHtml(p.name)} — ${content.escapeHtml(p.region)}, mã ${content.escapeHtml(p.productCode)}</li>`).join('')}</ul></section></noscript>`;
 for(const file of ['index.html','index_2.html']){
  let html=fs.readFileSync(path.join(root,file),'utf8');
  const meta='<!-- PUBLIC DISCOVERY START -->\n'+content.metadata('/')+'\n<!-- PUBLIC DISCOVERY END -->';
  html=/<!-- PUBLIC DISCOVERY START -->[\s\S]*?<!-- PUBLIC DISCOVERY END -->/.test(html)?html.replace(/<!-- PUBLIC DISCOVERY START -->[\s\S]*?<!-- PUBLIC DISCOVERY END -->/,()=>meta):html.replace(/<title>[\s\S]*?<\/title>/,()=>meta);
  html=html.replace(/<h2([^>]*class="[^"]*intro-hero-title[^"]*"[^>]*)>([\s\S]*?)<\/h2>/,(_all,attrs,body)=>`<h1${attrs}>${body}</h1>`);
  html=html.replace(/<h3([^>]*id="province-products-title"[^>]*)>([\s\S]*?)<\/h3>/,'<h2$1>$2</h2>');
  if(html.includes('<noscript id="public-no-js-overview">'))html=html.replace(/<noscript id="public-no-js-overview">[\s\S]*?<\/noscript>/,()=>fallback);
  else html=html.replace(/(<p\b[^>]*id="i18n-intro-desc"[^>]*>[\s\S]*?<\/p>)/,match=>match+'\n'+fallback);
  html=html.replace(/<a href="#"([^>]*class="hover:text-sky-700 font-medium"[^>]*)>Chính sách bảo mật<\/a>/,'<a href="privacy/"$1>Chính sách bảo mật</a>');
  html=html.replace(/<a href="#"([^>]*class="hover:text-sky-700 font-medium"[^>]*)>Điều khoản dịch vụ<\/a>/,'<a href="terms/"$1>Thông tin đặt hàng</a>');
  if(!html.includes('data-public-info-links'))html=html.replace('<a href="privacy/" class="hover:text-sky-700 font-medium"', '<span data-public-info-links><a href="about/" class="hover:text-sky-700 font-medium">Giới thiệu</a> · <a href="contact/" class="hover:text-sky-700 font-medium">Liên hệ</a></span>\n                    <a href="privacy/" class="hover:text-sky-700 font-medium"');
  html=html.replace(/<div class="flex items-center space-x-4">(\s*<a href="terms\/")/,'<div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">$1');
  write(file,html);
 }
 // lastmod reflects the content file's actual modification time, not a fabricated daily date.
 const entries=Object.keys(content.pages).map(route=>({route,file:route==='/'?'index.html':route.slice(1)+'/index.html'}));
 write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+entries.map(({route,file})=>`  <url><loc>${content.escapeHtml(content.absolute(route))}</loc><lastmod>${fs.statSync(path.join(root,file)).mtime.toISOString()}</lastmod></url>`).join('\n')+'\n</urlset>\n');
 return entries.length;
}
async function socialCard(){
 process.env.XDG_CACHE_HOME??=path.join(root,'.private-data','font-cache');
 fs.mkdirSync(process.env.XDG_CACHE_HOME,{recursive:true});
 const logo=fs.readFileSync(path.join(root,'assets/ocop-logo.svg')).toString('base64');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#e6f4ff"/><rect x="42" y="42" width="1116" height="546" rx="40" fill="white" stroke="#b9dff8" stroke-width="2"/><image href="data:image/svg+xml;base64,${logo}" x="100" y="98" width="94" height="94"/><text x="220" y="162" fill="#337db5" font-family="sans-serif" font-size="52" font-weight="700">OCOP Sales</text><text x="100" y="300" fill="#173b59" font-family="sans-serif" font-size="58" font-weight="700">Đặc sản &amp; nông sản</text><text x="100" y="376" fill="#173b59" font-family="sans-serif" font-size="58" font-weight="700">Việt Nam</text><text x="100" y="465" fill="#456f8c" font-family="sans-serif" font-size="29">Tìm sản phẩm · Tham khảo giá · Kết nối người bán</text><rect x="100" y="505" width="250" height="8" rx="4" fill="#5aa4d9"/></svg>`;
 write('assets/ocop-social-card.svg',svg+'\n');
 const image=await require('sharp')(Buffer.from(svg)).png().toBuffer();
 const file=path.join(root,'assets/ocop-social-card.png');if(!fs.existsSync(file)||!fs.readFileSync(file).equals(image))fs.writeFileSync(file,image);
}
if(require.main===module)(async()=>{require('./sync-client-assets.cjs').syncClientAssets(root);const count=build();await socialCard();console.log(`Built ${count} public pages, Markdown, metadata, sitemap and social image.`);})().catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={build,socialCard};
