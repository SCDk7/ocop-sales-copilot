const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {CartManager}=require('./giohang');
const {checkoutURL}=require('./cart-ui');
function storage(initial={}){const values=new Map(Object.entries(initial));return{getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value)};}
const products=[{id:1,name:'Trà trong danh mục',price:120000,stars:4,region:'Hà Nội',img:'images/tea.jpg'},{id:2,name:'Mật ong',price:90000,stars:3}];
test('legacy quantities and stale prices rehydrate against the current catalogue',()=>{
 const local=storage({ocop_cart:JSON.stringify([{id:1,qty:2,price:1,name:'OLD'},{id:1,quantity:3},{id:999,qty:1},{id:2,quantity:-2}])});
 const cart=new CartManager(local);cart.hydrate(products);cart.save();
 assert.equal(cart.cart.length,1);assert.equal(cart.cart[0].quantity,5);assert.equal(cart.cart[0].name,products[0].name);assert.equal(cart.getTotal(),600000);
 const restored=new CartManager(local);restored.hydrate(products);assert.equal(restored.getItemCount(),5);
 restored.removeFromCart(1);assert.equal(new CartManager(local).cart.length,0);
});
test('corrupt or unavailable browser storage does not prevent shopping',()=>{
 const broken=storage({ocop_cart:'not json'}),cart=new CartManager(broken);cart.addToCart(products[0],2);assert.equal(cart.getItemCount(),2);
 const restricted=new CartManager({getItem(){throw Error('denied');},setItem(){throw Error('denied');}});
 restricted.addToCart(products[0],999);restricted.addToCart(products[0],5);restricted.addToCart(products[1],NaN);
 assert.equal(restricted.getItemCount(),99);
});
test('checkout carries every line and quantity, with no client-supplied prices',()=>{
 const url=new URL(checkoutURL([{id:1,quantity:3,price:1},{id:2,quantity:2}]),'http://localhost/');
 assert.equal(url.pathname,'/draft-order.html');assert.equal(url.searchParams.get('products'),'1,2');assert.equal(url.searchParams.get('quantities'),'3,2');assert.equal(url.searchParams.has('price'),false);
});

function fakeDOM(){
 let document;
 class Node{
  constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attributes={};this.hidden=false;this.className='';this.style={setProperty:(key,value)=>{this.style[key]=value;}};this.events={};
   this.classList={contains:name=>this.className.split(' ').includes(name),add:name=>{this.className+=' '+name;},remove:name=>{this.className=this.className.split(' ').filter(n=>n!==name).join(' ');}};}
  append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
  replaceChildren(...nodes){this.children=[];this.append(...nodes);}
  setAttribute(key,value){this.attributes[key]=value;}
  addEventListener(name,handler){this.events[name]=handler;}
  get isConnected(){return true;}
  focus(){document.activeElement=this;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  querySelectorAll(selector){const all=[];function visit(node){for(const child of node.children){all.push(child);visit(child);}}visit(this);return all.filter(node=>selector.startsWith('#')?node.id===selector.slice(1):selector==='[data-action="close"]'?node.dataset.action==='close':selector==='button:not(:disabled)'?node.tagName==='button'&&!node.disabled:false);}
 }
 const body=new Node('body');document={body,baseURI:'http://localhost/',documentElement:{lang:'vi'},readyState:'complete',activeElement:body,createElement:tag=>new Node(tag),getElementById:id=>body.querySelector('#'+id),addEventListener(){}};
 return document;
}
test('cart UI adds, opens, updates, removes, restores and checks out the same persisted basket',()=>{
 const local=storage(),document=fakeDOM();let destination;
 const root={document,PRODUCTS:products,CartManager:class extends CartManager{constructor(){super(local);}},addEventListener(){},location:{assign:url=>{destination=url;}},showToast(){}};
 root.window=root;root.URL=URL;root.URLSearchParams=URLSearchParams;
 vm.runInNewContext(fs.readFileSync('cart-ui.js','utf8'),root);
 assert.equal(root.OCOPCartUI.ready,true);
 root.addToCart(1);root.addToCart(2);root.toggleCart(true);
 const panel=document.getElementById('cart-ui-panel');assert.equal(panel.attributes['aria-hidden'],'false');assert.equal(document.body.style.overflow,'hidden');
 root.changeCartUIQty(1,2);assert.equal(root.getCartTotal(),450000);
 root.proceedCheckoutFromCart();const url=new URL(destination);assert.equal(url.searchParams.get('quantities'),'3,1');
 root.removeFromCartUI(2);assert.equal(root.OCOPCartUI.lines().length,1);assert.equal(new CartManager(local).getItemCount(),3);
 root.toggleCart(false);assert.equal(panel.attributes['aria-hidden'],'true');
 root.removeFromCartUI(1);assert.equal(document.getElementById('cart-ui-empty').hidden,false);
});

test('selected rows control checkout, manual quantities and bulk removal',()=>{
 const local=storage(),document=fakeDOM();let destination;
 const root={document,PRODUCTS:products,CartManager:class extends CartManager{constructor(){super(local);}},addEventListener(){},location:{assign:url=>{destination=url;}},showToast(){}};
 root.window=root;root.URL=URL;root.URLSearchParams=URLSearchParams;
 vm.runInNewContext(fs.readFileSync('cart-ui.js','utf8'),root);
 root.addToCart(1);root.addToCart(2);root.openCartUI();
 const panel=document.getElementById('cart-ui-panel');
 assert.equal(panel.tagName,'div');
 const change=(action,extra={})=>panel.events.change({target:{dataset:{action,productId:'2'},...extra}});
 change('select',{checked:false});
 root.proceedCheckoutFromCart();assert.equal(new URL(destination).searchParams.get('products'),'1');
 change('quantity',{value:'4'});assert.equal(root.OCOPCartUI.lines()[1].quantity,4);
 change('quantity',{value:'0'});assert.equal(root.OCOPCartUI.lines()[1].quantity,4);
 change('select-all',{checked:false});assert.equal(document.getElementById('cart-ui-checkout-btn').disabled,true);
 change('select',{checked:true});
 root.proceedCheckoutFromCart();assert.equal(new URL(destination).searchParams.get('quantities'),'4');
 panel.events.click({target:{closest:()=>({dataset:{action:'remove-selected'}})}});
 assert.deepEqual(Array.from(root.OCOPCartUI.lines(),p=>p.id),[1]);
 const external=new CartManager(local);external.addToCart(products[1],2);
 root.closeCartUI();root.openCartUI();assert.equal(root.OCOPCartUI.lines().length,2);
});
