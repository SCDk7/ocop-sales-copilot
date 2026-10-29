(function(root){
 'use strict';
 const state=root.OCOPLanguage,source=document.getElementById('site-locale-views'),host=document.getElementById('site-information-view');
 if(!state||!source||!host)return;
 const views=JSON.parse(source.textContent),select=document.getElementById('site-language-select');
 function render(){
  const lang=state.get(),view=views[lang];if(!view)return;
  if(host.dataset.language!==lang){host.innerHTML=view.html;host.dataset.language=lang;}
  document.documentElement.lang=lang;document.title=view.title;
  for(const [key,value]of [['description',view.description],['og:title',view.title],['og:description',view.description]]){const node=document.querySelector(`meta[${key.startsWith('og:')?'property':'name'}="${key}"]`);if(node)node.content=value;}
  const json=document.querySelector('script[type="application/ld+json"]');if(json){const graph=JSON.parse(json.textContent);for(const item of graph['@graph']||[])if(item['@type']==='WebSite')item.inLanguage=lang;json.textContent=JSON.stringify(graph);}
  select.value=lang;select.setAttribute('aria-label',view.languageLabel);
  document.querySelector('.site-info-shop').textContent=view.back;
  state.translate(document);state.links(document);
  delete document.documentElement.dataset.siteLocalePending;
 }
 select.addEventListener('change',()=>{state.set(select.value,{source:'information'});render();});
 root.addEventListener('ocop-language-change',render);
 render();
})(window);
