-- ============================================================
-- Layalina — Weekly Report: Feb 5 – Feb 12, 2026
-- Source: META Ad Manager Excel exports (Campaigns / Ad Sets / Ads)
-- No 7Rooms data (ad reports only)
-- Status: "active" for delivering ads, "learning" for 0-impression items
-- ============================================================

INSERT INTO weekly_reports (venue_id, week_start, week_end, ad_spend, meta_data, revenue_data, programmatic_data)
VALUES (
  (SELECT id FROM venues WHERE name = 'Layalina' LIMIT 1),
  '2026-02-05',
  '2026-02-12',
  1086.77,
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
        "spend": 561.64,
        "audience": {}
      },
      {
        "name": "Suhour Ad Set",
        "status": "active",
        "impressions": 7150,
        "clicks": 120,
        "ctr": "0.98%",
        "linkClicks": 70,
        "engagement": 120,
        "spend": 46.50,
        "audience": {}
      },
      {
        "name": "Groups Ad Set",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "spend": 0,
        "audience": {}
      },
      {
        "name": "Combined Ad Set",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "spend": 0,
        "audience": {}
      },
      {
        "name": "Iftar Ad Set - Lookalikes + DB",
        "status": "active",
        "impressions": 36623,
        "clicks": 503,
        "ctr": "0.85%",
        "linkClicks": 311,
        "engagement": 503,
        "spend": 478.63,
        "audience": {}
      },
      {
        "name": "Suhour Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "spend": 0,
        "audience": {}
      },
      {
        "name": "Groups Ad Set - Lookalikes + DB",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "spend": 0,
        "audience": {}
      },
      {
        "name": "Combined Ad Set - Foodies",
        "status": "learning",
        "impressions": 0,
        "clicks": 0,
        "ctr": "0.00%",
        "linkClicks": 0,
        "engagement": 0,
        "spend": 0,
        "audience": {}
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
      "summary": "Layalina launched Ramadan campaigns on Feb 5 with 8 ad sets covering Iftar, Suhour, Groups, and Combined themes — each with original audience and Lookalike/DB variants. After the first week, 3 ad sets are delivering (Iftar, Suhour, Iftar Lookalikes+DB) generating 136.9K impressions and 962 link clicks at 0.70% CTR. The remaining 5 ad sets (Groups, Combined, Suhour Lookalikes, Groups Lookalikes, Combined Foodies) are still in the learning phase with 0 impressions. Iftar content dominates performance, driving 85% of total spend (AED 1,040 of AED 1,087). English creatives significantly outperform Arabic across all active sets.",
      "recommendations": [
        "Monitor learning-phase ad sets closely — if they don''t exit learning within 3-5 more days, consider consolidating budgets into top-performing sets",
        "The Suhour Ad Set shows a strong 0.98% CTR — consider increasing its budget allocation to accelerate delivery",
        "Arabic creatives are not delivering in original ad sets — investigate targeting overlap or creative approval issues",
        "Iftar Lookalikes+DB is performing well (0.85% CTR) — this audience segment validates the lookalike strategy",
        "Consider pausing underperforming learning-phase sets after 10 days if they show no traction and reallocating to Iftar and Suhour"
      ]
    }
  }',
  NULL,
  NULL
);
