'use strict';
function jsonSchema(schema) {
    const result={type:String(schema.type).toLowerCase()};
    if(schema.enum)result.enum=schema.enum;
    if(result.type==='object'){
        result.properties=Object.fromEntries(Object.entries(schema.properties||{}).map(([key,value])=>[key,jsonSchema(value)]));
        result.required=Object.keys(result.properties);result.additionalProperties=false;
    }
    if(schema.items)result.items=jsonSchema(schema.items);
    return result;
}
function openAIInput(contents) {
    return contents.map(message=>{
        const role=message.role==='model'?'assistant':'user';
        if(message.parts.some(part=>part.file_data))throw new Error('Gemini-hosted files cannot be sent to OpenAI');
        const images=message.parts.filter(part=>part.inline_data);
        if(!images.length)return {role,content:message.parts.map(part=>part.text||'').join('\n')};
        if(role!=='user')throw new Error('Unexpected image in assistant history');
        return {role,content:message.parts.flatMap(part=>part.text?[{type:'input_text',text:part.text}]:part.inline_data?[{type:'input_image',image_url:`data:${part.inline_data.mime_type};base64,${part.inline_data.data}`,detail:'auto'}]:[])};
    });
}
async function generateOpenAIContent(configuration,payload,options={}) {
    if(!configuration?.apiKey)throw new Error('OpenAI API key is not configured');
    const model=configuration.model||'gpt-4.1-mini';
    if(!/^[a-zA-Z0-9._-]+$/.test(model))throw new Error('Invalid OpenAI model');
    const {fetcher=fetch,signal,timeoutMs=20000}=options;
    const deadline=AbortSignal.timeout(Math.max(1,timeoutMs));
    const response=await fetcher('https://api.openai.com/v1/responses',{
        method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+configuration.apiKey},
        signal:signal?AbortSignal.any([signal,deadline]):deadline,
        body:JSON.stringify({model,store:false,instructions:(payload.system_instruction?.parts||[]).map(part=>part.text||'').join('\n'),
            input:openAIInput(payload.contents||[]),max_output_tokens:Math.max(1200,payload.generationConfig?.maxOutputTokens||0),
            text:{format:{type:'json_schema',name:'ocop_assistant',strict:true,schema:jsonSchema(payload.generationConfig.responseSchema)}}})
    });
    const body=await response.json();
    if(!response.ok)return {response,data:{error:{message:'OpenAI request failed ('+response.status+')'}},model,attempts:1,provider:'openai'};
    if(body.status!=='completed')throw new Error('OpenAI response is incomplete');
    const parts=(body.output||[]).filter(item=>item.type==='message').flatMap(item=>item.content||[]);
    if(parts.some(part=>part.type==='refusal'))throw new Error('OpenAI declined the request');
    const text=parts.filter(part=>part.type==='output_text').map(part=>part.text||'').join('');
    if(!text.trim())throw new Error('OpenAI response has no text');
    return {response,data:{candidates:[{content:{parts:[{text}]}}]},model,attempts:1,provider:'openai'};
}
module.exports={generateOpenAIContent,jsonSchema,openAIInput};
