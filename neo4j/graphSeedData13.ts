/**
 * Ancestor chains and family relations sourced from "سير أعلام النبلاء"
 * (al-Dhahabi) for batch 11 of newly added companions (prisma/personSeedData14.ts):
 * abu-bakrah-al-thaqafi, uthman-ibn-talhah, shaybah-ibn-uthman,
 * abu-rifaah-al-adawi, thawban-al-nabawi, abdullah-ibn-amir,
 * al-mughirah-ibn-shubah, abdullah-ibn-saad-ibn-abi-sarh, ruwayfi-ibn-thabit,
 * muawiyah-ibn-hudayj, abu-barzah-al-aslami, hakim-ibn-hizam,
 * hisham-ibn-hakim, kaab-ibn-ujrah, amr-ibn-al-as, hisham-ibn-al-as,
 * abdullah-ibn-amr-ibn-al-as, jubair-ibn-mutim, yala-ibn-umayyah,
 * qais-ibn-saad, abd-al-muttalib-ibn-rabiah.
 *
 * This batch is unusually rich in ancestor-chain reuse:
 *   - uthman-ibn-talhah and shaybah-ibn-uthman's shared paternal-grandfather
 *     chain reaches the existing abd-al-dar-ibn-qusay node (graphSeedData3.ts)
 *     via three new nodes; their fathers Talhah and the elder Uthman
 *     "al-Hijabi" are modelled as brothers (both sons of the new shared
 *     node for "Abu Talhah"/Abdullah ibn Abd al-Uzza), making the two
 *     companions paternal cousins, per Uthman ibn Talhah's own page.
 *   - abdullah-ibn-amir's father Amir ibn Kurayz (new node) is a full
 *     brother of the existing Arwa bint Kurayz (Uthman ibn Affan's
 *     mother) and son of the existing Al-Bayda bint Abd al-Muttalib —
 *     making him, and by extension Abdullah ibn Amir, related to the
 *     existing Uthman ibn Affan exactly as Abdullah ibn Amir's own page
 *     states ("ibn khal Uthman").
 *   - hakim-ibn-hizam's father Hizam (new node) is a full brother of the
 *     existing Khadijah bint Khuwaylid and the existing Al-Awwam ibn
 *     Khuwaylid, per Hakim's own page ("Khadijah was his paternal aunt,
 *     Al-Zubayr his paternal cousin").
 *   - amr-ibn-al-as's paternal chain (per his son Abdullah's own page,
 *     content-id 285) reaches the existing amr-ibn-husays node
 *     (graphSeedData3.ts) via six new nodes — a different son of that node
 *     from the one already modelled (jumah-ibn-amr, graphSeedData3.ts).
 *   - hisham-ibn-al-as's mother Umm Harmalah (new node) is a sister of the
 *     existing Abu Jahl, per his own page.
 *   - jubair-ibn-mutim's paternal chain reaches the existing
 *     abd-manaf-ibn-qusay node (graphSeedData2.ts) via three new nodes.
 *   - yala-ibn-umayyah's mother Munyah (new node) is a full sister of the
 *     existing Utbah ibn Ghazwan, per his own page.
 *   - qais-ibn-saad and abd-al-muttalib-ibn-rabiah connect directly to
 *     existing companion nodes (Saad ibn Ubadah and Rabiah ibn al-Harith
 *     respectively) with no new ancestor node needed at all — their own
 *     nasab chains match those existing companions' fullNames exactly.
 *
 * Content-id 287 ("عقيل بن أبي طالب الهاشمي") already has a Person node
 * from an earlier batch (aqil-ibn-abi-talib) — his page here adds two new
 * facts (older than Ali by 20 years, older than Jafar by 10), modelled as
 * BROTHER relations to the existing ali-ibn-abi-talib and
 * jaafar-ibn-abi-talib nodes, no new Person node.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Uthman ibn Talhah / Shaybah ibn Uthman's shared paternal-grandfather chain
  'CREATE (:Person { name: "عثمان بن عبد الدار", slug: "uthman-ibn-abd-al-dar", fullName: "عثمان بن عبد الدار بن قصي القرشي العبدري" });',
  'CREATE (:Person { name: "عبد الله بن عبد العزى", slug: "abdullah-ibn-abd-al-uzza-abu-talhah", fullName: "عبد الله بن عبد العزى بن عثمان بن عبد الدار القرشي العبدري، ويكنى أبا طلحة" });',
  'CREATE (:Person { name: "طلحة بن عبد الله", slug: "talhah-ibn-abdullah-ibn-abd-al-uzza", fullName: "طلحة بن عبد الله بن عبد العزى القرشي العبدري" });',
  'CREATE (:Person { name: "عثمان بن عبد الله", slug: "uthman-al-hijabi-ibn-abdullah", fullName: "عثمان بن عبد الله بن عبد العزى القرشي العبدري" });',

  // Abdullah ibn Amir's paternal chain down to the existing abd-shams-ibn-abd-manaf
  'CREATE (:Person { name: "حبيب بن عبد شمس", slug: "habib-ibn-abd-shams", fullName: "حبيب بن عبد شمس بن عبد مناف القرشي العبشمي" });',
  'CREATE (:Person { name: "ربيعة بن حبيب", slug: "rabiah-ibn-habib-al-abshami", fullName: "ربيعة بن حبيب بن عبد شمس القرشي العبشمي" });',
  'CREATE (:Person { name: "كريز بن ربيعة", slug: "kurayz-ibn-rabiah", fullName: "كريز بن ربيعة بن حبيب بن عبد شمس القرشي العبشمي" });',
  'CREATE (:Person { name: "عامر بن كريز", slug: "amir-ibn-kurayz", fullName: "عامر بن كريز بن ربيعة القرشي العبشمي" });',

  // Hakim ibn Hizam's father
  'CREATE (:Person { name: "حزام بن خويلد", slug: "hizam-ibn-khuwaylid", fullName: "حزام بن خويلد بن أسد بن عبد العزى القرشي الأسدي" });',

  // Amr ibn al-As's paternal chain down to the existing amr-ibn-husays
  'CREATE (:Person { name: "سهم بن عمرو", slug: "sahm-ibn-amr", fullName: "سهم بن عمرو بن هصيص بن كعب القرشي السهمي" });',
  'CREATE (:Person { name: "سعد بن سهم", slug: "saad-ibn-sahm", fullName: "سعد بن سهم بن عمرو القرشي السهمي" });',
  'CREATE (:Person { name: "سعيد بن سعد", slug: "said-ibn-saad-al-sahmi", fullName: "سعيد بن سعد بن سهم القرشي السهمي" });',
  'CREATE (:Person { name: "هاشم بن سعيد", slug: "hashim-ibn-said-al-sahmi", fullName: "هاشم بن سعيد بن سعد القرشي السهمي" });',
  'CREATE (:Person { name: "وائل بن هاشم", slug: "wail-ibn-hashim-al-sahmi", fullName: "وائل بن هاشم بن سعيد القرشي السهمي" });',
  'CREATE (:Person { name: "العاص بن وائل", slug: "al-as-ibn-wail-al-sahmi", fullName: "العاص بن وائل بن هاشم القرشي السهمي" });',

  // Amr ibn al-As's wife, mother of Abdullah ibn Amr ibn al-As
  'CREATE (:Person { name: "رائطة بنت الحجاج", slug: "raitah-bint-al-hajjaj", fullName: "رائطة بنت الحجاج بن منبه السهمية" });',

  // Hisham ibn al-As's mother, sister of the existing Abu Jahl
  'CREATE (:Person { name: "أم حرملة المخزومية", slug: "umm-harmalah-al-makhzumiyyah", fullName: "أم حرملة المخزومية" });',

  // Jubair ibn Mutim's paternal chain down to the existing abd-manaf-ibn-qusay
  'CREATE (:Person { name: "المطعم بن عدي", slug: "mutim-ibn-adi", fullName: "المطعم بن عدي بن نوفل بن عبد مناف القرشي النوفلي" });',
  'CREATE (:Person { name: "عدي بن نوفل", slug: "adi-ibn-nawfal", fullName: "عدي بن نوفل بن عبد مناف القرشي النوفلي" });',
  'CREATE (:Person { name: "نوفل بن عبد مناف", slug: "nawfal-ibn-abd-manaf", fullName: "نوفل بن عبد مناف بن قصي القرشي" });',

  // Ya'la ibn Umayyah's mother, sister of the existing Utbah ibn Ghazwan
  'CREATE (:Person { name: "منية بنت غزوان", slug: "munyah-bint-ghazwan", fullName: "منية بنت غزوان بن جابر المازنية" });',
];

/**
 * An array of Cypher queries to create all relationships between people.
 * Each item in the array is a single MATCH/CREATE query.
 */
export const peopleRelationsQueries = [
  // Uthman ibn Talhah / Shaybah ibn Uthman's shared paternal-grandfather chain
  'MATCH (from:Person {slug: "uthman-ibn-abd-al-dar"}), (to:Person {slug: "abd-al-dar-ibn-qusay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-dar-ibn-qusay"}), (to:Person {slug: "uthman-ibn-abd-al-dar"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-abd-al-uzza-abu-talhah"}), (to:Person {slug: "uthman-ibn-abd-al-dar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-abd-al-dar"}), (to:Person {slug: "abdullah-ibn-abd-al-uzza-abu-talhah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "talhah-ibn-abdullah-ibn-abd-al-uzza"}), (to:Person {slug: "abdullah-ibn-abd-al-uzza-abu-talhah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-abd-al-uzza-abu-talhah"}), (to:Person {slug: "talhah-ibn-abdullah-ibn-abd-al-uzza"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "uthman-al-hijabi-ibn-abdullah"}), (to:Person {slug: "abdullah-ibn-abd-al-uzza-abu-talhah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-abd-al-uzza-abu-talhah"}), (to:Person {slug: "uthman-al-hijabi-ibn-abdullah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-talhah"}), (to:Person {slug: "talhah-ibn-abdullah-ibn-abd-al-uzza"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "talhah-ibn-abdullah-ibn-abd-al-uzza"}), (to:Person {slug: "uthman-ibn-talhah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "shaybah-ibn-uthman"}), (to:Person {slug: "uthman-al-hijabi-ibn-abdullah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uthman-al-hijabi-ibn-abdullah"}), (to:Person {slug: "shaybah-ibn-uthman"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-talhah"}), (to:Person {slug: "shaybah-ibn-uthman"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',
  'MATCH (from:Person {slug: "shaybah-ibn-uthman"}), (to:Person {slug: "uthman-ibn-talhah"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',
  'MATCH (from:Person {slug: "musab-ibn-umayr"}), (to:Person {slug: "shaybah-ibn-uthman"}) CREATE (from)-[:MATERNAL_UNCLE]->(to);',
  'MATCH (from:Person {slug: "shaybah-ibn-uthman"}), (to:Person {slug: "musab-ibn-umayr"}) CREATE (from)-[:MATERNAL_NEPHEW]->(to);',

  // Abdullah ibn Amir's paternal side
  'MATCH (from:Person {slug: "amir-ibn-kurayz"}), (to:Person {slug: "kurayz-ibn-rabiah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kurayz-ibn-rabiah"}), (to:Person {slug: "amir-ibn-kurayz"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kurayz-ibn-rabiah"}), (to:Person {slug: "habib-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "habib-ibn-abd-shams"}), (to:Person {slug: "kurayz-ibn-rabiah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kurayz-ibn-rabiah"}), (to:Person {slug: "rabiah-ibn-habib-al-abshami"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "rabiah-ibn-habib-al-abshami"}), (to:Person {slug: "kurayz-ibn-rabiah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "rabiah-ibn-habib-al-abshami"}), (to:Person {slug: "habib-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "habib-ibn-abd-shams"}), (to:Person {slug: "rabiah-ibn-habib-al-abshami"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "habib-ibn-abd-shams"}), (to:Person {slug: "abd-shams-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-shams-ibn-abd-manaf"}), (to:Person {slug: "habib-ibn-abd-shams"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kurayz-ibn-rabiah"}), (to:Person {slug: "al-bayda-bint-abd-al-muttalib"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "al-bayda-bint-abd-al-muttalib"}), (to:Person {slug: "kurayz-ibn-rabiah"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "arwa-bint-kurayz"}), (to:Person {slug: "kurayz-ibn-rabiah"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "kurayz-ibn-rabiah"}), (to:Person {slug: "arwa-bint-kurayz"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-kurayz"}), (to:Person {slug: "al-bayda-bint-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-bayda-bint-abd-al-muttalib"}), (to:Person {slug: "amir-ibn-kurayz"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-kurayz"}), (to:Person {slug: "arwa-bint-kurayz"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "arwa-bint-kurayz"}), (to:Person {slug: "amir-ibn-kurayz"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-amir"}), (to:Person {slug: "amir-ibn-kurayz"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-kurayz"}), (to:Person {slug: "abdullah-ibn-amir"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-kurayz"}), (to:Person {slug: "uthman-ibn-affan"}) CREATE (from)-[:MATERNAL_UNCLE]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-affan"}), (to:Person {slug: "amir-ibn-kurayz"}) CREATE (from)-[:MATERNAL_NEPHEW]->(to);',

  // Hakim ibn Hizam / Hisham ibn Hakim's paternal side
  'MATCH (from:Person {slug: "hizam-ibn-khuwaylid"}), (to:Person {slug: "khuwaylid-ibn-asad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khuwaylid-ibn-asad"}), (to:Person {slug: "hizam-ibn-khuwaylid"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hizam-ibn-khuwaylid"}), (to:Person {slug: "khadijah-bint-khuwaylid"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "khadijah-bint-khuwaylid"}), (to:Person {slug: "hizam-ibn-khuwaylid"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "hizam-ibn-khuwaylid"}), (to:Person {slug: "al-awwam-ibn-khuwaylid"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "al-awwam-ibn-khuwaylid"}), (to:Person {slug: "hizam-ibn-khuwaylid"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "hakim-ibn-hizam"}), (to:Person {slug: "hizam-ibn-khuwaylid"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hizam-ibn-khuwaylid"}), (to:Person {slug: "hakim-ibn-hizam"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hakim-ibn-hizam"}), (to:Person {slug: "az-zubayr-ibn-al-awwam"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',
  'MATCH (from:Person {slug: "az-zubayr-ibn-al-awwam"}), (to:Person {slug: "hakim-ibn-hizam"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',
  'MATCH (from:Person {slug: "hisham-ibn-hakim"}), (to:Person {slug: "hakim-ibn-hizam"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hakim-ibn-hizam"}), (to:Person {slug: "hisham-ibn-hakim"}) CREATE (from)-[:FATHER]->(to);',

  // Amr ibn al-As's paternal chain, wife, and children
  'MATCH (from:Person {slug: "sahm-ibn-amr"}), (to:Person {slug: "amr-ibn-husays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-husays"}), (to:Person {slug: "sahm-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-sahm"}), (to:Person {slug: "sahm-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "sahm-ibn-amr"}), (to:Person {slug: "saad-ibn-sahm"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "said-ibn-saad-al-sahmi"}), (to:Person {slug: "saad-ibn-sahm"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-sahm"}), (to:Person {slug: "said-ibn-saad-al-sahmi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hashim-ibn-said-al-sahmi"}), (to:Person {slug: "said-ibn-saad-al-sahmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "said-ibn-saad-al-sahmi"}), (to:Person {slug: "hashim-ibn-said-al-sahmi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "wail-ibn-hashim-al-sahmi"}), (to:Person {slug: "hashim-ibn-said-al-sahmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hashim-ibn-said-al-sahmi"}), (to:Person {slug: "wail-ibn-hashim-al-sahmi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "al-as-ibn-wail-al-sahmi"}), (to:Person {slug: "wail-ibn-hashim-al-sahmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "wail-ibn-hashim-al-sahmi"}), (to:Person {slug: "al-as-ibn-wail-al-sahmi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-as"}), (to:Person {slug: "al-as-ibn-wail-al-sahmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-as-ibn-wail-al-sahmi"}), (to:Person {slug: "amr-ibn-al-as"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "raitah-bint-al-hajjaj"}), (to:Person {slug: "amr-ibn-al-as"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-as"}), (to:Person {slug: "raitah-bint-al-hajjaj"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-as"}), (to:Person {slug: "hisham-ibn-al-as"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "hisham-ibn-al-as"}), (to:Person {slug: "amr-ibn-al-as"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-amr-ibn-al-as"}), (to:Person {slug: "amr-ibn-al-as"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-al-as"}), (to:Person {slug: "abdullah-ibn-amr-ibn-al-as"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-amr-ibn-al-as"}), (to:Person {slug: "raitah-bint-al-hajjaj"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "raitah-bint-al-hajjaj"}), (to:Person {slug: "abdullah-ibn-amr-ibn-al-as"}) CREATE (from)-[:MOTHER]->(to);',

  // Hisham ibn al-As's mother
  'MATCH (from:Person {slug: "umm-harmalah-al-makhzumiyyah"}), (to:Person {slug: "hisham-ibn-al-as"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "hisham-ibn-al-as"}), (to:Person {slug: "umm-harmalah-al-makhzumiyyah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umm-harmalah-al-makhzumiyyah"}), (to:Person {slug: "abu-jahl-ibn-hisham"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "abu-jahl-ibn-hisham"}), (to:Person {slug: "umm-harmalah-al-makhzumiyyah"}) CREATE (from)-[:BROTHER]->(to);',

  // Jubair ibn Mutim's paternal chain
  'MATCH (from:Person {slug: "jubair-ibn-mutim"}), (to:Person {slug: "mutim-ibn-adi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "mutim-ibn-adi"}), (to:Person {slug: "jubair-ibn-mutim"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "mutim-ibn-adi"}), (to:Person {slug: "adi-ibn-nawfal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "adi-ibn-nawfal"}), (to:Person {slug: "mutim-ibn-adi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "adi-ibn-nawfal"}), (to:Person {slug: "nawfal-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nawfal-ibn-abd-manaf"}), (to:Person {slug: "adi-ibn-nawfal"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "nawfal-ibn-abd-manaf"}), (to:Person {slug: "abd-manaf-ibn-qusay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-qusay"}), (to:Person {slug: "nawfal-ibn-abd-manaf"}) CREATE (from)-[:FATHER]->(to);',

  // Ya'la ibn Umayyah's mother
  'MATCH (from:Person {slug: "munyah-bint-ghazwan"}), (to:Person {slug: "yala-ibn-umayyah"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "yala-ibn-umayyah"}), (to:Person {slug: "munyah-bint-ghazwan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "munyah-bint-ghazwan"}), (to:Person {slug: "ghazwan-ibn-jabir"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "ghazwan-ibn-jabir"}), (to:Person {slug: "munyah-bint-ghazwan"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "munyah-bint-ghazwan"}), (to:Person {slug: "utbah-ibn-ghazwan"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "utbah-ibn-ghazwan"}), (to:Person {slug: "munyah-bint-ghazwan"}) CREATE (from)-[:BROTHER]->(to);',

  // Qais ibn Saad — son of the existing Saad ibn Ubadah
  'MATCH (from:Person {slug: "qais-ibn-saad"}), (to:Person {slug: "saad-ibn-ubadah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-ubadah"}), (to:Person {slug: "qais-ibn-saad"}) CREATE (from)-[:FATHER]->(to);',

  // Abd al-Muttalib ibn Rabiah — son of the existing Rabiah ibn al-Harith
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-rabiah"}), (to:Person {slug: "rabiah-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "rabiah-ibn-al-harith"}), (to:Person {slug: "abd-al-muttalib-ibn-rabiah"}) CREATE (from)-[:FATHER]->(to);',

  // Aqil ibn Abi Talib — new relations only, no new node (see file header)
  'MATCH (from:Person {slug: "aqil-ibn-abi-talib"}), (to:Person {slug: "ali-ibn-abi-talib"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "ali-ibn-abi-talib"}), (to:Person {slug: "aqil-ibn-abi-talib"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "aqil-ibn-abi-talib"}), (to:Person {slug: "jaafar-ibn-abi-talib"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "jaafar-ibn-abi-talib"}), (to:Person {slug: "aqil-ibn-abi-talib"}) CREATE (from)-[:BROTHER]->(to);',
];
