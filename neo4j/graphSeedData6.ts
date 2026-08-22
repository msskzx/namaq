/**
 * Ancestor chains sourced from "سير أعلام النبلاء" (al-Dhahabi) for batch 4 of
 * newly added companions (prisma/personSeedData7.ts): tulayhah-ibn-khuwaylid,
 * saad-ibn-al-rabi, maan-ibn-adi, abdullah-ibn-abdullah-ibn-ubayy,
 * ikrimah-ibn-abi-jahl, abdullah-ibn-amr-ibn-haram, yazid-ibn-abi-sufyan,
 * abu-al-as-ibn-al-rabi, umamah-bint-abi-al-as, abu-zaid, abbad-ibn-bishr,
 * usayd-ibn-al-hudayr, at-tufayl-ibn-amr-ad-dawsi, ibn-umm-maktum,
 * khalid-ibn-al-walid, safwan-ibn-bayda, suhail-ibn-bayda, al-miqdad-ibn-amr,
 * ubayy-ibn-kaab, al-numan-ibn-muqarrin, ammar-ibn-yasir, muadh-ibn-jabal,
 * abdullah-ibn-masud, utbah-ibn-masud-al-hudhali, khubayb-ibn-yasaf,
 * uwaym-ibn-saidah. (bilal-ibn-rabah, an-najashi and salman-al-farisi have no
 * recorded/relevant nasab chain and need no entries here — same precedent as
 * salim-mawla-abi-hudhayfah in graphSeedData3.ts.)
 *
 * Chains stop as soon as they reach a slug that already exists elsewhere in
 * the graph. Several genuine collisions with earlier batches were found:
 *   - Ikrimah ibn Abi Jahl and Khalid ibn al-Walid are first cousins: both
 *     descend from al-Mughirah ibn Abdullah ibn Umar ibn Makhzum, and that
 *     Abdullah is the SAME "abdullah-ibn-umar-ibn-makhzum" already created in
 *     graphSeedData3.ts as an ancestor of Abu Salamah (his son there is
 *     Hilal, brother of this al-Mughirah).
 *   - Usayd ibn al-Hudayr's chain reaches "imru-al-qays-ibn-zayd" (existing,
 *     graphSeedData5.ts), the same Awsi Ashhali ancestor already used for
 *     Saad ibn Muadh — the two are close relatives.
 *   - Abdullah ibn Amr ibn Haram's chain reaches "haram-ibn-kaab" (existing,
 *     graphSeedData5.ts), already used for Amr ibn al-Jumuh and his sons —
 *     both families are from Banu Salamah of Khazraj.
 *   - Ubayy ibn Kaab's chain reaches "malik-ibn-al-najjar" (existing,
 *     graphSeedData5.ts), already used for Asad ibn Zurarah — both from Banu
 *     al-Najjar of Khazraj.
 *   - Safwan ibn Bayda' and Suhail ibn Bayda' (brothers) reach
 *     "dabbah-ibn-al-harith" (existing, graphSeedData3.ts), already an
 *     ancestor of Abu Ubaydah ibn al-Jarrah — both families are Banu Fihr.
 *   - Yazid ibn Abi Sufyan's chain reaches "umayya-ibn-abd-shams" (existing,
 *     graphSeedData2.ts); his new father node abu-sufyan-ibn-harb is also
 *     linked to the existing wife node "umm-habibah" (his full sister).
 *   - Abu al-Ass ibn al-Rabi's chain reaches "abd-shams-ibn-abd-manaf"
 *     (existing, graphSeedData2.ts).
 *   - Within this batch, Sa'd ibn al-Rabi' and Abu Zaid (Thabit ibn Zaid)
 *     share the same great-great-grandfather "Malik ibn Thalabah ibn Ka'b
 *     ibn al-Khazraj" (both Khazraj/Harithi) — modeled once and reused.
 *   - Within this batch, Abdullah ibn Mas'ud and his brother Utbah ibn
 *     Mas'ud al-Hudhali share the same father, modeled once and reused.
 *
 * Same-name collision disambiguated by father, following the existing
 * convention: the new "مالك بن امرئ القيس" (Sa'd ibn al-Rabi's ancestor,
 * Khazraj Harithi) would collide in plain form with the existing
 * "malik-ibn-imri-al-qays" (Thabit ibn Qais's ancestor, graphSeedData5.ts,
 * son of "Imru' al-Qays ibn Malik al-Aghar" — a different person of the same
 * name). Slugged "malik-ibn-imri-al-qays-al-harithi" to avoid the collision.
 *
 * Very deep pre-Islamic chains with no collision and no in-batch sharing
 * (Abdullah ibn Abdullah ibn Ubayy's Khazraj line, Ammar ibn Yasir's Madhhij
 * line, Muadh ibn Jabal's Khazraj line, Abdullah/Utbah ibn Mas'ud's Hudhayl
 * line, Khubayb ibn Yasaf's Khazraj line, Uwaym ibn Sa'idah's Aws line, and
 * al-Nu'man ibn Muqarrin's Muzaynah line) are truncated to one or two new
 * ancestor nodes whose fullName embeds the remaining reported generations as
 * plain text, rather than modeling every generation as its own node —
 * consistent with how earlier batches truncated at "a clear tribal/clan-
 * eponym point rather than reproducing the entire pre-Islamic genealogy".
 * Abdullah ibn Mas'ud's own page nasab in fact continues all the way to the
 * existing "mudrika-ibn-ilias" (Hudhayl and Khuzaymah were brothers, sons of
 * Mudrikah ibn Ilyas) but that link is not modeled here to avoid a
 * disproportionate ~12-node chain for one entry; noted for a future pass.
 *
 * No fullName in this batch is inferred from sibling placement — every
 * entry below has its own nasab, however short, stated directly on its own
 * page.
 *
 * Ordering note: the batch-4 companions themselves are not created here —
 * their Person nodes come from `npm run people:sync -- --apply` picking up
 * the PostgreSQL profiles in prisma/personSeedData7.ts. Run that sync before
 * `npm run seed:graph`, or the MATCH clauses linking them to their ancestors
 * below will silently find nothing to attach to.
 */

/**
 * An array of Cypher queries to create all Person nodes.
 * Each item in the array is a single CREATE query.
 */
export const peopleQueries = [
  // Tulayhah ibn Khuwaylid
  'CREATE (:Person { name: "خويلد بن نوفل", slug: "khuwaylid-ibn-nawfal", fullName: "خويلد بن نوفل الأسدي" });',

  // Sa'd ibn al-Rabi' and Abu Zaid (Thabit ibn Zaid) — shared Khazraj
  // Harithi ancestor "Malik ibn Thalabah ibn Ka'b ibn al-Khazraj"
  'CREATE (:Person { name: "الربيع بن عمرو", slug: "al-rabi-ibn-amr", fullName: "الربيع بن عمرو بن أبي زهير بن مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "عمرو بن أبي زهير", slug: "amr-ibn-abi-zuhayr", fullName: "عمرو بن أبي زهير بن مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "أبو زهير بن مالك", slug: "abi-zuhayr-ibn-malik", fullName: "أبو زهير بن مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "مالك بن امرئ القيس", slug: "malik-ibn-imri-al-qays-al-harithi", fullName: "مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "امرؤ القيس بن مالك", slug: "imru-al-qays-ibn-malik", fullName: "امرؤ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "مالك بن ثعلبة", slug: "malik-ibn-thalabah", fullName: "مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "ثعلبة بن كعب", slug: "thalabah-ibn-kaab", fullName: "ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "زيد بن قيس", slug: "zayd-ibn-qais", fullName: "زيد بن قيس بن زيد بن النعمان بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "قيس بن زيد", slug: "qais-ibn-zayd", fullName: "قيس بن زيد بن النعمان بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "زيد بن النعمان", slug: "zayd-ibn-al-numan", fullName: "زيد بن النعمان بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',
  'CREATE (:Person { name: "النعمان بن مالك", slug: "al-numan-ibn-malik", fullName: "النعمان بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي" });',

  // Maan ibn Adi
  'CREATE (:Person { name: "عدي بن الجد", slug: "adi-ibn-al-jidd", fullName: "عدي بن الجد بن العجلان الأنصاري حليف بني مالك بن عوف" });',
  'CREATE (:Person { name: "الجد بن العجلان", slug: "al-jidd-ibn-al-ajlan", fullName: "الجد بن العجلان الأنصاري حليف بني مالك بن عوف" });',

  // Abdullah ibn Abdullah ibn Ubayy (father is the well-known hypocrite
  // chief Abdullah ibn Ubayy, himself not a companion — remaining reported
  // generations embedded as text rather than modeled node-by-node)
  'CREATE (:Person { name: "عبد الله بن أبي", slug: "abdullah-ibn-ubayy", fullName: "عبد الله بن أبي بن مالك بن الحارث بن عبيد بن مالك بن سالم بن غنم بن عوف بن الخزرج الأنصاري الخزرجي" });',

  // Ikrimah ibn Abi Jahl and Khalid ibn al-Walid — first cousins, both
  // descend from al-Mughirah ibn Abdullah ibn Umar ibn Makhzum, and that
  // Abdullah is the existing "abdullah-ibn-umar-ibn-makhzum" node
  // (graphSeedData3.ts, ancestor of Abu Salamah via his brother Hilal)
  'CREATE (:Person { name: "أبو جهل", slug: "abu-jahl-ibn-hisham", fullName: "عمرو بن هشام بن المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "هشام بن المغيرة", slug: "hisham-ibn-al-mughirah", fullName: "هشام بن المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "المغيرة بن عبد الله", slug: "al-mughirah-ibn-abdullah-ibn-umar", fullName: "المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',
  'CREATE (:Person { name: "الوليد بن المغيرة", slug: "al-walid-ibn-al-mughirah", fullName: "الوليد بن المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي" });',

  // Abdullah ibn Amr ibn Haram (Jabir's father) — reaches the existing
  // "haram-ibn-kaab" node (graphSeedData5.ts), already ancestor of Amr ibn
  // al-Jumuh and his sons; both families are Banu Salamah of Khazraj
  'CREATE (:Person { name: "عمرو بن حرام", slug: "amr-ibn-haram", fullName: "عمرو بن حرام بن ثعلبة بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "حرام بن ثعلبة", slug: "haram-ibn-thalabah", fullName: "حرام بن ثعلبة بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',
  'CREATE (:Person { name: "ثعلبة بن حرام", slug: "thalabah-ibn-haram", fullName: "ثعلبة بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي" });',

  // Yazid ibn Abi Sufyan — reaches the existing "umayya-ibn-abd-shams" node
  // (graphSeedData2.ts). His father Abu Sufyan ibn Harb is also linked below
  // to the existing wife node "umm-habibah" (his full sister, Ramlah bint
  // Abi Sufyan).
  'CREATE (:Person { name: "أبو سفيان بن حرب", slug: "abu-sufyan-ibn-harb", fullName: "صخر بن حرب بن أمية بن عبد شمس القرشي الأموي" });',
  'CREATE (:Person { name: "حرب بن أمية", slug: "harb-ibn-umayyah", fullName: "حرب بن أمية بن عبد شمس القرشي الأموي" });',

  // Abu al-Ass ibn al-Rabi' and his daughter Umamah — reaches the existing
  // "abd-shams-ibn-abd-manaf" node (graphSeedData2.ts). Umamah's mother
  // Zaynab bint Muhammad already exists as a core Person node (see
  // corePeopleQueries in graphSeedData.ts) but no maternal edge is added
  // here — see report for why.
  'CREATE (:Person { name: "الربيع بن عبد العزى", slug: "al-rabi-ibn-abd-al-uzza", fullName: "الربيع بن عبد العزى بن عبد شمس بن عبد مناف القرشي العبشمي" });',
  'CREATE (:Person { name: "عبد العزى بن عبد شمس", slug: "abd-al-uzza-ibn-abd-shams", fullName: "عبد العزى بن عبد شمس بن عبد مناف القرشي العبشمي" });',

  // Abbad ibn Bishr
  'CREATE (:Person { name: "بشر بن وقش", slug: "bishr-ibn-waqsh", fullName: "بشر بن وقش بن زغبة بن زعوراء بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',
  'CREATE (:Person { name: "وقش بن زغبة", slug: "waqsh-ibn-zughbah", fullName: "وقش بن زغبة بن زعوراء بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',
  'CREATE (:Person { name: "زغبة بن زعوراء", slug: "zughbah-ibn-zaura", fullName: "زغبة بن زعوراء بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',
  'CREATE (:Person { name: "زعوراء بن عبد الأشهل", slug: "zaura-ibn-abd-al-ashhal", fullName: "زعوراء بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',

  // Usayd ibn al-Hudayr — reaches the existing "imru-al-qays-ibn-zayd" node
  // (graphSeedData5.ts), already ancestor of Saad ibn Muadh; both are Awsi
  // Ashhali chiefs
  'CREATE (:Person { name: "الحضير بن سماك", slug: "al-hudayr-ibn-simak", fullName: "الحضير بن سماك بن عتيك بن نافع بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',
  'CREATE (:Person { name: "سماك بن عتيك", slug: "simak-ibn-atik", fullName: "سماك بن عتيك بن نافع بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',
  'CREATE (:Person { name: "عتيك بن نافع", slug: "atik-ibn-nafi", fullName: "عتيك بن نافع بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',
  'CREATE (:Person { name: "نافع بن امرئ القيس", slug: "nafi-ibn-imri-al-qays", fullName: "نافع بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي الأشهلي" });',

  // Al-Tufayl ibn Amr al-Dawsi
  'CREATE (:Person { name: "عمرو بن طريف", slug: "amr-ibn-tarif", fullName: "عمرو بن طريف الدوسي" });',

  // Ibn Umm Maktum (Medinan attribution: Abdullah ibn Qais ibn Zaidah)
  'CREATE (:Person { name: "قيس بن زائدة", slug: "qais-ibn-zaidah", fullName: "قيس بن زائدة بن الأصم بن رواحة القرشي العامري" });',
  'CREATE (:Person { name: "زائدة بن الأصم", slug: "zaidah-ibn-al-asam", fullName: "زائدة بن الأصم بن رواحة القرشي العامري" });',
  'CREATE (:Person { name: "الأصم بن رواحة", slug: "al-asam-ibn-rawahah", fullName: "الأصم بن رواحة القرشي العامري" });',

  // Safwan ibn Bayda' and Suhail ibn Bayda' (brothers) — reach the existing
  // "dabbah-ibn-al-harith" node (graphSeedData3.ts), already ancestor of Abu
  // Ubaydah ibn al-Jarrah; both families are Banu Fihr
  'CREATE (:Person { name: "وهب بن ربيعة", slug: "wahb-ibn-rabiah", fullName: "وهب بن ربيعة بن هلال بن مالك بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "ربيعة بن هلال", slug: "rabiah-ibn-hilal", fullName: "ربيعة بن هلال بن مالك بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "هلال بن مالك", slug: "hilal-ibn-malik", fullName: "هلال بن مالك بن ضبة بن الحارث بن فهر القرشي الفهري" });',
  'CREATE (:Person { name: "مالك بن ضبة", slug: "malik-ibn-dabbah", fullName: "مالك بن ضبة بن الحارث بن فهر القرشي الفهري" });',

  // Al-Miqdad ibn Amr
  'CREATE (:Person { name: "عمرو بن ثعلبة", slug: "amr-ibn-thalabah", fullName: "عمرو بن ثعلبة بن مالك بن ربيعة القضاعي الكندي البهراني" });',
  'CREATE (:Person { name: "ثعلبة بن مالك", slug: "thalabah-ibn-malik", fullName: "ثعلبة بن مالك بن ربيعة القضاعي الكندي البهراني" });',
  'CREATE (:Person { name: "مالك بن ربيعة", slug: "malik-ibn-rabiah", fullName: "مالك بن ربيعة القضاعي الكندي البهراني" });',

  // Ubayy ibn Kaab — reaches the existing "malik-ibn-al-najjar" node
  // (graphSeedData5.ts), already ancestor of Asad ibn Zurarah; both from
  // Banu al-Najjar of Khazraj
  'CREATE (:Person { name: "كعب بن قيس", slug: "kaab-ibn-qais", fullName: "كعب بن قيس بن عبيد بن زيد بن معاوية بن عمرو بن مالك بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "قيس بن عبيد", slug: "qais-ibn-ubaid", fullName: "قيس بن عبيد بن زيد بن معاوية بن عمرو بن مالك بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "عبيد بن زيد", slug: "ubayd-ibn-zayd", fullName: "عبيد بن زيد بن معاوية بن عمرو بن مالك بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "زيد بن معاوية", slug: "zayd-ibn-muawiyah", fullName: "زيد بن معاوية بن عمرو بن مالك بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "معاوية بن عمرو", slug: "muawiyah-ibn-amr", fullName: "معاوية بن عمرو بن مالك بن النجار الأنصاري النجاري" });',
  'CREATE (:Person { name: "عمرو بن مالك", slug: "amr-ibn-malik", fullName: "عمرو بن مالك بن النجار الأنصاري النجاري" });',

  // Al-Nu'man ibn Muqarrin (Muzaynah, fresh chain, truncated)
  'CREATE (:Person { name: "عمرو بن مقرن", slug: "amr-ibn-muqarrin", fullName: "عمرو بن مقرن بن عائذ بن ميجا بن هجير بن نصر بن حبشية بن كعب بن ثور بن هدمة بن لاطم بن عثمان المزني" });',
  'CREATE (:Person { name: "مقرن بن عائذ", slug: "muqarrin-ibn-aidh", fullName: "مقرن بن عائذ بن ميجا بن هجير بن نصر بن حبشية بن كعب بن ثور بن هدمة بن لاطم بن عثمان المزني" });',

  // Ammar ibn Yasir (mawla of Banu Makhzum, fresh chain, truncated)
  'CREATE (:Person { name: "ياسر بن عامر", slug: "yasir-ibn-amir", fullName: "ياسر بن عامر بن مالك بن كنانة بن قيس بن الوذيم مولى بني مخزوم" });',

  // Muadh ibn Jabal (Khazraj, fresh chain, truncated)
  'CREATE (:Person { name: "جبل بن عمرو", slug: "jabal-ibn-amr", fullName: "جبل بن عمرو بن أوس بن عائذ بن عدي بن كعب بن عمرو بن عدي بن سعد بن علي بن أسد بن ساردة بن يزيد بن جشم بن الخزرج الأنصاري الخزرجي" });',

  // Abdullah ibn Mas'ud and his brother Utbah ibn Mas'ud al-Hudhali —
  // shared father (Hudhayl, fresh chain, truncated; the page's nasab in
  // fact continues to the existing "mudrika-ibn-ilias" but that link is not
  // modeled here, see header note)
  'CREATE (:Person { name: "مسعود بن غافل", slug: "masud-ibn-ghafil", fullName: "مسعود بن غافل بن حبيب بن شمخ بن فار بن مخزوم بن صاهلة بن كاهل بن الحارث بن تميم بن سعد بن هذيل الهذلي" });',

  // Khubayb ibn Yasaf (Khazraj, fresh chain, truncated)
  'CREATE (:Person { name: "يساف بن عنبة", slug: "yasaf-ibn-inabah", fullName: "يساف بن عنبة بن عمرو بن خديج بن عامر بن جشم بن الحارث الأنصاري الخزرجي" });',

  // Uwaym ibn Sa'idah (Aws, fresh chain, truncated)
  'CREATE (:Person { name: "ساعدة بن عائش", slug: "saidah-ibn-aish", fullName: "ساعدة بن عائش بن قيس بن النعمان بن زيد بن أمية الأنصاري الأوسي من بني عمرو بن عوف" });',
];

/**
 * An array of Cypher queries to create all relationships between Person nodes.
 * Each item in the array is a single MATCH...CREATE query.
 */
export const peopleRelationsQueries = [
  // Tulayhah ibn Khuwaylid
  'MATCH (from:Person {slug: "tulayhah-ibn-khuwaylid"}), (to:Person {slug: "khuwaylid-ibn-nawfal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "khuwaylid-ibn-nawfal"}), (to:Person {slug: "tulayhah-ibn-khuwaylid"}) CREATE (from)-[:FATHER]->(to);',

  // Sa'd ibn al-Rabi'
  'MATCH (from:Person {slug: "saad-ibn-al-rabi"}), (to:Person {slug: "al-rabi-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-rabi-ibn-amr"}), (to:Person {slug: "saad-ibn-al-rabi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-rabi-ibn-amr"}), (to:Person {slug: "amr-ibn-abi-zuhayr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-abi-zuhayr"}), (to:Person {slug: "al-rabi-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-abi-zuhayr"}), (to:Person {slug: "abi-zuhayr-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abi-zuhayr-ibn-malik"}), (to:Person {slug: "amr-ibn-abi-zuhayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abi-zuhayr-ibn-malik"}), (to:Person {slug: "malik-ibn-imri-al-qays-al-harithi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-imri-al-qays-al-harithi"}), (to:Person {slug: "abi-zuhayr-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-imri-al-qays-al-harithi"}), (to:Person {slug: "imru-al-qays-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-malik"}), (to:Person {slug: "malik-ibn-imri-al-qays-al-harithi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "imru-al-qays-ibn-malik"}), (to:Person {slug: "malik-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-thalabah"}), (to:Person {slug: "imru-al-qays-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-thalabah"}), (to:Person {slug: "thalabah-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thalabah-ibn-kaab"}), (to:Person {slug: "malik-ibn-thalabah"}) CREATE (from)-[:FATHER]->(to);',

  // Abu Zaid (Thabit ibn Zaid) — reuses malik-ibn-thalabah / thalabah-ibn-kaab
  'MATCH (from:Person {slug: "abu-zaid"}), (to:Person {slug: "zayd-ibn-qais"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-qais"}), (to:Person {slug: "abu-zaid"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-ibn-qais"}), (to:Person {slug: "qais-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-zayd"}), (to:Person {slug: "zayd-ibn-qais"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "qais-ibn-zayd"}), (to:Person {slug: "zayd-ibn-al-numan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-al-numan"}), (to:Person {slug: "qais-ibn-zayd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-ibn-al-numan"}), (to:Person {slug: "al-numan-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-numan-ibn-malik"}), (to:Person {slug: "zayd-ibn-al-numan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-numan-ibn-malik"}), (to:Person {slug: "malik-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-thalabah"}), (to:Person {slug: "al-numan-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  // Maan ibn Adi
  'MATCH (from:Person {slug: "maan-ibn-adi"}), (to:Person {slug: "adi-ibn-al-jidd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "adi-ibn-al-jidd"}), (to:Person {slug: "maan-ibn-adi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "adi-ibn-al-jidd"}), (to:Person {slug: "al-jidd-ibn-al-ajlan"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-jidd-ibn-al-ajlan"}), (to:Person {slug: "adi-ibn-al-jidd"}) CREATE (from)-[:FATHER]->(to);',

  // Abdullah ibn Abdullah ibn Ubayy
  'MATCH (from:Person {slug: "abdullah-ibn-abdullah-ibn-ubayy"}), (to:Person {slug: "abdullah-ibn-ubayy"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-ubayy"}), (to:Person {slug: "abdullah-ibn-abdullah-ibn-ubayy"}) CREATE (from)-[:FATHER]->(to);',

  // Ikrimah ibn Abi Jahl
  'MATCH (from:Person {slug: "ikrimah-ibn-abi-jahl"}), (to:Person {slug: "abu-jahl-ibn-hisham"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-jahl-ibn-hisham"}), (to:Person {slug: "ikrimah-ibn-abi-jahl"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abu-jahl-ibn-hisham"}), (to:Person {slug: "hisham-ibn-al-mughirah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hisham-ibn-al-mughirah"}), (to:Person {slug: "abu-jahl-ibn-hisham"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hisham-ibn-al-mughirah"}), (to:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}), (to:Person {slug: "hisham-ibn-al-mughirah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}), (to:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abdullah-ibn-umar-ibn-makhzum"}), (to:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}) CREATE (from)-[:FATHER]->(to);',

  // Khalid ibn al-Walid — reuses al-mughirah-ibn-abdullah-ibn-umar
  'MATCH (from:Person {slug: "khalid-ibn-al-walid"}), (to:Person {slug: "al-walid-ibn-al-mughirah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-walid-ibn-al-mughirah"}), (to:Person {slug: "khalid-ibn-al-walid"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-walid-ibn-al-mughirah"}), (to:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-mughirah-ibn-abdullah-ibn-umar"}), (to:Person {slug: "al-walid-ibn-al-mughirah"}) CREATE (from)-[:FATHER]->(to);',

  // Abdullah ibn Amr ibn Haram
  'MATCH (from:Person {slug: "abdullah-ibn-amr-ibn-haram"}), (to:Person {slug: "amr-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-haram"}), (to:Person {slug: "abdullah-ibn-amr-ibn-haram"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-haram"}), (to:Person {slug: "haram-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haram-ibn-thalabah"}), (to:Person {slug: "amr-ibn-haram"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "haram-ibn-thalabah"}), (to:Person {slug: "thalabah-ibn-haram"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thalabah-ibn-haram"}), (to:Person {slug: "haram-ibn-thalabah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "thalabah-ibn-haram"}), (to:Person {slug: "haram-ibn-kaab"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "haram-ibn-kaab"}), (to:Person {slug: "thalabah-ibn-haram"}) CREATE (from)-[:FATHER]->(to);',

  // Yazid ibn Abi Sufyan
  'MATCH (from:Person {slug: "yazid-ibn-abi-sufyan"}), (to:Person {slug: "abu-sufyan-ibn-harb"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abu-sufyan-ibn-harb"}), (to:Person {slug: "yazid-ibn-abi-sufyan"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abu-sufyan-ibn-harb"}), (to:Person {slug: "harb-ibn-umayyah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "harb-ibn-umayyah"}), (to:Person {slug: "abu-sufyan-ibn-harb"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "harb-ibn-umayyah"}), (to:Person {slug: "umayya-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "umayya-ibn-abd-shams"}), (to:Person {slug: "harb-ibn-umayyah"}) CREATE (from)-[:FATHER]->(to);',

  // Bonus: Umm Habibah (existing core wife node) is Abu Sufyan ibn Harb's
  // daughter and Yazid's full sister
  'MATCH (from:Person {slug: "umm-habibah"}), (to:Person {slug: "abu-sufyan-ibn-harb"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abu-sufyan-ibn-harb"}), (to:Person {slug: "umm-habibah"}) CREATE (from)-[:FATHER]->(to);',

  // Abu al-Ass ibn al-Rabi'
  'MATCH (from:Person {slug: "abu-al-as-ibn-al-rabi"}), (to:Person {slug: "al-rabi-ibn-abd-al-uzza"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-rabi-ibn-abd-al-uzza"}), (to:Person {slug: "abu-al-as-ibn-al-rabi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-rabi-ibn-abd-al-uzza"}), (to:Person {slug: "abd-al-uzza-ibn-abd-shams"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-al-uzza-ibn-abd-shams"}), (to:Person {slug: "al-rabi-ibn-abd-al-uzza"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "abd-al-uzza-ibn-abd-shams"}), (to:Person {slug: "abd-shams-ibn-abd-manaf"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "abd-shams-ibn-abd-manaf"}), (to:Person {slug: "abd-al-uzza-ibn-abd-shams"}) CREATE (from)-[:FATHER]->(to);',

  // Umamah bint Abi al-Ass (daughter of Abu al-Ass and of the Prophet's
  // daughter Zaynab, whose own full profile is deferred to a later batch)
  'MATCH (from:Person {slug: "umamah-bint-abi-al-as"}), (to:Person {slug: "abu-al-as-ibn-al-rabi"}) CREATE (from)-[:DAUGHTER]->(to);',
  'MATCH (from:Person {slug: "abu-al-as-ibn-al-rabi"}), (to:Person {slug: "umamah-bint-abi-al-as"}) CREATE (from)-[:FATHER]->(to);',

  // Abbad ibn Bishr
  'MATCH (from:Person {slug: "abbad-ibn-bishr"}), (to:Person {slug: "bishr-ibn-waqsh"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "bishr-ibn-waqsh"}), (to:Person {slug: "abbad-ibn-bishr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "bishr-ibn-waqsh"}), (to:Person {slug: "waqsh-ibn-zughbah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "waqsh-ibn-zughbah"}), (to:Person {slug: "bishr-ibn-waqsh"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "waqsh-ibn-zughbah"}), (to:Person {slug: "zughbah-ibn-zaura"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zughbah-ibn-zaura"}), (to:Person {slug: "waqsh-ibn-zughbah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zughbah-ibn-zaura"}), (to:Person {slug: "zaura-ibn-abd-al-ashhal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zaura-ibn-abd-al-ashhal"}), (to:Person {slug: "zughbah-ibn-zaura"}) CREATE (from)-[:FATHER]->(to);',

  // Usayd ibn al-Hudayr
  'MATCH (from:Person {slug: "usayd-ibn-al-hudayr"}), (to:Person {slug: "al-hudayr-ibn-simak"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-hudayr-ibn-simak"}), (to:Person {slug: "usayd-ibn-al-hudayr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "al-hudayr-ibn-simak"}), (to:Person {slug: "simak-ibn-atik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "simak-ibn-atik"}), (to:Person {slug: "al-hudayr-ibn-simak"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "simak-ibn-atik"}), (to:Person {slug: "atik-ibn-nafi"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "atik-ibn-nafi"}), (to:Person {slug: "simak-ibn-atik"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "atik-ibn-nafi"}), (to:Person {slug: "nafi-ibn-imri-al-qays"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "nafi-ibn-imri-al-qays"}), (to:Person {slug: "atik-ibn-nafi"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "nafi-ibn-imri-al-qays"}), (to:Person {slug: "imru-al-qays-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "imru-al-qays-ibn-zayd"}), (to:Person {slug: "nafi-ibn-imri-al-qays"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Tufayl ibn Amr al-Dawsi
  'MATCH (from:Person {slug: "at-tufayl-ibn-amr-ad-dawsi"}), (to:Person {slug: "amr-ibn-tarif"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-tarif"}), (to:Person {slug: "at-tufayl-ibn-amr-ad-dawsi"}) CREATE (from)-[:FATHER]->(to);',

  // Ibn Umm Maktum
  'MATCH (from:Person {slug: "ibn-umm-maktum"}), (to:Person {slug: "qais-ibn-zaidah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-zaidah"}), (to:Person {slug: "ibn-umm-maktum"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "qais-ibn-zaidah"}), (to:Person {slug: "zaidah-ibn-al-asam"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zaidah-ibn-al-asam"}), (to:Person {slug: "qais-ibn-zaidah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zaidah-ibn-al-asam"}), (to:Person {slug: "al-asam-ibn-rawahah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "al-asam-ibn-rawahah"}), (to:Person {slug: "zaidah-ibn-al-asam"}) CREATE (from)-[:FATHER]->(to);',

  // Safwan ibn Bayda' and Suhail ibn Bayda' (brothers)
  'MATCH (from:Person {slug: "safwan-ibn-bayda"}), (to:Person {slug: "wahb-ibn-rabiah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "wahb-ibn-rabiah"}), (to:Person {slug: "safwan-ibn-bayda"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "suhail-ibn-bayda"}), (to:Person {slug: "wahb-ibn-rabiah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "wahb-ibn-rabiah"}), (to:Person {slug: "suhail-ibn-bayda"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "wahb-ibn-rabiah"}), (to:Person {slug: "rabiah-ibn-hilal"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "rabiah-ibn-hilal"}), (to:Person {slug: "wahb-ibn-rabiah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "rabiah-ibn-hilal"}), (to:Person {slug: "hilal-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "hilal-ibn-malik"}), (to:Person {slug: "rabiah-ibn-hilal"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "hilal-ibn-malik"}), (to:Person {slug: "malik-ibn-dabbah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-dabbah"}), (to:Person {slug: "hilal-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "malik-ibn-dabbah"}), (to:Person {slug: "dabbah-ibn-al-harith"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "dabbah-ibn-al-harith"}), (to:Person {slug: "malik-ibn-dabbah"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Miqdad ibn Amr
  'MATCH (from:Person {slug: "al-miqdad-ibn-amr"}), (to:Person {slug: "amr-ibn-thalabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-thalabah"}), (to:Person {slug: "al-miqdad-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-thalabah"}), (to:Person {slug: "thalabah-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "thalabah-ibn-malik"}), (to:Person {slug: "amr-ibn-thalabah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "thalabah-ibn-malik"}), (to:Person {slug: "malik-ibn-rabiah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-rabiah"}), (to:Person {slug: "thalabah-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  // Ubayy ibn Kaab
  'MATCH (from:Person {slug: "ubayy-ibn-kaab"}), (to:Person {slug: "kaab-ibn-qais"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "kaab-ibn-qais"}), (to:Person {slug: "ubayy-ibn-kaab"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "kaab-ibn-qais"}), (to:Person {slug: "qais-ibn-ubaid"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "qais-ibn-ubaid"}), (to:Person {slug: "kaab-ibn-qais"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "qais-ibn-ubaid"}), (to:Person {slug: "ubayd-ibn-zayd"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "ubayd-ibn-zayd"}), (to:Person {slug: "qais-ibn-ubaid"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "ubayd-ibn-zayd"}), (to:Person {slug: "zayd-ibn-muawiyah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "zayd-ibn-muawiyah"}), (to:Person {slug: "ubayd-ibn-zayd"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "zayd-ibn-muawiyah"}), (to:Person {slug: "muawiyah-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "muawiyah-ibn-amr"}), (to:Person {slug: "zayd-ibn-muawiyah"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "muawiyah-ibn-amr"}), (to:Person {slug: "amr-ibn-malik"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-malik"}), (to:Person {slug: "muawiyah-ibn-amr"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-malik"}), (to:Person {slug: "malik-ibn-al-najjar"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "malik-ibn-al-najjar"}), (to:Person {slug: "amr-ibn-malik"}) CREATE (from)-[:FATHER]->(to);',

  // Al-Nu'man ibn Muqarrin
  'MATCH (from:Person {slug: "al-numan-ibn-muqarrin"}), (to:Person {slug: "amr-ibn-muqarrin"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "amr-ibn-muqarrin"}), (to:Person {slug: "al-numan-ibn-muqarrin"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "amr-ibn-muqarrin"}), (to:Person {slug: "muqarrin-ibn-aidh"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "muqarrin-ibn-aidh"}), (to:Person {slug: "amr-ibn-muqarrin"}) CREATE (from)-[:FATHER]->(to);',

  // Ammar ibn Yasir
  'MATCH (from:Person {slug: "ammar-ibn-yasir"}), (to:Person {slug: "yasir-ibn-amir"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "yasir-ibn-amir"}), (to:Person {slug: "ammar-ibn-yasir"}) CREATE (from)-[:FATHER]->(to);',

  // Muadh ibn Jabal
  'MATCH (from:Person {slug: "muadh-ibn-jabal"}), (to:Person {slug: "jabal-ibn-amr"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "jabal-ibn-amr"}), (to:Person {slug: "muadh-ibn-jabal"}) CREATE (from)-[:FATHER]->(to);',

  // Abdullah ibn Mas'ud and his brother Utbah ibn Mas'ud al-Hudhali
  'MATCH (from:Person {slug: "abdullah-ibn-masud"}), (to:Person {slug: "masud-ibn-ghafil"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "masud-ibn-ghafil"}), (to:Person {slug: "abdullah-ibn-masud"}) CREATE (from)-[:FATHER]->(to);',

  'MATCH (from:Person {slug: "utbah-ibn-masud-al-hudhali"}), (to:Person {slug: "masud-ibn-ghafil"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "masud-ibn-ghafil"}), (to:Person {slug: "utbah-ibn-masud-al-hudhali"}) CREATE (from)-[:FATHER]->(to);',

  // Khubayb ibn Yasaf
  'MATCH (from:Person {slug: "khubayb-ibn-yasaf"}), (to:Person {slug: "yasaf-ibn-inabah"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "yasaf-ibn-inabah"}), (to:Person {slug: "khubayb-ibn-yasaf"}) CREATE (from)-[:FATHER]->(to);',

  // Uwaym ibn Sa'idah
  'MATCH (from:Person {slug: "uwaym-ibn-saidah"}), (to:Person {slug: "saidah-ibn-aish"}) CREATE (from)-[:SON]->(to);',
  'MATCH (from:Person {slug: "saidah-ibn-aish"}), (to:Person {slug: "uwaym-ibn-saidah"}) CREATE (from)-[:FATHER]->(to);',
];
