/**
 * Batch 9 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 217-241 (islamweb bookid=60) — id 216 does not exist in
 * the book's own tree index (the sequence jumps 215 to 217). This range
 * includes several very well-known companions (Abu Ayyub al-Ansari, Zaid ibn
 * Thabit, Abdullah ibn Salam, Hudhayfah's contemporaries, Usamah ibn Zaid,
 * Hassan ibn Thabit, Ka'b ibn Malik) alongside more minor Ansari/tribal
 * figures. No ids in this range were skipped as duplicates.
 *
 * Content-id 229 is a second, distinct "رافع بن عمرو الغفاري" — al-Dhahabi's
 * own page for it opens with "ذكرته للتمييز" ("I mention this one only to
 * distinguish [him from the previous entry]"), i.e. he is deliberately
 * documenting a same-name collision within the book itself, not describing
 * the same man as content-id 228. Both entries' own page text gives the
 * tribe as "الغفاري" (the book's tree-index label for id 229, "المزني
 * البصري", does not match its own page content — the page is treated as
 * authoritative). Slugged `rafi-ibn-amr-al-ghifari-akhu-aidh` after the
 * one distinguishing fact given (brother of A'idh, not of al-Hakam).
 *
 * fullName is filled in from each entry's own page nasab where given. Abu
 * Humayd al-Sa'idi (id 231) has no settled name at all — his page offers two
 * candidates ("Abd al-Rahman" or "al-Mundhir ibn Sa'd") with no preference
 * stated — so fullName is left null rather than guessing.
 */
export const people = [
  {
    // Real name given on his own page: Khalid ibn Zaid. The Prophet lodged
    // with his family on arrival in Medina, before the Prophet's own
    // quarters and mosque were built.
    name: 'أبو أيوب الأنصاري',
    fullName: 'خالد بن زيد بن كليب بن ثعلبة بن عبد عمرو بن عوف بن غنم بن مالك بن النجار بن ثعلبة بن الخزرج',
    slug: 'abu-ayyub-al-ansari',
    nameTransliterated: 'Abu Ayyub al-Ansari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Originally named al-Husayn; renamed Abdullah by the Prophet, per Ibn
    // Sa'd on his own page.
    name: 'عبد الله بن سلام',
    fullName: 'عبد الله بن سلام بن الحارث الإسرائيلي',
    slug: 'abdullah-ibn-salam',
    nameTransliterated: 'Abdullah ibn Salam',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father Thabit ibn al-Dahhak, and the rest of the chain down to the
    // existing ghanm-ibn-malik node, given a new graph-only ancestor chain
    // — see graphSeedData11.ts. Wife Umm Sa'd bint Sa'd ibn al-Rabi
    // (daughter of the existing companion Sa'd ibn al-Rabi) also modelled
    // there, graph-only (not her own entry in this pipeline). His many
    // children (per Ibn Sa'd's page: Kharijah, Sulayman, and a dozen more)
    // are not modelled — none are their own entries here.
    name: 'زيد بن ثابت',
    fullName: 'زيد بن ثابت بن الضحاك بن زيد بن لوذان بن عمرو بن عبد عوف بن غنم بن مالك بن النجار بن ثعلبة الأنصاري الخزرجي النجاري',
    slug: 'zaid-ibn-thabit',
    nameTransliterated: 'Zaid ibn Thabit',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brothers Abu Hind al-Dari and Nu'aym al-Dari, both mentioned on his
    // page, are not yet in this pipeline — no relation modelled.
    name: 'تميم الداري',
    fullName: 'تميم بن أوس بن خارجة بن سود بن جذيمة اللخمي',
    slug: 'tamim-al-dari',
    nameTransliterated: 'Tamim al-Dari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Name given as al-Harith ibn Rib'i "per the correct view" (his page
    // also notes two rejected alternatives, al-Nu'man and Amr). Son Abdullah
    // ibn Abi Qatadah (a narrator from him) not yet in this pipeline.
    name: 'أبو قتادة الأنصاري',
    fullName: 'الحارث بن ربعي الأنصاري السلمي',
    slug: 'abu-qatadah-al-ansari',
    nameTransliterated: 'Abu Qatadah al-Ansari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عمرو بن عبسة',
    fullName: 'عمرو بن عبسة بن خالد بن حذيفة السلمي البجلي',
    slug: 'amr-ibn-absah',
    nameTransliterated: 'Amr ibn Absah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Explicitly "ibn akhi Hassan ibn Thabit" (nephew of Hassan ibn Thabit,
    // below) on his own page — modelled via a shared new ancestor node for
    // their grandfather/great-grandfather, since Shaddad's own chain and
    // Hassan's own chain overlap exactly from "Thabit ibn al-Mundhir ibn
    // Haram" onward; see graphSeedData11.ts.
    name: 'شداد بن أوس',
    fullName: 'شداد بن أوس بن ثابت بن المنذر بن حرام الأنصاري النجاري الخزرجي',
    slug: 'shaddad-ibn-aws',
    nameTransliterated: 'Shaddad ibn Aws',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No nasab beyond tribe given on his own page.
    name: 'عقبة بن عامر الجهني',
    fullName: 'عقبة بن عامر الجهني',
    slug: 'uqbah-ibn-amir-al-juhani',
    nameTransliterated: 'Uqbah ibn Amir al-Juhani',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sons Sulayman and Abdullah (narrators from him) not yet in this
    // pipeline.
    name: 'بريدة بن الحصيب',
    fullName: 'بريدة بن الحصيب بن عبد الله بن الحارث بن الأعرج بن سعد الأسلمي',
    slug: 'buraidah-ibn-al-husayb',
    nameTransliterated: 'Buraidah ibn al-Husayb',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Explicitly "shaqiq" (full sibling) of Aisha on his own page — modelled
    // as FATHER (existing abu-bakr-as-siddiq) and BROTHER/SISTER (existing
    // aisha-bint-abi-bakr), see graphSeedData11.ts. Son Abdullah and
    // daughter Hafsah (narrators from him), and nephew al-Qasim ibn
    // Muhammad, not yet in this pipeline.
    name: 'عبد الرحمن بن أبي بكر',
    fullName: 'عبد الرحمن بن أبي بكر الصديق',
    slug: 'abd-al-rahman-ibn-abi-bakr',
    nameTransliterated: 'Abd al-Rahman ibn Abi Bakr',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of Rafi ibn Amr al-Ghifari below (explicit on his own page).
    name: 'الحكم بن عمرو الغفاري',
    fullName: 'الحكم بن عمرو الغفاري',
    slug: 'al-hakam-ibn-amr-al-ghifari',
    nameTransliterated: 'Al-Hakam ibn Amr al-Ghifari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Brother of al-Hakam ibn Amr al-Ghifari above.
    name: 'رافع بن عمرو الغفاري',
    fullName: 'رافع بن عمرو الغفاري',
    slug: 'rafi-ibn-amr-al-ghifari',
    nameTransliterated: 'Rafi ibn Amr al-Ghifari',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // A second, distinct companion of the same name (content-id 229) — see
    // file header note. Brother of A'idh (not yet in this pipeline), not of
    // al-Hakam above; unrelated to the previous entry despite the identical
    // name and tribe.
    name: 'رافع بن عمرو الغفاري',
    fullName: 'رافع بن عمرو الغفاري',
    slug: 'rafi-ibn-amr-al-ghifari-akhu-aidh',
    nameTransliterated: 'Rafi ibn Amr al-Ghifari (brother of Aidh)',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // "Abu al-Arqam" is a kunya, not his real name — his page gives his
    // father's real name as Abd Manaf. Chain continues to the existing
    // abdullah-ibn-umar-ibn-makhzum node via two new graph-only ancestors,
    // see graphSeedData11.ts.
    name: 'الأرقم بن أبي الأرقم',
    fullName: 'الأرقم بن عبد مناف بن أسد بن عبد الله بن عمر بن مخزوم بن يقظة المخزومي',
    slug: 'al-arqam-ibn-abi-al-arqam',
    nameTransliterated: 'Al-Arqam ibn Abi al-Arqam',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No settled name — see file header note.
    name: 'أبو حميد الساعدي',
    fullName: null,
    slug: 'abu-humayd-al-saidi',
    nameTransliterated: 'Abu Humayd al-Saidi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Chain continues to the existing abd-manaf-ibn-zuhrah node via two new
    // graph-only ancestors, see graphSeedData11.ts.
    name: 'عبد الله بن الأرقم',
    fullName: 'عبد الله بن الأرقم بن عبد يغوث بن وهب بن عبد مناف بن زهرة القرشي الزهري',
    slug: 'abdullah-ibn-al-arqam',
    nameTransliterated: 'Abdullah ibn al-Arqam',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His father, also a companion, died in the year of the Conquest of
    // Mecca while en route — not named beyond "Abd Nahm ibn Afif" already in
    // the nasab, no separate node needed.
    name: 'عبد الله بن مغفل',
    fullName: 'عبد الله بن مغفل بن عبد نهم بن عفيف المزني',
    slug: 'abdullah-ibn-mughaffal',
    nameTransliterated: 'Abdullah ibn Mughaffal',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // "Dhu al-Shahadatayn" (whose testimony the Prophet counted as two
    // witnesses). Son Umarah (a narrator from him) not yet in this pipeline.
    name: 'خزيمة بن ثابت',
    fullName: 'خزيمة بن ثابت بن الفاكه بن ثعلبة بن ساعدة الأنصاري الخطمي',
    slug: 'khuzaymah-ibn-thabit',
    nameTransliterated: 'Khuzaymah ibn Thabit',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No nasab beyond tribe given on his own page.
    name: 'عوف بن مالك الأشجعي',
    fullName: 'عوف بن مالك الأشجعي الغطفاني',
    slug: 'awf-ibn-malik-al-ashjai',
    nameTransliterated: 'Awf ibn Malik al-Ashjai',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Ally (not blood kin) of Banu Abd Shams — no ancestor chain modelled.
    // Grandson Iyas ibn al-Harith ibn Muayqib (a narrator from him) not yet
    // in this pipeline.
    name: 'معيقيب بن أبي فاطمة الدوسي',
    fullName: 'معيقيب بن أبي فاطمة الدوسي',
    slug: 'muayqib-ibn-abi-fatimah-al-dawsi',
    nameTransliterated: 'Muayqib ibn Abi Fatimah al-Dawsi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Real name Uqbah ibn Amr; his page gives two variant spellings for one
    // link in the chain ("Usayrah" or "Yusayrah") — the fuller of the two
    // reports is used here since it continues the chain further.
    name: 'أبو مسعود البدري',
    fullName: 'عقبة بن عمرو بن ثعلبة بن يسيرة بن عسيرة بن عطية بن خدارة بن عوف بن الحارث بن الخزرج الأنصاري',
    slug: 'abu-masud-al-badri',
    nameTransliterated: 'Abu Masud al-Badri',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the existing companion Zaid ibn Harithah and, per his own page
    // ("he is the son of the Prophet's caretaker, Umm Ayman"), of the
    // existing Umm Ayman — both modelled as direct FATHER/MOTHER edges to
    // existing nodes, no new ancestor node needed, see graphSeedData11.ts.
    name: 'أسامة بن زيد',
    fullName: 'أسامة بن زيد بن حارثة بن شراحيل بن عبد العزى بن امرئ القيس',
    slug: 'usamah-ibn-zaid',
    nameTransliterated: 'Usamah ibn Zaid',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'عمران بن حصين',
    fullName: 'عمران بن حصين بن عبيد بن خلف الخزاعي',
    slug: 'imran-ibn-husain',
    nameTransliterated: 'Imran ibn Husain',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Mother al-Furayah bint Khunays given on his own page (his epithet
    // "Ibn al-Furayah" derives from her) — not modelled as a separate node,
    // no further chain given for her. Father's chain continues to the
    // existing haram-ibn-amr node via two new graph-only ancestors, and
    // Shaddad ibn Aws above is modelled as his nephew through the same
    // chain — see graphSeedData11.ts. Son Abd al-Rahman (a narrator from
    // him) not yet in this pipeline.
    name: 'حسان بن ثابت',
    fullName: 'حسان بن ثابت بن المنذر بن حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري',
    slug: 'hassan-ibn-thabit',
    nameTransliterated: 'Hassan ibn Thabit',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Chain continues to the existing ghanm-ibn-kaab node via four new
    // graph-only ancestors, see graphSeedData11.ts. His father's kunya
    // (Abu Ka'b) and real name (Amr) are both given on his own page. Several
    // sons (Abdullah, Ubaydullah, Abd al-Rahman, Muhammad, Ma'bad) are
    // named as narrators from him but not modelled — none are their own
    // entries here.
    name: 'كعب بن مالك',
    fullName: 'كعب بن مالك بن أبي كعب عمرو بن القين بن كعب بن سواد بن غنم بن كعب بن سلمة الأنصاري الخزرجي',
    slug: 'kaab-ibn-malik',
    nameTransliterated: 'Kaab ibn Malik',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
