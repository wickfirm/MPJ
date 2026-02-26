-- ============================================================
-- Update analysis summaries — post-Valentine's (Feb 26, 2026)
-- Valentine's period has closed. Shifting focus to March.
-- All summaries updated + creative request added to each venue.
-- Target: week_start = '2026-02-01', week_end = '2026-02-24'
-- ============================================================

-- ── ABOVE ELEVEN ──────────────────────────────────────────
UPDATE weekly_reports
SET meta_data = jsonb_set(
  coalesce(meta_data, '{}'::jsonb),
  '{analysis}',
  '{
    "summary": "Valentine''s activations have now closed with strong results — Booking Widget led online reservations and Internal Shift prepayments confirmed solid event pre-sell. The month closes with healthy audience engagement. Attention now shifts to March programming, starting with the Yunza Brunch calendar and new nightlife events.",
    "recommendations": [
      "Plan March campaign creatives immediately — Yunza Brunch and Ritmo Arriba concepts should be ready by March 1st.",
      "Request fresh video and static creatives from the creative team focused on nightlife and weekend crowd.",
      "Build a retargeting audience from Valentine''s page visitors to re-engage for upcoming March events."
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
    "summary": "The New Pizza Additions Reel ran well through February and is now winding down. Valentine''s content contributed to brand warmth in the Italian dining segment. March will require a fresh creative push to maintain momentum post-holiday.",
    "recommendations": [
      "Request new March creatives — pasta and seasonal specials content to follow the Pizza Additions campaign.",
      "Introduce a Reels-first strategy for March with at least 2 new video assets to maintain feed relevance.",
      "Consider a limited-time March promotion tied to a new dish launch to sustain traffic campaign performance."
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
    "summary": "BHB maintained consistent brand presence through the Valentine''s period. With the holiday now behind us, March is an opportunity to introduce new content themes and test a traffic objective for the first time this quarter.",
    "recommendations": [
      "Submit creative brief for March — new lifestyle and bar atmosphere visuals needed to refresh the feed.",
      "Launch a traffic campaign in March with a venue showcase Reel to attract new audiences.",
      "Plan Ramadan-period content early — brief the creative team now for end-of-March delivery."
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
    "summary": "Cucina closed February with strong reservation volume at 1,565 bookings and a successful Valentine''s Jazz campaign. The NEW PASTA ALERT Reel built good awareness going into month-end. March should capitalise on Cucina''s food content strength with a new creative cycle.",
    "recommendations": [
      "Request a March creative batch — at least 2 Reels and 3 static posts showcasing signature dishes and the dining atmosphere.",
      "Brief the creative team on a spring menu launch concept to support a March traffic campaign.",
      "Retain the Jazz theme for March events — it proved to be a strong conversion driver in February."
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
    "summary": "Layalina''s February campaigns delivered across both programmatic and social channels. Valentine''s content performed well in the couples and family segments. With Valentine''s now closed, March will shift focus toward Ramadan pre-season content and Arabic-language engagement.",
    "recommendations": [
      "Brief the creative team for Ramadan-themed content — Arabic-language Reels and carousel posts needed by mid-March.",
      "Request new photography or video assets of the venue ambiance for the spring campaign refresh.",
      "Prepare a Ramadan iftar promotion campaign with dedicated landing page for March traffic campaigns."
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
    "summary": "Resort Media + Layalina campaigns performed strongly through February, with the combined budget driving high reach in the luxury travel and dining segments. Valentine''s staycation and couples content generated solid engagement. March represents the peak spring season — an important month to capitalise with fresh content.",
    "recommendations": [
      "Urgently request March creative assets — spring staycation and pool campaign visuals needed immediately.",
      "Produce a venue walkthrough video for March to support awareness campaigns targeting new visitors.",
      "Begin Ramadan campaign prep — brief creative team on iftar and suhoor content for both Resort and Layalina."
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
    "summary": "Myami maintained brand visibility through February with consistent community content. Valentine''s Day content engaged the couples and weekend crowd segments. March marks the beginning of Dubai''s peak beach season — a key opportunity for Myami to scale up.",
    "recommendations": [
      "Request a batch of March beach and pool creatives — sunny lifestyle content to match the season.",
      "Launch a brunch-focused Reel campaign for March; brief the creative team this week.",
      "Increase budget allocation in March to capitalise on peak beach season foot traffic."
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
    "summary": "The SPA''s Valentine''s gifting and couples treatment campaigns performed well through mid-February. With the holiday period now closed, March is a strong opportunity to target the wellness and self-care audience building toward Ramadan season.",
    "recommendations": [
      "Request new March creative assets — calming wellness visuals, treatment photography, and a video walkthrough of key treatment rooms.",
      "Brief the creative team on a Mother''s Day gifting campaign for end-of-March delivery.",
      "Develop a pre-Ramadan wellness package campaign with dedicated creative for late March launch."
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
    "summary": "Smoki Moto delivered the strongest revenue in the MPJ portfolio for February at AED 1.36M, led by Vanity Site and Google. Valentine''s Day at Smoki Moto was a success. The month closes with strong momentum — March will need fresh creative to sustain this performance and build toward Ramadan.",
    "recommendations": [
      "Request new March Reels immediately — BBQ content, new menu items, and chef/kitchen behind-the-scenes to keep the feed fresh.",
      "Brief creative team on a Ramadan iftar at Smoki Moto concept for mid-March campaign launch.",
      "Test a Google Ads layer alongside Meta in March to capture high-intent BBQ dining search traffic."
    ]
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Smoki Moto' LIMIT 1)
  AND week_start = '2026-02-01'
  AND week_end   = '2026-02-24';
