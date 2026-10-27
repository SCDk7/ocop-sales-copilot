'use strict';
function getAIConfiguration(env = process.env) {
    const key = value => value && !/^(replace_|your_|changeme)/i.test(value.trim()) ? value.trim() : '';
    const config = {
        apiKey:key(env.GEMINI_API_KEY),model:env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
        openai:{apiKey:key(env.OPENAI_API_KEY),model:env.OPENAI_MODEL || 'gpt-4.1-mini'},
        claude:{apiKey:key(env.ANTHROPIC_API_KEY || env.CLAUDE_API_KEY),model:env.CLAUDE_MODEL || 'claude-sonnet-4-6'},
        mode:env.AI_PROVIDER_MODE === 'fallback' ? 'fallback' : 'ensemble'
    };
    for(const model of [config.model,config.openai.model,config.claude.model]) if(!/^[a-zA-Z0-9._-]+$/.test(model)) throw new Error('Invalid AI model configuration');
    if(!config.apiKey&&!config.openai.apiKey&&!config.claude.apiKey) {
        const error=new Error('AI services are not configured');error.status=503;throw error;
    }
    return config;
}
module.exports={getAIConfiguration};
