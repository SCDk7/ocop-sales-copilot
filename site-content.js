'use strict';
const config=require('./site.config.json');
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const escapeMarkdown=value=>String(value??'').replace(/[\\`*_\[\]<>#|]/g,'\\$&').replace(/[\r\n]+/g,' ');
const pages={
 '/':{
  title:'OCOP Sales — Đặc sản và nông sản OCOP Việt Nam',
  description:config.description,
  sections:[
   ['Tìm đặc sản theo nhu cầu','OCOP Sales là website tra cứu và hỗ trợ mua sắm đặc sản, nông sản cùng sản phẩm làng nghề Việt Nam. Bạn có thể tìm theo tên sản phẩm, mã sản phẩm, địa phương, nhóm hàng và mức ngân sách. Danh mục gồm trà, thực phẩm chế biến, gia vị, quà tặng và các sản phẩm đặc trưng vùng miền.'],
   ['Thông tin để lựa chọn sản phẩm','Tên hàng, giá tham khảo, đơn vị tính và mức sao trong danh mục do cửa hàng cung cấp. Đây không phải cổng xác nhận chứng nhận OCOP của cơ quan nhà nước. Hãy đối chiếu chủ thể sản xuất, nhãn hàng và chứng nhận còn hiệu lực trước khi quyết định mua. Tồn kho chưa được người bán cập nhật phải được xem là chưa xác nhận.'],
   ['Tư vấn và hỗ trợ mua hàng','Trợ lý trên website hỗ trợ tìm sản phẩm, gợi ý theo ngân sách và đối chiếu ảnh với danh mục. Kết quả nhận diện ảnh chỉ là gợi ý tương đồng, không phải bằng chứng về xuất xứ hoặc chứng nhận. Không tìm thấy dữ liệu thì cần hỏi thêm hoặc chuyển tới CSKH, thay vì tự suy đoán.'],
   ['Đặt hàng và giao hàng','Bạn có thể xem danh mục mà không cần đăng nhập. Tạo đơn và theo dõi thông tin riêng cần tài khoản. Đơn được người bán xác nhận trước khi giao và chỉ hoàn tất sau khi khách xác nhận đã nhận hàng. Thời gian dự kiến: nội thành 1–2 ngày làm việc, ngoại thành 2–5 ngày làm việc từ lúc bàn giao cho đơn vị vận chuyển; lịch thực tế phụ thuộc điểm gửi, địa chỉ nhận và thời điểm đặt.']
  ]
 },
 '/about':{
  title:'Giới thiệu OCOP Sales',description:'Mục đích, phạm vi thông tin và cách sử dụng website OCOP Sales.',
  sections:[
   ['Website này giúp gì?','OCOP Sales là dự án website giới thiệu đặc sản, nông sản và sản phẩm làng nghề Việt Nam. Mục tiêu là giúp người mua tìm sản phẩm theo địa phương, nhóm hàng hoặc ngân sách, xem thông tin trong danh mục và kết nối với người bán. Website kết hợp danh mục sản phẩm, thông tin điểm bán và trợ lý hỗ trợ khách hàng.'],
   ['Nguồn dữ liệu và giới hạn','Danh mục hiện tại được cửa hàng đưa vào hệ thống. Mức sao OCOP và giá hiển thị là thông tin của danh mục, không thay thế việc kiểm tra chứng nhận gốc, thời hạn chứng nhận hoặc báo giá cuối cùng của người bán. OCOP Sales không tự nhận là cơ quan quản lý chương trình OCOP, không cấp chứng nhận và không đại diện cho cơ quan nhà nước.'],
   ['Cách sử dụng','Bạn có thể đọc danh mục công khai, tìm theo tên hoặc mã sản phẩm, rồi trao đổi với CSKH về thành phần, quy cách, tồn kho và giao hàng. Khi cần đặt hàng, hãy kiểm tra đúng người nhận, số lượng, giá và phương thức thanh toán trước khi xác nhận. Không gửi mật khẩu, mã OTP hoặc thông tin truy cập ngân hàng trong cuộc trò chuyện.'],
   ['Thông tin đơn vị vận hành','Thông tin pháp nhân, hotline, email và địa chỉ chính thức chưa được chủ dự án công bố. Các dữ liệu mẫu trước đây không được dùng làm thông tin xác thực tổ chức tại trang này. Những thông tin này cần được chủ dự án bổ sung và xác nhận trước khi công bố chính thức.']
  ]
 },
 '/contact':{
  title:'Liên hệ và hỗ trợ OCOP Sales',description:'Cách yêu cầu tư vấn sản phẩm, hỗ trợ đơn hàng và tiếp nhận khiếu nại.',
  sections:[
   ['Kênh hỗ trợ hiện có','Hãy quay lại cửa hàng và mở trợ lý hỗ trợ hoặc mục CSKH để gửi yêu cầu. Hotline, email và địa chỉ liên hệ chính thức hiện chưa được công bố. Các số điện thoại, email và địa chỉ mẫu trong dự án không phải thông tin liên hệ đã được xác minh; trang này không công bố lại các dữ liệu đó.'],
   ['Tư vấn trước khi mua','Nêu rõ tên hoặc mã sản phẩm, số lượng dự kiến và địa phương cần giao. Nếu tìm bằng ảnh, bạn nên gửi ảnh rõ nhãn hoặc bao bì; kết quả nhận diện cần được đối chiếu lại. Với yêu cầu quà biếu, hãy cho biết ngân sách và số người dùng để CSKH đưa ra lựa chọn phù hợp với dữ liệu hiện có.'],
   ['Hỗ trợ đơn hàng và khiếu nại','Khi đã có đơn, vui lòng chuẩn bị mã đơn và mô tả vấn đề. Bạn có thể cung cấp ảnh tình trạng hàng hoặc bao bì nếu cần giải quyết thiếu hàng, sai hàng hay hư hỏng. Chỉ gửi thông tin cần thiết cho việc xử lý; không gửi mật khẩu, mã OTP, số thẻ đầy đủ hoặc thông tin đăng nhập ngân hàng.'],
   ['Trước khi chuyển tiền','Kiểm tra số tiền, nội dung chuyển khoản và tài khoản nhận hiển thị trong luồng đặt hàng. Việc mở hoặc quét mã QR không chứng minh đã thanh toán thành công. Người bán cần đối soát giao dịch thực tế; website không có kết nối ngân hàng tự động xác nhận tiền chỉ dựa trên thao tác quét.']
  ]
 },
 '/privacy':{
  title:'Thông tin quyền riêng tư OCOP Sales',description:'Dữ liệu website xử lý, nơi lưu trữ và các lựa chọn của người sử dụng.',
  sections:[
   ['Phạm vi tài liệu','Đây là bản mô tả kỹ thuật để chủ dự án xem xét trước khi công bố chính sách chính thức. Nội dung phản ánh các chức năng đang có trong mã nguồn, không phải cam kết tuân thủ pháp luật hay danh tính pháp nhân đã được xác minh. Kênh tiếp nhận yêu cầu về dữ liệu và thời hạn lưu trữ chính thức cần được chủ dự án xác nhận.'],
   ['Dữ liệu được sử dụng','Đăng ký và đăng nhập sử dụng thông tin tài khoản, tên và số điện thoại hoặc thông tin do dịch vụ đăng nhập trả về. Tạo đơn cần thông tin người nhận, số điện thoại, địa chỉ giao hàng và sản phẩm đặt mua. Hệ thống còn có thể xử lý nội dung trò chuyện, hình ảnh sản phẩm hoặc âm thanh khi bạn chủ động dùng chức năng tương ứng. Mật khẩu được lưu dưới dạng băm thay vì nội dung rõ.'],
   ['Lưu trữ trên trình duyệt và máy chủ','Trình duyệt dùng localStorage và sessionStorage cho phiên đăng nhập, tùy chọn, giỏ hàng và trạng thái giao diện. Khách chưa đăng nhập được đặt lại chat và giỏ hàng khi tải lại; tài khoản đã đăng nhập có cơ chế lưu và khôi phục dữ liệu. Máy chủ lưu dữ liệu tài khoản và đơn hàng, cùng dữ liệu cần thiết cho các chức năng được bật. Mã chống tạo đơn trùng có thời hạn lưu kết quả ít nhất 24 giờ; việc hết hạn mã này không đồng nghĩa xóa đơn hàng.'],
   ['Dịch vụ bên ngoài','Tùy cấu hình của máy chủ, câu hỏi, ảnh hoặc âm thanh có thể được gửi tới nhà cung cấp AI để xử lý. Đăng ký qua SMS, đăng nhập qua dịch vụ bên ngoài, bản đồ và hiển thị QR cũng có thể liên quan đến dịch vụ tương ứng. Website không yêu cầu bạn cung cấp mật khẩu hoặc mã OTP ngân hàng cho chatbot. Không đưa dữ liệu riêng tư không cần thiết vào ảnh hay nội dung tư vấn.'],
   ['Lựa chọn và yêu cầu của bạn','Bạn có thể đăng xuất và xóa dữ liệu trình duyệt trên thiết bị của mình. Việc này không tự xóa dữ liệu đã lưu trên máy chủ. Nếu muốn kiểm tra, sửa hoặc yêu cầu xử lý dữ liệu máy chủ, hãy liên hệ CSKH qua website; quy trình và thời hạn giải quyết cần được đơn vị vận hành công bố. Thời hạn lưu ảnh, âm thanh, hội thoại và đơn hàng cần được chủ dự án hoàn thiện trước khi đưa chính sách vào sử dụng chính thức.']
  ]
 },
 '/terms':{
  title:'Thông tin đặt hàng OCOP Sales',description:'Các bước xác nhận đơn, giao nhận và đối soát thanh toán trên website.',
  sections:[
   ['Kiểm tra trước khi đặt','Bạn nên kiểm tra tên, mã sản phẩm, đơn vị tính, số lượng và thông tin người nhận trước khi gửi yêu cầu đặt hàng. Giá trong danh mục và mức sao là dữ liệu của cửa hàng. Người bán cần xác nhận tồn kho, quy cách và phí giao hàng; thông tin của một kết quả tìm kiếm hoặc gợi ý AI không thay thế việc xác nhận này.'],
   ['Trạng thái đơn hàng','Yêu cầu mới được lưu ở trạng thái chờ người bán xác nhận. Sau khi xác nhận đủ tồn kho và thỏa thuận giao hàng, đơn có thể được chuyển sang đang giao. Đơn chỉ được ghi nhận hoàn tất khi khách xác nhận đã nhận hàng. Báo đã chuyển khoản là yêu cầu đối soát, không tự chuyển trạng thái tiền sang đã nhận.'],
   ['Thanh toán và hỗ trợ','Mã QR hiển thị thông tin nhận tiền và nội dung chuyển khoản. Làm mới QR hoặc đồng hồ hiển thị không tự xác minh, hủy hay hoàn tiền từ ngân hàng. Khi có vấn đề giao nhận, sai hàng hoặc hư hỏng, hãy giữ mã đơn và liên hệ CSKH để người bán tiếp nhận. Chính sách đổi trả, hoàn tiền, thời hạn và thông tin pháp lý cần được chủ dự án công bố chính thức.'],
   ['Tình trạng tài liệu','Trang này giải thích luồng kỹ thuật của website để xem trước, không bổ sung điều khoản pháp lý hay nghĩa vụ thương mại chưa được chủ dự án xác nhận. Trước khi công bố, đơn vị vận hành cần rà soát điều kiện giao dịch, quy trình khiếu nại và các nội dung bắt buộc phù hợp với hoạt động thực tế.']
  ]
 },
 '/catalog':{
  title:'Danh mục đặc sản và nông sản OCOP',description:'Đọc tên, mã, xuất xứ và giá trong danh mục cửa hàng mà không cần JavaScript.',
  sections:[['Cách đọc danh mục','Thông tin dưới đây lấy từ cùng danh mục đang dùng trên cửa hàng. Mức sao do cửa hàng cung cấp, chưa được trang này xác minh độc lập. Giá và tồn kho cần được người bán xác nhận trước khi đặt. Với sản phẩm chưa có dữ liệu tồn kho, không được suy luận rằng hàng đang có sẵn.']]
 }
};
const absolute=route=>config.url+(route==='/'?'/':route);
function structuredData(language="vi"){
 const organization={'@type':'Organization','@id':absolute('/#organization'),name:config.contact.organizationName||config.name,url:absolute('/'),description:pageFor('/about',language).description,logo:absolute('/assets/ocop-logo.svg'),contactPoint:{'@type':'ContactPoint',contactType:'customer support',url:absolute('/contact'),availableLanguage:['vi','en','zh','ko','ja']}};
 if(config.contact.verified){
  const c=config.contact;if(c.telephone)organization.contactPoint.telephone=c.telephone;if(c.email)organization.contactPoint.email=c.email;
  if(c.streetAddress)organization.address={'@type':'PostalAddress',streetAddress:c.streetAddress,addressLocality:c.addressLocality,addressRegion:c.addressRegion,postalCode:c.postalCode,addressCountry:c.addressCountry};
 }
 return {'@context':'https://schema.org','@graph':[organization,{'@type':'WebSite','@id':absolute('/#website'),name:config.name,url:absolute('/'),description:pageFor('/',language).description,inLanguage:language,publisher:{'@id':organization['@id']}},{'@type':'WebApplication',name:config.name,url:absolute('/'),description:pageFor('/',language).description,applicationCategory:'ShoppingApplication',operatingSystem:'Web browser',browserRequirements:'JavaScript is required for interactive shopping; public information is also available as HTML and Markdown.',publisher:{'@id':organization['@id']}}]};
}
const locale=require('./site-language');
const translations=require('./site-locales');
const uiRows=require('./ui-translations').rows;
function text(value,language='vi'){const row=uiRows.find(row=>row.includes(value));return row?row[locale.languages.indexOf(locale.normalize(language))]:value;}
function pageFor(route,language='vi'){const lang=locale.normalize(language);return lang==='vi'?pages[route]:translations[lang][route];}
function metadata(route='/',language='vi'){
 const lang=locale.normalize(language),page=pageFor(route,lang),title=escapeHtml(page.title),description=escapeHtml(page.description),url=escapeHtml(absolute(route));
 return `<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="OCOP Sales">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${absolute('/assets/ocop-social-card.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(pageFor('/',lang).title)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="text/markdown" href="${route==='/'?'index.md':absolute(route+'.md')}${lang==='vi'?'':'?lang='+lang}">
<link rel="describedby" type="text/plain" href="${route==='/'?'llms.txt':absolute('/llms.txt')}">
<script type="application/ld+json">${JSON.stringify(structuredData(lang)).replace(/</g,()=>String.fromCharCode(92)+'u003c')}</script>`;
}
function productLines(products,language='vi'){
 const lang=locale.normalize(language),field='name'+lang[0].toUpperCase()+lang.slice(1);
 return products.map(p=>({name:lang==='vi'?p.name:p[field]||p.name,code:p.productCode||'',region:p.region||'',price:Number(p.price).toLocaleString('vi-VN')+' đ / '+locale.unit(p.packaging||p.unit||'',lang),stars:p.stars,href:absolute('/products/'+p.id)}));
}
function markdown(route,products=[],language='vi'){
 const lang=locale.normalize(language),page=pageFor(route,lang);let result=`# ${page.title}\n\n${page.description}\n\n`+page.sections.map(([title,value])=>`## ${title}\n\n${value}`).join('\n\n');
 if(route==='/catalog')result+='\n\n## '+text('Sản phẩm trong danh mục',lang)+'\n\n'+productLines(products,lang).map(p=>`- **${escapeMarkdown(p.name)}** — ${text('Mã',lang)} ${p.code}; ${escapeMarkdown(p.region)}; ${text('Giá danh mục:',lang)} ${escapeMarkdown(p.price)}; ${text('Mức sao cửa hàng cung cấp:',lang)} ${Number(p.stars)||text('chưa rõ',lang)}. [${text('Xem trên cửa hàng',lang)}](${p.href})`).join('\n');
 return result+'\n\n## '+text('Đọc thêm',lang)+'\n\n'+Object.keys(pages).filter(path=>path!==route).map(path=>`- [${pageFor(path,lang).title}](${absolute(path)}${lang==='vi'?'':'?lang='+lang})`).join('\n')+`\n- [${text('Hướng dẫn cho agent',lang)}](${absolute('/llms.txt')})\n`;
}
function viewHtml(route,products,language){
 const lang=locale.normalize(language),page=pageFor(route,lang);
 let body=page.sections.map(([title,value])=>`<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(value)}</p></section>`).join('\n');
 if(route==='/catalog')body+='<section><h2>'+text('Sản phẩm trong danh mục',lang)+'</h2><ul class="site-product-list">'+productLines(products,lang).map(p=>`<li><h3 data-localization-skip><a href="../products/${p.href.split('/').at(-1)}?lang=${lang}">${escapeHtml(p.name)}</a></h3><p>${text('Mã',lang)} ${escapeHtml(p.code)} · <span data-localization-skip>${escapeHtml(p.region)}</span></p><p>${text('Giá danh mục:',lang)} <strong>${escapeHtml(p.price)}</strong> · ${text('Mức sao cửa hàng cung cấp:',lang)} ${Number(p.stars)||text('chưa rõ',lang)}</p></li>`).join('')+'</ul></section>';
 return `<main class="site-info-main"><nav aria-label="${text('Thông tin website',lang)}">${Object.keys(pages).filter(path=>path!=='/').map(path=>`<a href="..${path}/?lang=${lang}"${path===route?' aria-current="page"':''}>${escapeHtml(pageFor(path,lang).title.replace(' OCOP Sales',''))}</a>`).join('')}</nav><article><p class="site-info-eyebrow">${text('THÔNG TIN WEBSITE',lang)}</p><h1>${escapeHtml(page.title)}</h1><p class="site-info-lead">${escapeHtml(page.description)}</p>${body}</article></main><footer class="site-info-footer"><a href="../llms.txt">${text('Hướng dẫn cho agent',lang)}</a><a href="../${route.slice(1)}.md?lang=${lang}">${text('Bản Markdown',lang)}</a><a href="../sitemap.xml">${text('Sơ đồ website',lang)}</a></footer>`;
}
function html(route,products=[],language='vi'){
 const lang=locale.normalize(language),views=Object.fromEntries(locale.languages.map(code=>{const page=pageFor(route,code);return [code,{html:viewHtml(route,products,code),title:page.title,description:page.description,back:text('Về cửa hàng',code),languageLabel:text('Ngôn ngữ',code)}];}));
 return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metadata(route,lang)}<link rel="icon" href="../assets/ocop-logo.svg"><link rel="stylesheet" href="../assets/site-information.css"><script src="../ui-translations.js"></script><script src="../site-language.js"></script><style>html[data-site-locale-pending] #site-information-view,html[data-site-locale-pending] .site-info-shop{visibility:hidden}</style><script>if(window.OCOPLanguage&&OCOPLanguage.get()!==document.documentElement.lang)document.documentElement.dataset.siteLocalePending='1';</script></head><body class="site-info-body"><header class="site-info-header"><a class="site-info-brand" href="../index.html?lang=${lang}"><img src="../assets/ocop-logo.svg" width="42" height="42" alt="">OCOP Sales</a><div class="site-info-actions"><a class="site-info-shop" href="../index.html?view=shop&lang=${lang}">${text('Về cửa hàng',lang)}</a><select id="site-language-select" aria-label="${text('Ngôn ngữ',lang)}">${locale.languages.map(code=>`<option value="${code}"${code===lang?' selected':''}>${code.toUpperCase()} · ${locale.names[code]}</option>`).join('')}</select></div></header><div id="site-information-view" data-language="${lang}">${views[lang].html}</div><script type="application/json" id="site-locale-views">${JSON.stringify(views).replace(/</g,()=>String.fromCharCode(92)+'u003c')}</script><script src="../site-information-client.js"></script></body></html>\n`;
}
function llms(){return `# OCOP Sales\n\n> Website tra cứu đặc sản và nông sản Việt Nam, hỗ trợ lựa chọn theo địa phương, nhóm sản phẩm và ngân sách.\n\nUse this website to find Vietnamese agricultural products and regional specialties in the store catalogue. Prices and OCOP star ratings are store-provided data, not independently verified certificates. Official organization contact details are not published yet.\n\n## When to use this / Khi nào nên sử dụng\n\n- [Tìm sản phẩm theo tên, mã, địa phương hoặc ngân sách](${absolute('/catalog.md')}): Read the catalogue, then compare the customer's requirements. Do not infer availability from a missing stock value.\n- [Tư vấn trước khi đặt hàng](${absolute('/index.md')}): Explain the website's shopping and image-matching capabilities; image similarity does not establish product origin or certification.\n- [Hỗ trợ đơn hàng và khiếu nại](${absolute('/contact.md')}): Direct the customer to website CSKH and ask for the order reference; never request bank passwords or OTPs.\n\n## How to use / Cách truy cập\n\n- [Trang chủ dạng Markdown](${absolute('/')}): GET with Accept: text/markdown; HTML remains available with Accept: text/html. Wildcard requests default to HTML.\n- [Danh mục JSON công khai](${absolute('/api/ai/shop-products')}): GET, no login required. Use productId, productCode, name, region and price; null stock means unverified. Do not fabricate certification claims.\n- [Quy trình đặt hàng](${absolute('/terms.md')}): Order creation requires the customer's authenticated session, explicit confirmation and a UUID v4 Idempotency-Key header. Retry the same intent with the same key. Never submit an order merely because an agent found a matching product.\n\n## Thông tin và quyền riêng tư\n\n- [Giới thiệu](${absolute('/about.md')}): Project scope and limitations.\n- [Liên hệ](${absolute('/contact.md')}): Support channels; no unverified phone, email or street address.\n- [Quyền riêng tư](${absolute('/privacy.md')}): Technical draft describing browser storage, accounts, orders and optional external providers; owner review is required before publication.\n\n## Optional\n\n- [Sitemap XML](${absolute('/sitemap.xml')}): Public indexable pages only.\n- [Robots](${absolute('/robots.txt')}): Crawl guidance does not grant access to private APIs.\n`;}
module.exports={config,pages,escapeHtml,escapeMarkdown,absolute,structuredData,metadata,markdown,html,llms,pageFor,text};
