/**
 * Ancestor chains and family relations sourced from "سير أعلام النبلاء"
 * (al-Dhahabi) for batch 10 of newly added companions
 * (prisma/personSeedData13.ts): jarir-ibn-abdullah, abu-al-yusr-al-ansari,
 * abu-usayd-al-saidi, huwaytib-ibn-abd-al-uzza, said-ibn-yarbu-al-qurashi,
 * makhramah-ibn-nawfal, abu-al-ghadiyah, safwan-ibn-al-muattal,
 * dihyah-al-kalbi, abu-jahm-ibn-hudhayfah, safwan-ibn-umayyah,
 * abu-thalabah-al-khushani, abd-al-rahman-ibn-samurah, wail-ibn-hujr,
 * abu-waqid-al-laythi, maqil-ibn-yasar, maqil-ibn-sinan-al-ashjai,
 * abu-hurayrah.
 *
 * Three entries reuse existing ancestor nodes from earlier batches, reached
 * via new graph-only intermediate nodes (never Companions, no Postgres
 * profile):
 *   - makhramah-ibn-nawfal's paternal chain (ibn Nawfal ibn Uhayb...)
 *     reaches the existing uhayb-ibn-abd-manaf node (graphSeedData3.ts) via
 *     one new node.
 *   - safwan-ibn-umayyah's paternal chain (ibn Umayyah ibn Khalaf ibn Wahb...)
 *     reaches the existing wahb-ibn-hudhafah node (graphSeedData3.ts) via
 *     two new nodes.
 *   - abd-al-rahman-ibn-samurah's paternal chain, per al-Zubayr ibn Bakkar's
 *     fuller variant (ibn Samurah ibn Habib ibn Rabiah ibn Abd Shams —
 *     see personSeedData13.ts's note on the two reported chains), reaches
 *     the existing rabiah-ibn-abd-shams node (graphSeedData3.ts) via two
 *     new nodes.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Makhramah ibn Nawfal's paternal chain down to the existing uhayb-ibn-abd-manaf
  'CREATE (:Person { name: "نوفل بن أهيب", slug: "nawfal-ibn-uhayb", fullName: "نوفل بن أهيب بن عبد مناف بن زهرة القرشي الزهري" });',

  // Safwan ibn Umayyah's paternal chain down to the existing wahb-ibn-hudhafah
  'CREATE (:Person { name: "أمية بن خلف", slug: "umayyah-ibn-khalaf", fullName: "أمية بن خلف بن وهب بن حذافة القرشي الجمحي" });',
  'CREATE (:Person { name: "خلف بن وهب", slug: "khalaf-ibn-wahb", fullName: "خلف بن وهب بن حذافة بن جمح القرشي الجمحي" });',

  // Abd al-Rahman ibn Samurah's paternal chain down to the existing rabiah-ibn-abd-shams
  'CREATE (:Person { name: "سمرة بن حبيب", slug: "samurah-ibn-habib", fullName: "سمرة بن حبيب بن ربيعة بن عبد شمس القرشي العبشمي" });',
  'CREATE (:Person { name: "حبيب بن ربيعة", slug: "habib-ibn-rabiah", fullName: "حبيب بن ربيعة بن عبد شمس القرشي العبشمي" });',
];

/**
 * An array of Cypher queries to create all relationships between people.
 * Each item in the array is a single MATCH/CREATE query.
 */
export const peopleRelationsQueries = [
  // Makhramah ibn Nawfal's paternal chain
  'MATCH (from:Person {slug: "makhramah-ibn-nawfal"}), (to:Person {slug: "nawfal-ibn-uhayb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nawfal-ibn-uhayb"}), (to:Person {slug: "makhramah-ibn-nawfal"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "nawfal-ibn-uhayb"}), (to:Person {slug: "uhayb-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uhayb-ibn-abd-manaf"}), (to:Person {slug: "nawfal-ibn-uhayb"}) CREATE (from)-[:FATHER]->(to);',

  // Safwan ibn Umayyah's paternal chain
  'MATCH (from:Person {slug: "safwan-ibn-umayyah"}), (to:Person {slug: "umayyah-ibn-khalaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umayyah-ibn-khalaf"}), (to:Person {slug: "safwan-ibn-umayyah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umayyah-ibn-khalaf"}), (to:Person {slug: "khalaf-ibn-wahb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khalaf-ibn-wahb"}), (to:Person {slug: "umayyah-ibn-khalaf"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "khalaf-ibn-wahb"}), (to:Person {slug: "wahb-ibn-hudhafah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "wahb-ibn-hudhafah"}), (to:Person {slug: "khalaf-ibn-wahb"}) CREATE (from)-[:FATHER]->(to);',

  // Abd al-Rahman ibn Samurah's paternal chain
  'MATCH (from:Person {slug: "abd-al-rahman-ibn-samurah"}), (to:Person {slug: "samurah-ibn-habib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "samurah-ibn-habib"}), (to:Person {slug: "abd-al-rahman-ibn-samurah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "samurah-ibn-habib"}), (to:Person {slug: "habib-ibn-rabiah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "habib-ibn-rabiah"}), (to:Person {slug: "samurah-ibn-habib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "habib-ibn-rabiah"}), (to:Person {slug: "rabiah-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "rabiah-ibn-abd-shams"}), (to:Person {slug: "habib-ibn-rabiah"}) CREATE (from)-[:FATHER]->(to);',
];
