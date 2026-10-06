# Customer account setup

Customer registration sends a six-digit OTP through Twilio SMS. The account is
created only after the OTP is verified. The server requires Node.js 18 or newer
and the following Twilio credentials:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (a Twilio phone number enabled for SMS)

For automated setup on Windows, run this from PowerShell in the project folder:

```powershell
.\setup-twilio.ps1
```

The script securely prompts for your Account SID, Auth Token (input is hidden),
and SMS-capable Twilio sender number, saves them to `.env`, installs project
dependencies if needed, and starts the app. You must have Node.js 18 or newer
and a Twilio account with an SMS-enabled number. Twilio trial accounts may only
send messages to verified recipient numbers.

You can also copy `.env.example` to `.env` and edit it manually. Keep `.env` and
the auth token private; `.env` is excluded from Git. The server reads `.env` at
startup; values already set in the environment take precedence. Without all
three Twilio values, the site still runs, but registration returns a clear SMS
configuration error.

## Gemini AI shopping assistant

The chatbot uses Gemini through the Express server. Install Node.js 18 or newer,
open PowerShell in the project folder, and run
`powershell -ExecutionPolicy Bypass -File .\setup-gemini.ps1`. The script asks
for the Google AI Studio API key with hidden input, updates only
`GEMINI_API_KEY` in the ignored local `.env` file, installs dependencies if
needed, and starts the server. Never send the key in chat or add it to browser
code. `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`.

For general questions, the server also searches Vietnamese Wikipedia through
its MediaWiki API, passes a few short article introductions to Gemini, and
shows the related articles below the reply. Search is skipped for image
uploads, order/support requests, and messages containing likely contact or
account details. If Wikipedia is unavailable, Gemini still answers without
those excerpts. This uses the Wikipedia article search API; the homepage URL
is not itself a knowledge feed.

Customer messages and the product catalogue are sent to Google Gemini to
generate replies; customers are warned not to share passwords, OTPs, or payment
details. Without a Gemini key, the storefront uses its local catalogue advisor
for product suggestions and budget-based combos; open-ended Gemini replies and
visual image matching remain unavailable. Combo totals are calculated from
current catalogue prices and must not exceed the stated budget. For new
purchase requests, the assistant can suggest selected products and add them to
the cart only after the customer chooses to continue. The customer must review
the cart and complete checkout; the assistant does not place or confirm an
order, receive payment, reserve stock, or arrange delivery. For existing
order-specific or complaint cases, the assistant opens the existing admin
contact choices; it does not establish a live in-site chat or automatically
notify a human.

Voice search requires a supported browser, microphone permission, and HTTPS
(localhost is supported). Product image search sends a compressed image
(maximum 1 MB) to Gemini for visual matching; search images are not retained by
the app.

Customers can attach up to ten JPEG, PNG, WebP, HEIC, or HEIF images per
message (100 MB each) by selecting multiple files, pasting with
Ctrl+V, or dragging them into the chat. Images are uploaded individually and
saved in the private `.private-data/chat-images` directory, are
available to staff at `/admin/recordings`, and are sent to Gemini when image
analysis is available. To handle image batches larger than 70 MB, the server
uses Gemini's Files API; those provider-side copies are automatically removed
after 48 hours. Staff access uses `AUDIO_ADMIN_PASSWORD` (at least 24
characters); staff can view and permanently delete saved images. Configure this
password before collecting customer images. Keep the private data directory
secure and back it up only to protected storage.

For local use, run `npm start` to start the API. You can open the site from the
server at `http://localhost:3000`. The storefront sends its current product
catalogue to the API when it opens and refreshes that AI context every 10
minutes while the page remains open. Each chat request also includes the
current catalogue. The catalogue itself is maintained in the website source;
publish changes and reload the page for them to be picked up. The local server must remain running, but the site does not need to be
published on the internet.

Verified customer records are stored in `.private-data/customers.json`, outside
the static website directory and excluded from Git. Passwords are stored as
salted scrypt hashes; pending OTPs expire after five minutes and have a limited
number of attempts. Protect this file as personal data, back it up securely, and
use a managed database with appropriate access controls for production. Since
customer login uses the full name as requested, each registered full name must
be unique.

## GitHub Pages and public API hosting

GitHub Pages serves only the static storefront; it does not run `server.js`.
For a Pages deployment, host this Node server separately over HTTPS, set the
`AI_CORS_ORIGINS` environment variable on that server to the exact storefront
origin (for example, `https://scdk7.github.io`), and set the
`ocop-api-base` meta tag in `index.html` to the backend origin (for example,
`https://your-api.example.com`). Do not include a path in the backend URL.
Keep Gemini and other secrets in the backend host's environment settings.

Chat text recommendations have a local catalogue fallback if the API is
unavailable. Image uploads and Gemini replies require the separately hosted
API. The server stores customer records and uploaded images on disk, so a
production host must provide persistent private storage and HTTPS; ephemeral
server filesystems will lose that data after a restart or redeploy.
