/**
 * Batch 12 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 291-316 (islamweb bookid=60) — ids 294-302 do not
 * exist in the book's own tree index (verified directly against the raw
 * tree HTML, same gap pattern as ids 216, 261-267, and 283 in earlier
 * batches). Content-id 316 (al-Bara ibn Azib) is confirmed as the LAST
 * entry in the book's Companions ("الصحابة رضوان الله عليهم") section — no
 * further ids follow it in the tree. This completes the companion
 * extraction pipeline sourced from this book.
 *
 * fullName is filled in from each entry's own page nasab. Abu Mahdhurah's
 * own page gives two full candidate identities (the header name, used here,
 * or an alternate per a second report) — the header name is used.
 */
export const people = [
  {
    name: 'فضالة بن عبيد',
    fullName: 'فضالة بن عبيد بن نافذ بن قيس بن صهيب بن أصرم بن جحجبى الأنصاري الأوسي',
    slug: 'fadalah-ibn-ubayd',
    nameTransliterated: 'Fadalah ibn Ubayd',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // The muezzin of the Sacred Mosque. His own page gives a second
    // candidate identity ("Sumayr ibn Umayr ibn Lawdhan ibn Wahb ibn Sad
    // ibn Jumah") — the header name is used. Mother from Khuzaah (no
    // further chain given). Son Abd al-Malik (a narrator from him) not yet
    // in this pipeline.
    name: 'أبو محذورة الجمحي',
    fullName: 'أوس بن معير بن لوذان بن ربيعة بن سعد بن جمح القرشي الجمحي',
    slug: 'abu-mahdhurah-al-jumahi',
    nameTransliterated: 'Abu Mahdhurah al-Jumahi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the existing companion Abu Sufyan ibn Harb (his own page's
    // nasab matches Abu Sufyan's fullName exactly); mother Hind bint Utbah
    // given a new graph-only ancestor node reaching the existing
    // utbah-ibn-rabiah — see graphSeedData14.ts. Full brother of the
    // existing Umm Habibah (already a "full sister" per an earlier batch's
    // note; both parents now modelled).
    name: 'معاوية بن أبي سفيان',
    fullName: 'صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي الأموي',
    slug: 'muawiyah-ibn-abi-sufyan',
    nameTransliterated: 'Muawiyah ibn Abi Sufyan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of Hatim al-Tai, the pre-Islamic Arab paragon of generosity.
    name: 'عدي بن حاتم',
    fullName: 'عدي بن حاتم بن عبد الله بن سعد بن الحشرج بن امرئ القيس بن عدي الطائي',
    slug: 'adi-ibn-hatim',
    nameTransliterated: 'Adi ibn Hatim',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'زيد بن أرقم',
    fullName: 'زيد بن أرقم بن زيد بن قيس بن النعمان بن مالك الأغر بن ثعلبة بن كعب بن الخزرج بن الحارث بن الخزرج الأنصاري الخزرجي',
    slug: 'zaid-ibn-arqam',
    nameTransliterated: 'Zaid ibn Arqam',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Maternal brother of the existing companion Qatadah ibn al-Numan
    // (explicit on his own page — see graphSeedData14.ts). Father Malik
    // martyred at Uhud, not modelled as a separate node.
    name: 'أبو سعيد الخدري',
    fullName: 'سعد بن مالك بن سنان بن ثعلبة بن عبيد بن الأبجر بن عوف بن الحارث بن الخزرج الأنصاري الخزرجي',
    slug: 'abu-said-al-khudri',
    nameTransliterated: 'Abu Said al-Khudri',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Freed slave/client of the Prophet — was owned by the existing Umm
    // Salamah, who freed him on condition of lifelong service to the
    // Prophet (a manumission arrangement, not a family tie — not modelled
    // as a relation). Sons Umar and Abd al-Rahman (narrators from him) not
    // yet in this pipeline.
    name: 'سفينة',
    fullName: null,
    slug: 'safinah',
    nameTransliterated: 'Safinah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Distinct from the next entry (content-id 308) despite the similar
    // name — al-Dhahabi documents both, disambiguated by tribe (Bajali vs
    // Azdi).
    name: 'جندب',
    fullName: 'جندب بن عبد الله بن سفيان البجلي العلقي',
    slug: 'jundub-ibn-abdullah-al-bajali',
    nameTransliterated: 'Jundub ibn Abdullah al-Bajali',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Distinct from the previous entry (content-id 307) — see that entry's
    // note. His own page gives an alternate name "Jundub ibn Kaab".
    name: 'جندب الأزدي',
    fullName: 'جندب بن عبد الله الأزدي',
    slug: 'jundub-al-azdi',
    nameTransliterated: 'Jundub al-Azdi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Poet; real name per Muhammad ibn Sallam.
    name: 'النابغة الجعدي',
    fullName: 'قيس بن عبد الله بن عدس بن ربيعة بن جعدة',
    slug: 'al-nabighah-al-jadi',
    nameTransliterated: 'Al-Nabighah al-Jadi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sons Jafar and Abdullah, and nephew al-Zibriqan ibn Abdullah
    // (narrators from him), not yet in this pipeline.
    name: 'عمرو بن أمية',
    fullName: 'عمرو بن أمية بن خويلد بن عبد الله بن إياس الضمري',
    slug: 'amr-ibn-umayyah-al-damri',
    nameTransliterated: 'Amr ibn Umayyah al-Damri',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'رافع بن خديج',
    fullName: 'رافع بن خديج بن رافع بن عدي بن تزيد الأنصاري الخزرجي المدني',
    slug: 'rafi-ibn-khudayj',
    nameTransliterated: 'Rafi ibn Khudayj',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son Sulayman (a narrator from him) not yet in this pipeline.
    name: 'سمرة بن جندب',
    fullName: 'سمرة بن جندب بن هلال الفزاري',
    slug: 'samurah-ibn-jundub',
    nameTransliterated: 'Samurah ibn Jundub',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Distinct lineage from Samurah ibn Jundub above (his own father,
    // Samurah ibn Junadah, is a different person of the same first name,
    // unrelated tribe) — no ancestor node modelled for either father.
    name: 'جابر بن سمرة',
    fullName: 'جابر بن سمرة بن جنادة بن جندب السوائي',
    slug: 'jabir-ibn-samurah',
    nameTransliterated: 'Jabir ibn Samurah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'حبيب بن مسلمة',
    fullName: 'حبيب بن مسلمة بن مالك القرشي الفهري',
    slug: 'habib-ibn-maslamah',
    nameTransliterated: 'Habib ibn Maslamah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the existing companion Abdullah ibn Amr ibn Haram (martyred at
    // Uhud) — his own page's nasab matches that companion's fullName
    // exactly, no new ancestor node needed, see graphSeedData14.ts.
    name: 'جابر بن عبد الله',
    fullName: 'جابر بن عبد الله بن عمرو بن حرام بن ثعلبة بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
    slug: 'jabir-ibn-abdullah',
    nameTransliterated: 'Jabir ibn Abdullah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Maternal uncle is the existing companion Abu Burdah ibn Niyar,
    // explicit on his own page — see graphSeedData14.ts. The final entry in
    // the book's Companions section.
    name: 'البراء بن عازب',
    fullName: 'البراء بن عازب بن الحارث الأنصاري الحارثي المدني',
    slug: 'al-baraa-ibn-azib',
    nameTransliterated: 'Al-Baraa ibn Azib',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
