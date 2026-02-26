-- ============================================================
-- Cucina — "New pasta just dropped at Cucina 🍝" community ad
-- Period   : week_start 2026-02-01, week_end 2026-02-24
-- Campaign : "Cucina Campaigns - Community"   (+6,942 imp)
-- AdSet    : "IG Boosters"                    (+6,942 imp)
-- Ad       : appended to ads array
-- Metrics  : 6,942 imp / 188 clicks / 2.71% CTR / 73 linkClicks / 352 engagement
-- NOTE: update campaign name below if it differs in Meta Ads Manager
-- ============================================================

UPDATE weekly_reports
SET meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(
        meta_data,
        '{campaigns}',
        (
          SELECT jsonb_agg(
            CASE WHEN elem->>'name' = 'Cucina Campaigns - Community'
              THEN elem || jsonb_build_object(
                'impressions', (elem->>'impressions')::bigint + 6942,
                'clicks',      (elem->>'clicks')::bigint      + 188,
                'linkClicks',  (elem->>'linkClicks')::bigint  + 73,
                'engagement',  (elem->>'engagement')::bigint  + 352,
                'ctr',         round(
                                 ((elem->>'clicks')::numeric + 188) /
                                 ((elem->>'impressions')::numeric + 6942) * 100,
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
          CASE WHEN elem->>'name' = 'IG Boosters'
            THEN elem || jsonb_build_object(
              'impressions', (elem->>'impressions')::bigint + 6942,
              'clicks',      (elem->>'clicks')::bigint      + 188,
              'linkClicks',  (elem->>'linkClicks')::bigint  + 73,
              'engagement',  (elem->>'engagement')::bigint  + 352,
              'ctr',         round(
                               ((elem->>'clicks')::numeric + 188) /
                               ((elem->>'impressions')::numeric + 6942) * 100,
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
      "name":        "New pasta just dropped at Cucina \uD83C\uDF5D",
      "adSet":       "IG Boosters",
      "status":      "active",
      "impressions": 6942,
      "clicks":      188,
      "ctr":         2.709792,
      "linkClicks":  73,
      "engagement":  352
    }]'::jsonb
  )
WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';
