-- Above Eleven - Social Media Monthly - January 2026
-- Source: Metricool PDF report (01 Jan 26 - 31 Jan 26)

INSERT INTO social_media_monthly (
  venue_id,
  month,

  -- Instagram KPIs
  ig_followers,
  ig_followers_growth,
  ig_following,
  ig_posts_count,
  ig_reels_count,
  ig_stories_count,
  ig_impressions,
  ig_reach,
  ig_avg_reach_per_day,
  ig_engagement_rate,
  ig_total_interactions,
  ig_likes,
  ig_comments,
  ig_shares,
  ig_saves,
  ig_story_impressions,
  ig_avg_story_reach,
  ig_reel_avg_reach,

  -- Facebook KPIs
  fb_followers,
  fb_followers_growth,
  fb_page_views,
  fb_impressions,
  fb_total_views,
  fb_posts_count,
  fb_reels_count,
  fb_stories_count,
  fb_engagement_rate,
  fb_total_interactions,

  -- JSON fields
  ig_top_posts,
  ig_top_reels,
  ig_demographics,
  ig_hashtags,
  ig_sponsored,
  fb_top_posts,
  fb_demographics
)
VALUES (
  (SELECT id FROM venues WHERE name = 'Above Eleven'),
  '2026-01',

  -- Instagram KPIs
  13230,          -- ig_followers
  1.50,           -- ig_followers_growth
  NULL,           -- ig_following (not in report)
  11,             -- ig_posts_count
  2,              -- ig_reels_count
  137,            -- ig_stories_count
  127310,         -- ig_impressions (from "Views 127.31K")
  NULL,           -- ig_reach
  667.61,         -- ig_avg_reach_per_day
  2.79,           -- ig_engagement_rate (posts)
  402,            -- ig_total_interactions
  321,            -- ig_likes
  7,              -- ig_comments
  57,             -- ig_shares
  17,             -- ig_saves
  29520,          -- ig_story_impressions
  210.20,         -- ig_avg_story_reach
  1234.00,        -- ig_reel_avg_reach

  -- Facebook KPIs
  729,            -- fb_followers
  0.83,           -- fb_followers_growth
  1293,           -- fb_page_views
  540140,         -- fb_impressions (540.14K)
  423150,         -- fb_total_views (423.15K)
  12,             -- fb_posts_count
  2,              -- fb_reels_count
  86,             -- fb_stories_count
  2.84,           -- fb_engagement_rate
  23,             -- fb_total_interactions

  -- ig_top_posts (Instagram - sorted by reach, from pages 25-26)
  '[
    {"published": "Jan 8, 2026", "title": "Akila and Midhun proving Dry January still deserve...", "views": 3904, "reach": 2360, "likes": 41, "comments": 3, "saved": 0, "shares": null, "engagement": 2.08},
    {"published": "Jan 2, 2026", "title": "2026 already looks better from up here", "views": 4845, "reach": 1946, "likes": 51, "comments": 1, "saved": 4, "shares": null, "engagement": 3.80},
    {"published": "Jan 19, 2026", "title": "If Rasmikha''s pouring, you''re in good hands", "views": 3228, "reach": 1808, "likes": 58, "comments": 1, "saved": 0, "shares": null, "engagement": 3.76},
    {"published": "Jan 9, 2026", "title": "A night out with Above Eleven looks a little like...", "views": 3022, "reach": 1547, "likes": 29, "comments": 1, "saved": 3, "shares": null, "engagement": 2.39},
    {"published": "Jan 23, 2026", "title": "@scarlettvernonx understood the assignment", "views": 2623, "reach": 1305, "likes": 29, "comments": 0, "saved": 3, "shares": null, "engagement": 2.53},
    {"published": "Jan 5, 2026", "title": "DRY JANUARY ALERT! All dining guests get...", "views": 2322, "reach": 1245, "likes": 19, "comments": 0, "saved": 0, "shares": null, "engagement": 1.69},
    {"published": "Jan 11, 2026", "title": "Veganuary calls for good choices. Avocado Roll is...", "views": 1615, "reach": 932, "likes": 12, "comments": 0, "saved": 1, "shares": null, "engagement": 1.50},
    {"published": "Jan 28, 2026", "title": "Come on up. Valentine''s looks better from here.", "views": 2111, "reach": 910, "likes": 29, "comments": 0, "saved": 1, "shares": null, "engagement": 4.07},
    {"published": "Jan 25, 2026", "title": "A little bit of everything, exactly how Sundays sh...", "views": 1384, "reach": 847, "likes": 17, "comments": 1, "saved": 1, "shares": null, "engagement": 2.72},
    {"published": "Jan 15, 2026", "title": "Born in January? We''ve got your celebration covere...", "views": 1510, "reach": 795, "likes": 10, "comments": 0, "saved": 1, "shares": null, "engagement": 2.01},
    {"published": "Jan 30, 2026", "title": "Yes, this is our view. See you above the city", "views": 1296, "reach": 699, "likes": 26, "comments": 0, "saved": 3, "shares": null, "engagement": 4.29}
  ]'::jsonb,

  -- ig_top_reels (Instagram - from page 32)
  '[
    {"published": "Jan 14, 2026", "title": "Meet the people who take care of you, and the band...", "views": 1874, "reach": 1316, "likes": 31, "comments": 0, "saved": 0, "shares": 12, "engagement": 3.27, "watch_time": null, "avg_watch_time": null},
    {"published": "Jan 27, 2026", "title": "You, the view, and a five-course dinner designed t...", "views": 1781, "reach": 1152, "likes": 28, "comments": 0, "saved": 2, "shares": 2, "engagement": 2.78, "watch_time": null, "avg_watch_time": null}
  ]'::jsonb,

  -- ig_demographics (Instagram - from page 20)
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 62.76},
      {"name": "United Kingdom", "pct": 6.32},
      {"name": "India", "pct": 2.86},
      {"name": "United States", "pct": 1.91},
      {"name": "Egypt", "pct": 1.82},
      {"name": "Saudi Arabia", "pct": 1.76},
      {"name": "Iran", "pct": 1.59},
      {"name": "Germany", "pct": 1.44},
      {"name": "Italy", "pct": 1.33},
      {"name": "Pakistan", "pct": 1.13}
    ],
    "cities": [
      {"name": "Dubai", "pct": 53.30},
      {"name": "Abu Dhabi", "pct": 3.35},
      {"name": "Sharjah", "pct": 2.62},
      {"name": "Al Ajman", "pct": 1.09},
      {"name": "Riyadh", "pct": 0.76},
      {"name": "London", "pct": 0.75},
      {"name": "Cairo", "pct": 0.71}
    ]
  }'::jsonb,

  -- ig_hashtags (Instagram - from pages 27-28)
  '[
    {"tag": "#rooftopvibes", "posts": 1, "views": 4845, "likes": 51, "comments": 1},
    {"tag": "#palmwestbeach", "posts": 1, "views": 4845, "likes": 51, "comments": 1},
    {"tag": "#letsgetpiscod", "posts": 1, "views": 4845, "likes": 51, "comments": 1},
    {"tag": "#dubairooftops", "posts": 1, "views": 3904, "likes": 41, "comments": 3},
    {"tag": "#comeonup", "posts": 1, "views": 3904, "likes": 41, "comments": 3},
    {"tag": "#dryjanuarydubai", "posts": 2, "views": 3113, "likes": 30, "comments": 1},
    {"tag": "#dryjanuary", "posts": 2, "views": 3113, "likes": 30, "comments": 1},
    {"tag": "#aboveelevendubai", "posts": 11, "views": 2532, "likes": 29, "comments": 0},
    {"tag": "#nikkeidubai", "posts": 2, "views": 2318, "likes": 20, "comments": 0},
    {"tag": "#palmjumeirah", "posts": 2, "views": 2318, "likes": 20, "comments": 0},
    {"tag": "#rooftopdubai", "posts": 2, "views": 2318, "likes": 20, "comments": 0},
    {"tag": "#abovethecity", "posts": 2, "views": 2306, "likes": 37, "comments": 1},
    {"tag": "#rooftopbar", "posts": 2, "views": 2306, "likes": 37, "comments": 1},
    {"tag": "#dubainights", "posts": 2, "views": 2306, "likes": 37, "comments": 1},
    {"tag": "#valentinesdubai", "posts": 1, "views": 2111, "likes": 29, "comments": 0},
    {"tag": "#peruviandubai", "posts": 3, "views": 1977, "likes": 22, "comments": 0}
  ]'::jsonb,

  -- ig_sponsored (Instagram - from page 33)
  '[
    {"published": "Jan 14, 2026", "title": "Meet the people who take care of you, and the band that makes you move...", "reach": 65580, "views": 84080, "interactions": 43, "spent": 150.97},
    {"published": "Jan 27, 2026", "title": "You, the view, and a five-course dinner designed to bring you closer...", "reach": 6104, "views": 3637, "interactions": 32, "spent": 7.61}
  ]'::jsonb,

  -- fb_top_posts (Facebook - from page 9, sorted by reach)
  '[
    {"published": "Jan 2, 2026", "title": "2026 already looks better from...", "impressions": 157, "reach": 91, "reactions": 1, "clicks": 5, "link_clicks": 0, "engagement": 6.59},
    {"published": "Jan 23, 2026", "title": "@scarlettvernonx understood the assignment...", "impressions": 141, "reach": 88, "reactions": 0, "clicks": 3, "link_clicks": 1, "engagement": 3.41},
    {"published": "Jan 11, 2026", "title": "Veganuary calls for good choices...", "impressions": 110, "reach": 79, "reactions": 2, "clicks": 0, "link_clicks": 0, "engagement": 2.53},
    {"published": "Jan 15, 2026", "title": "Born in January? We''ve got you...", "impressions": 121, "reach": 76, "reactions": 0, "clicks": 0, "link_clicks": 0, "engagement": 0},
    {"published": "Jan 8, 2026", "title": "Akila and Midhun proving Dry January...", "impressions": 106, "reach": 75, "reactions": 1, "clicks": 0, "link_clicks": 0, "engagement": 1.33},
    {"published": "Jan 9, 2026", "title": "A night out with Above Eleven...", "impressions": 95, "reach": 70, "reactions": 0, "clicks": 3, "link_clicks": 0, "engagement": 4.29}
  ]'::jsonb,

  -- fb_demographics (Facebook - from page 4)
  '{
    "countries": [
      {"name": "United Arab Emirates", "pct": 46.23},
      {"name": "United Kingdom", "pct": 8.37},
      {"name": "India", "pct": 4.94},
      {"name": "Thailand", "pct": 3.84},
      {"name": "Pakistan", "pct": 3.70},
      {"name": "Bangladesh", "pct": 3.29},
      {"name": "Cambodia", "pct": 3.29},
      {"name": "Peru", "pct": 2.06},
      {"name": "Philippines", "pct": 1.65},
      {"name": "United States", "pct": 1.37}
    ],
    "cities": [
      {"name": "Dubai", "pct": 39.37},
      {"name": "Phnom Penh", "pct": 2.74},
      {"name": "Bangkok", "pct": 2.47},
      {"name": "Abu Dhabi", "pct": 1.78},
      {"name": "Dhaka", "pct": 1.23},
      {"name": "Al Ajman", "pct": 1.23},
      {"name": "Sharjah", "pct": 1.10}
    ]
  }'::jsonb
);
