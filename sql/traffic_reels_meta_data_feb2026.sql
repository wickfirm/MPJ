-- ============================================================
-- Traffic Campaign Reels — Manual meta_data entry
-- Acquasale : New Pizza Additions Reel  (3,198 impressions)
-- Cucina    : NEW PASTA ALERT Reel      (8,240 impressions)
-- Period    : Feb 1–24, 2026
-- ============================================================
-- NOTE: CTR, linkClicks and engagement are placeholders ("—" / 0).
-- Update these with exact figures from Meta Ads Manager once available.
-- ============================================================
-- Safe append: jsonb_set preserves any existing campaigns/adSets/ads
-- already in meta_data (e.g. from Meta sync publish).
-- If no row exists for that venue+week, the INSERT creates one.
-- ============================================================


-- ── ACQUASALE ───────────────────────────────────────────────

WITH upd AS (
  UPDATE weekly_reports
  SET meta_data = jsonb_set(
      jsonb_set(
        jsonb_set(
          coalesce(meta_data, '{"campaigns":[],"adSets":[],"ads":[]}'::jsonb),
          '{campaigns}',
          coalesce(meta_data->'campaigns', '[]'::jsonb) || '[{
            "name":        "Traffic Campaign",
            "status":      "active",
            "impressions": 3198,
            "clicks":      0,
            "ctr":         "—",
            "linkClicks":  0,
            "engagement":  0
          }]'::jsonb
        ),
        '{adSets}',
        coalesce(meta_data->'adSets', '[]'::jsonb) || '[{
          "name":        "Traffic - Reels",
          "status":      "active",
          "impressions": 3198,
          "clicks":      0,
          "ctr":         "—",
          "linkClicks":  0,
          "engagement":  0
        }]'::jsonb
      ),
      '{ads}',
      coalesce(meta_data->'ads', '[]'::jsonb) || '[{
        "name":        "New Pizza Additions Reel",
        "adSet":       "Traffic - Reels",
        "status":      "active",
        "impressions": 3198,
        "ctr":         "—",
        "linkClicks":  0,
        "engagement":  0
      }]'::jsonb
    )
  WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1)
    AND week_start = '2026-02-01'
    AND week_end   = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1),
  '2026-02-01',
  '2026-02-24',
  '{
    "campaigns": [{
      "name":        "Traffic Campaign",
      "status":      "active",
      "impressions": 3198,
      "clicks":      0,
      "ctr":         "—",
      "linkClicks":  0,
      "engagement":  0
    }],
    "adSets": [{
      "name":        "Traffic - Reels",
      "status":      "active",
      "impressions": 3198,
      "clicks":      0,
      "ctr":         "—",
      "linkClicks":  0,
      "engagement":  0
    }],
    "ads": [{
      "name":        "New Pizza Additions Reel",
      "adSet":       "Traffic - Reels",
      "status":      "active",
      "impressions": 3198,
      "ctr":         "—",
      "linkClicks":  0,
      "engagement":  0
    }]
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── CUCINA ───────────────────────────────────────────────────

WITH upd AS (
  UPDATE weekly_reports
  SET meta_data = jsonb_set(
      jsonb_set(
        jsonb_set(
          coalesce(meta_data, '{"campaigns":[],"adSets":[],"ads":[]}'::jsonb),
          '{campaigns}',
          coalesce(meta_data->'campaigns', '[]'::jsonb) || '[{
            "name":        "Traffic Campaign",
            "status":      "active",
            "impressions": 8240,
            "clicks":      0,
            "ctr":         "—",
            "linkClicks":  0,
            "engagement":  0
          }]'::jsonb
        ),
        '{adSets}',
        coalesce(meta_data->'adSets', '[]'::jsonb) || '[{
          "name":        "Traffic - Reels",
          "status":      "active",
          "impressions": 8240,
          "clicks":      0,
          "ctr":         "—",
          "linkClicks":  0,
          "engagement":  0
        }]'::jsonb
      ),
      '{ads}',
      coalesce(meta_data->'ads', '[]'::jsonb) || '[{
        "name":        "NEW PASTA ALERT Reel",
        "adSet":       "Traffic - Reels",
        "status":      "active",
        "impressions": 8240,
        "ctr":         "—",
        "linkClicks":  0,
        "engagement":  0
      }]'::jsonb
    )
  WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
    AND week_start = '2026-02-01'
    AND week_end   = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1),
  '2026-02-01',
  '2026-02-24',
  '{
    "campaigns": [{
      "name":        "Traffic Campaign",
      "status":      "active",
      "impressions": 8240,
      "clicks":      0,
      "ctr":         "—",
      "linkClicks":  0,
      "engagement":  0
    }],
    "adSets": [{
      "name":        "Traffic - Reels",
      "status":      "active",
      "impressions": 8240,
      "clicks":      0,
      "ctr":         "—",
      "linkClicks":  0,
      "engagement":  0
    }],
    "ads": [{
      "name":        "NEW PASTA ALERT Reel",
      "adSet":       "Traffic - Reels",
      "status":      "active",
      "impressions": 8240,
      "ctr":         "—",
      "linkClicks":  0,
      "engagement":  0
    }]
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);
