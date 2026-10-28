(function(root) {
    'use strict';
    const USER_KEY='ocop_current_user', CART_KEY='ocop_cart', OWNER_KEY='ocop_active_customer_scope';
    const key=(scope,kind)=>'ocop_customer_state_v1:'+encodeURIComponent(scope)+':'+kind;
    function createSession(storage, temporary, {clearGuestOnLoad=true,beforeChange=()=>{},onChange=()=>{}}={}) {
        const read=(name,fallback=null)=>{try {const value=storage?.getItem(name);return value===null||value===undefined?fallback:JSON.parse(value);}catch{return fallback;}};
        const write=(name,value)=>{try {storage?.setItem(name,JSON.stringify(value));return Boolean(storage);}catch{return false;}};
        const remove=name=>{try {storage?.removeItem(name);}catch{}};
        const identity=()=>{
            const user=read(USER_KEY);
            if(!user || typeof user.username!=='string' || !user.username.trim())return '';
            const role=user.role==='admin'||user.isAdmin?'admin':user.role==='distributor'||user.isDistributor?'distributor':'customer';
            return role+':'+user.username.trim().toLowerCase();
        };
        const cartRows=value=>Array.isArray(value)?value.filter(row=>row&&Number.isInteger(Number(row.id))&&Number.isInteger(Number(row.quantity??row.qty??1))&&Number(row.quantity??row.qty??1)>0).map(row=>({...row,id:Number(row.id),quantity:Math.min(99,Number(row.quantity??row.qty??1))})):[];
        const mergeCart=(a,b)=>{
            const rows=new Map();
            for(const item of [...cartRows(a),...cartRows(b)])rows.set(item.id,{...item,quantity:Math.min(99,(rows.get(item.id)?.quantity||0)+item.quantity)});
            return [...rows.values()];
        };
        let scope=identity(),version=0;
        const priorOwner=read(OWNER_KEY,''),canMigrate=!priorOwner||priorOwner===scope;
        const previousCart=canMigrate?cartRows(read(CART_KEY,[])):[];
        if(scope) {
            const saved=read(key(scope,'cart'));
            const rows=saved===null?previousCart:cartRows(saved);
            write(key(scope,'cart'),rows);write(CART_KEY,rows);
            // Migrate the existing signed-in conversation once, never into a different owner.
            if(canMigrate && !read(key(scope,'chat'))) {
                try {const legacy=JSON.parse(temporary?.getItem('ocop_chat_history_v1')||'null');if(Array.isArray(legacy?.history)&&legacy.history.length)write(key(scope,'chat'),legacy);}catch{}
            }
        } else if(clearGuestOnLoad || priorOwner) remove(CART_KEY);
        write(OWNER_KEY,scope);
        try {temporary?.removeItem('ocop_chat_history_v1');}catch{}
        if(!scope || priorOwner && priorOwner!==scope)try {temporary?.removeItem('ocop-consultation-session');}catch{}
        function saveCart(rows) {
            const value=cartRows(rows);
            write(CART_KEY,value);
            return scope?write(key(scope,'cart'),value):true;
        }
        function clearCart() {remove(CART_KEY);if(scope)write(key(scope,'cart'),[]);}
        function loadChat() {
            if(!scope)return null;
            const saved=read(key(scope,'chat'));
            return saved&&Array.isArray(saved.history)&&saved.history.length&&typeof saved.html==='string'?saved:null;
        }
        function saveChat(snapshot) {
            if(!scope || !snapshot || !Array.isArray(snapshot.history))return false;
            return write(key(scope,'chat'),{...snapshot,history:snapshot.history.slice(-16)});
        }
        function clearChat() {if(scope)remove(key(scope,'chat'));}
        function syncIdentity({external=false}={}) {
            const next=identity();if(next===scope)return false;
            beforeChange();
            const previousScope=scope,guestCart=!scope&&!external?cartRows(read(CART_KEY,[])):[];
            scope=next;version++;
            if(scope)saveCart(mergeCart(read(key(scope,'cart'),[]),guestCart));
            else remove(CART_KEY);
            write(OWNER_KEY,scope);
            try {temporary?.removeItem('ocop_chat_history_v1');temporary?.removeItem('ocop-consultation-session');}catch{}
            onChange({previousScope,scope,version});
            return true;
        }
        return {get scope(){return scope;},get version(){return version;},saveCart,clearCart,loadChat,saveChat,clearChat,syncIdentity};
    }
    if(typeof module==='object'&&module.exports){module.exports={createSession};return;}
    let storage,temporary;try{storage=root.localStorage;temporary=root.sessionStorage;}catch{}
    root.OCOPCustomerSession=createSession(storage,temporary,{
        clearGuestOnLoad:!root.document.currentScript?.hasAttribute('data-preserve-guest'),
        beforeChange:()=>root.saveAIChatHistory?.(),
        onChange:detail=>root.dispatchEvent(new root.CustomEvent('ocop-customer-scope-change',{detail}))
    });
    root.addEventListener('storage',event=>{
        if((event.key===USER_KEY || event.key===null) && root.OCOPCustomerSession.syncIdentity({external:true}))root.updateCustomerHeaderUI?.();
    });
    root.addEventListener('pagehide',()=>root.saveAIChatHistory?.());
})(typeof globalThis!=='undefined'?globalThis:this);
