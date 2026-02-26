-- ============================================================
-- Sheraton MOE Demo — Social Media + Monthly Rollup data
-- Part 1: monthly_rollups — add venue_group + Sheraton rows
-- Part 2: social_media_monthly — Feb 2026 for all 4 venues
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- PART 1 — monthly_rollups
-- ════════════════════════════════════════════════════════════

ALTER TABLE monthly_rollups
ADD COLUMN IF NOT EXISTS venue_group TEXT NOT NULL DEFAULT 'mpj';

UPDATE monthly_rollups SET venue_group = 'mpj' WHERE venue_group IS NULL OR venue_group = '';

-- Sheraton portfolio rollup — Jan 2026 (full month baseline)
-- 4 venues combined: budget 18,500 | revenue ~1.8M | 3,840 res
INSERT INTO monthly_rollups (month, ad_spend, revenue, reservations, venue_group)
VALUES ('Jan 2026', 15820.00, 1784200.00, 3840, 'sheraton')
ON CONFLICT DO NOTHING;

-- Sheraton portfolio rollup — Feb 2026 (1–24, 85.7% of month)
-- 4 venues: 10,604 + 1,762 + 1,780 + 2,231 = 16,377 spend
-- Revenue: 0 (MOE) + 628,540 + 557,820 + 712,480 = 1,898,840
-- Reservations: 0 + 1,324 + 1,148 + 924 = 3,396
INSERT INTO monthly_rollups (month, ad_spend, revenue, reservations, venue_group)
VALUES ('Feb 2026', 16377.00, 1898840.00, 3396, 'sheraton')
ON CONFLICT DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- PART 2 — social_media_monthly (Feb 2026)
-- ════════════════════════════════════════════════════════════

-- ── SHERATON MOE ─────────────────────────────────────────
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
  (SELECT id FROM venues WHERE name = 'Sheraton MOE'),
  '2026-02',
  8420, 2.14, NULL,
  14, 3, 28,
  142840, 68420, 2872.50,
  3.82, 2184,
  1840, 112, 186, 46,
  18640, 498.20, 3840.00,
  12680, 1.84, 4240,
  284600, 281200,
  14, 3, 24,
  2.14, 824,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Staycation at Sheraton MOE 🌹", "views": 8420, "reach": 4180, "likes": 312, "comments": 28, "saved": 42, "shares": 18, "engagement": 9.56},
    {"published": "Feb 7, 2026", "title": "Weekend getaway starts here — pool deck open", "views": 5840, "reach": 2940, "likes": 184, "comments": 14, "saved": 28, "shares": 12, "engagement": 8.10},
    {"published": "Feb 21, 2026", "title": "Your MOE staycation package — limited availability", "views": 4920, "reach": 2480, "likes": 148, "comments": 18, "saved": 34, "shares": 8, "engagement": 8.39},
    {"published": "Feb 3, 2026", "title": "Business meets luxury at Sheraton MOE", "views": 3640, "reach": 1840, "likes": 96, "comments": 8, "saved": 14, "shares": 6, "engagement": 6.74},
    {"published": "Feb 18, 2026", "title": "F&B experiences at the hotel this weekend", "views": 3280, "reach": 1640, "likes": 88, "comments": 6, "saved": 18, "shares": 4, "engagement": 7.07}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s at Sheraton MOE 🌹 — Rooms & Dining", "views": 24840, "reach": 12420, "likes": 682, "comments": 48, "saved": 124, "shares": 86, "engagement": 7.56, "watch_time": "1m 42s", "avg_watch_time": "18s"},
    {"published": "Feb 7, 2026", "title": "Pool deck & skyline views — your MOE weekend", "views": 18640, "reach": 9240, "likes": 428, "comments": 32, "saved": 84, "shares": 62, "engagement": 6.54, "watch_time": "1m 18s", "avg_watch_time": "14s"},
    {"published": "Feb 22, 2026", "title": "Spring at Sheraton — what''s on in March", "views": 12480, "reach": 6240, "likes": 284, "comments": 18, "saved": 56, "shares": 38, "engagement": 6.34, "watch_time": "58s", "avg_watch_time": "11s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 12, "25-34": 34, "35-44": 28, "45-54": 18, "55+": 8},
    "gender": {"male": 48, "female": 52},
    "top_cities": [{"city": "Dubai", "pct": 62}, {"city": "Abu Dhabi", "pct": 14}, {"city": "Riyadh", "pct": 8}, {"city": "London", "pct": 6}, {"city": "Other", "pct": 10}]
  }'::jsonb,
  '[
    {"tag": "#SheratonMOE", "uses": 284},
    {"tag": "#MallOfTheEmirates", "uses": 198},
    {"tag": "#DubaiHotel", "uses": 164},
    {"tag": "#LuxuryDubai", "uses": 142},
    {"tag": "#DubaiStaycation", "uses": 128}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Staycation Package 🌹", "reach": 18420, "likes": 428, "comments": 42, "shares": 84, "engagement": 3.02},
    {"published": "Feb 7, 2026", "title": "Weekend Pool Package — Book Now", "reach": 12840, "likes": 284, "comments": 28, "shares": 56, "engagement": 2.87}
  ]'::jsonb,
  '{
    "age": {"18-24": 10, "25-34": 32, "35-44": 30, "45-54": 20, "55+": 8},
    "gender": {"male": 46, "female": 54},
    "top_cities": [{"city": "Dubai", "pct": 68}, {"city": "Abu Dhabi", "pct": 12}, {"city": "Sharjah", "pct": 6}, {"city": "Riyadh", "pct": 4}, {"city": "Other", "pct": 10}]
  }'::jsonb
);


-- ── BESH TURKISH KITCHEN ─────────────────────────────────
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
  (SELECT id FROM venues WHERE name = 'Besh Turkish Kitchen'),
  '2026-02',
  3284, 3.24, NULL,
  12, 4, 18,
  48420, 22840, 951.67,
  4.24, 682,
  548, 38, 64, 32,
  4820, 184.20, 2840.00,
  1842, 2.18, 840,
  84200, 82400,
  12, 4, 16,
  1.84, 184,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s at Besh 🌹 — Turkish romance awaits", "views": 4280, "reach": 2140, "likes": 184, "comments": 18, "saved": 28, "shares": 12, "engagement": 11.31},
    {"published": "Feb 10, 2026", "title": "Mezze feast for two 🍽️ — share the experience", "views": 3840, "reach": 1820, "likes": 148, "comments": 12, "saved": 22, "shares": 8, "engagement": 10.44},
    {"published": "Feb 20, 2026", "title": "Fresh from Istanbul — new mezze additions", "views": 2980, "reach": 1480, "likes": 98, "comments": 8, "saved": 18, "shares": 6, "engagement": 8.78},
    {"published": "Feb 3, 2026", "title": "Turkish brunch every Friday at Besh", "views": 2640, "reach": 1280, "likes": 84, "comments": 6, "saved": 14, "shares": 4, "engagement": 8.44},
    {"published": "Feb 24, 2026", "title": "Ramadan is coming — save the date 🌙", "views": 2280, "reach": 1140, "likes": 72, "comments": 10, "saved": 20, "shares": 8, "engagement": 9.65}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Couple''s Menu at Besh 🌹", "views": 12840, "reach": 6420, "likes": 384, "comments": 28, "saved": 68, "shares": 42, "engagement": 8.08, "watch_time": "1m 24s", "avg_watch_time": "16s"},
    {"published": "Feb 8, 2026", "title": "The Besh mezze experience — chef''s table", "views": 9840, "reach": 4820, "likes": 284, "comments": 18, "saved": 48, "shares": 28, "engagement": 7.68, "watch_time": "1m 12s", "avg_watch_time": "14s"},
    {"published": "Feb 20, 2026", "title": "New dish alert 🍽️ — Turkish lamb special", "views": 7240, "reach": 3620, "likes": 198, "comments": 14, "saved": 36, "shares": 18, "engagement": 7.35, "watch_time": "58s", "avg_watch_time": "12s"},
    {"published": "Feb 25, 2026", "title": "Weekend at Besh — table for two?", "views": 5840, "reach": 2920, "likes": 148, "comments": 8, "saved": 24, "shares": 12, "engagement": 6.58, "watch_time": "52s", "avg_watch_time": "10s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 18, "25-34": 42, "35-44": 26, "45-54": 10, "55+": 4},
    "gender": {"male": 44, "female": 56},
    "top_cities": [{"city": "Dubai", "pct": 72}, {"city": "Abu Dhabi", "pct": 10}, {"city": "Sharjah", "pct": 8}, {"city": "Riyadh", "pct": 4}, {"city": "Other", "pct": 6}]
  }'::jsonb,
  '[
    {"tag": "#BeshDubai", "uses": 184},
    {"tag": "#TurkishFood", "uses": 164},
    {"tag": "#DubaiRestaurants", "uses": 142},
    {"tag": "#MezzeLovers", "uses": 98},
    {"tag": "#SheratonMOE", "uses": 84}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Table for Two at Besh 🌹", "reach": 5840, "likes": 164, "comments": 18, "shares": 42, "engagement": 3.84},
    {"published": "Feb 8, 2026", "title": "Turkish Mezze — now available for delivery", "reach": 3840, "likes": 98, "comments": 8, "shares": 24, "engagement": 3.39}
  ]'::jsonb,
  '{
    "age": {"18-24": 16, "25-34": 40, "35-44": 28, "45-54": 12, "55+": 4},
    "gender": {"male": 42, "female": 58},
    "top_cities": [{"city": "Dubai", "pct": 74}, {"city": "Abu Dhabi", "pct": 10}, {"city": "Sharjah", "pct": 8}, {"city": "Other", "pct": 8}]
  }'::jsonb
);


-- ── SPARTAN SPORTS BAR ───────────────────────────────────
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
  (SELECT id FROM venues WHERE name = 'Spartan Sports Bar'),
  '2026-02',
  2842, 2.84, NULL,
  15, 5, 22,
  52640, 24280, 1011.67,
  5.14, 824,
  624, 84, 82, 34,
  6840, 248.40, 3240.00,
  1428, 3.14, 620,
  96400, 94200,
  14, 5, 20,
  2.84, 248,
  '[
    {"published": "Feb 8, 2026", "title": "UCL Night at Spartan 🏆 — live on the big screen", "views": 6240, "reach": 2940, "likes": 248, "comments": 42, "saved": 18, "shares": 64, "engagement": 12.59},
    {"published": "Feb 18, 2026", "title": "Champions League — Round of 16 screening tonight", "views": 5840, "reach": 2740, "likes": 218, "comments": 38, "saved": 14, "shares": 58, "engagement": 11.97},
    {"published": "Feb 14, 2026", "title": "Valentine''s at Spartan — bring your match day crew ⚽", "views": 4280, "reach": 2080, "likes": 148, "comments": 24, "saved": 12, "shares": 42, "engagement": 10.87},
    {"published": "Feb 5, 2026", "title": "Happy Hour 4-7PM daily 🍺 — no cover", "views": 3640, "reach": 1740, "likes": 108, "comments": 18, "saved": 8, "shares": 28, "engagement": 8.85},
    {"published": "Feb 22, 2026", "title": "Last 16 fixtures — Spartan''s screening schedule", "views": 3280, "reach": 1580, "likes": 98, "comments": 16, "saved": 6, "shares": 24, "engagement": 8.86}
  ]'::jsonb,
  '[
    {"published": "Feb 8, 2026", "title": "UCL Match Night Vibe at Spartan 🏆", "views": 18640, "reach": 8840, "likes": 584, "comments": 84, "saved": 42, "shares": 148, "engagement": 9.71, "watch_time": "1m 32s", "avg_watch_time": "22s"},
    {"published": "Feb 18, 2026", "title": "Round of 16 — pre-game at Spartan Sports Bar", "views": 14280, "reach": 6840, "likes": 428, "comments": 62, "saved": 28, "shares": 112, "engagement": 9.21, "watch_time": "1m 18s", "avg_watch_time": "18s"},
    {"published": "Feb 5, 2026", "title": "Happy Hour highlights — 4PM to 7PM daily 🍺", "views": 8640, "reach": 4120, "likes": 248, "comments": 28, "saved": 18, "shares": 64, "engagement": 8.69, "watch_time": "48s", "avg_watch_time": "12s"},
    {"published": "Feb 22, 2026", "title": "UCL R16 Fixture Guide — save & share", "views": 6840, "reach": 3280, "likes": 184, "comments": 24, "saved": 28, "shares": 84, "engagement": 9.76, "watch_time": "42s", "avg_watch_time": "10s"},
    {"published": "Feb 12, 2026", "title": "Sports Saturday at Spartan — all-day screens", "views": 5840, "reach": 2840, "likes": 148, "comments": 18, "saved": 14, "shares": 48, "engagement": 7.96, "watch_time": "38s", "avg_watch_time": "9s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 28, "25-34": 44, "35-44": 20, "45-54": 6, "55+": 2},
    "gender": {"male": 72, "female": 28},
    "top_cities": [{"city": "Dubai", "pct": 76}, {"city": "Abu Dhabi", "pct": 8}, {"city": "Sharjah", "pct": 8}, {"city": "Riyadh", "pct": 4}, {"city": "Other", "pct": 4}]
  }'::jsonb,
  '[
    {"tag": "#SpartanDubai", "uses": 248},
    {"tag": "#UCLDubai", "uses": 218},
    {"tag": "#SportsBarDubai", "uses": 184},
    {"tag": "#HappyHourDubai", "uses": 142},
    {"tag": "#ChampionsLeague", "uses": 128}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 8, 2026", "title": "UCL Night — book your table for the big game 🏆", "reach": 8240, "likes": 284, "comments": 48, "shares": 124, "engagement": 5.54},
    {"published": "Feb 5, 2026", "title": "Happy Hour everyday 4–7PM at Spartan", "reach": 5640, "likes": 164, "comments": 28, "shares": 68, "engagement": 4.61}
  ]'::jsonb,
  '{
    "age": {"18-24": 26, "25-34": 42, "35-44": 22, "45-54": 8, "55+": 2},
    "gender": {"male": 70, "female": 30},
    "top_cities": [{"city": "Dubai", "pct": 78}, {"city": "Abu Dhabi", "pct": 8}, {"city": "Sharjah", "pct": 8}, {"city": "Other", "pct": 6}]
  }'::jsonb
);


-- ── OANJO DUBAI ──────────────────────────────────────────
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
  (SELECT id FROM venues WHERE name = 'OAnjo Dubai'),
  '2026-02',
  4128, 4.84, NULL,
  10, 3, 16,
  62480, 29840, 1243.33,
  6.24, 1248,
  884, 68, 148, 148,
  8240, 362.40, 4820.00,
  2184, 3.84, 1240,
  112800, 110400,
  10, 3, 14,
  3.24, 428,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Fine Dining at OAnjo 🍷 — 5 course set menu", "views": 9840, "reach": 4820, "likes": 348, "comments": 42, "saved": 84, "shares": 28, "engagement": 10.58},
    {"published": "Feb 21, 2026", "title": "Chef''s table — intimate dining experience 🍽️", "views": 7240, "reach": 3620, "likes": 248, "comments": 28, "saved": 68, "shares": 18, "engagement": 10.01},
    {"published": "Feb 7, 2026", "title": "Weekend tasting menu — book your seat", "views": 5840, "reach": 2940, "likes": 184, "comments": 18, "saved": 52, "shares": 12, "engagement": 9.05},
    {"published": "Feb 3, 2026", "title": "New signature dish — Portuguese meets Dubai", "views": 4840, "reach": 2420, "likes": 148, "comments": 14, "saved": 42, "shares": 10, "engagement": 8.84},
    {"published": "Feb 24, 2026", "title": "Spring menu — coming next month 🌿", "views": 4280, "reach": 2140, "likes": 128, "comments": 12, "saved": 38, "shares": 8, "engagement": 8.69}
  ]'::jsonb,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s at OAnjo — 5 Course Fine Dining 🍷", "views": 22840, "reach": 11420, "likes": 784, "comments": 68, "saved": 248, "shares": 84, "engagement": 10.37, "watch_time": "1m 48s", "avg_watch_time": "24s"},
    {"published": "Feb 7, 2026", "title": "OAnjo Chef''s Table — behind the scenes", "views": 16840, "reach": 8420, "likes": 548, "comments": 42, "saved": 184, "shares": 56, "engagement": 9.86, "watch_time": "1m 32s", "avg_watch_time": "21s"},
    {"published": "Feb 22, 2026", "title": "Spring menu preview 🌿 — save your seat for March", "views": 11240, "reach": 5620, "likes": 364, "comments": 28, "saved": 124, "shares": 38, "engagement": 9.88, "watch_time": "1m 12s", "avg_watch_time": "18s"}
  ]'::jsonb,
  '{
    "age": {"18-24": 10, "25-34": 36, "35-44": 32, "45-54": 16, "55+": 6},
    "gender": {"male": 46, "female": 54},
    "top_cities": [{"city": "Dubai", "pct": 64}, {"city": "Abu Dhabi", "pct": 12}, {"city": "Riyadh", "pct": 8}, {"city": "London", "pct": 6}, {"city": "Other", "pct": 10}]
  }'::jsonb,
  '[
    {"tag": "#OAnjoDubai", "uses": 284},
    {"tag": "#FineDiningDubai", "uses": 248},
    {"tag": "#PortugueseCuisine", "uses": 184},
    {"tag": "#DubaiRestaurants", "uses": 164},
    {"tag": "#SheratonMOE", "uses": 142}
  ]'::jsonb,
  NULL,
  '[
    {"published": "Feb 14, 2026", "title": "Valentine''s Fine Dining — Reserve Your Table 🍷", "reach": 9840, "likes": 284, "comments": 42, "shares": 84, "engagement": 4.18},
    {"published": "Feb 7, 2026", "title": "Chef''s Tasting Table — OAnjo Dubai", "reach": 6840, "likes": 184, "comments": 24, "shares": 56, "engagement": 3.86}
  ]'::jsonb,
  '{
    "age": {"18-24": 8, "25-34": 34, "35-44": 34, "45-54": 18, "55+": 6},
    "gender": {"male": 44, "female": 56},
    "top_cities": [{"city": "Dubai", "pct": 66}, {"city": "Abu Dhabi", "pct": 12}, {"city": "Riyadh", "pct": 8}, {"city": "London", "pct": 6}, {"city": "Other", "pct": 8}]
  }'::jsonb
);
