-- ============================================================
-- MPJ 7rooms Revenue Data — Feb 1–24, 2026
-- Venues: Smoki Moto · Cucina · Above Eleven
-- Data snapshot: Feb 1–22 (report period closes Feb 24)
-- ============================================================
-- Safe UPSERT pattern: UPDATE if row exists (preserves meta_data),
-- INSERT only if no row found for this venue + week.
-- The `roas` column does NOT exist on weekly_reports — ROAS is
-- calculated at read time as revenue_data.totalOnline / ad_spend.
-- ============================================================


-- ── SMOKI MOTO ──────────────────────────────────────────────
-- Total: 1,357,933.45 AED | Online: 471,555.20 AED | ROAS: 92.24x
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 5112.40,
    revenue_data = '{
      "totalBusiness": 1357933.45,
      "totalReservations": 922,
      "totalOnline": 471555.2,
      "onlineReservations": 270,
      "channels": {
        "Vanity Site":                              { "revenue": 325203.1,  "reservations": 173 },
        "Google":                                   { "revenue": 109166.5,  "reservations": 70  },
        "Booking Widget":                           { "revenue": 25342.6,   "reservations": 19  },
        "7X Landing Page - Valentine''s Day at Smoki Moto": { "revenue": 7783.0, "reservations": 4 },
        "Marriott GDP":                             { "revenue": 2350.0,    "reservations": 1   },
        "Ambl":                                     { "revenue": 1095.0,    "reservations": 1   },
        "Marriott.com":                             { "revenue": 615.0,     "reservations": 2   }
      },
      "offline": {
        "Walk In":                  { "revenue": 331961.45, "reservations": 335 },
        "Internal: Shift":          { "revenue": 485966.8,  "reservations": 300 },
        "Internal: Access Rule":    { "revenue": 9155.0,    "reservations": 1   },
        "Other - Manual":           { "revenue": 59295.0,   "reservations": 16  }
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Smoki Moto' LIMIT 1)
    AND week_start = '2026-02-01'
    AND week_end   = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Smoki Moto' LIMIT 1),
  '2026-02-01',
  '2026-02-24',
  5112.40,
  '{
    "totalBusiness": 1357933.45,
    "totalReservations": 922,
    "totalOnline": 471555.2,
    "onlineReservations": 270,
    "channels": {
      "Vanity Site":                              { "revenue": 325203.1,  "reservations": 173 },
      "Google":                                   { "revenue": 109166.5,  "reservations": 70  },
      "Booking Widget":                           { "revenue": 25342.6,   "reservations": 19  },
      "7X Landing Page - Valentine''s Day at Smoki Moto": { "revenue": 7783.0, "reservations": 4 },
      "Marriott GDP":                             { "revenue": 2350.0,    "reservations": 1   },
      "Ambl":                                     { "revenue": 1095.0,    "reservations": 1   },
      "Marriott.com":                             { "revenue": 615.0,     "reservations": 2   }
    },
    "offline": {
      "Walk In":                  { "revenue": 331961.45, "reservations": 335 },
      "Internal: Shift":          { "revenue": 485966.8,  "reservations": 300 },
      "Internal: Access Rule":    { "revenue": 9155.0,    "reservations": 1   },
      "Other - Manual":           { "revenue": 59295.0,   "reservations": 16  }
    }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── CUCINA ───────────────────────────────────────────────────
-- Total: 666,980.94 AED | Online: 136,505.10 AED | ROAS: 35.33x
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 3864.25,
    revenue_data = '{
      "totalBusiness": 666980.94,
      "totalReservations": 1565,
      "totalOnline": 136505.1,
      "onlineReservations": 182,
      "channels": {
        "Vanity Site":                              { "revenue": 82472.3,   "reservations": 110 },
        "Google":                                   { "revenue": 20885.1,   "reservations": 28  },
        "More Cravings":                            { "revenue": 11705.4,   "reservations": 14  },
        "Booking Widget":                           { "revenue": 10383.2,   "reservations": 13  },
        "Instagram":                                { "revenue": 4671.1,    "reservations": 9   },
        "7X Landing Page - Jazz & Love Edition":    { "revenue": 2580.0,    "reservations": 4   },
        "7X Landing Page - Jazz & Juice Nights at Cucina": { "revenue": 0.0, "reservations": 0 },
        "TheFork":                                  { "revenue": 1887.0,    "reservations": 1   },
        "Marriott GDP":                             { "revenue": 1638.0,    "reservations": 1   },
        "Trip Advisor Integration":                 { "revenue": 283.0,     "reservations": 1   },
        "Marriott.com":                             { "revenue": 0.0,       "reservations": 1   }
      },
      "offline": {
        "Walk In":                  { "revenue": 332712.54, "reservations": 1109 },
        "Internal: Shift":          { "revenue": 183183.3,  "reservations": 268  },
        "Internal: Access Rule":    { "revenue": 1094.0,    "reservations": 3    },
        "Other - Manual":           { "revenue": 13486.0,   "reservations": 3    }
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
    AND week_start = '2026-02-01'
    AND week_end   = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1),
  '2026-02-01',
  '2026-02-24',
  3864.25,
  '{
    "totalBusiness": 666980.94,
    "totalReservations": 1565,
    "totalOnline": 136505.1,
    "onlineReservations": 182,
    "channels": {
      "Vanity Site":                              { "revenue": 82472.3,   "reservations": 110 },
      "Google":                                   { "revenue": 20885.1,   "reservations": 28  },
      "More Cravings":                            { "revenue": 11705.4,   "reservations": 14  },
      "Booking Widget":                           { "revenue": 10383.2,   "reservations": 13  },
      "Instagram":                                { "revenue": 4671.1,    "reservations": 9   },
      "7X Landing Page - Jazz & Love Edition":    { "revenue": 2580.0,    "reservations": 4   },
      "7X Landing Page - Jazz & Juice Nights at Cucina": { "revenue": 0.0, "reservations": 0 },
      "TheFork":                                  { "revenue": 1887.0,    "reservations": 1   },
      "Marriott GDP":                             { "revenue": 1638.0,    "reservations": 1   },
      "Trip Advisor Integration":                 { "revenue": 283.0,     "reservations": 1   },
      "Marriott.com":                             { "revenue": 0.0,       "reservations": 1   }
    },
    "offline": {
      "Walk In":                  { "revenue": 332712.54, "reservations": 1109 },
      "Internal: Shift":          { "revenue": 183183.3,  "reservations": 268  },
      "Internal: Access Rule":    { "revenue": 1094.0,    "reservations": 3    },
      "Other - Manual":           { "revenue": 13486.0,   "reservations": 3    }
    }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── ABOVE ELEVEN ────────────────────────────────────────────
-- Total: 1,277,484.16 AED | Online: 184,625.42 AED | ROAS: 33.65x
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 5486.75,
    revenue_data = '{
      "totalBusiness": 1277484.16,
      "totalReservations": 1237,
      "totalOnline": 184625.42,
      "onlineReservations": 174,
      "channels": {
        "Booking Widget":                                    { "revenue": 174213.42, "reservations": 165 },
        "7X Landing Page - Yunza-11 Brunch Valentine''s":   { "revenue": 3084.99,   "reservations": 1   },
        "7X Landing Page - Valentine''s Dinner":            { "revenue": 2529.0,    "reservations": 2   },
        "7X Landing Page - Yunza Brunch":                   { "revenue": 2425.01,   "reservations": 3   },
        "7X Landing Page - Pisco''d After Party":           { "revenue": 1194.0,    "reservations": 2   },
        "7X Landing Page - Ritmo Arriba":                   { "revenue": 1179.0,    "reservations": 1   },
        "Trip Advisor Integration":                         { "revenue": 0.0,       "reservations": 0   },
        "Marriott.com":                                     { "revenue": 0.0,       "reservations": 0   }
      },
      "offline": {
        "Walk In":                  { "revenue": 464762.2,  "reservations": 840 },
        "Internal: Shift":          { "revenue": 628096.55, "reservations": 223 },
        "Internal: Access Rule":    { "revenue": 0.0,       "reservations": 0   }
      }
    }'::jsonb
  WHERE venue_id = (SELECT id FROM venues WHERE name = 'Above Eleven' LIMIT 1)
    AND week_start = '2026-02-01'
    AND week_end   = '2026-02-24'
  RETURNING id
)
INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, revenue_data)
SELECT
  (SELECT id FROM venues WHERE name = 'Above Eleven' LIMIT 1),
  '2026-02-01',
  '2026-02-24',
  5486.75,
  '{
    "totalBusiness": 1277484.16,
    "totalReservations": 1237,
    "totalOnline": 184625.42,
    "onlineReservations": 174,
    "channels": {
      "Booking Widget":                                    { "revenue": 174213.42, "reservations": 165 },
      "7X Landing Page - Yunza-11 Brunch Valentine''s":   { "revenue": 3084.99,   "reservations": 1   },
      "7X Landing Page - Valentine''s Dinner":            { "revenue": 2529.0,    "reservations": 2   },
      "7X Landing Page - Yunza Brunch":                   { "revenue": 2425.01,   "reservations": 3   },
      "7X Landing Page - Pisco''d After Party":           { "revenue": 1194.0,    "reservations": 2   },
      "7X Landing Page - Ritmo Arriba":                   { "revenue": 1179.0,    "reservations": 1   },
      "Trip Advisor Integration":                         { "revenue": 0.0,       "reservations": 0   },
      "Marriott.com":                                     { "revenue": 0.0,       "reservations": 0   }
    },
    "offline": {
      "Walk In":                  { "revenue": 464762.2,  "reservations": 840 },
      "Internal: Shift":          { "revenue": 628096.55, "reservations": 223 },
      "Internal: Access Rule":    { "revenue": 0.0,       "reservations": 0   }
    }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);
