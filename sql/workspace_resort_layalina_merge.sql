-- ============================================================
-- Merge Layalina into Resort workspace row
-- 1. Delete any Layalina Media rows (all months)
-- 2. Rename Resort Media → Resort Media + Layalina (all months)
-- ============================================================

-- Remove Layalina from workspace (budget is shared with Resort)
DELETE FROM workspace_budgets
WHERE brand = 'Layalina Media';

-- Rename so the combined budget is clear
UPDATE workspace_budgets
SET brand = 'Resort Media + Layalina'
WHERE brand = 'Resort Media';
