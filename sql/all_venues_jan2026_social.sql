-- All Venues - Social Media Monthly - January 2026
-- Source: Metricool PDF reports (01 Jan 26 - 31 Jan 26)
-- Venues: Acquasale, BHB, Cucina, Resort, Smoki Moto

-- ============================================================
-- 1. ACQUASALE
-- ============================================================
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
  (SELECT id FROM venues WHERE name = 'Acquasale'),
  '2026-01',

  -- Instagram KPIs
  939,            -- ig_followers
  1.95,           -- ig_followers_growth
  NULL,           -- ig_following
  12,             -- ig_posts_count
  1,              -- ig_reels_count
  9,              -- ig_stories_count
  19560,          -- ig_impressions (19.56K views)
  NULL,           -- ig_reach
  427.84,         -- ig_avg_reach_per_day
  4.14,           -- ig_engagement_rate
  59,             -- ig_total_interactions
  52,             -- ig_likes
  0,              -- ig_comments
  6,              -- ig_shares
  1,              -- ig_saves
  435,            -- ig_story_impressions
  47.89,          -- ig_avg_story_reach
  301.00,         -- ig_reel_avg_reach

  -- Facebook KPIs
  35,             -- fb_followers
  -5.41,          -- fb_followers_growth
  188,            -- fb_page_views
  107480,         -- fb_impressions (107.48K)
  106730,         -- fb_total_views (106.73K)
  12,             -- fb_posts_count
  1,              -- fb_reels_count
  8,              -- fb_stories_count
  0,              -- fb_engagement_rate
  0,              -- fb_total_interactions

  -- ig_top_posts
  '[
    {"published": "Jan 28, 2026", "title": "Midweek calls for a SPRITZY moment", "views": 348, "reach": 203, "likes": 6, "comments": 0, "saved": 0, "shares": null, "engagement": 4.43},
    {"published": "Jan 13, 2026", "title": "Let''s get the spritz ready", "views": 362, "reach": 201, "likes": 8, "comments": 0, "saved": 0, "shares": null, "engagement": 4.98},
    {"published": "Jan 7, 2026", "title": "Dough''s ready for wood-fired pizza and outdoor vib...", "views": 254, "reach": 124, "likes": 3, "comments": 0, "saved": 0, "shares": null, "engagement": 3.23},
    {"published": "Jan 25, 2026", "title": "All the flavours waiting for you", "views": 227, "reach": 122, "likes": 11, "comments": 0, "saved": 0, "shares": null, "engagement": 9.02},
    {"published": "Jan 9, 2026", "title": "When the crew is all in for PIZZA and SPRITZ", "views": 221, "reach": 114, "likes": 5, "comments": 0, "saved": 0, "shares": null, "engagement": 4.39},
    {"published": "Jan 18, 2026", "title": "Get your crew ready for pizza and spritz fun", "views": 178, "reach": 111, "likes": 3, "comments": 0, "saved": 0, "shares": null, "engagement": 2.70},
    {"published": "Jan 23, 2026", "title": "Pizza first or spritz? Why not both", "views": 171, "reach": 102, "likes": 3, "comments": 0, "saved": 0, "shares": null, "engagement": 2.94},
    {"published": "Jan 20, 2026", "title": "WOOD-FIRED ovens, olive trees, and twinkling light...", "views": 170, "reach": 98, "likes": 2, "comments": 0, "saved": 0, "shares": null, "engagement": 2.04},
    {"published": "Jan 5, 2026", "title": "Come through @acquasalebycucina as we ease into th...", "views": 202, "reach": 94, "likes": 1, "comments": 0, "saved": 1, "shares": null, "engagement": 2.13},
    {"published": "Jan 30, 2026", "title": "Weekend mode is on with WOOD-FIRED PIZZA fresh fro...", "views": 142, "reach": 90, "likes": 2, "comments": 0, "saved": 0, "shares": null, "engagement": 2.22},
    {"published": "Jan 16, 2026", "title": "Fridays are for wood-fired pizza", "views": 153, "reach": 89, "likes": 2, "comments": 0, "saved": 0, "shares": null, "engagement": 2.25},
    {"published": "Jan 11, 2026", "title": "Spritz things up at Acquasale", "views": 145, "reach": 78, "likes": 6, "comments": 0, "saved": 0, "shares": null, "engagement": 7.69}
  ]'::jsonb,

  -- ig_top_reels
  '[
    {"published": "Jan 2, 2026", "title": "Cheers to 2026, the Italian way!", "views": 446, "reach": 301, "likes": 3, "comments": 0, "saved": 1, "shares": 0, "engagement": 1.33, "watch_time": "2m 59s", "avg_watch_time": "3s"}
  ]'::jsonb,

  -- ig_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 69.05},
      {"name": "Italy", "pct": 8.87},
      {"name": "United Kingdom", "pct": 4.65},
      {"name": "Egypt", "pct": 1.73},
      {"name": "Iran", "pct": 1.73},
      {"name": "India", "pct": 1.52},
      {"name": "Australia", "pct": 0.87},
      {"name": "Germany", "pct": 0.76},
      {"name": "France", "pct": 0.65},
      {"name": "Saudi Arabia", "pct": 0.65}
    ],
    "cities": [
      {"name": "Dubai", "pct": 59.63},
      {"name": "Abu Dhabi", "pct": 3.90},
      {"name": "Sharjah", "pct": 2.06},
      {"name": "Al Lusayli", "pct": 0.87},
      {"name": "Al Ajman", "pct": 0.87},
      {"name": "London", "pct": 0.87},
      {"name": "Alghero", "pct": 0.65}
    ]
  }'::jsonb,

  -- ig_hashtags
  '[
    {"tag": "#cucinathepalm", "posts": 5, "views": 217, "likes": 4, "comments": 0},
    {"tag": "#italiandubai", "posts": 12, "views": 214, "likes": 4, "comments": 0},
    {"tag": "#woodfirepizzadubai", "posts": 12, "views": 214, "likes": 4, "comments": 0},
    {"tag": "#acquasalebycucina", "posts": 12, "views": 214, "likes": 4, "comments": 0},
    {"tag": "#dubaipizza", "posts": 9, "views": 212, "likes": 4, "comments": 0}
  ]'::jsonb,

  -- ig_sponsored (none in report)
  NULL,

  -- fb_top_posts
  '[
    {"published": "Jan 11, 2026", "title": "Spritz things up at Acquasale...", "impressions": 5, "reach": 5, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 9, 2026", "title": "When the crew is all in for PI...", "impressions": 5, "reach": 5, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 7, 2026", "title": "Dough''s ready for wood-fired p...", "impressions": 5, "reach": 5, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 5, 2026", "title": "Come through @acquasalebycucin...", "impressions": 6, "reach": 5, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 13, 2026", "title": "Let''s get the spritz ready...", "impressions": 5, "reach": 4, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 25, 2026", "title": "All the flavours waiting for y...", "impressions": 3, "reach": 3, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0}
  ]'::jsonb,

  -- fb_demographics (from page 4 — not present in Acquasale report, FB demographics not shown separately)
  NULL
);

-- ============================================================
-- 2. BHB (Bal Harbour Beach)
-- ============================================================
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
  (SELECT id FROM venues WHERE name = 'BHB'),
  '2026-01',

  -- Instagram KPIs
  1794,           -- ig_followers
  1.64,           -- ig_followers_growth
  NULL,           -- ig_following
  9,              -- ig_posts_count
  2,              -- ig_reels_count
  39,             -- ig_stories_count
  15960,          -- ig_impressions (15.96K views)
  NULL,           -- ig_reach
  151.68,         -- ig_avg_reach_per_day
  4.14,           -- ig_engagement_rate
  122,            -- ig_total_interactions
  111,            -- ig_likes
  1,              -- ig_comments
  5,              -- ig_shares
  5,              -- ig_saves
  1981,           -- ig_story_impressions
  50.36,          -- ig_avg_story_reach
  405.50,         -- ig_reel_avg_reach

  -- Facebook KPIs
  26,             -- fb_followers
  0.00,           -- fb_followers_growth
  37,             -- fb_page_views
  44,             -- fb_impressions
  54,             -- fb_total_views
  11,             -- fb_posts_count
  2,              -- fb_reels_count
  15,             -- fb_stories_count
  0,              -- fb_engagement_rate
  0,              -- fb_total_interactions

  -- ig_top_posts
  '[
    {"published": "Jan 10, 2026", "title": "The kind of laugh you don''t explain", "views": 882, "reach": 498, "likes": 15, "comments": 0, "saved": 1, "shares": null, "engagement": 3.41},
    {"published": "Jan 26, 2026", "title": "Where friends meet, cocktails flow, and the beach...", "views": 800, "reach": 468, "likes": 18, "comments": 1, "saved": 1, "shares": null, "engagement": 4.70},
    {"published": "Jan 16, 2026", "title": "A stylish gateway to sun, sea, and signature Bal H...", "views": 569, "reach": 341, "likes": 11, "comments": 0, "saved": 0, "shares": null, "engagement": 3.23},
    {"published": "Jan 13, 2026", "title": "Meet the new Sando Menu at Bal Harbour", "views": 573, "reach": 312, "likes": 9, "comments": 0, "saved": 0, "shares": null, "engagement": 2.88},
    {"published": "Jan 6, 2026", "title": "If you''re smiling like this, you''re in the right p...", "views": 565, "reach": 310, "likes": 11, "comments": 0, "saved": 0, "shares": null, "engagement": 3.55},
    {"published": "Jan 19, 2026", "title": "This is the Coconut Bar moment", "views": 483, "reach": 286, "likes": 11, "comments": 0, "saved": 0, "shares": null, "engagement": 4.55},
    {"published": "Jan 12, 2026", "title": "Soft shade. Open space. Bal Harbour hits diffe...", "views": 478, "reach": 281, "likes": 14, "comments": 0, "saved": 0, "shares": null, "engagement": 4.98},
    {"published": "Jan 4, 2026", "title": "A front row seat to the sea, styled for comfort an...", "views": 536, "reach": 273, "likes": 13, "comments": 0, "saved": 2, "shares": null, "engagement": 5.49},
    {"published": "Jan 30, 2026", "title": "From refreshing mocktails to creamy iced coffees", "views": 318, "reach": 175, "likes": 9, "comments": 0, "saved": 1, "shares": null, "engagement": 5.71}
  ]'::jsonb,

  -- ig_top_reels
  '[
    {"published": "Jan 22, 2026", "title": "Meet your new beach obsession", "views": 910, "reach": 581, "likes": 27, "comments": 2, "saved": 1, "shares": 5, "engagement": 6.02, "watch_time": null, "avg_watch_time": null},
    {"published": "Jan 8, 2026", "title": "Where the vibe is golden and the moments are even...", "views": 299, "reach": 230, "likes": 9, "comments": 1, "saved": 0, "shares": 0, "engagement": 4.35, "watch_time": null, "avg_watch_time": null}
  ]'::jsonb,

  -- ig_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 48.23},
      {"name": "United Kingdom", "pct": 11.45},
      {"name": "Brazil", "pct": 8.04},
      {"name": "India", "pct": 7.43},
      {"name": "Germany", "pct": 1.64},
      {"name": "Pakistan", "pct": 1.58},
      {"name": "Iran", "pct": 1.34},
      {"name": "Russia", "pct": 1.34},
      {"name": "Italy", "pct": 1.28},
      {"name": "United States", "pct": 1.16}
    ],
    "cities": [
      {"name": "Dubai", "pct": 41.84},
      {"name": "Abu Dhabi", "pct": 3.11},
      {"name": "Sharjah", "pct": 1.34},
      {"name": "Al Ajman", "pct": 0.91},
      {"name": "Lahore", "pct": 0.91},
      {"name": "London", "pct": 0.91},
      {"name": "Sao Paulo", "pct": 0.79}
    ]
  }'::jsonb,

  -- ig_hashtags
  '[
    {"tag": "#bohobeachclub", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#balharbourescape", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#sipbackandrelax", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#balharbourlife", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#beachdaypass", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#allyours", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#beachsideindulgence", "posts": 1, "views": 882, "likes": 15, "comments": 0},
    {"tag": "#dubai", "posts": 6, "views": 645, "likes": 12, "comments": 0},
    {"tag": "#palmjumeirah", "posts": 6, "views": 645, "likes": 12, "comments": 0},
    {"tag": "#balharbour", "posts": 7, "views": 629, "likes": 12, "comments": 0},
    {"tag": "#sunkissed", "posts": 7, "views": 629, "likes": 12, "comments": 0},
    {"tag": "#palmwestbeach", "posts": 8, "views": 583, "likes": 12, "comments": 0},
    {"tag": "#marriottresortpalmjumeirah", "posts": 8, "views": 583, "likes": 12, "comments": 0},
    {"tag": "#balharbourvibes", "posts": 9, "views": 578, "likes": 12, "comments": 0},
    {"tag": "#balharbourbeach", "posts": 9, "views": 578, "likes": 12, "comments": 0}
  ]'::jsonb,

  -- ig_sponsored (none in report)
  NULL,

  -- fb_top_posts
  '[
    {"published": "Jan 19, 2026", "title": "This is the Coconut Bar moment...", "impressions": 4, "reach": 4, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 16, 2026", "title": "A stylish gateway to sun, sea,...", "impressions": 5, "reach": 4, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 10, 2026", "title": "The kind of laugh you don''t ex...", "impressions": 5, "reach": 4, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 26, 2026", "title": "Where friends meet, cocktails...", "impressions": 4, "reach": 3, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 13, 2026", "title": "Meet the new sand menu at Bal...", "impressions": 3, "reach": 3, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 12, 2026", "title": "Soft shade. Open space...", "impressions": 3, "reach": 3, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0}
  ]'::jsonb,

  -- fb_demographics
  NULL
);

-- ============================================================
-- 3. CUCINA
-- ============================================================
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
  (SELECT id FROM venues WHERE name = 'Cucina'),
  '2026-01',

  -- Instagram KPIs
  6998,           -- ig_followers
  1.79,           -- ig_followers_growth
  NULL,           -- ig_following
  14,             -- ig_posts_count
  1,              -- ig_reels_count
  46,             -- ig_stories_count
  70430,          -- ig_impressions (70.43K views)
  NULL,           -- ig_reach
  968.06,         -- ig_avg_reach_per_day
  3.62,           -- ig_engagement_rate
  291,            -- ig_total_interactions
  248,            -- ig_likes
  10,             -- ig_comments
  19,             -- ig_shares
  14,             -- ig_saves
  7844,           -- ig_story_impressions
  168.50,         -- ig_avg_story_reach
  552.00,         -- ig_reel_avg_reach

  -- Facebook KPIs
  453,            -- fb_followers
  0.44,           -- fb_followers_growth
  702,            -- fb_page_views
  338290,         -- fb_impressions (338.29K)
  284630,         -- fb_total_views (284.63K)
  13,             -- fb_posts_count
  1,              -- fb_reels_count
  40,             -- fb_stories_count
  1.73,           -- fb_engagement_rate
  6,              -- fb_total_interactions

  -- ig_top_posts
  '[
    {"published": "Jan 2, 2026", "title": "2026 guest list goals: @angieselii", "views": 1606, "reach": 850, "likes": 19, "comments": 3, "saved": 0, "shares": null, "engagement": 2.59},
    {"published": "Jan 5, 2026", "title": "Filetto Cacio e Pepe - pasta meets meat in the mos...", "views": 1411, "reach": 831, "likes": 29, "comments": 0, "saved": 1, "shares": null, "engagement": 3.85},
    {"published": "Jan 18, 2026", "title": "The team''s shaking, pouring, and getting the drink...", "views": 1244, "reach": 766, "likes": 35, "comments": 0, "saved": 2, "shares": null, "engagement": 5.48},
    {"published": "Jan 21, 2026", "title": "Mid-week catch-ups just hit different with a full...", "views": 1167, "reach": 675, "likes": 25, "comments": 3, "saved": 2, "shares": null, "engagement": 4.59},
    {"published": "Jan 9, 2026", "title": "Family-style is kind of our thing", "views": 1055, "reach": 605, "likes": 15, "comments": 2, "saved": 0, "shares": null, "engagement": 2.98},
    {"published": "Jan 13, 2026", "title": "Cucina sodas are making Dry January feel like a br...", "views": 975, "reach": 603, "likes": 16, "comments": 0, "saved": 1, "shares": null, "engagement": 2.99},
    {"published": "Jan 15, 2026", "title": "Get into the jazzy feel of Jazz & Juice", "views": 917, "reach": 576, "likes": 22, "comments": 0, "saved": 2, "shares": null, "engagement": 4.69},
    {"published": "Jan 7, 2026", "title": "Pesto making its way to your plate - literally", "views": 983, "reach": 533, "likes": 14, "comments": 0, "saved": 1, "shares": null, "engagement": 2.81},
    {"published": "Jan 11, 2026", "title": "This January, say ciao to Il Vegetariano", "views": 792, "reach": 479, "likes": 14, "comments": 1, "saved": 1, "shares": null, "engagement": 3.34},
    {"published": "Jan 23, 2026", "title": "If you haven''t tried our vegetarian set menu yet...", "views": 737, "reach": 466, "likes": 7, "comments": 0, "saved": 1, "shares": null, "engagement": 1.72},
    {"published": "Jan 20, 2026", "title": "Vegetarian options are made better and made for...", "views": 788, "reach": 465, "likes": 11, "comments": 0, "saved": 1, "shares": null, "engagement": 3.01},
    {"published": "Jan 28, 2026", "title": "This Valentine''s Day, make it a night to remember...", "views": 1012, "reach": 451, "likes": 15, "comments": 0, "saved": 1, "shares": null, "engagement": 3.99},
    {"published": "Jan 30, 2026", "title": "Join us tonight and tomorrow for smooth sips and j...", "views": 668, "reach": 425, "likes": 12, "comments": 1, "saved": 1, "shares": null, "engagement": 3.53},
    {"published": "Jan 25, 2026", "title": "Let''s make your Sunday a little stronger", "views": 586, "reach": 322, "likes": 14, "comments": 0, "saved": 0, "shares": null, "engagement": 4.66}
  ]'::jsonb,

  -- ig_top_reels
  '[
    {"published": "Jan 27, 2026", "title": "Catch @marco.deriu.319 in action, plating up tiram...", "views": 802, "reach": 552, "likes": 21, "comments": 0, "saved": 1, "shares": 0, "engagement": 3.99, "watch_time": "2m 22s", "avg_watch_time": "4s"}
  ]'::jsonb,

  -- ig_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 63.71},
      {"name": "Italy", "pct": 6.80},
      {"name": "United Kingdom", "pct": 4.07},
      {"name": "India", "pct": 3.03},
      {"name": "Iran", "pct": 1.81},
      {"name": "Pakistan", "pct": 1.72},
      {"name": "Egypt", "pct": 1.53},
      {"name": "Germany", "pct": 1.25},
      {"name": "Ukraine", "pct": 1.19},
      {"name": "United States", "pct": 1.16}
    ],
    "cities": [
      {"name": "Dubai", "pct": 54.16},
      {"name": "Abu Dhabi", "pct": 3.74},
      {"name": "Sharjah", "pct": 2.58},
      {"name": "Tehran", "pct": 0.92},
      {"name": "Al Lusayli", "pct": 0.71},
      {"name": "Al Ajman", "pct": 0.71},
      {"name": "Cairo", "pct": 0.67}
    ]
  }'::jsonb,

  -- ig_hashtags
  '[
    {"tag": "#italianrestaurantdubai", "posts": 1, "views": 1411, "likes": 29, "comments": 0},
    {"tag": "#dubairestaurants", "posts": 1, "views": 1411, "likes": 29, "comments": 0},
    {"tag": "#cucinadxb", "posts": 1, "views": 1411, "likes": 29, "comments": 0},
    {"tag": "#drinksonpoint", "posts": 1, "views": 1244, "likes": 35, "comments": 0},
    {"tag": "#saturdaymood", "posts": 1, "views": 1244, "likes": 35, "comments": 0},
    {"tag": "#midweekmood", "posts": 1, "views": 1167, "likes": 25, "comments": 3},
    {"tag": "#weekendplanssorted", "posts": 1, "views": 1055, "likes": 15, "comments": 2},
    {"tag": "#valentinesatcucina", "posts": 1, "views": 1012, "likes": 15, "comments": 0},
    {"tag": "#jazzandlove", "posts": 1, "views": 1012, "likes": 15, "comments": 0},
    {"tag": "#madewithamore", "posts": 1, "views": 983, "likes": 14, "comments": 0},
    {"tag": "#pestoparty", "posts": 1, "views": 983, "likes": 14, "comments": 0},
    {"tag": "#sodawithstyle", "posts": 1, "views": 975, "likes": 16, "comments": 0},
    {"tag": "#dryjandoneright", "posts": 1, "views": 975, "likes": 16, "comments": 0},
    {"tag": "#cucinathepalm", "posts": 12, "views": 946, "likes": 17, "comments": 0},
    {"tag": "#weekendwarmup", "posts": 1, "views": 917, "likes": 22, "comments": 0},
    {"tag": "#neighbourhooditalian", "posts": 5, "views": 916, "likes": 16, "comments": 1},
    {"tag": "#jazzandjuice", "posts": 2, "views": 792, "likes": 17, "comments": 0},
    {"tag": "#ilvegetariano", "posts": 3, "views": 772, "likes": 10, "comments": 0},
    {"tag": "#vegwithedge", "posts": 2, "views": 762, "likes": 9, "comments": 0},
    {"tag": "#weekendvibes", "posts": 1, "views": 668, "likes": 12, "comments": 1}
  ]'::jsonb,

  -- ig_sponsored (none in report)
  NULL,

  -- fb_top_posts
  '[
    {"published": "Jan 28, 2026", "title": "This Valentine''s Day, make it...", "impressions": 64, "reach": 34, "reactions": 0, "clicks": 2, "link_clicks": 0, "engagement": 5.88},
    {"published": "Jan 15, 2026", "title": "Get into the jazzy feel of Jaz...", "impressions": 43, "reach": 31, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 9, 2026", "title": "Family-style is kind of our th...", "impressions": 36, "reach": 30, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 28, 2026", "title": "This Valentine''s Day, make it...", "impressions": 47, "reach": 28, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 20, 2026", "title": "Vegetarian options are made be...", "impressions": 37, "reach": 28, "reactions": 2, "clicks": 0, "link_clicks": 0, "engagement": 7.14},
    {"published": "Jan 13, 2026", "title": "Cucina sodas are making Dry Ja...", "impressions": 35, "reach": 28, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0}
  ]'::jsonb,

  -- fb_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 56.95},
      {"name": "India", "pct": 7.06},
      {"name": "Pakistan", "pct": 6.40},
      {"name": "United Kingdom", "pct": 3.97},
      {"name": "Italy", "pct": 3.53},
      {"name": "Bangladesh", "pct": 2.65},
      {"name": "Philippines", "pct": 2.21},
      {"name": "Egypt", "pct": 1.32},
      {"name": "Saudi Arabia", "pct": 1.10},
      {"name": "Qatar", "pct": 1.10}
    ],
    "cities": [
      {"name": "Dubai", "pct": 46.36},
      {"name": "Abu Dhabi", "pct": 2.87},
      {"name": "Karachi", "pct": 2.21},
      {"name": "Sharjah", "pct": 1.99},
      {"name": "Al Ain", "pct": 1.32},
      {"name": "Lahore", "pct": 1.10},
      {"name": "Dhaka", "pct": 0.88}
    ]
  }'::jsonb
);

-- ============================================================
-- 4. RESORT
-- ============================================================
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
  (SELECT id FROM venues WHERE name = 'Resort'),
  '2026-01',

  -- Instagram KPIs
  24850,          -- ig_followers (24.85K)
  1.53,           -- ig_followers_growth
  NULL,           -- ig_following
  10,             -- ig_posts_count
  2,              -- ig_reels_count
  97,             -- ig_stories_count
  1210000,        -- ig_impressions (1.21M views)
  NULL,           -- ig_reach
  40180.00,       -- ig_avg_reach_per_day (40.18K)
  2.44,           -- ig_engagement_rate
  469,            -- ig_total_interactions
  432,            -- ig_likes
  5,              -- ig_comments
  17,             -- ig_shares
  15,             -- ig_saves
  118600,         -- ig_story_impressions (118.60K)
  1075.28,        -- ig_avg_story_reach
  1515.00,        -- ig_reel_avg_reach

  -- Facebook KPIs
  4955,           -- fb_followers
  1.58,           -- fb_followers_growth
  9754,           -- fb_page_views
  2720000,        -- fb_impressions (2.72M)
  3210000,        -- fb_total_views (3.21M)
  9,              -- fb_posts_count
  2,              -- fb_reels_count
  67,             -- fb_stories_count
  2.38,           -- fb_engagement_rate
  140,            -- fb_total_interactions

  -- ig_top_posts
  '[
    {"published": "Jan 16, 2026", "title": "Unwind by the shore, with Dubai''s skyline as your...", "views": 5663, "reach": 3304, "likes": 111, "comments": 0, "saved": 5, "shares": null, "engagement": 3.69},
    {"published": "Jan 19, 2026", "title": "Where mornings are slow, evenings are elevated, an...", "views": 3420, "reach": 2055, "likes": 37, "comments": 1, "saved": 1, "shares": null, "engagement": 1.90},
    {"published": "Jan 9, 2026", "title": "The key that unlocks more. M Club rooms come wi...", "views": 3225, "reach": 1930, "likes": 29, "comments": 0, "saved": 1, "shares": null, "engagement": 1.55},
    {"published": "Jan 11, 2026", "title": "The kind of morning you don''t post. You live it...", "views": 3130, "reach": 1900, "likes": 21, "comments": 0, "saved": 3, "shares": null, "engagement": 1.26},
    {"published": "Jan 14, 2026", "title": "Exclusive access. Elevated experiences. M Club on...", "views": 3218, "reach": 1892, "likes": 29, "comments": 1, "saved": 0, "shares": null, "engagement": 1.64},
    {"published": "Jan 12, 2026", "title": "Staycation mode, activated. Pool days hit differ...", "views": 3171, "reach": 1845, "likes": 31, "comments": 1, "saved": 0, "shares": null, "engagement": 1.73},
    {"published": "Jan 7, 2026", "title": "@balharbourbeachdubai is your go-to for an easy be...", "views": 3029, "reach": 1725, "likes": 31, "comments": 0, "saved": 1, "shares": null, "engagement": 1.86},
    {"published": "Jan 26, 2026", "title": "We are incredibly proud to be recognised as Top Vo...", "views": 5941, "reach": 1628, "likes": 100, "comments": 1, "saved": 1, "shares": null, "engagement": 6.39},
    {"published": "Jan 26, 2026", "title": "Sun-kissed moments, fresh fruit, and quiet pages b...", "views": 2765, "reach": 1628, "likes": 27, "comments": 0, "saved": 0, "shares": null, "engagement": 1.66},
    {"published": "Jan 28, 2026", "title": "Celebrate Valentine''s the way it should feel: calm...", "views": 3014, "reach": 1284, "likes": 16, "comments": 1, "saved": 3, "shares": null, "engagement": 2.18}
  ]'::jsonb,

  -- ig_top_reels
  '[
    {"published": "Jan 22, 2026", "title": "Check in for business. Stay for the moments in bet...", "views": 2243, "reach": 1677, "likes": 40, "comments": 0, "saved": 2, "shares": 1, "engagement": 2.56, "watch_time": "48m 50s", "avg_watch_time": "4s"},
    {"published": "Jan 2, 2026", "title": "Step away from the everyday and join us for a rela...", "views": 1719, "reach": 1353, "likes": 18, "comments": 1, "saved": 0, "shares": 7, "engagement": 1.92, "watch_time": "26m 2s", "avg_watch_time": "2s"}
  ]'::jsonb,

  -- ig_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 28.45},
      {"name": "United Kingdom", "pct": 15.54},
      {"name": "Germany", "pct": 9.13},
      {"name": "Russia", "pct": 4.69},
      {"name": "India", "pct": 3.93},
      {"name": "United States", "pct": 2.41},
      {"name": "Egypt", "pct": 2.36},
      {"name": "Oman", "pct": 2.03},
      {"name": "Italy", "pct": 1.75},
      {"name": "Uzbekistan", "pct": 1.38}
    ],
    "cities": [
      {"name": "Dubai", "pct": 21.31},
      {"name": "Abu Dhabi", "pct": 2.67},
      {"name": "Sharjah", "pct": 2.00},
      {"name": "London", "pct": 0.92},
      {"name": "Baku", "pct": 0.82},
      {"name": "Al Ajman", "pct": 0.81},
      {"name": "Cairo", "pct": 0.73}
    ]
  }'::jsonb,

  -- ig_hashtags
  '[
    {"tag": "#gfmeawards", "posts": 1, "views": 5941, "likes": 100, "comments": 1},
    {"tag": "#staymarriott", "posts": 3, "views": 3988, "likes": 54, "comments": 0},
    {"tag": "#marriottmoments", "posts": 3, "views": 3988, "likes": 54, "comments": 0},
    {"tag": "#marriottresortpalmjumeirah", "posts": 5, "views": 3601, "likes": 42, "comments": 0},
    {"tag": "#marriottbonvoy", "posts": 7, "views": 3513, "likes": 40, "comments": 0},
    {"tag": "#mclub", "posts": 3, "views": 3287, "likes": 31, "comments": 0},
    {"tag": "#workfromhotel", "posts": 4, "views": 3157, "likes": 30, "comments": 0},
    {"tag": "#stayupgraded", "posts": 4, "views": 3157, "likes": 30, "comments": 0},
    {"tag": "#palmjumeirah", "posts": 5, "views": 3131, "likes": 30, "comments": 0},
    {"tag": "#dubai", "posts": 1, "views": 3029, "likes": 31, "comments": 0},
    {"tag": "#balharbour", "posts": 1, "views": 3029, "likes": 31, "comments": 0},
    {"tag": "#balharbourvibes", "posts": 1, "views": 3029, "likes": 31, "comments": 0},
    {"tag": "#palmwestbeach", "posts": 1, "views": 3029, "likes": 31, "comments": 0},
    {"tag": "#sunkissed", "posts": 1, "views": 3029, "likes": 31, "comments": 0},
    {"tag": "#balharbourbeach", "posts": 1, "views": 3029, "likes": 31, "comments": 0},
    {"tag": "#dubaispa", "posts": 1, "views": 3014, "likes": 16, "comments": 1},
    {"tag": "#valentinesoffer", "posts": 1, "views": 3014, "likes": 16, "comments": 1},
    {"tag": "#spaday", "posts": 1, "views": 3014, "likes": 16, "comments": 1},
    {"tag": "#sparetreat", "posts": 1, "views": 3014, "likes": 16, "comments": 1},
    {"tag": "#sarayspa", "posts": 1, "views": 3014, "likes": 16, "comments": 1}
  ]'::jsonb,

  -- ig_sponsored (none in report)
  NULL,

  -- fb_top_posts
  '[
    {"published": "Jan 26, 2026", "title": "We are incredibly proud to be...", "impressions": 1399, "reach": 873, "reactions": 27, "clicks": 47, "link_clicks": 0, "engagement": 8.48},
    {"published": "Jan 16, 2026", "title": "Unwind by the shore, with Duba...", "impressions": 1230, "reach": 847, "reactions": 10, "clicks": 5, "link_clicks": 0, "engagement": 1.77},
    {"published": "Jan 14, 2026", "title": "Exclusive access. Elevated exp...", "impressions": 993, "reach": 682, "reactions": 4, "clicks": 2, "link_clicks": 0, "engagement": 0.88},
    {"published": "Jan 9, 2026", "title": "The key that unlocks more...", "impressions": 975, "reach": 668, "reactions": 2, "clicks": 5, "link_clicks": 0, "engagement": 1.20},
    {"published": "Jan 11, 2026", "title": "The kind of morning you don''t...", "impressions": 898, "reach": 640, "reactions": 2, "clicks": 5, "link_clicks": 0, "engagement": 1.09},
    {"published": "Jan 12, 2026", "title": "Staycation mode, activated...", "impressions": 923, "reach": 638, "reactions": 3, "clicks": 0, "link_clicks": 0, "engagement": 0.47}
  ]'::jsonb,

  -- fb_demographics
  '{
    "countries": [
      {"name": "United Kingdom", "pct": 22.60},
      {"name": "United Arab Emirates", "pct": 22.44},
      {"name": "India", "pct": 5.31},
      {"name": "Germany", "pct": 4.22},
      {"name": "United States", "pct": 2.87},
      {"name": "Egypt", "pct": 2.74},
      {"name": "Romania", "pct": 2.62},
      {"name": "Bangladesh", "pct": 2.50},
      {"name": "Pakistan", "pct": 2.40},
      {"name": "Philippines", "pct": 2.06}
    ],
    "cities": [
      {"name": "Dubai", "pct": 16.65},
      {"name": "Abu Dhabi", "pct": 1.88},
      {"name": "Dhaka", "pct": 1.09},
      {"name": "Sharjah", "pct": 1.01},
      {"name": "Cairo", "pct": 0.69},
      {"name": "Karachi", "pct": 0.65},
      {"name": "Al Ajman", "pct": 0.54}
    ]
  }'::jsonb
);

-- ============================================================
-- 5. SMOKI MOTO
-- ============================================================
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
  (SELECT id FROM venues WHERE name = 'Smoki Moto'),
  '2026-01',

  -- Instagram KPIs
  9584,           -- ig_followers
  2.14,           -- ig_followers_growth
  NULL,           -- ig_following
  9,              -- ig_posts_count
  4,              -- ig_reels_count
  86,             -- ig_stories_count
  119900,         -- ig_impressions (119.90K views)
  NULL,           -- ig_reach
  1374.77,        -- ig_avg_reach_per_day
  3.26,           -- ig_engagement_rate
  231,            -- ig_total_interactions
  184,            -- ig_likes
  0,              -- ig_comments
  17,             -- ig_shares
  30,             -- ig_saves
  14740,          -- ig_story_impressions (14.74K)
  167.74,         -- ig_avg_story_reach
  1829.25,        -- ig_reel_avg_reach

  -- Facebook KPIs
  141,            -- fb_followers
  2.17,           -- fb_followers_growth
  413,            -- fb_page_views
  480530,         -- fb_impressions (480.53K)
  507320,         -- fb_total_views (507.32K)
  10,             -- fb_posts_count
  4,              -- fb_reels_count
  64,             -- fb_stories_count
  2.92,           -- fb_engagement_rate
  4,              -- fb_total_interactions

  -- ig_top_posts
  '[
    {"published": "Jan 19, 2026", "title": "This is your sign to sit back, order the ribeye, s...", "views": 1719, "reach": 1038, "likes": 18, "comments": 0, "saved": 2, "shares": null, "engagement": 2.22},
    {"published": "Jan 10, 2026", "title": "This is what award-winning experiential dining loo...", "views": 1799, "reach": 1005, "likes": 25, "comments": 0, "saved": 3, "shares": null, "engagement": 3.18},
    {"published": "Jan 15, 2026", "title": "Hot & Spicy Day at Smoki Moto", "views": 1617, "reach": 955, "likes": 13, "comments": 0, "saved": 5, "shares": null, "engagement": 2.20},
    {"published": "Jan 8, 2026", "title": "Not playing with fire. Controlling it", "views": 1513, "reach": 873, "likes": 23, "comments": 0, "saved": 5, "shares": null, "engagement": 3.32},
    {"published": "Jan 28, 2026", "title": "This Valentines, let the fire do the talking", "views": 1741, "reach": 721, "likes": 41, "comments": 0, "saved": 4, "shares": null, "engagement": 6.66},
    {"published": "Jan 23, 2026", "title": "Grab a drink, face Palm Jumeirah''s view, and let S...", "views": 1195, "reach": 696, "likes": 21, "comments": 0, "saved": 2, "shares": null, "engagement": 3.45},
    {"published": "Jan 6, 2026", "title": "Cold days call for the right kind of comfort, and...", "views": 1254, "reach": 692, "likes": 9, "comments": 0, "saved": 0, "shares": null, "engagement": 1.30},
    {"published": "Jan 25, 2026", "title": "The kind of table you don''t check the time at", "views": 1126, "reach": 643, "likes": 15, "comments": 0, "saved": 9, "shares": null, "engagement": 4.04},
    {"published": "Jan 30, 2026", "title": "That''s just Friday saying hi again", "views": 1059, "reach": 469, "likes": 19, "comments": 0, "saved": 0, "shares": null, "engagement": 4.05}
  ]'::jsonb,

  -- ig_top_reels
  '[
    {"published": "Jan 16, 2026", "title": "The face you make when very spicy means VERY SPI...", "views": 3449, "reach": 2460, "likes": 63, "comments": 4, "saved": 2, "shares": 31, "engagement": 4.07, "watch_time": "2m 52s", "avg_watch_time": "5s"},
    {"published": "Jan 27, 2026", "title": "Honoured to be named Best Steakhouse & Grills at t...", "views": 2675, "reach": 1768, "likes": 68, "comments": 4, "saved": 2, "shares": 3, "engagement": 4.36, "watch_time": "3m 51s", "avg_watch_time": "7s"},
    {"published": "Jan 2, 2026", "title": "This is Smoki Moto: a Korean steakhouse shaped by...", "views": 2324, "reach": 1569, "likes": 60, "comments": 2, "saved": 11, "shares": 12, "engagement": 5.42, "watch_time": "3m 44s", "avg_watch_time": "5s"},
    {"published": "Jan 11, 2026", "title": "From selecting cuts at the butcher to fire on the...", "views": 1899, "reach": 1520, "likes": 31, "comments": 1, "saved": 13, "shares": 7, "engagement": 3.42, "watch_time": "3m 26s", "avg_watch_time": "3s"}
  ]'::jsonb,

  -- ig_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 68.93},
      {"name": "United Kingdom", "pct": 5.75},
      {"name": "India", "pct": 1.79},
      {"name": "Iran", "pct": 1.78},
      {"name": "United States", "pct": 1.38},
      {"name": "Ukraine", "pct": 1.11},
      {"name": "Pakistan", "pct": 1.00},
      {"name": "Germany", "pct": 0.98},
      {"name": "Egypt", "pct": 0.97},
      {"name": "Saudi Arabia", "pct": 0.93}
    ],
    "cities": [
      {"name": "Dubai", "pct": 58.66},
      {"name": "Abu Dhabi", "pct": 3.43},
      {"name": "Sharjah", "pct": 3.16},
      {"name": "Al Ajman", "pct": 0.94},
      {"name": "London", "pct": 0.89},
      {"name": "Al Lusayli", "pct": 0.86},
      {"name": "Tehran", "pct": 0.71}
    ]
  }'::jsonb,

  -- ig_hashtags
  '[
    {"tag": "#valentinesdinner", "posts": 1, "views": 1741, "likes": 41, "comments": 0},
    {"tag": "#koreansteakhouse", "posts": 1, "views": 1741, "likes": 41, "comments": 0},
    {"tag": "#palmjumeirah", "posts": 1, "views": 1741, "likes": 41, "comments": 0},
    {"tag": "#guysfriesribeyes", "posts": 1, "views": 1719, "likes": 18, "comments": 0},
    {"tag": "#dubai", "posts": 1, "views": 1719, "likes": 18, "comments": 0},
    {"tag": "#spicyfoodlovers", "posts": 1, "views": 1617, "likes": 13, "comments": 0},
    {"tag": "#koreanfriedchicken", "posts": 1, "views": 1617, "likes": 13, "comments": 0},
    {"tag": "#hotandspicyday", "posts": 1, "views": 1617, "likes": 13, "comments": 0},
    {"tag": "#spicychallenge", "posts": 1, "views": 1617, "likes": 13, "comments": 0},
    {"tag": "#dubaieats", "posts": 1, "views": 1617, "likes": 13, "comments": 0},
    {"tag": "#smokimotodubai", "posts": 6, "views": 1492, "likes": 23, "comments": 0},
    {"tag": "#smokimoto", "posts": 2, "views": 1435, "likes": 11, "comments": 0},
    {"tag": "#whereheartandseoulcollide", "posts": 4, "views": 1374, "likes": 20, "comments": 0},
    {"tag": "#smokimotothepalm", "posts": 4, "views": 1374, "likes": 20, "comments": 0},
    {"tag": "#koreanrestaurant", "posts": 4, "views": 1374, "likes": 20, "comments": 0},
    {"tag": "#dubaidining", "posts": 1, "views": 1254, "likes": 9, "comments": 0},
    {"tag": "#soupmonth", "posts": 1, "views": 1254, "likes": 9, "comments": 0},
    {"tag": "#koreansoup", "posts": 1, "views": 1254, "likes": 9, "comments": 0},
    {"tag": "#koreancuisine", "posts": 1, "views": 1254, "likes": 9, "comments": 0}
  ]'::jsonb,

  -- ig_sponsored (none in report)
  NULL,

  -- fb_top_posts
  '[
    {"published": "Jan 19, 2026", "title": "This is your sign to sit back,...", "impressions": 22, "reach": 18, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 25, 2026", "title": "The kind of table you don''t ch...", "impressions": 27, "reach": 17, "reactions": 1, "clicks": 0, "link_clicks": 0, "engagement": 5.88},
    {"published": "Jan 30, 2026", "title": "That''s just Friday saying hi a...", "impressions": 25, "reach": 15, "reactions": 0, "clicks": 2, "link_clicks": 0, "engagement": 13.33},
    {"published": "Jan 28, 2026", "title": "This Valentines, let the fire...", "impressions": 25, "reach": 15, "reactions": 0, "clicks": 1, "link_clicks": 0, "engagement": 6.67},
    {"published": "Jan 8, 2026", "title": "Not playing with fire. Control...", "impressions": 19, "reach": 14, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 23, 2026", "title": "Grab a drink, face Palm Jumeir...", "impressions": 15, "reach": 12, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0}
  ]'::jsonb,

  -- fb_demographics
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 77.30},
      {"name": "United Kingdom", "pct": 4.96},
      {"name": "Philippines", "pct": 4.26},
      {"name": "India", "pct": 2.84},
      {"name": "Bangladesh", "pct": 2.13},
      {"name": "Portugal", "pct": 1.42},
      {"name": "Germany", "pct": 0.71},
      {"name": "Egypt", "pct": 0.71},
      {"name": "Nepal", "pct": 0.71},
      {"name": "Palestinian Territories", "pct": 0.71}
    ],
    "cities": [
      {"name": "Dubai", "pct": 57.45},
      {"name": "Abu Dhabi", "pct": 4.26},
      {"name": "Sharjah", "pct": 3.55},
      {"name": "Al Ajman", "pct": 2.13},
      {"name": "Ras al-Khaimah", "pct": 1.42},
      {"name": "Riyadh", "pct": 0.71},
      {"name": "Bucharest", "pct": 0.71}
    ]
  }'::jsonb
);
