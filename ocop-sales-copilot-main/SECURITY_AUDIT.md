# Security audit and implemented changes

Current guest-image exception (29/10/2026): visitors may create a one-hour signed, temporary image session without login, upload images and ask about those image IDs. Image ownership is bound to the signed guest identity. Guest tokens cannot access account/order/admin/audio routes or text-only model chat. All guest routes retain shared per-IP/per-session quotas, concurrency limits, payload validation and the global AI kill switch. Signed-in accounts still use the per-user AI flag; browser guest tokens are only sent to the trusted backend and are never customer login credentials.

Scope: storefront (`index.html`, `index_2.html`), Express backend (`server.js`), AI provider adapters, account/order/media stores, and the KPI service. Changes are local; no production deployment or live data migration was performed.

## Actual architecture and findings

There is no Supabase, SQL database, ORM, or SQL table schema in this application. Private state is stored in JSON files under `.private-data` (or `PRIVATE_DATA_DIR`). SQL `ENABLE ROW LEVEL SECURITY` statements would have no effect here. Authorization is enforced at the HTTP boundary and by owner-filtered store methods instead.

| Area | Finding | Fix |
| --- | --- | --- |
| Rate limiting | Ad hoc IP counters covered some AI handlers; no common API threshold, no account quota, inconsistent headers. | `api-security.js` installs `express-rate-limit` before parsing bodies, provider calls or web research. API: 120/min/IP; AI: 20/min/IP **and** 15/min/account, shared across chat aliases, translation, transcription, audio, search and uploads. Authentication: 10/15 min/IP, in addition to existing failed-login/OTP controls. 429 JSON includes a code and `Retry-After`; IPv6 uses the library's subnet handling. |
| Provider transport | OpenAI/Claude adapters were already server-side. Both HTML pages retained a direct Gemini function with an **empty** browser key slot, and `AI tot hon.js` accepted a browser key. No configured provider key was found in those browser paths. | Removed browser provider URLs/key slots, replaced legacy calls with authenticated backend transport. Provider credentials continue to come exclusively from backend environment variables. |
| Session authority | `account-client.js` deliberately erased the server token and used offline demo state. | Restored real backend login/OTP registration/session checks/logout. Customer login no longer accepts demo admin/NPP passwords. Server sessions use random bearer tokens stored hashed on disk. Local role/profile values are display caches only. Password changes verify the old password server-side and revoke all account sessions. |
| Owner isolation | Account state/order routes already used server-derived customer IDs. Chat images were looked up globally by image ID. Draft tracking used transferable receipt capabilities, with global idempotency keys. Consultation IDs were supplied by clients. | Preserve existing account scoping, reject unsafe account map keys, bind images/audio metadata to the authenticated owner, scope order deduplication by owner, and require the owner's session for order reads/receipt confirmation. Scope consultation IDs with the authenticated account ID. Reviews use server-derived author/owner and owner-scoped deduplication; published reviews remain intentionally public. |
| AI control | No persistent per-user operational control existed. | `ai-access-store.js` adds a versioned per-account `ai_enabled` policy outside client-editable profile state. Every AI request rereads it before body parsing or provider work. Disabled accounts receive 403 `AI_DISABLED`; corrupt/unreadable policies fail closed. `/api/auth/me` reports the policy on the user object. |
| Related exposure | Project root was served statically, including backend modules/dependencies/operator code; KPI writes used a published fallback secret; sync forwarding routes were public; arbitrary browser origins were reflected. | Allow only explicitly referenced public assets/public image folders; keep backend/private/dependency paths off HTTP. Remove the fallback sync secret, require admin sessions for sync forwarding/catalogue mutation, and check exact browser origins. KPI sync is disabled until an operator supplies a secret. |

`server.js` contains API routing and authentication. `account-store.js` contains persisted sessions, carts, conversation history and account orders. `sales-store.js` contains authoritative draft orders/inventory; `ownedOrder` and `confirmOwnedReceipt` enforce ownership. `product-reviews.js` stores intentionally published reviews. Uploaded support images/audio remain private and accessible only to their owner in chat or authenticated staff through the existing admin routes. `sales-conversations.js` and `ai-metrics.js` store staff telemetry; the metrics endpoint requires an admin session or the separately configured service token.

## Backend validation

The API rejects provider keys, model overrides, tool declarations, system/developer roles, client owner IDs and unrecognized AI envelope fields. It bounds message counts/lengths, removes control characters, validates language and media, and ignores client catalogues in favor of the server catalogue. A client cannot make the model create an order by sending `confirmedDraft`; use the authenticated, explicit checkout route. Prompt injection cannot grant database privileges: authorization and order confirmation are backend checks, independent of model output.

JSON body limits remain route-specific; support image uploads are capped at 10 MB. Authentication and AI limiting happen before those bodies are parsed. `express-rate-limit` is application-level abuse protection, not a substitute for upstream network DDoS protection.

## Instantly disable or re-enable one account

On the backend host, using its actual data directory/environment:

```powershell
node scripts/set-ai-access.cjs CUSTOMER_ID disable
node scripts/set-ai-access.cjs CUSTOMER_ID enable
```

The CLI verifies that the customer exists. No server restart is required. The store also exports:

```js
const {createAIAccessStore} = require('./ai-access-store');
const access = createAIAccessStore(process.env.AI_ACCESS_FILE || '.private-data/ai-access.json');
access.set(customerId, false, 'operator');
```

Authenticated staff may instead log in at `/admin`, then send:

```http
PATCH /api/admin/users/CUSTOMER_ID/ai-access
Content-Type: application/json
Cookie: <server-issued HttpOnly admin session cookie>

{"ai_enabled": false}
```

GET on the same route returns the current policy. Customer bearer sessions, browser `isAdmin` fields, and ordinary profile updates cannot change it. Policy changes apply to the **next request**, not retroactively to already running provider work. Set `AI_ENABLED=false` as an additional global stop at process startup.

## Deployment and migration requirements

- This repository's JSON stores and default rate-limit stores support **one Node process / one service instance**. Keep `.private-data` on a persistent disk; ephemeral Render storage loses users, sessions, orders and bans on replacement. Do not use multiple workers/replicas with these local stores. Horizontal scaling requires migrating both account/ownership/policy state to shared transactional storage and rate limits to a shared store such as Redis. This audit does not pretend that JSON files provide database-engine RLS.
- Configure provider secrets only on the backend. Configure a unique `AUDIO_ADMIN_PASSWORD` of at least 24 characters. Configure a new random `OCOP_KPI_SYNC_TOKEN` on both services before re-enabling KPI sync; the previous built-in fallback was public and must not be reused.
- `TRUST_PROXY` defaults to off. Behind Render or another ingress, verify the actual trusted proxy path and configure its CIDRs or hop count; never use `true`. Otherwise all clients behind the ingress may share one IP quota. The ingress must strip/replace untrusted forwarding headers. See [Express proxy guidance](https://expressjs.com/en/guide/behind-proxies.html) and [express-rate-limit proxy guidance](https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues).
- Set `AUTH_FRONTEND_URL`, `AI_CORS_ORIGINS` and `RENDER_EXTERNAL_URL` to exact trusted browser origins. The existing GitHub Pages origin `https://scdk7.github.io` is allowed. `file://`/`Origin: null` requests are denied.
- Existing demo identities/passwords in browser storage are **not migrated into real accounts**. Use backend SMS-verified registration or verified OAuth. Frontend admin/NPP demonstrations do not authorize staff APIs; real staff access uses the backend admin session.
- Historical support media and draft orders without an owner are not automatically claimed by matching a user-supplied name/phone/ID. They remain available to authenticated staff; their old receipt URLs no longer authorize customer access. Any ownership migration must be reviewed by an operator against trusted records.
- Browser state is still a convenience cache, not a trusted source of permissions, order success, payment verification or AI entitlement. The existing bearer-token client requires normal XSS defenses; an HttpOnly same-site customer-session migration would require redesigning cross-origin GitHub Pages hosting and is outside these four fixes.

## Running the local demonstration

Run `npm run dev`, then open `http://localhost:3000` or your Live Server/file preview. This explicit development command seeds hashed sample accounts in `.private-data/local-demo` and binds the backend to `127.0.0.1`. Sample credentials include `khachhang / 123456`, `admin / 000000`, the four named admin samples, and `nppdemo / NppDemo@2026`. Re-running the command preserves existing demo passwords and state. The CLI refuses production/Render, and normal `npm start` neither seeds nor accepts demo records, including copied demo sessions.

In this loopback-only mode, CORS permits local preview origins and `Origin: null` for `file://`. That exception is disabled in normal and production mode. Backend quotas, owner isolation and per-user AI policies continue to apply to demo sessions. The displayed admin/distributor role comes from the backend demo record; staff data APIs still require the separate HttpOnly staff session. The demo launcher does not populate or overwrite the real customer store.

## Verification

`npm test` runs the existing application suites plus the security suites. `npm run test:security` specifically tests quotas/aliases/forwarded-header spoofing, invalid credentials, input rejection, dynamic flags, account-state isolation, draft/media ownership and safe static routing. `security-server.test.js` launches an isolated real backend with temporary data and no provider credentials; it does not touch production records or call paid providers.

Dependency audit: compatible production patches were applied to body-parser, qs and Nodemailer. The pre-existing `xlsx` development dependency has advisories without an npm fix; see the final audit output. It is not served or loaded by the storefront/backend runtime and requires a separate tool migration before using spreadsheet-import scripts with untrusted files.
