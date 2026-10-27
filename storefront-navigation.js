(function(){
 const header=document.querySelector('body > .storefront-header');if(!header)return;
 const update=()=>document.documentElement.style.setProperty('--storefront-nav-height',Math.ceil(header.getBoundingClientRect().height)+'px');
 new ResizeObserver(update).observe(header);update();
 header.addEventListener('click',event=>{
  const target=event.target.closest('button,a');if(!target)return;
  if(target.closest('.lang-dropdown-container'))return;
  const intro=document.getElementById('ocop-intro-overlay');
  if(intro&&!intro.classList.contains('hidden')){
   event.preventDefault();event.stopImmediatePropagation();
   window.enterOcopMarket('all',()=>target.click());return;
  }
  if(target.matches('a[href="#"]')){event.preventDefault();window.scrollTo({top:0,behavior:'smooth'})}
 },true);
})();
