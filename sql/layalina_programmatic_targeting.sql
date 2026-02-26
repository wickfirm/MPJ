-- ============================================================
-- Layalina — Add Contextual & Website Targeting to programmatic_data
-- Campaign: Feb 1 – Mar 19, 2026 (data snapshot: Feb 1–24)
-- Run in Supabase SQL Editor
-- ============================================================

UPDATE weekly_reports
SET programmatic_data = programmatic_data || jsonb_build_object(
  'targeting',
  coalesce(programmatic_data->'targeting', '{}'::jsonb) || '{
    "contextual_en": {
      "core_ramadan": [
        "Ramadan","Ramadan 2026","Ramadan Kareem","Ramadan Mubarak","Iftar","Suhoor","Suhur",
        "Iftar buffet","Iftar dinner","Suhoor dinner","Ramadan tent","Ramadan gathering",
        "Ramadan dining","Ramadan experience","Ramadan restaurant","Ramadan food",
        "Ramadan offers","Ramadan deals","Ramadan nights","Layalina Ramadan",
        "Best Iftar Dubai","Best Suhoor Dubai","Iftar Dubai 2026","Suhoor Dubai 2026",
        "Iftar reservation","Suhoor reservation","Ramadan UAE","Ramadan Dubai",
        "Eid al-Fitr","Eid celebrations","Eid dinner","Ramadan traditions",
        "Ramadan family dinner","Ramadan corporate Iftar","Group Iftar","Ramadan hospitality"
      ],
      "dining_culinary": [
        "Fine dining Dubai","Luxury dining Dubai","Restaurant Dubai","Best restaurants Dubai",
        "Dubai restaurant reservation","Middle Eastern restaurant","Arabic restaurant Dubai",
        "Lebanese restaurant Dubai","Mediterranean restaurant Dubai","Halal fine dining",
        "Halal restaurant Dubai","Hotel restaurant Dubai","Resort dining Dubai",
        "Outdoor dining Dubai","Buffet Dubai","Food experience Dubai",
        "Culinary experience Dubai","Dubai food scene","Dubai dining guide",
        "New restaurant Dubai","Pop-up restaurant Dubai","Chef table Dubai","Gourmet dining"
      ],
      "luxury_lifestyle": [
        "Luxury lifestyle Dubai","Luxury experience Dubai","Premium dining","Five star dining",
        "Five star hotel Dubai","Luxury hotel Dubai","High end restaurant Dubai","VIP dining",
        "Exclusive dining experience","Dubai luxury","Dubai nightlife","Things to do Dubai",
        "Dubai events","Dubai weekend plans","Dubai social scene","What to do in Dubai",
        "Dubai attractions","Dubai entertainment","Dubai going out"
      ],
      "hotel_hospitality": [
        "Marriott Palm Jumeirah","Marriott Dubai","Palm Jumeirah restaurant",
        "Palm Jumeirah dining","Palm Jumeirah hotel","Palm Jumeirah Iftar",
        "Palm Jumeirah Suhoor","Hotels Palm Jumeirah","JW Marriott Dubai",
        "Marriott Bonvoy","Marriott Ramadan","Hotel Iftar Dubai","Hotel Suhoor Dubai",
        "Hotel Ramadan tent","Staycation Dubai","Dubai hotel deals","Dubai hotel dining"
      ],
      "competitor_venue": [
        "Atlantis Iftar","Atlantis Ramadan","Asateer tent","Jumeirah Iftar",
        "Address hotel Ramadan","Palace Downtown Iftar","Ewaan Ramadan",
        "Armani hotel Iftar","One&Only Iftar","Bab Al Shams Ramadan",
        "Four Seasons Iftar Dubai","Ritz Carlton Iftar Dubai","Shangri-La Iftar Dubai",
        "Fairmont Iftar Dubai","Waldorf Astoria Iftar","Raffles Iftar Dubai",
        "St Regis Iftar Dubai","Kempinski Iftar Dubai"
      ],
      "cultural_community": [
        "Arab culture","Middle Eastern culture","Islamic culture","Muslim community Dubai",
        "Emirati traditions","Emirati culture","Arabian hospitality","Arabic hospitality",
        "Dubai expat community","Family gathering Dubai","Corporate event Dubai",
        "Corporate Iftar Dubai","Team Iftar","Business dinner Dubai",
        "Private dining Dubai","Private event Dubai","Charity Iftar","Ramadan charity"
      ],
      "food_specific": [
        "Middle Eastern food","Arabic food","Lebanese food","Grilled meat","Lamb dishes",
        "Kebab","Hummus","Mezze","Fattoush","Kunafa","Arabic desserts","Arabic sweets",
        "Dates","Laban","Jallab","Qamar Al Din","Traditional Arabic food","Emirati food",
        "Ouzi","Harees","Thareed","Luqaimat"
      ],
      "travel_tourism": [
        "Dubai travel","Visit Dubai","Dubai tourism","Things to eat in Dubai",
        "Dubai food guide","Dubai travel guide","Dubai holiday","Dubai vacation",
        "Travel to UAE","Dubai trip planning","Where to eat Dubai","Dubai bucket list"
      ]
    },
    "contextual_ar": {
      "core_ramadan": [
        "رمضان","رمضان ٢٠٢٦","رمضان كريم","رمضان مبارك","إفطار","سحور",
        "بوفيه إفطار","عشاء إفطار","عشاء سحور","خيمة رمضان","تجمع رمضاني",
        "مطعم رمضان","أكل رمضان","تجربة رمضانية","عروض رمضان","ليالي رمضان",
        "ليالينا رمضان","أفضل إفطار دبي","أفضل سحور دبي","إفطار دبي ٢٠٢٦",
        "سحور دبي ٢٠٢٦","حجز إفطار","حجز سحور","رمضان الإمارات","رمضان دبي",
        "عيد الفطر","احتفالات العيد","عشاء العيد","تقاليد رمضان","إفطار عائلي",
        "إفطار جماعي","إفطار شركات","ضيافة رمضان"
      ],
      "dining_culinary": [
        "مطاعم فاخرة دبي","أفضل مطاعم دبي","حجز مطعم دبي","مطعم عربي دبي",
        "مطعم لبناني دبي","مطعم شرقي دبي","مطعم متوسطي دبي","مطعم حلال دبي",
        "مطعم فندق دبي","مطعم منتجع دبي","أكل فاخر دبي","تجربة طعام دبي",
        "بوفيه دبي","مطعم جديد دبي","طاولة شيف دبي","دليل مطاعم دبي","مشهد الطعام دبي"
      ],
      "luxury_lifestyle": [
        "حياة فاخرة دبي","تجربة فاخرة دبي","فندق خمس نجوم دبي","فندق فاخر دبي",
        "مطعم راقي دبي","أكل VIP","تجربة حصرية","فخامة دبي","فعاليات دبي",
        "أشياء تسويها بدبي","وين نروح بدبي","سهرات دبي","عطلة نهاية الأسبوع دبي","ترفيه دبي"
      ],
      "hotel_hospitality": [
        "ماريوت نخلة جميرا","ماريوت دبي","مطعم نخلة جميرا","أكل نخلة جميرا",
        "فندق نخلة جميرا","إفطار نخلة جميرا","سحور نخلة جميرا","منتجع نخلة جميرا",
        "ماريوت بونفوي","ماريوت رمضان","إفطار فندق دبي","سحور فندق دبي",
        "خيمة رمضان فندق","ستايكيشن دبي","عروض فنادق دبي"
      ],
      "competitor_venue": [
        "إفطار أتلانتس","رمضان أتلانتس","خيمة أساطير","إفطار جميرا",
        "رمضان فندق العنوان","إفطار بالاس داون تاون","إيوان رمضان","إفطار أرماني دبي",
        "إفطار ون آند أونلي","رمضان باب الشمس","إفطار فور سيزونز دبي",
        "إفطار ريتز كارلتون دبي","إفطار شانغريلا دبي","إفطار فيرمونت دبي",
        "إفطار والدورف أستوريا","إفطار رافلز دبي","إفطار سانت ريجيس دبي","إفطار كمبينسكي دبي"
      ],
      "cultural_community": [
        "الثقافة العربية","ثقافة شرق أوسطية","الثقافة الإسلامية","المجتمع المسلم دبي",
        "التقاليد الإماراتية","الثقافة الإماراتية","الضيافة العربية","كرم الضيافة",
        "مجتمع المقيمين دبي","تجمع عائلي دبي","فعالية شركات دبي","إفطار عمل دبي",
        "عشاء عمل دبي","صالة خاصة دبي","حفل خاص دبي","إفطار خيري","زكاة رمضان","صدقة رمضان"
      ],
      "food_specific": [
        "أكل عربي","أكل شرقي","أكل لبناني","مشاوي","لحم مشوي","كباب","حمص","مزة",
        "فتوش","تبولة","كنافة","حلويات عربية","حلويات شرقية","تمر","لبن","جلاب",
        "قمر الدين","أكل إماراتي","هريس","ثريد","لقيمات","عوزي","ورق عنب","منسف","بقلاوة"
      ],
      "travel_tourism": [
        "سفر دبي","زيارة دبي","سياحة دبي","وين ناكل بدبي","دليل أكل دبي",
        "دليل سفر دبي","إجازة دبي","رحلة دبي","أفضل أماكن الأكل دبي"
      ]
    },
    "negative_en": [
      "Ramadan fasting tips","Ramadan diet","Ramadan weight loss",
      "Ramadan recipes at home","Homemade Iftar"
    ],
    "negative_ar": [
      "وصفات إفطار بالبيت","طبخ رمضاني","رجيم رمضان","نصائح صيام","إفطار صحي بالبيت"
    ],
    "website_targeting": {
      "corporate": {
        "premium_news_business": [
          "gulfnews.com","thenationalnews.com","khaleejtimes.com","arabianbusiness.com",
          "gulfbusiness.com","zawya.com","argaam.com","cnbcarabia.com","alarabiya.net",
          "aljazeera.net","reuters.com","bloomberg.com","ft.com","forbes.com","forbesmiddleeast.com"
        ],
        "business_corporate": [
          "linkedin.com","hbr.org","entrepreneur.com","inc.com","fastcompany.com","wired.com","techcrunch.com"
        ],
        "sports": [
          "espn.com","skysports.com","beinsports.com","goal.com","kooora.com",
          "yallakora.com","filgoal.com","livescore.com","flashscore.com","marca.com"
        ],
        "uae_lifestyle_events": [
          "timeoutdubai.com","whatson.ae","lovindubia.com","visitdubai.com",
          "bayut.com","propertyfinder.ae","dubizzle.com"
        ],
        "finance_investment": [
          "tradingview.com","investing.com","marketwatch.com","cnbc.com","moneycontrol.com"
        ],
        "arabic_news": [
          "almayadeen.net","aawsat.com","independentarabia.com","alhurra.com",
          "rt.com/arabic","bbc.com/arabic","france24.com/ar"
        ]
      },
      "individual_family": {
        "food_restaurant": [
          "zomato.com","tripadvisor.com","opentable.com","eater.com",
          "foodandwine.com","bonappetit.com","tasteatlas.com","deliveroo.ae","talabat.com"
        ],
        "lifestyle_culture": [
          "timeoutdubai.com","whatson.ae","lovindubia.com","cosmopolitan.com",
          "harpersbazaararabia.com","voguearabia.com","esquireme.com","gqmiddleeast.com","tatler.com"
        ],
        "social_entertainment": [
          "instagram.com","snapchat.com","tiktok.com","youtube.com",
          "reddit.com","buzzfeed.com","boredpanda.com","9gag.com"
        ],
        "parenting_family": [
          "mumsnet.com","babycenter.com","motherbabychild.com","sehati.gov.ae"
        ],
        "travel_leisure": [
          "lonelyplanet.com","cntraveler.com","travelandleisure.com","booking.com",
          "expedia.com","skyscanner.com","kayak.com","tripadvisor.com","agoda.com"
        ],
        "arabic_lifestyle": [
          "layalina.com","sayidaty.net","jamalouki.net","supermama.me",
          "webteb.com","shahid.net","rotana.net","anghami.com"
        ]
      },
      "exclusions": [
        "Conflict, tragedy, and crime news sections (brand safety)",
        "Diet and weight loss content sections",
        "Alcohol-related content sections (Ramadan sensitivity)",
        "Unmoderated user-generated comment sections"
      ]
    }
  }'::jsonb
)
WHERE venue_id = (SELECT id FROM venues WHERE name = 'Layalina' LIMIT 1)
  AND week_start = '2026-02-01';
