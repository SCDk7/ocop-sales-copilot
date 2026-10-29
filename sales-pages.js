'use strict';
window.salesPage={
 language:window.OCOPLanguage?.get()||(()=>{try{const value=localStorage.getItem('ocop-language');return ['vi','en','zh','ko','ja'].includes(value)?value:'vi';}catch{return 'vi';}})(),
 api(path){const base=document.querySelector('meta[name="ocop-api-base"]')?.content.trim() || localStorage.getItem('ocop-api-base') || '';if(base)return new URL(path,base.replace(/\/+$/,'')+'/').toString();if(location.hostname.endsWith('.github.io'))return 'https://ocop-sales-copilot.onrender.com'+path;const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&(Number(location.port)>=5500&&Number(location.port)<=5599||['3001','5173','8080'].includes(location.port));return location.protocol==='file:'||local?'http://localhost:3000'+path:path;},
 text(vi,en){if(this.language==='vi')return vi;if(window.OCOPLanguage){const translated=OCOPLanguage.text(vi,this.language);if(translated!==vi)return translated;return OCOPLanguage.text(en,this.language);}return this.language==='en'?en:vi;},
 render(){
  document.documentElement.lang=this.language;
  document.querySelectorAll('[data-vi]').forEach(element=>{element.textContent=element.id==='submit'&&element.dataset.processing?this.text('Đang xử lý…','Processing…'):element.dataset[this.language]||this.text(element.dataset.vi,element.dataset.en||element.dataset.vi);});
  let picker=document.getElementById('lang');
  if(picker&&picker.tagName!=='SELECT'){const select=document.createElement('select');select.id=picker.id;select.className='sales-language-select';select.setAttribute('aria-label',this.text('Ngôn ngữ','Language'));picker.replaceWith(select);picker=select;}
  if(picker){if(!picker.options.length)for(const language of ['vi','en','zh','ko','ja']){const option=document.createElement('option');option.value=language;option.textContent=language.toUpperCase()+' · '+(window.OCOPLanguage?.names[language]||language);picker.append(option);}picker.value=this.language;picker.onchange=()=>{this.language=picker.value;window.OCOPLanguage?.set(this.language,{source:'sales'});this.render();};}
  window.OCOPLanguage?.translate(document);document.dispatchEvent(new Event('sales-language'));
 }
};
window.addEventListener('ocop-language-change',event=>{if(salesPage.language!==event.detail.language){salesPage.language=event.detail.language;salesPage.render();}});
salesPage.render();
