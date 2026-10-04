# Customer account setup

Customer registration sends a six-digit OTP through Twilio SMS. The account is
created only after the OTP is verified. The server requires Node.js 18 or newer
and the following Twilio credentials:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER` (a Twilio phone number enabled for SMS)

In PowerShell, set the values in the same terminal used to start the server:

```powershell
$env:TWILIO_ACCOUNT_SID = "your-account-sid"
$env:TWILIO_AUTH_TOKEN = "your-auth-token"
$env:TWILIO_FROM_NUMBER = "+15005550006"
npm start
```

Replace the example sender number with a Twilio number from your account. Keep
the auth token private and do not commit it. Without all three variables, the
site still runs, but registration returns a clear SMS configuration error.

Verified customer records are stored in `.private-data/customers.json`, outside
the static website directory and excluded from Git. Passwords are stored as
salted scrypt hashes; pending OTPs expire after five minutes and have a limited
number of attempts. Protect this file as personal data, back it up securely, and
use a managed database with appropriate access controls for production. Since
customer login uses the full name as requested, each registered full name must
be unique.
