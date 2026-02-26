-- ============================================================
-- Sheraton MOE Demo — Weekly Reports (Feb 1–24, 2026)
-- 4 venues: Sheraton MOE, Besh Turkish Kitchen,
--           Spartan Sports Bar, OAnjo Dubai
-- Meta data + revenue data (Cucina-level scale)
-- ============================================================


-- ── SHERATON MOE ─────────────────────────────────────────
-- Hotel umbrella — meta campaigns only, no F&B revenue
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend   = 10604.00,
    meta_data  = '{
      "campaigns": [
        {
          "name": "Sheraton MOE - Brand Awareness",
          "status": "ACTIVE",
          "impressions": 184320,
          "clicks": 4782,
          "ctr": 2.594401,
          "linkClicks": 2914,
          "engagement": 8641
        },
        {
          "name": "Sheraton MOE - Traffic",
          "status": "ACTIVE",
          "impressions": 97540,
          "clicks": 2618,
          "ctr": 2.684701,
          "linkClicks": 1843,
          "engagement": 4217
        }
      ],
      "adSets": [
        {
          "name": "Luxury Travellers",
          "impressions": 112480,
          "clicks": 3012,
          "ctr": 2.677807,
          "linkClicks": 1894,
          "engagement": 5842,
          "audience": {
            "type": "Advantage+",
            "location": "Dubai, UAE + GCC",
            "age": "28–55",
            "gender": "All",
            "interests": ["Luxury Hotels", "Travel", "Fine Dining"],
            "customAudiences": ["Website Visitors", "Past Guests"],
            "behaviors": ["Frequent Travellers", "Business Class"],
            "excluded": []
          }
        },
        {
          "name": "Mall Visitors",
          "impressions": 94180,
          "clicks": 2416,
          "ctr": 2.565291,
          "linkClicks": 1497,
          "engagement": 3812,
          "audience": {
            "type": "Custom",
            "location": "Mall of the Emirates vicinity",
            "age": "22–50",
            "gender": "All",
            "interests": ["Shopping", "Dining Out", "Lifestyle"],
            "customAudiences": ["MOE Geo-targeted"],
            "behaviors": ["Shoppers", "Weekend Diners"],
            "excluded": []
          }
        },
        {
          "name": "Corporate & MICE",
          "impressions": 75200,
          "clicks": 1972,
          "ctr": 2.623404,
          "linkClicks": 1366,
          "engagement": 3204,
          "audience": {
            "type": "Custom",
            "location": "Dubai Business Districts",
            "age": "30–55",
            "gender": "All",
            "interests": ["Business Events", "Conferences", "Corporate Travel"],
            "customAudiences": ["LinkedIn Matched Audience"],
            "behaviors": ["Business Decision Makers"],
            "excluded": []
          }
        }
      ],
      "ads": [
        {
          "name": "Sheraton MOE Hero Video — February",
          "adSet": "Luxury Travellers",
          "status": "active",
          "impressions": 112480,
          "clicks": 3012,
          "ctr": 2.677807,
          "linkClicks": 1894,
          "engagement": 5842
        },
        {
          "name": "Valentine''s Staycation Static",
          "adSet": "Mall Visitors",
          "status": "active",
          "impressions": 94180,
          "clicks": 2416,
          "ctr": 2.565291,
          "linkClicks": 1497,
          "engagement": 3812
        },
        {
          "name": "MICE Package — Q1 2026",
          "adSet": "Corporate & MICE",
          "status": "active",
          "impressions": 75200,
          "clicks": 1972,
          "ctr": 2.623404,
          "linkClicks": 1366,
          "engagement": 3204
        }
      ],
      "analysis": {
        "summary": "Sheraton MOE campaigns delivered strong reach across all three audience segments in February. The Brand Awareness campaign led with 184K impressions, while the MICE package generated high-quality clicks from the corporate segment. Valentine''s Staycation content resonated well with the Mall Visitors audience.",
        "recommendations": [
          "Scale the Luxury Travellers adset budget in March — it''s delivering the strongest CTR at 2.68%.",
          "Request new spring/pool season creative assets for the March awareness campaign.",
          "Develop a Ramadan hospitality package campaign — brief creative team now for late March launch."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Sheraton MOE' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Sheraton MOE' LIMIT 1),
  '2026-02-01', '2026-02-24', 10604.00,
  '{
    "campaigns": [
      { "name": "Sheraton MOE - Brand Awareness", "status": "ACTIVE", "impressions": 184320, "clicks": 4782, "ctr": 2.594401, "linkClicks": 2914, "engagement": 8641 },
      { "name": "Sheraton MOE - Traffic", "status": "ACTIVE", "impressions": 97540, "clicks": 2618, "ctr": 2.684701, "linkClicks": 1843, "engagement": 4217 }
    ],
    "adSets": [
      { "name": "Luxury Travellers", "impressions": 112480, "clicks": 3012, "ctr": 2.677807, "linkClicks": 1894, "engagement": 5842, "audience": { "type": "Advantage+", "location": "Dubai, UAE + GCC", "age": "28–55", "gender": "All", "interests": ["Luxury Hotels","Travel","Fine Dining"], "customAudiences": ["Website Visitors","Past Guests"], "behaviors": ["Frequent Travellers","Business Class"], "excluded": [] } },
      { "name": "Mall Visitors", "impressions": 94180, "clicks": 2416, "ctr": 2.565291, "linkClicks": 1497, "engagement": 3812, "audience": { "type": "Custom", "location": "Mall of the Emirates vicinity", "age": "22–50", "gender": "All", "interests": ["Shopping","Dining Out","Lifestyle"], "customAudiences": ["MOE Geo-targeted"], "behaviors": ["Shoppers","Weekend Diners"], "excluded": [] } },
      { "name": "Corporate & MICE", "impressions": 75200, "clicks": 1972, "ctr": 2.623404, "linkClicks": 1366, "engagement": 3204, "audience": { "type": "Custom", "location": "Dubai Business Districts", "age": "30–55", "gender": "All", "interests": ["Business Events","Conferences","Corporate Travel"], "customAudiences": ["LinkedIn Matched Audience"], "behaviors": ["Business Decision Makers"], "excluded": [] } }
    ],
    "ads": [
      { "name": "Sheraton MOE Hero Video — February", "adSet": "Luxury Travellers", "status": "active", "impressions": 112480, "clicks": 3012, "ctr": 2.677807, "linkClicks": 1894, "engagement": 5842 },
      { "name": "Valentine''s Staycation Static", "adSet": "Mall Visitors", "status": "active", "impressions": 94180, "clicks": 2416, "ctr": 2.565291, "linkClicks": 1497, "engagement": 3812 },
      { "name": "MICE Package — Q1 2026", "adSet": "Corporate & MICE", "status": "active", "impressions": 75200, "clicks": 1972, "ctr": 2.623404, "linkClicks": 1366, "engagement": 3204 }
    ],
    "analysis": { "summary": "Sheraton MOE campaigns delivered strong reach across all three audience segments in February. The Brand Awareness campaign led with 184K impressions, while the MICE package generated high-quality clicks from the corporate segment. Valentine''s Staycation content resonated well with the Mall Visitors audience.", "recommendations": ["Scale the Luxury Travellers adset budget in March — it''s delivering the strongest CTR at 2.68%.", "Request new spring/pool season creative assets for the March awareness campaign.", "Develop a Ramadan hospitality package campaign — brief creative team now for late March launch."] }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── BESH TURKISH KITCHEN ─────────────────────────────────
-- Revenue: ~630K AED total | ~118K online | 1,324 res
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 1762.00,
    revenue_data = '{
      "totalBusiness": 628540.00,
      "totalReservations": 1324,
      "totalOnline": 117840.00,
      "onlineReservations": 156,
      "channels": {
        "Vanity Site":        { "revenue": 64210.00, "reservations": 84 },
        "Google":             { "revenue": 28940.00, "reservations": 38 },
        "Booking Widget":     { "revenue": 18320.00, "reservations": 23 },
        "7X Landing Page - Valentine''s at Besh": { "revenue": 5480.00, "reservations": 8 },
        "TheFork":            { "revenue": 890.00,   "reservations": 3 }
      },
      "offline": {
        "Walk In":            { "revenue": 298140.00, "reservations": 892 },
        "Internal: Shift":    { "revenue": 174820.00, "reservations": 264 },
        "Internal: Access Rule": { "revenue": 1540.00, "reservations": 4 },
        "Other - Manual":     { "revenue": 34300.00,  "reservations": 8 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "Besh Campaigns - Traffic", "status": "ACTIVE", "impressions": 68420, "clicks": 1847, "ctr": 2.699795, "linkClicks": 1284, "engagement": 3612 },
        { "name": "Besh Campaigns - Community", "status": "ACTIVE", "impressions": 41280, "clicks": 1124, "ctr": 2.721899, "linkClicks": 481, "engagement": 2847 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 68420, "clicks": 1847, "ctr": 2.699795, "linkClicks": 1284, "engagement": 3612, "audience": { "type": "Advantage+", "location": "Dubai, UAE", "age": "25–50", "gender": "All", "interests": ["Turkish Cuisine","Middle Eastern Food","Fine Dining"], "customAudiences": ["Website Visitors"], "behaviors": ["Restaurant Goers","Food Enthusiasts"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 41280, "clicks": 1124, "ctr": 2.721899, "linkClicks": 481, "engagement": 2847, "audience": { "type": "Custom", "location": "Dubai, UAE", "age": "22–45", "gender": "All", "interests": ["Food","Istanbul Lifestyle","Travel"], "customAudiences": [], "behaviors": ["Social Media Foodies"], "excluded": [] } }
      ],
      "ads": [
        { "name": "Besh February Traffic Reel", "adSet": "Generic", "status": "active", "impressions": 68420, "clicks": 1847, "ctr": 2.699795, "linkClicks": 1284, "engagement": 3612 },
        { "name": "Turkish Mezze Spread 🍽️", "adSet": "IG Boosters", "status": "active", "impressions": 24810, "clicks": 682, "ctr": 2.748890, "linkClicks": 291, "engagement": 1742 },
        { "name": "Valentine''s at Besh — Couple''s Menu", "adSet": "IG Boosters", "status": "active", "impressions": 16470, "clicks": 442, "ctr": 2.683667, "linkClicks": 190, "engagement": 1105 }
      ],
      "analysis": {
        "summary": "Besh Turkish Kitchen had a solid February anchored by Valentine''s Day table bookings and strong organic engagement on Turkish food content. The Traffic campaign delivered consistent reach across the Dubai dining audience. The Valentine''s dedicated landing page converted well with 8 reservations from a targeted spend.",
        "recommendations": [
          "Request new March Reels — chef''s table content, signature dishes and Turkish brunch concept.",
          "Expand TheFork presence — only 3 reservations this period, potential to grow with promotions.",
          "Brief creative team on a Ramadan iftar menu campaign for launch in mid-March."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Besh Turkish Kitchen' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Besh Turkish Kitchen' LIMIT 1),
  '2026-02-01', '2026-02-24', 1762.00,
  '{ "totalBusiness": 628540.00, "totalReservations": 1324, "totalOnline": 117840.00, "onlineReservations": 156, "channels": { "Vanity Site": { "revenue": 64210.00, "reservations": 84 }, "Google": { "revenue": 28940.00, "reservations": 38 }, "Booking Widget": { "revenue": 18320.00, "reservations": 23 }, "7X Landing Page - Valentine''s at Besh": { "revenue": 5480.00, "reservations": 8 }, "TheFork": { "revenue": 890.00, "reservations": 3 } }, "offline": { "Walk In": { "revenue": 298140.00, "reservations": 892 }, "Internal: Shift": { "revenue": 174820.00, "reservations": 264 }, "Internal: Access Rule": { "revenue": 1540.00, "reservations": 4 }, "Other - Manual": { "revenue": 34300.00, "reservations": 8 } } }'::jsonb,
  '{ "campaigns": [ { "name": "Besh Campaigns - Traffic", "status": "ACTIVE", "impressions": 68420, "clicks": 1847, "ctr": 2.699795, "linkClicks": 1284, "engagement": 3612 }, { "name": "Besh Campaigns - Community", "status": "ACTIVE", "impressions": 41280, "clicks": 1124, "ctr": 2.721899, "linkClicks": 481, "engagement": 2847 } ], "adSets": [ { "name": "Generic", "impressions": 68420, "clicks": 1847, "ctr": 2.699795, "linkClicks": 1284, "engagement": 3612, "audience": { "type": "Advantage+", "location": "Dubai, UAE", "age": "25–50", "gender": "All", "interests": ["Turkish Cuisine","Middle Eastern Food","Fine Dining"], "customAudiences": ["Website Visitors"], "behaviors": ["Restaurant Goers","Food Enthusiasts"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 41280, "clicks": 1124, "ctr": 2.721899, "linkClicks": 481, "engagement": 2847, "audience": { "type": "Custom", "location": "Dubai, UAE", "age": "22–45", "gender": "All", "interests": ["Food","Istanbul Lifestyle","Travel"], "customAudiences": [], "behaviors": ["Social Media Foodies"], "excluded": [] } } ], "ads": [ { "name": "Besh February Traffic Reel", "adSet": "Generic", "status": "active", "impressions": 68420, "clicks": 1847, "ctr": 2.699795, "linkClicks": 1284, "engagement": 3612 }, { "name": "Turkish Mezze Spread \uD83C\uDF7D\uFE0F", "adSet": "IG Boosters", "status": "active", "impressions": 24810, "clicks": 682, "ctr": 2.748890, "linkClicks": 291, "engagement": 1742 }, { "name": "Valentine''s at Besh — Couple''s Menu", "adSet": "IG Boosters", "status": "active", "impressions": 16470, "clicks": 442, "ctr": 2.683667, "linkClicks": 190, "engagement": 1105 } ], "analysis": { "summary": "Besh Turkish Kitchen had a solid February anchored by Valentine''s Day table bookings and strong organic engagement on Turkish food content. The Traffic campaign delivered consistent reach across the Dubai dining audience. The Valentine''s dedicated landing page converted well with 8 reservations from a targeted spend.", "recommendations": ["Request new March Reels — chef''s table content, signature dishes and Turkish brunch concept.", "Expand TheFork presence — only 3 reservations this period, potential to grow with promotions.", "Brief creative team on a Ramadan iftar menu campaign for launch in mid-March."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── SPARTAN SPORTS BAR ───────────────────────────────────
-- Revenue: ~560K AED total | ~88K online | 1,148 res
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 1780.00,
    revenue_data = '{
      "totalBusiness": 557820.00,
      "totalReservations": 1148,
      "totalOnline": 88240.00,
      "onlineReservations": 117,
      "channels": {
        "Vanity Site":        { "revenue": 48310.00, "reservations": 63 },
        "Google":             { "revenue": 21840.00, "reservations": 29 },
        "Booking Widget":     { "revenue": 14620.00, "reservations": 19 },
        "7X Landing Page - Champions League Night": { "revenue": 3470.00, "reservations": 6 }
      },
      "offline": {
        "Walk In":            { "revenue": 284140.00, "reservations": 762 },
        "Internal: Shift":    { "revenue": 152640.00, "reservations": 238 },
        "Internal: Access Rule": { "revenue": 980.00,  "reservations": 3 },
        "Other - Manual":     { "revenue": 27420.00,  "reservations": 29 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "Spartan Campaigns - Traffic", "status": "ACTIVE", "impressions": 74180, "clicks": 1984, "ctr": 2.674038, "linkClicks": 1389, "engagement": 3841 },
        { "name": "Spartan Campaigns - Community", "status": "ACTIVE", "impressions": 38640, "clicks": 1047, "ctr": 2.709626, "linkClicks": 448, "engagement": 2614 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 74180, "clicks": 1984, "ctr": 2.674038, "linkClicks": 1389, "engagement": 3841, "audience": { "type": "Advantage+", "location": "Dubai, UAE", "age": "22–45", "gender": "All", "interests": ["Sports","Football","Sports Bars","Happy Hour"], "customAudiences": ["Website Visitors"], "behaviors": ["Sports Fans","Nightlife Goers"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 38640, "clicks": 1047, "ctr": 2.709626, "linkClicks": 448, "engagement": 2614, "audience": { "type": "Custom", "location": "Dubai, UAE + SZR corridor", "age": "21–40", "gender": "All", "interests": ["Beer","Sports Events","Pub Culture"], "customAudiences": [], "behaviors": ["Expats & Social Crowd"], "excluded": [] } }
      ],
      "ads": [
        { "name": "Spartan Match Day Package Reel", "adSet": "Generic", "status": "active", "impressions": 74180, "clicks": 1984, "ctr": 2.674038, "linkClicks": 1389, "engagement": 3841 },
        { "name": "Champions League Nights 🏆", "adSet": "IG Boosters", "status": "active", "impressions": 22480, "clicks": 614, "ctr": 2.731318, "linkClicks": 262, "engagement": 1584 },
        { "name": "Happy Hour — Daily 4–7PM", "adSet": "IG Boosters", "status": "active", "impressions": 16160, "clicks": 433, "ctr": 2.678218, "linkClicks": 186, "engagement": 1030 }
      ],
      "analysis": {
        "summary": "Spartan Sports Bar benefitted from a packed February football calendar with Champions League and international fixtures driving strong match-day footfall. The Champions League Nights boosted post performed well. The Valentine''s period saw softer traffic as expected for a sports bar concept.",
        "recommendations": [
          "Plan March content around the UCL knockout stage — request match-day creative assets immediately.",
          "Launch a dedicated Happy Hour campaign in March to fill weekday afternoon slots.",
          "Brief creative team on a Ramadan mocktail and F&B menu campaign for end-of-March."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Spartan Sports Bar' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Spartan Sports Bar' LIMIT 1),
  '2026-02-01', '2026-02-24', 1780.00,
  '{ "totalBusiness": 557820.00, "totalReservations": 1148, "totalOnline": 88240.00, "onlineReservations": 117, "channels": { "Vanity Site": { "revenue": 48310.00, "reservations": 63 }, "Google": { "revenue": 21840.00, "reservations": 29 }, "Booking Widget": { "revenue": 14620.00, "reservations": 19 }, "7X Landing Page - Champions League Night": { "revenue": 3470.00, "reservations": 6 } }, "offline": { "Walk In": { "revenue": 284140.00, "reservations": 762 }, "Internal: Shift": { "revenue": 152640.00, "reservations": 238 }, "Internal: Access Rule": { "revenue": 980.00, "reservations": 3 }, "Other - Manual": { "revenue": 27420.00, "reservations": 29 } } }'::jsonb,
  '{ "campaigns": [ { "name": "Spartan Campaigns - Traffic", "status": "ACTIVE", "impressions": 74180, "clicks": 1984, "ctr": 2.674038, "linkClicks": 1389, "engagement": 3841 }, { "name": "Spartan Campaigns - Community", "status": "ACTIVE", "impressions": 38640, "clicks": 1047, "ctr": 2.709626, "linkClicks": 448, "engagement": 2614 } ], "adSets": [ { "name": "Generic", "impressions": 74180, "clicks": 1984, "ctr": 2.674038, "linkClicks": 1389, "engagement": 3841, "audience": { "type": "Advantage+", "location": "Dubai, UAE", "age": "22–45", "gender": "All", "interests": ["Sports","Football","Sports Bars","Happy Hour"], "customAudiences": ["Website Visitors"], "behaviors": ["Sports Fans","Nightlife Goers"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 38640, "clicks": 1047, "ctr": 2.709626, "linkClicks": 448, "engagement": 2614, "audience": { "type": "Custom", "location": "Dubai, UAE + SZR corridor", "age": "21–40", "gender": "All", "interests": ["Beer","Sports Events","Pub Culture"], "customAudiences": [], "behaviors": ["Expats & Social Crowd"], "excluded": [] } } ], "ads": [ { "name": "Spartan Match Day Package Reel", "adSet": "Generic", "status": "active", "impressions": 74180, "clicks": 1984, "ctr": 2.674038, "linkClicks": 1389, "engagement": 3841 }, { "name": "Champions League Nights \uD83C\uDFC6", "adSet": "IG Boosters", "status": "active", "impressions": 22480, "clicks": 614, "ctr": 2.731318, "linkClicks": 262, "engagement": 1584 }, { "name": "Happy Hour — Daily 4–7PM", "adSet": "IG Boosters", "status": "active", "impressions": 16160, "clicks": 433, "ctr": 2.678218, "linkClicks": 186, "engagement": 1030 } ], "analysis": { "summary": "Spartan Sports Bar benefitted from a packed February football calendar with Champions League and international fixtures driving strong match-day footfall. The Champions League Nights boosted post performed well. The Valentine''s period saw softer traffic as expected for a sports bar concept.", "recommendations": ["Plan March content around the UCL knockout stage — request match-day creative assets immediately.", "Launch a dedicated Happy Hour campaign in March to fill weekday afternoon slots.", "Brief creative team on a Ramadan mocktail and F&B menu campaign for end-of-March."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── OANJO DUBAI ──────────────────────────────────────────
-- Revenue: ~710K AED total | ~152K online | 924 res
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 2231.00,
    revenue_data = '{
      "totalBusiness": 712480.00,
      "totalReservations": 924,
      "totalOnline": 151640.00,
      "onlineReservations": 201,
      "channels": {
        "Vanity Site":        { "revenue": 82410.00, "reservations": 108 },
        "Google":             { "revenue": 34820.00, "reservations": 46 },
        "Booking Widget":     { "revenue": 24180.00, "reservations": 32 },
        "7X Landing Page - Valentine''s Fine Dining at OAnjo": { "revenue": 8640.00, "reservations": 11 },
        "Instagram":          { "revenue": 1590.00,  "reservations": 4 }
      },
      "offline": {
        "Walk In":            { "revenue": 328440.00, "reservations": 524 },
        "Internal: Shift":    { "revenue": 196840.00, "reservations": 181 },
        "Internal: Access Rule": { "revenue": 2140.00, "reservations": 5 },
        "Other - Manual":     { "revenue": 31420.00,  "reservations": 13 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "OAnjo Campaigns - Traffic", "status": "ACTIVE", "impressions": 82640, "clicks": 2248, "ctr": 2.720640, "linkClicks": 1587, "engagement": 4312 },
        { "name": "OAnjo Campaigns - Community", "status": "ACTIVE", "impressions": 49180, "clicks": 1341, "ctr": 2.726720, "linkClicks": 574, "engagement": 3184 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 82640, "clicks": 2248, "ctr": 2.720640, "linkClicks": 1587, "engagement": 4312, "audience": { "type": "Advantage+", "location": "Dubai, UAE", "age": "28–55", "gender": "All", "interests": ["Fine Dining","Portuguese Cuisine","Upscale Restaurants"], "customAudiences": ["Website Visitors","Past Guests"], "behaviors": ["Luxury Diners","High Net Worth"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 49180, "clicks": 1341, "ctr": 2.726720, "linkClicks": 574, "engagement": 3184, "audience": { "type": "Custom", "location": "Dubai, UAE", "age": "25–50", "gender": "All", "interests": ["Food Photography","Gourmet Dining","Wine"], "customAudiences": [], "behaviors": ["Food Influencers","Premium Lifestyle"], "excluded": [] } }
      ],
      "ads": [
        { "name": "OAnjo February Signature Menu Reel", "adSet": "Generic", "status": "active", "impressions": 82640, "clicks": 2248, "ctr": 2.720640, "linkClicks": 1587, "engagement": 4312 },
        { "name": "Valentine''s Fine Dining — 5 Course 🍷", "adSet": "IG Boosters", "status": "active", "impressions": 31240, "clicks": 852, "ctr": 2.727272, "linkClicks": 365, "engagement": 2041 },
        { "name": "OAnjo Chef''s Tasting Table 🍽️", "adSet": "IG Boosters", "status": "active", "impressions": 17940, "clicks": 489, "ctr": 2.726867, "linkClicks": 209, "engagement": 1143 }
      ],
      "analysis": {
        "summary": "OAnjo Dubai delivered the strongest revenue among the Sheraton F&B restaurants in February at AED 712K, driven by a high-performing Valentine''s fine dining campaign. The Instagram channel directly converted 4 reservations — a strong signal for social commerce potential. Online reservations at 201 represent 21.8% of total, above the portfolio benchmark.",
        "recommendations": [
          "Scale the Instagram and Vanity Site channels — they are generating the highest-quality conversions.",
          "Request a chef''s table video series for March — premium content to support the luxury positioning.",
          "Develop a spring tasting menu campaign with a dedicated landing page for March traffic spend."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'OAnjo Dubai' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'OAnjo Dubai' LIMIT 1),
  '2026-02-01', '2026-02-24', 2231.00,
  '{ "totalBusiness": 712480.00, "totalReservations": 924, "totalOnline": 151640.00, "onlineReservations": 201, "channels": { "Vanity Site": { "revenue": 82410.00, "reservations": 108 }, "Google": { "revenue": 34820.00, "reservations": 46 }, "Booking Widget": { "revenue": 24180.00, "reservations": 32 }, "7X Landing Page - Valentine''s Fine Dining at OAnjo": { "revenue": 8640.00, "reservations": 11 }, "Instagram": { "revenue": 1590.00, "reservations": 4 } }, "offline": { "Walk In": { "revenue": 328440.00, "reservations": 524 }, "Internal: Shift": { "revenue": 196840.00, "reservations": 181 }, "Internal: Access Rule": { "revenue": 2140.00, "reservations": 5 }, "Other - Manual": { "revenue": 31420.00, "reservations": 13 } } }'::jsonb,
  '{ "campaigns": [ { "name": "OAnjo Campaigns - Traffic", "status": "ACTIVE", "impressions": 82640, "clicks": 2248, "ctr": 2.720640, "linkClicks": 1587, "engagement": 4312 }, { "name": "OAnjo Campaigns - Community", "status": "ACTIVE", "impressions": 49180, "clicks": 1341, "ctr": 2.726720, "linkClicks": 574, "engagement": 3184 } ], "adSets": [ { "name": "Generic", "impressions": 82640, "clicks": 2248, "ctr": 2.720640, "linkClicks": 1587, "engagement": 4312, "audience": { "type": "Advantage+", "location": "Dubai, UAE", "age": "28–55", "gender": "All", "interests": ["Fine Dining","Portuguese Cuisine","Upscale Restaurants"], "customAudiences": ["Website Visitors","Past Guests"], "behaviors": ["Luxury Diners","High Net Worth"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 49180, "clicks": 1341, "ctr": 2.726720, "linkClicks": 574, "engagement": 3184, "audience": { "type": "Custom", "location": "Dubai, UAE", "age": "25–50", "gender": "All", "interests": ["Food Photography","Gourmet Dining","Wine"], "customAudiences": [], "behaviors": ["Food Influencers","Premium Lifestyle"], "excluded": [] } } ], "ads": [ { "name": "OAnjo February Signature Menu Reel", "adSet": "Generic", "status": "active", "impressions": 82640, "clicks": 2248, "ctr": 2.720640, "linkClicks": 1587, "engagement": 4312 }, { "name": "Valentine''s Fine Dining — 5 Course \uD83C\uDF77", "adSet": "IG Boosters", "status": "active", "impressions": 31240, "clicks": 852, "ctr": 2.727272, "linkClicks": 365, "engagement": 2041 }, { "name": "OAnjo Chef''s Tasting Table \uD83C\uDF7D\uFE0F", "adSet": "IG Boosters", "status": "active", "impressions": 17940, "clicks": 489, "ctr": 2.726867, "linkClicks": 209, "engagement": 1143 } ], "analysis": { "summary": "OAnjo Dubai delivered the strongest revenue among the Sheraton F&B restaurants in February at AED 712K, driven by a high-performing Valentine''s fine dining campaign. The Instagram channel directly converted 4 reservations — a strong signal for social commerce potential. Online reservations at 201 represent 21.8% of total, above the portfolio benchmark.", "recommendations": ["Scale the Instagram and Vanity Site channels — they are generating the highest-quality conversions.", "Request a chef''s table video series for March — premium content to support the luxury positioning.", "Develop a spring tasting menu campaign with a dedicated landing page for March traffic spend."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);
