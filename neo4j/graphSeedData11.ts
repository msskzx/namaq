/**
 * Ancestor chains and family relations sourced from "سير أعلام النبلاء"
 * (al-Dhahabi) for batch 9 of newly added companions (prisma/personSeedData12.ts):
 * abu-ayyub-al-ansari, abdullah-ibn-salam, zaid-ibn-thabit, tamim-al-dari,
 * abu-qatadah-al-ansari, amr-ibn-absah, shaddad-ibn-aws,
 * uqbah-ibn-amir-al-juhani, buraidah-ibn-al-husayb, abd-al-rahman-ibn-abi-bakr,
 * al-hakam-ibn-amr-al-ghifari, rafi-ibn-amr-al-ghifari,
 * rafi-ibn-amr-al-ghifari-akhu-aidh, al-arqam-ibn-abi-al-arqam,
 * abu-humayd-al-saidi, abdullah-ibn-al-arqam, abdullah-ibn-mughaffal,
 * khuzaymah-ibn-thabit, awf-ibn-malik-al-ashjai,
 * muayqib-ibn-abi-fatimah-al-dawsi, abu-masud-al-badri, usamah-ibn-zaid,
 * imran-ibn-husain, hassan-ibn-thabit, kaab-ibn-malik.
 *
 * Several entries in this batch reuse existing ancestor nodes from earlier
 * batches, reaching them via new graph-only intermediate nodes (never
 * Companions, no Postgres profile):
 *   - zaid-ibn-thabit's paternal chain (Thabit ibn al-Dahhak ibn Zaid ibn
 *     Lawdhan ibn Amr ibn Abd Awf ibn Ghanm...) reaches the existing
 *     ghanm-ibn-malik node (graphSeedData5.ts) via five new nodes.
 *   - hassan-ibn-thabit's paternal chain (Thabit ibn al-Mundhir ibn Haram...)
 *     reaches the existing haram-ibn-amr node (graphSeedData7.ts) via two
 *     new nodes. shaddad-ibn-aws's own chain (ibn Aws ibn Thabit ibn
 *     al-Mundhir ibn Haram) shares the same "Thabit ibn al-Mundhir" node —
 *     his page explicitly calls him Hassan's nephew, modelled here as
 *     Shaddad's father (Aws, new node) being Hassan's brother, both sons of
 *     the shared Thabit ibn al-Mundhir node.
 *   - kaab-ibn-malik's paternal chain (ibn Abi Kaab/Amr ibn al-Qayn ibn Kaab
 *     ibn Sawad ibn Ghanm...) reaches the existing ghanm-ibn-kaab node
 *     (graphSeedData5.ts) via four new nodes.
 *   - al-arqam-ibn-abi-al-arqam's paternal chain (Abd Manaf/Abu al-Arqam ibn
 *     Asad ibn Abdullah ibn Umar ibn Makhzum) reaches the existing
 *     abdullah-ibn-umar-ibn-makhzum node (graphSeedData3.ts) via two new
 *     nodes.
 *   - abdullah-ibn-al-arqam's paternal chain (ibn Abd Yaghuth ibn Wahb ibn
 *     Abd Manaf ibn Zuhrah) reaches the existing abd-manaf-ibn-zuhrah node
 *     (graphSeedData3.ts) via two new nodes.
 *
 * Three entries connect directly to existing Person nodes with no new
 * ancestor needed:
 *   - usamah-ibn-zaid is son of the existing zaid-ibn-harithah and (per his
 *     own page) the existing umm-ayman.
 *   - abd-al-rahman-ibn-abi-bakr is son of the existing abu-bakr-as-siddiq
 *     and, per his own page ("shaqiq Aisha"), full sibling of the existing
 *     aisha-bint-abi-bakr.
 *   - zaid-ibn-thabit's wife Umm Sad bint Sad ibn al-Rabi (new graph-only
 *     node, not her own entry) is daughter of the existing companion
 *     saad-ibn-al-rabi.
 *
 * Same-name collision disambiguated by the book's own distinguishing fact,
 * following the existing convention: content-id 229's "رافع بن عمرو
 * الغفاري" is a second, distinct companion from content-id 228's — see
 * personSeedData12.ts's header note — slugged
 * rafi-ibn-amr-al-ghifari-akhu-aidh after his one distinguishing fact
 * (brother of A'idh).
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Zaid ibn Thabit's paternal chain down to the existing ghanm-ibn-malik
  'CREATE (:Person { name: "ثابت بن الضحاك", slug: "thabit-ibn-al-dahhak", fullName: "ثابت بن الضحاك بن زيد بن لوذان الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "الضحاك بن زيد", slug: "al-dahhak-ibn-zaid", fullName: "الضحاك بن زيد بن لوذان بن عمرو الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "زيد بن لوذان", slug: "zaid-ibn-lawdhan", fullName: "زيد بن لوذان بن عمرو بن عبد عوف الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "لوذان بن عمرو", slug: "lawdhan-ibn-amr", fullName: "لوذان بن عمرو بن عبد عوف بن غنم الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "عمرو بن عبد عوف", slug: "amr-ibn-abd-awf-al-najjari", fullName: "عمرو بن عبد عوف بن غنم بن مالك الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "عبد عوف بن غنم", slug: "abd-awf-ibn-ghanm-al-najjari", fullName: "عبد عوف بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري" });',

  // Zaid ibn Thabit's wife, daughter of the existing companion Saad ibn al-Rabi
  'CREATE (:Person { name: "أم سعد بنت سعد بن الربيع", slug: "umm-saad-bint-saad-ibn-al-rabi", fullName: "أم سعد بنت سعد بن الربيع الأنصارية" });',

  // Hassan ibn Thabit / Shaddad ibn Aws's shared paternal chain down to the
  // existing haram-ibn-amr, plus Shaddad's father (Hassan's brother)
  'CREATE (:Person { name: "المنذر بن حرام", slug: "al-mundhir-ibn-haram", fullName: "المنذر بن حرام بن عمرو بن زيد مناة الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "ثابت بن المنذر", slug: "thabit-ibn-al-mundhir", fullName: "ثابت بن المنذر بن حرام الأنصاري الخزرجي النجاري" });',
  'CREATE (:Person { name: "أوس بن ثابت", slug: "aws-ibn-thabit", fullName: "أوس بن ثابت بن المنذر بن حرام الأنصاري الخزرجي النجاري" });',

  // Ka'b ibn Malik's paternal chain down to the existing ghanm-ibn-kaab
  'CREATE (:Person { name: "سواد بن غنم", slug: "sawad-ibn-ghanm", fullName: "سواد بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "كعب بن سواد", slug: "kaab-ibn-sawad", fullName: "كعب بن سواد بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "القين بن كعب", slug: "al-qayn-ibn-kaab", fullName: "القين بن كعب بن سواد بن غنم الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "عمرو بن القين", slug: "malik-ibn-al-qayn", fullName: "عمرو بن القين بن كعب بن سواد الأنصاري الخزرجي السلمي، ويكنى أبا كعب ويعرف بمالك" });',

  // Al-Arqam ibn Abi al-Arqam's paternal chain down to the existing
  // abdullah-ibn-umar-ibn-makhzum
  'CREATE (:Person { name: "أسد بن عبد الله", slug: "asad-ibn-abdullah-ibn-umar", fullName: "أسد بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "عبد مناف بن أسد", slug: "abd-manaf-ibn-asad-al-makhzumi", fullName: "عبد مناف بن أسد بن عبد الله بن عمر بن مخزوم القرشي المخزومي، ويكنى أبا الأرقم" });',

  // Abdullah ibn al-Arqam's paternal chain down to the existing
  // abd-manaf-ibn-zuhrah
  'CREATE (:Person { name: "وهب بن عبد مناف", slug: "wahb-ibn-abd-manaf-al-zuhri", fullName: "وهب بن عبد مناف بن زهرة القرشي الزهري" });',
  'CREATE (:Person { name: "عبد يغوث بن وهب", slug: "abd-yaghuth-ibn-wahb", fullName: "عبد يغوث بن وهب بن عبد مناف بن زهرة القرشي الزهري" });',
];

/**
 * An array of Cypher queries to create all relationships between people.
 * Each item in the array is a single MATCH/CREATE query.
 */
export const peopleRelationsQueries = [
  // Zaid ibn Thabit's paternal chain
  'MATCH (from:Person {slug: "zaid-ibn-thabit"}), (to:Person {slug: "thabit-ibn-al-dahhak"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thabit-ibn-al-dahhak"}), (to:Person {slug: "zaid-ibn-thabit"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "thabit-ibn-al-dahhak"}), (to:Person {slug: "al-dahhak-ibn-zaid"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-dahhak-ibn-zaid"}), (to:Person {slug: "thabit-ibn-al-dahhak"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "al-dahhak-ibn-zaid"}), (to:Person {slug: "zaid-ibn-lawdhan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-lawdhan"}), (to:Person {slug: "al-dahhak-ibn-zaid"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-lawdhan"}), (to:Person {slug: "lawdhan-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "lawdhan-ibn-amr"}), (to:Person {slug: "zaid-ibn-lawdhan"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "lawdhan-ibn-amr"}), (to:Person {slug: "amr-ibn-abd-awf-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-abd-awf-al-najjari"}), (to:Person {slug: "lawdhan-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-abd-awf-al-najjari"}), (to:Person {slug: "abd-awf-ibn-ghanm-al-najjari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-awf-ibn-ghanm-al-najjari"}), (to:Person {slug: "amr-ibn-abd-awf-al-najjari"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-awf-ibn-ghanm-al-najjari"}), (to:Person {slug: "ghanm-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghanm-ibn-malik"}), (to:Person {slug: "abd-awf-ibn-ghanm-al-najjari"}) CREATE (from)-[:FATHER]->(to);',

  // Zaid ibn Thabit's wife, daughter of the existing Saad ibn al-Rabi
  'MATCH (from:Person {slug: "umm-saad-bint-saad-ibn-al-rabi"}), (to:Person {slug: "saad-ibn-al-rabi"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-al-rabi"}), (to:Person {slug: "umm-saad-bint-saad-ibn-al-rabi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umm-saad-bint-saad-ibn-al-rabi"}), (to:Person {slug: "zaid-ibn-thabit"}) CREATE (from)-[:WIFE]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-thabit"}), (to:Person {slug: "umm-saad-bint-saad-ibn-al-rabi"}) CREATE (from)-[:HUSBAND]->(to);',

  // Hassan ibn Thabit / Shaddad ibn Aws's shared paternal chain
  'MATCH (from:Person {slug: "hassan-ibn-thabit"}), (to:Person {slug: "thabit-ibn-al-mundhir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thabit-ibn-al-mundhir"}), (to:Person {slug: "hassan-ibn-thabit"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "aws-ibn-thabit"}), (to:Person {slug: "thabit-ibn-al-mundhir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thabit-ibn-al-mundhir"}), (to:Person {slug: "aws-ibn-thabit"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "thabit-ibn-al-mundhir"}), (to:Person {slug: "al-mundhir-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-mundhir-ibn-haram"}), (to:Person {slug: "thabit-ibn-al-mundhir"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "al-mundhir-ibn-haram"}), (to:Person {slug: "haram-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haram-ibn-amr"}), (to:Person {slug: "al-mundhir-ibn-haram"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "shaddad-ibn-aws"}), (to:Person {slug: "aws-ibn-thabit"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "aws-ibn-thabit"}), (to:Person {slug: "shaddad-ibn-aws"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hassan-ibn-thabit"}), (to:Person {slug: "aws-ibn-thabit"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "aws-ibn-thabit"}), (to:Person {slug: "hassan-ibn-thabit"}) CREATE (from)-[:BROTHER]->(to);',

  // Ka'b ibn Malik's paternal chain
  'MATCH (from:Person {slug: "kaab-ibn-malik"}), (to:Person {slug: "malik-ibn-al-qayn"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-al-qayn"}), (to:Person {slug: "kaab-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-al-qayn"}), (to:Person {slug: "al-qayn-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-qayn-ibn-kaab"}), (to:Person {slug: "malik-ibn-al-qayn"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "al-qayn-ibn-kaab"}), (to:Person {slug: "kaab-ibn-sawad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-sawad"}), (to:Person {slug: "al-qayn-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-sawad"}), (to:Person {slug: "sawad-ibn-ghanm"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "sawad-ibn-ghanm"}), (to:Person {slug: "kaab-ibn-sawad"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "sawad-ibn-ghanm"}), (to:Person {slug: "ghanm-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghanm-ibn-kaab"}), (to:Person {slug: "sawad-ibn-ghanm"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Arqam ibn Abi al-Arqam's paternal chain
  'MATCH (from:Person {slug: "al-arqam-ibn-abi-al-arqam"}), (to:Person {slug: "abd-manaf-ibn-asad-al-makhzumi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-asad-al-makhzumi"}), (to:Person {slug: "al-arqam-ibn-abi-al-arqam"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-asad-al-makhzumi"}), (to:Person {slug: "asad-ibn-abdullah-ibn-umar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "asad-ibn-abdullah-ibn-umar"}), (to:Person {slug: "abd-manaf-ibn-asad-al-makhzumi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "asad-ibn-abdullah-ibn-umar"}), (to:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}), (to:Person {slug: "asad-ibn-abdullah-ibn-umar"}) CREATE (from)-[:FATHER]->(to);',

  // Abdullah ibn al-Arqam's paternal chain
  'MATCH (from:Person {slug: "abdullah-ibn-al-arqam"}), (to:Person {slug: "abd-yaghuth-ibn-wahb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-yaghuth-ibn-wahb"}), (to:Person {slug: "abdullah-ibn-al-arqam"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-yaghuth-ibn-wahb"}), (to:Person {slug: "wahb-ibn-abd-manaf-al-zuhri"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "wahb-ibn-abd-manaf-al-zuhri"}), (to:Person {slug: "abd-yaghuth-ibn-wahb"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "wahb-ibn-abd-manaf-al-zuhri"}), (to:Person {slug: "abd-manaf-ibn-zuhrah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-zuhrah"}), (to:Person {slug: "wahb-ibn-abd-manaf-al-zuhri"}) CREATE (from)-[:FATHER]->(to);',

  // Usamah ibn Zaid — son of the existing Zaid ibn Harithah and Umm Ayman
  'MATCH (from:Person {slug: "usamah-ibn-zaid"}), (to:Person {slug: "zaid-ibn-harithah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-harithah"}), (to:Person {slug: "usamah-ibn-zaid"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "usamah-ibn-zaid"}), (to:Person {slug: "umm-ayman"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umm-ayman"}), (to:Person {slug: "usamah-ibn-zaid"}) CREATE (from)-[:MOTHER]->(to);',

  // Abd al-Rahman ibn Abi Bakr — son of the existing Abu Bakr, full sibling
  // of the existing Aisha bint Abi Bakr
  'MATCH (from:Person {slug: "abd-al-rahman-ibn-abi-bakr"}), (to:Person {slug: "abu-bakr-as-siddiq"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-bakr-as-siddiq"}), (to:Person {slug: "abd-al-rahman-ibn-abi-bakr"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-al-rahman-ibn-abi-bakr"}), (to:Person {slug: "aisha-bint-abi-bakr"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "aisha-bint-abi-bakr"}), (to:Person {slug: "abd-al-rahman-ibn-abi-bakr"}) CREATE (from)-[:SISTER]->(to);',

  // Al-Hakam ibn Amr al-Ghifari / Rafi ibn Amr al-Ghifari — brothers
  'MATCH (from:Person {slug: "al-hakam-ibn-amr-al-ghifari"}), (to:Person {slug: "rafi-ibn-amr-al-ghifari"}) CREATE (from)-[:BROTHER]->(to);',
  'MATCH (from:Person {slug: "rafi-ibn-amr-al-ghifari"}), (to:Person {slug: "al-hakam-ibn-amr-al-ghifari"}) CREATE (from)-[:BROTHER]->(to);',
];
