PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, edition_id TEXT NOT NULL, manifest_sha256 TEXT NOT NULL,
 token_hash TEXT NOT NULL UNIQUE, amount INTEGER NOT NULL CHECK(amount > 0),
 currency TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','revoked')),
 session_id TEXT UNIQUE, checkout_url TEXT, payment_intent TEXT UNIQUE, created_at INTEGER NOT NULL,
 paid_at INTEGER, revoked_at INTEGER, attribution TEXT NOT NULL DEFAULT 'direct'
);
CREATE TABLE IF NOT EXISTS stripe_events (id TEXT PRIMARY KEY, type TEXT NOT NULL, received_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS revoked_payments (payment_intent TEXT PRIMARY KEY, event_id TEXT NOT NULL, revoked_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS downloads (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), format TEXT NOT NULL, created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS agent_runs (
 id TEXT PRIMARY KEY, edition_id TEXT NOT NULL, capability TEXT NOT NULL, state TEXT NOT NULL,
 input_sha256 TEXT NOT NULL, output_sha256 TEXT NOT NULL, evidence TEXT NOT NULL,
 model_version TEXT NOT NULL, cost_micros INTEGER, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS approvals (
 id TEXT PRIMARY KEY, edition_id TEXT NOT NULL, manifest_sha256 TEXT NOT NULL, scope TEXT NOT NULL,
 actor TEXT NOT NULL, approved_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
 UNIQUE(edition_id, manifest_sha256, scope)
);

CREATE TABLE IF NOT EXISTS production_projects (edition_id TEXT PRIMARY KEY,manifest_sha256 TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'PREVIEW',revision INTEGER NOT NULL DEFAULT 1,updated_at INTEGER NOT NULL);
