/**
 * Batch 6 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * following the book's entries in order (islamweb bookid=60), covering
 * content-ids 140-162 — the Prophet's wives and daughters. Content-id 139
 * (كسرى) is not a companion and content-id 163 (زوجاته صلى الله عليه وسلم)
 * is a group header; both are intentionally skipped. Content-ids 144-151 are
 * not separate biographies — confirmed by fetching that range directly, they
 * are continued virtue/hadith sub-sections still under Aisha's own entry
 * (content-id 143), not new individuals.
 *
 * Unlike batches 1-5, most of the people below already have a Neo4j Person
 * node from earlier work (hardcoded in corePeopleQueries, graphSeedData.ts)
 * but never had a Postgres profile until now. Only two are brand-new to both
 * stores — see graphSeedData8.ts's header for the full breakdown of which is
 * which and what relations were added/gap-filled for each.
 *
 * Disambiguation note (content-ids 153/154, both titled "زينب أم المؤمنين"):
 * resolved by fetching each page's own opening nasab line verbatim —
 * id 153 ("بنت جحش بن رياب") is Zaynab bint Jahsh (zaynab-bint-jahsh);
 * id 154 ("بنت خزيمة بن الحارث... الهلالية", epithet "أم المساكين") is
 * Zaynab bint Khuzaymah (zaynab-bint-khuzaymah). See graphSeedData8.ts for
 * the full verbatim quotes.
 *
 * fullName is filled in from each entry's own page nasab, extended through
 * ancestors already present in the graph where the page's chain reaches one
 * (see graphSeedData8.ts) — appearance/virtues are left for a later
 * enrichment batch, matching the convention used since batch 1.
 */
export const people = [
  {
    // Existing Neo4j Person node (khadijah-bint-khuwaylid, core, no new node
    // created) — new DAUGHTER/FATHER edges to the existing khuwaylid-ibn-asad
    // node added in graphSeedData8.ts.
    name: 'خديجة بنت خويلد',
    fullName: 'خديجة بنت خويلد بن أسد بن عبد العزى بن قصي القرشية الأسدية',
    slug: 'khadijah-bint-khuwaylid',
    nameTransliterated: 'Khadijah bint Khuwaylid',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brand-new Neo4j Person node (fatimah-bint-asad) — mother of Ali ibn
    // Abi Talib, NOT the same person as Fatimah al-Zahra below. See
    // graphSeedData8.ts for her ancestor chain and family relations.
    name: 'فاطمة بنت أسد',
    fullName: 'فاطمة بنت أسد بن هاشم بن عبد مناف بن قصي القرشية الهاشمية',
    slug: 'fatimah-bint-asad',
    nameTransliterated: 'Fatimah bint Asad',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (fatimah-al-zahra, core, no new node
    // created) — no relation gap found; already fully connected.
    name: 'فاطمة الزهراء',
    fullName: 'فاطمة بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'fatimah-al-zahra',
    nameTransliterated: 'Fatimah al-Zahra',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (aisha-bint-abi-bakr, core, no new node
    // created) — gap-fill FATHER edge added in graphSeedData8.ts (only the
    // reverse DAUGHTER edge existed before).
    name: 'عائشة بنت أبي بكر',
    fullName: 'عائشة بنت أبي بكر عبد الله بن أبي قحافة عثمان بن عامر بن عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشية التيمية',
    slug: 'aisha-bint-abi-bakr',
    nameTransliterated: 'Aisha bint Abi Bakr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (umm-salamah, core, no new node created) —
    // her own page's nasab reaches the existing al-mughirah-ibn-abdullah-
    // ibn-umar node (graphSeedData7.ts), confirming she was a cousin of
    // Khalid ibn al-Walid and Abu Jahl. New ancestor chain added in
    // graphSeedData8.ts.
    name: 'أم سلمة',
    fullName: 'هند بنت أبي أمية بن المغيرة بن عبد الله بن عمر بن مخزوم القرشية المخزومية',
    slug: 'umm-salamah',
    nameTransliterated: 'Umm Salamah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (zaynab-bint-jahsh, core, no new node
    // created) — see disambiguation note above. Profile only, no relation
    // gap found beyond what corePeopleRelationsQueries already has.
    name: 'زينب بنت جحش',
    fullName: 'زينب بنت جحش بن رياب الأسدية',
    slug: 'zaynab-bint-jahsh',
    nameTransliterated: 'Zaynab bint Jahsh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (zaynab-bint-khuzaymah, core, no new node
    // created) — see disambiguation note above. Known as "Umm al-Masakin"
    // ("Mother of the Poor") for her abundant charity, per her own page.
    // Profile only.
    name: 'زينب بنت خزيمة',
    fullName: 'زينب بنت خزيمة بن الحارث بن عبد الله الهلالية',
    slug: 'zaynab-bint-khuzaymah',
    nameTransliterated: 'Zaynab bint Khuzaymah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (umm-habibah, core, no new node created) —
    // her father-link to abu-sufyan-ibn-harb was already added in batch 4
    // (graphSeedData6.ts); not duplicated here.
    name: 'أم حبيبة',
    fullName: 'رملة بنت أبي سفيان صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي القرشية الأموية',
    slug: 'umm-habibah',
    nameTransliterated: 'Umm Habibah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brand-new Neo4j Person node (umm-ayman) — Barakah, the Prophet's
    // Abyssinian freedwoman/nurse and mother of Usama ibn Zaid (not yet in
    // this pipeline). Her own page gives no father/tribe at all; fullName
    // is just her known given name, same precedent as abu-dharr-al-ghifari
    // (name known, no deeper nasab). Second husband Zaid ibn Harithah
    // (existing node) is linked in graphSeedData8.ts.
    name: 'أم أيمن',
    fullName: 'بركة',
    slug: 'umm-ayman',
    nameTransliterated: 'Umm Ayman',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (hafsa-bint-umar, core, no new node
    // created) — gap-fill FATHER edge added in graphSeedData8.ts (only the
    // reverse DAUGHTER edge existed before, same issue as Aisha above).
    name: 'حفصة بنت عمر',
    fullName: 'حفصة بنت عمر بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشية العدوية',
    slug: 'hafsa-bint-umar',
    nameTransliterated: 'Hafsa bint Umar',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (safiyyah-bint-huyayy, core, no new node
    // created) — her father Huyayy ibn Akhtab is a Jewish leader of Banu
    // al-Nadir, not part of the Quraysh/Ansari tree; no ancestor node
    // created, no relation gap to fill. Profile only.
    name: 'صفية بنت حيي',
    fullName: 'صفية بنت حيي بن أخطب بن سعية',
    slug: 'safiyyah-bint-huyayy',
    nameTransliterated: 'Safiyyah bint Huyayy',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (maymunah-bint-al-harith, core, no new node
    // created). Her own page notes she was maternal aunt of Khalid ibn
    // al-Walid and of Ibn Abbas, and sister of Umm al-Fadl (wife of
    // al-Abbas) — none of those relatives are existing nodes/slugs in this
    // pipeline, so no relation was added; worth a second look in a future
    // batch. Profile only.
    name: 'ميمونة بنت الحارث',
    fullName: 'ميمونة بنت الحارث بن حزن بن بجير بن الهزم بن رويبة بن عبد الله بن هلال بن عامر بن صعصعة الهلالية',
    slug: 'maymunah-bint-al-harith',
    nameTransliterated: 'Maymunah bint al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (zaynab-bint-muhammad, core, no new node
    // created) — the entry deferred from batch 4 (content-id 84 was skipped
    // there specifically for this). Three gaps filled in graphSeedData8.ts:
    // FATHER edge from prophet-muhammad, WIFE/HUSBAND to abu-al-as-ibn-al-rabi
    // (page-confirmed marriage), and MOTHER/DAUGHTER to umamah-bint-abi-al-as
    // (deliberately deferred in batch 4, filled in now).
    name: 'زينب بنت محمد',
    fullName: 'زينب بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'zaynab-bint-muhammad',
    nameTransliterated: 'Zaynab bint Muhammad',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (ruqayyah-bint-muhammad, core, no new node
    // created) — her WIFE/HUSBAND edge pair to uthman-ibn-affan already
    // exists in corePeopleRelationsQueries (confirmed by her own page); not
    // duplicated. Her first marriage to Utbah ibn Abi Lahab (annulled before
    // consummation) is not modeled, consistent with how other wives' failed
    // prior marriages are left out of the graph.
    name: 'رقية بنت محمد',
    fullName: 'رقية بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'ruqayyah-bint-muhammad',
    nameTransliterated: 'Ruqayyah bint Muhammad',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Existing Neo4j Person node (umm-kulthum-bint-muhammad, core, no new
    // node created) — same as Ruqayyah above: her WIFE/HUSBAND edge pair to
    // uthman-ibn-affan already exists in corePeopleRelationsQueries
    // (confirmed by her own page, married after Ruqayyah's death); not
    // duplicated.
    name: 'أم كلثوم بنت محمد',
    fullName: 'أم كلثوم بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
    slug: 'umm-kulthum-bint-muhammad',
    nameTransliterated: 'Umm Kulthum bint Muhammad',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
