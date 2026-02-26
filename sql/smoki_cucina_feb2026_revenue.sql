-- ============================================================
-- MPJ 7Rooms Revenue Data — Feb 1–24, 2026
-- Venues: Smoki Moto · Cucina
-- Data snapshot : Feb 1–22, 2026
-- Source        : Booked By report (Looker), generated Feb 23 2026
-- ============================================================


-- ── SMOKI MOTO ──────────────────────────────────────────────
-- Total: 1,357,933.45 AED | Online: 471,555.20 AED | ROAS: ~92.24x
-- totalOnline = Vanity Site (online) + Google + Booking Widget +
--               7X Landing Page + Marriott GDP + Ambl + Marriott.com
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 5112.40,
    revenue_data = '{
      "totalBusiness":      1357933.45,
      "totalReservations":  922,
      "totalOnline":        471555.20,
      "onlineReservations": 270,
      "channels": {
        "Vanity Site": {
          "revenue": 325203.10,
          "reservations": 173
        },
        "Google": {
          "revenue": 109166.50,
          "reservations": 70
        },
        "Booking Widget": {
          "revenue": 25342.60,
          "reservations": 19,
          "covers": 52
        },
        "7X Landing Page - Valentine''s Day at Smoki Moto": {
          "revenue": 7783.00,
          "reservations": 4,
          "covers": 8
        },
        "Marriott GDP": {
          "revenue": 2350.00,
          "reservations": 1,
          "covers": 3
        },
        "Ambl": {
          "revenue": 1095.00,
          "reservations": 1,
          "covers": 2
        },
        "Marriott.com": {
          "revenue": 615.00,
          "reservations": 2,
          "covers": 4
        }
      },
      "offline": {
        "Walk In": {
          "revenue": 331961.45,
          "reservations": 335,
          "covers": 812
        },
        "Internal: Shift": {
          "revenue": 485966.80,
          "reservations": 300,
          "breakdown": {
            "Alisha Shrestha":          { "revenue":  85540.60, "reservations": 54, "covers": 199 },
            "Rindyani Fadila":          { "revenue":  83549.55, "reservations": 48, "covers": 191, "prepayment": 13000.00 },
            "Mayra Onate":              { "revenue":  66716.25, "reservations": 43, "covers": 152 },
            "Riskha Herlyana":          { "revenue":  48210.00, "reservations": 28, "covers": 111 },
            "Gabby Stevanny":           { "revenue":  42880.50, "reservations": 27, "covers":  89 },
            "Valeria Martin Cardenas":  { "revenue":  38095.00, "reservations": 21, "covers":  65 },
            "SungWook Hong":            { "revenue":  37839.50, "reservations": 19, "covers":  71 },
            "Consuelo Isabelle Dumlao": { "revenue":  36014.50, "reservations": 32, "covers":  98 },
            "Anastasiia Bakshanskaia":  { "revenue":  20772.90, "reservations": 10, "covers":  48 },
            "Gavin Fernandes":          { "revenue":   8486.00, "reservations":  4, "covers":  16 },
            "Faith":                    { "revenue":   4500.00, "reservations":  3, "covers":   7 },
            "Minto Dominic":            { "revenue":   4135.00, "reservations":  2, "covers":   5 },
            "Vivian Nabunnya":          { "revenue":   2990.00, "reservations":  4, "covers":  12 },
            "Sean Hong":                { "revenue":   2072.00, "reservations":  1, "covers":   5 },
            "Valeria Martin":           { "revenue":   2050.00, "reservations":  1, "covers":   5 },
            "Myint Myat Moe Oo":        { "revenue":   1405.00, "reservations":  2, "covers":   4 },
            "Garishma Singh":           { "revenue":    710.00, "reservations":  1, "covers":   2 }
          }
        },
        "Internal: Access Rule": {
          "revenue": 9155.00,
          "reservations": 1,
          "breakdown": {
            "Mayra Onate": { "revenue": 9155.00, "reservations": 1 }
          }
        },
        "Other - Manual": {
          "revenue": 59295.00,
          "reservations": 16,
          "breakdown": {
            "Vanity Site": { "revenue": 39989.00, "reservations": 7 },
            "Google":      { "revenue": 19306.00, "reservations": 9 }
          }
        }
      }
    }'::jsonb
  WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Smoki Moto' LIMIT 1)
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
    "totalBusiness":      1357933.45,
    "totalReservations":  922,
    "totalOnline":        471555.20,
    "onlineReservations": 270,
    "channels": {
      "Vanity Site": {
        "revenue": 325203.10,
        "reservations": 173
      },
      "Google": {
        "revenue": 109166.50,
        "reservations": 70
      },
      "Booking Widget": {
        "revenue": 25342.60,
        "reservations": 19,
        "covers": 52
      },
      "7X Landing Page - Valentine''s Day at Smoki Moto": {
        "revenue": 7783.00,
        "reservations": 4,
        "covers": 8
      },
      "Marriott GDP": {
        "revenue": 2350.00,
        "reservations": 1,
        "covers": 3
      },
      "Ambl": {
        "revenue": 1095.00,
        "reservations": 1,
        "covers": 2
      },
      "Marriott.com": {
        "revenue": 615.00,
        "reservations": 2,
        "covers": 4
      }
    },
    "offline": {
      "Walk In": {
        "revenue": 331961.45,
        "reservations": 335,
        "covers": 812
      },
      "Internal: Shift": {
        "revenue": 485966.80,
        "reservations": 300,
        "breakdown": {
          "Alisha Shrestha":          { "revenue":  85540.60, "reservations": 54, "covers": 199 },
          "Rindyani Fadila":          { "revenue":  83549.55, "reservations": 48, "covers": 191, "prepayment": 13000.00 },
          "Mayra Onate":              { "revenue":  66716.25, "reservations": 43, "covers": 152 },
          "Riskha Herlyana":          { "revenue":  48210.00, "reservations": 28, "covers": 111 },
          "Gabby Stevanny":           { "revenue":  42880.50, "reservations": 27, "covers":  89 },
          "Valeria Martin Cardenas":  { "revenue":  38095.00, "reservations": 21, "covers":  65 },
          "SungWook Hong":            { "revenue":  37839.50, "reservations": 19, "covers":  71 },
          "Consuelo Isabelle Dumlao": { "revenue":  36014.50, "reservations": 32, "covers":  98 },
          "Anastasiia Bakshanskaia":  { "revenue":  20772.90, "reservations": 10, "covers":  48 },
          "Gavin Fernandes":          { "revenue":   8486.00, "reservations":  4, "covers":  16 },
          "Faith":                    { "revenue":   4500.00, "reservations":  3, "covers":   7 },
          "Minto Dominic":            { "revenue":   4135.00, "reservations":  2, "covers":   5 },
          "Vivian Nabunnya":          { "revenue":   2990.00, "reservations":  4, "covers":  12 },
          "Sean Hong":                { "revenue":   2072.00, "reservations":  1, "covers":   5 },
          "Valeria Martin":           { "revenue":   2050.00, "reservations":  1, "covers":   5 },
          "Myint Myat Moe Oo":        { "revenue":   1405.00, "reservations":  2, "covers":   4 },
          "Garishma Singh":           { "revenue":    710.00, "reservations":  1, "covers":   2 }
        }
      },
      "Internal: Access Rule": {
        "revenue": 9155.00,
        "reservations": 1,
        "breakdown": {
          "Mayra Onate": { "revenue": 9155.00, "reservations": 1 }
        }
      },
      "Other - Manual": {
        "revenue": 59295.00,
        "reservations": 16,
        "breakdown": {
          "Vanity Site": { "revenue": 39989.00, "reservations": 7 },
          "Google":      { "revenue": 19306.00, "reservations": 9 }
        }
      }
    }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);


-- ── CUCINA ───────────────────────────────────────────────────
-- Total: 666,980.94 AED | Online: 136,505.10 AED | ROAS: ~35.33x
-- totalOnline = Vanity Site (online) + Google + More Cravings +
--               Booking Widget + Instagram + 7X Landing Pages +
--               TheFork + Marriott GDP + Trip Advisor + Marriott.com
WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 3864.25,
    revenue_data = '{
      "totalBusiness":      666980.94,
      "totalReservations":  1565,
      "totalOnline":        136505.10,
      "onlineReservations": 182,
      "channels": {
        "Vanity Site": {
          "revenue": 82472.30,
          "reservations": 110
        },
        "Google": {
          "revenue": 20885.10,
          "reservations": 28
        },
        "More Cravings": {
          "revenue": 11705.40,
          "reservations": 14
        },
        "Booking Widget": {
          "revenue": 10383.20,
          "reservations": 13,
          "covers": 49,
          "prepayment": 500.00
        },
        "Instagram": {
          "revenue": 4671.10,
          "reservations": 9,
          "covers": 26
        },
        "7X Landing Page - Jazz & Love Edition": {
          "revenue": 2580.00,
          "reservations": 4,
          "covers": 8
        },
        "TheFork Integration": {
          "revenue": 1887.00,
          "reservations": 1,
          "covers": 8
        },
        "Marriott GDP": {
          "revenue": 1638.00,
          "reservations": 1,
          "covers": 6
        },
        "Trip Advisor Integration": {
          "revenue": 283.00,
          "reservations": 1,
          "covers": 2
        },
        "7X Landing Page - Jazz & Juice Nights at Cucina": {
          "revenue": 0.00,
          "reservations": 0
        },
        "Marriott.com": {
          "revenue": 0.00,
          "reservations": 1,
          "covers": 2
        }
      },
      "offline": {
        "Walk In": {
          "revenue": 332712.54,
          "reservations": 1109,
          "covers": 2998
        },
        "Internal: Shift": {
          "revenue": 183183.30,
          "reservations": 268,
          "breakdown": {
            "Alisha Shrestha":          { "revenue": 41933.00, "reservations": 31, "covers": 231, "prepayment": 20000.00 },
            "Sumitra Shrestha":         { "revenue": 32738.10, "reservations": 65, "covers": 212 },
            "Sisca Karuniawati":        { "revenue": 28459.40, "reservations": 34, "covers": 174 },
            "Consuelo Isabelle Dumlao": { "revenue": 23642.60, "reservations": 31, "covers": 173 },
            "Numaphung Chemjong":       { "revenue": 14358.00, "reservations": 23, "covers":  98 },
            "Nor syaza Ismail":         { "revenue": 14140.30, "reservations": 16, "covers":  92 },
            "Gabby Stevanny":           { "revenue": 13624.90, "reservations": 31, "covers": 192 },
            "Rindyani Fadila":          { "revenue":  8909.20, "reservations": 30, "covers": 122, "prepayment": 1440.00 },
            "Nishita Hutchamah":        { "revenue":  3196.80, "reservations":  5, "covers":  27 },
            "Emanuele Rizzo":           { "revenue":  1447.00, "reservations":  1, "covers":   7 },
            "Ruth Numaphung Chemjong":  { "revenue":   696.00, "reservations":  1, "covers":   4 },
            "Adnan Afreen":             { "revenue":    38.00, "reservations":  0 }
          }
        },
        "Internal: Access Rule": {
          "revenue": 1094.00,
          "reservations": 3,
          "breakdown": {
            "Sumitra Shrestha":         { "revenue": 554.00, "reservations": 1 },
            "Consuelo Isabelle Dumlao": { "revenue": 416.00, "reservations": 1 },
            "Gabby Stevanny":           { "revenue": 124.00, "reservations": 1 }
          }
        },
        "Other - Manual": {
          "revenue": 13486.00,
          "reservations": 3,
          "breakdown": {
            "Vanity Site":   { "revenue": 12188.00, "reservations": 1 },
            "More Cravings": { "revenue":   715.00, "reservations": 1 },
            "Google":        { "revenue":   583.00, "reservations": 1 }
          }
        }
      }
    }'::jsonb
  WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1)
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
    "totalBusiness":      666980.94,
    "totalReservations":  1565,
    "totalOnline":        136505.10,
    "onlineReservations": 182,
    "channels": {
      "Vanity Site": {
        "revenue": 82472.30,
        "reservations": 110
      },
      "Google": {
        "revenue": 20885.10,
        "reservations": 28
      },
      "More Cravings": {
        "revenue": 11705.40,
        "reservations": 14
      },
      "Booking Widget": {
        "revenue": 10383.20,
        "reservations": 13,
        "covers": 49,
        "prepayment": 500.00
      },
      "Instagram": {
        "revenue": 4671.10,
        "reservations": 9,
        "covers": 26
      },
      "7X Landing Page - Jazz & Love Edition": {
        "revenue": 2580.00,
        "reservations": 4,
        "covers": 8
      },
      "TheFork Integration": {
        "revenue": 1887.00,
        "reservations": 1,
        "covers": 8
      },
      "Marriott GDP": {
        "revenue": 1638.00,
        "reservations": 1,
        "covers": 6
      },
      "Trip Advisor Integration": {
        "revenue": 283.00,
        "reservations": 1,
        "covers": 2
      },
      "7X Landing Page - Jazz & Juice Nights at Cucina": {
        "revenue": 0.00,
        "reservations": 0
      },
      "Marriott.com": {
        "revenue": 0.00,
        "reservations": 1,
        "covers": 2
      }
    },
    "offline": {
      "Walk In": {
        "revenue": 332712.54,
        "reservations": 1109,
        "covers": 2998
      },
      "Internal: Shift": {
        "revenue": 183183.30,
        "reservations": 268,
        "breakdown": {
          "Alisha Shrestha":          { "revenue": 41933.00, "reservations": 31, "covers": 231, "prepayment": 20000.00 },
          "Sumitra Shrestha":         { "revenue": 32738.10, "reservations": 65, "covers": 212 },
          "Sisca Karuniawati":        { "revenue": 28459.40, "reservations": 34, "covers": 174 },
          "Consuelo Isabelle Dumlao": { "revenue": 23642.60, "reservations": 31, "covers": 173 },
          "Numaphung Chemjong":       { "revenue": 14358.00, "reservations": 23, "covers":  98 },
          "Nor syaza Ismail":         { "revenue": 14140.30, "reservations": 16, "covers":  92 },
          "Gabby Stevanny":           { "revenue": 13624.90, "reservations": 31, "covers": 192 },
          "Rindyani Fadila":          { "revenue":  8909.20, "reservations": 30, "covers": 122, "prepayment": 1440.00 },
          "Nishita Hutchamah":        { "revenue":  3196.80, "reservations":  5, "covers":  27 },
          "Emanuele Rizzo":           { "revenue":  1447.00, "reservations":  1, "covers":   7 },
          "Ruth Numaphung Chemjong":  { "revenue":   696.00, "reservations":  1, "covers":   4 },
          "Adnan Afreen":             { "revenue":    38.00, "reservations":  0 }
        }
      },
      "Internal: Access Rule": {
        "revenue": 1094.00,
        "reservations": 3,
        "breakdown": {
          "Sumitra Shrestha":         { "revenue": 554.00, "reservations": 1 },
          "Consuelo Isabelle Dumlao": { "revenue": 416.00, "reservations": 1 },
          "Gabby Stevanny":           { "revenue": 124.00, "reservations": 1 }
        }
      },
      "Other - Manual": {
        "revenue": 13486.00,
        "reservations": 3,
        "breakdown": {
          "Vanity Site":   { "revenue": 12188.00, "reservations": 1 },
          "More Cravings": { "revenue":   715.00, "reservations": 1 },
          "Google":        { "revenue":   583.00, "reservations": 1 }
        }
      }
    }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);
