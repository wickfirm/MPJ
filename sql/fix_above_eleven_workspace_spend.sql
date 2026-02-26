-- ============================================================
-- Fix Above Eleven Media workspace spend
-- Actual monthly budget in Supabase: AED 7,000
-- Previous SQL assumed AED 2,000 → spend was wrong (AED 1,720)
-- Corrected: (7,000 / 28) × 24 days = AED 6,000
-- ============================================================

UPDATE workspace_budgets
SET traffic     = 5,100.00,
    community   =   900.00,
    total_spend = 6,000.00,
    remaining   = 1,000.00,
    pct_spent   = '85.7%'
WHERE month = '2026-02-01' AND brand = 'Above Eleven Media';
