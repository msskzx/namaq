/**
 * Batch 6 of companion entries from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 140-162 (islamweb bookid=60) — the Prophet's wives
 * and daughters. Content-id 139 (كسرى) is not a companion and content-id
 * 163 (زوجاته صلى الله عليه وسلم) is a group header; both are skipped.
 * Content-ids 144-151 are not separate biographies — they are continued
 * virtue/hadith sub-sections still under Aisha's entry (id 143), confirmed
 * by fetching that range directly.
 *
 * Unlike batches 1-5, most of this batch's entries already have a Neo4j
 * Person node — they were hardcoded years ago in corePeopleQueries
 * (graphSeedData.ts) as the Prophet's wives/daughters, but had no Postgres
 * profile until prisma/personSeedData9.ts. For those, this file adds ONLY
 * new relation edges (when the page supports a genuine gap or a new
 * ancestor connection) — no new CREATE (:Person...) line is written for any
 * of them. This is the exact pattern batch 5 used for
 * al-abbas-ibn-abd-al-muttalib and abu-sufyan-ibn-harb (see
 * graphSeedData7.ts's header).
 *
 * The 13 existing-node entries and what was done for each:
 *   - khadijah-bint-khuwaylid (140): her own page confirms her father is
 *     Khuwaylid ibn Asad ibn Abd al-Uzza ibn Qusayy — the SAME existing
 *     "khuwaylid-ibn-asad" node (graphSeedData4.ts, Az-Zubayr ibn al-Awwam's
 *     grandfather; Khadijah is his paternal aunt). No new node — just the
 *     missing DAUGHTER/FATHER edge pair.
 *   - fatimah-al-zahra (142): no relation gap — already fully connected via
 *     corePeopleRelationsQueries (DAUGHTER to the Prophet, WIFE/HUSBAND to
 *     Ali, MOTHER-side edges to Hasan/Husayn/Umm Kulthum bint Ali/Zaynab
 *     bint Ali).
 *   - aisha-bint-abi-bakr (143): corePeopleRelationsQueries had only the
 *     child->parent DAUGHTER edge to abu-bakr-as-siddiq, never the reverse
 *     FATHER edge (unlike most other pairs in this batch, which follow the
 *     bidirectional convention). Gap filled below.
 *   - umm-salamah (152): her own page gives a full nasab — Hind bint Abi
 *     Umayyah ibn al-Mughirah ibn Abdullah ibn Umar ibn Makhzum — which
 *     reaches the SAME existing "al-mughirah-ibn-abdullah-ibn-umar" node
 *     (graphSeedData7.ts, ancestor of Ikrimah ibn Abi Jahl and Khalid ibn
 *     al-Walid). One new node (her immediate father, Abu Umayyah ibn
 *     al-Mughirah) plus edges up into that existing chain — this also
 *     confirms the page's own note that she was a cousin of Khalid ibn
 *     al-Walid and Abu Jahl.
 *   - zaynab-bint-jahsh (153) / zaynab-bint-khuzaymah (154): see
 *     disambiguation note below. Profile only, no new relations.
 *   - umm-habibah (155): father-link to abu-sufyan-ibn-harb already added in
 *     batch 4 (graphSeedData6.ts) — not duplicated here.
 *   - hafsa-bint-umar (157): same one-directional gap as Aisha above — only
 *     DAUGHTER to umar-ibn-al-khattab existed, FATHER filled in below.
 *   - safiyyah-bint-huyayy (158): her father Huyayy ibn Akhtab is a Jewish
 *     leader of Banu al-Nadir, not part of the Quraysh/Ansari tree — no
 *     ancestor node created, no relation gap to fill.
 *   - maymunah-bint-al-harith (159): profile only. (Her own page notes she
 *     was maternal aunt of Khalid ibn al-Walid and of Ibn Abbas, and sister
 *     of Umm al-Fadl — none of those are existing nodes/slugs in this
 *     pipeline, so no relation was added; flagged in the report for a
 *     possible future pass.)
 *   - zaynab-bint-muhammad (160): the entry deferred from batch 4 (content-id
 *     84 was skipped there specifically for this). Her reverse FATHER edge
 *     from prophet-muhammad was independently added by a concurrent fix to
 *     corePeopleRelationsQueries (graphSeedData.ts, direction-bug cleanup)
 *     while this batch was in progress — not duplicated here. Two other
 *     gaps filled below: a WIFE/HUSBAND pair to abu-al-as-ibn-al-rabi (her
 *     own page: "تزوجها في حياة أمها ابن خالتها أبو العاص"), and a
 *     MOTHER/DAUGHTER pair to umamah-bint-abi-al-as (batch 4 created
 *     Umamah's DAUGHTER/FATHER edge to Abu al-Ass but explicitly deferred
 *     the maternal edge to Zaynab's own future full entry — this is that
 *     entry).
 *   - ruqayyah-bint-muhammad (161) / umm-kulthum-bint-muhammad (162): both
 *     already have a full WIFE/HUSBAND edge pair to uthman-ibn-affan in
 *     corePeopleRelationsQueries — confirmed by their own pages, not
 *     duplicated.
 *
 * Disambiguation — content-ids 153/154 ("زينب أم المؤمنين" twice): the book
 * gives two separate entries under the same title, matching the two
 * existing "Zaynab" wife nodes. Resolved by fetching each page's own
 * opening nasab line verbatim:
 *   - id 153: "زينب أم المؤمنين بنت جحش بن رياب" — this is Zaynab bint
 *     Jahsh, matching the existing "zaynab-bint-jahsh" node.
 *   - id 154: "زَيْنَبُ أُمُّ الْمُؤْمِنِينَ بِنْتُ خُزَيْمَةَ بْنِ الْحَارِثِ
 *     بْنِ عَبْدِ اللَّهِ الْهِلَالِيَّةُ" with the explicit epithet
 *     "أُمَّ الْمَسَاكِينِ لِكَثْرَةِ مَعْرُوفِهَا" (Mother of the Poor, for
 *     her abundant charity) — this is Zaynab bint Khuzaymah, matching the
 *     existing "zaynab-bint-khuzaymah" node. (An initial AI-summarized fetch
 *     of id 153 wrongly attributed the "Umm al-Masakin" epithet to her —
 *     caught and corrected by re-fetching both pages for verbatim Arabic.)
 *
 * Two brand-new profiles + graph nodes in this batch:
 *   - fatimah-bint-asad (141): Fatimah bint Asad ibn Hashim ibn Abd Manaf,
 *     mother of Ali ibn Abi Talib — NOT the same person as Fatimah al-Zahra
 *     (id 142). Her own page's nasab reaches the existing "hashim-ibn-abd-
 *     manaf" node (graphSeedData2.ts) via one new ancestor node (Asad ibn
 *     Hashim). Her page explicitly states "والدة علي بن أبي طالب" (mother
 *     of Ali ibn Abi Talib) — a direct MOTHER/SON edge pair to the existing
 *     ali-ibn-abi-talib node is added on that basis. A WIFE/HUSBAND edge
 *     pair to the existing abu-talib node is also added, but note this is
 *     NOT literally stated on her own page (which never says "married Abu
 *     Talib") — it's inferred from her being named mother of "Ali ibn Abi
 *     Talib" together with Ali's already-established FATHER edge to
 *     abu-talib (graphSeedData2.ts). Flagged for a human to double-check.
 *   - umm-ayman (156): Barakah, the Prophet's Abyssinian freedwoman/nurse.
 *     Her own page gives no father/tribe at all ("no paternal lineage is
 *     provided anywhere in the biographical entry") — no ancestor chain
 *     created, same precedent as salim-mawla-abi-hudhayfah (graphSeedData3.ts)
 *     and abu-rafi (graphSeedData7.ts). Her page does explicitly name her
 *     second husband as Zaid ibn Harithah (an existing node,
 *     graphSeedData4.ts) — a WIFE/HUSBAND edge pair is added on that basis.
 *     Her first husband (Ubayd ibn al-Harith al-Khazraji) and her sons by
 *     both marriages (Ayman; Usama ibn Zaid) are not in this pipeline and
 *     are not created here.
 *
 * Ordering note: fatimah-bint-asad and umm-ayman's own Person nodes are not
 * created here — they come from `npm run people:sync -- --apply` picking up
 * the PostgreSQL profiles in prisma/personSeedData9.ts. Run that sync before
 * `npm run seed:graph`, or the MATCH clauses linking them to their
 * ancestors/relations below will silently find nothing to attach to.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Fatimah bint Asad's father (new ancestor node; connects to the existing
  // hashim-ibn-abd-manaf node from graphSeedData2.ts)
  'CREATE (:Person { name: "أسد بن هاشم", slug: "asad-ibn-hashim", fullName: "أسد بن هاشم بن عبد مناف بن قصي القرشي الهاشمي" });',

  // Umm Salamah's father (new ancestor node; connects to the existing
  // al-mughirah-ibn-abdullah-ibn-umar node from graphSeedData7.ts)
  'CREATE (:Person { name: "أبو أمية بن المغيرة", slug: "abi-umayyah-ibn-al-mughirah", fullName: "أبو أمية بن المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Khadijah bint Khuwaylid — gap-fill: existing core node, no father edge.
  // Her father is the SAME khuwaylid-ibn-asad node created in
  // graphSeedData4.ts for Az-Zubayr ibn al-Awwam (she is his paternal aunt).
  'MATCH (from:Person {slug: "khadijah-bint-khuwaylid"}), (to:Person {slug: "khuwaylid-ibn-asad"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "khuwaylid-ibn-asad"}), (to:Person {slug: "khadijah-bint-khuwaylid"}) CREATE (from)-[:FATHER]->(to);',

  // Fatimah bint Asad — new node, new ancestor chain
  'MATCH (from:Person {slug: "fatimah-bint-asad"}), (to:Person {slug: "asad-ibn-hashim"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "asad-ibn-hashim"}), (to:Person {slug: "fatimah-bint-asad"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "asad-ibn-hashim"}), (to:Person {slug: "hashim-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hashim-ibn-abd-manaf"}), (to:Person {slug: "asad-ibn-hashim"}) CREATE (from)-[:FATHER]->(to);',

  // Fatimah bint Asad — her own page: "والدة علي بن أبي طالب" (mother of
  // Ali ibn Abi Talib)
  'MATCH (from:Person {slug: "ali-ibn-abi-talib"}), (to:Person {slug: "fatimah-bint-asad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "fatimah-bint-asad"}), (to:Person {slug: "ali-ibn-abi-talib"}) CREATE (from)-[:MOTHER]->(to);',

  // Fatimah bint Asad — WIFE/HUSBAND to Abu Talib: NOT literally stated on
  // her own page, inferred from her being named "mother of Ali ibn Abi
  // Talib" together with Ali's already-established FATHER edge to
  // abu-talib (graphSeedData2.ts). Flagged in the batch report.
  'MATCH (from:Person {slug: "fatimah-bint-asad"}), (to:Person {slug: "abu-talib"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "abu-talib"}), (to:Person {slug: "fatimah-bint-asad"}) CREATE (from)-[:HUSBAND]->(to);',

  // Aisha bint Abi Bakr — gap-fill: existing core node had only the child->
  // parent DAUGHTER edge to abu-bakr-as-siddiq, never the reverse FATHER
  // edge (corePeopleRelationsQueries, graphSeedData.ts).
  'MATCH (from:Person {slug: "abu-bakr-as-siddiq"}), (to:Person {slug: "aisha-bint-abi-bakr"}) CREATE (from)-[:FATHER]->(to);',

  // Umm Salamah — her own page's nasab reaches the existing al-mughirah-
  // ibn-abdullah-ibn-umar node (graphSeedData7.ts), confirming the page's
  // own note that she was a cousin of Khalid ibn al-Walid and Abu Jahl.
  'MATCH (from:Person {slug: "umm-salamah"}), (to:Person {slug: "abi-umayyah-ibn-al-mughirah"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abi-umayyah-ibn-al-mughirah"}), (to:Person {slug: "umm-salamah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abi-umayyah-ibn-al-mughirah"}), (to:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}), (to:Person {slug: "abi-umayyah-ibn-al-mughirah"}) CREATE (from)-[:FATHER]->(to);',

  // Umm Ayman — new node, no ancestor chain (freedwoman, no recorded
  // nasab). Her own page names her second husband as Zaid ibn Harithah
  // (existing node, graphSeedData4.ts).
  'MATCH (from:Person {slug: "umm-ayman"}), (to:Person {slug: "zaid-ibn-harithah"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-harithah"}), (to:Person {slug: "umm-ayman"}) CREATE (from)-[:HUSBAND]->(to);',

  // Hafsa bint Umar — gap-fill: same one-directional issue as Aisha above.
  'MATCH (from:Person {slug: "umar-ibn-al-khattab"}), (to:Person {slug: "hafsa-bint-umar"}) CREATE (from)-[:FATHER]->(to);',

  // Zaynab bint Muhammad — her reverse FATHER edge from prophet-muhammad
  // was independently added by a concurrent fix to corePeopleRelationsQueries
  // (graphSeedData.ts) while this batch was in progress; not duplicated here.

  // Zaynab bint Muhammad — WIFE/HUSBAND to Abu al-Ass ibn al-Rabi: her own
  // page states "تزوجها في حياة أمها ابن خالتها أبو العاص" (her maternal
  // cousin Abu al-Ass married her during her mother's lifetime).
  'MATCH (from:Person {slug: "zaynab-bint-muhammad"}), (to:Person {slug: "abu-al-as-ibn-al-rabi"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "abu-al-as-ibn-al-rabi"}), (to:Person {slug: "zaynab-bint-muhammad"}) CREATE (from)-[:HUSBAND]->(to);',

  // Zaynab bint Muhammad — MOTHER/DAUGHTER to Umamah bint Abi al-Ass:
  // deliberately deferred in batch 4 (graphSeedData7.ts) pending Zaynab's
  // own full entry; filled in now.
  'MATCH (from:Person {slug: "umamah-bint-abi-al-as"}), (to:Person {slug: "zaynab-bint-muhammad"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "zaynab-bint-muhammad"}), (to:Person {slug: "umamah-bint-abi-al-as"}) CREATE (from)-[:MOTHER]->(to);',
];
