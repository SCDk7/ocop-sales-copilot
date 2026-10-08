'use strict';
const {generateContent}=require('./gemini-client');
const {generateOpenAIContent}=require('./openai-client');
function structuredAnswer(result,payload){
    if(!result?.response?.ok)return false;
    try{
        const answer=JSON.parse(result.data.candidates[0].content.parts.map(part=>part.text||'').join(''));
        const schema=payload.generationConfig?.responseSchema;
        return !schema || (schema.required||[]).every(key=>Object.hasOwn(answer,key));
    }catch{return false;}
}
async function generatePreferredContent(configuration,payload,options={}){
    const budget=options.timeoutMs||45000,start=Date.now(),hasOpenAI=Boolean(configuration.openai?.apiKey);
    let gemini,geminiError;
    try{
        gemini=await generateContent(configuration,payload,{...options,timeoutMs:hasOpenAI?Math.max(5000,budget-16000):budget});
        if(structuredAnswer(gemini,payload))return {...gemini,provider:'gemini'};
        // Never use another provider to bypass a safety block.
        if(gemini.data?.promptFeedback?.blockReason || gemini.data?.candidates?.some(candidate=>candidate.finishReason==='SAFETY'))return {...gemini,provider:'gemini'};
    }catch(error){geminiError=error;}
    if(options.signal?.aborted)throw options.signal.reason||geminiError;
    if(!hasOpenAI){if(gemini)return {...gemini,provider:'gemini'};throw geminiError||new Error('AI unavailable');}
    const remaining=budget-(Date.now()-start);
    if(remaining<=0)throw new Error('AI request timed out');
    const openai=await generateOpenAIContent(configuration.openai,payload,{...options,timeoutMs:remaining});
    if(!structuredAnswer(openai,payload))throw new Error('OpenAI did not return a valid structured answer');
    return {...openai,geminiAttempts:gemini?.attempts||0};
}
module.exports={generatePreferredContent,structuredAnswer};
