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

The chatbot uses Gemini through the Express server. Copy `.env.example` to
`.env`, set `GEMINI_API_KEY` to a key from Google AI Studio, and restart the
server. `GEMINI_MODEL` is optional and defaults to `gemini-2.5-flash`. The key
stays on the server and must never be added to browser code. Without a key, the
chatbot reports that the AI is not configured and offers the existing admin
contacts. Customer messages and the product catalogue are sent to Google
Gemini to generate replies; customers are warned not to share passwords, OTPs,
or payment details. For order-specific or complaint cases, the assistant opens
the existing admin contact choices; it does not establish a live in-site chat
or automatically notify a human.

Verified customer records are stored in `.private-data/customers.json`, outside
the static website directory and excluded from Git. Passwords are stored as
salted scrypt hashes; pending OTPs expire after five minutes and have a limited
number of attempts. Protect this file as personal data, back it up securely, and
use a managed database with appropriate access controls for production. Since
customer login uses the full name as requested, each registered full name must
be unique.
