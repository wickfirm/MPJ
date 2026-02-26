-- ============================================================
-- Acquasale — IZZA PIZZA!! 🍕 community boosting ad
-- Period   : week_start 2026-02-01, week_end 2026-02-24
-- Campaign : "Acquasale by Cucina Campaigns"  (+1,279 imp)
-- AdSet    : "Community"                       (+1,279 imp)
-- Ad       : appended to ads array
-- Metrics  : 1,279 imp / 37 clicks / 2.89% CTR / 19 linkClicks / 94 engagement
-- ============================================================

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
                'impressions', (elem->>'impressions')::bigint + 1279,
                'clicks',      (elem->>'clicks')::bigint      + 37,
                'linkClicks',  (elem->>'linkClicks')::bigint  + 19,
                'engagement',  (elem->>'engagement')::bigint  + 94,
                'ctr',         round(
                                 ((elem->>'clicks')::numeric + 37) /
                                 ((elem->>'impressions')::numeric + 1279) * 100,
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
          CASE WHEN elem->>'name' = 'Community'
            THEN elem || jsonb_build_object(
              'impressions', (elem->>'impressions')::bigint + 1279,
              'clicks',      (elem->>'clicks')::bigint      + 37,
              'linkClicks',  (elem->>'linkClicks')::bigint  + 19,
              'engagement',  (elem->>'engagement')::bigint  + 94,
              'ctr',         round(
                               ((elem->>'clicks')::numeric + 37) /
                               ((elem->>'impressions')::numeric + 1279) * 100,
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
      "name":        "IZZA PIZZA!! \uD83C\uDF55",
      "adSet":       "Community",
      "status":      "active",
      "impressions": 1279,
      "clicks":      37,
      "ctr":         2.893667,
      "linkClicks":  19,
      "engagement":  94
    }]'::jsonb
  )
WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';
