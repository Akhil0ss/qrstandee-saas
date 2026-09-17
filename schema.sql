CREATE TABLE IF NOT EXISTS qr_codes (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tag TEXT DEFAULT '',
  category TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  website TEXT DEFAULT '',
  address TEXT DEFAULT '',
  extra TEXT DEFAULT '',
  destination TEXT NOT NULL,
  qr_type TEXT NOT NULL,
  primary_action TEXT DEFAULT '',
  size TEXT DEFAULT 'a4',
  orientation TEXT DEFAULT 'portrait',
  qr_color TEXT DEFAULT '#111827',
  accent TEXT DEFAULT '#2563eb',
  cta TEXT DEFAULT 'SCAN',
  logo TEXT DEFAULT '',
  scans INTEGER NOT NULL DEFAULT 0,
  last_scan_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_qr_slug ON qr_codes(slug);
CREATE INDEX IF NOT EXISTS idx_qr_updated ON qr_codes(updated_at);
