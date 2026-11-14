# Idempotency for checkout

## Implemented routes

All three routes require an authenticated customer and a UUID v4 in the
`Idempotency-Key` header. A body-only key is not accepted.

- `POST /api/ai/draft-orders` — the shared storefront/checkout order flow.
- `POST /api/orders` — account order creation.
- `POST /api/orders/:id/payment-reported` — customer notification of a transfer;
  this does **not** mark an order paid or confirm bank receipt.

`user_id` comes from the server session, never the request body.
Missing/invalid keys return 400. A different operation or request body with the
same account/key returns 409. A committed duplicate returns the original HTTP
status and JSON body with `Idempotency-Replayed: true`. CORS allows the request
header and exposes the replay header.

## Database and migration

Requires Node >=22.16.0 (`node:sqlite`), with no extra native dependency.
[`migrations/001-idempotency.sql`](migrations/001-idempotency.sql) creates the
`idempotency_keys` table, including `UNIQUE(user_id,key)`, status, request hash,
saved response and timestamps. The schema is applied automatically at startup.

The server uses **one** SQLite file for both account and sales namespaces:
`COMMERCE_DATABASE_FILE`, defaulting to `PRIVATE_DATA_DIR/commerce.sqlite`.
The existing account/sales JSON files are imported once, only when their
namespace is absent. Their original files are retained as migration backups;
subsequent changes are stored in SQLite, not written back to those JSON files.
Existing IDs, sessions, inventory, receipt secrets and product codes are retained.

Before deployment, stop old writers and back up the current JSON files. Start
the updated server with the same legacy file settings and a new commerce DB
path. After migration, do not run older JSON-writing server versions against
the same deployment. For a backup of a running SQLite database, use SQLite's
backup facilities; copying only the main file while WAL writers are active is
not a complete backup.

**Hosting:** put the DB on a private persistent local disk. All Node workers on
that host must use the same absolute file path. Ephemeral disks, separate DBs
per replica, and network-mounted SQLite WAL files cannot provide a shared
cross-server guarantee. For multiple independent hosts, use a shared database
such as PostgreSQL with equivalent transactions and uniqueness constraints.
This change does not provision or deploy hosting storage.

## Atomic service

[`transactional-store.js`](transactional-store.js) runs `BEGIN IMMEDIATE`:

1. Delete expired keys and attempt `INSERT ... ON CONFLICT DO NOTHING`.
2. Replay a completed matching request, or reject conflicting content.
3. Perform synchronous business writes on the **same connection**.
4. Store the complete successful `{status,body}` response and mark COMPLETED.
5. COMMIT. Any failure rolls back both business state and the key.

Concurrent writers wait up to 1.5 seconds; lock contention then returns 409 so
the caller can retry **with the same key**. PROCESSING is uncommitted and cannot
be mistaken for a successful payment. A crashed writer is rolled back by SQLite.
FAILED is a valid schema state, but transaction failures intentionally leave no
key behind, because the entire transaction must roll back.

Keys live for 24 hours. Cleanup runs hourly and on protected writes, including
after a restart. Cleanup removes replay records only, not business orders.
The replay guarantee is limited to this retention window.

Example using an existing store's synchronous business operation:

```js
const result = accountStore.execute(
  req.customer.id,
  req.get('Idempotency-Key'),
  'create-order',
  req.body,
  () => ({
    status: 201,
    body: { order: accountStore.order(req.customer.id, req.body) }
  })
);
res.status(result.status).json(result.body);
```

Do not use asynchronous/network callbacks inside this transaction. There is
currently no wallet debit or live bank charge in this application. Tests use
an isolated balance fixture to verify atomic debit/rollback behavior; they do
not create a production payment integration. If a provider is added later,
forward a stable provider idempotency key and reconcile signed webhooks with
a unique provider transaction ID; a local SQL transaction cannot roll back an
external bank transfer. KPI notifications remain outside the order transaction.

## Frontend

[`checkout-intent.js`](checkout-intent.js) creates cryptographic UUID v4 keys.
It stores the key and a SHA-256 request fingerprint in sessionStorage, retaining
them through retries/reloads without storing recipient details there. Editing
the submitted content is treated as a new order intent. A confirmed purchase
is marked finished, allowing the next checkout screen to create a new key even
when buying identical products. Do not reset the key on network errors.

`draft-order.js` locks the submit button synchronously, ignores another click,
shows “Đang xử lý…”, attaches the header, and retains the key after an ambiguous
network failure. Its request has a 20-second timeout. Both storefront pages and
the order page load the same client helper.

```js
// When opening a new checkout screen:
OCOPCheckoutIntent.begin('draft');

// Keep this payload and header unchanged for HTTP retries:
button.disabled = true;
button.textContent = 'Đang xử lý…';
try {
  const key = await OCOPCheckoutIntent.bind('draft', { user: user.id, payload });
  const response = await fetch('/api/ai/draft-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      'Idempotency-Key': key
    },
    body: JSON.stringify(payload)
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error);
  OCOPCheckoutIntent.finish('draft');
  // Show body.draft; a successful submission hides the order form.
} finally {
  button.disabled = false;
}
```

## Verification

`npm test` includes `idempotency.test.js`, the real HTTP security integration
test, checkout UI tests, and existing business tests. Coverage includes eight
independent simultaneous writers, response loss/restart, crash recovery,
rollback, altered payloads, account isolation, shared-route uniqueness,
24-hour expiry, single-import migration, duplicate clicks and stable retry keys.

Implementation references: [Node SQLite API](https://nodejs.org/api/sqlite.html),
[SQLite transaction semantics](https://www.sqlite.org/lang_transaction.html).
