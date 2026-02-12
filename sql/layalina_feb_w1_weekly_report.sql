-- ============================================================
-- Layalina — Weekly Report: Feb 5 – Feb 12, 2026
-- Source: META Ad Manager Excel exports (Campaigns / Ad Sets / Ads)
-- No 7Rooms data (ad reports only)
-- Status: "active" for delivering ads, "learning" for 0-impression items
-- ============================================================

-- Remove existing row if re-running
DELETE FROM weekly_reports
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Layalina' LIMIT 1)
  AND week_start = '2026-02-05';

INSERT INTO weekly_reports (venue_id, week_start, week_end, meta_data, revenue_data, programmatic_data)
VALUES (
  (SELECT id FROM venues WHERE name = 'Layalina' LIMIT 1),
  '2026-02-05',
  '2026-02-12',
  '{
    "campaigns": [
      {
        "name": "Layalina Campaign",
        "status": "active",
        "impressions": 136905,
        "clicks": 1399,
        "ctr": "0.70%",
        "linkClicks": 962,
        "engagement": 1399
      }
    ],
    "adSets": [
      {
        "name": "Iftar Ad Set",
        "status": "active",
        "impressions": 93132,
        "clicks": 776,
        "ctr": "0.62%",
        "linkClicks": 581,
        "engagement": 776,
        "audience": {
          "type": "Advantage+",
          "location": "UAE, Palm Jumeirah (+3 mi)",
          "age": "24-65+",
          "gender": "All",
          "interests": ["Luxury Escapes Travel", "InterContinental Hotels Group", "Marriott International", "Luxury Travel", "JW Marriott Hotels", "First class travel", "Four Seasons Hotels and Resorts", "Vacation rental", "Sheraton Hotels and Resorts", "Middle Eastern cuisine", "Business travel", "InterContinental", "Shangri-La Hotels and Resorts", "Luxury Resorts", "Hilton Worldwide", "Ritz-Carlton Hotel Company", "Hilton Hotels & Resorts", "Timeshare", "Marriott Hotels & Resorts", "Travel or Luxury Lodge Holiday"],
          "behaviors": ["Frequent Travelers", "Frequent international travelers"]
        }
      },
      {
        "name": "Suhour Ad Set",
        "status": "active",
        "impressions": 7150,
        "clicks": 120,
        "ctr": "0.98%",
        "linkClicks": 70,
        "engagement": 120,
        "audience": {
          "type": "Advantage+",
          "location": "UAE, Palm Jumeirah (+2 mi), City Walk (+1 mi), DIFC (+1 mi), Business Bay Dubai (+1 mi), Bluewaters Island (+1 mi), Jumeirah Al Naseem (+1 mi), Downtown Dubai (+1 mi)",
          "age": "24-65+",
          "gender": "All",
          "interests": ["Luxury Escapes Travel", "InterContinental Hotels Group", "Marriott International", "Luxury Travel", "JW Marriott Hotels", "First class travel", "Four Seasons Hotels and Resorts", "Vacation rental", "Sheraton Hotels and Resorts", "Middle Eastern cuisine", "Business travel", "InterContinental", "Shangri-La Hotels and Resorts", "Luxury Resorts", "Hilton Worldwide", "Ritz-Carlton Hotel Company", "Hilton Hotels & Resorts", "Timeshare", "Marriott Hotels & Resorts", "Travel or Luxury Lodge Holiday"],
          "behaviors": ["Frequent Travelers", "Frequent international travelers"]
        }
      },
      {
        "name": "Groups Ad Set",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "audience": {
          "type": "Manual",
          "location": "UAE, Jumeirah Golf Estates (+1 mi), DIFC (+1 mi), Business Bay Dubai (+1 mi), Dubai Internet City (+2 mi), Dubai Hills Estate (+1 mi)",
          "age": "24-65+",
          "gender": "All",
          "interests": ["Luxury Escapes Travel", "InterContinental Hotels Group", "Marriott International", "Luxury Travel", "JW Marriott Hotels", "First class travel", "Four Seasons Hotels and Resorts", "Vacation rental", "Sheraton Hotels and Resorts", "Middle Eastern cuisine", "Business travel", "InterContinental", "Shangri-La Hotels and Resorts", "Luxury Resorts", "Hilton Worldwide", "Ritz-Carlton Hotel Company", "Hilton Hotels & Resorts", "Timeshare", "Marriott Hotels & Resorts", "Travel or Luxury Lodge Holiday", "Travel"],
          "behaviors": ["Frequent Travelers", "Frequent international travelers"]
        }
      },
      {
        "name": "Combined Ad Set",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "audience": {
          "type": "Advantage+",
          "location": "UAE, Dubai",
          "age": "24-65+",
          "gender": "All",
          "interests": ["Luxury Escapes Travel", "InterContinental Hotels Group", "Marriott International", "Luxury Travel", "JW Marriott Hotels", "First class travel", "Four Seasons Hotels and Resorts", "Vacation rental", "Sheraton Hotels and Resorts", "Middle Eastern cuisine", "Business travel", "InterContinental", "Shangri-La Hotels and Resorts", "Luxury Resorts", "Hilton Worldwide", "Ritz-Carlton Hotel Company", "Hilton Hotels & Resorts", "Timeshare", "Marriott Hotels & Resorts", "Travel or Luxury Lodge Holiday"],
          "behaviors": ["Frequent Travelers", "Frequent international travelers"]
        }
      },
      {
        "name": "Iftar Ad Set - Lookalikes + DB",
        "status": "active",
        "impressions": 36623,
        "clicks": 503,
        "ctr": "0.85%",
        "linkClicks": 311,
        "engagement": 503,
        "audience": {
          "type": "Custom",
          "location": "UAE, Dubai",
          "age": "25-65+",
          "gender": "All",
          "customAudiences": ["Customer List: IFTAR 2025.csv", "Lookalike (AE, 1%) - IFTAR 2025.csv"]
        }
      },
      {
        "name": "Suhour Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "audience": {
          "type": "Custom",
          "location": "United Arab Emirates",
          "age": "25-65+",
          "gender": "All",
          "customAudiences": ["Customer List: IFTAR 2025.csv", "Lookalike (AE, 1%) - IFTAR 2025.csv"]
        }
      },
      {
        "name": "Groups Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "audience": {
          "type": "Custom",
          "location": "UAE, Dubai",
          "age": "24-65+",
          "gender": "All",
          "customAudiences": ["Customer List: IFTAR 2025.csv", "Lookalike (AE, 1%) - IFTAR 2025.csv"]
        }
      },
      {
        "name": "Combined Ad Set - Foodies",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "audience": {
          "type": "Custom",
          "location": "UAE, Dubai",
          "age": "25-65+",
          "gender": "All",
          "customAudiences": ["IG Engagement: Above Eleven", "IG Engagement: Acquasale by Cucina", "IG Engagement: Cucina", "IG Engagement: Smoki Moto", "Customer List: A11 DB", "Customer List: Cucina DB", "Customer List: Marriott Team", "Customer List: Smoki DB", "Lookalike (AE, 1%) - A11 DB", "Lookalike (AE, 1%) - Cucina DB", "Lookalike (AE, 1%) - Smoki DB"]
        }
      }
    ],
    "ads": [
      {
        "name": "Iftar Carousel Ad - English",
        "adSet": "Iftar Ad Set",
        "status": "active",
        "impressions": 93132,
        "ctr": "0.62%",
        "linkClicks": 581,
        "engagement": 776
      },
      {
        "name": "Iftar Carousel Ad - Arabic",
        "adSet": "Iftar Ad Set",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Suhour Carousel Ad - English",
        "adSet": "Suhour Ad Set",
        "status": "active",
        "impressions": 7150,
        "ctr": "0.98%",
        "linkClicks": 70,
        "engagement": 120
      },
      {
        "name": "Suhour Carousel Ad - Arabic",
        "adSet": "Suhour Ad Set",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Groups Carousel Ad - English",
        "adSet": "Groups Ad Set",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Groups Carousel Ad - Arabic",
        "adSet": "Groups Ad Set",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Combined Carousel Ad - English",
        "adSet": "Combined Ad Set",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Combined Carousel Ad - Arabic",
        "adSet": "Combined Ad Set",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Iftar Carousel Ad - Arabic (Lookalikes)",
        "adSet": "Iftar Ad Set - Lookalikes + DB",
        "status": "active",
        "impressions": 17240,
        "ctr": "0.87%",
        "linkClicks": 150,
        "engagement": 218
      },
      {
        "name": "Iftar Carousel Ad - English (Lookalikes)",
        "adSet": "Iftar Ad Set - Lookalikes + DB",
        "status": "active",
        "impressions": 19384,
        "ctr": "0.83%",
        "linkClicks": 161,
        "engagement": 285
      },
      {
        "name": "Suhour Carousel Ad - English (Lookalikes)",
        "adSet": "Suhour Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Suhour Carousel Ad - Arabic (Lookalikes)",
        "adSet": "Suhour Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Groups Carousel Ad - English (Lookalikes)",
        "adSet": "Groups Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Groups Carousel Ad - Arabic (Lookalikes)",
        "adSet": "Groups Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Combined Carousel Ad - English (Foodies)",
        "adSet": "Combined Ad Set - Foodies",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      },
      {
        "name": "Combined Carousel Ad - Arabic (Foodies)",
        "adSet": "Combined Ad Set - Foodies",
        "status": "learning",
        "impressions": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0
      }
    ],
    "analysis": {
      "summary": "Layalina launched Ramadan campaigns on Feb 5 with 8 ad sets covering Iftar, Suhour, Groups, and Combined themes — each with original audience and Lookalike/DB variants. After the first week, 3 ad sets are delivering (Iftar, Suhour, Iftar Lookalikes+DB) generating 136.9K impressions and 962 link clicks at 0.70% CTR. The remaining 5 ad sets (Groups, Combined, Suhour Lookalikes, Groups Lookalikes, Combined Foodies) are still in the learning phase with 0 impressions. Iftar content dominates performance with the highest volume of impressions across all active sets. English creatives significantly outperform Arabic across all active sets.",
      "recommendations": [
        "Monitor learning-phase ad sets closely — if they don''t exit learning within 3-5 more days, consider consolidating into top-performing sets",
        "The Suhour Ad Set shows a strong 0.98% CTR — consider prioritising it to accelerate delivery",
        "Arabic creatives are not delivering in original ad sets — investigate targeting overlap or creative approval issues",
        "Iftar Lookalikes+DB is performing well (0.85% CTR) — this audience segment validates the lookalike strategy",
        "Consider pausing underperforming learning-phase sets after 10 days if they show no traction and reallocating to Iftar and Suhour"
      ]
    }
  }',
  NULL,
  NULL
);
