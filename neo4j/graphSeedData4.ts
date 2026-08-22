/**
 * Ancestor chains sourced from "سير أعلام النبلاء" (al-Dhahabi) for batch 2 of
 * newly added companions (prisma/personSeedData5.ts): iyas-ibn-al-bukayr,
 * amir-ibn-al-bukayr, mistah-ibn-uthathah, abu-abs,
 * abu-al-haytham-ibn-at-tayyihan, abu-jandal, abdullah-ibn-suhail,
 * suhail-ibn-amr, al-baraa-ibn-malik, nawfal-ibn-al-harith,
 * al-harith-ibn-nawfal, abdullah-ibn-al-harith-ibn-nawfal, saeed-ibn-al-harith,
 * abu-sufyan-ibn-al-harith, jaafar-ibn-abi-sufyan-al-hashimi,
 * jaafar-ibn-abi-talib, aqil-ibn-abi-talib, zaid-ibn-harithah,
 * abdullah-ibn-rawahah.
 *
 * Chains stop as soon as they reach a slug that already exists elsewhere in
 * the graph (graphSeedData.ts / graphSeedData2.ts / graphSeedData3.ts), e.g.
 * al-bukayr-ibn-abd-yalil, abd-manaf-ibn-qusay, luay-ibn-ghalib,
 * abd-al-muttalib-ibn-hashim, abu-talib.
 *
 * Two same-name collisions are disambiguated by father, following the
 * existing convention (see e.g. hashim-ibn-abd-manaf-al-abdari):
 *   - "مالك بن النضر" here is an unrelated Ansari (Banu al-Najjar) figure,
 *     the father of al-Baraa ibn Malik and Anas ibn Malik — distinct from
 *     the existing Quraysh ancestor slug "malik-ibn-an-nadr", so this one is
 *     "malik-ibn-an-nadr-al-najjari".
 *   - "امرؤ القيس" occurs in both the (Kalbi) Zaid ibn Harithah chain and the
 *     (Khazraji) Abdullah ibn Rawahah chain; slugs are disambiguated by
 *     father as usual ("imru-al-qays-ibn-amir" vs "imru-al-qays-ibn-thalabah")
 *     so no explicit suffix was needed.
 *
 * Ordering note: the batch-2 companions themselves are not created here —
 * their Person nodes come from `npm run people:sync -- --apply` picking up
 * the PostgreSQL profiles in prisma/personSeedData5.ts. Run that sync before
 * `npm run seed:graph`, or the MATCH clauses linking them to their ancestors
 * below will silently find nothing to attach to.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Mistah ibn Uthathah
  'CREATE (:Person { name: "أثاثة بن عباد", slug: "uthathah-ibn-abbad", fullName: "أثاثة بن عباد بن المطلب بن عبد مناف بن قصي المطلبي" });',
  'CREATE (:Person { name: "عباد بن المطلب", slug: "abbad-ibn-al-muttalib", fullName: "عباد بن المطلب بن عبد مناف بن قصي المطلبي" });',
  'CREATE (:Person { name: "المطلب بن عبد مناف", slug: "al-muttalib-ibn-abd-manaf", fullName: "المطلب بن عبد مناف بن قصي القرشي" });',

  // Abu Abs
  'CREATE (:Person { name: "جبر بن عمرو", slug: "jabr-ibn-amr", fullName: "جبر بن عمرو بن زيد بن جشم بن حارثة بن الحارث الأنصاري الأوسي" });',
  'CREATE (:Person { name: "عمرو بن زيد", slug: "amr-ibn-zayd", fullName: "عمرو بن زيد بن جشم بن حارثة بن الحارث الأنصاري الأوسي" });',
  'CREATE (:Person { name: "زيد بن جشم", slug: "zayd-ibn-jusham", fullName: "زيد بن جشم بن حارثة بن الحارث الأنصاري الأوسي" });',
  'CREATE (:Person { name: "جشم بن حارثة", slug: "jusham-ibn-haritha", fullName: "جشم بن حارثة بن الحارث الأنصاري الأوسي" });',
  'CREATE (:Person { name: "حارثة بن الحارث", slug: "haritha-ibn-al-harith", fullName: "حارثة بن الحارث الأنصاري الأوسي" });',

  // Abu al-Haytham ibn at-Tayyihan
  'CREATE (:Person { name: "التيهان بن بلي", slug: "at-tayyihan-ibn-bali", fullName: "التيهان بن بلي بن عمرو بن الحاف بن قضاعة" });',
  'CREATE (:Person { name: "بلي بن عمرو", slug: "bali-ibn-amr", fullName: "بلي بن عمرو بن الحاف بن قضاعة" });',
  'CREATE (:Person { name: "عمرو بن الحاف", slug: "amr-ibn-al-haf", fullName: "عمرو بن الحاف بن قضاعة" });',
  'CREATE (:Person { name: "الحاف بن قضاعة", slug: "al-haf-ibn-qudaah", fullName: "الحاف بن قضاعة" });',

  // Suhail ibn Amr (father of Abu Jandal and Abdullah ibn Suhail)
  'CREATE (:Person { name: "عمرو بن عبد شمس", slug: "amr-ibn-abd-shams", fullName: "عمرو بن عبد شمس بن عبد ود بن نصر بن حسل بن عامر بن لؤي القرشي العامري" });',
  'CREATE (:Person { name: "عبد شمس بن عبد ود", slug: "abd-shams-ibn-abd-wud", fullName: "عبد شمس بن عبد ود بن نصر بن حسل بن عامر بن لؤي القرشي العامري" });',
  'CREATE (:Person { name: "عبد ود بن نصر", slug: "abd-wud-ibn-nasr", fullName: "عبد ود بن نصر بن حسل بن عامر بن لؤي القرشي العامري" });',
  'CREATE (:Person { name: "نصر بن حسل", slug: "nasr-ibn-hasl", fullName: "نصر بن حسل بن عامر بن لؤي القرشي العامري" });',
  'CREATE (:Person { name: "حسل بن عامر", slug: "hasl-ibn-amir", fullName: "حسل بن عامر بن لؤي القرشي العامري" });',
  'CREATE (:Person { name: "عامر بن لؤي", slug: "amir-ibn-luay", fullName: "عامر بن لؤي بن غالب القرشي" });',

  // Al-Baraa ibn Malik (brother of Anas ibn Malik)
  'CREATE (:Person { name: "مالك بن النضر", slug: "malik-ibn-an-nadr-al-najjari", fullName: "مالك بن النضر بن ضمضم بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "النضر بن ضمضم", slug: "an-nadr-ibn-damdam", fullName: "النضر بن ضمضم بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "ضمضم بن زيد", slug: "damdam-ibn-zayd", fullName: "ضمضم بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "زيد بن حرام", slug: "zayd-ibn-haram", fullName: "زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "حرام بن جندب", slug: "haram-ibn-jundub", fullName: "حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "جندب بن عامر", slug: "jundub-ibn-amir", fullName: "جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "عامر بن غنم", slug: "amir-ibn-ghanm", fullName: "عامر بن غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "غنم بن عدي", slug: "ghanm-ibn-adi", fullName: "غنم بن عدي بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "عدي بن النجار", slug: "adi-ibn-al-najjar", fullName: "عدي بن النجار الأنصاري النجاري" });',

  // Nawfal ibn al-Harith branch (Banu Hashim, cousins of the Prophet):
  // nawfal-ibn-al-harith, al-harith-ibn-nawfal, abdullah-ibn-al-harith-ibn-nawfal,
  // saeed-ibn-al-harith, abu-sufyan-ibn-al-harith and
  // jaafar-ibn-abi-sufyan-al-hashimi (in personSeedData5.ts) all share this
  // one new ancestor node below them.
  'CREATE (:Person { name: "الحارث بن عبد المطلب", slug: "al-harith-ibn-abd-al-muttalib", fullName: "الحارث بن عبد المطلب بن هاشم القرشي الهاشمي" });',

  // Zaid ibn Harithah
  'CREATE (:Person { name: "شراحيل بن كعب", slug: "sharahil-ibn-kaab", fullName: "شراحيل بن كعب بن عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي" });',
  'CREATE (:Person { name: "كعب بن عبد العزى", slug: "kaab-ibn-abd-al-uzza", fullName: "كعب بن عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي" });',
  'CREATE (:Person { name: "عبد العزى بن يزيد", slug: "abd-al-uzza-ibn-yazid", fullName: "عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي" });',
  'CREATE (:Person { name: "يزيد بن امرئ القيس", slug: "yazid-ibn-imri-al-qays", fullName: "يزيد بن امرئ القيس بن عامر بن النعمان الكلبي" });',
  'CREATE (:Person { name: "امرؤ القيس بن عامر", slug: "imru-al-qays-ibn-amir", fullName: "امرؤ القيس بن عامر بن النعمان الكلبي" });',
  'CREATE (:Person { name: "عامر بن النعمان", slug: "amir-ibn-al-numan", fullName: "عامر بن النعمان الكلبي" });',

  // Abdullah ibn Rawahah
  'CREATE (:Person { name: "رواحة بن ثعلبة", slug: "rawahah-ibn-thalabah", fullName: "رواحة بن ثعلبة بن امرئ القيس بن ثعلبة الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "ثعلبة بن امرئ القيس", slug: "thalabah-ibn-imri-al-qays", fullName: "ثعلبة بن امرئ القيس بن ثعلبة الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "امرؤ القيس بن ثعلبة", slug: "imru-al-qays-ibn-thalabah", fullName: "امرؤ القيس بن ثعلبة الأنصاري الخزرجي" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Iyas ibn Abi al-Bukayr and Amir ibn Abi al-Bukayr (brothers of
  // aqil-ibn-al-bukayr / khalid-ibn-al-bukayr from batch 1 — father already
  // exists as al-bukayr-ibn-abd-yalil). Their own pages give no nasab chain
  // at all; this link is inferred from book placement (grouped immediately
  // after Aqil/Khalid, the book's usual pattern for sibling groups), not
  // quoted from page text — see the matching note in personSeedData5.ts.
  'MATCH (from:Person {slug: "iyas-ibn-al-bukayr"}), (to:Person {slug: "al-bukayr-ibn-abd-yalil"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-bukayr-ibn-abd-yalil"}), (to:Person {slug: "iyas-ibn-al-bukayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amir-ibn-al-bukayr"}), (to:Person {slug: "al-bukayr-ibn-abd-yalil"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-bukayr-ibn-abd-yalil"}), (to:Person {slug: "amir-ibn-al-bukayr"}) CREATE (from)-[:FATHER]->(to);',

  // Mistah ibn Uthathah
  'MATCH (from:Person {slug: "mistah-ibn-uthathah"}), (to:Person {slug: "uthathah-ibn-abbad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uthathah-ibn-abbad"}), (to:Person {slug: "mistah-ibn-uthathah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "uthathah-ibn-abbad"}), (to:Person {slug: "abbad-ibn-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abbad-ibn-al-muttalib"}), (to:Person {slug: "uthathah-ibn-abbad"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abbad-ibn-al-muttalib"}), (to:Person {slug: "al-muttalib-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-muttalib-ibn-abd-manaf"}), (to:Person {slug: "abbad-ibn-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-muttalib-ibn-abd-manaf"}), (to:Person {slug: "abd-manaf-ibn-qusay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-qusay"}), (to:Person {slug: "al-muttalib-ibn-abd-manaf"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Abs
  'MATCH (from:Person {slug: "abu-abs"}), (to:Person {slug: "jabr-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "jabr-ibn-amr"}), (to:Person {slug: "abu-abs"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "jabr-ibn-amr"}), (to:Person {slug: "amr-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-zayd"}), (to:Person {slug: "jabr-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-zayd"}), (to:Person {slug: "zayd-ibn-jusham"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-jusham"}), (to:Person {slug: "amr-ibn-zayd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-ibn-jusham"}), (to:Person {slug: "jusham-ibn-haritha"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "jusham-ibn-haritha"}), (to:Person {slug: "zayd-ibn-jusham"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "jusham-ibn-haritha"}), (to:Person {slug: "haritha-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haritha-ibn-al-harith"}), (to:Person {slug: "jusham-ibn-haritha"}) CREATE (from)-[:FATHER]->(to);',

  // Abu al-Haytham ibn at-Tayyihan
  'MATCH (from:Person {slug: "abu-al-haytham-ibn-at-tayyihan"}), (to:Person {slug: "at-tayyihan-ibn-bali"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "at-tayyihan-ibn-bali"}), (to:Person {slug: "abu-al-haytham-ibn-at-tayyihan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "at-tayyihan-ibn-bali"}), (to:Person {slug: "bali-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "bali-ibn-amr"}), (to:Person {slug: "at-tayyihan-ibn-bali"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "bali-ibn-amr"}), (to:Person {slug: "amr-ibn-al-haf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-haf"}), (to:Person {slug: "bali-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-al-haf"}), (to:Person {slug: "al-haf-ibn-qudaah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-haf-ibn-qudaah"}), (to:Person {slug: "amr-ibn-al-haf"}) CREATE (from)-[:FATHER]->(to);',

  // Suhail ibn Amr, and his sons Abu Jandal and Abdullah ibn Suhail
  'MATCH (from:Person {slug: "abu-jandal"}), (to:Person {slug: "suhail-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "suhail-ibn-amr"}), (to:Person {slug: "abu-jandal"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abdullah-ibn-suhail"}), (to:Person {slug: "suhail-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "suhail-ibn-amr"}), (to:Person {slug: "abdullah-ibn-suhail"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "suhail-ibn-amr"}), (to:Person {slug: "amr-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-abd-shams"}), (to:Person {slug: "suhail-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-abd-shams"}), (to:Person {slug: "abd-shams-ibn-abd-wud"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-shams-ibn-abd-wud"}), (to:Person {slug: "amr-ibn-abd-shams"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-shams-ibn-abd-wud"}), (to:Person {slug: "abd-wud-ibn-nasr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-wud-ibn-nasr"}), (to:Person {slug: "abd-shams-ibn-abd-wud"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-wud-ibn-nasr"}), (to:Person {slug: "nasr-ibn-hasl"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nasr-ibn-hasl"}), (to:Person {slug: "abd-wud-ibn-nasr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "nasr-ibn-hasl"}), (to:Person {slug: "hasl-ibn-amir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hasl-ibn-amir"}), (to:Person {slug: "nasr-ibn-hasl"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hasl-ibn-amir"}), (to:Person {slug: "amir-ibn-luay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-luay"}), (to:Person {slug: "hasl-ibn-amir"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amir-ibn-luay"}), (to:Person {slug: "luay-ibn-ghalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "luay-ibn-ghalib"}), (to:Person {slug: "amir-ibn-luay"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Baraa ibn Malik
  'MATCH (from:Person {slug: "al-baraa-ibn-malik"}), (to:Person {slug: "malik-ibn-an-nadr-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-an-nadr-al-najjari"}), (to:Person {slug: "al-baraa-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-an-nadr-al-najjari"}), (to:Person {slug: "an-nadr-ibn-damdam"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "an-nadr-ibn-damdam"}), (to:Person {slug: "malik-ibn-an-nadr-al-najjari"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "an-nadr-ibn-damdam"}), (to:Person {slug: "damdam-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "damdam-ibn-zayd"}), (to:Person {slug: "an-nadr-ibn-damdam"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "damdam-ibn-zayd"}), (to:Person {slug: "zayd-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-haram"}), (to:Person {slug: "damdam-ibn-zayd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-ibn-haram"}), (to:Person {slug: "haram-ibn-jundub"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haram-ibn-jundub"}), (to:Person {slug: "zayd-ibn-haram"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "haram-ibn-jundub"}), (to:Person {slug: "jundub-ibn-amir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "jundub-ibn-amir"}), (to:Person {slug: "haram-ibn-jundub"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "jundub-ibn-amir"}), (to:Person {slug: "amir-ibn-ghanm"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-ghanm"}), (to:Person {slug: "jundub-ibn-amir"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amir-ibn-ghanm"}), (to:Person {slug: "ghanm-ibn-adi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghanm-ibn-adi"}), (to:Person {slug: "amir-ibn-ghanm"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ghanm-ibn-adi"}), (to:Person {slug: "adi-ibn-al-najjar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "adi-ibn-al-najjar"}), (to:Person {slug: "ghanm-ibn-adi"}) CREATE (from)-[:FATHER]->(to);',

  // Nawfal ibn al-Harith, al-Harith ibn Nawfal, Abdullah ibn al-Harith ibn
  // Nawfal (Babbah)
  'MATCH (from:Person {slug: "nawfal-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "nawfal-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-harith-ibn-nawfal"}), (to:Person {slug: "nawfal-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nawfal-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-nawfal"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abdullah-ibn-al-harith-ibn-nawfal"}), (to:Person {slug: "al-harith-ibn-nawfal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-nawfal"}), (to:Person {slug: "abdullah-ibn-al-harith-ibn-nawfal"}) CREATE (from)-[:FATHER]->(to);',

  // Saeed ibn al-Harith, Abu Sufyan ibn al-Harith (and his son Jaafar) —
  // brothers/nephew of Nawfal, same father al-harith-ibn-abd-al-muttalib
  'MATCH (from:Person {slug: "saeed-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "saeed-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abu-sufyan-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "abu-sufyan-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "jaafar-ibn-abi-sufyan-al-hashimi"}), (to:Person {slug: "abu-sufyan-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-sufyan-ibn-al-harith"}), (to:Person {slug: "jaafar-ibn-abi-sufyan-al-hashimi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-harith-ibn-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "al-harith-ibn-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',

  // Jaafar ibn Abi Talib and Aqil ibn Abi Talib (brothers of Ali; father
  // already exists as abu-talib)
  'MATCH (from:Person {slug: "jaafar-ibn-abi-talib"}), (to:Person {slug: "abu-talib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-talib"}), (to:Person {slug: "jaafar-ibn-abi-talib"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "aqil-ibn-abi-talib"}), (to:Person {slug: "abu-talib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-talib"}), (to:Person {slug: "aqil-ibn-abi-talib"}) CREATE (from)-[:FATHER]->(to);',

  // Zaid ibn Harithah (Kalbi, unrelated to the Quraysh/Ansari trees above)
  'MATCH (from:Person {slug: "zaid-ibn-harithah"}), (to:Person {slug: "sharahil-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "sharahil-ibn-kaab"}), (to:Person {slug: "zaid-ibn-harithah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "sharahil-ibn-kaab"}), (to:Person {slug: "kaab-ibn-abd-al-uzza"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-abd-al-uzza"}), (to:Person {slug: "sharahil-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "kaab-ibn-abd-al-uzza"}), (to:Person {slug: "abd-al-uzza-ibn-yazid"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-uzza-ibn-yazid"}), (to:Person {slug: "kaab-ibn-abd-al-uzza"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-al-uzza-ibn-yazid"}), (to:Person {slug: "yazid-ibn-imri-al-qays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "yazid-ibn-imri-al-qays"}), (to:Person {slug: "abd-al-uzza-ibn-yazid"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "yazid-ibn-imri-al-qays"}), (to:Person {slug: "imru-al-qays-ibn-amir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-amir"}), (to:Person {slug: "yazid-ibn-imri-al-qays"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "imru-al-qays-ibn-amir"}), (to:Person {slug: "amir-ibn-al-numan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-al-numan"}), (to:Person {slug: "imru-al-qays-ibn-amir"}) CREATE (from)-[:FATHER]->(to);',

  // Abdullah ibn Rawahah (Khazraji)
  'MATCH (from:Person {slug: "abdullah-ibn-rawahah"}), (to:Person {slug: "rawahah-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "rawahah-ibn-thalabah"}), (to:Person {slug: "abdullah-ibn-rawahah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "rawahah-ibn-thalabah"}), (to:Person {slug: "thalabah-ibn-imri-al-qays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thalabah-ibn-imri-al-qays"}), (to:Person {slug: "rawahah-ibn-thalabah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "thalabah-ibn-imri-al-qays"}), (to:Person {slug: "imru-al-qays-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-thalabah"}), (to:Person {slug: "thalabah-ibn-imri-al-qays"}) CREATE (from)-[:FATHER]->(to);',
];
