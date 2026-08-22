/**
 * Batch 2 of companion names extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * following the book's entries in order (islamweb bookid=60), starting right
 * after khalid-ibn-al-bukayr (the last of batch 1, prisma/personSeedData4.ts).
 * Unlike batch 1, fullName is filled in here from the nasab (father) chain
 * given on each entry's page (extended up through ancestors already present
 * in the graph, see neo4j/graphSeedData4.ts) — appearance/virtues are still
 * left for a later enrichment batch.
 *
 * Content-id 43 is a gap in the source tree's id sequence (belongs to a
 * different branch) and is intentionally skipped.
 *
 * Content-id 38 (عبد الله بن عبد الله بن الحارث) was read and skipped: he is
 * a grandson of Abdullah ibn al-Harith "Babba" (id 37) who narrates *from*
 * companions (his father, Ibn Abbas, ...) and served in Caliph Sulayman's
 * entourage — a taabi'i (successor), not a companion of the Prophet — so no
 * 'companion' profile was created for him, and he isn't needed as an
 * ancestor link for anyone else in this batch.
 */
export const people = [
  {
    // fullName inferred, not page-sourced: his own page gives no nasab chain
    // (just brotherhood-pairing + battles + death year). Attributed to
    // al-bukayr-ibn-abd-yalil because the book places him right after
    // Aqil/Khalid ibn al-Bukayr (batch 1) as a sibling group and expects the
    // father already given there to carry over, its usual convention for
    // sibling entries — same basis as the graph FATHER/SON link below.
    name: 'إياس بن أبي البكير',
    fullName: 'إياس بن أبي البكير بن عبد ياليل بن ناشب بن غيرة بن سعد بن ليث الليثي الكناني',
    slug: 'iyas-ibn-al-bukayr',
    nameTransliterated: 'Iyas ibn Abi al-Bukayr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // fullName inferred, not page-sourced — see iyas-ibn-al-bukayr above.
    name: 'عامر بن أبي البكير',
    fullName: 'عامر بن أبي البكير بن عبد ياليل بن ناشب بن غيرة بن سعد بن ليث الليثي الكناني',
    slug: 'amir-ibn-al-bukayr',
    nameTransliterated: 'Amir ibn Abi al-Bukayr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'مسطح بن أثاثة',
    fullName: 'مسطح بن أثاثة بن عباد بن المطلب بن عبد مناف بن قصي المطلبي',
    slug: 'mistah-ibn-uthathah',
    nameTransliterated: 'Mistah ibn Uthathah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو عبس',
    fullName: 'عبد الرحمن بن جبر بن عمرو بن زيد بن جشم بن حارثة بن الحارث الأنصاري الأوسي',
    slug: 'abu-abs',
    nameTransliterated: 'Abu Abs',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو الهيثم بن التيهان',
    fullName: 'مالك بن التيهان بن بلي بن عمرو بن الحاف بن قضاعة الأنصاري',
    slug: 'abu-al-haytham-ibn-at-tayyihan',
    nameTransliterated: 'Abu al-Haytham ibn at-Tayyihan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو جندل',
    fullName: 'العاص بن سهيل بن عمرو بن عبد شمس بن عبد ود بن نصر بن حسل بن عامر بن لؤي بن غالب بن فهر القرشي العامري',
    slug: 'abu-jandal',
    nameTransliterated: 'Abu Jandal',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبد الله بن سهيل',
    fullName: 'عبد الله بن سهيل بن عمرو بن عبد شمس بن عبد ود بن نصر بن حسل بن عامر بن لؤي بن غالب بن فهر القرشي العامري',
    slug: 'abdullah-ibn-suhail',
    nameTransliterated: 'Abdullah ibn Suhail',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'سهيل بن عمرو',
    fullName: 'سهيل بن عمرو بن عبد شمس بن عبد ود بن نصر بن حسل بن عامر بن لؤي بن غالب بن فهر القرشي العامري',
    slug: 'suhail-ibn-amr',
    nameTransliterated: 'Suhail ibn Amr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'البراء بن مالك',
    fullName: 'البراء بن مالك بن النضر بن ضمضم بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصاري النجاري',
    slug: 'al-baraa-ibn-malik',
    nameTransliterated: 'Al-Baraa ibn Malik',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'نوفل بن الحارث',
    fullName: 'نوفل بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'nawfal-ibn-al-harith',
    nameTransliterated: 'Nawfal ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'الحارث بن نوفل',
    fullName: 'الحارث بن نوفل بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'al-harith-ibn-nawfal',
    nameTransliterated: 'Al-Harith ibn Nawfal',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبد الله بن الحارث',
    fullName: 'عبد الله بن الحارث بن نوفل بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'abdullah-ibn-al-harith-ibn-nawfal',
    nameTransliterated: 'Abdullah ibn al-Harith (Babbah)',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Marginal companion status: the book notes al-Hakim alone counted him
    // among the Companions, based on a single (contested) transmitted hadith.
    // Kept as a profile since al-Dhahabi gives him his own entry; worth a
    // second look.
    name: 'سعيد بن الحارث',
    fullName: 'سعيد بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'saeed-ibn-al-harith',
    nameTransliterated: 'Saeed ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو سفيان بن الحارث',
    fullName: 'المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'abu-sufyan-ibn-al-harith',
    nameTransliterated: 'Abu Sufyan ibn al-Harith',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Not to be confused with a son of Abu Sufyan ibn Harb (Umayyad) — this
    // is the son of Abu Sufyan ibn al-Harith (Hashimite, previous entry);
    // the book places them back-to-back and both are noted steadfast at
    // Hunayn together.
    name: 'جعفر بن أبي سفيان',
    fullName: 'جعفر بن أبي سفيان المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'jaafar-ibn-abi-sufyan-al-hashimi',
    nameTransliterated: 'Jaafar ibn Abi Sufyan al-Hashimi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'جعفر بن أبي طالب',
    fullName: 'جعفر بن أبي طالب عبد مناف بن عبد المطلب بن هاشم بن عبد مناف بن قصي القرشي الهاشمي',
    slug: 'jaafar-ibn-abi-talib',
    nameTransliterated: 'Jaafar ibn Abi Talib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عقيل بن أبي طالب',
    fullName: 'عقيل بن أبي طالب عبد مناف بن عبد المطلب بن هاشم بن عبد مناف بن قصي القرشي الهاشمي',
    slug: 'aqil-ibn-abi-talib',
    nameTransliterated: 'Aqil ibn Abi Talib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'زيد بن حارثة',
    fullName: 'زيد بن حارثة بن شراحيل بن كعب بن عبد العزى بن يزيد بن امرئ القيس بن عامر بن النعمان الكلبي',
    slug: 'zaid-ibn-harithah',
    nameTransliterated: 'Zaid ibn Harithah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبد الله بن رواحة',
    fullName: 'عبد الله بن رواحة بن ثعلبة بن امرئ القيس بن ثعلبة الأنصاري الخزرجي',
    slug: 'abdullah-ibn-rawahah',
    nameTransliterated: 'Abdullah ibn Rawahah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
