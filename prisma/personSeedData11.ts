/**
 * Batch 8 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 194-215 (islamweb bookid=60) — mostly Ansari Badr/Uhud
 * veterans, plus a handful of well-known early Muslims (Khabbab ibn al-Aratt,
 * Abu al-Darda', Hudhayfah ibn al-Yaman, Abu Musa al-Ash'ari).
 *
 * Two ids in this range are intentionally skipped, not treated as new:
 *   - id 204 ("النعمان بن مقرن") already has a full Postgres profile and
 *     graph node from an earlier batch (prisma/personSeedData7.ts,
 *     slug al-numan-ibn-muqarrin) — same nasab confirmed, no changes needed.
 *   - id 208 ("رفاعة") is not treated as an independent companion: the
 *     book's own entry for him is entirely a discussion of whether he's a
 *     real, distinct fourth son of al-Harith ibn Rifa'ah/Afra bint Ubayd at
 *     all — Ibn Ishaq alone names him, and al-Waqidi is quoted saying "that
 *     is not established with us" (ليس ذلك عندنا بثبت). No independent
 *     nasab, kunya, or biographical fact is given for him beyond that
 *     dispute, so no profile is created.
 *
 * fullName is filled in from each entry's own page nasab. Three sibling
 * groups in this batch reuse the sibling-grouping inference rule (fill a
 * sibling's fullName from their shared father even when their own page gives
 * a shorter form): Sahl ibn Hunayf's fuller chain is used for his brother
 * Uthman; Khawwat ibn Jubair's chain for his brother Abdullah ibn Jubair
 * (whose own page gives no nasab at all); and Mu'adh ibn al-Harith's fuller
 * chain (from Ibn Sa'd, via his own entry) for his brothers Mu'awwidh and
 * Awf, both of whose own pages give only the short "ibn Rifa'ah, ibn Afra'"
 * form.
 */
export const people = [
  {
    // Brother of Sahl ibn Hunayf below. Governor of Basra under Ali; fought
    // off Talha and al-Zubayr's men there and was mistreated (beard and
    // eyelids plucked) when they briefly seized the city. Sons (two of them
    // both named Abdullah, per the book) not modelled — not their own
    // entries in this pipeline.
    name: 'عثمان بن حنيف',
    fullName: 'عثمان بن حنيف بن واهب بن عكيم بن ثعلبة بن الحارث بن مجدعة بن عمرو بن حنش بن عوف بن عمرو بن عوف الأنصاري الأوسي القبائي',
    slug: 'uthman-ibn-hunayf',
    nameTransliterated: 'Uthman ibn Hunayf',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'خباب بن الأرت',
    fullName: 'خباب بن الأرت بن جندلة بن سعد بن خزيمة بن كعب بن سعد بن زيد مناة التميمي',
    slug: 'khabbab-ibn-al-aratt',
    nameTransliterated: 'Khabbab ibn al-Aratt',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Uthman ibn Hunayf above; the Prophet paired him in
    // brotherhood with Ali (not modelled — no such relation type in this
    // graph, only blood/marriage ties).
    name: 'سهل بن حنيف',
    fullName: 'سهل بن حنيف بن واهب بن عكيم بن ثعلبة بن عمرو بن الحارث بن مجدعة بن عمرو بن حنش بن عوف بن عمرو بن عوف الأنصاري الأوسي العوفي',
    slug: 'sahl-ibn-hunayf',
    nameTransliterated: 'Sahl ibn Hunayf',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Abdullah ibn Jubair below (explicit on his own page).
    name: 'خوات بن جبير',
    fullName: 'خوات بن جبير بن النعمان بن أمية بن البرك الأنصاري الأوسي',
    slug: 'khawwat-ibn-jubair',
    nameTransliterated: 'Khawwat ibn Jubair',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Khawwat ibn Jubair above — his own page gives no nasab at
    // all, so fullName is filled in via the sibling-grouping inference rule
    // from Khawwat's fuller chain. Commander of the archers at Uhud,
    // martyred and mutilated there by Ikrimah ibn Abi Jahl.
    name: 'عبد الله بن جبير',
    fullName: 'عبد الله بن جبير بن النعمان بن أمية بن البرك الأنصاري الأوسي',
    slug: 'abdullah-ibn-jubair',
    nameTransliterated: 'Abdullah ibn Jubair',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Maternal brother of Abu Said al-Khudri, not yet in this pipeline — no
    // relation modelled. Famous for his eye being restored by the Prophet's
    // hand after Uhud.
    name: 'قتادة بن النعمان',
    fullName: 'قتادة بن النعمان بن زيد بن عامر الأنصاري الظفري',
    slug: 'qatadah-ibn-al-numan',
    nameTransliterated: 'Qatadah ibn al-Numan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Adopted by al-Khattab (Umar's father) per the book — not modelled as a
    // family tie (adoption, not blood/marriage). Son Abdullah ibn Amir ibn
    // Rabiah (a transmitter from him) not yet in this pipeline.
    name: 'عامر بن ربيعة',
    fullName: 'عامر بن ربيعة بن كعب العنزي',
    slug: 'amir-ibn-rabiah',
    nameTransliterated: 'Amir ibn Rabiah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Kunya used as the primary name, per the book's own heading; fullName
    // uses Ibn Abi Hatim's fullest reported chain (several shorter variants
    // are also given on his page). Wife Umm al-Darda' al-Alimah and son
    // Bilal ibn Abi al-Darda' not yet in this pipeline.
    name: 'أبو الدرداء',
    fullName: 'عويمر بن قيس بن زيد بن قيس بن أمية بن عامر بن عدي بن كعب الأنصاري الخزرجي',
    slug: 'abu-al-darda',
    nameTransliterated: 'Abu al-Darda',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His paternal uncle Iyad ibn Zuhayr al-Fihri (a major Badri companion
    // per this same page) is not yet in this pipeline — no relation
    // modelled.
    name: 'عياض بن غنم',
    fullName: 'عياض بن غنم بن زهير بن أبي شداد الفهري',
    slug: 'iyad-ibn-ghanm',
    nameTransliterated: 'Iyad ibn Ghanm',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Paternal cousin of Muhammad ibn Maslamah below (his own page: "ابن
    // عمة محمد بن مسلمة" — son of Muhammad ibn Maslamah's paternal aunt).
    name: 'سلمة بن سلامة',
    fullName: 'سلمة بن سلامة بن وقش بن زغبة بن زعوراء بن عبد الأشهل الأنصاري الأشهلي',
    slug: 'salamah-ibn-salamah',
    nameTransliterated: 'Salamah ibn Salamah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Muawwidh ibn al-Harith and Awf ibn al-Harith below — all
    // three sons of Afra bint Ubayd (see graphSeedData10.ts), the "ibna
    // Afra'" of the Abu Jahl-killing tradition. Fuller nasab per Ibn Sa'd,
    // as quoted on his own page.
    name: 'معاذ بن الحارث',
    fullName: 'معاذ بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
    slug: 'muadh-ibn-al-harith',
    nameTransliterated: 'Muadh ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Muadh ibn al-Harith above and Awf ibn al-Harith below; his
    // own page gives only the short "ibn Rifaah, ibn Afraa" form, so
    // fullName is filled in via the sibling-grouping inference rule from
    // Muadh's fuller chain. One of the two brothers credited with wounding
    // Abu Jahl at Badr before Ibn Masud delivered the final blow. Children
    // al-Rubayyi and Umayrah bint Muawwidh not yet in this pipeline.
    name: 'معوذ بن الحارث',
    fullName: 'معوذ بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
    slug: 'muawwidh-ibn-al-harith',
    nameTransliterated: 'Muawwidh ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Muadh and Muawwidh ibn al-Harith above; his own page gives
    // only the short "ibn Rifaah, ibn Afraa" form, so fullName is filled in
    // via the sibling-grouping inference rule from Muadh's fuller chain.
    // Martyred at Badr.
    name: 'عوف بن الحارث',
    fullName: 'عوف بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
    slug: 'awf-ibn-al-harith',
    nameTransliterated: 'Awf ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father Hisl (also read Husayl) ibn Jabir, called "al-Yaman", is given
    // his own graph-only ancestor node (see graphSeedData10.ts) — martyred
    // at Uhud, killed by his own side by mistake, for which Hudhayfah
    // forgave the blood money. Brother Safwan ibn al-Yaman (also present at
    // Uhud) not yet in this pipeline.
    name: 'حذيفة بن اليمان',
    fullName: 'حذيفة بن حسل بن جابر العبسي اليماني',
    slug: 'hudhayfah-ibn-al-yaman',
    nameTransliterated: 'Hudhayfah ibn al-Yaman',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Paternal cousin of Salamah ibn Salamah above.
    name: 'محمد بن مسلمة',
    fullName: 'محمد بن سلمة بن خالد بن عدي بن مجدعة الأنصاري الحارثي',
    slug: 'muhammad-ibn-maslamah',
    nameTransliterated: 'Muhammad ibn Maslamah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Distinct from the existing abi-al-as-ibn-umayya (personSeedData2.ts,
    // an Umayyad, unrelated) — this is a Thaqafi from al-Ta'if; no further
    // ancestor chain given beyond his father's kunya, so none is modelled.
    name: 'عثمان بن أبي العاص',
    fullName: 'عثمان بن أبي العاص الثقفي الطائفي',
    slug: 'uthman-ibn-abi-al-as',
    nameTransliterated: 'Uthman ibn Abi al-As',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // The Companion shown the call to prayer (adhan) in a dream. Distinct
    // from the next entry (also "Abdullah ibn Zayd", different father and
    // tribe branch) — disambiguated by nasab in the slug.
    name: 'عبد الله بن زيد',
    fullName: 'عبد الله بن زيد بن عبد ربه بن ثعلبة الأنصاري الخزرجي المدني البدري',
    slug: 'abdullah-ibn-zayd-ibn-abd-rabbih',
    nameTransliterated: 'Abdullah ibn Zayd ibn Abd Rabbih',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Known as Ibn Umm Umarah; distinct from the previous entry (also
    // "Abdullah ibn Zayd") — disambiguated by nasab in the slug. One of
    // those credited with killing Musaylimah the false prophet. Paternal
    // uncle of Abbad ibn Tamim, not yet in this pipeline.
    name: 'عبد الله بن زيد النجاري',
    fullName: 'عبد الله بن زيد بن عاصم بن كعب الأنصاري المازني النجاري',
    slug: 'abdullah-ibn-zayd-al-najjari',
    nameTransliterated: 'Abdullah ibn Zayd al-Najjari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Children Abdullah, Abd al-Rahman, Sawdah, Amrah, and Umm Kulthum not
    // yet their own entries in this pipeline (the "Sawdah" here is unrelated
    // to the existing sawdah-bint-zamah, a wife of the Prophet).
    name: 'حارثة بن النعمان',
    fullName: 'حارثة بن النعمان بن نفع بن زيد بن عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري النجاري',
    slug: 'harithah-ibn-al-numan',
    nameTransliterated: 'Harithah ibn al-Numan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Mother Zabyah bint Wahb given her own graph-only ancestor node (see
    // graphSeedData10.ts). Brothers Abu Ruhm and Abu Burdah, paternal uncle
    // Abu Amir al-Ashari (who calls him "ibn akhi" — my nephew — on this
    // same page, not a brother despite one summary reading), and son Abu
    // Burdah ibn Abi Musa (a hadith transmitter from him, sharing a kunya
    // with his uncle) are none of them yet their own entries in this
    // pipeline.
    name: 'أبو موسى الأشعري',
    fullName: 'عبد الله بن قيس بن سليم بن حضار بن حرب الأشعري',
    slug: 'abu-musa-al-ashari',
    nameTransliterated: 'Abu Musa al-Ashari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
