-- ============================================================
-- Fix Resort brand rename scope
-- "Resort Media + Layalina" applies only from Feb 2026 onward.
-- Jan 2026 and earlier = "Resort Media" only.
-- ============================================================

UPDATE workspace_budgets
SET brand = 'Resort Media'
WHERE brand = 'Resort Media + Layalina'
  AND month < '2026-02-01';
