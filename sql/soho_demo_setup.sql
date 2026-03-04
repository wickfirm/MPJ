-- ============================================================
-- Soho Hospitality Demo — Setup
-- 1. Insert 6 Soho venues
-- 2. Insert workspace_budgets for Feb 2026 (THB)
-- ============================================================


-- ── Step 1: Insert Soho venues ───────────────────────────
INSERT INTO venues (name, poc, venue_group)
VALUES
  ('Soho Hospitality',         'MB', 'soho'),
  ('Above Eleven Bangkok',     'MB', 'soho'),
  ('APT 101',                  'MB', 'soho'),
  ('YANKII',                   'MB', 'soho'),
  ('Charcoal Tandoor',         'MB', 'soho'),
  ('Cantina',                  'MB', 'soho')
ON CONFLICT (name) DO UPDATE SET venue_group = 'soho';


-- ── Step 2: Workspace budgets — Feb 2026 (THB) ───────────
-- Soho Hospitality umbrella (budget 100,000 THB) — 24-day → 84.0%
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Soho Hospitality', 100000.00, 71400.00, 12600.00, 84000.00, 16000.00, '84.0%')
ON CONFLICT DO NOTHING;

-- Above Eleven Bangkok (budget 145,000 THB) — 24-day → 85.5%
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Above Eleven Bangkok', 145000.00, 105400.00, 18600.00, 124000.00, 21000.00, '85.5%')
ON CONFLICT DO NOTHING;

-- APT 101 (budget 125,000 THB) — 24-day → 86.4%
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'APT 101', 125000.00, 91800.00, 16200.00, 108000.00, 17000.00, '86.4%')
ON CONFLICT DO NOTHING;

-- YANKII (budget 75,000 THB) — 24-day → 82.7%
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'YANKII', 75000.00, 52700.00, 9300.00, 62000.00, 13000.00, '82.7%')
ON CONFLICT DO NOTHING;

-- Charcoal Tandoor (budget 62,000 THB) — 24-day → 83.9%
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Charcoal Tandoor', 62000.00, 44200.00, 7800.00, 52000.00, 10000.00, '83.9%')
ON CONFLICT DO NOTHING;

-- Cantina (budget 50,000 THB) — 24-day → 84.0%
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Cantina', 50000.00, 35700.00, 6300.00, 42000.00, 8000.00, '84.0%')
ON CONFLICT DO NOTHING;
