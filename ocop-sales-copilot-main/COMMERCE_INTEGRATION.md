# Commerce shopping workflows for the OCOP chatbot

`commerce-shopping.js` loads the actual shopping workflow documents from the user-added `commerce-agents-main/shopping-agent/skills/` directory. The source repository is Anthropic's Apache-2.0 reference; its license remains in `commerce-agents-main/LICENSE`.

This is a Node adapter over the reference workflows, not a running Python/Claude SDK service. It does not load the fictional ACME catalogue or the merchant analytics agent. No new Python process, demo storefront or paid service is installed.

## Request path

1. `data.js` and the shop knowledge base supply product facts and tea FAQ. Exact factual questions can be answered locally.
2. The adapter chooses search/discovery, purchase research, gift planning, customer care or conversation preferences. It reads product records and, when requested, seller inventory. Missing stock remains unknown.
3. Both configured Gemini and OpenAI services receive the same selected workflows and read-only records through the existing JSON response pipeline. Ensemble mode tries both and uses valid responses; a failed service is never reported as having answered.
4. The existing Wikipedia lookup supplies relevant cultural background and source URLs. It excludes private order/contact details. Wikipedia never overrides shop prices, certification, inventory or shipping terms.
5. Cart and checkout continue through the website controls and explicit draft confirmation. The adapter does not charge customers, approve refunds, change seller prices or invent private order history. Preferences stay within the supplied conversation; no cross-session memory is claimed.

The deployment rules follow the workflow text and take precedence where the reference assumes tools this storefront does not expose.

## Configuration and diagnostics

Use `GEMINI_API_KEY`, `OPENAI_API_KEY`, their existing model variables, and `AI_PROVIDER_MODE=ensemble` in `.env`. Credentials stay server-side.

`GET /api/ai/commerce` reports whether all five workflows loaded and which services have credentials configured. `connectionStatus: not_probed` explicitly means credentials were not verified by that endpoint. Chat replies include `commerceAgent` metadata; their `integrations` flags still describe the actual sources used for that reply.

At the last live credential checks in this session, Gemini returned `401 ACCESS_TOKEN_TYPE_UNSUPPORTED` and OpenAI returned `429 credit_balance_exhausted`. The configuration and integration cannot resolve account authorization or balance restrictions. Catalogue/FAQ replies continue to work while external generation is unavailable.

## Validation

`node --test commerce-shopping.test.js multi-ai.test.js product-training.test.js ai-grounding.test.js`

Tests cover real workflow loading, scope and price constraints, unknown inventory, missing-source fallback, shared prompts for mocked Gemini/OpenAI responses, and truthful failure reporting. These tests do not claim successful live paid model calls.

OpenAI output schema reference: https://developers.openai.com/api/docs/guides/structured-outputs
