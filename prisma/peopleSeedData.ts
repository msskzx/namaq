// Arabic seed data for people and their relations

export const people = [
  {
    name: 'محمد ﷺ',
    fullName: 'محمد بن عبد الله بن عبد المطلب بن هاشم بن عبد مناف بن قصي بن كلاب بن مرة بن كعب بن لؤي بن غالب بن فهر بن مالك بن النضر بن كنانة بن خزيمة بن مدركة بن إلياس بن مضر بن نزار بن معد بن عدنان.',
    slug: 'prophet-muhammad',
    appearance: 'كان متوسط القامة، عريض المنكبين، كث اللحية، مشرق الوجه، يوصف بأنه أجمل الناس.',
    virtues: 'خاتم الأنبياء، رحمة للعالمين، صاحب الخلق العظيم، قائد، معلم، رجل دولة.',
    picture: null,
    titles: ['prophet', 'messenger'], // keep for lookup, but do not pass to Prisma
    ayat: [
      { surah: 33, ayah: 40 }, // الأحزاب: 40 (محمد رسول الله)
      { surah: 21, ayah: 107 }, // الأنبياء: 107 (رحمة للعالمين)
      { surah: 68, ayah: 4 }, // القلم: 4 (وإنك لعلى خلق عظيم)
      { surah: 48, ayah: 29 }, // الفتح: 29 (محمد رسول الله والذين معه...)
      { surah: 7, ayah: 157 }, // الأعراف: 157 (الذين يتبعون الرسول النبي الأمي...)
      { surah: 3, ayah: 144 }, // آل عمران: 144 (وما محمد إلا رسول...)
      { surah: 33, ayah: 21 }, // الأحزاب: 21 (لقد كان لكم في رسول الله أسوة حسنة)
      { surah: 9, ayah: 128 }, // التوبة: 128 (لقد جاءكم رسول من أنفسكم...)
      { surah: 53, ayah: 3 }, // النجم: 3 (وما ينطق عن الهوى)
      { surah: 48, ayah: 8 }, // الفتح: 8 (إنا أرسلناك شاهداً ومبشراً ونذيراً)
      { surah: 33, ayah: 45 }, // الأحزاب: 45 (يا أيها النبي إنا أرسلناك شاهداً ومبشراً ونذيراً)
      { surah: 5, ayah: 15 }, // المائدة: 15 (قد جاءكم من الله نور وكتاب مبين)
      { surah: 61, ayah: 6 }, // الصف: 6 (ومبشراً برسول يأتي من بعدي اسمه أحمد)
      { surah: 2, ayah: 151 }, // البقرة: 151 (كما أرسلنا فيكم رسولاً منكم)
      { surah: 62, ayah: 2 }, // الجمعة: 2 (هو الذي بعث في الأميين رسولاً منهم)
      { surah: 3, ayah: 164 }, // آل عمران: 164 (لقد من الله على المؤمنين إذ بعث فيهم رسولاً من أنفسهم)
      { surah: 7, ayah: 158 }, // الأعراف: 158 (فآمنوا بالله ورسوله النبي الأمي)
      { surah: 48, ayah: 26 }, // الفتح: 26 (وجعل كلمة الذين كفروا السفلى وكلمة الله هي العليا)
      { surah: 33, ayah: 56 } // الأحزاب: 56 (إن الله وملائكته يصلون على النبي)
    ],
  },
  {
    name: 'سعد بن أبي وقاص',
    fullName: 'سعد بن مالك بن وهيب بن عبد مناف بن زهرة القرشي الزهري، أبو إسحاق',
    slug: 'saad-ibn-abi-waqqas',
    appearance: 'كان جميل الوجه، طويل القامة، قوي البنية، اشتهر بمهارته في الرماية.',
    virtues: 'أحد العشرة المبشرين بالجنة، أحد الستة أصحاب الشورى، أول من رمى بسهم في سبيل الله، خال النبي صلى الله عليه وسلم، مستجاب الدعوة، شجاع، قائد في فتح العراق وفارس.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'the-six-of-the-shura', 'companion', 'awwal-rami'],
    ayat: [
      { surah: 6, ayah: 124 }
    ],
  },
  {
    name: 'أبو بكر الصديق',
    fullName: 'عبد الله بن أبي قحافة عثمان بن عامر التيمي القرشي',
    slug: 'abu-bakr-as-siddiq',
    appearance: 'كان أبيض نحيفًا خفيف العارضين معروق الوجه.',
    virtues: 'أول الخلفاء الراشدين، صديق الأمة، أحد العشرة المبشرين بالجنة، رفيق النبي في الهجرة.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'siddiq-al-ummah'],
    ayat: [
      { surah: 9, ayah: 40 }, // التوبة: 40 - "إذ يقول لصاحبه لا تحزن"
      { surah: 92, ayah: 17 }, // الليل: 17 - "وسيجنبها الأتقى"
    ]
  },
  {
    name: 'عمر بن الخطاب',
    fullName: 'عمر بن الخطاب بن نفيل العدوي القرشي',
    slug: 'umar-ibn-al-khattab',
    appearance: 'كان طويلًا، أصلع، شديد البياض، قوي البنية.',
    virtues: 'ثاني الخلفاء الراشدين، الفاروق، أحد العشرة المبشرين بالجنة، شديد في الحق.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'al-farouq'],
    ayat: [
      { surah: 66, ayah: 4 }, // التحريم: 4 - "إن تتوبا إلى الله..."
      { surah: 2, ayah: 125 }, // البقرة: 125 - في قصة اتخاذ مقام إبراهيم مصلى، موافقة لرأي عمر.
      { surah: 9, ayah: 84 }, 
      { surah: 8, ayah: 67 },
      { surah: 5, ayah: 91 },
      { surah: 24, ayah: 58 }
    ]
  },
  {
    name: 'عثمان بن عفان',
    fullName: 'عثمان بن عفان بن أبي العاص الأموي القرشي',
    slug: 'uthman-ibn-affan',
    appearance: 'كان حسن الوجه، كث اللحية، طويل القامة.',
    virtues: 'ثالث الخلفاء الراشدين، ذو النورين، أحد العشرة المبشرين بالجنة، كريم وسخي.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'dhu-al-nurayn', 'the-six-of-the-shura'],
    ayat: [
      { surah: 24, ayah: 36 }, // النور: 36 - "في بيوت أذن الله أن ترفع..." (ورد أنها تشمل بيت عثمان)
      { surah: 9, ayah: 99 }, // التوبة: 99 - فيمن أنفقوا في سبيل الله (عثمان من أكثر المنفقين في العسرة)
    ]
  },
  {
    name: 'علي بن أبي طالب',
    fullName: 'علي بن أبي طالب بن عبد المطلب الهاشمي القرشي',
    slug: 'ali-ibn-abi-talib',
    appearance: 'كان ربعة، عريض المنكبين، قوي البنية، كث اللحية.',
    virtues: 'رابع الخلفاء الراشدين، أبو الحسن، أحد العشرة المبشرين بالجنة، شجاع وعالم.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'abu-al-hasan', 'the-six-of-the-shura'],
    ayat: [
      { surah: 2, ayah: 207 }, // البقرة: 207 - "ومن الناس من يشري نفسه..." (نزلت فيه ليلة المبيت في فراش النبي)
      { surah: 76, ayah: 8 }, // الإنسان: 8 - "ويطعمون الطعام..." (هو وفاطمة والحسن والحسين)
    ]
  },
  {
    name: 'الزبير بن العوام',
    fullName: 'الزبير بن العوام بن خويلد الأسدي القرشي',
    slug: 'az-zubayr-ibn-al-awwam',
    appearance: 'كان طويلًا، نحيفًا، خفيف اللحية.',
    virtues: 'حَوَارِيّ النبي، أحد العشرة المبشرين بالجنة، شجاع ومقدام.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'hawari-al-ummah', 'the-six-of-the-shura'],
    ayat: [
      { surah: 3, ayah: 172 }, // آل عمران: 172 - "الذين استجابوا لله والرسول..." (بعد أحد – والزبير منهم)
    ]
  },
  {
    name: 'طلحة بن عبيد الله',
    fullName: 'طلحة بن عبيد الله بن عثمان التيمي القرشي',
    slug: 'talhah-ibn-ubaydullah',
    appearance: 'كان أشعر، حسن الوجه، كريم اليد.',
    virtues: 'أحد العشرة المبشرين بالجنة، كريم، شجاع، من السابقين إلى الإسلام.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'al-sabiqeen', 'the-six-of-the-shura'],
    ayat: [
      { surah: 3, ayah: 172 }, // آل عمران: 172 - مثل الزبير (في غزوة حمراء الأسد)
    ]
  },
  {
    name: 'عبد الرحمن بن عوف',
    fullName: 'عبد الرحمن بن عوف بن عبد عوف الزهري القرشي',
    slug: 'abdur-rahman-ibn-awf',
    appearance: 'كان طويلًا، أسمر اللون، كث اللحية.',
    virtues: 'أحد العشرة المبشرين بالجنة، تاجر غني، كريم وسخي.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'the-six-of-the-shura'],
    ayat: [
      { surah: 9, ayah: 100 }, // التوبة: 100 - "والسابقون الأولون من المهاجرين..." (وهو من السابقين)
    ]
  },
  {
    name: 'سعيد بن زيد',
    fullName: 'سعيد بن زيد بن عمرو العدوي القرشي',
    slug: 'saeed-ibn-zaid',
    appearance: 'كان طويلًا، أسمر اللون، خفيف اللحية.',
    virtues: 'أحد العشرة المبشرين بالجنة، من السابقين إلى الإسلام.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'al-sabiqeen'],
    ayat: [
      { surah: 9, ayah: 100 }, // التوبة: 100 - "والسابقون الأولون من المهاجرين..." (وهو من السابقين)
    ]
  },
  {
    name: 'أبو عبيدة بن الجراح',
    fullName: 'عامر بن عبد الله بن الجراح الفهري القرشي',
    slug: 'abu-ubaydah-ibn-al-jarrah',
    appearance: 'كان نحيفًا، طويل القامة، خفيف اللحية.',
    virtues: 'أمين الأمة، أحد العشرة المبشرين بالجنة، قائد عسكري بارز.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'amin-al-ummah'],
    ayat: [
      { surah: 9, ayah: 100 }, // التوبة: 100 - "والسابقون الأولون من المهاجرين..." (وهو من السابقين)
    ]
  },
];

export const peopleRelations = [
  { fromSlug: 'saad-ibn-abi-waqqas', toSlug: 'prophet-muhammad', type: 'MATERNAL_UNCLE' },
  { fromSlug: 'prophet-muhammad', toSlug: 'saad-ibn-abi-waqqas', type: 'MATERNAL_NEPHEW' },
  { fromSlug: 'abu-bakr-as-siddiq', toSlug: 'prophet-muhammad', type: 'FATHER_IN_LAW' },
  { fromSlug: 'umar-ibn-al-khattab', toSlug: 'prophet-muhammad', type: 'FATHER_IN_LAW' },
  { fromSlug: 'uthman-ibn-affan', toSlug: 'prophet-muhammad', type: 'FATHER_IN_LAW' },
  { fromSlug: 'ali-ibn-abi-talib', toSlug: 'prophet-muhammad', type: 'FATHER_IN_LAW' },
  { fromSlug: 'az-zubayr-ibn-al-awwam', toSlug: 'prophet-muhammad', type: 'PATERNAL_COUSIN' },
  { fromSlug: 'abdur-rahman-ibn-awf', toSlug: 'prophet-muhammad', type: 'FATHER_IN_LAW' },
];

export const peopleBattleParticipations = [
  // Battle of Badr (2 AH)
  { personSlug: 'abdur-rahman-ibn-awf', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'az-zubayr-ibn-al-awwam', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'saad-ibn-abi-waqqas', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'saeed-ibn-zaid', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'talhah-ibn-ubaydullah', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'badr', isMuslim: true, status: ['ABSENT_EXCUSED'] },

  // Battle of Uhud (3 AH)
  { personSlug: 'abdur-rahman-ibn-awf', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'az-zubayr-ibn-al-awwam', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'uhud', isMuslim: true, status: ['INJURED'] },
  { personSlug: 'saad-ibn-abi-waqqas', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'saeed-ibn-zaid', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'talhah-ibn-ubaydullah', battleSlug: 'uhud', isMuslim: true, status: ['INJURED'] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'uhud', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'uhud', isMuslim: true, status: [] },

  // Battle of the Trench (Khandaq) (5 AH)
  { personSlug: 'abdur-rahman-ibn-awf', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'az-zubayr-ibn-al-awwam', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'saad-ibn-abi-waqqas', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'saeed-ibn-zaid', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'talhah-ibn-ubaydullah', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'khandaq', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'khandaq', isMuslim: true, status: [] },

  // Siege of Banu Qurayzah (5 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'banu-qurayzah', isMuslim: true, status: [] },
  { personSlug: 'az-zubayr-ibn-al-awwam', battleSlug: 'banu-qurayzah', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'banu-qurayzah', isMuslim: true, status: [] },

  // Treaty of Hudaybiyyah (6 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'hudaybiyyah', isMuslim: true, status: [] },

  // Battle of Khaybar (7 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'khaybar', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'khaybar', isMuslim: true, status: [] },

  // Battle of Mu'tah (8 AH)
  { personSlug: 'prophet-muhammad', battleSlug: 'mutah', isMuslim: true, status: [] },

  // Conquest of Mecca (8 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-makkah', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'fath-makkah', isMuslim: true, status: [] },

  // Battle of Hunayn (8 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'hunayn', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'hunayn', isMuslim: true, status: [] },

  // Siege of Taif (8 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'taif', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'taif', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'taif', isMuslim: true, status: [] },

  // Expedition of Tabuk (9 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'prophet-muhammad', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'tabuk', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'tabuk', isMuslim: true, status: [] },

  // Battle of Chains (Dhat al-Salasil) (12 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'zat-as-salasil', isMuslim: true, status: [] },

  // Battle of Ajnadayn (13 AH)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'ajnadayn', isMuslim: true, status: [] },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'ajnadayn', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'ajnadayn', isMuslim: true, status: [] },

  // Battle of Fihl (13 AH)
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'fihl', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fihl', isMuslim: true, status: [] },

  // Conquest of Damascus (14 AH)
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'fath-damascus', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-damascus', isMuslim: true, status: [] },

  // Battle of Yarmuk (15 AH)
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'yarmuk', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'yarmuk', isMuslim: true, status: [] },

  // Battle of al-Qadisiyyah (15 AH)
  { personSlug: 'saad-ibn-abi-waqqas', battleSlug: 'qadisiyyah', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'qadisiyyah', isMuslim: true, status: [] },

  // Conquest of Ctesiphon (16 AH)
  { personSlug: 'saad-ibn-abi-waqqas', battleSlug: 'fath-ctesiphon', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'fath-ctesiphon', isMuslim: true, status: [] },

  // Conquest of Jerusalem (16 AH)
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'fath-jerusalem', isMuslim: true, status: [] },
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
  { personSlug: 'az-zubayr-ibn-al-awwam', battleSlug: 'jamal', isMuslim: true, status: ['MARTYRED'] },
  { personSlug: 'talhah-ibn-ubaydullah', battleSlug: 'jamal', isMuslim: true, status: ['MARTYRED'] },

  // Battle of Siffin (37 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'siffin', isMuslim: true, status: [] },

  // Battle of Nahrawan (38 AH)
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'nahrawan', isMuslim: true, status: [] },
];