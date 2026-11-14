'use strict';
const {jsonSchema} = require('./openai-client');
function claudeMessages(contents) {
    return contents.map(message=>({role:message.role==='model'?'assistant':'user',content:message.parts.map(part=>{
        if(part.text)return {type:'text',text:part.text};
        if(part.inline_data)return {type:'image',source:{type:'base64',media_type:part.inline_data.mime_type,data:part.inline_data.data}};
        throw new Error('Gemini-hosted files cannot be sent to Claude');
    })}));
}
async function generateClaudeContent(configuration,payload,options={}) {
    if(!configuration?.apiKey)throw new Error('Claude API key is not configured');
    const model=configuration.model||'claude-sonnet-4-6';
    if(!/^[a-zA-Z0-9._-]+$/.test(model))throw new Error('Invalid Claude model');
    const {fetcher=fetch,signal,timeoutMs=20000}=options;
    const timeout=AbortSignal.timeout(Math.max(1,timeoutMs));
    const response=await fetcher('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'content-type':'application/json','x-api-key':configuration.apiKey,'anthropic-version':'2023-06-01'},
        signal:signal?AbortSignal.any([signal,timeout]):timeout,
        body:JSON.stringify({model,max_tokens:Math.max(1200,payload.generationConfig?.maxOutputTokens||0),
            system:(payload.system_instruction?.parts||[]).map(part=>part.text||'').join('\n'),
            messages:claudeMessages(payload.contents||[]),
            output_config:{format:{type:'json_schema',schema:jsonSchema(payload.generationConfig.responseSchema)}}})
    });
    const body=await response.json();
    if(!response.ok)return {response,data:{error:{message:'Claude request failed ('+response.status+')'}},model,attempts:1,provider:'claude'};
    if(body.stop_reason!=='end_turn')throw new Error('Claude response is incomplete or refused');
    const text=(body.content||[]).filter(part=>part.type==='text').map(part=>part.text||'').join('');
    if(!text.trim())throw new Error('Claude response has no text');
    return {response,data:{candidates:[{content:{parts:[{text}]}}]},model,attempts:1,provider:'claude'};
}
module.exports={generateClaudeContent,claudeMessages};
