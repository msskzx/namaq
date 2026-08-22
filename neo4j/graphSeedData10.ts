/**
 * Ancestor chains and family relations sourced from "سير أعلام النبلاء"
 * (al-Dhahabi) for batch 8 of newly added companions (prisma/personSeedData11.ts):
 * uthman-ibn-hunayf, khabbab-ibn-al-aratt, sahl-ibn-hunayf, khawwat-ibn-jubair,
 * abdullah-ibn-jubair, qatadah-ibn-al-numan, amir-ibn-rabiah, abu-al-darda,
 * iyad-ibn-ghanm, salamah-ibn-salamah, muadh-ibn-al-harith,
 * muawwidh-ibn-al-harith, awf-ibn-al-harith, hudhayfah-ibn-al-yaman,
 * muhammad-ibn-maslamah, uthman-ibn-abi-al-as, abdullah-ibn-zayd-ibn-abd-rabbih,
 * abdullah-ibn-zayd-al-najjari, harithah-ibn-al-numan, abu-musa-al-ashari.
 *
 * Four graph-only nodes (never Companions, no Postgres profile) created
 * because they're needed to connect entries in this batch:
 *   - al-harith-ibn-rifaah-al-najjari: father of the three "Banu Afra"
 *     brothers in this batch (Muadh, Muawwidh, Awf ibn al-Harith); nasab per
 *     Muadh's own page (Ibn Sa'd's version).
 *   - afra-bint-ubayd: their mother, the "Afra'" of the "ibna Afra'"
 *     tradition about killing Abu Jahl at Badr — named on Muadh's page.
 *   - hisl-ibn-jabir-al-absi: father of Hudhayfah ibn al-Yaman, known by the
 *     epithet "al-Yaman"; martyred at Uhud, killed by his own side by
 *     mistake, per Hudhayfah's page.
 *   - zabyah-bint-wahb: mother of Abu Musa al-Ashari, per his own page
 *     (Abu Ubayd's report that she accepted Islam and died in Medina).
 *
 * A fourth brother, "Rifaah", is intentionally NOT modelled alongside Muadh/
 * Muawwidh/Awf — see personSeedData11.ts's header note on content-id 208.
 *
 * Same-name collision disambiguated by nasab, following the existing
 * convention: the new "عثمان بن أبي العاص" (Thaqafi) is unrelated to the
 * existing abi-al-as-ibn-umayya (personSeedData2.ts, an Umayyad) and the two
 * new "عبد الله بن زيد" entries in this batch are disambiguated from each
 * other the same way (abdullah-ibn-zayd-ibn-abd-rabbih vs
 * abdullah-ibn-zayd-al-najjari).
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Father of Muadh/Muawwidh/Awf ibn al-Harith below
  'CREATE (:Person { name: "الحارث بن رفاعة", slug: "al-harith-ibn-rifaah-al-najjari", fullName: "الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري" });',

  // Mother of Muadh/Muawwidh/Awf ibn al-Harith below — the "Afra'" of the
  // "ibna Afra'" Badr tradition
  'CREATE (:Person { name: "عفراء بنت عبيد", slug: "afra-bint-ubayd", fullName: "عفراء بنت عبيد بن ثعلبة بن عبيد بن ثعلبة بن غنم بن مالك بن النجار" });',

  // Father of Hudhayfah ibn al-Yaman below, known as "al-Yaman"
  'CREATE (:Person { name: "حسل بن جابر", slug: "hisl-ibn-jabir-al-absi", fullName: "حسل بن جابر العبسي" });',

  // Mother of Abu Musa al-Ashari below
  'CREATE (:Person { name: "ظبية بنت وهب", slug: "zabyah-bint-wahb", fullName: "ظبية بنت وهب" });',
];

/**
 * An array of Cypher queries to create all relationships between people.
 * Each item in the array is a single MATCH/CREATE query.
 */
export const peopleRelationsQueries = [
  // Uthman ibn Hunayf / Sahl ibn Hunayf — brothers
  'MATCH (from:Person {slug: "uthman-ibn-hunayf"}), (to:Person {slug: "sahl-ibn-hunayf"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "sahl-ibn-hunayf"}), (to:Person {slug: "uthman-ibn-hunayf"}) CREATE (from)-[:BROTHER]->(to);',

  // Khawwat ibn Jubair / Abdullah ibn Jubair — brothers
  'MATCH (from:Person {slug: "khawwat-ibn-jubair"}), (to:Person {slug: "abdullah-ibn-jubair"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-jubair"}), (to:Person {slug: "khawwat-ibn-jubair"}) CREATE (from)-[:BROTHER]->(to);',

  // Muadh, Muawwidh, and Awf ibn al-Harith — sons of al-Harith ibn Rifaah
  // and Afra bint Ubayd, and brothers of each other
  'MATCH (from:Person {slug: "muadh-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-rifaah-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-rifaah-al-najjari"}), (to:Person {slug: "muadh-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "muadh-ibn-al-harith"}), (to:Person {slug: "afra-bint-ubayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "afra-bint-ubayd"}), (to:Person {slug: "muadh-ibn-al-harith"}) CREATE (from)-[:MOTHER]->(to);',

  'MATCH (from:Person {slug: "muawwidh-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-rifaah-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-rifaah-al-najjari"}), (to:Person {slug: "muawwidh-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "muawwidh-ibn-al-harith"}), (to:Person {slug: "afra-bint-ubayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "afra-bint-ubayd"}), (to:Person {slug: "muawwidh-ibn-al-harith"}) CREATE (from)-[:MOTHER]->(to);',

  'MATCH (from:Person {slug: "awf-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-rifaah-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-rifaah-al-najjari"}), (to:Person {slug: "awf-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "awf-ibn-al-harith"}), (to:Person {slug: "afra-bint-ubayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "afra-bint-ubayd"}), (to:Person {slug: "awf-ibn-al-harith"}) CREATE (from)-[:MOTHER]->(to);',

  'MATCH (from:Person {slug: "muadh-ibn-al-harith"}), (to:Person {slug: "muawwidh-ibn-al-harith"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "muawwidh-ibn-al-harith"}), (to:Person {slug: "muadh-ibn-al-harith"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "muadh-ibn-al-harith"}), (to:Person {slug: "awf-ibn-al-harith"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "awf-ibn-al-harith"}), (to:Person {slug: "muadh-ibn-al-harith"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "muawwidh-ibn-al-harith"}), (to:Person {slug: "awf-ibn-al-harith"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "awf-ibn-al-harith"}), (to:Person {slug: "muawwidh-ibn-al-harith"}) CREATE (from)-[:BROTHER]->(to);',

  // Hudhayfah ibn al-Yaman — son of Hisl ibn Jabir ("al-Yaman")
  'MATCH (from:Person {slug: "hudhayfah-ibn-al-yaman"}), (to:Person {slug: "hisl-ibn-jabir-al-absi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hisl-ibn-jabir-al-absi"}), (to:Person {slug: "hudhayfah-ibn-al-yaman"}) CREATE (from)-[:FATHER]->(to);',

  // Salamah ibn Salamah / Muhammad ibn Maslamah — paternal cousins (Salamah
  // is the son of Muhammad ibn Maslamah's paternal aunt)
  'MATCH (from:Person {slug: "salamah-ibn-salamah"}), (to:Person {slug: "muhammad-ibn-maslamah"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',
  'MATCH (from:Person {slug: "muhammad-ibn-maslamah"}), (to:Person {slug: "salamah-ibn-salamah"}) CREATE (from)-[:PATERNAL_COUSIN]->(to);',

  // Abu Musa al-Ashari — son of Zabyah bint Wahb
  'MATCH (from:Person {slug: "abu-musa-al-ashari"}), (to:Person {slug: "zabyah-bint-wahb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zabyah-bint-wahb"}), (to:Person {slug: "abu-musa-al-ashari"}) CREATE (from)-[:MOTHER]->(to);',
];
