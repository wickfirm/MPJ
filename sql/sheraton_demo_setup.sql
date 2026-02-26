-- ============================================================
-- Sheraton MOE Demo — Setup
-- 1. Add venue_group column to venues table
-- 2. Insert 4 Sheraton venues
-- 3. Insert workspace_budgets for Feb 2026
-- ============================================================


-- ── Step 1: Add venue_group column ───────────────────────
ALTER TABLE venues
ADD COLUMN IF NOT EXISTS venue_group TEXT NOT NULL DEFAULT 'mpj';

-- Mark all existing venues as MPJ
UPDATE venues SET venue_group = 'mpj' WHERE venue_group IS NULL OR venue_group = '';


-- ── Step 2: Insert Sheraton venues ───────────────────────
INSERT INTO venues (name, poc, venue_group)
VALUES
  ('Sheraton MOE',        'MB', 'sheraton'),
  ('Besh Turkish Kitchen','MB', 'sheraton'),
  ('Spartan Sports Bar',  'MB', 'sheraton'),
  ('OAnjo Dubai',         'MB', 'sheraton')
ON CONFLICT (name) DO UPDATE SET venue_group = 'sheraton';


-- ── Step 3: Workspace budgets — Feb 2026 ─────────────────
-- Base: (budget / 28) × 24 days ± 3-5% variance

-- Sheraton MOE (budget 12,000) — 24-day → +3.2% = 10,604
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Sheraton MOE', 12000.00, 9013.00, 1591.00, 10604.00, 1396.00, '88.4%')
ON CONFLICT DO NOTHING;

-- Besh Turkish Kitchen (budget 2,000) — 24-day → +2.8% = 1,762
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Besh Turkish Kitchen', 2000.00, 1498.00, 264.00, 1762.00, 238.00, '88.1%')
ON CONFLICT DO NOTHING;

-- Spartan Sports Bar (budget 2,000) — 24-day → +3.9% = 1,780
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Spartan Sports Bar', 2000.00, 1513.00, 267.00, 1780.00, 220.00, '89.0%')
ON CONFLICT DO NOTHING;

-- OAnjo Dubai (budget 2,500) — 24-day → +4.1% = 2,231
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'OAnjo Dubai', 2500.00, 1896.00, 335.00, 2231.00, 269.00, '89.2%')
ON CONFLICT DO NOTHING;
