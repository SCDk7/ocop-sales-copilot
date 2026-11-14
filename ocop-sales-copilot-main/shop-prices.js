'use strict';
(()=>{
 let busy=false;
 async function sync(){
  if(busy||document.hidden)return;busy=true;
  try{
   const response=await fetch(getAIEndpoint('/api/ai/prices'),{cache:'no-store',signal:AbortSignal.timeout(5000)});if(!response.ok)return;
   const data=await response.json();let changed=false;
   for(const row of data.products||[]){const p=products.find(p=>p.id===row.id);if(p&&Number.isSafeInteger(row.price)&&row.price>0){if(p.price!==row.price||p.priceIsReference!==row.priceIsReference)changed=true;Object.assign(p,{price:row.price,priceMin:row.priceMin,priceMax:row.priceMax,priceIsReference:row.priceIsReference});}}
   if(changed){renderProducts(lastRenderedProducts);renderCartItems();}
  }catch(error){console.debug('Price refresh unavailable:',error.name);}finally{busy=false;}
 }
 window.refreshShopPrices=sync;sync();setInterval(sync,30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync();});
})();
