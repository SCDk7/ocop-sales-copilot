'use strict';
window.salesPage={language:localStorage.getItem('ocop-language')==='en'?'en':'vi',
 api(path){const base=document.querySelector('meta[name="ocop-api-base"]')?.content.trim() || localStorage.getItem('ocop-api-base') || '';if(base)return new URL(path,base.replace(/\/+$/,'')+'/').toString();const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&(Number(location.port)>=5500&&Number(location.port)<=5599||['5173','8080'].includes(location.port));return location.protocol==='file:'||local?'http://localhost:3000'+path:path;},
 text(vi,en){return this.language==='en'?en:vi;},
 render(){document.documentElement.lang=this.language;document.querySelectorAll('[data-vi]').forEach(el=>el.textContent=el.dataset[this.language]);document.getElementById('lang').textContent=this.text('English','Tiếng Việt');document.dispatchEvent(new Event('sales-language'));}
};
document.getElementById('lang').onclick=()=>{salesPage.language=salesPage.language==='vi'?'en':'vi';localStorage.setItem('ocop-language',salesPage.language);salesPage.render();};
salesPage.render();
