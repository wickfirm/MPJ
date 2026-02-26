-- Add meta_data_draft column to weekly_reports
-- This enables an admin-preview workflow:
--   meta_data       = client-visible published state
--   meta_data_draft = admin working copy (hide/show, audience edits, etc.)
-- Admins see the draft in Venue View; clients always see meta_data.
-- "Push to Client" copies meta_data_draft → meta_data and clears the draft.

ALTER TABLE weekly_reports
  ADD COLUMN IF NOT EXISTS meta_data_draft JSONB;
