/**
 * Ancestor chains and family relations sourced from "سير أعلام النبلاء"
 * (al-Dhahabi) for batch 12 (the final batch) of newly added companions
 * (prisma/personSeedData15.ts): fadalah-ibn-ubayd, abu-mahdhurah-al-jumahi,
 * muawiyah-ibn-abi-sufyan, adi-ibn-hatim, zaid-ibn-arqam, abu-said-al-khudri,
 * safinah, jundub-ibn-abdullah-al-bajali, jundub-al-azdi, al-nabighah-al-jadi,
 * amr-ibn-umayyah-al-damri, rafi-ibn-khudayj, samurah-ibn-jundub,
 * jabir-ibn-samurah, habib-ibn-maslamah, jabir-ibn-abdullah, al-baraa-ibn-azib.
 *
 * Four entries connect to existing Person nodes:
 *   - muawiyah-ibn-abi-sufyan is son of the existing abu-sufyan-ibn-harb;
 *     his mother Hind bint Utbah (new node) is daughter of the existing
 *     utbah-ibn-rabiah, making Muawiyah a full brother of the existing Umm
 *     Habibah (already noted as a "full sister" of Abu Sufyan's children in
 *     an earlier batch — both parents are now modelled).
 *   - abu-said-al-khudri is the maternal brother of the existing Qatadah
 *     ibn al-Numan (batch 8), per his own page — the connection anticipated
 *     in that batch's notes.
 *   - jabir-ibn-abdullah is son of the existing Abdullah ibn Amr ibn Haram
 *     (martyred at Uhud) — his own page's nasab matches that companion's
 *     fullName exactly, no new ancestor node needed.
 *   - al-baraa-ibn-azib's maternal uncle is the existing Abu Burdah ibn
 *     Niyar, explicit on his own page.
 *
 * This is the last batch sourced from this book — content-id 316 (al-Bara
 * ibn Azib) is the final entry in its Companions tree.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Muawiyah ibn Abi Sufyan's mother, reaching the existing utbah-ibn-rabiah
  'CREATE (:Person { name: "هند بنت عتبة", slug: "hind-bint-utbah", fullName: "هند بنت عتبة بن ربيعة بن عبد شمس بن عبد مناف بن قصي القرشية العبشمية" });',
];

/**
 * An array of Cypher queries to create all relationships between people.
 * Each item in the array is a single MATCH/CREATE query.
 */
export const peopleRelationsQueries = [
  // Muawiyah ibn Abi Sufyan
  'MATCH (from:Person {slug: "muawiyah-ibn-abi-sufyan"}), (to:Person {slug: "abu-sufyan-ibn-harb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-sufyan-ibn-harb"}), (to:Person {slug: "muawiyah-ibn-abi-sufyan"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hind-bint-utbah"}), (to:Person {slug: "utbah-ibn-rabiah"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "utbah-ibn-rabiah"}), (to:Person {slug: "hind-bint-utbah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hind-bint-utbah"}), (to:Person {slug: "abu-sufyan-ibn-harb"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "abu-sufyan-ibn-harb"}), (to:Person {slug: "hind-bint-utbah"}) CREATE (from)-[:HUSBAND]->(to);',
  'MATCH (from:Person {slug: "hind-bint-utbah"}), (to:Person {slug: "muawiyah-ibn-abi-sufyan"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "muawiyah-ibn-abi-sufyan"}), (to:Person {slug: "hind-bint-utbah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hind-bint-utbah"}), (to:Person {slug: "umm-habibah"}) CREATE (from)-[:MOTHER]->(to);',
  'MATCH (from:Person {slug: "umm-habibah"}), (to:Person {slug: "hind-bint-utbah"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "muawiyah-ibn-abi-sufyan"}), (to:Person {slug: "umm-habibah"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "umm-habibah"}), (to:Person {slug: "muawiyah-ibn-abi-sufyan"}) CREATE (from)-[:SISTER]->(to);',

  // Abu Said al-Khudri — maternal brother of the existing Qatadah ibn al-Numan
  'MATCH (from:Person {slug: "abu-said-al-khudri"}), (to:Person {slug: "qatadah-ibn-al-numan"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "qatadah-ibn-al-numan"}), (to:Person {slug: "abu-said-al-khudri"}) CREATE (from)-[:BROTHER]->(to);',

  // Jabir ibn Abdullah — son of the existing Abdullah ibn Amr ibn Haram
  'MATCH (from:Person {slug: "jabir-ibn-abdullah"}), (to:Person {slug: "abdullah-ibn-amr-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-amr-ibn-haram"}), (to:Person {slug: "jabir-ibn-abdullah"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Baraa ibn Azib — maternal nephew of the existing Abu Burdah ibn Niyar
  'MATCH (from:Person {slug: "abu-bardah-ibn-niyar"}), (to:Person {slug: "al-baraa-ibn-azib"}) CREATE (from)-[:MATERNAL_UNCLE]->(to);',
  'MATCH (from:Person {slug: "al-baraa-ibn-azib"}), (to:Person {slug: "abu-bardah-ibn-niyar"}) CREATE (from)-[:MATERNAL_NEPHEW]->(to);',
];
