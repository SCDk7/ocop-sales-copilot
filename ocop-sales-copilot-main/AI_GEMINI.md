Customer chat uses Gemini only. Text chat understands the conversation and writes its answer in one structured Gemini request, using the server catalogue and relevant public Wikipedia excerpts. Product IDs, prices, real reviews and combo totals are verified by the server. Image chat retains its separate recognition flow.

Set GEMINI_API_KEY in the private backend .env or hosting environment. GEMINI_MODEL defaults to gemini-3.1-flash-lite with minimal thinking. Understanding and answering use the same configured model. Never put keys in frontend files or GitHub. Existing hosting environment overrides must be updated separately.

Text chat has a shared five-second deadline, including a maximum one-second wait for Wikipedia and a single Gemini attempt. A slow knowledge lookup continues to populate its cache but cannot hold up the current reply. Image requests retain their longer timeout and retries on the configured model. Legacy GEMINI_FALLBACK_MODELS, OPENAI_API_KEY and OPENAI_MODEL settings do not enable fallback. If Gemini fails or the deadline expires, customer chat returns HTTP 503 with a retry option. No other provider or offline answer is substituted. This deadline bounds waiting; it does not guarantee Google will successfully answer every request in five seconds.

Wikipedia supplies cultural context when relevant sources exist. Shop claims must come from verified shop data. Private account/order details and images are not sent to Wikipedia. Similar images do not establish identity, origin or quality.

Run npm.cmd test and restart the backend after changing .env. GitHub Pages requires a separate HTTPS backend. Updating a local .env does not configure the deployed host.
