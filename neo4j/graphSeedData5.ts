/**
 * Ancestor chains sourced from "سير أعلام النبلاء" (al-Dhahabi) for batch 3 of
 * newly added companions (prisma/personSeedData6.ts): kulthum-ibn-al-hidm,
 * abu-dujanah-al-ansari, khubayb-ibn-adi, muadh-ibn-amr-ibn-al-jumuh,
 * muawwidh-ibn-amr-ibn-al-jumuh, khallad-ibn-amr-ibn-al-jumuh,
 * amr-ibn-al-jumuh, ubaydah-ibn-al-harith, rabiah-ibn-al-harith,
 * abdullah-ibn-al-harith-ibn-abd-al-muttalib, khalid-ibn-said, aban-ibn-said,
 * amr-ibn-said-al-umawi, al-ala-ibn-al-hadrami, saad-ibn-khaythamah,
 * al-baraa-ibn-marur, bishr-ibn-al-baraa, saad-ibn-ubadah, saad-ibn-muadh,
 * zaid-ibn-al-khattab, asad-ibn-zurarah, utbah-ibn-ghazwan,
 * ukkashah-ibn-mihsan, thabit-ibn-qais.
 *
 * Chains stop as soon as they reach a slug that already exists elsewhere in
 * the graph (graphSeedData.ts / graphSeedData2.ts / graphSeedData3.ts /
 * graphSeedData4.ts), e.g. al-muttalib-ibn-abd-manaf, al-harith-ibn-abd-al-
 * muttalib, umayya-ibn-abd-shams, al-khattab-ibn-nufayl. For fresh Ansari
 * branches with no existing anchor, chains stop at a clear tribal/clan-eponym
 * point rather than reproducing the full pre-Islamic genealogy given on the
 * page (matching how earlier batches stopped at e.g. "...بن قضاعة").
 *
 * ukkashah-ibn-mihsan and abdullah-ibn-al-harith-ibn-abd-al-muttalib /
 * rabiah-ibn-al-harith / zaid-ibn-al-khattab need no new nodes here: the
 * first has no recorded grandfather on its own page, and the other three
 * reuse ancestor chains already created in earlier batches.
 *
 * Same-name collisions disambiguated by father, following the existing
 * convention (see e.g. malik-ibn-an-nadr-al-najjari in graphSeedData4.ts):
 *   - "زيد بن حرام" here (father of al-Jumuh, ancestor of amr-ibn-al-jumuh
 *     and his sons) is a different Khazraji figure — of Banu Salamah — from
 *     the existing "zayd-ibn-haram" (ancestor of al-baraa-ibn-malik, of Banu
 *     al-Najjar, graphSeedData4.ts). Slugged "zayd-ibn-haram-ibn-kaab" since
 *     his own father here is Haram ibn Ka'b, not Haram ibn Jundub.
 *   - "العاص بن أمية" (father of Sa'id ibn al-'As, ancestor of khalid-ibn-said
 *     / aban-ibn-said / amr-ibn-said-al-umawi) is a brother of the existing
 *     "أبي العاص بن أمية" (abi-al-as-ibn-umayya, Uthman's great-grandfather
 *     via Affan, graphSeedData2.ts) — both sons of Umayya ibn Abd Shams, but
 *     distinct people. Slugged "al-as-ibn-umayya", which does not collide
 *     with the existing "abi-al-as-ibn-umayya" string.
 *   - "امرؤ القيس" recurs a third and fourth time in this batch (Sa'd ibn
 *     Mu'adh's Awsi line, and Thabit ibn Qais's Khazraji line), on top of the
 *     two variants already in graphSeedData4.ts (Kalbi imru-al-qays-ibn-amir,
 *     Khazraji imru-al-qays-ibn-thalabah). Slugs are disambiguated by father
 *     as usual ("imru-al-qays-ibn-zayd", "imru-al-qays-ibn-malik-al-aghar",
 *     and "imru-al-qays-ibn-al-harith" for Kulthum ibn al-Hidm's Awsi line),
 *     none of which collide with the existing two.
 *
 * al-ala-ibn-al-hadrami's father (abdullah-ibn-imad-al-hadrami) and
 * utbah-ibn-ghazwan's chain (ghazwan-ibn-jabir, jabir-ibn-wuhayb) are left
 * unconnected to the Quraysh tree: both companions are allies (حلفاء) of
 * Qurashi clans by alliance, not blood descendants, so no FATHER/SON edge is
 * created up into Banu Umayya for them.
 *
 * Ordering note: the batch-3 companions themselves are not created here —
 * their Person nodes come from `npm run people:sync -- --apply` picking up
 * the PostgreSQL profiles in prisma/personSeedData6.ts. Run that sync before
 * `npm run seed:graph`, or the MATCH clauses linking them to their ancestors
 * below will silently find nothing to attach to.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Kulthum ibn al-Hidm
  'CREATE (:Person { name: "الهدم بن امرئ القيس", slug: "al-hidm-ibn-imri-al-qays", fullName: "الهدم بن امرئ القيس بن الحارث بن زيد الأنصاري الأوسي" });',
  'CREATE (:Person { name: "امرؤ القيس بن الحارث", slug: "imru-al-qays-ibn-al-harith", fullName: "امرؤ القيس بن الحارث بن زيد الأنصاري الأوسي" });',
  'CREATE (:Person { name: "الحارث بن زيد", slug: "al-harith-ibn-zayd", fullName: "الحارث بن زيد الأنصاري الأوسي" });',

  // Abu Dujanah al-Ansari
  'CREATE (:Person { name: "خرشة بن لوذان", slug: "khirashah-ibn-lawdhan", fullName: "خرشة بن لوذان بن عبد ود بن زيد الأنصاري الساعدي" });',
  'CREATE (:Person { name: "لوذان بن عبد ود", slug: "lawdhan-ibn-abd-wudd", fullName: "لوذان بن عبد ود بن زيد الأنصاري الساعدي" });',
  'CREATE (:Person { name: "عبد ود بن زيد", slug: "abd-wudd-ibn-zayd", fullName: "عبد ود بن زيد الأنصاري الساعدي" });',

  // Khubayb ibn Adi
  'CREATE (:Person { name: "عدي بن عامر", slug: "adi-ibn-amir", fullName: "عدي بن عامر بن مجدعة بن جحجبى الأنصاري" });',
  'CREATE (:Person { name: "عامر بن مجدعة", slug: "amir-ibn-majdaah", fullName: "عامر بن مجدعة بن جحجبى الأنصاري" });',
  'CREATE (:Person { name: "مجدعة بن جحجبى", slug: "majdaah-ibn-jahjaba", fullName: "مجدعة بن جحجبى الأنصاري" });',

  // Amr ibn al-Jumuh (shared ancestor chain for him and his sons Mu'adh,
  // Mu'awwidh, Khallad)
  'CREATE (:Person { name: "الجموح بن زيد", slug: "al-jumuh-ibn-zayd", fullName: "الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "زيد بن حرام", slug: "zayd-ibn-haram-ibn-kaab", fullName: "زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "حرام بن كعب", slug: "haram-ibn-kaab", fullName: "حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "كعب بن غنم", slug: "kaab-ibn-ghanm", fullName: "كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "غنم بن كعب", slug: "ghanm-ibn-kaab", fullName: "غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "كعب بن سلمة", slug: "kaab-ibn-salamah", fullName: "كعب بن سلمة الأنصاري الخزرجي السلمي" });',

  // Ubaydah ibn al-Harith (connects to existing al-muttalib-ibn-abd-manaf)
  'CREATE (:Person { name: "الحارث بن المطلب", slug: "al-harith-ibn-al-muttalib", fullName: "الحارث بن المطلب بن عبد مناف بن قصي القرشي المطلبي" });',

  // Khalid ibn Said, Aban ibn Said, Amr ibn Said al-Umawi (shared ancestor
  // chain; connects to existing umayya-ibn-abd-shams)
  'CREATE (:Person { name: "سعيد بن العاص", slug: "said-ibn-al-as", fullName: "سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي" });',
  'CREATE (:Person { name: "العاص بن أمية", slug: "al-as-ibn-umayya", fullName: "العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي" });',

  // Al-Ala ibn al-Hadrami (ally of Banu Umayya, not blood Quraysh)
  'CREATE (:Person { name: "عبد الله بن عماد", slug: "abdullah-ibn-imad-al-hadrami", fullName: "عبد الله بن عماد الحضرمي حليف بني أمية" });',

  // Saad ibn Khaythamah
  'CREATE (:Person { name: "خيثمة بن الحارث", slug: "khaythamah-ibn-al-harith", fullName: "خيثمة بن الحارث بن مالك بن كعب الأنصاري الأوسي" });',
  'CREATE (:Person { name: "الحارث بن مالك", slug: "al-harith-ibn-malik", fullName: "الحارث بن مالك بن كعب الأنصاري الأوسي" });',
  'CREATE (:Person { name: "مالك بن كعب", slug: "malik-ibn-kaab", fullName: "مالك بن كعب الأنصاري الأوسي" });',

  // Al-Baraa ibn Marur and his son Bishr ibn al-Baraa
  'CREATE (:Person { name: "معرور بن صخر", slug: "marur-ibn-sakhr", fullName: "معرور بن صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "صخر بن خنساء", slug: "sakhr-ibn-khansa", fullName: "صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "خنساء بن سنان", slug: "khansa-ibn-sinan", fullName: "خنساء بن سنان الأنصاري الخزرجي السلمي" });',

  // Saad ibn Ubadah
  'CREATE (:Person { name: "عبادة بن دليم", slug: "ubadah-ibn-dulaym", fullName: "عبادة بن دليم بن حارثة بن أبي حزيمة بن ثعلبة الأنصاري الخزرجي الساعدي" });',
  'CREATE (:Person { name: "دليم بن حارثة", slug: "dulaym-ibn-harithah", fullName: "دليم بن حارثة بن أبي حزيمة بن ثعلبة الأنصاري الخزرجي الساعدي" });',
  'CREATE (:Person { name: "حارثة بن أبي حزيمة", slug: "harithah-ibn-abi-huzaymah", fullName: "حارثة بن أبي حزيمة بن ثعلبة الأنصاري الخزرجي الساعدي" });',
  'CREATE (:Person { name: "أبو حزيمة بن ثعلبة", slug: "abi-huzaymah-ibn-thalabah", fullName: "أبو حزيمة بن ثعلبة الأنصاري الخزرجي الساعدي" });',

  // Saad ibn Muadh
  'CREATE (:Person { name: "معاذ بن النعمان", slug: "muadh-ibn-al-numan", fullName: "معاذ بن النعمان بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي" });',
  'CREATE (:Person { name: "النعمان بن امرئ القيس", slug: "al-numan-ibn-imri-al-qays", fullName: "النعمان بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي" });',
  'CREATE (:Person { name: "امرؤ القيس بن زيد", slug: "imru-al-qays-ibn-zayd", fullName: "امرؤ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي" });',
  'CREATE (:Person { name: "زيد بن عبد الأشهل", slug: "zayd-ibn-abd-al-ashhal", fullName: "زيد بن عبد الأشهل الأنصاري الأوسي" });',

  // Asad ibn Zurarah
  'CREATE (:Person { name: "زرارة بن عدس", slug: "zurarah-ibn-udas", fullName: "زرارة بن عدس بن عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "عدس بن عبيد", slug: "udas-ibn-ubayd", fullName: "عدس بن عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "عبيد بن ثعلبة", slug: "ubayd-ibn-thalabah", fullName: "عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "ثعلبة بن غنم", slug: "thalabah-ibn-ghanm", fullName: "ثعلبة بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "غنم بن مالك", slug: "ghanm-ibn-malik", fullName: "غنم بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "مالك بن النجار", slug: "malik-ibn-al-najjar", fullName: "مالك بن النجار الأنصاري الخزرجي النجاري" });',

  // Utbah ibn Ghazwan (ally of Banu Abd Shams, not blood Quraysh)
  'CREATE (:Person { name: "غزوان بن جابر", slug: "ghazwan-ibn-jabir", fullName: "غزوان بن جابر بن وهيب المازني حليف بني عبد شمس" });',
  'CREATE (:Person { name: "جابر بن وهيب", slug: "jabir-ibn-wuhayb", fullName: "جابر بن وهيب المازني حليف بني عبد شمس" });',

  // Thabit ibn Qais
  'CREATE (:Person { name: "قيس بن شماس", slug: "qais-ibn-shammas", fullName: "قيس بن شماس بن زهير بن مالك بن امرئ القيس بن مالك الأغر بن ثعلبة الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "شماس بن زهير", slug: "shammas-ibn-zuhayr", fullName: "شماس بن زهير بن مالك بن امرئ القيس بن مالك الأغر بن ثعلبة الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "زهير بن مالك", slug: "zuhayr-ibn-malik", fullName: "زهير بن مالك بن امرئ القيس بن مالك الأغر بن ثعلبة الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "مالك بن امرئ القيس", slug: "malik-ibn-imri-al-qays", fullName: "مالك بن امرئ القيس بن مالك الأغر بن ثعلبة الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "امرؤ القيس بن مالك الأغر", slug: "imru-al-qays-ibn-malik-al-aghar", fullName: "امرؤ القيس بن مالك الأغر بن ثعلبة الأنصاري الخزرجي" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Kulthum ibn al-Hidm
  'MATCH (from:Person {slug: "kulthum-ibn-al-hidm"}), (to:Person {slug: "al-hidm-ibn-imri-al-qays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-hidm-ibn-imri-al-qays"}), (to:Person {slug: "kulthum-ibn-al-hidm"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-hidm-ibn-imri-al-qays"}), (to:Person {slug: "imru-al-qays-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-al-harith"}), (to:Person {slug: "al-hidm-ibn-imri-al-qays"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "imru-al-qays-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-zayd"}), (to:Person {slug: "imru-al-qays-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Dujanah al-Ansari
  'MATCH (from:Person {slug: "abu-dujanah-al-ansari"}), (to:Person {slug: "khirashah-ibn-lawdhan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khirashah-ibn-lawdhan"}), (to:Person {slug: "abu-dujanah-al-ansari"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "khirashah-ibn-lawdhan"}), (to:Person {slug: "lawdhan-ibn-abd-wudd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "lawdhan-ibn-abd-wudd"}), (to:Person {slug: "khirashah-ibn-lawdhan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "lawdhan-ibn-abd-wudd"}), (to:Person {slug: "abd-wudd-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-wudd-ibn-zayd"}), (to:Person {slug: "lawdhan-ibn-abd-wudd"}) CREATE (from)-[:FATHER]->(to);',

  // Khubayb ibn Adi
  'MATCH (from:Person {slug: "khubayb-ibn-adi"}), (to:Person {slug: "adi-ibn-amir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "adi-ibn-amir"}), (to:Person {slug: "khubayb-ibn-adi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "adi-ibn-amir"}), (to:Person {slug: "amir-ibn-majdaah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-majdaah"}), (to:Person {slug: "adi-ibn-amir"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amir-ibn-majdaah"}), (to:Person {slug: "majdaah-ibn-jahjaba"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "majdaah-ibn-jahjaba"}), (to:Person {slug: "amir-ibn-majdaah"}) CREATE (from)-[:FATHER]->(to);',

  // Amr ibn al-Jumuh and his sons Mu'adh, Mu'awwidh, Khallad
  'MATCH (from:Person {slug: "amr-ibn-al-jumuh"}), (to:Person {slug: "al-jumuh-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-jumuh-ibn-zayd"}), (to:Person {slug: "amr-ibn-al-jumuh"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "muadh-ibn-amr-ibn-al-jumuh"}), (to:Person {slug: "amr-ibn-al-jumuh"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-jumuh"}), (to:Person {slug: "muadh-ibn-amr-ibn-al-jumuh"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "muawwidh-ibn-amr-ibn-al-jumuh"}), (to:Person {slug: "amr-ibn-al-jumuh"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-jumuh"}), (to:Person {slug: "muawwidh-ibn-amr-ibn-al-jumuh"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "khallad-ibn-amr-ibn-al-jumuh"}), (to:Person {slug: "amr-ibn-al-jumuh"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-jumuh"}), (to:Person {slug: "khallad-ibn-amr-ibn-al-jumuh"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-jumuh-ibn-zayd"}), (to:Person {slug: "zayd-ibn-haram-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-haram-ibn-kaab"}), (to:Person {slug: "al-jumuh-ibn-zayd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-ibn-haram-ibn-kaab"}), (to:Person {slug: "haram-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haram-ibn-kaab"}), (to:Person {slug: "zayd-ibn-haram-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "haram-ibn-kaab"}), (to:Person {slug: "kaab-ibn-ghanm"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-ghanm"}), (to:Person {slug: "haram-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "kaab-ibn-ghanm"}), (to:Person {slug: "ghanm-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghanm-ibn-kaab"}), (to:Person {slug: "kaab-ibn-ghanm"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ghanm-ibn-kaab"}), (to:Person {slug: "kaab-ibn-salamah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-salamah"}), (to:Person {slug: "ghanm-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',

  // Ubaydah ibn al-Harith
  'MATCH (from:Person {slug: "ubaydah-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-al-muttalib"}), (to:Person {slug: "ubaydah-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-harith-ibn-al-muttalib"}), (to:Person {slug: "al-muttalib-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-muttalib-ibn-abd-manaf"}), (to:Person {slug: "al-harith-ibn-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',

  // Rabiah ibn al-Harith and Abdullah ibn al-Harith ibn Abd al-Muttalib
  // (brothers, reuse the existing al-harith-ibn-abd-al-muttalib node from
  // graphSeedData4.ts — also father of nawfal-ibn-al-harith, saeed-ibn-al-
  // harith, abu-sufyan-ibn-al-harith there)
  'MATCH (from:Person {slug: "rabiah-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "rabiah-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abdullah-ibn-al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "abdullah-ibn-al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',

  // Khalid ibn Said, Aban ibn Said, Amr ibn Said al-Umawi
  'MATCH (from:Person {slug: "khalid-ibn-said"}), (to:Person {slug: "said-ibn-al-as"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "said-ibn-al-as"}), (to:Person {slug: "khalid-ibn-said"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "aban-ibn-said"}), (to:Person {slug: "said-ibn-al-as"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "said-ibn-al-as"}), (to:Person {slug: "aban-ibn-said"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-said-al-umawi"}), (to:Person {slug: "said-ibn-al-as"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "said-ibn-al-as"}), (to:Person {slug: "amr-ibn-said-al-umawi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "said-ibn-al-as"}), (to:Person {slug: "al-as-ibn-umayya"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-as-ibn-umayya"}), (to:Person {slug: "said-ibn-al-as"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-as-ibn-umayya"}), (to:Person {slug: "umayya-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umayya-ibn-abd-shams"}), (to:Person {slug: "al-as-ibn-umayya"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Ala ibn al-Hadrami
  'MATCH (from:Person {slug: "al-ala-ibn-al-hadrami"}), (to:Person {slug: "abdullah-ibn-imad-al-hadrami"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-imad-al-hadrami"}), (to:Person {slug: "al-ala-ibn-al-hadrami"}) CREATE (from)-[:FATHER]->(to);',

  // Saad ibn Khaythamah
  'MATCH (from:Person {slug: "saad-ibn-khaythamah"}), (to:Person {slug: "khaythamah-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khaythamah-ibn-al-harith"}), (to:Person {slug: "saad-ibn-khaythamah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "khaythamah-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-malik"}), (to:Person {slug: "khaythamah-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-harith-ibn-malik"}), (to:Person {slug: "malik-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-kaab"}), (to:Person {slug: "al-harith-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Baraa ibn Marur and his son Bishr ibn al-Baraa
  'MATCH (from:Person {slug: "al-baraa-ibn-marur"}), (to:Person {slug: "marur-ibn-sakhr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "marur-ibn-sakhr"}), (to:Person {slug: "al-baraa-ibn-marur"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "bishr-ibn-al-baraa"}), (to:Person {slug: "al-baraa-ibn-marur"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-baraa-ibn-marur"}), (to:Person {slug: "bishr-ibn-al-baraa"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "marur-ibn-sakhr"}), (to:Person {slug: "sakhr-ibn-khansa"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "sakhr-ibn-khansa"}), (to:Person {slug: "marur-ibn-sakhr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "sakhr-ibn-khansa"}), (to:Person {slug: "khansa-ibn-sinan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khansa-ibn-sinan"}), (to:Person {slug: "sakhr-ibn-khansa"}) CREATE (from)-[:FATHER]->(to);',

  // Saad ibn Ubadah
  'MATCH (from:Person {slug: "saad-ibn-ubadah"}), (to:Person {slug: "ubadah-ibn-dulaym"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ubadah-ibn-dulaym"}), (to:Person {slug: "saad-ibn-ubadah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ubadah-ibn-dulaym"}), (to:Person {slug: "dulaym-ibn-harithah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "dulaym-ibn-harithah"}), (to:Person {slug: "ubadah-ibn-dulaym"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "dulaym-ibn-harithah"}), (to:Person {slug: "harithah-ibn-abi-huzaymah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "harithah-ibn-abi-huzaymah"}), (to:Person {slug: "dulaym-ibn-harithah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "harithah-ibn-abi-huzaymah"}), (to:Person {slug: "abi-huzaymah-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abi-huzaymah-ibn-thalabah"}), (to:Person {slug: "harithah-ibn-abi-huzaymah"}) CREATE (from)-[:FATHER]->(to);',

  // Saad ibn Muadh
  'MATCH (from:Person {slug: "saad-ibn-muadh"}), (to:Person {slug: "muadh-ibn-al-numan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "muadh-ibn-al-numan"}), (to:Person {slug: "saad-ibn-muadh"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "muadh-ibn-al-numan"}), (to:Person {slug: "al-numan-ibn-imri-al-qays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-numan-ibn-imri-al-qays"}), (to:Person {slug: "muadh-ibn-al-numan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-numan-ibn-imri-al-qays"}), (to:Person {slug: "imru-al-qays-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-zayd"}), (to:Person {slug: "al-numan-ibn-imri-al-qays"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "imru-al-qays-ibn-zayd"}), (to:Person {slug: "zayd-ibn-abd-al-ashhal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-abd-al-ashhal"}), (to:Person {slug: "imru-al-qays-ibn-zayd"}) CREATE (from)-[:FATHER]->(to);',

  // Zaid ibn al-Khattab (full brother of Umar ibn al-Khattab — reuses the
  // existing al-khattab-ibn-nufayl node and chain from graphSeedData2.ts)
  'MATCH (from:Person {slug: "zaid-ibn-al-khattab"}), (to:Person {slug: "al-khattab-ibn-nufayl"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-khattab-ibn-nufayl"}), (to:Person {slug: "zaid-ibn-al-khattab"}) CREATE (from)-[:FATHER]->(to);',

  // Asad ibn Zurarah
  'MATCH (from:Person {slug: "asad-ibn-zurarah"}), (to:Person {slug: "zurarah-ibn-udas"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zurarah-ibn-udas"}), (to:Person {slug: "asad-ibn-zurarah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zurarah-ibn-udas"}), (to:Person {slug: "udas-ibn-ubayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "udas-ibn-ubayd"}), (to:Person {slug: "zurarah-ibn-udas"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "udas-ibn-ubayd"}), (to:Person {slug: "ubayd-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ubayd-ibn-thalabah"}), (to:Person {slug: "udas-ibn-ubayd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ubayd-ibn-thalabah"}), (to:Person {slug: "thalabah-ibn-ghanm"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thalabah-ibn-ghanm"}), (to:Person {slug: "ubayd-ibn-thalabah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "thalabah-ibn-ghanm"}), (to:Person {slug: "ghanm-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghanm-ibn-malik"}), (to:Person {slug: "thalabah-ibn-ghanm"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ghanm-ibn-malik"}), (to:Person {slug: "malik-ibn-al-najjar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-al-najjar"}), (to:Person {slug: "ghanm-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  // Utbah ibn Ghazwan
  'MATCH (from:Person {slug: "utbah-ibn-ghazwan"}), (to:Person {slug: "ghazwan-ibn-jabir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghazwan-ibn-jabir"}), (to:Person {slug: "utbah-ibn-ghazwan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ghazwan-ibn-jabir"}), (to:Person {slug: "jabir-ibn-wuhayb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "jabir-ibn-wuhayb"}), (to:Person {slug: "ghazwan-ibn-jabir"}) CREATE (from)-[:FATHER]->(to);',

  // Thabit ibn Qais
  'MATCH (from:Person {slug: "thabit-ibn-qais"}), (to:Person {slug: "qais-ibn-shammas"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-shammas"}), (to:Person {slug: "thabit-ibn-qais"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "qais-ibn-shammas"}), (to:Person {slug: "shammas-ibn-zuhayr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "shammas-ibn-zuhayr"}), (to:Person {slug: "qais-ibn-shammas"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "shammas-ibn-zuhayr"}), (to:Person {slug: "zuhayr-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zuhayr-ibn-malik"}), (to:Person {slug: "shammas-ibn-zuhayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zuhayr-ibn-malik"}), (to:Person {slug: "malik-ibn-imri-al-qays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-imri-al-qays"}), (to:Person {slug: "zuhayr-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-imri-al-qays"}), (to:Person {slug: "imru-al-qays-ibn-malik-al-aghar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-malik-al-aghar"}), (to:Person {slug: "malik-ibn-imri-al-qays"}) CREATE (from)-[:FATHER]->(to);',
];
