-- ============================================================
-- Soho Hospitality Demo — Monthly Rollups + Social Media
-- Part 1: monthly_rollups — Soho portfolio rows (THB)
-- Part 2: social_media_monthly — Feb 2026 for all 6 venues
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- PART 1 — monthly_rollups
-- ════════════════════════════════════════════════════════════

-- Soho portfolio rollup — Jan 2026 (full month baseline, THB)
-- 6 venues combined: budget 557K | revenue ~14.5M | 7,800 res
INSERT INTO monthly_rollups (month, ad_spend, revenue, reservations, venue_group)
VALUES ('2026-01-01', 524000.00, 14480000.00, 7820, 'soho')
ON CONFLICT DO NOTHING;

-- Soho portfolio rollup — Feb 2026 (1–24, 85.7% of month, THB)
-- 6 venues: 84K + 124K + 108K + 62K + 52K + 42K = 472K spend
-- Revenue: 0 + 4,284K + 3,542K + 1,842K + 1,424K + 1,184K = 12,276K
-- Reservations: 0 + 1,840 + 2,284 + 984 + 824 + 642 = 6,574
INSERT INTO monthly_rollups (month, ad_spend, revenue, reservations, venue_group)
VALUES ('2026-02-01', 472000.00, 12276000.00, 6574, 'soho')
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- PART 2 — social_media_monthly (Feb 2026)
-- ════════════════════════════════════════════════════════════

-- ── SOHO HOSPITALITY (UMBRELLA) ──────────────────────────
INSERT INTO social_media_monthly (
  venue_id, month,
  ig_followers, ig_followers_growth, ig_following,
  ig_posts_count, ig_reels_count, ig_stories_count,
  ig_impressions, ig_reach, ig_avg_reach_per_day,
  ig_engagement_rate, ig_total_interactions,
  ig_likes, ig_comments, ig_shares, ig_saves,
  ig_story_impressions, ig_avg_story_reach, ig_reel_avg_reach,
  fb_followers, fb_followers_growth, fb_page_views,
  fb_impressions, fb_total_views,
  fb_posts_count, fb_reels_count, fb_stories_count,
  fb_engagement_rate, fb_total_interactions,
  ig_top_posts, ig_top_reels, ig_demographics, ig_hashtags, ig_sponsored,
  fb_top_posts, fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'Soho Hospitality'),
  '2026-02',
  18240, 3.84, NULL,
  12, 4, 28,
  184240, 88420, 3684.17,
  4.84, 3248,
  2484, 248, 284, 232,
  22840, 818.20, 8420.00,
  12840, 2.14, 4840,
  284200, 278400,
  12, 4, 24,
  2.48, 984,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Night in Bangkok 🌹 — Soho Portfolio", "views": 18420, "reach": 9240, "likes": 684, "comments": 64, "saved": 148, "shares": 84, "engagement": 10.54},
    {"published": "Feb 7, 2026", "title": "5 reasons to make Bangkok your next destination 🌆", "views": 12840, "reach": 6420, "likes": 424, "comments": 48, "saved": 96, "shares": 56, "engagement": 9.74},
    {"published": "Feb 21, 2026", "title": "The Soho portfolio — a night for every mood", "views": 9840, "reach": 4920, "likes": 284, "comments": 28, "saved": 68, "shares": 38, "engagement": 8.49},
    {"published": "Feb 3, 2026", "title": "Bangkok''s premium hospitality group — behind the scenes", "views": 7240, "reach": 3620, "likes": 184, "comments": 18, "saved": 48, "shares": 24, "engagement": 7.57},
    {"published": "Feb 18, 2026", "title": "What''s on this weekend across Soho venues 📍", "views": 6240, "reach": 3120, "likes": 148, "comments": 14, "saved": 38, "shares": 18, "engagement": 6.99}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Bangkok Valentine''s Guide 🌹 — Soho Hospitality", "views": 42840, "reach": 21420, "likes": 1284, "comments": 124, "saved": 384, "shares": 248, "engagement": 9.54, "watch_time": "1m 52s", "avg_watch_time": "24s"},
    {"published": "Feb 7, 2026", "title": "A night in Bangkok — the Soho experience", "views": 28420, "reach": 14240, "likes": 784, "comments": 84, "saved": 248, "shares": 148, "engagement": 8.92, "watch_time": "1m 38s", "avg_watch_time": "21s"},
    {"published": "Feb 21, 2026", "title": "Soho venues — March events preview", "views": 18240, "reach": 9120, "likes": 484, "comments": 48, "saved": 148, "shares": 84, "engagement": 8.38, "watch_time": "1m 12s", "avg_watch_time": "16s"},
    {"published": "Feb 3, 2026", "title": "Behind the bar at Page Seven 🍸 — Soho Group", "views": 14840, "reach": 7420, "likes": 384, "comments": 42, "saved": 124, "shares": 68, "engagement": 8.32, "watch_time": "58s", "avg_watch_time": "14s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 22, "25-34": 42, "35-44": 24, "45-54": 8, "55+": 4},
    "gender": {"male": 52, "female": 48},
    "top_cities": [{"city": "Bangkok", "pct": 58}, {"city": "Chiang Mai", "pct": 8}, {"city": "Singapore", "pct": 8}, {"city": "Hong Kong", "pct": 6}, {"city": "Other", "pct": 20}]
  }'::jsonb,
  '[
    {"tag": "#SohoHospitality", "uses": 484},
    {"tag": "#BangkokNightlife", "uses": 384},
    {"tag": "#BangkokDining", "uses": 284},
    {"tag": "#ExpatsInBangkok", "uses": 248},
    {"tag": "#VisitBangkok", "uses": 184}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Bangkok — Soho Portfolio Night Guide 🌹", "reach": 18420, "likes": 484, "comments": 64, "shares": 148, "engagement": 3.77},
    {"published": "Feb 7, 2026", "title": "Bangkok dining & nightlife — Soho Group venues", "reach": 12840, "likes": 284, "comments": 38, "shares": 84, "engagement": 3.16}
  ]'::jsonb,
  '{
    "age": {"18-24": 18, "25-34": 40, "35-44": 28, "45-54": 10, "55+": 4},
    "gender": {"male": 50, "female": 50},
    "top_cities": [{"city": "Bangkok", "pct": 60}, {"city": "Singapore", "pct": 10}, {"city": "Hong Kong", "pct": 8}, {"city": "London", "pct": 6}, {"city": "Other", "pct": 16}]
  }'::jsonb
);


-- ── ABOVE ELEVEN BANGKOK ─────────────────────────────────
INSERT INTO social_media_monthly (
  venue_id, month,
  ig_followers, ig_followers_growth, ig_following,
  ig_posts_count, ig_reels_count, ig_stories_count,
  ig_impressions, ig_reach, ig_avg_reach_per_day,
  ig_engagement_rate, ig_total_interactions,
  ig_likes, ig_comments, ig_shares, ig_saves,
  ig_story_impressions, ig_avg_story_reach, ig_reel_avg_reach,
  fb_followers, fb_followers_growth, fb_page_views,
  fb_impressions, fb_total_views,
  fb_posts_count, fb_reels_count, fb_stories_count,
  fb_engagement_rate, fb_total_interactions,
  ig_top_posts, ig_top_reels, ig_demographics, ig_hashtags, ig_sponsored,
  fb_top_posts, fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'Above Eleven Bangkok'),
  '2026-02',
  28420, 4.84, NULL,
  16, 6, 42,
  248420, 118840, 4951.67,
  5.84, 4284,
  3248, 348, 484, 204,
  32840, 1173.00, 14284.00,
  14280, 2.84, 6240,
  384200, 376400,
  14, 6, 36,
  3.24, 1248,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Rooftop Dinner 🌹 — Above Eleven Bangkok", "views": 24840, "reach": 12420, "likes": 884, "comments": 84, "saved": 248, "shares": 124, "engagement": 10.76},
    {"published": "Feb 7, 2026", "title": "Sunset at Above Eleven 🌅 — every evening", "views": 18420, "reach": 9240, "likes": 584, "comments": 58, "saved": 184, "shares": 84, "engagement": 9.87},
    {"published": "Feb 21, 2026", "title": "Bangkok skyline from the top 🏙️ — rooftop season", "views": 14240, "reach": 7140, "likes": 424, "comments": 42, "saved": 148, "shares": 64, "engagement": 9.48},
    {"published": "Feb 3, 2026", "title": "New cocktail menu — crafted 52 floors up", "views": 10840, "reach": 5420, "likes": 284, "comments": 28, "saved": 108, "shares": 42, "engagement": 8.55},
    {"published": "Feb 18, 2026", "title": "Friday night rooftop — Soho meets Bangkok 🎶", "views": 8840, "reach": 4420, "likes": 224, "comments": 22, "saved": 84, "shares": 34, "engagement": 8.27}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s at Above Eleven 🌹 — Rooftop Romance", "views": 58420, "reach": 29240, "likes": 1884, "comments": 184, "saved": 584, "shares": 384, "engagement": 10.38, "watch_time": "2m 04s", "avg_watch_time": "28s"},
    {"published": "Feb 7, 2026", "title": "Above Eleven Bangkok — sunset to midnight 🌅🌃", "views": 42840, "reach": 21420, "likes": 1284, "comments": 128, "saved": 424, "shares": 248, "engagement": 9.72, "watch_time": "1m 52s", "avg_watch_time": "24s"},
    {"published": "Feb 21, 2026", "title": "Rooftop cocktail hour — Bangkok''s best view 🍸", "views": 28420, "reach": 14240, "likes": 784, "comments": 84, "saved": 284, "shares": 148, "engagement": 8.80, "watch_time": "1m 28s", "avg_watch_time": "20s"},
    {"published": "Feb 4, 2026", "title": "Behind the bar at Above Eleven 🍹", "views": 18840, "reach": 9420, "likes": 484, "comments": 48, "saved": 184, "shares": 98, "engagement": 8.58, "watch_time": "1m 08s", "avg_watch_time": "16s"},
    {"published": "Feb 26, 2026", "title": "March at Above Eleven — what''s coming 🎉", "views": 12840, "reach": 6420, "likes": 284, "comments": 28, "saved": 124, "shares": 64, "engagement": 7.79, "watch_time": "52s", "avg_watch_time": "13s"},
    {"published": "Feb 11, 2026", "title": "Signature dish spotlight 🍽️ — chef''s table edition", "views": 9840, "reach": 4920, "likes": 224, "comments": 22, "saved": 98, "shares": 48, "engagement": 7.96, "watch_time": "44s", "avg_watch_time": "11s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 18, "25-34": 44, "35-44": 26, "45-54": 8, "55+": 4},
    "gender": {"male": 48, "female": 52},
    "top_cities": [{"city": "Bangkok", "pct": 52}, {"city": "Singapore", "pct": 12}, {"city": "Hong Kong", "pct": 8}, {"city": "Tokyo", "pct": 6}, {"city": "Other", "pct": 22}]
  }'::jsonb,
  '[
    {"tag": "#AboveElevenBangkok", "uses": 684},
    {"tag": "#BangkokRooftop", "uses": 548},
    {"tag": "#BangkokNightlife", "uses": 424},
    {"tag": "#RooftopBar", "uses": 384},
    {"tag": "#BangkokDining", "uses": 284}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Rooftop Dinner — Reserve Your Table 🌹", "reach": 22840, "likes": 624, "comments": 84, "shares": 248, "engagement": 4.19},
    {"published": "Feb 7, 2026", "title": "Bangkok skyline & cocktails — every evening at Above Eleven", "reach": 16240, "likes": 384, "comments": 48, "shares": 148, "engagement": 3.57}
  ]'::jsonb,
  '{
    "age": {"18-24": 16, "25-34": 42, "35-44": 28, "45-54": 10, "55+": 4},
    "gender": {"male": 46, "female": 54},
    "top_cities": [{"city": "Bangkok", "pct": 54}, {"city": "Singapore", "pct": 12}, {"city": "Hong Kong", "pct": 8}, {"city": "Sydney", "pct": 4}, {"city": "Other", "pct": 22}]
  }'::jsonb
);


-- ── APT 101 ──────────────────────────────────────────────
INSERT INTO social_media_monthly (
  venue_id, month,
  ig_followers, ig_followers_growth, ig_following,
  ig_posts_count, ig_reels_count, ig_stories_count,
  ig_impressions, ig_reach, ig_avg_reach_per_day,
  ig_engagement_rate, ig_total_interactions,
  ig_likes, ig_comments, ig_shares, ig_saves,
  ig_story_impressions, ig_avg_story_reach, ig_reel_avg_reach,
  fb_followers, fb_followers_growth, fb_page_views,
  fb_impressions, fb_total_views,
  fb_posts_count, fb_reels_count, fb_stories_count,
  fb_engagement_rate, fb_total_interactions,
  ig_top_posts, ig_top_reels, ig_demographics, ig_hashtags, ig_sponsored,
  fb_top_posts, fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'APT 101'),
  '2026-02',
  42840, 6.24, NULL,
  12, 8, 56,
  324840, 154840, 6451.67,
  8.24, 7248,
  5284, 648, 984, 332,
  48420, 1729.29, 18420.00,
  18240, 4.84, 8240,
  484200, 474800,
  10, 8, 48,
  4.84, 1984,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s at APT 101 💜 — sold out in 48hrs", "views": 42840, "reach": 21420, "likes": 1884, "comments": 248, "saved": 184, "shares": 284, "engagement": 12.10},
    {"published": "Feb 8, 2026", "title": "Saturday night at APT 101 🎶 — the vibe is unmatched", "views": 34840, "reach": 17420, "likes": 1484, "comments": 184, "saved": 148, "shares": 224, "engagement": 11.63},
    {"published": "Feb 20, 2026", "title": "Page Seven 🍸 — Bangkok''s most talked-about hidden bar", "views": 24840, "reach": 12420, "likes": 984, "comments": 124, "saved": 184, "shares": 148, "engagement": 11.60},
    {"published": "Feb 5, 2026", "title": "The lineup drops tomorrow 👀 — APT 101 February", "views": 18420, "reach": 9240, "likes": 684, "comments": 148, "saved": 84, "shares": 184, "engagement": 11.95},
    {"published": "Feb 22, 2026", "title": "March events — what''s next at APT 101 🗓️", "views": 14840, "reach": 7420, "likes": 484, "comments": 84, "saved": 68, "shares": 124, "engagement": 10.19}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Night at APT 101 💜 — the after movie", "views": 84840, "reach": 42420, "likes": 3484, "comments": 384, "saved": 484, "shares": 724, "engagement": 12.09, "watch_time": "2m 24s", "avg_watch_time": "32s"},
    {"published": "Feb 8, 2026", "title": "APT 101 Saturday Night — the full experience 🎶", "views": 64840, "reach": 32420, "likes": 2484, "comments": 284, "saved": 384, "shares": 524, "engagement": 11.34, "watch_time": "2m 08s", "avg_watch_time": "28s"},
    {"published": "Feb 20, 2026", "title": "Page Seven — Bangkok''s secret cocktail bar 🍸", "views": 48420, "reach": 24240, "likes": 1884, "comments": 224, "saved": 484, "shares": 384, "engagement": 12.28, "watch_time": "1m 52s", "avg_watch_time": "25s"},
    {"published": "Feb 5, 2026", "title": "DJ set preview — APT 101 February resident 🎧", "views": 32840, "reach": 16420, "likes": 1184, "comments": 184, "saved": 248, "shares": 284, "engagement": 11.58, "watch_time": "1m 28s", "avg_watch_time": "21s"},
    {"published": "Feb 22, 2026", "title": "Songkran at APT 101 — March announcement 🎉", "views": 24840, "reach": 12420, "likes": 848, "comments": 124, "saved": 184, "shares": 248, "engagement": 11.30, "watch_time": "1m 08s", "avg_watch_time": "17s"},
    {"published": "Feb 11, 2026", "title": "Inside Page Seven after midnight 🍸🌙", "views": 18840, "reach": 9420, "likes": 624, "comments": 98, "saved": 148, "shares": 184, "engagement": 11.13, "watch_time": "58s", "avg_watch_time": "14s"},
    {"published": "Feb 1, 2026", "title": "February at APT 101 — the trailer 🎬", "views": 14840, "reach": 7420, "likes": 484, "comments": 68, "saved": 108, "shares": 124, "engagement": 10.47, "watch_time": "48s", "avg_watch_time": "12s"},
    {"published": "Feb 25, 2026", "title": "The crowd at APT 101 last Saturday 🕺", "views": 12840, "reach": 6420, "likes": 384, "comments": 64, "saved": 84, "shares": 104, "engagement": 9.94, "watch_time": "42s", "avg_watch_time": "11s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 34, "25-34": 48, "35-44": 14, "45-54": 3, "55+": 1},
    "gender": {"male": 54, "female": 46},
    "top_cities": [{"city": "Bangkok", "pct": 62}, {"city": "Singapore", "pct": 10}, {"city": "Hong Kong", "pct": 8}, {"city": "Sydney", "pct": 4}, {"city": "Other", "pct": 16}]
  }'::jsonb,
  '[
    {"tag": "#APT101Bangkok", "uses": 984},
    {"tag": "#PageSeven", "uses": 724},
    {"tag": "#BangkokNightlife", "uses": 648},
    {"tag": "#BangkokClub", "uses": 524},
    {"tag": "#SohoHospitality", "uses": 384}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Night at APT 101 💜 — Book Your Table", "reach": 32840, "likes": 1084, "comments": 184, "shares": 384, "engagement": 5.03},
    {"published": "Feb 8, 2026", "title": "Saturday Night at APT 101 — Bangkok''s #1 Club Night", "reach": 24840, "likes": 784, "comments": 124, "shares": 284, "engagement": 4.81}
  ]'::jsonb,
  '{
    "age": {"18-24": 32, "25-34": 46, "35-44": 16, "45-54": 4, "55+": 2},
    "gender": {"male": 52, "female": 48},
    "top_cities": [{"city": "Bangkok", "pct": 64}, {"city": "Singapore", "pct": 10}, {"city": "Hong Kong", "pct": 8}, {"city": "Melbourne", "pct": 4}, {"city": "Other", "pct": 14}]
  }'::jsonb
);


-- ── YANKII ───────────────────────────────────────────────
INSERT INTO social_media_monthly (
  venue_id, month,
  ig_followers, ig_followers_growth, ig_following,
  ig_posts_count, ig_reels_count, ig_stories_count,
  ig_impressions, ig_reach, ig_avg_reach_per_day,
  ig_engagement_rate, ig_total_interactions,
  ig_likes, ig_comments, ig_shares, ig_saves,
  ig_story_impressions, ig_avg_story_reach, ig_reel_avg_reach,
  fb_followers, fb_followers_growth, fb_page_views,
  fb_impressions, fb_total_views,
  fb_posts_count, fb_reels_count, fb_stories_count,
  fb_engagement_rate, fb_total_interactions,
  ig_top_posts, ig_top_reels, ig_demographics, ig_hashtags, ig_sponsored,
  fb_top_posts, fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'YANKII'),
  '2026-02',
  12840, 3.24, NULL,
  14, 5, 28,
  124840, 58420, 2434.17,
  6.24, 2248,
  1684, 184, 284, 96,
  16840, 601.43, 7840.00,
  6840, 2.24, 2840,
  124800, 122400,
  12, 5, 24,
  2.84, 484,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s at YANKII 🌸 — Japanese romance in Bangkok", "views": 12840, "reach": 6420, "likes": 524, "comments": 64, "saved": 148, "shares": 84, "engagement": 12.68},
    {"published": "Feb 10, 2026", "title": "Omakase experience 🍣 — 8 courses of precision", "views": 10840, "reach": 5420, "likes": 424, "comments": 48, "saved": 148, "shares": 64, "engagement": 12.71},
    {"published": "Feb 20, 2026", "title": "Wagyu Wednesday at YANKII 🥩 — new addition", "views": 8840, "reach": 4420, "likes": 324, "comments": 38, "saved": 108, "shares": 48, "engagement": 11.76},
    {"published": "Feb 4, 2026", "title": "Chef''s hands at YANKII — the craft behind every plate", "views": 6840, "reach": 3420, "likes": 224, "comments": 24, "saved": 84, "shares": 34, "engagement": 10.70},
    {"published": "Feb 24, 2026", "title": "Sake collection — now available for pairing 🍶", "views": 5840, "reach": 2920, "likes": 184, "comments": 18, "saved": 68, "shares": 28, "engagement": 10.21}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Omakase at YANKII 🌸🍣 — sold out", "views": 28420, "reach": 14240, "likes": 1084, "comments": 124, "saved": 384, "shares": 184, "engagement": 12.55, "watch_time": "1m 52s", "avg_watch_time": "25s"},
    {"published": "Feb 10, 2026", "title": "The YANKII omakase — 8 courses, zero compromise 🍣", "views": 22840, "reach": 11420, "likes": 824, "comments": 98, "saved": 284, "shares": 148, "engagement": 11.86, "watch_time": "1m 38s", "avg_watch_time": "22s"},
    {"published": "Feb 20, 2026", "title": "Wagyu Wednesday — new at YANKII 🥩", "views": 16840, "reach": 8420, "likes": 584, "comments": 68, "saved": 224, "shares": 108, "engagement": 11.60, "watch_time": "1m 12s", "avg_watch_time": "18s"},
    {"published": "Feb 4, 2026", "title": "Behind the knife — YANKII prep kitchen 🔪", "views": 12840, "reach": 6420, "likes": 424, "comments": 48, "saved": 164, "shares": 84, "engagement": 11.22, "watch_time": "58s", "avg_watch_time": "14s"},
    {"published": "Feb 25, 2026", "title": "Sake & food pairing — March experience at YANKII 🍶", "views": 9840, "reach": 4920, "likes": 324, "comments": 38, "saved": 124, "shares": 64, "engagement": 11.16, "watch_time": "48s", "avg_watch_time": "12s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 14, "25-34": 46, "35-44": 28, "45-54": 10, "55+": 2},
    "gender": {"male": 50, "female": 50},
    "top_cities": [{"city": "Bangkok", "pct": 54}, {"city": "Tokyo", "pct": 10}, {"city": "Singapore", "pct": 10}, {"city": "Hong Kong", "pct": 6}, {"city": "Other", "pct": 20}]
  }'::jsonb,
  '[
    {"tag": "#YANKIIBangkok", "uses": 384},
    {"tag": "#OmakaseBangkok", "uses": 284},
    {"tag": "#JapaneseFoodBangkok", "uses": 248},
    {"tag": "#BangkokDining", "uses": 184},
    {"tag": "#WagyuBangkok", "uses": 148}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Omakase at YANKII 🌸 — Reserve Your Seat", "reach": 12840, "likes": 384, "comments": 48, "shares": 124, "engagement": 4.33},
    {"published": "Feb 10, 2026", "title": "The full omakase experience — YANKII Bangkok 🍣", "reach": 9840, "likes": 284, "comments": 34, "shares": 84, "engagement": 4.10}
  ]'::jsonb,
  '{
    "age": {"18-24": 12, "25-34": 44, "35-44": 30, "45-54": 10, "55+": 4},
    "gender": {"male": 48, "female": 52},
    "top_cities": [{"city": "Bangkok", "pct": 56}, {"city": "Tokyo", "pct": 10}, {"city": "Singapore", "pct": 10}, {"city": "Hong Kong", "pct": 6}, {"city": "Other", "pct": 18}]
  }'::jsonb
);


-- ── CHARCOAL TANDOOR FIRE GRILL ──────────────────────────
INSERT INTO social_media_monthly (
  venue_id, month,
  ig_followers, ig_followers_growth, ig_following,
  ig_posts_count, ig_reels_count, ig_stories_count,
  ig_impressions, ig_reach, ig_avg_reach_per_day,
  ig_engagement_rate, ig_total_interactions,
  ig_likes, ig_comments, ig_shares, ig_saves,
  ig_story_impressions, ig_avg_story_reach, ig_reel_avg_reach,
  fb_followers, fb_followers_growth, fb_page_views,
  fb_impressions, fb_total_views,
  fb_posts_count, fb_reels_count, fb_stories_count,
  fb_engagement_rate, fb_total_interactions,
  ig_top_posts, ig_top_reels, ig_demographics, ig_hashtags, ig_sponsored,
  fb_top_posts, fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'Charcoal Tandoor'),
  '2026-02',
  8420, 2.84, NULL,
  14, 4, 22,
  84840, 38420, 1600.83,
  5.84, 1648,
  1184, 148, 184, 132,
  10840, 387.14, 6240.00,
  4840, 1.84, 1840,
  84200, 82400,
  12, 4, 20,
  2.14, 284,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Grill Night 🌹🔥 — Charcoal Tandoor", "views": 8420, "reach": 4240, "likes": 348, "comments": 42, "saved": 84, "shares": 58, "engagement": 12.55},
    {"published": "Feb 10, 2026", "title": "Tandoor fire — the art of charcoal cooking 🔥", "views": 6840, "reach": 3420, "likes": 284, "comments": 34, "saved": 68, "shares": 48, "engagement": 12.69},
    {"published": "Feb 20, 2026", "title": "Signature lamb chop — 12 hours in the tandoor 🍖", "views": 5840, "reach": 2920, "likes": 224, "comments": 28, "saved": 58, "shares": 38, "engagement": 11.92},
    {"published": "Feb 4, 2026", "title": "Naan bread freshly made — daily at Charcoal 🫓", "views": 4840, "reach": 2420, "likes": 184, "comments": 18, "saved": 48, "shares": 28, "engagement": 11.49},
    {"published": "Feb 24, 2026", "title": "Holi is coming 🎨 — special thali menu in March", "views": 4280, "reach": 2140, "likes": 148, "comments": 14, "saved": 42, "shares": 24, "engagement": 10.65}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Tandoor Night 🌹🔥 — Charcoal Bangkok", "views": 18420, "reach": 9240, "likes": 684, "comments": 84, "saved": 248, "shares": 148, "engagement": 12.55, "watch_time": "1m 32s", "avg_watch_time": "20s"},
    {"published": "Feb 10, 2026", "title": "The tandoor in action — Charcoal''s signature fire 🔥", "views": 14840, "reach": 7420, "likes": 524, "comments": 64, "saved": 184, "shares": 108, "engagement": 11.76, "watch_time": "1m 18s", "avg_watch_time": "17s"},
    {"published": "Feb 20, 2026", "title": "Lamb chop masterclass — 12 hours in the tandoor 🍖", "views": 11840, "reach": 5920, "likes": 424, "comments": 48, "saved": 148, "shares": 84, "engagement": 11.89, "watch_time": "1m 04s", "avg_watch_time": "15s"},
    {"published": "Feb 4, 2026", "title": "Charcoal Tandoor — behind the kitchen 🍛", "views": 8840, "reach": 4420, "likes": 284, "comments": 34, "saved": 108, "shares": 64, "engagement": 11.07, "watch_time": "52s", "avg_watch_time": "13s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 16, "25-34": 38, "35-44": 28, "45-54": 14, "55+": 4},
    "gender": {"male": 52, "female": 48},
    "top_cities": [{"city": "Bangkok", "pct": 48}, {"city": "Mumbai", "pct": 12}, {"city": "Delhi", "pct": 10}, {"city": "Singapore", "pct": 8}, {"city": "Other", "pct": 22}]
  }'::jsonb,
  '[
    {"tag": "#CharcoalTandoor", "uses": 284},
    {"tag": "#TandoorBangkok", "uses": 248},
    {"tag": "#IndianFoodBangkok", "uses": 184},
    {"tag": "#FireGrill", "uses": 148},
    {"tag": "#BangkokDining", "uses": 124}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Grill Night at Charcoal 🌹🔥", "reach": 8420, "likes": 248, "comments": 34, "shares": 84, "engagement": 4.35},
    {"published": "Feb 10, 2026", "title": "The tandoor fire — Charcoal''s signature 🔥", "reach": 6240, "likes": 184, "comments": 24, "shares": 64, "engagement": 4.36}
  ]'::jsonb,
  '{
    "age": {"18-24": 14, "25-34": 36, "35-44": 30, "45-54": 14, "55+": 6},
    "gender": {"male": 50, "female": 50},
    "top_cities": [{"city": "Bangkok", "pct": 50}, {"city": "Mumbai", "pct": 12}, {"city": "Delhi", "pct": 10}, {"city": "Singapore", "pct": 8}, {"city": "Other", "pct": 20}]
  }'::jsonb
);


-- ── CANTINA ──────────────────────────────────────────────
INSERT INTO social_media_monthly (
  venue_id, month,
  ig_followers, ig_followers_growth, ig_following,
  ig_posts_count, ig_reels_count, ig_stories_count,
  ig_impressions, ig_reach, ig_avg_reach_per_day,
  ig_engagement_rate, ig_total_interactions,
  ig_likes, ig_comments, ig_shares, ig_saves,
  ig_story_impressions, ig_avg_story_reach, ig_reel_avg_reach,
  fb_followers, fb_followers_growth, fb_page_views,
  fb_impressions, fb_total_views,
  fb_posts_count, fb_reels_count, fb_stories_count,
  fb_engagement_rate, fb_total_interactions,
  ig_top_posts, ig_top_reels, ig_demographics, ig_hashtags, ig_sponsored,
  fb_top_posts, fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'Cantina'),
  '2026-02',
  6840, 2.14, NULL,
  16, 4, 24,
  68420, 31840, 1326.67,
  6.84, 1484,
  1084, 124, 184, 92,
  8840, 315.71, 5240.00,
  3840, 1.64, 1240,
  68400, 67200,
  14, 4, 20,
  1.84, 184,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Latin Night 💃🌹 — Cantina Bangkok", "views": 6840, "reach": 3420, "likes": 284, "comments": 38, "saved": 68, "shares": 48, "engagement": 12.80},
    {"published": "Feb 10, 2026", "title": "Taco Tuesday 🌮 — every week at Cantina", "views": 5840, "reach": 2920, "likes": 224, "comments": 28, "saved": 52, "shares": 38, "engagement": 11.71},
    {"published": "Feb 20, 2026", "title": "New margarita menu 🍹 — 8 signatures now available", "views": 4840, "reach": 2420, "likes": 184, "comments": 22, "saved": 48, "shares": 32, "engagement": 11.82},
    {"published": "Feb 4, 2026", "title": "Fresh tortillas — made daily at Cantina 🫓", "views": 3840, "reach": 1920, "likes": 148, "comments": 14, "saved": 38, "shares": 24, "engagement": 11.66},
    {"published": "Feb 24, 2026", "title": "Cinco de Mayo — save the date 🎉", "views": 3280, "reach": 1640, "likes": 124, "comments": 12, "saved": 32, "shares": 18, "engagement": 11.34}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Latin Night at Cantina 💃🌹", "views": 14840, "reach": 7420, "likes": 584, "comments": 72, "saved": 148, "shares": 108, "engagement": 12.28, "watch_time": "1m 18s", "avg_watch_time": "18s"},
    {"published": "Feb 10, 2026", "title": "Taco Tuesday done right 🌮 — Cantina Bangkok", "views": 11840, "reach": 5920, "likes": 424, "comments": 52, "saved": 108, "shares": 84, "engagement": 11.29, "watch_time": "1m 04s", "avg_watch_time": "15s"},
    {"published": "Feb 20, 2026", "title": "8 signature margaritas — Cantina''s new cocktail menu 🍹", "views": 8840, "reach": 4420, "likes": 324, "comments": 38, "saved": 84, "shares": 64, "engagement": 11.56, "watch_time": "52s", "avg_watch_time": "13s"},
    {"published": "Feb 24, 2026", "title": "Cinco de Mayo at Cantina Bangkok 🎉 — save the date", "views": 6840, "reach": 3420, "likes": 248, "comments": 28, "saved": 64, "shares": 48, "engagement": 11.34, "watch_time": "42s", "avg_watch_time": "11s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 28, "25-34": 46, "35-44": 18, "45-54": 6, "55+": 2},
    "gender": {"male": 48, "female": 52},
    "top_cities": [{"city": "Bangkok", "pct": 60}, {"city": "Mexico City", "pct": 8}, {"city": "Singapore", "pct": 8}, {"city": "Los Angeles", "pct": 6}, {"city": "Other", "pct": 18}]
  }'::jsonb,
  '[
    {"tag": "#CantinaBangkok", "uses": 284},
    {"tag": "#TacoTuesdayBangkok", "uses": 248},
    {"tag": "#MargaritaLovers", "uses": 184},
    {"tag": "#MexicanFoodBangkok", "uses": 148},
    {"tag": "#BangkokDining", "uses": 124}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Latin Night — Cantina Bangkok 💃🌹", "reach": 6840, "likes": 224, "comments": 28, "shares": 68, "engagement": 4.68},
    {"published": "Feb 10, 2026", "title": "Taco Tuesday at Cantina 🌮 — every week", "reach": 5240, "likes": 164, "comments": 18, "shares": 48, "engagement": 4.39}
  ]'::jsonb,
  '{
    "age": {"18-24": 26, "25-34": 44, "35-44": 20, "45-54": 8, "55+": 2},
    "gender": {"male": 46, "female": 54},
    "top_cities": [{"city": "Bangkok", "pct": 62}, {"city": "Singapore", "pct": 10}, {"city": "Los Angeles", "pct": 6}, {"city": "London", "pct": 4}, {"city": "Other", "pct": 18}]
  }'::jsonb
);
