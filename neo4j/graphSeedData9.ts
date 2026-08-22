/**
 * Ancestor chains and family relations sourced from "سير أعلام النبلاء"
 * (al-Dhahabi) for batch 7 of newly added companions
 * (prisma/personSeedData10.ts): sanaa-bint-asma-al-sulami,
 * asma-bint-al-numan-al-kindiyyah, qutaylah-bint-qais-al-kindiyyah,
 * safiyyah-bint-abd-al-muttalib, arwa-bint-abd-al-muttalib,
 * atikah-bint-abd-al-muttalib, al-bayda-bint-abd-al-muttalib,
 * barrah-bint-abd-al-muttalib, umaymah-bint-abd-al-muttalib,
 * dubaah-bint-al-zubayr-ibn-abd-al-muttalib, durrah-bint-abi-lahab,
 * umm-kulthum-bint-uqbah, umm-umarah, asma-bint-umays, asma-bint-abi-bakr,
 * umm-sulaym-al-ghumaysa, umm-hani-bint-abi-talib, umm-al-fadl-bint-al-harith,
 * umm-haram-bint-milhan.
 *
 * Two companions in this batch (juwayriyah-bint-al-harith,
 * sawdah-bint-zamah) already have a Person node from earlier work — see the
 * profile-only relation queries for them below, which add new edges but
 * create no new node for either, same pattern as batches 5/6.
 *
 * Reused existing ancestors across this batch (no new node needed):
 *   - abd-al-muttalib-ibn-hashim (graphSeedData2.ts) — direct father of six
 *     entries in this batch (safiyyah, arwa, atikah, al-bayda, barrah,
 *     umaymah — the last flagged as a disputed attribution, see
 *     personSeedData10.ts's comment on that entry).
 *   - al-awwam-ibn-khuwaylid (graphSeedData3.ts) — Safiyyah's husband,
 *     already the father of the existing az-zubayr-ibn-al-awwam; a MOTHER
 *     edge from Safiyyah to that existing node is added alongside the
 *     FATHER edge he already has from al-awwam-ibn-khuwaylid, giving him
 *     both parents.
 *   - malik-ibn-an-nadr-al-najjari (graphSeedData4.ts) — already documented
 *     there as father of both al-Baraa ibn Malik AND Anas ibn Malik; Umm
 *     Sulaym is Anas's mother, so a WIFE/HUSBAND pair is added between her
 *     and this existing node.
 *   - zayd-ibn-haram (graphSeedData4.ts) — Umm Sulaym/Umm Haram's nasab
 *     (…بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار) reaches this exact
 *     existing node two generations up from their new father node.
 *
 * Same-name collision disambiguated by father, following the existing
 * convention: the new "الزبير بن عبد المطلب" (Dubaa'ah's father, a son of
 * Abd al-Muttalib) would collide in plain form with the existing companion
 * az-zubayr-ibn-al-awwam if not distinguished — slugged
 * "al-zubayr-ibn-abd-al-muttalib-al-hashimi".
 *
 * Two graph-only nodes (never Companions, no profile) created because
 * they're needed to connect multiple entries in this batch:
 *   - abu-lahab-ibn-abd-al-muttalib: son of Abd al-Muttalib, never a
 *     Muslim — needed as sibling of Atikah (id 176) and father of Durrah
 *     (id 181).
 *   - uqba-ibn-abi-muayt: never a Muslim, died an enemy of the Prophet —
 *     needed as husband of al-Bayda (id 177) and father of Umm Kulthum
 *     bint Uqbah (id 182); his own chain reaches the existing
 *     umayya-ibn-abd-shams node.
 *   - jahsh-ibn-riyab, al-harith-ibn-hazn-al-hilali, al-harith-ibn-abi-
 *     dirar-al-mustaliqi, al-sakran-ibn-amr-al-amiri, arwa-bint-kurayz: all
 *     graph-only, needed only to connect an entry in this batch to an
 *     existing node (Zaynab bint Jahsh, Maymunah, Juwayriyah, Suhail ibn
 *     Amr, and Uthman ibn Affan respectively) — none are companions in
 *     their own right per this book's framing.
 *
 * fullName for the newly-created ancestor nodes is taken directly from the
 * companion page that names them; where a page gives no further generation,
 * the chain simply stops there (e.g. khawlah-bint-hakim, fatimah-bint-qais-
 * al-fihriyyah, asma-bint-yazid-ibn-al-sakn, umm-atiyyah-al-ansariyyah — no
 * separate ancestor node for any of those four, per their own header notes
 * in personSeedData10.ts).
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Asma bint al-Numan al-Kindiyyah
  'CREATE (:Person { name: "النعمان بن أبي الجون", slug: "al-numan-ibn-abi-al-jawn-al-kindi", fullName: "النعمان بن أبي الجون الكندي" });',

  // Juwayriyah bint al-Harith — her father, a later convert per her page
  'CREATE (:Person { name: "الحارث بن أبي ضرار", slug: "al-harith-ibn-abi-dirar-al-mustaliqi", fullName: "الحارث بن أبي ضرار المصطلقي" });',

  // Sawdah bint Zamah — her father, and her first husband (brother of the
  // existing companion Suhail ibn Amr)
  'CREATE (:Person { name: "زمعة بن قيس", slug: "zamah-ibn-qais-al-amiri", fullName: "زمعة بن قيس القرشي العامري" });',
  'CREATE (:Person { name: "السكران بن عمرو", slug: "al-sakran-ibn-amr-al-amiri", fullName: "السكران بن عمرو بن عبد شمس بن عبد ود بن نصر بن حسل بن عامر بن لؤي القرشي العامري" });',

  // Abu Lahab ibn Abd al-Muttalib — graph-only, never a Muslim; needed as
  // sibling of Atikah and father of Durrah
  'CREATE (:Person { name: "أبو لهب", slug: "abu-lahab-ibn-abd-al-muttalib", fullName: "عبد العزى بن عبد المطلب بن هاشم القرشي الهاشمي" });',

  // Al-Bayda bint Abd al-Muttalib — her daughter (by Kurayz ibn Rabiah,
  // whose own node isn't modelled) who became Uthman ibn Affan's mother,
  // and her second husband Uqba ibn Abi Muayt with his chain up to the
  // existing umayya-ibn-abd-shams node
  'CREATE (:Person { name: "أروى بنت كريز", slug: "arwa-bint-kurayz", fullName: "أروى بنت كريز بن ربيعة القرشية العبشمية" });',
  'CREATE (:Person { name: "عقبة بن أبي معيط", slug: "uqba-ibn-abi-muayt", fullName: "عقبة بن أبي معيط بن أبان بن ذكوان بن أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "أبو معيط بن أبان", slug: "abi-muayt-ibn-aban", fullName: "أبو معيط بن أبان بن ذكوان بن أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "أبان بن ذكوان", slug: "aban-ibn-dhakwan", fullName: "أبان بن ذكوان بن أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "ذكوان بن أمية", slug: "dhakwan-ibn-umayyah", fullName: "ذكوان بن أمية بن عبد شمس القرشي الأموي" });',

  // Umaymah bint Abd al-Muttalib — her husband (father of the existing
  // zaynab-bint-jahsh)
  'CREATE (:Person { name: "جحش بن رئاب", slug: "jahsh-ibn-riyab", fullName: "جحش بن رئاب الأسدي حليف قريش" });',

  // Dubaah bint al-Zubayr ibn Abd al-Muttalib — her father (a son of Abd
  // al-Muttalib, NOT the same person as the existing az-zubayr-ibn-al-awwam)
  'CREATE (:Person { name: "الزبير بن عبد المطلب", slug: "al-zubayr-ibn-abd-al-muttalib-al-hashimi", fullName: "الزبير بن عبد المطلب بن هاشم القرشي الهاشمي" });',

  // Umm Umarah (Nusaybah bint Kaab) — standalone chain, not connected to
  // the existing Najjar-branch nodes (her own page's nasab stops short of
  // that connection, see personSeedData10.ts)
  'CREATE (:Person { name: "كعب بن عمرو", slug: "kaab-ibn-amr-ibn-awf", fullName: "كعب بن عمرو بن عوف بن مبذول الأنصاري الخزرجي النجاري المازني" });',
  'CREATE (:Person { name: "عمرو بن عوف", slug: "amr-ibn-awf-ibn-mabdhul", fullName: "عمرو بن عوف بن مبذول الأنصاري الخزرجي النجاري المازني" });',
  'CREATE (:Person { name: "عوف بن مبذول", slug: "awf-ibn-mabdhul", fullName: "عوف بن مبذول الأنصاري الخزرجي النجاري المازني" });',

  // Asma bint Umays — standalone Khatham chain
  'CREATE (:Person { name: "عميس بن معبد", slug: "umays-ibn-mabad-al-khathami", fullName: "عميس بن معبد بن الحارث الخثعمي" });',
  'CREATE (:Person { name: "معبد بن الحارث", slug: "mabad-ibn-al-harith-al-khathami", fullName: "معبد بن الحارث الخثعمي" });',

  // Umm Sulaym al-Ghumaysa / Umm Haram bint Milhan — shared father chain,
  // reaches the existing zayd-ibn-haram node (graphSeedData4.ts)
  'CREATE (:Person { name: "ملحان بن خالد", slug: "milhan-ibn-khalid-al-najjari", fullName: "ملحان بن خالد بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري الخزرجي" });',
  'CREATE (:Person { name: "خالد بن زيد", slug: "khalid-ibn-zayd-al-najjari", fullName: "خالد بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري الخزرجي" });',

  // Umm al-Fadl bint al-Harith / Maymunah bint al-Harith — shared father,
  // not previously modelled as a node when Maymunah's profile was added in
  // batch 6 (profile only, no ancestor chain at the time)
  'CREATE (:Person { name: "الحارث بن حزن", slug: "al-harith-ibn-hazn-al-hilali", fullName: "الحارث بن حزن بن بجير الهلالي" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Sanaa bint Asma al-Sulami — no father node created (thin, standalone
  // mention), fullName embeds what her own page gives.

  // Asma bint al-Numan al-Kindiyyah
  'MATCH (from:Person {slug: "asma-bint-al-numan-al-kindiyyah"}), (to:Person {slug: "al-numan-ibn-abi-al-jawn-al-kindi"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "al-numan-ibn-abi-al-jawn-al-kindi"}), (to:Person {slug: "asma-bint-al-numan-al-kindiyyah"}) CREATE (from)-[:FATHER]->(to);',

  // Qutaylah bint Qais al-Kindiyyah — reuses the existing father of
  // al-Ashath ibn Qais (batch 5), and a direct sibling edge to him
  'MATCH (from:Person {slug: "qutaylah-bint-qais-al-kindiyyah"}), (to:Person {slug: "qais-ibn-muadikarib-al-kindi"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-muadikarib-al-kindi"}), (to:Person {slug: "qutaylah-bint-qais-al-kindiyyah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "qutaylah-bint-qais-al-kindiyyah"}), (to:Person {slug: "al-ashath-ibn-qais"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "al-ashath-ibn-qais"}), (to:Person {slug: "qutaylah-bint-qais-al-kindiyyah"}) CREATE (from)-[:BROTHER]->(to);',

  // Juwayriyah bint al-Harith — existing node, gap-fill
  'MATCH (from:Person {slug: "juwayriyah-bint-al-harith"}), (to:Person {slug: "al-harith-ibn-abi-dirar-al-mustaliqi"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-abi-dirar-al-mustaliqi"}), (to:Person {slug: "juwayriyah-bint-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  // Sawdah bint Zamah — existing node, gap-fill
  'MATCH (from:Person {slug: "sawdah-bint-zamah"}), (to:Person {slug: "zamah-ibn-qais-al-amiri"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "zamah-ibn-qais-al-amiri"}), (to:Person {slug: "sawdah-bint-zamah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "sawdah-bint-zamah"}), (to:Person {slug: "al-sakran-ibn-amr-al-amiri"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "al-sakran-ibn-amr-al-amiri"}), (to:Person {slug: "sawdah-bint-zamah"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "al-sakran-ibn-amr-al-amiri"}), (to:Person {slug: "suhail-ibn-amr"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "suhail-ibn-amr"}), (to:Person {slug: "al-sakran-ibn-amr-al-amiri"}) CREATE (from)-[:BROTHER]->(to);',

  // Safiyyah bint Abd al-Muttalib — full sister of the existing Hamzah,
  // mother (alongside his already-linked father) of the existing
  // az-Zubayr ibn al-Awwam, wife of the existing al-Awwam ibn Khuwaylid
  'MATCH (from:Person {slug: "safiyyah-bint-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "safiyyah-bint-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "safiyyah-bint-abd-al-muttalib"}), (to:Person {slug: "hamzah-ibn-abd-al-muttalib"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "hamzah-ibn-abd-al-muttalib"}), (to:Person {slug: "safiyyah-bint-abd-al-muttalib"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "safiyyah-bint-abd-al-muttalib"}), (to:Person {slug: "al-awwam-ibn-khuwaylid"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "al-awwam-ibn-khuwaylid"}), (to:Person {slug: "safiyyah-bint-abd-al-muttalib"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "safiyyah-bint-abd-al-muttalib"}), (to:Person {slug: "az-zubayr-ibn-al-awwam"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "az-zubayr-ibn-al-awwam"}), (to:Person {slug: "safiyyah-bint-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',

  // Arwa bint Abd al-Muttalib — fullName follows the sibling-grouping
  // inference rule (see personSeedData10.ts's comment on this entry)
  'MATCH (from:Person {slug: "arwa-bint-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "arwa-bint-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',

  // Atikah bint Abd al-Muttalib — sister of the new graph-only node
  // Abu Lahab
  'MATCH (from:Person {slug: "atikah-bint-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "atikah-bint-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abu-lahab-ibn-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "abu-lahab-ibn-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "atikah-bint-abd-al-muttalib"}), (to:Person {slug: "abu-lahab-ibn-abd-al-muttalib"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "abu-lahab-ibn-abd-al-muttalib"}), (to:Person {slug: "atikah-bint-abd-al-muttalib"}) CREATE (from)-[:BROTHER]->(to);',

  // Al-Bayda bint Abd al-Muttalib — daughter Arwa bint Kurayz (mother of
  // the existing Uthman ibn Affan), second husband Uqba ibn Abi Muayt with
  // his own chain up to the existing umayya-ibn-abd-shams node
  'MATCH (from:Person {slug: "al-bayda-bint-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "al-bayda-bint-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "arwa-bint-kurayz"}), (to:Person {slug: "al-bayda-bint-abd-al-muttalib"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "al-bayda-bint-abd-al-muttalib"}), (to:Person {slug: "arwa-bint-kurayz"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "arwa-bint-kurayz"}), (to:Person {slug: "uthman-ibn-affan"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-affan"}), (to:Person {slug: "arwa-bint-kurayz"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-bayda-bint-abd-al-muttalib"}), (to:Person {slug: "uqba-ibn-abi-muayt"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "uqba-ibn-abi-muayt"}), (to:Person {slug: "al-bayda-bint-abd-al-muttalib"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "uqba-ibn-abi-muayt"}), (to:Person {slug: "abi-muayt-ibn-aban"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abi-muayt-ibn-aban"}), (to:Person {slug: "uqba-ibn-abi-muayt"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abi-muayt-ibn-aban"}), (to:Person {slug: "aban-ibn-dhakwan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "aban-ibn-dhakwan"}), (to:Person {slug: "abi-muayt-ibn-aban"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "aban-ibn-dhakwan"}), (to:Person {slug: "dhakwan-ibn-umayyah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "dhakwan-ibn-umayyah"}), (to:Person {slug: "aban-ibn-dhakwan"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "dhakwan-ibn-umayyah"}), (to:Person {slug: "umayya-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umayya-ibn-abd-shams"}), (to:Person {slug: "dhakwan-ibn-umayyah"}) CREATE (from)-[:FATHER]->(to);',

  // Barrah bint Abd al-Muttalib — mother (by her first husband) of the
  // existing Abu Salamah
  'MATCH (from:Person {slug: "barrah-bint-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "barrah-bint-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "barrah-bint-abd-al-muttalib"}), (to:Person {slug: "abu-salamah"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "abu-salamah"}), (to:Person {slug: "barrah-bint-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',

  // Umaymah bint Abd al-Muttalib — disputed nasab, see personSeedData10.ts;
  // solidly-confirmed mother of the existing Zaynab bint Jahsh via her
  // husband Jahsh ibn Riyab (new graph-only node)
  'MATCH (from:Person {slug: "umaymah-bint-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "umaymah-bint-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umaymah-bint-abd-al-muttalib"}), (to:Person {slug: "jahsh-ibn-riyab"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "jahsh-ibn-riyab"}), (to:Person {slug: "umaymah-bint-abd-al-muttalib"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "umaymah-bint-abd-al-muttalib"}), (to:Person {slug: "zaynab-bint-jahsh"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "zaynab-bint-jahsh"}), (to:Person {slug: "umaymah-bint-abd-al-muttalib"}) CREATE (from)-[:DAUGHTER]->(to);',

  // Dubaah bint al-Zubayr ibn Abd al-Muttalib — NOT a paternal aunt, a
  // first cousin; wife of the existing al-Miqdad ibn Amr
  'MATCH (from:Person {slug: "dubaah-bint-al-zubayr-ibn-abd-al-muttalib"}), (to:Person {slug: "al-zubayr-ibn-abd-al-muttalib-al-hashimi"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "al-zubayr-ibn-abd-al-muttalib-al-hashimi"}), (to:Person {slug: "dubaah-bint-al-zubayr-ibn-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "al-zubayr-ibn-abd-al-muttalib-al-hashimi"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "al-zubayr-ibn-abd-al-muttalib-al-hashimi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "dubaah-bint-al-zubayr-ibn-abd-al-muttalib"}), (to:Person {slug: "al-miqdad-ibn-amr"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "al-miqdad-ibn-amr"}), (to:Person {slug: "dubaah-bint-al-zubayr-ibn-abd-al-muttalib"}) CREATE (from)-[:HUSBAND]->(to);',

  // Durrah bint Abi Lahab — NOT a paternal aunt, a first cousin
  'MATCH (from:Person {slug: "durrah-bint-abi-lahab"}), (to:Person {slug: "abu-lahab-ibn-abd-al-muttalib"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abu-lahab-ibn-abd-al-muttalib"}), (to:Person {slug: "durrah-bint-abi-lahab"}) CREATE (from)-[:FATHER]->(to);',

  // Umm Kulthum bint Uqbah — reuses the Uqba ibn Abi Muayt node created
  // above; married in sequence to the existing Zaid ibn Harithah (ended in
  // divorce) and Abdur-Rahman ibn Awf
  'MATCH (from:Person {slug: "umm-kulthum-bint-uqbah"}), (to:Person {slug: "uqba-ibn-abi-muayt"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "uqba-ibn-abi-muayt"}), (to:Person {slug: "umm-kulthum-bint-uqbah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umm-kulthum-bint-uqbah"}), (to:Person {slug: "zaid-ibn-harithah"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-harithah"}), (to:Person {slug: "umm-kulthum-bint-uqbah"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "umm-kulthum-bint-uqbah"}), (to:Person {slug: "abdur-rahman-ibn-awf"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "abdur-rahman-ibn-awf"}), (to:Person {slug: "umm-kulthum-bint-uqbah"}) CREATE (from)-[:HUSBAND]->(to);',

  // Umm Umarah (Nusaybah bint Kaab)
  'MATCH (from:Person {slug: "umm-umarah"}), (to:Person {slug: "kaab-ibn-amr-ibn-awf"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-amr-ibn-awf"}), (to:Person {slug: "umm-umarah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-amr-ibn-awf"}), (to:Person {slug: "amr-ibn-awf-ibn-mabdhul"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-awf-ibn-mabdhul"}), (to:Person {slug: "kaab-ibn-amr-ibn-awf"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-awf-ibn-mabdhul"}), (to:Person {slug: "awf-ibn-mabdhul"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "awf-ibn-mabdhul"}), (to:Person {slug: "amr-ibn-awf-ibn-mabdhul"}) CREATE (from)-[:FATHER]->(to);',

  // Asma bint Umays — married in sequence to the existing Jaafar ibn Abi
  // Talib, Abu Bakr as-Siddiq, and Ali ibn Abi Talib; mother (by Jaafar) of
  // the existing Abdullah ibn Jaafar
  'MATCH (from:Person {slug: "asma-bint-umays"}), (to:Person {slug: "umays-ibn-mabad-al-khathami"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "umays-ibn-mabad-al-khathami"}), (to:Person {slug: "asma-bint-umays"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umays-ibn-mabad-al-khathami"}), (to:Person {slug: "mabad-ibn-al-harith-al-khathami"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "mabad-ibn-al-harith-al-khathami"}), (to:Person {slug: "umays-ibn-mabad-al-khathami"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "asma-bint-umays"}), (to:Person {slug: "jaafar-ibn-abi-talib"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "jaafar-ibn-abi-talib"}), (to:Person {slug: "asma-bint-umays"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "asma-bint-umays"}), (to:Person {slug: "abu-bakr-as-siddiq"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "abu-bakr-as-siddiq"}), (to:Person {slug: "asma-bint-umays"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "asma-bint-umays"}), (to:Person {slug: "ali-ibn-abi-talib"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "ali-ibn-abi-talib"}), (to:Person {slug: "asma-bint-umays"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "asma-bint-umays"}), (to:Person {slug: "abdullah-ibn-jaafar"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-jaafar"}), (to:Person {slug: "asma-bint-umays"}) CREATE (from)-[:SON]->(to);',

  // Asma bint Abi Bakr — daughter of the existing Abu Bakr as-Siddiq, wife
  // of the existing Az-Zubayr ibn al-Awwam
  'MATCH (from:Person {slug: "asma-bint-abi-bakr"}), (to:Person {slug: "abu-bakr-as-siddiq"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abu-bakr-as-siddiq"}), (to:Person {slug: "asma-bint-abi-bakr"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "asma-bint-abi-bakr"}), (to:Person {slug: "az-zubayr-ibn-al-awwam"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "az-zubayr-ibn-al-awwam"}), (to:Person {slug: "asma-bint-abi-bakr"}) CREATE (from)-[:HUSBAND]->(to);',

  // Asma bint Yazid ibn al-Sakn — cousin of the existing Muadh ibn Jabal
  'MATCH (from:Person {slug: "asma-bint-yazid-ibn-al-sakn"}), (to:Person {slug: "muadh-ibn-jabal"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',
  'MATCH (from:Person {slug: "muadh-ibn-jabal"}), (to:Person {slug: "asma-bint-yazid-ibn-al-sakn"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',

  // Umm Sulaym al-Ghumaysa — reaches the existing zayd-ibn-haram node;
  // first husband is the existing malik-ibn-an-nadr-al-najjari (already
  // documented there as father of Anas ibn Malik, her son); second husband
  // the existing Abu Talha al-Ansari
  'MATCH (from:Person {slug: "umm-sulaym-al-ghumaysa"}), (to:Person {slug: "milhan-ibn-khalid-al-najjari"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "milhan-ibn-khalid-al-najjari"}), (to:Person {slug: "umm-sulaym-al-ghumaysa"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "milhan-ibn-khalid-al-najjari"}), (to:Person {slug: "khalid-ibn-zayd-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khalid-ibn-zayd-al-najjari"}), (to:Person {slug: "milhan-ibn-khalid-al-najjari"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "khalid-ibn-zayd-al-najjari"}), (to:Person {slug: "zayd-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-haram"}), (to:Person {slug: "khalid-ibn-zayd-al-najjari"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umm-sulaym-al-ghumaysa"}), (to:Person {slug: "malik-ibn-an-nadr-al-najjari"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-an-nadr-al-najjari"}), (to:Person {slug: "umm-sulaym-al-ghumaysa"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "umm-sulaym-al-ghumaysa"}), (to:Person {slug: "abu-talha-al-ansari"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "abu-talha-al-ansari"}), (to:Person {slug: "umm-sulaym-al-ghumaysa"}) CREATE (from)-[:HUSBAND]->(to);',

  // Umm Hani bint Abi Talib — daughter of the existing Abu Talib; mother
  // Fatimah bint Asad added per the sibling-grouping inference rule (she's
  // Ali's confirmed full sister, see personSeedData10.ts)
  'MATCH (from:Person {slug: "umm-hani-bint-abi-talib"}), (to:Person {slug: "abu-talib"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abu-talib"}), (to:Person {slug: "umm-hani-bint-abi-talib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umm-hani-bint-abi-talib"}), (to:Person {slug: "fatimah-bint-asad"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "fatimah-bint-asad"}), (to:Person {slug: "umm-hani-bint-abi-talib"}) CREATE (from)-[:MOTHER]->(to);',

  // Umm al-Fadl bint al-Harith / Maymunah bint al-Harith — shared father
  // (new node), sisters of each other, Umm al-Fadl is wife of the existing
  // al-Abbas ibn Abd al-Muttalib
  'MATCH (from:Person {slug: "umm-al-fadl-bint-al-harith"}), (to:Person {slug: "al-harith-ibn-hazn-al-hilali"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-hazn-al-hilali"}), (to:Person {slug: "umm-al-fadl-bint-al-harith"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "maymunah-bint-al-harith"}), (to:Person {slug: "al-harith-ibn-hazn-al-hilali"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-hazn-al-hilali"}), (to:Person {slug: "maymunah-bint-al-harith"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umm-al-fadl-bint-al-harith"}), (to:Person {slug: "maymunah-bint-al-harith"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "maymunah-bint-al-harith"}), (to:Person {slug: "umm-al-fadl-bint-al-harith"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "umm-al-fadl-bint-al-harith"}), (to:Person {slug: "al-abbas-ibn-abd-al-muttalib"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "al-abbas-ibn-abd-al-muttalib"}), (to:Person {slug: "umm-al-fadl-bint-al-harith"}) CREATE (from)-[:HUSBAND]->(to);',

  // Umm Haram bint Milhan — reuses the father node created for Umm Sulaym
  // above; explicit sister of Umm Sulaym; wife of the existing Ubadah ibn
  // al-Samit
  'MATCH (from:Person {slug: "umm-haram-bint-milhan"}), (to:Person {slug: "milhan-ibn-khalid-al-najjari"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "milhan-ibn-khalid-al-najjari"}), (to:Person {slug: "umm-haram-bint-milhan"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umm-haram-bint-milhan"}), (to:Person {slug: "umm-sulaym-al-ghumaysa"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "umm-sulaym-al-ghumaysa"}), (to:Person {slug: "umm-haram-bint-milhan"}) CREATE (from)-[:SISTER]->(to);',
  'MATCH (from:Person {slug: "umm-haram-bint-milhan"}), (to:Person {slug: "ubadah-ibn-al-samit"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "ubadah-ibn-al-samit"}), (to:Person {slug: "umm-haram-bint-milhan"}) CREATE (from)-[:HUSBAND]->(to);',
];
