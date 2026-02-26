-- ============================================================
-- Traffic Reels — patch CTR, clicks, linkClicks, engagement
-- Acquasale : 3,198 imp · 1.59% CTR · 51 clicks · 39 link · 64 eng
-- Cucina    : 8,240 imp · 1.72% CTR · 142 clicks · 108 link · 173 eng
-- ============================================================
-- Uses jsonb_agg CASE pattern: iterates each array and patches
-- only the "Traffic" entries, leaving all other campaigns untouched.
-- ============================================================


-- ── ACQUASALE ───────────────────────────────────────────────

UPDATE weekly_reports
SET meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(
        meta_data,
        '{campaigns}',
        (
          SELECT jsonb_agg(
            CASE WHEN elem->>'name' = 'Traffic Campaign'
              THEN elem || '{"clicks":51,"ctr":"1.59%","linkClicks":39,"engagement":64}'::jsonb
              ELSE elem
            END
          )
          FROM jsonb_array_elements(meta_data->'campaigns') elem
        )
      ),
      '{adSets}',
      (
        SELECT jsonb_agg(
          CASE WHEN elem->>'name' = 'Traffic - Reels'
            THEN elem || '{"clicks":51,"ctr":"1.59%","linkClicks":39,"engagement":64}'::jsonb
            ELSE elem
          END
        )
        FROM jsonb_array_elements(meta_data->'adSets') elem
      )
    ),
    '{ads}',
    (
      SELECT jsonb_agg(
        CASE WHEN elem->>'name' = 'New Pizza Additions Reel'
          THEN elem || '{"ctr":"1.59%","linkClicks":39,"engagement":64}'::jsonb
          ELSE elem
        END
      )
      FROM jsonb_array_elements(meta_data->'ads') elem
    )
  )
WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';


-- ── CUCINA ───────────────────────────────────────────────────

UPDATE weekly_reports
SET meta_data = jsonb_set(
    jsonb_set(
      jsonb_set(
        meta_data,
        '{campaigns}',
        (
          SELECT jsonb_agg(
            CASE WHEN elem->>'name' = 'Traffic Campaign'
              THEN elem || '{"clicks":142,"ctr":"1.72%","linkClicks":108,"engagement":173}'::jsonb
              ELSE elem
            END
          )
          FROM jsonb_array_elements(meta_data->'campaigns') elem
        )
      ),
      '{adSets}',
      (
        SELECT jsonb_agg(
          CASE WHEN elem->>'name' = 'Traffic - Reels'
            THEN elem || '{"clicks":142,"ctr":"1.72%","linkClicks":108,"engagement":173}'::jsonb
            ELSE elem
          END
        )
        FROM jsonb_array_elements(meta_data->'adSets') elem
      )
    ),
    '{ads}',
    (
      SELECT jsonb_agg(
        CASE WHEN elem->>'name' = 'NEW PASTA ALERT Reel'
          THEN elem || '{"ctr":"1.72%","linkClicks":108,"engagement":173}'::jsonb
          ELSE elem
        END
      )
      FROM jsonb_array_elements(meta_data->'ads') elem
    )
  )
WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';
