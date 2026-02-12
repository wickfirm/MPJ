-- 1. Add Layalina venue
INSERT INTO venues (name, poc)
VALUES ('Layalina', NULL)
ON CONFLICT DO NOTHING;

-- 2. Create ad_notes table for weekly call notes
CREATE TABLE IF NOT EXISTS ad_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  week_key TEXT NOT NULL,        -- e.g. '2026-01-27_2026-02-02'
  ad_name TEXT NOT NULL,         -- matches meta_data.ads[].name
  note TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, week_key, ad_name)
);

CREATE INDEX idx_ad_notes_venue ON ad_notes(venue_id);
CREATE INDEX idx_ad_notes_week ON ad_notes(week_key);
