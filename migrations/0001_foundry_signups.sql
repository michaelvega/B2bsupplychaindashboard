CREATE TABLE IF NOT EXISTS foundry_signups (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL,
  visits INTEGER NOT NULL DEFAULT 1
);
