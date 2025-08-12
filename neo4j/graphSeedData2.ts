/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  'CREATE (:Person { name: "عبد الله بن عبد المطلب", slug: "abdullah-ibn-abd-al-muttalib", fullName: "عبد الله بن عبد المطلب بن هاشم بن عبد مناف بن قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "عبد المطلب بن هاشم", slug: "abd-al-muttalib-ibn-hashim", fullName: "عبد المطلب بن هاشم بن عبد مناف بن قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "هاشم بن عبد مناف", slug: "hashim-ibn-abd-manaf", fullName: "هاشم بن عبد مناف بن قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "عبد مناف بن قصي", slug: "abd-manaf-ibn-qusay", fullName: "عبد مناف بن قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "قصي بن كلاب", slug: "qusay-ibn-kilab", fullName: "قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "كلاب بن مرة", slug: "kilab-ibn-murra", fullName: "كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "مرة بن كعب", slug: "murra-ibn-kaab", fullName: "مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "كعب بن لؤي", slug: "kaab-ibn-luay", fullName: "كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "لؤي بن غالب", slug: "luay-ibn-ghalib", fullName: "لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "غالب بن فهر", slug: "ghalib-ibn-fahar", fullName: "غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "فهر بن مالك", slug: "fahar-ibn-malik", fullName: "فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "مالك بن النضر", slug: "malik-ibn-an-nadr", fullName: "مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "النضر بن كنانة", slug: "an-nadr-ibn-kinanah", fullName: "النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "كنانة بن خزيمة", slug: "kinanah-ibn-khuzayma", fullName: "كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "خزيمة بن مدركة", slug: "khuzayma-ibn-mudrika", fullName: "خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "مدركة بن إلياس", slug: "mudrika-ibn-ilias", fullName: "مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "إلياس بن مضر", slug: "ilias-ibn-mudar", fullName: "إلياس بن مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "مضر بن نزار", slug: "mudar-ibn-nizar", fullName: "مضر بن نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "نزار بن معد", slug: "nizar-ibn-maad", fullName: "نزار بن معد بن عدنان." });',
  'CREATE (:Person { name: "معد بن عدنان", slug: "maad-ibn-adnan", fullName: "معد بن عدنان." });',
  'CREATE (:Person { name: "عثمان بن عامر", slug: "uthman-ibn-amir", fullName: "عثمان بن عامر بن عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشي التيمي" });',
  'CREATE (:Person { name: "عامر بن عمرو", slug: "amir-ibn-amr", fullName: "عامر بن عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشي التيمي" });',
  'CREATE (:Person { name: "عمرو بن كعب", slug: "amr-ibn-kaab", fullName: "عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشي التيمي" });',
  'CREATE (:Person { name: "كعب بن سعد", slug: "kaab-ibn-saad", fullName: "كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشي التيمي" });',
  'CREATE (:Person { name: "سعد بن تيم", slug: "saad-ibn-taym", fullName: "سعد بن تيم بن مرة بن كعب بن لؤي القرشي التيمي" });',
  'CREATE (:Person { name: "تيم بن مرة", slug: "taym-ibn-murrah", fullName: "تيم بن مرة بن كعب بن لؤي القرشي التيمي" });',
  'CREATE (:Person { name: "عمر بن الخطاب", slug: "umar-ibn-al-khattab", fullName: "عمر بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "الخطاب بن نفيل", slug: "al-khattab-ibn-nufayl", fullName: "الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "نفيل بن عبد العزى", slug: "nufayl-ibn-abd-al-uzza", fullName: "نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "عبد العزى بن رياح", slug: "abd-al-uzza-ibn-riyah", fullName: "عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "رياح بن قرط", slug: "riyah-ibn-qurt", fullName: "رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "قرط بن رزاح", slug: "qurt-ibn-razah", fullName: "قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "رزاح بن عدي", slug: "razah-ibn-adi", fullName: "رزاح بن عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "عدي بن كعب", slug: "adi-ibn-kaab", fullName: "عدي بن كعب بن لؤي القرشي العدوي" });',
  'CREATE (:Person { name: "عفان بن أبي العاص", slug: "affan-ibn-abi-al-as", fullName: "عفان بن أبي العاص بن أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "أبي العاص بن أمية", slug: "abi-al-as-ibn-umayya", fullName: "أبي العاص بن أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "أمية بن عبد شمس", slug: "umayya-ibn-abd-shams", fullName: "أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "عبد شمس بن عبد مناف", slug: "abd-shams-ibn-abd-manaf", fullName: "عبد شمس بن عبد مناف القرشي" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  'MATCH (from:Person {slug: "abdullah-ibn-abd-al-muttalib"}), (to:Person {slug: "prophet-muhammad"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "prophet-muhammad"}), (to:Person {slug: "abdullah-ibn-abd-al-muttalib"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "abdullah-ibn-abd-al-muttalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-abd-al-muttalib"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "hashim-ibn-abd-manaf"}), (to:Person {slug: "abd-al-muttalib-ibn-hashim"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-al-muttalib-ibn-hashim"}), (to:Person {slug: "hashim-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "abd-manaf-ibn-qusay"}), (to:Person {slug: "hashim-ibn-abd-manaf"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "hashim-ibn-abd-manaf"}), (to:Person {slug: "abd-manaf-ibn-qusay"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "qusay-ibn-kilab"}), (to:Person {slug: "abd-manaf-ibn-qusay"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-manaf-ibn-qusay"}), (to:Person {slug: "qusay-ibn-kilab"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "kilab-ibn-murra"}), (to:Person {slug: "qusay-ibn-kilab"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "qusay-ibn-kilab"}), (to:Person {slug: "kilab-ibn-murra"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "murra-ibn-kaab"}), (to:Person {slug: "kilab-ibn-murra"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kilab-ibn-murra"}), (to:Person {slug: "murra-ibn-kaab"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "kaab-ibn-luay"}), (to:Person {slug: "murra-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "murra-ibn-kaab"}), (to:Person {slug: "kaab-ibn-luay"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "luay-ibn-ghalib"}), (to:Person {slug: "kaab-ibn-luay"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-luay"}), (to:Person {slug: "luay-ibn-ghalib"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "ghalib-ibn-fahar"}), (to:Person {slug: "luay-ibn-ghalib"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "luay-ibn-ghalib"}), (to:Person {slug: "ghalib-ibn-fahar"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "fahar-ibn-malik"}), (to:Person {slug: "ghalib-ibn-fahar"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "ghalib-ibn-fahar"}), (to:Person {slug: "fahar-ibn-malik"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-an-nadr"}), (to:Person {slug: "fahar-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "fahar-ibn-malik"}), (to:Person {slug: "malik-ibn-an-nadr"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "an-nadr-ibn-kinanah"}), (to:Person {slug: "malik-ibn-an-nadr"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-an-nadr"}), (to:Person {slug: "an-nadr-ibn-kinanah"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "kinanah-ibn-khuzayma"}), (to:Person {slug: "an-nadr-ibn-kinanah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "an-nadr-ibn-kinanah"}), (to:Person {slug: "kinanah-ibn-khuzayma"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "khuzayma-ibn-mudrika"}), (to:Person {slug: "kinanah-ibn-khuzayma"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kinanah-ibn-khuzayma"}), (to:Person {slug: "khuzayma-ibn-mudrika"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "mudrika-ibn-ilias"}), (to:Person {slug: "khuzayma-ibn-mudrika"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "khuzayma-ibn-mudrika"}), (to:Person {slug: "mudrika-ibn-ilias"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "ilias-ibn-mudar"}), (to:Person {slug: "mudrika-ibn-ilias"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "mudrika-ibn-ilias"}), (to:Person {slug: "ilias-ibn-mudar"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "mudar-ibn-nizar"}), (to:Person {slug: "ilias-ibn-mudar"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "ilias-ibn-mudar"}), (to:Person {slug: "mudar-ibn-nizar"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "nizar-ibn-maad"}), (to:Person {slug: "mudar-ibn-nizar"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "mudar-ibn-nizar"}), (to:Person {slug: "nizar-ibn-maad"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "maad-ibn-adnan"}), (to:Person {slug: "nizar-ibn-maad"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "nizar-ibn-maad"}), (to:Person {slug: "maad-ibn-adnan"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "amir-ibn-amr"}), (to:Person {slug: "abu-bakr-as-siddiq"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abu-bakr-as-siddiq"}), (to:Person {slug: "amir-ibn-amr"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "amir-ibn-amr"}), (to:Person {slug: "uthman-ibn-amir"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-amir"}), (to:Person {slug: "amir-ibn-amr"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-kaab"}), (to:Person {slug: "amir-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amir-ibn-amr"}), (to:Person {slug: "amr-ibn-kaab"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "kaab-ibn-saad"}), (to:Person {slug: "amr-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-kaab"}), (to:Person {slug: "kaab-ibn-saad"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "saad-ibn-taym"}), (to:Person {slug: "kaab-ibn-saad"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-saad"}), (to:Person {slug: "saad-ibn-taym"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "taym-ibn-murrah"}), (to:Person {slug: "saad-ibn-taym"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "saad-ibn-taym"}), (to:Person {slug: "taym-ibn-murrah"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "al-khattab-ibn-nufayl"}), (to:Person {slug: "umar-ibn-al-khattab"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umar-ibn-al-khattab"}), (to:Person {slug: "al-khattab-ibn-nufayl"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "nufayl-ibn-abd-al-uzza"}), (to:Person {slug: "al-khattab-ibn-nufayl"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "al-khattab-ibn-nufayl"}), (to:Person {slug: "nufayl-ibn-abd-al-uzza"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "abd-al-uzza-ibn-riyah"}), (to:Person {slug: "nufayl-ibn-abd-al-uzza"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "nufayl-ibn-abd-al-uzza"}), (to:Person {slug: "abd-al-uzza-ibn-riyah"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "riyah-ibn-qurt"}), (to:Person {slug: "abd-al-uzza-ibn-riyah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-al-uzza-ibn-riyah"}), (to:Person {slug: "riyah-ibn-qurt"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "qurt-ibn-razah"}), (to:Person {slug: "riyah-ibn-qurt"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "riyah-ibn-qurt"}), (to:Person {slug: "qurt-ibn-razah"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "razah-ibn-adi"}), (to:Person {slug: "qurt-ibn-razah"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "qurt-ibn-razah"}), (to:Person {slug: "razah-ibn-adi"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "adi-ibn-kaab"}), (to:Person {slug: "razah-ibn-adi"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "razah-ibn-adi"}), (to:Person {slug: "adi-ibn-kaab"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "affan-ibn-abi-al-as"}), (to:Person {slug: "uthman-ibn-affan"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "uthman-ibn-affan"}), (to:Person {slug: "affan-ibn-abi-al-as"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "abi-al-as-ibn-umayya"}), (to:Person {slug: "affan-ibn-abi-al-as"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "affan-ibn-abi-al-as"}), (to:Person {slug: "abi-al-as-ibn-umayya"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "umayya-ibn-abd-shams"}), (to:Person {slug: "abi-al-as-ibn-umayya"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abi-al-as-ibn-umayya"}), (to:Person {slug: "umayya-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "abd-shams-ibn-abd-manaf"}), (to:Person {slug: "umayya-ibn-abd-shams"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "umayya-ibn-abd-shams"}), (to:Person {slug: "abd-shams-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',

  'MATCH (from:Person {slug: "abd-manaf-ibn-qusay"}), (to:Person {slug: "abd-shams-ibn-abd-manaf"}) CREATE (from)-[:FATHER]->(to);',
  'MATCH (from:Person {slug: "abd-shams-ibn-abd-manaf"}), (to:Person {slug: "abd-manaf-ibn-qusay"}) CREATE (from)-[:SON]->(to);',
];
