// Arabic seed data for people and their relations.
//
// Abu Ubaydah ibn al-Jarrah, Talhah ibn Ubaydullah and al-Zubayr ibn al-Awwam
// are not here: they are authored in data/catalog/people/, from the source,
// with their citations, and written by npm run catalog:project and
// catalog:project-graph. Their Qur'an links moved with them.

export const people = [
  // prophet-muhammad is authored in
  // data/catalog/people/prophet-muhammad.ts; this entry is retired
  // and what it held is carried there.
  // abu-bakr-as-siddiq is authored in
  // data/catalog/people/abu-bakr-as-siddiq.ts; this entry is retired
  // and what it held is carried there.
  // umar-ibn-al-khattab is authored in
  // data/catalog/people/umar-ibn-al-khattab.ts; this entry is retired
  // and what it held is carried there.
  // uthman-ibn-affan is authored in
  // data/catalog/people/uthman-ibn-affan.ts; this entry is retired
  // and what it held is carried there.
  // ali-ibn-abi-talib is authored in
  // data/catalog/people/ali-ibn-abi-talib.ts; this entry is retired
  // and what it held is carried there.
  // saeed-ibn-zaid is authored in
  // data/catalog/people/saeed-ibn-zaid.ts; this entry is retired
  // and what it held is carried there.
    // Wives of the Prophet (Peace be upon him)
  // khadijah-bint-khuwaylid is authored in
  // data/catalog/people/khadijah-bint-khuwaylid.ts; this entry is retired
  // and what it held is carried there.
  {
    name: 'عائشة بنت أبي بكر',
    fullName: 'عائشة بنت أبي بكر الصديق عبد الله بن أبي قحافة التيمية القرشية',
    slug: 'aisha-bint-abi-bakr',
    appearance: 'وصفت بأنها كانت بيضاء اللون، ذات جمال، وكانت نحيفة.',
    virtues: 'أم المؤمنين، حبيبة رسول الله، أفقه نساء الأمة، روت أحاديث كثيرة، اشتهرت بذكائها وفصاحتها.',
    picture: null,
    titles: ['mother-of-believers', 'siddiqa'],
    ayat: [
      { surah: 24, ayah: 11 }, // النور: 11 - آيات الإفك، تبرئة لها من الله.
      { surah: 33, ayah: 33 }, // الأحزاب: 33 - آية التطهير.
    ],
  },
  {
    name: 'حفصة بنت عمر',
    fullName: 'حفصة بنت عمر بن الخطاب العدوية القرشية',
    slug: 'hafsa-bint-umar',
    appearance: 'وصفت بأنها كانت ذات هيئة وجمال.',
    virtues: 'أم المؤمنين، كانت قارئة كاتبة، حفظت المصحف بعد وفاة أبيها، عرفت بالعبادة والورع.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [
      { surah: 66, ayah: 5 }, // التحريم: 5 - "عسى ربه إن طلقكن أن يبدله أزواجاً خيراً منكن"
    ],
  },
  // zaynab-bint-khuzaymah is authored in
  // data/catalog/people/zaynab-bint-khuzaymah.ts; this entry is retired
  // and what it held is carried there.
  {
    name: 'أم سلمة',
    fullName: 'هند بنت أبي أمية حذيفة بن المغيرة المخزومية القرشية',
    slug: 'umm-salamah',
    appearance: 'وصفت بأنها كانت من أجمل النساء.',
    virtues: 'أم المؤمنين، من أعقل وأفقه نساء الصحابة، ذات رأي سديد، هاجرت هجرتين، روت أحاديث كثيرة.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [
      { surah: 33, ayah: 33 }, // الأحزاب: 33 - آية التطهير
    ],
  },
  {
    name: 'زينب بنت جحش',
    fullName: 'زينب بنت جحش بن رئاب الأسدية القرشية',
    slug: 'zaynab-bint-jahsh',
    appearance: 'وصفت بأنها كانت جميلة وذات صنعة، وكانت تعمل بيديها وتتصدق.',
    virtues: 'أم المؤمنين، تزوجها النبي بأمر من الله بعد طلاقها من زيد بن حارثة، عرفت بكثرة عبادتها وجودها وكرمها.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [
      { surah: 33, ayah: 37 }, // الأحزاب: 37 - قصة زواجها من النبي بأمر إلهي.
    ],
  },
  {
    name: 'جويرية بنت الحارث',
    fullName: 'جويرية بنت الحارث بن أبي ضرار المصطلقية الخزاعية',
    slug: 'juwayriyah-bint-al-harith',
    appearance: 'وصفت بأنها كانت ذات جمال فاتن.',
    virtues: 'أم المؤمنين، من سبايا غزوة بني المصطلق، أسلمت وتزوجها النبي، كان زواجها سببًا في إعتاق مئات الأسرى من قومها.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [],
  },
  {
    name: 'أم حبيبة',
    fullName: 'رملة بنت أبي سفيان صخر بن حرب الأموية القرشية',
    slug: 'umm-habibah',
    appearance: null,
    virtues: 'أم المؤمنين، ابنة أبي سفيان، هاجرت إلى الحبشة، تزوجها النبي وهي هناك.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [],
  },
  {
    name: 'صفية بنت حيي',
    fullName: 'صفية بنت حيي بن أخطب النضيرية الإسرائيلية',
    slug: 'safiyyah-bint-huyayy',
    appearance: 'وصفت بأنها كانت جميلة جداً.',
    virtues: 'أم المؤمنين، كانت من سبايا خيبر، أسلمت وتزوجها النبي، عرفت بحلمها وصبرها.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [],
  },
  {
    name: 'ميمونة بنت الحارث',
    fullName: 'ميمونة بنت الحارث بن حزن الهلالية',
    slug: 'maymunah-bint-al-harith',
    appearance: null,
    virtues: 'أم المؤمنين، آخر من تزوجها النبي، عرفت بورعها وصلة رحمها.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [],
  },
  {
    name: 'سودة بنت زمعة',
    fullName: 'سودة بنت زمعة بن قيس القرشية العامرية',
    slug: 'sawdah-bint-zamah',
    appearance: null,
    virtues: 'أم المؤمنين، أول امرأة تزوجها النبي بعد خديجة، عرفت بخفة روحها وحبها للخير.',
    picture: null,
    titles: ['mother-of-believers'],
    ayat: [],
  },
  // Daughters of the Prophet (Peace be upon him)
  {
    name: 'فاطمة بنت محمد',
    fullName: 'فاطمة بنت محمد بن عبد الله الهاشمية القرشية',
    slug: 'fatimah-bint-muhammad',
    appearance: 'كانت تشبه النبي صلى الله عليه وسلم في مشيتها وكلامها.',
    virtues: 'بضعة من رسول الله، سيدة نساء أهل الجنة، زوجة علي بن أبي طالب، أم الحسنين.',
    picture: null,
    titles: ['daughter-of-prophet', 'sayyidat-nisa-ahl-al-jannah'],
    ayat: [
      { surah: 76, ayah: 8 }, // الإنسان: 8 - "ويطعمون الطعام..." (هي وعلي والحسن والحسين)
      { surah: 33, ayah: 33 }, // الأحزاب: 33 - آية التطهير
    ],
  },
  {
    name: 'زينب بنت محمد',
    fullName: 'زينب بنت محمد بن عبد الله الهاشمية القرشية',
    slug: 'zaynab-bint-muhammad',
    appearance: null,
    virtues: 'كبرى بنات النبي، هاجرت بعد معاناة، عرفت بوفائها لزوجها.',
    picture: null,
    titles: ['daughter-of-prophet'],
    ayat: [],
  },
  {
    name: 'رقية بنت محمد',
    fullName: 'رقية بنت محمد بن عبد الله الهاشمية القرشية',
    slug: 'ruqayyah-bint-muhammad',
    appearance: null,
    virtues: 'بنت النبي، زوجة عثمان بن عفان رضي الله عنه، هاجرت إلى الحبشة.',
    picture: null,
    titles: ['daughter-of-prophet'],
    ayat: [],
  },
  {
    name: 'أم كلثوم بنت محمد',
    fullName: 'أم كلثوم بنت محمد بن عبد الله الهاشمية القرشية',
    slug: 'umm-kulthum-bint-muhammad',
    appearance: null,
    virtues: 'بنت النبي، زوجة عثمان بن عفان بعد وفاة أختها رقية، وبذلك لقب عثمان بذي النورين.',
    picture: null,
    titles: ['daughter-of-prophet'],
    ayat: [],
  },
  // Sons of the Prophet (Peace be upon him)
  {
    name: 'القاسم بن محمد',
    fullName: 'القاسم بن محمد بن عبد الله الهاشمي القرشي',
    slug: 'al-qasim-ibn-muhammad',
    appearance: null,
    virtues: 'أول أبناء النبي، توفي صغيراً.',
    picture: null,
    titles: ['son-of-prophet'],
    ayat: [],
  },
  {
    name: 'عبد الله بن محمد',
    fullName: 'عبد الله بن محمد بن عبد الله الهاشمي القرشي (الطيب الطاهر)',
    slug: 'abdullah-ibn-muhammad',
    appearance: null,
    virtues: 'ابن النبي، توفي صغيراً، لقب بالطيب والطاهر.',
    picture: null,
    titles: ['son-of-prophet'],
    ayat: [],
  },
  {
    name: 'إبراهيم بن محمد',
    fullName: 'إبراهيم بن محمد بن عبد الله الهاشمي القرشي',
    slug: 'ibrahim-ibn-muhammad',
    appearance: null,
    virtues: 'ابن النبي من مارية القبطية، توفي صغيراً.',
    picture: null,
    titles: ['son-of-prophet'],
    ayat: [],
  },
  // Uncles of the Prophet (Peace be upon him)
  // hamzah-ibn-abd-al-muttalib is authored in
  // data/catalog/people/hamzah-ibn-abd-al-muttalib.ts; this entry is retired
  // and what it held is carried there.
  {
    name: 'أبو طالب بن عبد المطلب',
    fullName: 'عبد مناف بن عبد المطلب بن هاشم القرشي الهاشمي (أبو طالب)',
    slug: 'abu-talib',
    appearance: null,
    virtues: 'عم النبي وكافله بعد وفاة جده، حاميه وناصره في بداية الدعوة الإسلامية رغم عدم إسلامه.',
    picture: null,
    titles: ['uncle-of-prophet'],
    ayat: [],
  },
  {
    name: 'العباس بن عبد المطلب',
    fullName: 'العباس بن عبد المطلب بن هاشم القرشي الهاشمي',
    slug: 'al-abbas-ibn-abd-al-muttalib',
    appearance: null,
    virtues: 'عم النبي، من السابقين إلى الإسلام، كان له دور في حماية النبي والدعوة بعد إسلامه، جد الخلفاء العباسيين.',
    picture: null,
    titles: ['uncle-of-prophet', 'companion'],
    ayat: [],
  },
  // Nephews of the Prophet (Peace be upon him)
  {
    name: 'الحسن بن علي',
    fullName: 'الحسن بن علي بن أبي طالب الهاشمي القرشي',
    slug: 'al-hasan-ibn-ali',
    appearance: 'كان يشبه النبي صلى الله عليه وسلم في ملامحه.',
    virtues: 'سبط النبي وريحانته، سيد شباب أهل الجنة، خامس الخلفاء الراشدين، تنازل عن الخلافة حقناً لدماء المسلمين.',
    picture: null,
    titles: ['grandson-of-prophet', 'sayyid-shabab-ahl-al-jannah', 'caliph'],
    ayat: [
      { surah: 76, ayah: 8 }, // الإنسان: 8 - "ويطعمون الطعام..." (هو وأهله)
      { surah: 33, ayah: 33 }, // الأحزاب: 33 - آية التطهير
    ],
  },
  {
    name: 'الحسين بن علي',
    fullName: 'الحسين بن علي بن أبي طالب الهاشمي القرشي',
    slug: 'al-husayn-ibn-ali',
    appearance: 'كان يشبه النبي صلى الله عليه وسلم.',
    virtues: 'سبط النبي وريحانته، سيد شباب أهل الجنة، استشهد في كربلاء دفاعاً عن الحق.',
    picture: null,
    titles: ['grandson-of-prophet', 'sayyid-shabab-ahl-al-jannah', 'martyr'],
    ayat: [
      { surah: 76, ayah: 8 }, // الإنسان: 8 - "ويطعمون الطعام..." (هو وأهله)
      { surah: 33, ayah: 33 }, // الأحزاب: 33 - آية التطهير
    ],
  },
  {
    name: 'عبد الله بن جعفر بن أبي طالب',
    fullName: 'عبد الله بن جعفر بن أبي طالب الهاشمي القرشي',
    slug: 'abdullah-ibn-jaafar',
    appearance: null,
    virtues: 'ابن عم النبي، من أجود الناس وأكرمهم، كان يُلقب بـ "بحر الجود".',
    picture: null,
    titles: ['cousin-of-prophet', 'companion'],
    ayat: [],
  },
  // Grandchildren of the Prophet (Peace be upon him) through Fatimah and Ali
  {
    name: 'أم كلثوم بنت علي',
    fullName: 'أم كلثوم بنت علي بن أبي طالب الهاشمية القرشية',
    slug: 'umm-kulthum-bint-ali',
    appearance: null,
    virtues: 'بنت علي وفاطمة، حفيدة النبي.',
    picture: null,
    titles: ['granddaughter-of-prophet'],
    ayat: [],
  },
  {
    name: 'زينب بنت علي',
    fullName: 'زينب بنت علي بن أبي طالب الهاشمية القرشية',
    slug: 'zaynab-bint-ali',
    appearance: null,
    virtues: 'بنت علي وفاطمة، حفيدة النبي، عرفت بشجاعتها وفصاحتها.',
    picture: null,
    titles: ['granddaughter-of-prophet'],
    ayat: [],
  },
];

export const peopleBattleParticipations = [
  // Battle of Badr (2 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'badr', isMuslim: true, status: ['ABSENT_EXCUSED'] },
  { personSlug: 'hamzah-ibn-abd-al-muttalib', battleSlug: 'badr', isMuslim: true, status: [] }, // Added
  // { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'badr', isMuslim: false, status: ['CAPTURED'] }, // Added (was not Muslim at Badr)

  // Battle of Uhud (3 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'uhud', isMuslim: true, status: ['INJURED'] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'hamzah-ibn-abd-al-muttalib', battleSlug: 'uhud', isMuslim: true, status: ['MARTYRED'] }, // Added
  // { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'uhud', isMuslim: false, status: [] }, // Added (still not Muslim publicly)

  // Battle of the Trench (Khandaq) (5 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'khandaq', isMuslim: true, status: [] }, // Added (became Muslim after Badr/Uhud)

  // Siege of Banu Qurayzah (5 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'banu-qurayzah', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'banu-qurayzah', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'banu-qurayzah', isMuslim: true, status: [] }, // Added

  // Treaty of Hudaybiyyah (6 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] }, // Added

  // Battle of Khaybar (7 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'khaybar', isMuslim: true, status: [] }, // Added

  // Battle of Mu'tah (8 AH)
  { personSlug: 'prophet-muhammad', battleSlug: 'mutah', isMuslim: true, status: [] },
  { personSlug: 'abdullah-ibn-jaafar', battleSlug: 'mutah', isMuslim: true, status: [] }, // Added (one of the commanders)

  // Conquest of Mecca (8 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'fath-makkah', isMuslim: true, status: [] }, // Added

  // Battle of Hunayn (8 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'hunayn', isMuslim: true, status: [] }, // Added

  // Siege of Taif (8 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'taif', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'taif', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'taif', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'taif', isMuslim: true, status: [] }, // Added

  // Expedition of Tabuk (9 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'al-abbas-ibn-abd-al-muttalib', battleSlug: 'tabuk', isMuslim: true, status: [] }, // Added
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'tabuk', isMuslim: true, status: ['ABSENT_EXCUSED'] }, // Added (Left in charge of Medina)

  // Battle of Chains (Dhat al-Salasil) (12 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'zat-as-salasil', isMuslim: true, status: [] },

  // Battle of Ajnadayn (13 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'ajnadayn', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'ajnadayn', isMuslim: true, status: [] },

  // Battle of Fihl (13 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fihl', isMuslim: true, status: [] },

  // Conquest of Damascus (14 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-damascus', isMuslim: true, status: [] },

  // Battle of Yarmuk (15 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'yarmuk', isMuslim: true, status: [] },

  // Battle of al-Qadisiyyah (15 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'qadisiyyah', isMuslim: true, status: [] },

  // Conquest of Ctesiphon (16 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-ctesiphon', isMuslim: true, status: [] },

  // Conquest of Jerusalem (16 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-jerusalem', isMuslim: true, status: [] },

  // Conquest of Alexandria (20 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-alexandria', isMuslim: true, status: [] },

  // Battle of Nahavand (21 AH)
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'nahavand', isMuslim: true, status: [] },

  // Conquest of Cyprus (28 AH)
  { personSlug: 'uthman-ibn-affan', battleSlug: 'fath-cyprus', isMuslim: true, status: [] },

  // Battle of the Masts (Dhat al-Sawari) (34 AH)
  { personSlug: 'uthman-ibn-affan', battleSlug: 'zat-as-sawari', isMuslim: true, status: [] },

  // Battle of the Camel (36 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'jamal', isMuslim: true, status: [] },
  { personSlug: 'aisha-bint-abi-bakr', battleSlug: 'jamal', isMuslim: true, status: [] }, // Added

  // Battle of Siffin (37 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'siffin', isMuslim: true, status: [] },

  // Battle of Nahrawan (38 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'nahrawan', isMuslim: true, status: [] },
];