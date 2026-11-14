(function(){
 const header=document.querySelector('body > .storefront-header');if(!header)return;
 const update=()=>document.documentElement.style.setProperty('--storefront-nav-height',Math.ceil(header.getBoundingClientRect().height)+'px');
 // Move the existing controls, preserving their handlers, cart badge and account state.
 const compact=window.matchMedia('(max-width: 767px)');
 const mobileNav=document.createElement('nav');
 mobileNav.id='mobile-storefront-nav';
 mobileNav.setAttribute('aria-label','Điều hướng cửa hàng');
 document.body.append(mobileNav);
 const controls=[
  [document.getElementById('header-nav-products-label')?.closest('button'),'products','fa-store','header-nav-products-label'],
  [document.getElementById('header-nav-stores-label')?.closest('button'),'stores','fa-map-location-dot','header-nav-stores-label'],
  [document.getElementById('header-cart-toggle'),'cart','fa-cart-shopping'],
  [document.getElementById('header-lang-dropdown-container'),'language','fa-globe'],
  [document.getElementById('btn-customer-account'),'account','fa-user','customer-account-btn-text']
 ].filter(([node])=>node).map(([node,action,iconClass,label])=>{
  const marker=document.createComment('navigation: '+action);
  node.before(marker);
  const button=node.matches('button')?node:node.querySelector('button');
  button.dataset.mobileAction=action;
  if(label)button.setAttribute('aria-labelledby',label);
  if(action==='language')button.setAttribute('aria-label','Chọn ngôn ngữ / Select language');
  const icon=document.createElement('i');
  icon.className='fa-solid '+iconClass;
  icon.dataset.mobileNavIcon='';
  icon.setAttribute('aria-hidden','true');
  button.prepend(icon);
  return {node,marker};
 });
 const arrange=()=>{
  window.closeAllLanguageDropdowns?.();
  for(const {node,marker} of controls){
   if(compact.matches)mobileNav.append(node);
   else marker.parentNode.insertBefore(node,marker.nextSibling);
  }
  mobileNav.hidden=!compact.matches;
  update();
 };
 if(compact.addEventListener)compact.addEventListener('change',arrange);
 else compact.addListener(arrange);
 arrange();
 if(typeof ResizeObserver==='function')new ResizeObserver(update).observe(header);
 window.addEventListener('resize',update,{passive:true});update();
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
