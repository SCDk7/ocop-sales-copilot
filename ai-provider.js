'use strict';
const {generateContent}=require('./gemini-client');
const {generateOpenAIContent}=require('./openai-client');
const {generateClaudeContent}=require('./claude-client');
function structuredAnswer(result,payload){
    if(!result?.response?.ok)return false;
    try{
        const answer=JSON.parse(result.data.candidates[0].content.parts.map(part=>part.text||'').join(''));
        const schema=payload.generationConfig?.responseSchema;
        return !schema || (schema.required||[]).every(key=>Object.hasOwn(answer,key));
    }catch{return false;}
}
async function generatePreferredContent(configuration,payload,options={}){
    const providers=[
        {name:'gemini',config:configuration,generate:generateContent},
        {name:'openai',config:configuration.openai,generate:generateOpenAIContent},
        {name:'claude',config:configuration.claude,generate:generateClaudeContent}
    ].filter(provider=>provider.config?.apiKey);
    if(!providers.length)throw new Error('AI configuration unavailable');
    const timeout=AbortSignal.timeout(Math.max(1,options.timeoutMs||20000));
    const signal=options.signal?AbortSignal.any([options.signal,timeout]):timeout;
    const attemptedProviders=[],successes=[];
    async function attempt(provider){
        attemptedProviders.push(provider.name);
        const operation=provider.generate(provider.config,payload,{...options,signal,maxAttempts:1});
        let onAbort;
        try{
            const result=await Promise.race([operation,new Promise((_,reject)=>{
                onAbort=()=>reject(signal.reason||new Error('AI deadline exceeded'));
                if(signal.aborted)onAbort();else signal.addEventListener('abort',onAbort,{once:true});
            })]);
            if(!structuredAnswer(result,payload))throw new Error('Invalid structured '+provider.name+' response');
            return {...result,provider:provider.name};
        }finally{if(onAbort)signal.removeEventListener('abort',onAbort);}
    }
    if(configuration.mode==='fallback'){
        for(const provider of providers){try{successes.push(await attempt(provider));break;}catch{if(signal.aborted)break;}}
    }else{
        const results=await Promise.allSettled(providers.map(attempt));
        for(const result of results)if(result.status==='fulfilled')successes.push(result.value);
    }
    if(!successes.length){
        return {response:{ok:false,status:503},data:{error:{message:'No configured AI service returned a valid answer'}},provider:'unavailable',attemptedProviders,providersUsed:[]};
    }
    // Prefer answers whose interpreted scope and product IDs agree with other models.
    const signature=result=>{
        const answer=JSON.parse(result.data.candidates[0].content.parts.map(part=>part.text||'').join(''));
        return JSON.stringify([answer.exactRegion||'',answer.categoryOrKeyword||'',(answer.replyProductIds||answer.productIds||[]).slice().sort((a,b)=>a-b)]);
    };
    const votes=new Map();for(const result of successes){const key=signature(result);votes.set(key,(votes.get(key)||0)+1);}
    const selected=successes.slice().sort((a,b)=>votes.get(signature(b))-votes.get(signature(a)))[0];
    return {...selected,providersUsed:successes.map(result=>result.provider),attemptedProviders,strategy:configuration.mode==='fallback'?'fallback':'ensemble'};
}
module.exports={generatePreferredContent,structuredAnswer};
