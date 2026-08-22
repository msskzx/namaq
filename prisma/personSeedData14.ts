/**
 * Batch 11 of companion entries extracted from "سير أعلام النبلاء" (al-Dhahabi),
 * covering content-ids 268-290 (islamweb bookid=60) — ids 261-267 and 283 do
 * not exist in the book's own tree index (verified directly against the raw
 * tree HTML, same as id 216 in batch 9). This range is unusually rich in
 * Quraysh nobility with several deep, verifiable ancestor-chain reuses.
 *
 * Content-id 287 ("عقيل بن أبي طالب الهاشمي") is not a new profile: he
 * already has a full Postgres profile and graph node from an earlier batch
 * (slug aqil-ibn-abi-talib) — same nasab confirmed. His page here does add
 * two new facts not previously modelled (older than his brothers Ali and
 * Jafar by 20 and 10 years respectively), so BROTHER relations to both are
 * added in graphSeedData13.ts without a new Person node.
 *
 * fullName is filled in from each entry's own page nasab. Abu Rifaah
 * al-Adawi's own page gives two candidate identities (Tamim ibn Usayd,
 * the header name, or Khalifah's alternate "Abdullah ibn al-Harith") — the
 * header name is used. Thawban's father's name is disputed (Jahdar or
 * Bajdad) — the first-listed is used.
 */
export const people = [
  {
    // Freed slave/client of the Prophet. Sons Ubaydullah, Abd al-Rahman,
    // Abd al-Aziz, and Muslim (narrators from him) not yet in this pipeline.
    name: 'أبو بكرة الثقفي',
    fullName: 'نفيع بن الحارث الثقفي الطائفي',
    slug: 'abu-bakrah-al-thaqafi',
    nameTransliterated: 'Abu Bakrah al-Thaqafi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Chain continues to the existing abd-al-dar-ibn-qusay node via three
    // new graph-only ancestors, see graphSeedData13.ts. Paternal cousin of
    // Shaybah ibn Uthman below (their fathers Talhah and the elder Uthman
    // "al-Hijabi" were brothers, both sons of Abdullah ibn Abd al-Uzza/Abu
    // Talhah) — his own page states they shared custodianship of the
    // Kaabah as cousins.
    name: 'عثمان بن طلحة',
    fullName: 'عثمان بن طلحة بن عبد الله بن عبد العزى بن عثمان بن عبد الدار بن قصي بن كلاب القرشي العبدري',
    slug: 'uthman-ibn-talhah',
    nameTransliterated: 'Uthman ibn Talhah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Paternal cousin of Uthman ibn Talhah above — see that entry's note.
    // Maternal nephew of the existing companion Musab ibn Umayr (explicitly
    // "khaluhu", his maternal uncle, on his own page).
    name: 'شيبة بن عثمان',
    fullName: 'شيبة بن عثمان بن عبد الله بن عبد العزى القرشي العبدري',
    slug: 'shaybah-ibn-uthman',
    nameTransliterated: 'Shaybah ibn Uthman',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His own page gives an alternate identity per Khalifah ("Abdullah ibn
    // al-Harith, of Banu Adi al-Rabab") — the header name is used here.
    name: 'أبو رفاعة العدوي',
    fullName: 'تميم بن أسيد بن عدي بن عبد مناة بن أد بن طابخة المضري',
    slug: 'abu-rifaah-al-adawi',
    nameTransliterated: 'Abu Rifaah al-Adawi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Freed slave/client of the Prophet, bought and freed by him. Father's
    // name disputed (Jahdar or Bajdad, per his own page) — the first is
    // used.
    name: 'ثوبان',
    fullName: 'ثوبان بن جحدر',
    slug: 'thawban-al-nabawi',
    nameTransliterated: 'Thawban al-Nabawi',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father Amir ibn Kurayz given a new graph-only ancestor node (son of
    // the existing al-Bayda bint Abd al-Muttalib, and full brother of the
    // existing Arwa bint Kurayz — making him the existing Uthman ibn
    // Affan's maternal uncle, per this entry's own page) — see
    // graphSeedData13.ts.
    name: 'عبد الله بن عامر',
    fullName: 'عبد الله بن عامر بن كريز بن ربيعة بن حبيب بن عبد شمس بن عبد مناف بن قصي القرشي العبشمي',
    slug: 'abdullah-ibn-amir',
    nameTransliterated: 'Abdullah ibn Amir',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    name: 'المغيرة بن شعبة',
    fullName: 'المغيرة بن شعبة بن أبي عامر بن مسعود بن معتب الثقفي',
    slug: 'al-mughirah-ibn-shubah',
    nameTransliterated: 'Al-Mughirah ibn Shubah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His own page calls him "akhu Uthman min al-ridaah" — Uthman ibn
    // Affan's brother through breastfeeding, not blood — not modelled as a
    // family relation (no such tie in this graph).
    name: 'عبد الله بن سعد بن أبي سرح',
    fullName: 'عبد الله بن سعد بن أبي سرح بن الحارث القرشي العامري',
    slug: 'abdullah-ibn-saad-ibn-abi-sarh',
    nameTransliterated: 'Abdullah ibn Saad ibn Abi Sarh',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // No father's-father chain given on his own page.
    name: 'رويفع بن ثابت',
    fullName: 'رويفع بن ثابت الأنصاري النجاري',
    slug: 'ruwayfi-ibn-thabit',
    nameTransliterated: 'Ruwayfi ibn Thabit',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son Abd al-Rahman (a narrator from him) not yet in this pipeline.
    name: 'معاوية بن حديج',
    fullName: 'معاوية بن حديج بن جفنة بن قتيرة الكندي السكوني',
    slug: 'muawiyah-ibn-hudayj',
    nameTransliterated: 'Muawiyah ibn Hudayj',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // His own page lists five further candidate names besides the one used
    // here ("per the correct view") — son al-Mughirah and granddaughter
    // Muniyah bint Ubayd (narrators from him) not yet in this pipeline.
    name: 'أبو برزة الأسلمي',
    fullName: 'نضلة بن عبيد الأسلمي',
    slug: 'abu-barzah-al-aslami',
    nameTransliterated: 'Abu Barzah al-Aslami',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Father Hizam given a new graph-only ancestor node (son of the
    // existing Khuwaylid ibn Asad, full brother of the existing Khadijah
    // bint Khuwaylid and the existing Al-Awwam ibn Khuwaylid) — see
    // graphSeedData13.ts. His own page states Khadijah was his paternal
    // aunt and the existing Az-Zubayr ibn al-Awwam his paternal cousin,
    // both modelled there. Father of Hisham ibn Hakim below.
    name: 'حكيم بن حزام',
    fullName: 'حكيم بن حزام بن خويلد بن أسد بن عبد العزى بن قصي بن كلاب القرشي الأسدي',
    slug: 'hakim-ibn-hizam',
    nameTransliterated: 'Hakim ibn Hizam',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of Hakim ibn Hizam above (given as a direct continuation entry on
    // the same page: "وهشام بن حكيم ابنه").
    name: 'هشام بن حكيم',
    fullName: 'هشام بن حكيم بن حزام القرشي الأسدي',
    slug: 'hisham-ibn-hakim',
    nameTransliterated: 'Hisham ibn Hakim',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Sons Sad, Muhammad, Abd al-Malik, and Rabi (narrators from him) not
    // yet in this pipeline.
    name: 'كعب بن عجرة',
    fullName: 'كعب بن عجرة الأنصاري السالمي',
    slug: 'kaab-ibn-ujrah',
    nameTransliterated: 'Kaab ibn Ujrah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Paternal chain (per his son's own page, id 285 below) continues to
    // the existing amr-ibn-husays node via six new graph-only ancestors,
    // see graphSeedData13.ts. Father of Abdullah ibn Amr ibn al-As below,
    // and — per that entry's own page — brother of Hisham ibn al-As below.
    name: 'عمرو بن العاص',
    fullName: 'عمرو بن العاص بن وائل بن هاشم بن سعيد بن سعد بن سهم بن عمرو بن هصيص بن كعب بن لؤي بن غالب القرشي السهمي',
    slug: 'amr-ibn-al-as',
    nameTransliterated: 'Amr ibn al-As',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Explicitly "his [Amr ibn al-As's] brother" on Amr's own page (see the
    // famous hadith "the two sons of al-As are believers"). Mother Umm
    // Harmalah al-Makhzumiyyah, sister of the existing Abu Jahl, given a
    // new graph-only ancestor node — see graphSeedData13.ts.
    name: 'هشام بن العاص',
    fullName: 'هشام بن العاص بن وائل القرشي السهمي',
    slug: 'hisham-ibn-al-as',
    nameTransliterated: 'Hisham ibn al-As',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the existing-in-this-batch Amr ibn al-As above; mother Raitah
    // bint al-Hajjaj ibn Munabbih al-Sahmiyyah given a new graph-only
    // ancestor node — see graphSeedData13.ts.
    name: 'عبد الله بن عمرو بن العاص',
    fullName: 'عبد الله بن عمرو بن العاص بن وائل بن هاشم بن سعيد بن سعد بن سهم بن عمرو بن هصيص بن كعب بن لؤي بن غالب القرشي السهمي',
    slug: 'abdullah-ibn-amr-ibn-al-as',
    nameTransliterated: 'Abdullah ibn Amr ibn al-As',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Chain continues to the existing abd-manaf-ibn-qusay node via three
    // new graph-only ancestors, see graphSeedData13.ts. Called "ibn amm
    // al-Nabi" on his own page (a shared-Quraysh-ancestor kinsman via Abd
    // Manaf, not a first cousin).
    name: 'جبير بن مطعم',
    fullName: 'جبير بن مطعم بن عدي بن نوفل بن عبد مناف بن قصي القرشي النوفلي',
    slug: 'jubair-ibn-mutim',
    nameTransliterated: 'Jubair ibn Mutim',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Also known by his mother's name, "Yala ibn Munyah" — mother Munyah
    // bint Ghazwan, sister of the existing Utbah ibn Ghazwan, given a new
    // graph-only ancestor node — see graphSeedData13.ts. Brother Abd
    // al-Rahman and nephew Safwan ibn Abdullah (narrators from him) not yet
    // in this pipeline.
    name: 'يعلى بن أمية',
    fullName: 'يعلى بن أمية بن أبي عبيدة التميمي المكي',
    slug: 'yala-ibn-umayyah',
    nameTransliterated: 'Yala ibn Umayyah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the existing companion Saad ibn Ubadah, chief of Khazraj — his
    // own page's nasab chain matches Saad ibn Ubadah's exactly, no new
    // ancestor node needed, see graphSeedData13.ts.
    name: 'قيس بن سعد',
    fullName: 'قيس بن سعد بن عبادة بن دليم بن حارثة بن أبي حزيمة بن ثعلبة بن طريف بن الخزرج بن ساعدة بن كعب بن الخزرج الأنصاري الخزرجي الساعدي',
    slug: 'qais-ibn-saad',
    nameTransliterated: 'Qais ibn Saad',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
  {
    // Son of the existing companion Rabiah ibn al-Harith ibn Abd al-Muttalib
    // — no new ancestor node needed, see graphSeedData13.ts. Son Muhammad
    // (a narrator from him) not yet in this pipeline.
    name: 'عبد المطلب بن ربيعة',
    fullName: 'عبد المطلب بن ربيعة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'abd-al-muttalib-ibn-rabiah',
    nameTransliterated: 'Abd al-Muttalib ibn Rabiah',
    appearance: null,
    virtues: null,
    picture: null,
    titles: ['companion'],
  },
];
