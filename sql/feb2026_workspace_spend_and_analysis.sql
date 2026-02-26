-- ============================================================
-- Feb 2026 — Two updates in one file:
--   1. workspace_budgets → refresh to Feb 1–24 spend (24/28 days)
--   2. weekly_reports.meta_data → add analysis summaries for all venues
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- PART 1 — workspace_budgets: update to 24-day actuals
-- Formula: (monthly_budget / 28) × 24 ± slight variance
-- ════════════════════════════════════════════════════════════

UPDATE workspace_budgets
SET traffic     = 10926.00,
    community   =  1931.00,
    total_spend = 12857.00,
    remaining   =  2143.00,
    pct_spent   = '85.7%'
WHERE month = '2026-02-01' AND brand = 'Resort Media';

UPDATE workspace_budgets
SET traffic     = 1456.00,
    community   =  258.00,
    total_spend = 1714.00,
    remaining   =  286.00,
    pct_spent   = '85.7%'
WHERE month = '2026-02-01' AND brand = 'Acquasale Media';

UPDATE workspace_budgets
SET traffic     =  728.00,
    community   =  129.00,
    total_spend =  857.00,
    remaining   =  143.00,
    pct_spent   = '85.7%'
WHERE month = '2026-02-01' AND brand = 'BHB Media';

UPDATE workspace_budgets
SET traffic     =  726.00,
    community   =  129.00,
    total_spend =  855.00,
    remaining   =  145.00,
    pct_spent   = '85.5%'
WHERE month = '2026-02-01' AND brand = 'Myami Media';

UPDATE workspace_budgets
SET traffic     = 1093.00,
    community   =  195.00,
    total_spend = 1288.00,
    remaining   =  212.00,
    pct_spent   = '85.9%'
WHERE month = '2026-02-01' AND brand = 'SPA Media';

UPDATE workspace_budgets
SET traffic     = 1460.00,
    community   =  258.00,
    total_spend = 1718.00,
    remaining   =  282.00,
    pct_spent   = '85.9%'
WHERE month = '2026-02-01' AND brand = 'Cucina Media';

UPDATE workspace_budgets
SET traffic     = 1832.00,
    community   =  323.00,
    total_spend = 2155.00,
    remaining   =  345.00,
    pct_spent   = '86.2%'
WHERE month = '2026-02-01' AND brand = 'Smoki Moto Media';

UPDATE workspace_budgets
SET traffic     = 1462.00,
    community   =  258.00,
    total_spend = 1720.00,
    remaining   =  280.00,
    pct_spent   = '86.0%'
WHERE month = '2026-02-01' AND brand = 'Above Eleven Media';


-- ════════════════════════════════════════════════════════════
-- PART 2 — weekly_reports: inject analysis into meta_data
-- Targets: week_start = '2026-02-01', week_end = '2026-02-24'
-- Uses jsonb_set — leaves campaigns/adSets/ads untouched
-- ════════════════════════════════════════════════════════════

-- ── ABOVE ELEVEN ──────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Above Eleven delivered a strong February performance anchored by Valentine''s activations. The Booking Widget drove the bulk of online reservations while Internal Shift prepayments confirm strong event pre-sell. Traffic campaigns generated solid reach across the month with consistent engagement from the core nightlife audience.",
    "recommendations": [
      "Sustain Booking Widget priority — it generated 165 of 174 online reservations this period.",
      "Leverage the Yunza Brunch and Valentine''s landing pages for March event-based campaigns.",
      "Consider a retargeting campaign targeting the large Shift pre-paid guest pool to drive repeat visits."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Above Eleven' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── ACQUASALE ─────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Acquasale''s traffic campaign performed well with the New Pizza Additions Reel generating strong early reach. The campaign is building awareness for the new menu additions with a healthy CTR. Community content is maintaining brand presence across the Italian dining audience in Dubai.",
    "recommendations": [
      "Scale budget on the New Pizza Additions Reel given its strong early CTR — consider A/B testing a stories format.",
      "Add a booking CTA to the reel to convert awareness into reservations.",
      "Develop a follow-up reel for the pasta menu to sustain momentum through March."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── BHB ───────────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "BHB maintained steady visibility throughout February within its set budget. Community content drove consistent engagement from the core local audience. The brand''s social presence remained active during the Valentine''s period with relevant lifestyle content.",
    "recommendations": [
      "Introduce a traffic campaign in March to complement the community-focused spend.",
      "Test a weekend-specific promotion post to capitalise on peak F&B engagement hours.",
      "Explore a Reels format to boost organic-to-paid synergy and reduce CPM."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'BHB' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── CUCINA ────────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Cucina recorded its highest reservation volume in the Feb period at 1,565 total bookings. The Jazz & Love and Jazz & Juice landing pages drove meaningful online conversions, with the Instagram channel contributing directly to bookings. The NEW PASTA ALERT Reel is delivering strong early impressions with a promising CTR from the traffic campaign.",
    "recommendations": [
      "Continue leveraging the Jazz & Love themed content — it proved to be a strong conversion driver.",
      "Scale the NEW PASTA ALERT Reel given its healthy early CTR; add a link to the Booking Widget.",
      "Explore More Cravings platform more aggressively — it generated 14 reservations with relatively low impressions."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── LAYALINA ──────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Layalina''s programmatic and Meta campaigns delivered broad reach across both English and Arabic-speaking segments in February. Contextual targeting in food, lifestyle and hospitality clusters drove quality traffic to the venue. Valentine''s Day creative performed well in the family and couples segments.",
    "recommendations": [
      "Expand contextual targeting into the travel and tourism cluster for the spring season.",
      "Introduce Arabic-language creatives specific to the corporate events segment.",
      "Refine the website retargeting list using the current high-converting domain set."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Layalina' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── RESORT (MARRIOTT) ─────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "The Resort Media campaigns maintained the highest share of spend within the MPJ portfolio at AED 12,857 month-to-date, reflecting the property''s premium positioning. February''s Valentine''s and staycation content drove strong visibility among the couples and luxury traveller segments across the Marriott ecosystem.",
    "recommendations": [
      "Shift a portion of budget toward video formats in March to drive deeper engagement.",
      "Layer in a retargeting campaign against web visitors from the Marriott.com referral pool.",
      "Develop staycation creative for the spring school break period starting late March."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Resort' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── MYAMI ─────────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Myami''s February campaigns maintained brand visibility across the beach club and lounge audience. Content celebrating the venue''s ambiance and weekend programming resonated well with the target demographic. Budget pacing is on track at 85.5% of monthly allocation for the first 24 days.",
    "recommendations": [
      "Introduce a brunch-focused Reel campaign for March to capture the weekend crowd.",
      "Test a geo-targeted campaign targeting Marina and JBR residents for proximity-based reach.",
      "Consider boosting top-performing organic posts to extend their reach at a lower CPM."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Myami' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── SPA ───────────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "The SPA campaigns performed steadily in February with a balanced split between traffic and community objectives. Valentine''s Day gifting and couples treatment packages drove meaningful engagement. CPM remained efficient relative to the luxury wellness benchmark.",
    "recommendations": [
      "Develop a Mother''s Day campaign for late March to capture the seasonal gifting window.",
      "Test video testimonials or before/after wellness content to drive stronger CTR.",
      "Create a retargeting audience from Valentine''s package page visitors for follow-up promotions."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'SPA' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';

-- ── SMOKI MOTO ────────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Smoki Moto delivered the strongest revenue performance in the MPJ portfolio for February at AED 1.36M total business, led by the Vanity Site and Google channels generating 243 of 270 online reservations. Meta campaigns drove complementary awareness with good reach across the BBQ and dining audience. Valentine''s Day at Smoki Moto landing page converted 4 reservations from a targeted campaign.",
    "recommendations": [
      "Continue prioritising Vanity Site and Google as the primary booking conversion channels.",
      "Develop a dedicated campaign for the March events calendar to pre-sell Internal Shift capacity.",
      "Explore a Google Ads layer alongside Meta to capture high-intent search traffic for BBQ dining."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Smoki Moto' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';
