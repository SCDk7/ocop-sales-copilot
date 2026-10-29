# QR payments

`checkout-payment.js` renders the shared bank payment panel in `draft-order.html`, `index.html` and `index_2.html`. BIDV now uses a real VietQR transfer image from Casso's documented `https://img.vietqr.io/image/...-qr_only.svg` endpoint. This is not a direct NAPAS API integration. It does not verify the beneficiary name against the bank or confirm receipt of funds.

- Default displayed beneficiary: BIDV, BIN 970418, account 8808661371, Hoang Nguyen Thanh Binh.
- Recipient details are configured in `recipientDefaults` in `checkout-payment.js`. The checkout has no recipient editor and does not read previous browser recipient overrides.
- An unscanned session expires after 120 seconds and is replaced with a new QR and session ID. Old session IDs cannot be scanned or confirmed in the demo state machine.
- The bank panel shows a large QR, amount, transfer reference, bank, beneficiary and account, plus download/share and close/reopen controls. Preview amounts are labelled as estimates. Confirmed, unpaid orders use the server-returned final total.
- Every 120 seconds, the displayed QR gets a new reference suffix. The timer is explicitly a display refresh timer. Previously saved bank QR images may still be payable; this is **not bank-enforced transaction expiry**.
- Downloads fetch the displayed image without credentials. Sharing uses the system share sheet when supported, with clipboard fallback. Browser permission or network failures show an inline message. Only bank/account/amount/reference information is sent to the image provider, never customer identity, address or session tokens.
- Page reload generates a new displayed reference. No scan or success is fabricated. Bank receipt remains awaiting separate confirmation; delivery completion remains independent.
- MoMo retains a clearly labelled demo QR and COD requires no QR. The old internal demo state machine remains exported for compatibility/tests but is not the bank payment workflow.

For automatic payment reconciliation and enforceable expiry, add a bank/payment-provider integration with server-owned sessions, authenticated callbacks, replay protection and reconciliation against expected beneficiary/amount/reference. A standard bank QR scan does not notify this website and does not prove funds were received. Rotating browser references alone are not authoritative order reconciliation identifiers.

Provider documentation: https://www.vietqr.io/qr-dong (checked 2026-10-29). For a formal production deployment, the provider currently requires a merchant's own template derived from its base themes; provision that template before relying on this public template as the production payment service.

Verify with `node --test checkout-payment.test.js draft-order.test.js`.
