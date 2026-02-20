-- ============================================================
-- RPC function: update_ad_status
-- Updates a single ad's status inside meta_data.ads (JSONB)
-- Runs as SECURITY DEFINER so it bypasses RLS with anon key
-- ============================================================

CREATE OR REPLACE FUNCTION update_ad_status(
  p_venue_id   UUID,
  p_week_start DATE,
  p_week_end   DATE,
  p_ad_name    TEXT,
  p_status     TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id       UUID;
  v_meta     JSONB;
  v_updated  JSONB;
BEGIN
  -- Fetch the report id + meta_data
  SELECT id, meta_data
    INTO v_id, v_meta
    FROM weekly_reports
   WHERE venue_id   = p_venue_id
     AND week_start = p_week_start
     AND week_end   = p_week_end
   LIMIT 1;

  IF v_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Rebuild the ads array with the matching ad's status updated
  SELECT jsonb_set(
    v_meta,
    '{ads}',
    (
      SELECT jsonb_agg(
        CASE
          WHEN ad->>'name' = p_ad_name
          THEN jsonb_set(ad, '{status}', to_jsonb(p_status))
          ELSE ad
        END
      )
      FROM jsonb_array_elements(v_meta->'ads') AS ad
    )
  )
  INTO v_updated;

  -- Write it back
  UPDATE weekly_reports
     SET meta_data = v_updated
   WHERE id = v_id;

  RETURN TRUE;
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION update_ad_status(UUID, DATE, DATE, TEXT, TEXT)
  TO anon, authenticated;
