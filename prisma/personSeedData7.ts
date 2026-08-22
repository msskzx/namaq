/**
 * Batch 4 of companion names extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * following the book's entries in order (islamweb bookid=60), covering
 * content-ids 76-112 (starting right after the "شهداء أجنادين واليرموك"
 * group header that opened this range, and after thabit-ibn-qais, the last
 * of batch 3, prisma/personSeedData6.ts). fullName is filled in from the
 * nasab given on each entry's own page, extended up through ancestors
 * already present in the graph where possible (see neo4j/graphSeedData6.ts)
 * — appearance/virtues are still left for a later enrichment batch.
 *
 * Content-ids 99 and 103-108 are gaps in the source tree's id sequence
 * (belong to a different branch) and are intentionally skipped.
 *
 * Content-id 84 ("زينب") is intentionally skipped entirely: she is almost
 * certainly Zainab bint Muhammad (wife of Abu al-Ass ibn al-Rabi, id 83,
 * mentioned briefly in his entry — the necklace sent to ransom him after
 * Badr, and their remarriage six years later). She already has a minimal
 * Person node in neo4j/graphSeedData.ts's corePeopleQueries
 * (zaynab-bint-muhammad) and will get her own full profile in a future
 * batch at content-id 160 ("زينب بنت رسول الله"), covering the Prophet's
 * daughters/wives. Creating her here from a one-word context mention would
 * risk a worse/incomplete profile that the later batch then has to fix.
 *
 * Content-id 100 ("أخبار النجاشي") and content-id 112 ("قصة سلمان الفارسي")
 * are real individual biographies despite the "أخبار"/"قصة" framing in
 * their titles:
 *   - An-Najashi (the Negus of Abyssinia) is explicitly discussed by
 *     al-Dhahabi within the Companions section, with the qualifier "تابعي
 *     من وجه، صاحب من وجه" (a Follower in one respect, a Companion in
 *     another) — he never met the Prophet in person or lived in Muslim
 *     lands, but the book still counts him among the Companions, and the
 *     Prophet performed a unique funeral prayer in absentia for him. Kept
 *     as a profile per the book's own framing; no Arab nasab exists for him
 *     (foreign king) so fullName is left null and no ancestor chain is
 *     created in the graph.
 *   - Salman al-Farisi is unambiguously framed as a companion ("صحب النبي
 *     وخدمه"). He is a Persian convert/freedman with no recorded Arab
 *     nasab (his father was a Zoroastrian dihqan in Isfahan, never named on
 *     the page) — fullName is left null and no ancestor chain is created,
 *     same precedent as salim-mawla-abi-hudhayfah in batch 1.
 *
 * Content-id 76 (Tulayhah ibn Khuwaylid): a marginal/unusual case — he
 * converted in year 9 AH, then apostatized and fought Muslims during the
 * Ridda wars claiming false prophethood, then returned to Islam under Abu
 * Bakr and died a Muslim general at Nahawand. Kept as a companion per the
 * book's own framing ("صاحب رسول الله") and the classical position that an
 * initial conversion during the Prophet's lifetime plus a final death as a
 * Muslim qualifies, despite the intervening apostasy — worth a second look.
 *
 * Content-id 85 (Umamah bint Abi al-Ass): the Prophet's granddaughter
 * (through Zaynab and Abu al-Ass, id 83), famously carried by him during
 * prayer. Her own page notes she did not narrate any hadith, but al-Dhahabi
 * still gives her a dedicated entry in the Companions section. Kept as a
 * profile per the same marginal-but-book-gives-own-entry precedent used for
 * saeed-ibn-al-harith and al-baraa-ibn-marur in earlier batches — the first
 * female profile added by this pipeline.
 *
 * No fullName in this batch is inferred from sibling placement — every
 * entry below has its own nasab, however short, stated directly on its own
 * page (see neo4j/graphSeedData6.ts header for the ancestor-chain
 * collisions this revealed with earlier batches).
 */
export const people = [
  {
    // Companion with an unusual history — see header note above.
    name: 'طليحة بن خويلد',
    fullName: 'طليحة بن خويلد بن نوفل الأسدي',
    slug: 'tulayhah-ibn-khuwaylid',
    nameTransliterated: 'Tulayhah ibn Khuwaylid',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'سعد بن الربيع',
    fullName: 'سعد بن الربيع بن عمرو بن أبي زهير بن مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي',
    slug: 'saad-ibn-al-rabi',
    nameTransliterated: 'Saad ibn al-Rabi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'معن بن عدي',
    fullName: 'معن بن عدي بن الجد بن العجلان الأنصاري حليف بني مالك بن عوف',
    slug: 'maan-ibn-adi',
    nameTransliterated: 'Maan ibn Adi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the famous hypocrite chief Abdullah ibn Ubayy, himself a
    // notable and devout companion; martyred at Yamamah.
    name: 'عبد الله بن عبد الله بن أبي',
    fullName: 'عبد الله بن عبد الله بن أبي بن مالك بن الحارث بن عبيد بن مالك بن سالم بن غنم بن عوف بن الخزرج الأنصاري الخزرجي',
    slug: 'abdullah-ibn-abdullah-ibn-ubayy',
    nameTransliterated: 'Abdullah ibn Abdullah ibn Ubayy',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عكرمة بن أبي جهل',
    fullName: 'عكرمة بن أبي جهل عمرو بن هشام بن المغيرة بن عبد الله بن عمر بن مخزوم القرشي المخزومي',
    slug: 'ikrimah-ibn-abi-jahl',
    nameTransliterated: 'Ikrimah ibn Abi Jahl',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبد الله بن عمرو بن حرام',
    fullName: 'عبد الله بن عمرو بن حرام بن ثعلبة بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
    slug: 'abdullah-ibn-amr-ibn-haram',
    nameTransliterated: 'Abdullah ibn Amr ibn Haram',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'يزيد بن أبي سفيان',
    fullName: 'يزيد بن أبي سفيان صخر بن حرب بن أمية بن عبد شمس بن عبد مناف القرشي الأموي',
    slug: 'yazid-ibn-abi-sufyan',
    nameTransliterated: 'Yazid ibn Abi Sufyan',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو العاص بن الربيع',
    fullName: 'أبو العاص بن الربيع بن عبد العزى بن عبد شمس بن عبد مناف بن قصي القرشي العبشمي',
    slug: 'abu-al-as-ibn-al-rabi',
    nameTransliterated: 'Abu al-As ibn al-Rabi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See header note above: marginal but book-given-own-entry case, the
    // Prophet's granddaughter via Zaynab and Abu al-Ass (previous entry).
    name: 'أمامة بنت أبي العاص',
    fullName: 'أمامة بنت أبي العاص بن الربيع بن عبد العزى بن عبد شمس القرشي العبشمي',
    slug: 'umamah-bint-abi-al-as',
    nameTransliterated: 'Umamah bint Abi al-As',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبو زيد',
    fullName: 'ثابت بن زيد بن قيس بن زيد بن النعمان بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي',
    slug: 'abu-zaid',
    nameTransliterated: 'Abu Zaid',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عباد بن بشر',
    fullName: 'عباد بن بشر بن وقش بن زغبة بن زعوراء بن عبد الأشهل الأنصاري الأوسي الأشهلي',
    slug: 'abbad-ibn-bishr',
    nameTransliterated: 'Abbad ibn Bishr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أسيد بن الحضير',
    fullName: 'أسيد بن الحضير بن سماك بن عتيك بن نافع بن امرئ القيس بن زيد بن عبد الأشهل الأنصاري الأوسي الأشهلي',
    slug: 'usayd-ibn-al-hudayr',
    nameTransliterated: 'Usayd ibn al-Hudayr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'الطفيل بن عمرو الدوسي',
    fullName: 'الطفيل بن عمرو بن طريف الدوسي',
    slug: 'at-tufayl-ibn-amr-ad-dawsi',
    nameTransliterated: 'At-Tufayl ibn Amr ad-Dawsi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Freed mawla; no recorded nasab beyond his father's name (matches
    // salim-mawla-abi-hudhayfah precedent — no ancestor chain in the graph).
    name: 'بلال بن رباح',
    fullName: 'بلال بن رباح',
    slug: 'bilal-ibn-rabah',
    nameTransliterated: 'Bilal ibn Rabah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Naming disagreement on the page: Medinans say "Abdullah ibn Qais ibn
    // Zaidah"; Iraqis say "Amr". The more commonly cited Medinan attribution
    // is used here.
    name: 'ابن أم مكتوم',
    fullName: 'عبد الله بن قيس بن زائدة بن الأصم بن رواحة القرشي العامري',
    slug: 'ibn-umm-maktum',
    nameTransliterated: 'Ibn Umm Maktum',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'خالد بن الوليد',
    fullName: 'خالد بن الوليد بن المغيرة بن عبد الله بن عمر بن مخزوم بن يقظة القرشي المخزومي',
    slug: 'khalid-ibn-al-walid',
    nameTransliterated: 'Khalid ibn al-Walid',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'صفوان ابن بيضاء',
    fullName: 'صفوان بن بيضاء وهب بن ربيعة بن هلال بن مالك بن ضبة بن الحارث بن فهر القرشي الفهري',
    slug: 'safwan-ibn-bayda',
    nameTransliterated: 'Safwan ibn Bayda',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of the previous entry (Safwan) and of Sahl ibn Bayda' (not
    // separately profiled — no content-id of his own in this range).
    name: 'سهيل ابن بيضاء الفهري',
    fullName: 'سهيل بن بيضاء وهب بن ربيعة بن هلال بن مالك بن ضبة بن الحارث بن فهر القرشي الفهري',
    slug: 'suhail-ibn-bayda',
    nameTransliterated: 'Suhail ibn Bayda al-Fihri',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'المقداد بن عمرو',
    fullName: 'المقداد بن عمرو بن ثعلبة بن مالك بن ربيعة القضاعي الكندي البهراني',
    slug: 'al-miqdad-ibn-amr',
    nameTransliterated: 'Al-Miqdad ibn Amr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'أبي بن كعب',
    fullName: 'أبي بن كعب بن قيس بن عبيد بن زيد بن معاوية بن عمرو بن مالك بن النجار الأنصاري النجاري',
    slug: 'ubayy-ibn-kaab',
    nameTransliterated: 'Ubayy ibn Kaab',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'النعمان بن مقرن',
    fullName: 'النعمان بن عمرو بن مقرن بن عائذ بن ميجا بن هجير بن نصر بن حبشية بن كعب بن ثور بن هدمة بن لاطم بن عثمان المزني',
    slug: 'al-numan-ibn-muqarrin',
    nameTransliterated: 'Al-Numan ibn Muqarrin',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Mawla (freed client) of Banu Makhzum, not a blood member of the tribe.
    name: 'عمار بن ياسر',
    fullName: 'عمار بن ياسر بن عامر بن مالك بن كنانة بن قيس بن الوذيم مولى بني مخزوم العنسي',
    slug: 'ammar-ibn-yasir',
    nameTransliterated: 'Ammar ibn Yasir',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See header note above: unusual companion-adjacent case, foreign king,
    // never met the Prophet in person; al-Dhahabi's own framing is "تابعي
    // من وجه، صاحب من وجه". No Arab nasab; name given varies by report.
    name: 'النجاشي',
    fullName: null,
    slug: 'an-najashi',
    nameTransliterated: 'An-Najashi (the Negus)',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'معاذ بن جبل',
    fullName: 'معاذ بن جبل بن عمرو بن أوس بن عائذ بن عدي بن كعب بن عمرو بن عدي بن سعد بن علي بن أسد بن ساردة بن يزيد بن جشم بن الخزرج الأنصاري الخزرجي',
    slug: 'muadh-ibn-jabal',
    nameTransliterated: 'Muadh ibn Jabal',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عبد الله بن مسعود',
    fullName: 'عبد الله بن مسعود بن غافل بن حبيب بن شمخ بن فار بن مخزوم بن صاهلة بن كاهل بن الحارث بن تميم بن سعد بن هذيل الهذلي',
    slug: 'abdullah-ibn-masud',
    nameTransliterated: 'Abdullah ibn Masud',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Abdullah ibn Masud (previous entry, shared father).
    name: 'عتبة بن مسعود الهذلي',
    fullName: 'عتبة بن مسعود بن غافل بن حبيب بن شمخ بن فار بن مخزوم بن صاهلة بن كاهل بن الحارث بن تميم بن سعد بن هذيل الهذلي',
    slug: 'utbah-ibn-masud-al-hudhali',
    nameTransliterated: 'Utbah ibn Masud al-Hudhali',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'خبيب بن يساف',
    fullName: 'خبيب بن يساف بن عنبة بن عمرو بن خديج بن عامر بن جشم بن الحارث الأنصاري الخزرجي',
    slug: 'khubayb-ibn-yasaf',
    nameTransliterated: 'Khubayb ibn Yasaf',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عويم بن ساعدة',
    fullName: 'عويم بن ساعدة بن عائش بن قيس بن النعمان بن زيد بن أمية الأنصاري الأوسي من بني عمرو بن عوف',
    slug: 'uwaym-ibn-saidah',
    nameTransliterated: 'Uwaym ibn Saidah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // See header note above: unambiguously framed as a companion by the
    // book despite the "قصة" (story of) title phrasing. Persian convert and
    // freedman; no recorded Arab nasab (father was a Zoroastrian dihqan in
    // Isfahan, unnamed on the page).
    name: 'سلمان الفارسي',
    fullName: null,
    slug: 'salman-al-farisi',
    nameTransliterated: 'Salman al-Farisi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
