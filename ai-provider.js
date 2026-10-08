'use strict';
const {generateContent}=require('./gemini-client');
function structuredAnswer(result,payload){
    if(!result?.response?.ok)return false;
    try{
        const answer=JSON.parse(result.data.candidates[0].content.parts.map(part=>part.text||'').join(''));
        const schema=payload.generationConfig?.responseSchema;
        return !schema || (schema.required||[]).every(key=>Object.hasOwn(answer,key));
    }catch{return false;}
}
async function generatePreferredContent(configuration,payload,options={}){
    // Customer answers and semantic interpretation must always come from Gemini.
    // Failures stay failures, even if a legacy OpenAI key is still configured.
    const result=await generateContent(configuration,payload,options);
    return {...result,provider:'gemini'};
}
module.exports={generatePreferredContent,structuredAnswer};
