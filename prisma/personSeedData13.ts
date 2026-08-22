/**
 * Batch 10 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 242-260 (islamweb bookid=60) — a mix of Quraysh
 * converts from the Conquest of Mecca, tribal delegation leaders, and major
 * hadith narrators, ending with Abu Hurayrah.
 *
 * Content-id 252 ("عمير بن سعد") is skipped as a duplicate: his own page
 * gives his nasab as "ibn Sa'd ibn Shahid ibn Qais ibn al-Nu'man ibn Amr,
 * al-Ansari al-Awsi", matching the existing umayr-ibn-saad-al-ansari
 * (prisma/personSeedData8.ts, "Umayr ibn Sa'd ibn Shahid al-Ansari
 * al-Awsi") — same name, same father, same tribe.
 *
 * fullName is filled in from each entry's own page nasab. Abu Hurayrah's
 * real name is one of the most disputed in the book — his own page lists
 * nine candidate names and disputes his father's name too; al-Dhahabi's own
 * stated preference ("أرجحها") is used here. Abu al-Ghadiyah and Abu
 * Thalabah al-Khushani have no nasab at all on their own pages — fullName
 * is left null rather than guessing.
 */
export const people = [
  {
    name: 'جرير بن عبد الله',
    fullName: 'جرير بن عبد الله بن جابر بن مالك بن نصر بن ثعلبة بن جشم بن عوف البجلي القسري',
    slug: 'jarir-ibn-abdullah',
    nameTransliterated: 'Jarir ibn Abdullah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Kunya used as part of the primary name per the book's own heading; no
    // father's-father chain given. The one who captured al-Abbas at Badr.
    name: 'أبو اليسر كعب بن عمرو الأنصاري',
    fullName: 'كعب بن عمرو الأنصاري السلمي',
    slug: 'abu-al-yusr-al-ansari',
    nameTransliterated: 'Abu al-Yusr al-Ansari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sons al-Mundhir, Hamzah, and al-Zubayr (narrators from him) not yet in
    // this pipeline.
    name: 'أبو أسيد الساعدي',
    fullName: 'مالك بن ربيعة بن البدن الأنصاري الساعدي',
    slug: 'abu-usayd-al-saidi',
    nameTransliterated: 'Abu Usayd al-Saidi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No nasab beyond his father's name given on his own page.
    name: 'حويطب بن عبد العزى القرشي',
    fullName: 'حويطب بن عبد العزى القرشي العامري',
    slug: 'huwaytib-ibn-abd-al-uzza',
    nameTransliterated: 'Huwaytib ibn Abd al-Uzza',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son Abd al-Rahman (a narrator from him) not yet in this pipeline.
    name: 'سعيد بن يربوع القرشي',
    fullName: 'سعيد بن يربوع القرشي المخزومي',
    slug: 'said-ibn-yarbu-al-qurashi',
    nameTransliterated: 'Said ibn Yarbu al-Qurashi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Chain continues to the existing uhayb-ibn-abd-manaf node via one new
    // graph-only ancestor, see graphSeedData12.ts.
    name: 'مخرمة بن نوفل',
    fullName: 'مخرمة بن نوفل بن أهيب بن عبد مناف بن زهرة بن كلاب القرشي الزهري',
    slug: 'makhramah-ibn-nawfal',
    nameTransliterated: 'Makhramah ibn Nawfal',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Tribe disputed between Muzaynah and Juhaynah, and no father's name
    // given at all — fullName left null. Son Sad (a narrator from him) not
    // yet in this pipeline.
    name: 'أبو الغادية الصحابي',
    fullName: null,
    slug: 'abu-al-ghadiyah',
    nameTransliterated: 'Abu al-Ghadiyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // The companion exonerated alongside Aisha in the Ifk (slander) incident
    // — his own page recounts his role in escorting her back to the
    // caravan.
    name: 'صفوان بن المعطل',
    fullName: 'صفوان بن المعطل بن رحضة بن المؤمل السلمي الذكواني',
    slug: 'safwan-ibn-al-muattal',
    nameTransliterated: 'Safwan ibn al-Muattal',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Carried the Prophet's letter to Heraclius.
    name: 'دحية الكلبي',
    fullName: 'دحية بن خليفة بن فروة بن فضالة الكلبي القضاعي',
    slug: 'dihyah-al-kalbi',
    nameTransliterated: 'Dihyah al-Kalbi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Name possibly Ubayd, per his own page ("qeela ismuhu Ubayd") — no
    // further nasab chain given.
    name: 'أبو جهم بن حذيفة القرشي',
    fullName: 'عبيد بن حذيفة القرشي العدوي',
    slug: 'abu-jahm-ibn-hudhayfah',
    nameTransliterated: 'Abu Jahm ibn Hudhayfah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Chain continues to the existing wahb-ibn-hudhafah node via two new
    // graph-only ancestors, see graphSeedData12.ts. Son Abdullah and
    // nephew Humayd (narrators from him) not yet in this pipeline.
    name: 'صفوان بن أمية',
    fullName: 'صفوان بن أمية بن خلف بن وهب بن حذافة بن جمح بن عمرو بن هصيص بن كعب بن لؤي بن غالب القرشي الجمحي المكي',
    slug: 'safwan-ibn-umayyah',
    nameTransliterated: 'Safwan ibn Umayyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No nasab at all given on his own page — fullName left null.
    name: 'أبو ثعلبة الخشني',
    fullName: null,
    slug: 'abu-thalabah-al-khushani',
    nameTransliterated: 'Abu Thalabah al-Khushani',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Two reported chains on his own page: the majority (Hisham ibn
    // al-Kalbi, Ibn Main, al-Bukhari, Abu Ubayd) gives "ibn Samurah ibn
    // Habib ibn Abd Shams ibn Abd Manaf" directly; al-Zubayr ibn Bakkar's
    // addition inserts "Rabiah" between Habib and Abd Shams. The latter,
    // fuller reading is used here since it reaches the existing
    // rabiah-ibn-abd-shams node via two new graph-only ancestors, see
    // graphSeedData12.ts.
    name: 'عبد الرحمن بن سمرة',
    fullName: 'عبد الرحمن بن سمرة بن حبيب بن ربيعة بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي العبشمي',
    slug: 'abd-al-rahman-ibn-samurah',
    nameTransliterated: 'Abd al-Rahman ibn Samurah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sons Alqamah and Abd al-Jabbar (narrators from him) not yet in this
    // pipeline.
    name: 'وائل بن حجر',
    fullName: 'وائل بن حجر بن سعد الحضرمي',
    slug: 'wail-ibn-hujr',
    nameTransliterated: 'Wail ibn Hujr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Real name per al-Bukhari and others.
    name: 'أبو واقد الليثي',
    fullName: 'الحارث بن عوف الليثي',
    slug: 'abu-waqid-al-laythi',
    nameTransliterated: 'Abu Waqid al-Laythi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No father's-father chain given on his own page.
    name: 'معقل بن يسار',
    fullName: 'معقل بن يسار المزني',
    slug: 'maqil-ibn-yasar',
    nameTransliterated: 'Maqil ibn Yasar',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No father's-father chain given on his own page; distinct from Maqil
    // ibn Yasar above (different father, different tribe).
    name: 'معقل بن سنان الأشجعي',
    fullName: 'معقل بن سنان الأشجعي',
    slug: 'maqil-ibn-sinan-al-ashjai',
    nameTransliterated: 'Maqil ibn Sinan al-Ashjai',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His own page lists nine candidate real names and disputes his
    // father's name too; al-Dhahabi's own stated preference ("أرجحها") is
    // used here. Mother Maymunah bint Sabih (per al-Tabarani, no further
    // chain given) not modelled as a separate node. Son al-Muharrar (a
    // narrator from him) not yet in this pipeline.
    name: 'أبو هريرة',
    fullName: 'عبد الرحمن بن صخر الدوسي اليماني',
    slug: 'abu-hurayrah',
    nameTransliterated: 'Abu Hurayrah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
