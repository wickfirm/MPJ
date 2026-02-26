-- ============================================================
-- Live Campaigns — Traffic Reels (Feb 2026)
-- Acquasale : New Pizza Additions Reel  (~3,198 impressions)
-- Cucina    : NEW PASTA ALERT Reel      (~8,240 impressions)
-- ============================================================

INSERT INTO live_campaigns (venue_id, name, type, language, format, captions, landing_page, status)
VALUES
  (
    (SELECT id FROM venues WHERE name = 'Acquasale' LIMIT 1),
    'New Pizza Additions',
    'Traffic',
    'English',
    'Reel',
    'Yes',
    NULL,
    'active'
  ),
  (
    (SELECT id FROM venues WHERE name = 'Cucina' LIMIT 1),
    'NEW PASTA ALERT',
    'Traffic',
    'English',
    'Reel',
    'Yes',
    NULL,
    'active'
  );
