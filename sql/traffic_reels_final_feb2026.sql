-- ============================================================
-- Traffic Reels — FINAL correct SQL (replaces earlier drafts)
-- Cucina    : NEW PASTA ALERT Reel    → 8,240 imp under "Generic" adSet
-- Acquasale : New Pizza Additions Reel → 3,198 imp under "Generic" adSet
-- Period    : week_start 2026-02-01, week_end 2026-02-24
-- ============================================================
-- What this does at each level:
--   campaigns : increments the matching campaign's imp/clicks/linkClicks/
--               engagement totals, recalculates CTR as numeric (matching
--               Meta sync format already in these rows)
--   adSets    : same increment on "Generic" adSet only
--   ads       : appends a new ad entry (safe append, won't duplicate)
-- ============================================================
-- IMPORTANT: Do NOT run the old traffic_reels_meta_data_feb2026.sql
-- or traffic_reels_update_metrics_feb2026.sql — this file replaces both.
-- ============================================================


-- ── CUCINA ───────────────────────────────────────────────────
-- Adding: NEW PASTA ALERT Reel
--   Campaign : "Cucina Campaigns - Traffic"  (+8,240 imp / +142 clicks / +108 link / +173 eng)
--   AdSet    : "Generic"                     (same deltas)
--   Ad       : appended to ads array

UPDATE weekly_reports
SET meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(
        meta_data,
        '{campaigns}',
        (
          SELECT jsonb_agg(
            CASE WHEN elem->>'name' = 'Cucina Campaigns - Traffic'
              THEN elem || jsonb_build_object(
                'impressions', (elem->>'impressions')::bigint + 8240,
                'clicks',      (elem->>'clicks')::bigint      + 142,
                'linkClicks',  (elem->>'linkClicks')::bigint  + 108,
                'engagement',  (elem->>'engagement')::bigint  + 173,
                'ctr',         round(
                                 ((elem->>'clicks')::numeric + 142) /
                                 ((elem->>'impressions')::numeric + 8240) * 100,
                                 6
                               )
              )
              ELSE elem
            END
          )
          FROM jsonb_array_elements(meta_data->'campaigns') elem
        )
      ),
      '{adSets}',
      (
        SELECT jsonb_agg(
          CASE WHEN elem->>'name' = 'Generic'
            THEN elem || jsonb_build_object(
              'impressions', (elem->>'impressions')::bigint + 8240,
              'clicks',      (elem->>'clicks')::bigint      + 142,
              'linkClicks',  (elem->>'linkClicks')::bigint  + 108,
              'engagement',  (elem->>'engagement')::bigint  + 173,
              'ctr',         round(
                               ((elem->>'clicks')::numeric + 142) /
                               ((elem->>'impressions')::numeric + 8240) * 100,
                               6
                             )
            )
            ELSE elem
          END
        )
        FROM jsonb_array_elements(meta_data->'adSets') elem
      )
    ),
    '{ads}',
    coalesce(meta_data->'ads', '[]'::jsonb) || '[{
      "name":        "NEW PASTA ALERT Reel",
      "adSet":       "Generic",
      "status":      "active",
      "impressions": 8240,
      "clicks":      142,
      "ctr":         "1.72%",
      "linkClicks":  108,
      "engagement":  173
    }]'::jsonb
  )
WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';


-- ── ACQUASALE ────────────────────────────────────────────────
-- Adding: New Pizza Additions Reel
--   Campaign : "Acquasale by Cucina Campaigns" (+3,198 imp / +51 clicks / +39 link / +64 eng)
--   AdSet    : "Generic"                        (same deltas)
--   Ad       : appended to ads array

UPDATE weekly_reports
SET meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(
        meta_data,
        '{campaigns}',
        (
          SELECT jsonb_agg(
            CASE WHEN elem->>'name' = 'Acquasale by Cucina Campaigns'
              THEN elem || jsonb_build_object(
                'impressions', (elem->>'impressions')::bigint + 3198,
                'clicks',      (elem->>'clicks')::bigint      + 51,
                'linkClicks',  (elem->>'linkClicks')::bigint  + 39,
                'engagement',  (elem->>'engagement')::bigint  + 64,
                'ctr',         round(
                                 ((elem->>'clicks')::numeric + 51) /
                                 ((elem->>'impressions')::numeric + 3198) * 100,
                                 6
                               )
              )
              ELSE elem
            END
          )
          FROM jsonb_array_elements(meta_data->'campaigns') elem
        )
      ),
      '{adSets}',
      (
        SELECT jsonb_agg(
          CASE WHEN elem->>'name' = 'Generic'
            THEN elem || jsonb_build_object(
              'impressions', (elem->>'impressions')::bigint + 3198,
              'clicks',      (elem->>'clicks')::bigint      + 51,
              'linkClicks',  (elem->>'linkClicks')::bigint  + 39,
              'engagement',  (elem->>'engagement')::bigint  + 64,
              'ctr',         round(
                               ((elem->>'clicks')::numeric + 51) /
                               ((elem->>'impressions')::numeric + 3198) * 100,
                               6
                             )
            )
            ELSE elem
          END
        )
        FROM jsonb_array_elements(meta_data->'adSets') elem
      )
    ),
    '{ads}',
    coalesce(meta_data->'ads', '[]'::jsonb) || '[{
      "name":        "New Pizza Additions Reel",
      "adSet":       "Generic",
      "status":      "active",
      "impressions": 3198,
      "clicks":      51,
      "ctr":         "1.59%",
      "linkClicks":  39,
      "engagement":  64
    }]'::jsonb
  )
WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';
