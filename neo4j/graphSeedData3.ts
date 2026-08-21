/**
 * Ancestor chains sourced from "سير أعلام النبلاء" (al-Dhahabi), filling in
 * the missing parent nodes for companions that already exist as Person
 * profiles but had no FATHER/SON chain in the graph:
 *   - abu-ubaydah-ibn-al-jarrah, talhah-ibn-ubaydullah, az-zubayr-ibn-al-awwam,
 *     abdur-rahman-ibn-awf, saad-ibn-abi-waqqas, saeed-ibn-zaid
 *     (raw nasab text for these six lives in neo4j/peopleRaw.ts)
 * plus the ancestor chains for batch 1 of newly added companions
 * (prisma/personSeedData4.ts): musab-ibn-umayr, abu-salamah, uthman-ibn-mazun,
 * qudamah-ibn-mazun, abdullah-ibn-mazun-al-jumahi, as-saib-ibn-uthman,
 * abu-hudhayfah, aqil-ibn-al-bukayr, khalid-ibn-al-bukayr.
 * (salim-mawla-abi-hudhayfah is a Persian freedman with no recorded nasab —
 * intentionally has no ancestor chain here.)
 *
 * Chains stop as soon as they reach a slug that already exists elsewhere in
 * the graph (graphSeedData.ts / graphSeedData2.ts), e.g. qusay-ibn-kilab,
 * kilab-ibn-murra, murra-ibn-kaab, kaab-ibn-luay, fahar-ibn-malik,
 * kinanah-ibn-khuzayma, nufayl-ibn-abd-al-uzza, abd-shams-ibn-abd-manaf,
 * amr-ibn-kaab. Several Quraysh ancestor names repeat across branches
 * (e.g. more than one "Abd Manaf" or "Hashim"); slugs below are
 * disambiguated by their actual father so they never collide with an
 * existing, unrelated node of the same name.
 *
 * Ordering note: the batch-1 companions themselves (musab-ibn-umayr,
 * abu-salamah, uthman-ibn-mazun, etc.) are not created here — their Person
 * nodes come from `npm run people:sync -- --apply` picking up the
 * PostgreSQL profiles in prisma/personSeedData4.ts. Run that sync before
 * `npm run seed:graph`, or the MATCH clauses linking them to their
 * ancestors below will silently find nothing to attach to.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Abu Ubaydah ibn al-Jarrah
  'CREATE (:Person { name: "عبد الله بن الجراح", slug: "abdullah-ibn-al-jarrah", fullName: "عبد الله بن الجراح بن هلال بن أهيب بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "الجراح بن هلال", slug: "al-jarrah-ibn-hilal", fullName: "الجراح بن هلال بن أهيب بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "هلال بن أهيب", slug: "hilal-ibn-uhayb", fullName: "هلال بن أهيب بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "أهيب بن ضبة", slug: "uhayb-ibn-dabbah", fullName: "أهيب بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "ضبة بن الحارث", slug: "dabbah-ibn-al-harith", fullName: "ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "الحارث بن فهر", slug: "al-harith-ibn-fahr", fullName: "الحارث بن فهر بن مالك القرشي الفهري" });',

  // Talhah ibn Ubaydullah
  'CREATE (:Person { name: "عبيد الله بن عثمان", slug: "ubaydullah-ibn-uthman", fullName: "عبيد الله بن عثمان بن عمرو بن كعب بن سعد بن تيم القرشي التيمي" });',
  'CREATE (:Person { name: "عثمان بن عمرو", slug: "uthman-ibn-amr", fullName: "عثمان بن عمرو بن كعب بن سعد بن تيم القرشي التيمي" });',

  // Az-Zubayr ibn al-Awwam
  'CREATE (:Person { name: "العوام بن خويلد", slug: "al-awwam-ibn-khuwaylid", fullName: "العوام بن خويلد بن أسد بن عبد العزى بن قصي القرشي الأسدي" });',
  'CREATE (:Person { name: "خويلد بن أسد", slug: "khuwaylid-ibn-asad", fullName: "خويلد بن أسد بن عبد العزى بن قصي القرشي الأسدي" });',
  'CREATE (:Person { name: "أسد بن عبد العزى", slug: "asad-ibn-abd-al-uzza", fullName: "أسد بن عبد العزى بن قصي القرشي الأسدي" });',
  'CREATE (:Person { name: "عبد العزى بن قصي", slug: "abd-al-uzza-ibn-qusay", fullName: "عبد العزى بن قصي بن كلاب القرشي" });',

  // Abdur-Rahman ibn Awf
  'CREATE (:Person { name: "عوف بن عبد عوف", slug: "awf-ibn-abd-awf", fullName: "عوف بن عبد عوف بن عبد بن الحارث بن زهرة القرشي الزهري" });',
  'CREATE (:Person { name: "عبد عوف بن عبد", slug: "abd-awf-ibn-abd", fullName: "عبد عوف بن عبد بن الحارث بن زهرة القرشي الزهري" });',
  'CREATE (:Person { name: "عبد بن الحارث", slug: "abd-ibn-al-harith-ibn-zuhrah", fullName: "عبد بن الحارث بن زهرة القرشي الزهري" });',
  'CREATE (:Person { name: "الحارث بن زهرة", slug: "al-harith-ibn-zuhrah", fullName: "الحارث بن زهرة بن كلاب القرشي الزهري" });',
  'CREATE (:Person { name: "زهرة بن كلاب", slug: "zuhrah-ibn-kilab", fullName: "زهرة بن كلاب بن مرة القرشي الزهري" });',

  // Saad ibn Abi Waqqas (shares zuhrah-ibn-kilab above)
  'CREATE (:Person { name: "مالك بن أهيب (أبو وقاص)", slug: "malik-ibn-uhayb", fullName: "مالك بن أهيب بن عبد مناف بن زهرة القرشي الزهري" });',
  'CREATE (:Person { name: "أهيب بن عبد مناف", slug: "uhayb-ibn-abd-manaf", fullName: "أهيب بن عبد مناف بن زهرة القرشي الزهري" });',
  'CREATE (:Person { name: "عبد مناف بن زهرة", slug: "abd-manaf-ibn-zuhrah", fullName: "عبد مناف بن زهرة بن كلاب القرشي الزهري" });',

  // Saeed ibn Zaid
  'CREATE (:Person { name: "زيد بن عمرو", slug: "zaid-ibn-amr", fullName: "زيد بن عمرو بن نفيل بن عبد العزى القرشي العدوي" });',
  'CREATE (:Person { name: "عمرو بن نفيل", slug: "amr-ibn-nufayl", fullName: "عمرو بن نفيل بن عبد العزى القرشي العدوي" });',

  // Musab ibn Umayr
  'CREATE (:Person { name: "عمير بن هاشم", slug: "umayr-ibn-hashim", fullName: "عمير بن هاشم بن عبد مناف بن عبد الدار بن قصي القرشي العبدري" });',
  'CREATE (:Person { name: "هاشم بن عبد مناف", slug: "hashim-ibn-abd-manaf-al-abdari", fullName: "هاشم بن عبد مناف بن عبد الدار بن قصي القرشي العبدري" });',
  'CREATE (:Person { name: "عبد مناف بن عبد الدار", slug: "abd-manaf-ibn-abd-al-dar", fullName: "عبد مناف بن عبد الدار بن قصي القرشي العبدري" });',
  'CREATE (:Person { name: "عبد الدار بن قصي", slug: "abd-al-dar-ibn-qusay", fullName: "عبد الدار بن قصي بن كلاب القرشي" });',

  // Abu Salamah
  'CREATE (:Person { name: "عبد الأسد بن هلال", slug: "abd-al-asad-ibn-hilal", fullName: "عبد الأسد بن هلال بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "هلال بن عبد الله", slug: "hilal-ibn-abdullah-al-makhzumi", fullName: "هلال بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "عبد الله بن عمر", slug: "abdullah-ibn-umar-ibn-makhzum", fullName: "عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "عمر بن مخزوم", slug: "umar-ibn-makhzum", fullName: "عمر بن مخزوم بن يقظة القرشي المخزومي" });',
  'CREATE (:Person { name: "مخزوم بن يقظة", slug: "makhzum-ibn-yaqzah", fullName: "مخزوم بن يقظة بن مرة القرشي" });',
  'CREATE (:Person { name: "يقظة بن مرة", slug: "yaqzah-ibn-murrah", fullName: "يقظة بن مرة بن كعب القرشي" });',

  // Uthman ibn Mazun (and siblings Qudamah, Abdullah)
  'CREATE (:Person { name: "مظعون بن حبيب", slug: "mazun-ibn-habib", fullName: "مظعون بن حبيب بن وهب بن حذافة بن جمح القرشي الجمحي" });',
  'CREATE (:Person { name: "حبيب بن وهب", slug: "habib-ibn-wahb", fullName: "حبيب بن وهب بن حذافة بن جمح القرشي الجمحي" });',
  'CREATE (:Person { name: "وهب بن حذافة", slug: "wahb-ibn-hudhafah", fullName: "وهب بن حذافة بن جمح القرشي الجمحي" });',
  'CREATE (:Person { name: "حذافة بن جمح", slug: "hudhafah-ibn-jumah", fullName: "حذافة بن جمح بن عمرو القرشي الجمحي" });',
  'CREATE (:Person { name: "جمح بن عمرو", slug: "jumah-ibn-amr", fullName: "جمح بن عمرو بن هصيص القرشي" });',
  'CREATE (:Person { name: "عمرو بن هصيص", slug: "amr-ibn-husays", fullName: "عمرو بن هصيص بن كعب القرشي" });',
  'CREATE (:Person { name: "هصيص بن كعب", slug: "husays-ibn-kaab", fullName: "هصيص بن كعب بن لؤي القرشي" });',

  // Abu Hudhayfah
  'CREATE (:Person { name: "عتبة بن ربيعة", slug: "utbah-ibn-rabiah", fullName: "عتبة بن ربيعة بن عبد شمس بن عبد مناف القرشي العبشمي" });',
  'CREATE (:Person { name: "ربيعة بن عبد شمس", slug: "rabiah-ibn-abd-shams", fullName: "ربيعة بن عبد شمس بن عبد مناف القرشي العبشمي" });',

  // Aqil ibn al-Bukayr and Khalid ibn al-Bukayr (brothers)
  'CREATE (:Person { name: "البكير بن عبد ياليل", slug: "al-bukayr-ibn-abd-yalil", fullName: "البكير بن عبد ياليل بن ناشب بن غيرة بن سعد بن ليث الليثي الكناني" });',
  'CREATE (:Person { name: "عبد ياليل بن ناشب", slug: "abd-yalil-ibn-nashib", fullName: "عبد ياليل بن ناشب بن غيرة بن سعد بن ليث الليثي الكناني" });',
  'CREATE (:Person { name: "ناشب بن غيرة", slug: "nashib-ibn-ghirah", fullName: "ناشب بن غيرة بن سعد بن ليث الليثي الكناني" });',
  'CREATE (:Person { name: "غيرة بن سعد", slug: "ghirah-ibn-saad", fullName: "غيرة بن سعد بن ليث الليثي الكناني" });',
  'CREATE (:Person { name: "سعد بن ليث", slug: "saad-ibn-layth", fullName: "سعد بن ليث بن بكير الليثي الكناني" });',
  'CREATE (:Person { name: "ليث بن بكير", slug: "layth-ibn-bukayr", fullName: "ليث بن بكير بن عبد مناة الكناني" });',
  'CREATE (:Person { name: "بكير بن عبد مناة", slug: "bukayr-ibn-abd-manat", fullName: "بكير بن عبد مناة بن كنانة الكناني" });',
  'CREATE (:Person { name: "عبد مناة بن كنانة", slug: "abd-manat-ibn-kinanah", fullName: "عبد مناة بن كنانة الكناني" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Abu Ubaydah ibn al-Jarrah
  'MATCH (from:Person {slug: "abu-ubaydah-ibn-al-jarrah"}), (to:Person {slug: "abdullah-ibn-al-jarrah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-al-jarrah"}), (to:Person {slug: "abu-ubaydah-ibn-al-jarrah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abdullah-ibn-al-jarrah"}), (to:Person {slug: "al-jarrah-ibn-hilal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-jarrah-ibn-hilal"}), (to:Person {slug: "abdullah-ibn-al-jarrah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-jarrah-ibn-hilal"}), (to:Person {slug: "hilal-ibn-uhayb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hilal-ibn-uhayb"}), (to:Person {slug: "al-jarrah-ibn-hilal"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hilal-ibn-uhayb"}), (to:Person {slug: "uhayb-ibn-dabbah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uhayb-ibn-dabbah"}), (to:Person {slug: "hilal-ibn-uhayb"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "uhayb-ibn-dabbah"}), (to:Person {slug: "dabbah-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "dabbah-ibn-al-harith"}), (to:Person {slug: "uhayb-ibn-dabbah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "dabbah-ibn-al-harith"}), (to:Person {slug: "al-harith-ibn-fahr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-fahr"}), (to:Person {slug: "dabbah-ibn-al-harith"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-harith-ibn-fahr"}), (to:Person {slug: "fahar-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "fahar-ibn-malik"}), (to:Person {slug: "al-harith-ibn-fahr"}) CREATE (from)-[:FATHER]->(to);',

  // Talhah ibn Ubaydullah
  'MATCH (from:Person {slug: "talhah-ibn-ubaydullah"}), (to:Person {slug: "ubaydullah-ibn-uthman"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ubaydullah-ibn-uthman"}), (to:Person {slug: "talhah-ibn-ubaydullah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ubaydullah-ibn-uthman"}), (to:Person {slug: "uthman-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-amr"}), (to:Person {slug: "ubaydullah-ibn-uthman"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "uthman-ibn-amr"}), (to:Person {slug: "amr-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-kaab"}), (to:Person {slug: "uthman-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  // Az-Zubayr ibn al-Awwam
  'MATCH (from:Person {slug: "az-zubayr-ibn-al-awwam"}), (to:Person {slug: "al-awwam-ibn-khuwaylid"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-awwam-ibn-khuwaylid"}), (to:Person {slug: "az-zubayr-ibn-al-awwam"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-awwam-ibn-khuwaylid"}), (to:Person {slug: "khuwaylid-ibn-asad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khuwaylid-ibn-asad"}), (to:Person {slug: "al-awwam-ibn-khuwaylid"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "khuwaylid-ibn-asad"}), (to:Person {slug: "asad-ibn-abd-al-uzza"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "asad-ibn-abd-al-uzza"}), (to:Person {slug: "khuwaylid-ibn-asad"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "asad-ibn-abd-al-uzza"}), (to:Person {slug: "abd-al-uzza-ibn-qusay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-uzza-ibn-qusay"}), (to:Person {slug: "asad-ibn-abd-al-uzza"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-al-uzza-ibn-qusay"}), (to:Person {slug: "qusay-ibn-kilab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qusay-ibn-kilab"}), (to:Person {slug: "abd-al-uzza-ibn-qusay"}) CREATE (from)-[:FATHER]->(to);',

  // Abdur-Rahman ibn Awf
  'MATCH (from:Person {slug: "abdur-rahman-ibn-awf"}), (to:Person {slug: "awf-ibn-abd-awf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "awf-ibn-abd-awf"}), (to:Person {slug: "abdur-rahman-ibn-awf"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "awf-ibn-abd-awf"}), (to:Person {slug: "abd-awf-ibn-abd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-awf-ibn-abd"}), (to:Person {slug: "awf-ibn-abd-awf"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-awf-ibn-abd"}), (to:Person {slug: "abd-ibn-al-harith-ibn-zuhrah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-ibn-al-harith-ibn-zuhrah"}), (to:Person {slug: "abd-awf-ibn-abd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-ibn-al-harith-ibn-zuhrah"}), (to:Person {slug: "al-harith-ibn-zuhrah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-harith-ibn-zuhrah"}), (to:Person {slug: "abd-ibn-al-harith-ibn-zuhrah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-harith-ibn-zuhrah"}), (to:Person {slug: "zuhrah-ibn-kilab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zuhrah-ibn-kilab"}), (to:Person {slug: "al-harith-ibn-zuhrah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zuhrah-ibn-kilab"}), (to:Person {slug: "kilab-ibn-murra"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kilab-ibn-murra"}), (to:Person {slug: "zuhrah-ibn-kilab"}) CREATE (from)-[:FATHER]->(to);',

  // Saad ibn Abi Waqqas
  'MATCH (from:Person {slug: "saad-ibn-abi-waqqas"}), (to:Person {slug: "malik-ibn-uhayb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-uhayb"}), (to:Person {slug: "saad-ibn-abi-waqqas"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-uhayb"}), (to:Person {slug: "uhayb-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uhayb-ibn-abd-manaf"}), (to:Person {slug: "malik-ibn-uhayb"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "uhayb-ibn-abd-manaf"}), (to:Person {slug: "abd-manaf-ibn-zuhrah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-zuhrah"}), (to:Person {slug: "uhayb-ibn-abd-manaf"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-manaf-ibn-zuhrah"}), (to:Person {slug: "zuhrah-ibn-kilab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zuhrah-ibn-kilab"}), (to:Person {slug: "abd-manaf-ibn-zuhrah"}) CREATE (from)-[:FATHER]->(to);',

  // Saeed ibn Zaid
  'MATCH (from:Person {slug: "saeed-ibn-zaid"}), (to:Person {slug: "zaid-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zaid-ibn-amr"}), (to:Person {slug: "saeed-ibn-zaid"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zaid-ibn-amr"}), (to:Person {slug: "amr-ibn-nufayl"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-nufayl"}), (to:Person {slug: "zaid-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-nufayl"}), (to:Person {slug: "nufayl-ibn-abd-al-uzza"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nufayl-ibn-abd-al-uzza"}), (to:Person {slug: "amr-ibn-nufayl"}) CREATE (from)-[:FATHER]->(to);',

  // Musab ibn Umayr
  'MATCH (from:Person {slug: "musab-ibn-umayr"}), (to:Person {slug: "umayr-ibn-hashim"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umayr-ibn-hashim"}), (to:Person {slug: "musab-ibn-umayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "umayr-ibn-hashim"}), (to:Person {slug: "hashim-ibn-abd-manaf-al-abdari"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hashim-ibn-abd-manaf-al-abdari"}), (to:Person {slug: "umayr-ibn-hashim"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hashim-ibn-abd-manaf-al-abdari"}), (to:Person {slug: "abd-manaf-ibn-abd-al-dar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-abd-al-dar"}), (to:Person {slug: "hashim-ibn-abd-manaf-al-abdari"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-manaf-ibn-abd-al-dar"}), (to:Person {slug: "abd-al-dar-ibn-qusay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-dar-ibn-qusay"}), (to:Person {slug: "abd-manaf-ibn-abd-al-dar"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-al-dar-ibn-qusay"}), (to:Person {slug: "qusay-ibn-kilab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qusay-ibn-kilab"}), (to:Person {slug: "abd-al-dar-ibn-qusay"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Salamah
  'MATCH (from:Person {slug: "abu-salamah"}), (to:Person {slug: "abd-al-asad-ibn-hilal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-asad-ibn-hilal"}), (to:Person {slug: "abu-salamah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-al-asad-ibn-hilal"}), (to:Person {slug: "hilal-ibn-abdullah-al-makhzumi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hilal-ibn-abdullah-al-makhzumi"}), (to:Person {slug: "abd-al-asad-ibn-hilal"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hilal-ibn-abdullah-al-makhzumi"}), (to:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}), (to:Person {slug: "hilal-ibn-abdullah-al-makhzumi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}), (to:Person {slug: "umar-ibn-makhzum"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umar-ibn-makhzum"}), (to:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "umar-ibn-makhzum"}), (to:Person {slug: "makhzum-ibn-yaqzah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "makhzum-ibn-yaqzah"}), (to:Person {slug: "umar-ibn-makhzum"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "makhzum-ibn-yaqzah"}), (to:Person {slug: "yaqzah-ibn-murrah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "yaqzah-ibn-murrah"}), (to:Person {slug: "makhzum-ibn-yaqzah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "yaqzah-ibn-murrah"}), (to:Person {slug: "murra-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "murra-ibn-kaab"}), (to:Person {slug: "yaqzah-ibn-murrah"}) CREATE (from)-[:FATHER]->(to);',

  // Uthman ibn Mazun, Qudamah ibn Mazun, Abdullah ibn Mazun al-Jumahi (brothers)
  'MATCH (from:Person {slug: "uthman-ibn-mazun"}), (to:Person {slug: "mazun-ibn-habib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "mazun-ibn-habib"}), (to:Person {slug: "uthman-ibn-mazun"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "qudamah-ibn-mazun"}), (to:Person {slug: "mazun-ibn-habib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "mazun-ibn-habib"}), (to:Person {slug: "qudamah-ibn-mazun"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abdullah-ibn-mazun-al-jumahi"}), (to:Person {slug: "mazun-ibn-habib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "mazun-ibn-habib"}), (to:Person {slug: "abdullah-ibn-mazun-al-jumahi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "mazun-ibn-habib"}), (to:Person {slug: "habib-ibn-wahb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "habib-ibn-wahb"}), (to:Person {slug: "mazun-ibn-habib"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "habib-ibn-wahb"}), (to:Person {slug: "wahb-ibn-hudhafah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "wahb-ibn-hudhafah"}), (to:Person {slug: "habib-ibn-wahb"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "wahb-ibn-hudhafah"}), (to:Person {slug: "hudhafah-ibn-jumah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hudhafah-ibn-jumah"}), (to:Person {slug: "wahb-ibn-hudhafah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hudhafah-ibn-jumah"}), (to:Person {slug: "jumah-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "jumah-ibn-amr"}), (to:Person {slug: "hudhafah-ibn-jumah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "jumah-ibn-amr"}), (to:Person {slug: "amr-ibn-husays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-husays"}), (to:Person {slug: "jumah-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-husays"}), (to:Person {slug: "husays-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "husays-ibn-kaab"}), (to:Person {slug: "amr-ibn-husays"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "husays-ibn-kaab"}), (to:Person {slug: "kaab-ibn-luay"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-luay"}), (to:Person {slug: "husays-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',

  // As-Sa'ib ibn Uthman (son of Uthman ibn Mazun)
  'MATCH (from:Person {slug: "as-saib-ibn-uthman"}), (to:Person {slug: "uthman-ibn-mazun"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-mazun"}), (to:Person {slug: "as-saib-ibn-uthman"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Hudhayfah
  'MATCH (from:Person {slug: "abu-hudhayfah"}), (to:Person {slug: "utbah-ibn-rabiah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "utbah-ibn-rabiah"}), (to:Person {slug: "abu-hudhayfah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "utbah-ibn-rabiah"}), (to:Person {slug: "rabiah-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "rabiah-ibn-abd-shams"}), (to:Person {slug: "utbah-ibn-rabiah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "rabiah-ibn-abd-shams"}), (to:Person {slug: "abd-shams-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-shams-ibn-abd-manaf"}), (to:Person {slug: "rabiah-ibn-abd-shams"}) CREATE (from)-[:FATHER]->(to);',

  // Aqil ibn al-Bukayr and Khalid ibn al-Bukayr (brothers)
  'MATCH (from:Person {slug: "aqil-ibn-al-bukayr"}), (to:Person {slug: "al-bukayr-ibn-abd-yalil"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-bukayr-ibn-abd-yalil"}), (to:Person {slug: "aqil-ibn-al-bukayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "khalid-ibn-al-bukayr"}), (to:Person {slug: "al-bukayr-ibn-abd-yalil"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-bukayr-ibn-abd-yalil"}), (to:Person {slug: "khalid-ibn-al-bukayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-bukayr-ibn-abd-yalil"}), (to:Person {slug: "abd-yalil-ibn-nashib"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-yalil-ibn-nashib"}), (to:Person {slug: "al-bukayr-ibn-abd-yalil"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-yalil-ibn-nashib"}), (to:Person {slug: "nashib-ibn-ghirah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nashib-ibn-ghirah"}), (to:Person {slug: "abd-yalil-ibn-nashib"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "nashib-ibn-ghirah"}), (to:Person {slug: "ghirah-ibn-saad"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ghirah-ibn-saad"}), (to:Person {slug: "nashib-ibn-ghirah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ghirah-ibn-saad"}), (to:Person {slug: "saad-ibn-layth"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-layth"}), (to:Person {slug: "ghirah-ibn-saad"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "saad-ibn-layth"}), (to:Person {slug: "layth-ibn-bukayr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "layth-ibn-bukayr"}), (to:Person {slug: "saad-ibn-layth"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "layth-ibn-bukayr"}), (to:Person {slug: "bukayr-ibn-abd-manat"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "bukayr-ibn-abd-manat"}), (to:Person {slug: "layth-ibn-bukayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "bukayr-ibn-abd-manat"}), (to:Person {slug: "abd-manat-ibn-kinanah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-manat-ibn-kinanah"}), (to:Person {slug: "bukayr-ibn-abd-manat"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-manat-ibn-kinanah"}), (to:Person {slug: "kinanah-ibn-khuzayma"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kinanah-ibn-khuzayma"}), (to:Person {slug: "abd-manat-ibn-kinanah"}) CREATE (from)-[:FATHER]->(to);',
];
