-- ============================================================
-- Above Eleven — Revenue Data (7Rooms / Looker export)
-- Report period : Feb 1 – Feb 24, 2026
-- Data snapshot : Feb 1 – Feb 22, 2026
-- Source        : "Booked By" report, generated Feb 23 2026
-- ============================================================
-- Totals from PDF
--   Total business   : 1,277,484.16 AED
--   Total reservations:        1,237
--   Online revenue   :   184,625.42 AED  (165 + 9 online res)
--   Online res       :           174
--   Ad spend         :     5,486.75 AED
--   ROAS (computed)  :          ~33.65x  (totalOnline ÷ ad_spend)
-- ============================================================
-- Safe upsert: UPDATE first (preserves meta_data / meta_data_draft),
-- INSERT only if no row exists for this venue + week.
-- ============================================================

WITH upd AS (
  UPDATE weekly_reports
  SET
    ad_spend     = 5486.75,
    revenue_data = '{
      "totalBusiness":      1277484.16,
      "totalReservations":  1237,
      "totalOnline":        184625.42,
      "onlineReservations": 174,
      "channels": {
        "Booking Widget": {
          "revenue": 174213.42,
          "reservations": 165,
          "covers": 458,
          "prepayment": 9516.00
        },
        "7X Landing Page - Yunza-11 Brunch | Valentine''s": {
          "revenue": 3084.99,
          "reservations": 1,
          "covers": 8,
          "prepayment": 600.00
        },
        "7X Landing Page - Valentine''s Dinner": {
          "revenue": 2529.00,
          "reservations": 2,
          "covers": 4,
          "prepayment": 0.00
        },
        "7X Landing Page - Yunza Brunch": {
          "revenue": 2425.01,
          "reservations": 3,
          "covers": 10,
          "prepayment": 1600.00
        },
        "7X Landing Page - Let''s Get Pisco''d After Party": {
          "revenue": 1194.00,
          "reservations": 2,
          "covers": 6,
          "prepayment": 0.00
        },
        "7X Landing Page - Ritmo Arriba": {
          "revenue": 1179.00,
          "reservations": 1,
          "covers": 4,
          "prepayment": 0.00
        },
        "Trip Advisor Integration": {
          "revenue": 0.00,
          "reservations": 0
        },
        "Marriott.com": {
          "revenue": 0.00,
          "reservations": 0
        }
      },
      "offline": {
        "Walk In": {
          "revenue": 464762.20,
          "reservations": 840,
          "covers": 2025
        },
        "Internal: Shift": {
          "revenue": 628096.55,
          "reservations": 223,
          "breakdown": {
            "Consuelo Isabelle Dumlao": { "revenue": 198857.00, "reservations": 25, "covers": 367 },
            "Vivian Nabunnya":          { "revenue": 122824.17, "reservations": 48, "covers": 270 },
            "Rindyani Fadila":          { "revenue":  96686.09, "reservations": 41, "covers": 299 },
            "Myint Myat Oo":            { "revenue":  69714.49, "reservations": 38, "covers": 183 },
            "Corinne Godfroy":          { "revenue":  59618.60, "reservations":  8, "covers": 189 },
            "Alisha Shrestha":          { "revenue":  32361.59, "reservations": 31, "covers": 105 },
            "Gabby Stevanny":           { "revenue":  31655.00, "reservations": 16, "covers": 124 },
            "Amna Jawed":               { "revenue":  10470.01, "reservations": 10, "covers":  45 },
            "Rene Granados":            { "revenue":   4666.60, "reservations":  4, "covers":  12 },
            "Anastasiia Bakshanskaia":  { "revenue":   1100.00, "reservations":  1, "covers":   2 },
            "Riskha Herlyana":          { "revenue":    143.00, "reservations":  1, "covers":   2 }
          }
        },
        "Internal: Access Rule": {
          "revenue": 0.00,
          "reservations": 0
        }
      }
    }'::jsonb
  WHERE venue_id  = (SELECT id FROM venues WHERE name = 'Above Eleven' LIMIT 1)
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
    "totalBusiness":      1277484.16,
    "totalReservations":  1237,
    "totalOnline":        184625.42,
    "onlineReservations": 174,
    "channels": {
      "Booking Widget": {
        "revenue": 174213.42,
        "reservations": 165,
        "covers": 458,
        "prepayment": 9516.00
      },
      "7X Landing Page - Yunza-11 Brunch | Valentine''s": {
        "revenue": 3084.99,
        "reservations": 1,
        "covers": 8,
        "prepayment": 600.00
      },
      "7X Landing Page - Valentine''s Dinner": {
        "revenue": 2529.00,
        "reservations": 2,
        "covers": 4,
        "prepayment": 0.00
      },
      "7X Landing Page - Yunza Brunch": {
        "revenue": 2425.01,
        "reservations": 3,
        "covers": 10,
        "prepayment": 1600.00
      },
      "7X Landing Page - Let''s Get Pisco''d After Party": {
        "revenue": 1194.00,
        "reservations": 2,
        "covers": 6,
        "prepayment": 0.00
      },
      "7X Landing Page - Ritmo Arriba": {
        "revenue": 1179.00,
        "reservations": 1,
        "covers": 4,
        "prepayment": 0.00
      },
      "Trip Advisor Integration": {
        "revenue": 0.00,
        "reservations": 0
      },
      "Marriott.com": {
        "revenue": 0.00,
        "reservations": 0
      }
    },
    "offline": {
      "Walk In": {
        "revenue": 464762.20,
        "reservations": 840,
        "covers": 2025
      },
      "Internal: Shift": {
        "revenue": 628096.55,
        "reservations": 223,
        "breakdown": {
          "Consuelo Isabelle Dumlao": { "revenue": 198857.00, "reservations": 25, "covers": 367 },
          "Vivian Nabunnya":          { "revenue": 122824.17, "reservations": 48, "covers": 270 },
          "Rindyani Fadila":          { "revenue":  96686.09, "reservations": 41, "covers": 299 },
          "Myint Myat Oo":            { "revenue":  69714.49, "reservations": 38, "covers": 183 },
          "Corinne Godfroy":          { "revenue":  59618.60, "reservations":  8, "covers": 189 },
          "Alisha Shrestha":          { "revenue":  32361.59, "reservations": 31, "covers": 105 },
          "Gabby Stevanny":           { "revenue":  31655.00, "reservations": 16, "covers": 124 },
          "Amna Jawed":               { "revenue":  10470.01, "reservations": 10, "covers":  45 },
          "Rene Granados":            { "revenue":   4666.60, "reservations":  4, "covers":  12 },
          "Anastasiia Bakshanskaia":  { "revenue":   1100.00, "reservations":  1, "covers":   2 },
          "Riskha Herlyana":          { "revenue":    143.00, "reservations":  1, "covers":   2 }
        }
      },
      "Internal: Access Rule": {
        "revenue": 0.00,
        "reservations": 0
      }
    }
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM upd);
