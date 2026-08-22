/**
 * Batch 3 of companion names extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * following the book's entries in order (islamweb bookid=60), starting right
 * after abdullah-ibn-rawahah (the last of batch 2, prisma/personSeedData5.ts).
 * fullName is filled in from the nasab (father) chain given on each entry's
 * own page, extended up through ancestors already present in the graph where
 * possible (see neo4j/graphSeedData5.ts) — appearance/virtues are still left
 * for a later enrichment batch.
 *
 * Content-ids 47/48 ("شهداء يوم الرجيع" / "شهداء بئر معونة") and 57 ("أعيان
 * البدريين") are group-header entries, not individual biographies, and are
 * intentionally skipped. Content-id 69 is a gap in the source tree's id
 * sequence (belongs to a different branch) and is intentionally skipped.
 * Content-id 75 ("شهداء أجنادين واليرموك") is the next group header and
 * starts batch 4.
 *
 * Disambiguation — content-id 59 "عبد الله بن الحارث": this is a DIFFERENT
 * person from abdullah-ibn-al-harith-ibn-nawfal (batch 2, "Babbah", a
 * grandson of al-Harith ibn Abd al-Muttalib via his son Nawfal). This entry
 * (id 59) appears right after Rabi'ah ibn al-Harith (id 58) under "أعيان
 * البدريين" and its own page explicitly calls him "أخو ربيعة ونوفل" (brother
 * of Rabi'ah and Nawfal) — i.e. he is a direct son of al-Harith ibn Abd
 * al-Muttalib, one generation above the batch-2 entry. The page also notes
 * the Prophet renamed him from "Abd Shams" to "Abdullah". Given the different
 * father-chain depth, he is slugged abdullah-ibn-al-harith-ibn-abd-al-muttalib
 * to avoid colliding with the batch-2 entry.
 *
 * Other notes:
 * - Content-id 62 "عمرو بن سعيد الأموي": confirmed by the page as a companion
 *   (two hijras — Abyssinia then Medina — martyred at Yarmouk alongside his
 *   brothers Khalid and Aban), distinct from the much later Umayyad governor
 *   "Amr ibn Sa'id al-Ashdaq" (a taabi'i under Caliph Abd al-Malik) who is NOT
 *   this person and is not part of this dataset.
 * - Content-id 63 "العلاء بن الحضرمي": an ally (حليف) of Banu Umayya from
 *   Hadramawt, not blood Quraysh. His own page gives more than one variant
 *   report of his father's name/ancestry; fullName here keeps only the
 *   consistently-reported immediate father rather than the disputed deeper
 *   chain.
 * - Content-id 65 "البراء بن معرور": died about a month before the Prophet's
 *   arrival in Medina, after pledging allegiance at al-Aqabah and meeting the
 *   Prophet in Mecca. Counted as a companion here per the book/classical
 *   scholarship (believed, pledged, and died a Muslim), similar in spirit to
 *   the marginal case noted for saeed-ibn-al-harith in batch 2.
 * - fullName chains for a few Ansari entries (amr-ibn-al-jumuh and its three
 *   sons, saad-ibn-ubadah, asad-ibn-zurarah, thabit-ibn-qais) are truncated
 *   at a clear tribal/clan-eponym point rather than reproducing the entire
 *   pre-Islamic genealogy given on the page — consistent with how earlier
 *   batches stop chains at a recognizable tribal name (e.g. "...بن قضاعة" in
 *   batch 2's abu-al-haytham-ibn-at-tayyihan) rather than modeling every
 *   further generation. No fullName in this batch is an inference from
 *   sibling placement (unlike some batch-2 entries) — every entry below has
 *   its own nasab, however short, stated directly on its own page.
 */
export const people = [
  {
    name: 'كلثوم بن الهدم',
    fullName: 'كلثوم بن الهدم بن امرئ القيس بن الحارث بن زيد الأنصاري الأوسي',
    slug: 'kulthum-ibn-al-hidm',
    nameTransliterated: 'Kulthum ibn al-Hidm',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو دجانة الأنصاري',
    fullName: 'سماك بن خرشة بن لوذان بن عبد ود بن زيد الأنصاري الساعدي',
    slug: 'abu-dujanah-al-ansari',
    nameTransliterated: 'Abu Dujanah al-Ansari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'خبيب بن عدي',
    fullName: 'خبيب بن عدي بن عامر بن مجدعة بن جحجبى الأنصاري',
    slug: 'khubayb-ibn-adi',
    nameTransliterated: 'Khubayb ibn Adi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'معاذ بن عمرو بن الجموح',
    fullName: 'معاذ بن عمرو بن الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
    slug: 'muadh-ibn-amr-ibn-al-jumuh',
    nameTransliterated: 'Muadh ibn Amr ibn al-Jumuh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'معوذ بن عمرو',
    fullName: 'معوذ بن عمرو بن الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
    slug: 'muawwidh-ibn-amr-ibn-al-jumuh',
    nameTransliterated: 'Muawwidh ibn Amr ibn al-Jumuh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'خلاد بن عمرو',
    fullName: 'خلاد بن عمرو بن الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
    slug: 'khallad-ibn-amr-ibn-al-jumuh',
    nameTransliterated: 'Khallad ibn Amr ibn al-Jumuh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father of Mu'adh, Mu'awwidh and Khallad above — a companion in his own
    // right (fought and was killed at Uhud), not merely a father-only entry.
    name: 'عمرو بن الجموح',
    fullName: 'عمرو بن الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
    slug: 'amr-ibn-al-jumuh',
    nameTransliterated: 'Amr ibn al-Jumuh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبيدة بن الحارث',
    fullName: 'عبيدة بن الحارث بن المطلب بن عبد مناف بن قصي القرشي المطلبي',
    slug: 'ubaydah-ibn-al-harith',
    nameTransliterated: 'Ubaydah ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'ربيعة بن الحارث',
    fullName: 'ربيعة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'rabiah-ibn-al-harith',
    nameTransliterated: 'Rabiah ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See the disambiguation note above the array: distinct from batch 2's
    // abdullah-ibn-al-harith-ibn-nawfal. This one is "أخو ربيعة ونوفل" —
    // a direct son of al-Harith ibn Abd al-Muttalib, renamed by the Prophet
    // from "Abd Shams" to "Abdullah".
    name: 'عبد الله بن الحارث',
    fullName: 'عبد الله بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'abdullah-ibn-al-harith-ibn-abd-al-muttalib',
    nameTransliterated: 'Abdullah ibn al-Harith ibn Abd al-Muttalib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'خالد بن سعيد',
    fullName: 'خالد بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي',
    slug: 'khalid-ibn-said',
    nameTransliterated: 'Khalid ibn Said',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبان بن سعيد',
    fullName: 'أبان بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي',
    slug: 'aban-ibn-said',
    nameTransliterated: 'Aban ibn Said',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See note above the array distinguishing him from the later Umayyad
    // governor "Amr ibn Sa'id al-Ashdaq" — this is a Companion, brother of
    // Khalid and Aban above, martyred at Yarmouk.
    name: 'عمرو بن سعيد الأموي',
    fullName: 'عمرو بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي',
    slug: 'amr-ibn-said-al-umawi',
    nameTransliterated: 'Amr ibn Said al-Umawi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Ally (حليف) of Banu Umayya from Hadramawt, not blood Quraysh — see note
    // above the array on the variant ancestry reports on his own page.
    name: 'العلاء بن الحضرمي',
    fullName: 'العلاء بن عبد الله بن عماد الحضرمي حليف بني أمية',
    slug: 'al-ala-ibn-al-hadrami',
    nameTransliterated: 'Al-Ala ibn al-Hadrami',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'سعد بن خيثمة',
    fullName: 'سعد بن خيثمة بن الحارث بن مالك بن كعب الأنصاري الأوسي',
    slug: 'saad-ibn-khaythamah',
    nameTransliterated: 'Saad ibn Khaythamah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See marginal-timing note above the array: died shortly before the
    // Prophet's arrival in Medina, after pledging at al-Aqabah in Mecca.
    name: 'البراء بن معرور',
    fullName: 'البراء بن معرور بن صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي',
    slug: 'al-baraa-ibn-marur',
    nameTransliterated: 'Al-Baraa ibn Marur',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'بشر بن البراء',
    fullName: 'بشر بن البراء بن معرور بن صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي',
    slug: 'bishr-ibn-al-baraa',
    nameTransliterated: 'Bishr ibn al-Baraa',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'سعد بن عبادة',
    fullName: 'سعد بن عبادة بن دليم بن حارثة بن أبي حزيمة بن ثعلبة الأنصاري الخزرجي الساعدي',
    slug: 'saad-ibn-ubadah',
    nameTransliterated: 'Saad ibn Ubadah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'سعد بن معاذ',
    fullName: 'سعد بن معاذ بن النعمان بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي',
    slug: 'saad-ibn-muadh',
    nameTransliterated: 'Saad ibn Muadh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Full brother of Umar ibn al-Khattab (same father and grandfather).
    name: 'زيد بن الخطاب',
    fullName: 'زيد بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي',
    slug: 'zaid-ibn-al-khattab',
    nameTransliterated: 'Zaid ibn al-Khattab',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أسعد بن زرارة',
    fullName: 'أسعد بن زرارة بن عدس بن عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري',
    slug: 'asad-ibn-zurarah',
    nameTransliterated: 'Asad ibn Zurarah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عتبة بن غزوان',
    fullName: 'عتبة بن غزوان بن جابر بن وهيب المازني حليف بني عبد شمس',
    slug: 'utbah-ibn-ghazwan',
    nameTransliterated: 'Utbah ibn Ghazwan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His own page gives no nasab beyond his father's given name (no
    // grandfather named) — fullName kept to what the page actually states.
    name: 'عكاشة بن محصن',
    fullName: 'عكاشة بن محصن الأسدي حليف قريش',
    slug: 'ukkashah-ibn-mihsan',
    nameTransliterated: 'Ukkashah ibn Mihsan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'ثابت بن قيس',
    fullName: 'ثابت بن قيس بن شماس بن زهير بن مالك بن امرئ القيس بن مالك الأغر بن ثعلبة الأنصاري الخزرجي',
    slug: 'thabit-ibn-qais',
    nameTransliterated: 'Thabit ibn Qais',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
