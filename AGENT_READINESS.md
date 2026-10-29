# Agent readiness — local review

These changes are **local only** until the owner requests publication. They do
not change the live Render website or submit it to an external audit service.

## Preview

- Homepage: <http://localhost:3000/>
- About: <http://localhost:3000/about>
- Contact: <http://localhost:3000/contact>
- Privacy technical draft: <http://localhost:3000/privacy>
- Order-process information: <http://localhost:3000/terms>
- Readable catalogue: <http://localhost:3000/catalog>
- Agent guide: <http://localhost:3000/llms.txt>
- Markdown homepage: <http://localhost:3000/index.md>
- Sitemap: <http://localhost:3000/sitemap.xml>
- Social preview image: <http://localhost:3000/assets/ocop-social-card.png>

Run `npm run build:site-information` after editing the shared content/config,
then start the backend with `npm run dev` for isolated local demo accounts, or
`npm start` for the configured backend. `npm start` rebuilds these files before
loading the server. The existing authentication, cart, chatbot and checkout
routes retain their behavior. Only recognized product/cart routes use the SPA
fallback; genuinely missing URLs return 404 instead of the app shell.

## Audit mapping

| Requested improvement | Implemented behavior / remaining work |
| --- | --- |
| Readable content without JavaScript | Both raw homepages have a semantic H1 and a no-script overview exceeding 500 characters. `/catalog` and information pages are rendered HTML with no JavaScript dependency. |
| Agent-friendly 404s | Missing paths and unshipped assets keep status 404; Markdown requests receive a Markdown error linking to llms.txt and sitemap. Private route authentication stays in place. |
| Markdown negotiation | `/`, `/index.html`, `/index_2.html` and all information pages honor Accept quality values, return actual Markdown when selected, merge `Vary: Accept`, and return 406 for unsupported representations. Wildcards prefer HTML. |
| Brand discoverability | Title, description, canonical, headings and structured data identify OCOP Sales and its Vietnamese agricultural-products purpose. Search indexing and a top-10 brand ranking cannot be guaranteed from local code changes. |
| JSON-LD | WebSite, WebApplication and Organization project identity are included in raw HTML. No fabricated reviews, awards, prices, company credentials or social profiles are asserted. |
| Agent instructions | `/llms.txt` follows the published heading/file-list format, explains when to use the catalogue, and links to public data, support, privacy and ordering limits. |
| Sitemap | `/sitemap.xml` contains the six public canonical information URLs with modification dates; authenticated workflows and admin/API routes are excluded. |
| Organization completeness | The owner confirmed the existing hotline/address are sample data. Organization contactPoint links to `/contact`; telephone, email and PostalAddress are deliberately omitted until verified details are provided. This audit item remains incomplete. |
| Trust pages | About, Contact and Privacy each contain more than 500 characters of actual HTML prose. Privacy/transaction texts are technical drafts for owner review, not an invented legal policy or a claim of regulatory approval. |
| Metadata | Both homepages include canonical, Vietnamese language, og:type, og:image, an actual 1200×630 PNG social image, Markdown discovery links and JSON-LD. |

## Direct verification

On Windows use `curl.exe` to avoid PowerShell's `curl` alias. These commands
verify both the response headers and the response body, not status alone:

```powershell
curl.exe -i -H "Accept: text/markdown" http://localhost:3000/
curl.exe -i -H "Accept: text/html" http://localhost:3000/
curl.exe -i -H "Accept: text/markdown" http://localhost:3000/__audit_missing_page
curl.exe -i http://localhost:3000/llms.txt
curl.exe -i http://localhost:3000/sitemap.xml
```

Expected: 200 + `text/markdown` + `Vary: Accept` for the first request; 200 +
`text/html` for the second; 404 + `text/markdown` with explanatory links for the
third. Existing CORS `Vary: Origin` is retained. HEAD requests have the matching
representation headers and no response body.

`site-information.test.js` checks negotiation, quality values, wildcard/default
selection, 406s, HEAD, 404s, static-file protection, live catalogue prices,
all public information routes/aliases, raw homepage content, contact omissions,
JSON-LD, llms format, sitemap dates/URLs, social-image dimensions, escaping and
repeatable builds. The actual server is also exercised by the HTTP security
integration test. `npm test` includes these tests.

## Decisions required before publication

1. Supply the real operator name, contact channel and postal address. The current
   config intentionally has `contact.verified: false`. Do not replace missing
   details with government contact information or sample phone/address data.
2. Review the technical privacy and transaction drafts, including external AI
   providers, retention periods and the contact process for data requests.
3. Review old marketing/legal claims elsewhere in the existing interface. This
   addition does not validate those claims or certify products independently.
4. Confirm the canonical domain if a custom domain will replace the Render URL.
   Rebuild static pages after changing `site.config.json`.
5. After an approved deployment, rerun the public audit and configure search
   indexing/site ownership as appropriate. No new audit score or search ranking
   is claimed here.

GitHub Pages can serve the generated HTML and `.md` files, but static hosting
cannot execute Express content negotiation. The Accept-based responses and
custom Markdown errors require the Node backend on Render (or equivalent).

Protocol references:
The local information pages support Vietnamese, English, Chinese, Korean and
Japanese. The storefront, information pages and checkout share the language
preference through `ocop-language` browser storage, a preference cookie and
language-aware links. Original product names, identifiers and place names remain
catalogue data. These changes have not been published to GitHub or Render.

[llms.txt](https://llmstxt.org/),
[Markdown negotiation](https://acceptmarkdown.com/),
[Sitemap XML](https://www.sitemaps.org/protocol.html),
[Organization JSON-LD](https://schema.org/Organization).
