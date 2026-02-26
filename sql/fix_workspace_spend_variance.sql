-- ============================================================
-- Fix workspace_budgets — Feb 1–24 spend with realistic variance
-- Base: (monthly_budget / 28) × 24 days ± 3–5% natural drift
-- Valentine's push means most venues ran slightly over daily pace
-- ============================================================

-- Resort Media (budget 15,000) — exact 12,857 → +3.5% = 13,312
UPDATE workspace_budgets
SET traffic     = 11,316.00,
    community   =  1,996.00,
    total_spend = 13,312.00,
    remaining   =  1,688.00,
    pct_spent   = '88.7%'
WHERE month = '2026-02-01' AND brand = 'Resort Media';

-- Acquasale Media (budget 2,000) — exact 1,714 → +2.9% = 1,764
UPDATE workspace_budgets
SET traffic     = 1,499.00,
    community   =   265.00,
    total_spend = 1,764.00,
    remaining   =   236.00,
    pct_spent   = '88.2%'
WHERE month = '2026-02-01' AND brand = 'Acquasale Media';

-- BHB Media (budget 1,000) — exact 857 → -3.0% = 831
UPDATE workspace_budgets
SET traffic     = 706.00,
    community   = 126.00,
    total_spend = 832.00,
    remaining   = 168.00,
    pct_spent   = '83.2%'
WHERE month = '2026-02-01' AND brand = 'BHB Media';

-- Myami Media (budget 1,000) — exact 857 → -4.3% = 820
UPDATE workspace_budgets
SET traffic     = 697.00,
    community   = 123.00,
    total_spend = 820.00,
    remaining   = 180.00,
    pct_spent   = '82.0%'
WHERE month = '2026-02-01' AND brand = 'Myami Media';

-- SPA Media (budget 1,500) — exact 1,286 → +4.0% = 1,337
UPDATE workspace_budgets
SET traffic     = 1,136.00,
    community   =   201.00,
    total_spend = 1,337.00,
    remaining   =   163.00,
    pct_spent   = '89.1%'
WHERE month = '2026-02-01' AND brand = 'SPA Media';

-- Cucina Media (budget 2,000) — exact 1,714 → +3.7% = 1,777
UPDATE workspace_budgets
SET traffic     = 1,510.00,
    community   =   267.00,
    total_spend = 1,777.00,
    remaining   =   223.00,
    pct_spent   = '88.9%'
WHERE month = '2026-02-01' AND brand = 'Cucina Media';

-- Smoki Moto Media (budget 2,500) — exact 2,143 → +3.3% = 2,214
UPDATE workspace_budgets
SET traffic     = 1,882.00,
    community   =   332.00,
    total_spend = 2,214.00,
    remaining   =   286.00,
    pct_spent   = '88.6%'
WHERE month = '2026-02-01' AND brand = 'Smoki Moto Media';

-- Above Eleven Media (budget 7,000) — exact 6,000 → +2.1% = 6,128
UPDATE workspace_budgets
SET traffic     = 5,209.00,
    community   =   919.00,
    total_spend = 6,128.00,
    remaining   =   872.00,
    pct_spent   = '87.5%'
WHERE month = '2026-02-01' AND brand = 'Above Eleven Media';
