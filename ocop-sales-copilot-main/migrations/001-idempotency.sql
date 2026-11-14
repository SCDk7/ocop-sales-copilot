-- SQLite. Business state and replay responses commit on the same connection.
CREATE TABLE IF NOT EXISTS business_state (
  id TEXT PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload))
);
CREATE TABLE IF NOT EXISTS idempotency_keys (
  user_id TEXT NOT NULL,
  key TEXT NOT NULL,
  operation TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PROCESSING','COMPLETED','FAILED')),
  response_data TEXT CHECK (response_data IS NULL OR json_valid(response_data)),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL CHECK (expires_at >= created_at + 86400000),
  UNIQUE (user_id, key)
);
CREATE INDEX IF NOT EXISTS idempotency_expiry ON idempotency_keys(expires_at);
