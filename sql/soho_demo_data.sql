-- ============================================================
-- Soho Hospitality Demo — Weekly Reports (Feb 1–24, 2026)
-- 6 venues: Soho Hospitality (umbrella), Above Eleven Bangkok,
--           APT 101, YANKII, Charcoal Tandoor, Cantina
-- All figures in THB
-- ============================================================


-- ── SOHO HOSPITALITY (UMBRELLA) ──────────────────────────
-- Group umbrella — meta campaigns only, no F&B revenue
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend  = 84000.00,
    meta_data = '{
      "campaigns": [
        {
          "name": "Soho Hospitality - Brand Awareness",
          "status": "ACTIVE",
          "impressions": 248420,
          "clicks": 6248,
          "ctr": 2.514401,
          "linkClicks": 3842,
          "engagement": 11284
        },
        {
          "name": "Soho Hospitality - Group Traffic",
          "status": "ACTIVE",
          "impressions": 124840,
          "clicks": 3284,
          "ctr": 2.630001,
          "linkClicks": 2284,
          "engagement": 5848
        }
      ],
      "adSets": [
        {
          "name": "Bangkok Lifestyle & Nightlife",
          "impressions": 168420,
          "clicks": 4284,
          "ctr": 2.544801,
          "linkClicks": 2684,
          "engagement": 7848,
          "audience": {
            "type": "Advantage+",
            "location": "Bangkok, Thailand + Expats",
            "age": "24–45",
            "gender": "All",
            "interests": ["Nightlife", "Fine Dining", "Cocktail Bars", "Bangkok Food Scene"],
            "customAudiences": ["Website Visitors", "Instagram Engagers"],
            "behaviors": ["Frequent Diners", "Nightlife Enthusiasts"],
            "excluded": []
          }
        },
        {
          "name": "Luxury & Expat Community",
          "impressions": 124840,
          "clicks": 3248,
          "ctr": 2.601601,
          "linkClicks": 1884,
          "engagement": 5284,
          "audience": {
            "type": "Custom",
            "location": "Bangkok — Sukhumvit, Silom, Sathorn",
            "age": "28–50",
            "gender": "All",
            "interests": ["Luxury Lifestyle", "Expat Bangkok", "Rooftop Bars"],
            "customAudiences": ["Lookalike — Past Visitors"],
            "behaviors": ["High-Income Earners", "International Travellers"],
            "excluded": []
          }
        },
        {
          "name": "Tourism & Inbound",
          "impressions": 80000,
          "clicks": 2000,
          "ctr": 2.500000,
          "linkClicks": 1442,
          "engagement": 4000,
          "audience": {
            "type": "Custom",
            "location": "Bangkok + Inbound Tourism (TH)",
            "age": "25–55",
            "gender": "All",
            "interests": ["Travel", "Tourism Thailand", "Luxury Hotels"],
            "customAudiences": ["Hotel Guest Lookalike"],
            "behaviors": ["International Visitors", "Business Travellers"],
            "excluded": []
          }
        }
      ],
      "ads": [
        {
          "name": "Soho Hospitality Brand Reel — February",
          "adSet": "Bangkok Lifestyle & Nightlife",
          "status": "active",
          "impressions": 168420,
          "clicks": 4284,
          "ctr": 2.544801,
          "linkClicks": 2684,
          "engagement": 7848
        },
        {
          "name": "Valentine''s in Bangkok — Soho Group",
          "adSet": "Luxury & Expat Community",
          "status": "active",
          "impressions": 124840,
          "clicks": 3248,
          "ctr": 2.601601,
          "linkClicks": 1884,
          "engagement": 5284
        },
        {
          "name": "Discover Bangkok''s Best Venues 🌆",
          "adSet": "Tourism & Inbound",
          "status": "active",
          "impressions": 80000,
          "clicks": 2000,
          "ctr": 2.500000,
          "linkClicks": 1442,
          "engagement": 4000
        }
      ],
      "analysis": {
        "summary": "Soho Hospitality''s brand campaigns delivered strong group-level reach across Bangkok and the expat community in February. The Brand Awareness campaign led with 248K impressions, while the Group Traffic campaign drove qualified visits across all venues. Valentine''s content performed above benchmark across the portfolio.",
        "recommendations": [
          "Develop a Songkran group campaign for April — brief creative team in mid-March.",
          "Scale the Tourism & Inbound adset heading into high season — inbound traffic picks up March through May.",
          "Request a portfolio brand video for Q2 to showcase the full Soho Hospitality venue lineup."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Soho Hospitality' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Soho Hospitality' LIMIT 1),
  '2026-02-01', '2026-02-24', 84000.00,
  '{
    "campaigns": [
      { "name": "Soho Hospitality - Brand Awareness", "status": "ACTIVE", "impressions": 248420, "clicks": 6248, "ctr": 2.514401, "linkClicks": 3842, "engagement": 11284 },
      { "name": "Soho Hospitality - Group Traffic", "status": "ACTIVE", "impressions": 124840, "clicks": 3284, "ctr": 2.630001, "linkClicks": 2284, "engagement": 5848 }
    ],
    "adSets": [
      { "name": "Bangkok Lifestyle & Nightlife", "impressions": 168420, "clicks": 4284, "ctr": 2.544801, "linkClicks": 2684, "engagement": 7848, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand + Expats", "age": "24–45", "gender": "All", "interests": ["Nightlife","Fine Dining","Cocktail Bars","Bangkok Food Scene"], "customAudiences": ["Website Visitors","Instagram Engagers"], "behaviors": ["Frequent Diners","Nightlife Enthusiasts"], "excluded": [] } },
      { "name": "Luxury & Expat Community", "impressions": 124840, "clicks": 3248, "ctr": 2.601601, "linkClicks": 1884, "engagement": 5284, "audience": { "type": "Custom", "location": "Bangkok — Sukhumvit, Silom, Sathorn", "age": "28–50", "gender": "All", "interests": ["Luxury Lifestyle","Expat Bangkok","Rooftop Bars"], "customAudiences": ["Lookalike — Past Visitors"], "behaviors": ["High-Income Earners","International Travellers"], "excluded": [] } },
      { "name": "Tourism & Inbound", "impressions": 80000, "clicks": 2000, "ctr": 2.500000, "linkClicks": 1442, "engagement": 4000, "audience": { "type": "Custom", "location": "Bangkok + Inbound Tourism (TH)", "age": "25–55", "gender": "All", "interests": ["Travel","Tourism Thailand","Luxury Hotels"], "customAudiences": ["Hotel Guest Lookalike"], "behaviors": ["International Visitors","Business Travellers"], "excluded": [] } }
    ],
    "ads": [
      { "name": "Soho Hospitality Brand Reel — February", "adSet": "Bangkok Lifestyle & Nightlife", "status": "active", "impressions": 168420, "clicks": 4284, "ctr": 2.544801, "linkClicks": 2684, "engagement": 7848 },
      { "name": "Valentine''s in Bangkok — Soho Group", "adSet": "Luxury & Expat Community", "status": "active", "impressions": 124840, "clicks": 3248, "ctr": 2.601601, "linkClicks": 1884, "engagement": 5284 },
      { "name": "Discover Bangkok''s Best Venues 🌆", "adSet": "Tourism & Inbound", "status": "active", "impressions": 80000, "clicks": 2000, "ctr": 2.500000, "linkClicks": 1442, "engagement": 4000 }
    ],
    "analysis": { "summary": "Soho Hospitality''s brand campaigns delivered strong group-level reach across Bangkok and the expat community in February. The Brand Awareness campaign led with 248K impressions, while the Group Traffic campaign drove qualified visits across all venues. Valentine''s content performed above benchmark across the portfolio.", "recommendations": ["Develop a Songkran group campaign for April — brief creative team in mid-March.", "Scale the Tourism & Inbound adset heading into high season — inbound traffic picks up March through May.", "Request a portfolio brand video for Q2 to showcase the full Soho Hospitality venue lineup."] }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── ABOVE ELEVEN BANGKOK ─────────────────────────────────
-- Revenue: ~4.28M THB | ~824K online | 1,840 reservations
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 124000.00,
    revenue_data = '{
      "totalBusiness": 4284000.00,
      "totalReservations": 1840,
      "totalOnline": 824000.00,
      "onlineReservations": 218,
      "channels": {
        "Vanity Site":        { "revenue": 448000.00, "reservations": 118 },
        "Google":             { "revenue": 184000.00, "reservations": 48 },
        "Booking Widget":     { "revenue": 128000.00, "reservations": 34 },
        "7X Landing Page - Rooftop Valentine''s": { "revenue": 42000.00, "reservations": 12 },
        "Instagram":          { "revenue": 22000.00,  "reservations": 6 }
      },
      "offline": {
        "Walk In":            { "revenue": 2184000.00, "reservations": 1124 },
        "Internal: Shift":    { "revenue": 1084000.00, "reservations": 428 },
        "Internal: Access Rule": { "revenue": 8000.00, "reservations": 4 },
        "Other - Manual":     { "revenue": 184000.00,  "reservations": 66 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "Above Eleven - Traffic", "status": "ACTIVE", "impressions": 128420, "clicks": 3484, "ctr": 2.713801, "linkClicks": 2428, "engagement": 6842 },
        { "name": "Above Eleven - Community", "status": "ACTIVE", "impressions": 72840, "clicks": 1984, "ctr": 2.723001, "linkClicks": 848, "engagement": 4842 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 128420, "clicks": 3484, "ctr": 2.713801, "linkClicks": 2428, "engagement": 6842, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "25–45", "gender": "All", "interests": ["Rooftop Bars", "Fine Dining", "Cocktails", "Bangkok Nightlife"], "customAudiences": ["Website Visitors", "Past Guests"], "behaviors": ["Frequent Diners", "Nightlife Enthusiasts"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 48420, "clicks": 1284, "ctr": 2.651000, "linkClicks": 548, "engagement": 3124, "audience": { "type": "Custom", "location": "Bangkok — Sukhumvit corridor", "age": "24–40", "gender": "All", "interests": ["Food Photography", "Rooftop Views", "Bangkok Bars"], "customAudiences": [], "behaviors": ["Social Media Foodies", "Expat Community"], "excluded": [] } },
        { "name": "Valentine''s Special", "impressions": 24420, "clicks": 700, "ctr": 2.866000, "linkClicks": 300, "engagement": 1718, "audience": { "type": "Custom", "location": "Bangkok", "age": "26–40", "gender": "All", "interests": ["Date Night", "Rooftop Dining", "Valentine''s"], "customAudiences": ["Couples Lookalike"], "behaviors": ["Couples", "Anniversary Diners"], "excluded": [] } }
      ],
      "ads": [
        { "name": "Above Eleven — February Rooftop Reel", "adSet": "Generic", "status": "active", "impressions": 128420, "clicks": 3484, "ctr": 2.713801, "linkClicks": 2428, "engagement": 6842 },
        { "name": "Sunset Sessions 🌅 — Every Evening", "adSet": "IG Boosters", "status": "active", "impressions": 48420, "clicks": 1284, "ctr": 2.651000, "linkClicks": 548, "engagement": 3124 },
        { "name": "Valentine''s Rooftop Dinner 🌹 — For Two", "adSet": "Valentine''s Special", "status": "active", "impressions": 24420, "clicks": 700, "ctr": 2.866000, "linkClicks": 300, "engagement": 1718 }
      ],
      "analysis": {
        "summary": "Above Eleven Bangkok delivered a strong February anchored by Valentine''s rooftop dining and consistent evening crowd content. The Traffic campaign drove 128K impressions from Bangkok''s dining and nightlife audience. The dedicated Valentine''s landing page converted 12 reservations at a strong cost-per-booking, while Instagram directly drove 6 bookings — a growing social commerce signal.",
        "recommendations": [
          "Launch a Songkran rooftop party campaign in March for the April holiday — brief creative team immediately.",
          "Scale Instagram as a booking channel — 6 direct reservations this period shows strong intent-to-book from social.",
          "Request new sunset/skyline creative assets for Q2 — current February content will fatigue by end of March."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Above Eleven Bangkok' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Above Eleven Bangkok' LIMIT 1),
  '2026-02-01', '2026-02-24', 124000.00,
  '{ "totalBusiness": 4284000.00, "totalReservations": 1840, "totalOnline": 824000.00, "onlineReservations": 218, "channels": { "Vanity Site": { "revenue": 448000.00, "reservations": 118 }, "Google": { "revenue": 184000.00, "reservations": 48 }, "Booking Widget": { "revenue": 128000.00, "reservations": 34 }, "7X Landing Page - Rooftop Valentine''s": { "revenue": 42000.00, "reservations": 12 }, "Instagram": { "revenue": 22000.00, "reservations": 6 } }, "offline": { "Walk In": { "revenue": 2184000.00, "reservations": 1124 }, "Internal: Shift": { "revenue": 1084000.00, "reservations": 428 }, "Internal: Access Rule": { "revenue": 8000.00, "reservations": 4 }, "Other - Manual": { "revenue": 184000.00, "reservations": 66 } } }'::jsonb,
  '{ "campaigns": [ { "name": "Above Eleven - Traffic", "status": "ACTIVE", "impressions": 128420, "clicks": 3484, "ctr": 2.713801, "linkClicks": 2428, "engagement": 6842 }, { "name": "Above Eleven - Community", "status": "ACTIVE", "impressions": 72840, "clicks": 1984, "ctr": 2.723001, "linkClicks": 848, "engagement": 4842 } ], "adSets": [ { "name": "Generic", "impressions": 128420, "clicks": 3484, "ctr": 2.713801, "linkClicks": 2428, "engagement": 6842, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "25–45", "gender": "All", "interests": ["Rooftop Bars","Fine Dining","Cocktails","Bangkok Nightlife"], "customAudiences": ["Website Visitors","Past Guests"], "behaviors": ["Frequent Diners","Nightlife Enthusiasts"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 48420, "clicks": 1284, "ctr": 2.651000, "linkClicks": 548, "engagement": 3124, "audience": { "type": "Custom", "location": "Bangkok — Sukhumvit corridor", "age": "24–40", "gender": "All", "interests": ["Food Photography","Rooftop Views","Bangkok Bars"], "customAudiences": [], "behaviors": ["Social Media Foodies","Expat Community"], "excluded": [] } }, { "name": "Valentine''s Special", "impressions": 24420, "clicks": 700, "ctr": 2.866000, "linkClicks": 300, "engagement": 1718, "audience": { "type": "Custom", "location": "Bangkok", "age": "26–40", "gender": "All", "interests": ["Date Night","Rooftop Dining","Valentine''s"], "customAudiences": ["Couples Lookalike"], "behaviors": ["Couples","Anniversary Diners"], "excluded": [] } } ], "ads": [ { "name": "Above Eleven — February Rooftop Reel", "adSet": "Generic", "status": "active", "impressions": 128420, "clicks": 3484, "ctr": 2.713801, "linkClicks": 2428, "engagement": 6842 }, { "name": "Sunset Sessions 🌅 — Every Evening", "adSet": "IG Boosters", "status": "active", "impressions": 48420, "clicks": 1284, "ctr": 2.651000, "linkClicks": 548, "engagement": 3124 }, { "name": "Valentine''s Rooftop Dinner 🌹 — For Two", "adSet": "Valentine''s Special", "status": "active", "impressions": 24420, "clicks": 700, "ctr": 2.866000, "linkClicks": 300, "engagement": 1718 } ], "analysis": { "summary": "Above Eleven Bangkok delivered a strong February anchored by Valentine''s rooftop dining and consistent evening crowd content. The Traffic campaign drove 128K impressions from Bangkok''s dining and nightlife audience. The dedicated Valentine''s landing page converted 12 reservations at a strong cost-per-booking, while Instagram directly drove 6 bookings — a growing social commerce signal.", "recommendations": ["Launch a Songkran rooftop party campaign in March for the April holiday — brief creative team immediately.", "Scale Instagram as a booking channel — 6 direct reservations this period shows strong intent-to-book from social.", "Request new sunset/skyline creative assets for Q2 — current February content will fatigue by end of March."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── APT 101 (featuring Page Seven) ───────────────────────
-- Revenue: ~3.54M THB | ~428K online | 2,284 covers
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 108000.00,
    revenue_data = '{
      "totalBusiness": 3542000.00,
      "totalReservations": 2284,
      "totalOnline": 428000.00,
      "onlineReservations": 184,
      "channels": {
        "Vanity Site":        { "revenue": 228000.00, "reservations": 98 },
        "Booking Widget":     { "revenue": 128000.00, "reservations": 54 },
        "7X Landing Page - APT 101 Valentine''s": { "revenue": 48000.00, "reservations": 18 },
        "Instagram":          { "revenue": 24000.00,  "reservations": 14 }
      },
      "offline": {
        "Walk In":            { "revenue": 1284000.00, "reservations": 1284 },
        "Internal: Shift":    { "revenue": 984000.00,  "reservations": 524 },
        "Door Cover":         { "revenue": 482000.00,  "reservations": 264 },
        "Other - Manual":     { "revenue": 364000.00,  "reservations": 28 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "APT 101 - Traffic", "status": "ACTIVE", "impressions": 142840, "clicks": 3842, "ctr": 2.689601, "linkClicks": 2684, "engagement": 7248 },
        { "name": "APT 101 & Page Seven - Community", "status": "ACTIVE", "impressions": 84280, "clicks": 2284, "ctr": 2.710801, "linkClicks": 976, "engagement": 5624 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 142840, "clicks": 3842, "ctr": 2.689601, "linkClicks": 2684, "engagement": 7248, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "22–40", "gender": "All", "interests": ["Nightclubs", "Cocktail Bars", "Bangkok Nightlife", "Electronic Music"], "customAudiences": ["Website Visitors", "Past Event Attendees"], "behaviors": ["Nightlife Goers", "Music Festival Attendees"], "excluded": [] } },
        { "name": "Page Seven Cocktail Bar", "impressions": 48280, "clicks": 1284, "ctr": 2.659801, "linkClicks": 548, "engagement": 3284, "audience": { "type": "Custom", "location": "Bangkok — Sukhumvit 101", "age": "24–42", "gender": "All", "interests": ["Craft Cocktails", "Speakeasy Bars", "Premium Spirits"], "customAudiences": [], "behaviors": ["Cocktail Enthusiasts", "Bar Hoppers"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 36000, "clicks": 1000, "ctr": 2.777800, "linkClicks": 428, "engagement": 2340, "audience": { "type": "Custom", "location": "Bangkok", "age": "22–38", "gender": "All", "interests": ["Instagram Nightlife", "Party Events", "Bangkok Social Scene"], "customAudiences": [], "behaviors": ["Event Goers", "Weekend Crowd"], "excluded": [] } }
      ],
      "ads": [
        { "name": "APT 101 — February Event Reel", "adSet": "Generic", "status": "active", "impressions": 142840, "clicks": 3842, "ctr": 2.689601, "linkClicks": 2684, "engagement": 7248 },
        { "name": "Page Seven 🍸 — Bangkok''s Hidden Bar", "adSet": "Page Seven Cocktail Bar", "status": "active", "impressions": 48280, "clicks": 1284, "ctr": 2.659801, "linkClicks": 548, "engagement": 3284 },
        { "name": "Valentine''s at APT 101 💜 — Special Event", "adSet": "IG Boosters", "status": "active", "impressions": 36000, "clicks": 1000, "ctr": 2.777800, "linkClicks": 428, "engagement": 2340 }
      ],
      "analysis": {
        "summary": "APT 101 had a strong February with the Valentine''s event driving the highest single-night revenue of the month. Page Seven''s hidden bar concept is gaining strong organic traction — the dedicated ad set delivered a 2.66% CTR above the account benchmark. Door cover revenue of 482K THB confirms the venue''s event-night model is scaling well.",
        "recommendations": [
          "Develop a Songkran special event campaign for APT 101 — this is the highest-revenue opportunity of the Thai calendar.",
          "Expand Page Seven''s ad budget in March — the cocktail bar concept has high organic shareability and low CPC.",
          "Brief creative team on a ''residents & guest DJ'' content series to build anticipation for Q2 event nights."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'APT 101' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'APT 101' LIMIT 1),
  '2026-02-01', '2026-02-24', 108000.00,
  '{ "totalBusiness": 3542000.00, "totalReservations": 2284, "totalOnline": 428000.00, "onlineReservations": 184, "channels": { "Vanity Site": { "revenue": 228000.00, "reservations": 98 }, "Booking Widget": { "revenue": 128000.00, "reservations": 54 }, "7X Landing Page - APT 101 Valentine''s": { "revenue": 48000.00, "reservations": 18 }, "Instagram": { "revenue": 24000.00, "reservations": 14 } }, "offline": { "Walk In": { "revenue": 1284000.00, "reservations": 1284 }, "Internal: Shift": { "revenue": 984000.00, "reservations": 524 }, "Door Cover": { "revenue": 482000.00, "reservations": 264 }, "Other - Manual": { "revenue": 364000.00, "reservations": 28 } } }'::jsonb,
  '{ "campaigns": [ { "name": "APT 101 - Traffic", "status": "ACTIVE", "impressions": 142840, "clicks": 3842, "ctr": 2.689601, "linkClicks": 2684, "engagement": 7248 }, { "name": "APT 101 & Page Seven - Community", "status": "ACTIVE", "impressions": 84280, "clicks": 2284, "ctr": 2.710801, "linkClicks": 976, "engagement": 5624 } ], "adSets": [ { "name": "Generic", "impressions": 142840, "clicks": 3842, "ctr": 2.689601, "linkClicks": 2684, "engagement": 7248, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "22–40", "gender": "All", "interests": ["Nightclubs","Cocktail Bars","Bangkok Nightlife","Electronic Music"], "customAudiences": ["Website Visitors","Past Event Attendees"], "behaviors": ["Nightlife Goers","Music Festival Attendees"], "excluded": [] } }, { "name": "Page Seven Cocktail Bar", "impressions": 48280, "clicks": 1284, "ctr": 2.659801, "linkClicks": 548, "engagement": 3284, "audience": { "type": "Custom", "location": "Bangkok — Sukhumvit 101", "age": "24–42", "gender": "All", "interests": ["Craft Cocktails","Speakeasy Bars","Premium Spirits"], "customAudiences": [], "behaviors": ["Cocktail Enthusiasts","Bar Hoppers"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 36000, "clicks": 1000, "ctr": 2.777800, "linkClicks": 428, "engagement": 2340, "audience": { "type": "Custom", "location": "Bangkok", "age": "22–38", "gender": "All", "interests": ["Instagram Nightlife","Party Events","Bangkok Social Scene"], "customAudiences": [], "behaviors": ["Event Goers","Weekend Crowd"], "excluded": [] } } ], "ads": [ { "name": "APT 101 — February Event Reel", "adSet": "Generic", "status": "active", "impressions": 142840, "clicks": 3842, "ctr": 2.689601, "linkClicks": 2684, "engagement": 7248 }, { "name": "Page Seven 🍸 — Bangkok''s Hidden Bar", "adSet": "Page Seven Cocktail Bar", "status": "active", "impressions": 48280, "clicks": 1284, "ctr": 2.659801, "linkClicks": 548, "engagement": 3284 }, { "name": "Valentine''s at APT 101 💜 — Special Event", "adSet": "IG Boosters", "status": "active", "impressions": 36000, "clicks": 1000, "ctr": 2.777800, "linkClicks": 428, "engagement": 2340 } ], "analysis": { "summary": "APT 101 had a strong February with the Valentine''s event driving the highest single-night revenue of the month. Page Seven''s hidden bar concept is gaining strong organic traction — the dedicated ad set delivered a 2.66% CTR above the account benchmark. Door cover revenue of 482K THB confirms the venue''s event-night model is scaling well.", "recommendations": ["Develop a Songkran special event campaign for APT 101 — this is the highest-revenue opportunity of the Thai calendar.", "Expand Page Seven''s ad budget in March — the cocktail bar concept has high organic shareability and low CPC.", "Brief creative team on a ''residents & guest DJ'' content series to build anticipation for Q2 event nights."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── YANKII ───────────────────────────────────────────────
-- Revenue: ~1.84M THB | ~484K online | 984 reservations
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 62000.00,
    revenue_data = '{
      "totalBusiness": 1842000.00,
      "totalReservations": 984,
      "totalOnline": 484000.00,
      "onlineReservations": 124,
      "channels": {
        "Vanity Site":        { "revenue": 248000.00, "reservations": 64 },
        "Google":             { "revenue": 128000.00, "reservations": 32 },
        "Booking Widget":     { "revenue": 82000.00,  "reservations": 22 },
        "7X Landing Page - YANKII Omakase Night": { "revenue": 26000.00, "reservations": 6 }
      },
      "offline": {
        "Walk In":            { "revenue": 828000.00, "reservations": 524 },
        "Internal: Shift":    { "revenue": 424000.00, "reservations": 284 },
        "Internal: Access Rule": { "revenue": 6000.00, "reservations": 4 },
        "Other - Manual":     { "revenue": 100000.00, "reservations": 48 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "YANKII - Traffic", "status": "ACTIVE", "impressions": 68420, "clicks": 1848, "ctr": 2.700801, "linkClicks": 1284, "engagement": 3612 },
        { "name": "YANKII - Community", "status": "ACTIVE", "impressions": 42840, "clicks": 1124, "ctr": 2.624301, "linkClicks": 480, "engagement": 2812 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 68420, "clicks": 1848, "ctr": 2.700801, "linkClicks": 1284, "engagement": 3612, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "24–45", "gender": "All", "interests": ["Japanese Cuisine", "Omakase", "Sushi", "Bangkok Dining"], "customAudiences": ["Website Visitors"], "behaviors": ["Fine Dining Enthusiasts", "Japanese Food Lovers"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 42840, "clicks": 1124, "ctr": 2.624301, "linkClicks": 480, "engagement": 2812, "audience": { "type": "Custom", "location": "Bangkok — Sathorn, Silom, CBD", "age": "24–42", "gender": "All", "interests": ["Japanese Food", "Food Photography", "Izakaya"], "customAudiences": [], "behaviors": ["Food Influencers", "Expat Diners"], "excluded": [] } }
      ],
      "ads": [
        { "name": "YANKII February Omakase Reel 🍣", "adSet": "Generic", "status": "active", "impressions": 68420, "clicks": 1848, "ctr": 2.700801, "linkClicks": 1284, "engagement": 3612 },
        { "name": "Valentine''s at YANKII — Japanese Romance 🌸", "adSet": "IG Boosters", "status": "active", "impressions": 26840, "clicks": 714, "ctr": 2.660800, "linkClicks": 304, "engagement": 1784 },
        { "name": "Omakase Night — Limited Seats 🎌", "adSet": "IG Boosters", "status": "active", "impressions": 16000, "clicks": 410, "ctr": 2.562500, "linkClicks": 176, "engagement": 1028 }
      ],
      "analysis": {
        "summary": "YANKII delivered a steady February with the Omakase Night limited-seat concept generating the strongest cost-per-click efficiency across the venue portfolio. Valentine''s Japanese dining content resonated strongly with Bangkok''s expat and premium dining audiences. Google reservations at 32 represent a strong organic search intent signal.",
        "recommendations": [
          "Launch a Cherry Blossom season campaign in March — Japanese seasonal content performs exceptionally in Bangkok.",
          "Develop a sake pairing dinner event for Q2 — limited-seat premium experiences generate high ROAS.",
          "Expand Google My Business presence — strong Google reservation numbers indicate untapped organic demand."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'YANKII' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'YANKII' LIMIT 1),
  '2026-02-01', '2026-02-24', 62000.00,
  '{ "totalBusiness": 1842000.00, "totalReservations": 984, "totalOnline": 484000.00, "onlineReservations": 124, "channels": { "Vanity Site": { "revenue": 248000.00, "reservations": 64 }, "Google": { "revenue": 128000.00, "reservations": 32 }, "Booking Widget": { "revenue": 82000.00, "reservations": 22 }, "7X Landing Page - YANKII Omakase Night": { "revenue": 26000.00, "reservations": 6 } }, "offline": { "Walk In": { "revenue": 828000.00, "reservations": 524 }, "Internal: Shift": { "revenue": 424000.00, "reservations": 284 }, "Internal: Access Rule": { "revenue": 6000.00, "reservations": 4 }, "Other - Manual": { "revenue": 100000.00, "reservations": 48 } } }'::jsonb,
  '{ "campaigns": [ { "name": "YANKII - Traffic", "status": "ACTIVE", "impressions": 68420, "clicks": 1848, "ctr": 2.700801, "linkClicks": 1284, "engagement": 3612 }, { "name": "YANKII - Community", "status": "ACTIVE", "impressions": 42840, "clicks": 1124, "ctr": 2.624301, "linkClicks": 480, "engagement": 2812 } ], "adSets": [ { "name": "Generic", "impressions": 68420, "clicks": 1848, "ctr": 2.700801, "linkClicks": 1284, "engagement": 3612, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "24–45", "gender": "All", "interests": ["Japanese Cuisine","Omakase","Sushi","Bangkok Dining"], "customAudiences": ["Website Visitors"], "behaviors": ["Fine Dining Enthusiasts","Japanese Food Lovers"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 42840, "clicks": 1124, "ctr": 2.624301, "linkClicks": 480, "engagement": 2812, "audience": { "type": "Custom", "location": "Bangkok — Sathorn, Silom, CBD", "age": "24–42", "gender": "All", "interests": ["Japanese Food","Food Photography","Izakaya"], "customAudiences": [], "behaviors": ["Food Influencers","Expat Diners"], "excluded": [] } } ], "ads": [ { "name": "YANKII February Omakase Reel 🍣", "adSet": "Generic", "status": "active", "impressions": 68420, "clicks": 1848, "ctr": 2.700801, "linkClicks": 1284, "engagement": 3612 }, { "name": "Valentine''s at YANKII — Japanese Romance 🌸", "adSet": "IG Boosters", "status": "active", "impressions": 26840, "clicks": 714, "ctr": 2.660800, "linkClicks": 304, "engagement": 1784 }, { "name": "Omakase Night — Limited Seats 🎌", "adSet": "IG Boosters", "status": "active", "impressions": 16000, "clicks": 410, "ctr": 2.562500, "linkClicks": 176, "engagement": 1028 } ], "analysis": { "summary": "YANKII delivered a steady February with the Omakase Night limited-seat concept generating the strongest cost-per-click efficiency across the venue portfolio. Valentine''s Japanese dining content resonated strongly with Bangkok''s expat and premium dining audiences. Google reservations at 32 represent a strong organic search intent signal.", "recommendations": ["Launch a Cherry Blossom season campaign in March — Japanese seasonal content performs exceptionally in Bangkok.", "Develop a sake pairing dinner event for Q2 — limited-seat premium experiences generate high ROAS.", "Expand Google My Business presence — strong Google reservation numbers indicate untapped organic demand."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── CHARCOAL TANDOOR FIRE GRILL ──────────────────────────
-- Revenue: ~1.42M THB | ~284K online | 824 reservations
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 52000.00,
    revenue_data = '{
      "totalBusiness": 1424000.00,
      "totalReservations": 824,
      "totalOnline": 284000.00,
      "onlineReservations": 84,
      "channels": {
        "Vanity Site":        { "revenue": 148000.00, "reservations": 44 },
        "Google":             { "revenue": 84000.00,  "reservations": 24 },
        "Booking Widget":     { "revenue": 42000.00,  "reservations": 12 },
        "7X Landing Page - Charcoal Valentine''s Grill": { "revenue": 10000.00, "reservations": 4 }
      },
      "offline": {
        "Walk In":            { "revenue": 692000.00, "reservations": 448 },
        "Internal: Shift":    { "revenue": 328000.00, "reservations": 228 },
        "Internal: Access Rule": { "revenue": 4000.00, "reservations": 4 },
        "Other - Manual":     { "revenue": 116000.00, "reservations": 60 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "Charcoal - Traffic", "status": "ACTIVE", "impressions": 62480, "clicks": 1684, "ctr": 2.695601, "linkClicks": 1172, "engagement": 3248 },
        { "name": "Charcoal - Community", "status": "ACTIVE", "impressions": 38420, "clicks": 1024, "ctr": 2.664200, "linkClicks": 436, "engagement": 2148 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 62480, "clicks": 1684, "ctr": 2.695601, "linkClicks": 1172, "engagement": 3248, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "25–50", "gender": "All", "interests": ["Indian Cuisine", "Tandoor Grill", "Curry", "South Asian Food"], "customAudiences": ["Website Visitors"], "behaviors": ["Frequent Diners", "Indian Food Enthusiasts"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 38420, "clicks": 1024, "ctr": 2.664200, "linkClicks": 436, "engagement": 2148, "audience": { "type": "Custom", "location": "Bangkok", "age": "22–48", "gender": "All", "interests": ["Grilled Food", "Fire Grill", "Food Photography"], "customAudiences": [], "behaviors": ["Food Lovers", "Expat South Asian Community"], "excluded": [] } }
      ],
      "ads": [
        { "name": "Charcoal Tandoor — Grill Fire Reel 🔥", "adSet": "Generic", "status": "active", "impressions": 62480, "clicks": 1684, "ctr": 2.695601, "linkClicks": 1172, "engagement": 3248 },
        { "name": "Valentine''s Grill Night 🌹 — Charcoal", "adSet": "IG Boosters", "status": "active", "impressions": 22420, "clicks": 604, "ctr": 2.694899, "linkClicks": 258, "engagement": 1284 },
        { "name": "Signature Tandoor Platter — Book Now", "adSet": "IG Boosters", "status": "active", "impressions": 16000, "clicks": 420, "ctr": 2.625000, "linkClicks": 178, "engagement": 864 }
      ],
      "analysis": {
        "summary": "Charcoal Tandoor delivered consistent performance in February with fire grill visual content outperforming text-heavy creative across all placements. The venue''s authentic tandoor concept resonates strongly with Bangkok''s South Asian expat community and local grill enthusiasts. The Valentine''s Grill Night boosted post drove 4 landing page bookings — the highest landing page conversion rate in the Soho portfolio this period.",
        "recommendations": [
          "Produce a signature tandoor process video — behind-the-scenes fire grill content outperforms static for this concept.",
          "Launch a Holi festival special event campaign in March targeting the South Asian expat community.",
          "Brief creative team on a new chef''s grill experience content series for Q2."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Charcoal Tandoor' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Charcoal Tandoor' LIMIT 1),
  '2026-02-01', '2026-02-24', 52000.00,
  '{ "totalBusiness": 1424000.00, "totalReservations": 824, "totalOnline": 284000.00, "onlineReservations": 84, "channels": { "Vanity Site": { "revenue": 148000.00, "reservations": 44 }, "Google": { "revenue": 84000.00, "reservations": 24 }, "Booking Widget": { "revenue": 42000.00, "reservations": 12 }, "7X Landing Page - Charcoal Valentine''s Grill": { "revenue": 10000.00, "reservations": 4 } }, "offline": { "Walk In": { "revenue": 692000.00, "reservations": 448 }, "Internal: Shift": { "revenue": 328000.00, "reservations": 228 }, "Internal: Access Rule": { "revenue": 4000.00, "reservations": 4 }, "Other - Manual": { "revenue": 116000.00, "reservations": 60 } } }'::jsonb,
  '{ "campaigns": [ { "name": "Charcoal - Traffic", "status": "ACTIVE", "impressions": 62480, "clicks": 1684, "ctr": 2.695601, "linkClicks": 1172, "engagement": 3248 }, { "name": "Charcoal - Community", "status": "ACTIVE", "impressions": 38420, "clicks": 1024, "ctr": 2.664200, "linkClicks": 436, "engagement": 2148 } ], "adSets": [ { "name": "Generic", "impressions": 62480, "clicks": 1684, "ctr": 2.695601, "linkClicks": 1172, "engagement": 3248, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "25–50", "gender": "All", "interests": ["Indian Cuisine","Tandoor Grill","Curry","South Asian Food"], "customAudiences": ["Website Visitors"], "behaviors": ["Frequent Diners","Indian Food Enthusiasts"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 38420, "clicks": 1024, "ctr": 2.664200, "linkClicks": 436, "engagement": 2148, "audience": { "type": "Custom", "location": "Bangkok", "age": "22–48", "gender": "All", "interests": ["Grilled Food","Fire Grill","Food Photography"], "customAudiences": [], "behaviors": ["Food Lovers","Expat South Asian Community"], "excluded": [] } } ], "ads": [ { "name": "Charcoal Tandoor — Grill Fire Reel 🔥", "adSet": "Generic", "status": "active", "impressions": 62480, "clicks": 1684, "ctr": 2.695601, "linkClicks": 1172, "engagement": 3248 }, { "name": "Valentine''s Grill Night 🌹 — Charcoal", "adSet": "IG Boosters", "status": "active", "impressions": 22420, "clicks": 604, "ctr": 2.694899, "linkClicks": 258, "engagement": 1284 }, { "name": "Signature Tandoor Platter — Book Now", "adSet": "IG Boosters", "status": "active", "impressions": 16000, "clicks": 420, "ctr": 2.625000, "linkClicks": 178, "engagement": 864 } ], "analysis": { "summary": "Charcoal Tandoor delivered consistent performance in February with fire grill visual content outperforming text-heavy creative across all placements. The venue''s authentic tandoor concept resonates strongly with Bangkok''s South Asian expat community and local grill enthusiasts. The Valentine''s Grill Night boosted post drove 4 landing page bookings — the highest landing page conversion rate in the Soho portfolio this period.", "recommendations": ["Produce a signature tandoor process video — behind-the-scenes fire grill content outperforms static for this concept.", "Launch a Holi festival special event campaign in March targeting the South Asian expat community.", "Brief creative team on a new chef''s grill experience content series for Q2."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── CANTINA ──────────────────────────────────────────────
-- Revenue: ~1.18M THB | ~198K online | 642 reservations
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 42000.00,
    revenue_data = '{
      "totalBusiness": 1184000.00,
      "totalReservations": 642,
      "totalOnline": 198000.00,
      "onlineReservations": 64,
      "channels": {
        "Vanity Site":        { "revenue": 108000.00, "reservations": 34 },
        "Google":             { "revenue": 52000.00,  "reservations": 16 },
        "Booking Widget":     { "revenue": 28000.00,  "reservations": 10 },
        "Instagram":          { "revenue": 10000.00,  "reservations": 4 }
      },
      "offline": {
        "Walk In":            { "revenue": 584000.00, "reservations": 348 },
        "Internal: Shift":    { "revenue": 284000.00, "reservations": 184 },
        "Internal: Access Rule": { "revenue": 2000.00, "reservations": 2 },
        "Other - Manual":     { "revenue": 116000.00, "reservations": 44 }
      }
    }'::jsonb,
    meta_data = '{
      "campaigns": [
        { "name": "Cantina - Traffic", "status": "ACTIVE", "impressions": 48420, "clicks": 1284, "ctr": 2.651600, "linkClicks": 896, "engagement": 2512 },
        { "name": "Cantina - Community", "status": "ACTIVE", "impressions": 28840, "clicks": 768, "ctr": 2.663000, "linkClicks": 328, "engagement": 1712 }
      ],
      "adSets": [
        { "name": "Generic", "impressions": 48420, "clicks": 1284, "ctr": 2.651600, "linkClicks": 896, "engagement": 2512, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "22–45", "gender": "All", "interests": ["Mexican Food", "Tacos", "Margaritas", "Latin Cuisine"], "customAudiences": ["Website Visitors"], "behaviors": ["Casual Diners", "Cocktail Lovers"], "excluded": [] } },
        { "name": "IG Boosters", "impressions": 28840, "clicks": 768, "ctr": 2.663000, "linkClicks": 328, "engagement": 1712, "audience": { "type": "Custom", "location": "Bangkok", "age": "21–38", "gender": "All", "interests": ["Taco Tuesday", "Margarita Lovers", "Bangkok Casual Dining"], "customAudiences": [], "behaviors": ["Young Professionals", "Expat Social Scene"], "excluded": [] } }
      ],
      "ads": [
        { "name": "Cantina — Taco & Margarita Reel 🌮", "adSet": "Generic", "status": "active", "impressions": 48420, "clicks": 1284, "ctr": 2.651600, "linkClicks": 896, "engagement": 2512 },
        { "name": "Valentine''s Latin Night 💃 — Cantina", "adSet": "IG Boosters", "status": "active", "impressions": 17840, "clicks": 480, "ctr": 2.691200, "linkClicks": 204, "engagement": 1068 },
        { "name": "Taco Tuesday — Every Week 🌮🍹", "adSet": "IG Boosters", "status": "active", "impressions": 11000, "clicks": 288, "ctr": 2.618200, "linkClicks": 124, "engagement": 644 }
      ],
      "analysis": {
        "summary": "Cantina delivered strong community engagement in February with recurring Taco Tuesday content building a consistent weekly audience. Valentine''s Latin Night generated solid walk-in traffic and the venue''s casual, vibrant energy appeals strongly to Bangkok''s young professional and expat crowd. Instagram bookings at 4 reservations confirm growing social-to-table conversion.",
        "recommendations": [
          "Lock in a Cinco de Mayo campaign for early May — start briefing creative in mid-March for maximum lead time.",
          "Scale Taco Tuesday content as an always-on booster — it is generating the lowest CPC in the Cantina ad account.",
          "Develop a margarita menu campaign featuring signature cocktails — beverage content drives strong saves and shares."
        ]
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Cantina' LIMIT 1)
    AND week_start = '2026-02-01' AND week_end = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data, meta_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Cantina' LIMIT 1),
  '2026-02-01', '2026-02-24', 42000.00,
  '{ "totalBusiness": 1184000.00, "totalReservations": 642, "totalOnline": 198000.00, "onlineReservations": 64, "channels": { "Vanity Site": { "revenue": 108000.00, "reservations": 34 }, "Google": { "revenue": 52000.00, "reservations": 16 }, "Booking Widget": { "revenue": 28000.00, "reservations": 10 }, "Instagram": { "revenue": 10000.00, "reservations": 4 } }, "offline": { "Walk In": { "revenue": 584000.00, "reservations": 348 }, "Internal: Shift": { "revenue": 284000.00, "reservations": 184 }, "Internal: Access Rule": { "revenue": 2000.00, "reservations": 2 }, "Other - Manual": { "revenue": 116000.00, "reservations": 44 } } }'::jsonb,
  '{ "campaigns": [ { "name": "Cantina - Traffic", "status": "ACTIVE", "impressions": 48420, "clicks": 1284, "ctr": 2.651600, "linkClicks": 896, "engagement": 2512 }, { "name": "Cantina - Community", "status": "ACTIVE", "impressions": 28840, "clicks": 768, "ctr": 2.663000, "linkClicks": 328, "engagement": 1712 } ], "adSets": [ { "name": "Generic", "impressions": 48420, "clicks": 1284, "ctr": 2.651600, "linkClicks": 896, "engagement": 2512, "audience": { "type": "Advantage+", "location": "Bangkok, Thailand", "age": "22–45", "gender": "All", "interests": ["Mexican Food","Tacos","Margaritas","Latin Cuisine"], "customAudiences": ["Website Visitors"], "behaviors": ["Casual Diners","Cocktail Lovers"], "excluded": [] } }, { "name": "IG Boosters", "impressions": 28840, "clicks": 768, "ctr": 2.663000, "linkClicks": 328, "engagement": 1712, "audience": { "type": "Custom", "location": "Bangkok", "age": "21–38", "gender": "All", "interests": ["Taco Tuesday","Margarita Lovers","Bangkok Casual Dining"], "customAudiences": [], "behaviors": ["Young Professionals","Expat Social Scene"], "excluded": [] } } ], "ads": [ { "name": "Cantina — Taco & Margarita Reel 🌮", "adSet": "Generic", "status": "active", "impressions": 48420, "clicks": 1284, "ctr": 2.651600, "linkClicks": 896, "engagement": 2512 }, { "name": "Valentine''s Latin Night 💃 — Cantina", "adSet": "IG Boosters", "status": "active", "impressions": 17840, "clicks": 480, "ctr": 2.691200, "linkClicks": 204, "engagement": 1068 }, { "name": "Taco Tuesday — Every Week 🌮🍹", "adSet": "IG Boosters", "status": "active", "impressions": 11000, "clicks": 288, "ctr": 2.618200, "linkClicks": 124, "engagement": 644 } ], "analysis": { "summary": "Cantina delivered strong community engagement in February with recurring Taco Tuesday content building a consistent weekly audience. Valentine''s Latin Night generated solid walk-in traffic and the venue''s casual, vibrant energy appeals strongly to Bangkok''s young professional and expat crowd. Instagram bookings at 4 reservations confirm growing social-to-table conversion.", "recommendations": ["Lock in a Cinco de Mayo campaign for early May — start briefing creative in mid-March for maximum lead time.", "Scale Taco Tuesday content as an always-on booster — it is generating the lowest CPC in the Cantina ad account.", "Develop a margarita menu campaign featuring signature cocktails — beverage content drives strong saves and shares."] } }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);
