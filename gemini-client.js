'use strict';
const MODEL_NAME = /^[a-zA-Z0-9._-]+$/;
async function generateContent(configuration, payload, options = {}) {
    const {fetcher = fetch, signal, timeoutMs = 45000, perAttemptMs = 15000,
        sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), now = Date.now, maxAttempts = 3} = options;
    if (!configuration.apiKey || typeof configuration.model !== 'string' || !MODEL_NAME.test(configuration.model)) throw new Error('Gemini configuration unavailable');
    // Every attempt uses the configured model, even if old configuration includes alternatives.
    const schedule = Array(Math.max(1, Math.min(3, maxAttempts))).fill(configuration.model);
    const deadline = now() + timeoutMs;
    let lastError, lastResponse, attempts = 0;
    for (const model of schedule) {
        if (signal?.aborted) throw signal.reason || new Error('Request cancelled');
        const remaining = deadline - now();
        if (remaining <= 0) break;
        const attemptSignal = AbortSignal.timeout(Math.max(1, Math.min(perAttemptMs, remaining)));
        try {
            attempts++;
            const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                method:'POST', headers:{'Content-Type':'application/json','x-goog-api-key':configuration.apiKey},
                body:JSON.stringify(/^gemini-2\.5-/.test(model)
                    ? {...payload,generationConfig:{...payload.generationConfig,thinkingConfig:{thinkingBudget:0}}}
                    : model==='gemini-flash-latest' || /^gemini-3[\w.-]*flash/.test(model)
                        ? {...payload,generationConfig:{...payload.generationConfig,thinkingConfig:payload.generationConfig?.thinkingConfig || {thinkingLevel:model==='gemini-flash-latest'?'low':'minimal'}}}
                        : payload), signal:signal ? AbortSignal.any([signal, attemptSignal]) : attemptSignal
            });
            // Consume the body under the same deadline, so a hanging stream cannot block retries.
            const data = await response.json().catch(() => ({}));
            lastResponse = {response, data, model, attempts};
            if (response.ok || ![429,500,502,503,504].includes(response.status)) return lastResponse;
            const retryAfter = Number(response.headers.get('retry-after'));
            const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : Math.min(4000, 500 * 2 ** (attempts - 1));
            if (attempts < schedule.length && delay < deadline - now()) await sleep(delay);
            else break;
        } catch (error) {
            if (signal?.aborted) throw signal.reason || error;
            lastError = error;
            if (attempts < schedule.length && 500 < deadline - now()) await sleep(500);
        }
    }
    if (lastResponse) return lastResponse;
    throw lastError || new Error('Gemini request timed out');
}
module.exports = {generateContent};
