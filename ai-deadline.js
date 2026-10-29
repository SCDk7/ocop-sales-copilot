'use strict';
function waitForSignal(promise, signal) {
    if (!signal) return promise;
    return new Promise((resolve, reject) => {
        const onAbort = () => { cleanup(); reject(signal.reason || new Error('AI deadline exceeded')); };
        const cleanup = () => signal.removeEventListener('abort', onAbort);
        // Always handle completion, including late rejection after cancellation.
        Promise.resolve(promise).then(value => { cleanup(); resolve(value); }, error => { cleanup(); reject(error); });
        if (signal.aborted) onAbort();
        else signal.addEventListener('abort', onAbort, { once:true });
    });
}
function createChatDeadline({timeoutMs=26000}={}){
    return (req,res,next)=>{
        if(req.method!=='POST')return next();
        const controller=new AbortController(),send=res.json.bind(res);
        req.aiDeadline=Date.now()+timeoutMs;req.aiSignal=controller.signal;
        let settled=false;
        res.json=body=>{if(settled||res.writableEnded)return res;return send(body);};
        const cleanup=()=>{settled=true;clearTimeout(timer);controller.abort(new Error('Chat request finished'));};
        const timer=setTimeout(()=>{
            if(settled||res.writableEnded)return;
            settled=true;controller.abort(new Error('Chat deadline exceeded'));
            const message=req.body?.language==='en'?'Dạ, processing is taking longer than expected. Please try again.':'Dạ, hệ thống đang xử lý lâu hơn dự kiến. Anh/chị thử lại giúp em ạ.';
            res.status(504);send({error:message,message,text_response:message,code:'CHAT_TIMEOUT',retryable:true,productIds:[]});
        },timeoutMs);
        res.once('finish',cleanup);res.once('close',cleanup);
        next();
    };
}
module.exports={waitForSignal,createChatDeadline};
