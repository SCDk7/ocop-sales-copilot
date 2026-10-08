Customer chat first uses Gemini to understand the conversation, retrieves relevant public Wikipedia excerpts, then asks Gemini to answer with catalogue facts and those excerpts. Product prices, review totals and combo contents remain verified by the server.

`GEMINI_MODEL` selects the primary model. Gemini retries use only that same model; old `GEMINI_FALLBACK_MODELS` settings are ignored. If Gemini fails and `OPENAI_API_KEY` is configured, the assistant uses OpenAI with the same Wikipedia context, conversation and verified catalogue. `OPENAI_MODEL` defaults to `gpt-4.1-mini`. Set these variables in the backend's private `.env` or its hosting environment; never put keys in `index.html`, `data.js` or GitHub.

OpenAI uses the [Responses API with Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) and `store: false`. The adapter preserves the same JSON reply/intent schema. Provider flags (`gemini`, `openai`, `intentGemini`, `intentOpenAI`) identify which service actually succeeded. The services have a shared bounded time budget. Gemini-hosted large files cannot be passed to OpenAI, so that image path can report a service error rather than silently omit the image.

When both configured services fail, `/api/ai/chat` returns HTTP 503 with `AI_TEMPORARILY_UNAVAILABLE`. The UI keeps the question and offers a retry button; it does not replace the AI answer with a local catalogue response. Without an OpenAI API key, Gemini continues to work and OpenAI is not called.

Wikipedia is queried for public product, price, combo and knowledge questions. Private account/order details and customer images are excluded. Sources are supplied to Gemini only when relevant; returned links and integration flags reflect actual retrieval. No relevant source is reported as unavailable rather than fabricated.

Run `npm.cmd test` to verify intent handling, grounded recommendations, retry behaviour, Wikipedia planning, persisted reviews and account isolation.
