/**
 * Ancestor chains sourced from "سير أعلام النبلاء" (al-Dhahabi) for batch 5 of
 * newly added companions (prisma/personSeedData8.ts): ubadah-ibn-al-samit,
 * abdullah-ibn-hudhafah, suhaib-ibn-sinan, abu-talha-al-ansari,
 * abu-bardah-ibn-niyar, jabr-ibn-atik, al-ashath-ibn-qais,
 * hatib-ibn-abi-baltaah, umayr-ibn-saad-al-ansari, al-hakam-ibn-abi-al-as.
 * (abu-rafi and abu-dharr-al-ghifari have no ancestor chain worth modeling —
 * abu-rafi is a Coptic mawla with no Arab nasab at all [same precedent as
 * salman-al-farisi], and abu-dharr-al-ghifari's own page names no ancestor
 * beyond his immediate father, so that name is embedded directly in his own
 * fullName rather than getting a separate node, same precedent as
 * ukkashah-ibn-mihsan in graphSeedData5.ts.)
 *
 * Two companions in this batch (al-abbas-ibn-abd-al-muttalib,
 * abu-sufyan-ibn-harb) already have a Person node from earlier work — see
 * the Postgres-profile-only relation queries for them below, which add
 * new edges but create no new node for either.
 *
 * Chains stop as soon as they reach a slug that already exists elsewhere in
 * the graph, or where the source page itself stops naming ancestors. One
 * genuine reconnection to earlier batches was found:
 *   - Abu Talha al-Ansari's chain (Banu al-Najjar of Khazraj) reaches the
 *     existing "amr-ibn-malik" node (graphSeedData6.ts, already an ancestor
 *     of Ubayy ibn Kaab) and, through it, "malik-ibn-al-najjar"
 *     (graphSeedData5.ts, already an ancestor of Asad ibn Zurarah) — all
 *     three companions are Banu al-Najjar.
 *   - Al-Hakam ibn Abi al-As's father is explicitly the SAME "أبي العاص بن
 *     أمية" already in the graph as Uthman ibn Affan's great-grandfather via
 *     Affan (abi-al-as-ibn-umayya, graphSeedData2.ts) — he and Abu Sufyan
 *     ibn Harb (abu-sufyan-ibn-harb, graphSeedData6.ts) are first cousins,
 *     both grandsons of Umayya ibn Abd Shams. No new node needed for his
 *     father, only new SON/FATHER edges.
 *   - Al-Abbas ibn Abd al-Muttalib had a Person node and a PATERNAL_UNCLE
 *     edge to the Prophet (corePeopleQueries, graphSeedData.ts) but, unlike
 *     his brothers Abu Talib and Al-Harith, was never given a direct
 *     FATHER/SON edge to his own father abd-al-muttalib-ibn-hashim (already
 *     a Person node). That gap is filled below — no new node, just the
 *     missing edges.
 *
 * Several companions here are allies (حلفاء) rather than blood descendants
 * of the Quraysh/Ansari clan they're associated with, so — matching the
 * precedent set for al-ala-ibn-al-hadrami/utbah-ibn-ghazwan/hatib-ibn-abi-
 * baltaah's own tribe in earlier batches — their ancestor chains are kept
 * standalone and NOT connected by FATHER/SON edge into the blood tree of the
 * clan they're allied with:
 *   - Abu Bardah ibn Niyar (real name Hani') is an ally of the Aws (البلوي
 *     القضاعي, from Bali of Qudaah) — his chain stays standalone.
 *   - Hatib ibn Abi Baltaah is an ally of Banu Asad ibn Abd al-Uzza (اللخمي
 *     المكي) — his chain stays standalone and is NOT linked to the existing
 *     "asad-ibn-abd-al-uzza" node (Az-Zubayr's ancestor, graphSeedData3.ts)
 *     even though the clan name matches, since Hatib is Lakhmi by blood, not
 *     a descendant of that Asad.
 *
 * Very deep pre-Islamic chains with no collision and no in-batch sharing
 * (Ubadah ibn al-Samit's Khazraj line, Jabr ibn Atik's Ansari line, and
 * al-Ashath ibn Qais's Kindah line) are truncated to a single new ancestor
 * node whose fullName embeds the remaining reported generations as plain
 * text, rather than modeling every generation as its own node — consistent
 * with how graphSeedData6.ts truncated similarly deep, non-reconnecting
 * chains (e.g. Muadh ibn Jabal's Khazraj line, Ammar ibn Yasir's Madhhij
 * line).
 *
 * No fullName in this batch is inferred from sibling placement — every
 * entry below has its own nasab, however short, stated directly on its own
 * page.
 *
 * Ordering note: the batch-5 companions themselves are not created here —
 * their Person nodes come from `npm run people:sync -- --apply` picking up
 * the PostgreSQL profiles in prisma/personSeedData8.ts. Run that sync before
 * `npm run seed:graph`, or the MATCH clauses linking them to their ancestors
 * below will silently find nothing to attach to.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Ubadah ibn al-Samit (Khazraj, fresh chain, truncated — very deep,
  // unconnected pre-Islamic line)
  'CREATE (:Person { name: "الصامت بن قيس", slug: "al-samit-ibn-qais-al-khazraji", fullName: "الصامت بن قيس بن أصرم بن فهر بن ثعلبة بن غنم بن عوف بن عمرو بن عوف الأنصاري الخزرجي" });',

  // Abdullah ibn Hudhafah (Sahm, Quraysh — shallow chain, fully modeled)
  'CREATE (:Person { name: "حذافة بن قيس", slug: "hudhafah-ibn-qais-al-sahmi", fullName: "حذافة بن قيس بن عدي السهمي القرشي" });',
  'CREATE (:Person { name: "قيس بن عدي", slug: "qais-ibn-adi-al-sahmi", fullName: "قيس بن عدي السهمي القرشي" });',

  // Suhaib ibn Sinan (an-Namr ibn Qasit, of Rabi'ah — fresh chain, fully
  // modeled)
  'CREATE (:Person { name: "سنان بن مالك", slug: "sinan-ibn-malik-al-namri", fullName: "سنان بن مالك بن عبد عمرو بن عقيل بن عامر النمري" });',
  'CREATE (:Person { name: "مالك بن عبد عمرو", slug: "malik-ibn-abd-amr-al-namri", fullName: "مالك بن عبد عمرو بن عقيل بن عامر النمري" });',
  'CREATE (:Person { name: "عبد عمرو بن عقيل", slug: "abd-amr-ibn-uqail-al-namri", fullName: "عبد عمرو بن عقيل بن عامر النمري" });',

  // Abu Talha al-Ansari (Banu al-Najjar of Khazraj — reaches the existing
  // "amr-ibn-malik" / "malik-ibn-al-najjar" nodes, see header note)
  'CREATE (:Person { name: "سهل بن الأسود", slug: "sahl-ibn-al-aswad", fullName: "سهل بن الأسود بن حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "الأسود بن حرام", slug: "al-aswad-ibn-haram", fullName: "الأسود بن حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "حرام بن عمرو", slug: "haram-ibn-amr", fullName: "حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "عمرو بن زيد مناة", slug: "amr-ibn-zayd-manah", fullName: "عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "زيد مناة بن عدي", slug: "zayd-manah-ibn-adi", fullName: "زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "عدي بن عمرو", slug: "adi-ibn-amr", fullName: "عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري" });',

  // Abu Bardah ibn Niyar (ally of the Aws, Bali of Qudaah — standalone,
  // truncated)
  'CREATE (:Person { name: "نيار بن عمرو", slug: "niyar-ibn-amr-al-balawi", fullName: "نيار بن عمرو بن عبيد بن عمرو بن كلاب بن دهمان البلوي القضاعي حليف الأوس" });',

  // Jabr ibn Atik (Ansari, fresh chain, truncated — very deep, unconnected
  // pre-Islamic line)
  'CREATE (:Person { name: "عتيك بن قيس", slug: "atik-ibn-qais-al-ansari", fullName: "عتيك بن قيس بن هيشة بن الحارث بن أمية بن معاوية بن مالك بن عوف بن عمرو بن عوف الأنصاري" });',

  // Al-Ashath ibn Qais (Kindah, fresh chain, truncated — very deep,
  // unconnected pre-Islamic line)
  'CREATE (:Person { name: "قيس بن معدي كرب", slug: "qais-ibn-muadikarib-al-kindi", fullName: "قيس بن معدي كرب بن معاوية بن جبلة بن عدي بن ربيعة بن معاوية الأكرمين بن الحارث بن معاوية بن ثور بن مرتع بن كندة" });',

  // Hatib ibn Abi Baltaah (ally of Banu Asad ibn Abd al-Uzza, Lakhm —
  // standalone, fully modeled)
  'CREATE (:Person { name: "عمرو بن عمير", slug: "amr-ibn-umayr-al-lakhmi", fullName: "عمرو بن عمير بن سلمة اللخمي المكي حليف بني أسد بن عبد العزى بن قصي" });',
  'CREATE (:Person { name: "عمير بن سلمة", slug: "umayr-ibn-salamah-al-lakhmi", fullName: "عمير بن سلمة اللخمي المكي حليف بني أسد بن عبد العزى بن قصي" });',

  // Umayr ibn Saad al-Ansari (Aws — shallow, per one report on his own page)
  'CREATE (:Person { name: "سعد بن شهيد", slug: "saad-ibn-shahid-al-awsi", fullName: "سعد بن شهيد الأنصاري الأوسي" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Ubadah ibn al-Samit
  'MATCH (from:Person {slug: "ubadah-ibn-al-samit"}), (to:Person {slug: "al-samit-ibn-qais-al-khazraji"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-samit-ibn-qais-al-khazraji"}), (to:Person {slug: "ubadah-ibn-al-samit"}) CREATE (from)-[:FATHER]->(to);',

  // Abdullah ibn Hudhafah
  'MATCH (from:Person {slug: "abdullah-ibn-hudhafah"}), (to:Person {slug: "hudhafah-ibn-qais-al-sahmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hudhafah-ibn-qais-al-sahmi"}), (to:Person {slug: "abdullah-ibn-hudhafah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hudhafah-ibn-qais-al-sahmi"}), (to:Person {slug: "qais-ibn-adi-al-sahmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-adi-al-sahmi"}), (to:Person {slug: "hudhafah-ibn-qais-al-sahmi"}) CREATE (from)-[:FATHER]->(to);',

  // Suhaib ibn Sinan
  'MATCH (from:Person {slug: "suhaib-ibn-sinan"}), (to:Person {slug: "sinan-ibn-malik-al-namri"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "sinan-ibn-malik-al-namri"}), (to:Person {slug: "suhaib-ibn-sinan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "sinan-ibn-malik-al-namri"}), (to:Person {slug: "malik-ibn-abd-amr-al-namri"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-abd-amr-al-namri"}), (to:Person {slug: "sinan-ibn-malik-al-namri"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-abd-amr-al-namri"}), (to:Person {slug: "abd-amr-ibn-uqail-al-namri"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-amr-ibn-uqail-al-namri"}), (to:Person {slug: "malik-ibn-abd-amr-al-namri"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Talha al-Ansari
  'MATCH (from:Person {slug: "abu-talha-al-ansari"}), (to:Person {slug: "sahl-ibn-al-aswad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "sahl-ibn-al-aswad"}), (to:Person {slug: "abu-talha-al-ansari"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "sahl-ibn-al-aswad"}), (to:Person {slug: "al-aswad-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-aswad-ibn-haram"}), (to:Person {slug: "sahl-ibn-al-aswad"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-aswad-ibn-haram"}), (to:Person {slug: "haram-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haram-ibn-amr"}), (to:Person {slug: "al-aswad-ibn-haram"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "haram-ibn-amr"}), (to:Person {slug: "amr-ibn-zayd-manah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-zayd-manah"}), (to:Person {slug: "haram-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-zayd-manah"}), (to:Person {slug: "zayd-manah-ibn-adi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-manah-ibn-adi"}), (to:Person {slug: "amr-ibn-zayd-manah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-manah-ibn-adi"}), (to:Person {slug: "adi-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "adi-ibn-amr"}), (to:Person {slug: "zayd-manah-ibn-adi"}) CREATE (from)-[:FATHER]->(to);',

  // Adi ibn Amr reconnects to the existing amr-ibn-malik / malik-ibn-al-najjar
  // chain (graphSeedData5.ts / graphSeedData6.ts) — no new node needed here.
  'MATCH (from:Person {slug: "adi-ibn-amr"}), (to:Person {slug: "amr-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-malik"}), (to:Person {slug: "adi-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Bardah ibn Niyar
  'MATCH (from:Person {slug: "abu-bardah-ibn-niyar"}), (to:Person {slug: "niyar-ibn-amr-al-balawi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "niyar-ibn-amr-al-balawi"}), (to:Person {slug: "abu-bardah-ibn-niyar"}) CREATE (from)-[:FATHER]->(to);',

  // Jabr ibn Atik
  'MATCH (from:Person {slug: "jabr-ibn-atik"}), (to:Person {slug: "atik-ibn-qais-al-ansari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "atik-ibn-qais-al-ansari"}), (to:Person {slug: "jabr-ibn-atik"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Ashath ibn Qais
  'MATCH (from:Person {slug: "al-ashath-ibn-qais"}), (to:Person {slug: "qais-ibn-muadikarib-al-kindi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-muadikarib-al-kindi"}), (to:Person {slug: "al-ashath-ibn-qais"}) CREATE (from)-[:FATHER]->(to);',

  // Hatib ibn Abi Baltaah
  'MATCH (from:Person {slug: "hatib-ibn-abi-baltaah"}), (to:Person {slug: "amr-ibn-umayr-al-lakhmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-umayr-al-lakhmi"}), (to:Person {slug: "hatib-ibn-abi-baltaah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-umayr-al-lakhmi"}), (to:Person {slug: "umayr-ibn-salamah-al-lakhmi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umayr-ibn-salamah-al-lakhmi"}), (to:Person {slug: "amr-ibn-umayr-al-lakhmi"}) CREATE (from)-[:FATHER]->(to);',

  // Umayr ibn Saad al-Ansari
  'MATCH (from:Person {slug: "umayr-ibn-saad-al-ansari"}), (to:Person {slug: "saad-ibn-shahid-al-awsi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-shahid-al-awsi"}), (to:Person {slug: "umayr-ibn-saad-al-ansari"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Abbas ibn Abd al-Muttalib — gap-fill: he already exists as a Person
  // node with a PATERNAL_UNCLE edge to the Prophet (corePeopleQueries,
  // graphSeedData.ts) but, unlike his brothers, never had a direct FATHER/SON
  // edge to his own father (also already a Person node). No new node here.
  'MATCH (from:Person {slug: "al-abbas-ibn-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "al-abbas-ibn-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Hakam ibn Abi al-As — his father is the existing abi-al-as-ibn-umayya
  // node (Uthman ibn Affan's great-grandfather via Affan, graphSeedData2.ts).
  // No new node needed here.
  'MATCH (from:Person {slug: "al-hakam-ibn-abi-al-as"}), (to:Person {slug: "abi-al-as-ibn-umayya"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abi-al-as-ibn-umayya"}), (to:Person {slug: "al-hakam-ibn-abi-al-as"}) CREATE (from)-[:FATHER]->(to);',
];
