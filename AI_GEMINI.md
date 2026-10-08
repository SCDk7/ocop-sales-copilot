Customer chat uses Gemini only. Gemini understands the conversation, then answers from the server catalogue and relevant public Wikipedia excerpts. Product IDs, prices, real reviews and combo totals are verified by the server.

Set GEMINI_API_KEY in the private backend .env or hosting environment. GEMINI_MODEL defaults to gemini-flash-latest. Understanding and answering use the same configured model. Never put keys in frontend files or GitHub.

Retries use only the configured Gemini model. Legacy GEMINI_FALLBACK_MODELS, OPENAI_API_KEY and OPENAI_MODEL settings do not enable fallback. If Gemini understanding or answering fails, customer chat returns HTTP 503 with a retry option. No other provider or offline answer is substituted.

Wikipedia supplies cultural context when relevant sources exist. Shop claims must come from verified shop data. Private account/order details and images are not sent to Wikipedia. Similar images do not establish identity, origin or quality.

Run npm.cmd test and restart the backend after changing .env. GitHub Pages requires a separate HTTPS backend. Updating a local .env does not configure the deployed host.
