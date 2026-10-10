# Separate OCOP KPI website

Run from the main repository with `npm.cmd run start:kpi`, or run `npm.cmd start`
from this folder. Local address: http://localhost:3002

The OCOP shop remains at http://localhost:3000. This website contains only the KPI
dashboard, with no links back to the shop or seller tools.
It reads aggregate backend metrics through a server-side proxy and stores no shop
accounts, orders or API keys.

Configuration:

- `KPI_PORT`: dashboard port (default 3002).
- `OCOP_METRICS_URL`: full backend metrics URL
  (default http://localhost:3000/api/ai/metrics).

Keep the backend running for live statistics. If it is unreachable, the dashboard
reports a connection problem and flags displayed data as stale.

The dashboard offers today, 7-day, 30-day and retained-history filters (UTC+7),
8 KPI cards, hourly request and product distribution charts, and CSV export.
Charts use native SVG, without a CDN or additional chart dependency.
Backend telemetry persists up to 90 days / 50,000 events. Configure `AI_METRICS_FILE`
on persistent storage for production. Tracking starts with this upgrade; historical
orders without session associations cannot establish past conversion rates.
Draft conversion counts distinct consultation sessions with new drafts, not paid
orders. Self-service is an estimate; RAG accuracy remains unmeasured until labelled
evaluation is available. See the definitions in the dashboard for denominators.
Business cards show confirmed/completed orders and seller-confirmed paid revenue
(including shipping), with separate revenue attributed to verified chatbot sessions.
Delivery completion does not count as payment. Automatic bank reconciliation is
not connected; the seller records a receipt reference in the administration page.

For separate deployment, deploy this folder as its own Node service, install its
dependencies and set `OCOP_METRICS_URL` to the live OCOP backend metrics URL.
This change creates a separate local website; it does not publish a new domain.
