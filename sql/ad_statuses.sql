-- ============================================================
-- ad_statuses: simple per-ad active/inactive override table
-- Replaces the JSONB mutation approach (update_ad_status RPC)
-- ============================================================

CREATE TABLE IF NOT EXISTS ad_statuses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id    UUID REFERENCES venues(id) ON DELETE CASCADE,
  week_start  DATE NOT NULL,
  week_end    DATE NOT NULL,
  ad_name     TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(venue_id, week_start, week_end, ad_name)
);

CREATE INDEX IF NOT EXISTS idx_ad_statuses_venue ON ad_statuses(venue_id);
CREATE INDEX IF NOT EXISTS idx_ad_statuses_week  ON ad_statuses(week_start, week_end);

-- Drop the old JSONB-mutation RPC (no longer needed)
DROP FUNCTION IF EXISTS update_ad_status(UUID, DATE, DATE, TEXT, TEXT);
