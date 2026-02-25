-- ── Meta Ads Integration Tables ─────────────────────────────────────────────
-- Run this in Supabase SQL Editor before deploying the Meta integration code.

-- 1. Campaign-to-venue mapping (admin assigns each Meta campaign to a venue)
CREATE TABLE IF NOT EXISTS meta_campaign_mappings (
  campaign_id   TEXT PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  venue_id      UUID REFERENCES venues(id) ON DELETE SET NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sync drafts staging table
CREATE TABLE IF NOT EXISTS meta_sync_drafts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start   DATE NOT NULL,
  week_end     DATE NOT NULL,
  raw_data     JSONB NOT NULL,
  mapped_data  JSONB,
  overrides    JSONB DEFAULT '{}',
  status       TEXT DEFAULT 'draft',
  synced_at    TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  UNIQUE(week_start, week_end)
);
CREATE INDEX IF NOT EXISTS idx_meta_sync_drafts_week ON meta_sync_drafts(week_start, week_end);

-- 3. Report settings (column visibility, etc.)
CREATE TABLE IF NOT EXISTS report_settings (
  setting_key   TEXT PRIMARY KEY,
  setting_value JSONB NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Default column visibility: hide spend and reach from clients, show rest
INSERT INTO report_settings (setting_key, setting_value) VALUES (
  'meta_column_visibility',
  '{"spend":false,"impressions":true,"ctr":true,"linkClicks":true,"engagement":true,"reach":false}'
) ON CONFLICT DO NOTHING;
