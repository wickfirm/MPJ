-- ============================================================
-- Workspace Budgets — February 2026
-- 28 days in Feb | 8 days elapsed | Daily rate = budget/28
-- Spend = (budget/28) * 8 days ± 5-7% variance
-- ============================================================

-- Clear existing Feb data to avoid duplicates
DELETE FROM workspace_budgets WHERE month = '2026-02-01';

-- Resort Media: AED 15,000/mo | daily ~535.71 | 8-day target ~4,285.71
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Resort Media', 15000.00, 3640.00, 680.00, 4320.00, 10680.00, '28.8%');

-- Acquasale Media: AED 2,000/mo | daily ~71.43 | 8-day target ~571.43
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Acquasale Media', 2000.00, 430.00, 120.00, 550.00, 1450.00, '27.5%');

-- BHB Media: AED 1,000/mo | daily ~35.71 | 8-day target ~285.71
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'BHB Media', 1000.00, 260.00, 38.00, 298.00, 702.00, '29.8%');

-- Myami Media: AED 1,000/mo | daily ~35.71 | 8-day target ~285.71
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Myami Media', 1000.00, 215.00, 60.00, 275.00, 725.00, '27.5%');

-- SPA Media: AED 1,500/mo | daily ~53.57 | 8-day target ~428.57
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'SPA Media', 1500.00, 340.00, 105.00, 445.00, 1055.00, '29.7%');

-- Cucina Media: AED 2,000/mo | daily ~71.43 | 8-day target ~571.43
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Cucina Media', 2000.00, 460.00, 128.00, 588.00, 1412.00, '29.4%');

-- Smoki Moto Media: AED 2,500/mo | daily ~89.29 | 8-day target ~714.29
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Smoki Moto Media', 2500.00, 580.00, 150.00, 730.00, 1770.00, '29.2%');

-- Above Eleven Media: AED 2,000/mo | daily ~71.43 | 8-day target ~571.43
INSERT INTO workspace_budgets (month, brand, monthly_budget, traffic, community, total_spend, remaining, pct_spent)
VALUES ('2026-02-01', 'Above Eleven Media', 2000.00, 440.00, 115.00, 555.00, 1445.00, '27.8%');

-- Layalina Media: removed from workspace view (separate client)
DELETE FROM workspace_budgets WHERE month = '2026-02-01' AND brand = 'Layalina Media';
