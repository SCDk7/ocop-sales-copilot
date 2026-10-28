(function(root){
    'use strict';
    const node=typeof module==='object'&&module.exports;
    const shopping=node?require('./ai-shopping'):root.AIShopping;
    const safeURL=node?require('./ai-grounding').safeURL:value=>{
        try {const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}
    };
    const webResearchInstruction=`PUBLIC WEB RESEARCH: Act as an independent, trustworthy OCOP specialty research advisor. Every public product, regional-specialty or gift-advice question must go through the application's Google Search research stage, including existing FAQs. Prioritize government OCOP records, verified manufacturers and reputable reporting. Cite only URLs returned by a successful search. If no relevant verified source is returned, explicitly disclose the missing web verification and offer only clearly labelled catalogue facts. Never claim the search succeeded from model memory or Wikipedia alone. The catalogue controls purchasable product IDs, units and shop checkout prices. Official, dated certification sources may disagree with the catalogue: disclose the discrepancy, rather than asserting catalogue stars as independently verified. Web prices are references, not this shop's offer. Do not send account, order, payment, contact, address or complaint details to public search.`;
    const norm=value=>shopping.normalize(String(value||''));
    const privateText=value=>{
        const text=String(value||''),q=norm(text);
        return /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?84|0)\d[\d ()-]{7,}\d\b/i.test(text)
            || /\b(?:otp|password|mat khau|ma don|order id|order number|tracking number|so tai khoan|so the|ten toi|toi ten|toi o|dia chi cua toi|dia chi nhan hang|nguoi nhan|so nha)\b|\b(?:ord-|ocop-draft-|kh\d{5,}|npp\d{5,}|ad\d{5,})/.test(q);
    };
    function planWebResearch(messages,products=[],reply=null,{hasImages=false}={}){
        const userMessages=(messages||[]).filter(row=>row.role==='user');
        const query=String(userMessages.at(-1)?.text || reply?.transcription || '').trim();
        const q=norm(query);
        if(!q && !hasImages)return {required:false,reason:'empty'};
        if(privateText(query))return {required:false,reason:'private_details'};
        if(/khieu nai|doi tra|hoan tien|complaint|refund|kiem tra.*don|tinh trang.*don|theo doi.*don|order status|track.*order|giao hang|shipping|phi ship|huong dan.*dat hang|ho tro dat hang|how.*place.*order|ton kho|con hang|con bao nhieu|het hang|stock|inventory|cho.*gap.*(?:admin|nhan vien)|nguoi that|human support/.test(q) || reply?.handoffAdmin)return {required:false,reason:'private_or_operational'};
        if(/^(xin chao|chao|hello|hi|cam on|thanks|thank you|ok|oke|duoc|vang|da)[!.\s]*$/.test(q))return {required:false,reason:'greeting'};
        if(/(?:can |muon |xin )?tu van (?:giup |cho )?(?:toi |minh |em )?(?:chon |tim )?(?:dac san|san pham|qua bieu|combo)|tu van san pham|tu van dac san|goi y dac san|co dac san gi/i.test(q) && !/dong nai|ha noi|da nang|tp hcm|quang binh|lam dong|can tho|tinh |gia bao nhieu|duoi |trieu|nghin|k\b/i.test(q))return {required:false,reason:'general_consultation'};
        const ids=reply?.productIds || reply?.suggested_products || [];
        const selected=ids.map(id=>products.find(product=>product.id===id)).filter(Boolean).slice(0,3);
        const imageType=String(reply?.imageEvidence?.productType||'').trim();
        if(hasImages && !selected.length && (!imageType || /^(unknown|unidentified|product|san pham|khong ro)$/.test(norm(imageType))))return {required:false,deferred:!reply,reason:'image_not_identified'};
        const named=selected.length?selected:products.filter(product=>{
            const name=norm(product.name.split(/[(/]/)[0]).trim();
            return name.length>5&&q.includes(name);
        }).sort((a,b)=>b.name.length-a.name.length).slice(0,3);
        const followUp=/^(cai nay|mon nay|san pham nay|no |gia bao nhieu|bao nhieu tien|may sao|thanh phan|cong dung|nguon goc)/.test(q);
        const previous=followUp?userMessages.slice(-3,-1).filter(row=>!privateText(row.text)).map(row=>row.text).join(' ').slice(0,200):'';
        const queries=named.length?named.map(product=>`${product.name} ${product.region||''} OCOP ${query.slice(0,120)}`):[`${previous} ${hasImages?imageType:query} OCOP đặc sản Việt Nam`.trim()];
        return {required:true,queries:[...new Set(queries.map(value=>value.replace(/\s+/g,' ').trim().slice(0,500)))],mode:/combo|qua bieu|qua tet|qua tang|ngan sach|duoi \d|gift|budget|bundle|diem ban|showroom|chi duong|store location|o2o/.test(q)?'shopping':'knowledge'};
    }
    function applyWebResearch(reply,research,plan,products=[],language='vi'){
        if(!plan.required || !reply || typeof reply.message!=='string' || reply.handoffAdmin)return reply;
        const en=language==='en';
        const sources=(research?.sources||[]).filter(source=>safeURL(source.url));
        const success=research?.searched===true && sources.length>0 && Boolean(research.text?.trim());
        const selected=(reply.productIds||reply.suggested_products||[]).map(id=>products.find(product=>product.id===id)).filter(Boolean).slice(0,3);
        const catalogue=selected.map(product=>`• **${product.name}**${product.region?' — '+product.region:''}${typeof product.price==='number'&&Number.isFinite(product.price)?' — '+product.price.toLocaleString('vi-VN')+' ₫/'+(product.packaging||(en?'unit':'đơn vị')):''}`).join('\n');
        const basic=catalogue?(en?'**Shop catalogue — reference prices:**\n':'**Theo danh mục cửa hàng — giá tham khảo:**\n')+catalogue:'';
        const metadata={required:true,attempted:research?.attempted===true,searched:success,status:success?'success':research?.status||'unavailable',provider:'google_search',checkedAt:research?.checkedAt||null};
        let message;
        const detachQuestion=text=>{
            const value=String(text||'').trim(),match=value.match(/(?:^|\n)([^\n]{1,180}[?？])\s*$/);
            return match?{text:value.slice(0,match.index).trim(),question:match[1]}:{text:value,question:''};
        };
        const original=detachQuestion(reply.message);
        const defaultQuestion=en?'Which detail would you like me to research next?':'Anh/chị muốn em tra cứu thêm thông tin nào ạ?';
        if(success){
            // Never retain a model-invented URL as a source attribution.
            const allowed=new Set(sources.map(source=>safeURL(source.url)));
            const text=research.text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,(all,label,url)=>allowed.has(safeURL(url))?all:label);
            const researched=detachQuestion(text);
            const links=sources.slice(0,5).map(source=>`• [${String(source.title||new URL(source.url).hostname).replace(/[\[\]]/g,'')}](${source.url})`).join('\n');
            const keep=plan.mode==='shopping'||reply.understandingStatus==='needs_clarification'||reply.imageMatchStatus==='similar'||reply.imageMatchStatus==='exact';
            message=[keep?original.text:basic,researched.text,(en?'**Sources consulted:**\n':'**Nguồn tham khảo:**\n')+links,original.question||researched.question||defaultQuestion].filter(Boolean).join('\n\n');
        }else{
            const note=en?'Detailed information could not be verified on the web right now. Here is the basic catalogue information available.':'Hiện tại thông tin chi tiết về sản phẩm này chưa được cập nhật đầy đủ từ nguồn web xác minh; em xin gửi anh/chị thông tin cơ bản hiện có.';
            const keep=plan.mode==='shopping'||reply.localFallback||reply.understandingStatus==='needs_clarification'||reply.imageMatchStatus==='similar'||reply.imageMatchStatus==='exact';
            message=[note,keep?original.text:basic || (en?'No matching product profile is available.':'Em chưa có hồ sơ sản phẩm phù hợp để đối chiếu.'),original.question||defaultQuestion].filter(Boolean).join('\n\n');
        }
        return {...reply,message,text_response:message,googleSources:success?sources:[],googleSearchSuggestions:success?research.suggestions||'':'',webResearch:metadata,integrations:{...reply.integrations,googleSearch:success}};
    }
    function createResearchMiddleware({lookup,getConfiguration,getProducts,timeoutMs=3500}){
        return (req,res,next)=>{
            if(req.method!=='POST')return next();
            const send=res.json.bind(res);req.ocopWebResearch=true;
            const initial=planWebResearch(req.body?.messages,getProducts(),null,{hasImages:Boolean(req.body?.imageIds?.length || req.body?.imageData)});
            const run=async plan=>{
                let config;try{config=getConfiguration();}catch{}
                const attempted=Boolean(config?.apiKey),checkedAt=new Date().toISOString();
                if(!attempted)return {attempted:false,searched:false,status:'not_configured',checkedAt,sources:[],text:''};
                const budget=Math.max(1,Math.min(8000,Number(timeoutMs)||3500));
                const results=await Promise.all(plan.queries.map(async query=>{
                    const controller=new AbortController();let timer;
                    const deadline=new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve({status:'timeout'});},budget);});
                    try{return await Promise.race([Promise.resolve().then(()=>lookup(query,config,req.body?.language||'vi',{force:true,timeoutMs:budget,signal:controller.signal})).catch(()=>({status:'unavailable'})),deadline]);}
                    finally{clearTimeout(timer);}
                }));
                const valid=results.filter(result=>result.searched&&result.text&&result.sources?.length);
                const sources=[...new Map(valid.flatMap(result=>result.sources).map(source=>[source.url,source])).values()];
                return {attempted,searched:valid.length>0,status:valid.length?'success':results[0]?.status||'no_results',checkedAt,sources,text:valid.map(result=>result.text).join('\n\n'),suggestions:valid.find(result=>result.suggestions)?.suggestions||''};
            };
            res.json=async body=>{
                if(res.statusCode>=400 || !body?.message)return send(body);
                const plan=initial.required?initial:planWebResearch(req.body?.messages,getProducts(),body,{hasImages:Boolean(req.body?.imageIds?.length || req.body?.imageData)});
                if(!plan.required)return send(body);
                const research=await run(plan).catch(()=>({attempted:true,status:'unavailable'}));
                return send(applyWebResearch(body,research,plan,getProducts(),req.body?.language||'vi'));
            };
            next();
        };
    }
    const api={webResearchInstruction,planWebResearch,applyWebResearch,createResearchMiddleware};
    if(node)module.exports=api;else root.OCOPWebResearch=api;
})(typeof globalThis!=='undefined'?globalThis:this);
