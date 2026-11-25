PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 80),
  category TEXT NOT NULL CHECK (category IN ('produce', 'bakery', 'prepared', 'pantry')),
  total_portions INTEGER NOT NULL CHECK (total_portions BETWEEN 1 AND 500),
  portions_remaining INTEGER NOT NULL CHECK (portions_remaining BETWEEN 0 AND total_portions),
  neighborhood TEXT NOT NULL CHECK (length(neighborhood) BETWEEN 2 AND 60),
  pickup_at TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '' CHECK (length(notes) <= 280),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS listings_available_pickup
  ON listings (status, pickup_at);
CREATE INDEX IF NOT EXISTS listings_category_pickup
  ON listings (category, status, pickup_at);

CREATE TABLE IF NOT EXISTS claims (
  id TEXT PRIMARY KEY NOT NULL,
  listing_id TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  portions INTEGER NOT NULL CHECK (portions BETWEEN 1 AND 50),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
