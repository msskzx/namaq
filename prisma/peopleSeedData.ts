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
  },
  {
    name: 'سعد بن أبي وقاص',
    fullName: 'سعد بن مالك بن وهيب بن عبد مناف بن زهرة القرشي الزهري، أبو إسحاق',
    slug: 'saad-ibn-abi-waqqas',
    appearance: 'كان جميل الوجه، طويل القامة، قوي البنية، اشتهر بمهارته في الرماية.',
    virtues: 'أحد العشرة المبشرين بالجنة، أحد الستة أصحاب الشورى، أول من رمى بسهم في سبيل الله، خال النبي صلى الله عليه وسلم، مستجاب الدعوة، شجاع، قائد في فتح العراق وفارس.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'the-six-of-the-shura', 'companion', 'awwal-rami'],
  },
  {
    name: 'أبو بكر الصديق',
    fullName: 'عبد الله بن أبي قحافة عثمان بن عامر التيمي القرشي',
    slug: 'abu-bakr-as-siddiq',
    appearance: 'كان أبيض نحيفًا خفيف العارضين معروق الوجه.',
    virtues: 'أول الخلفاء الراشدين، صديق الأمة، أحد العشرة المبشرين بالجنة، رفيق النبي في الهجرة.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'siddiq-al-ummah'],
  },
  {
    name: 'عمر بن الخطاب',
    fullName: 'عمر بن الخطاب بن نفيل العدوي القرشي',
    slug: 'umar-ibn-al-khattab',
    appearance: 'كان طويلًا، أصلع، شديد البياض، قوي البنية.',
    virtues: 'ثاني الخلفاء الراشدين، الفاروق، أحد العشرة المبشرين بالجنة، شديد في الحق.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'al-farouq'],
  },
  {
    name: 'عثمان بن عفان',
    fullName: 'عثمان بن عفان بن أبي العاص الأموي القرشي',
    slug: 'uthman-ibn-affan',
    appearance: 'كان حسن الوجه، كث اللحية، طويل القامة.',
    virtues: 'ثالث الخلفاء الراشدين، ذو النورين، أحد العشرة المبشرين بالجنة، كريم وسخي.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'dhu-al-nurayn'],
  },
  {
    name: 'علي بن أبي طالب',
    fullName: 'علي بن أبي طالب بن عبد المطلب الهاشمي القرشي',
    slug: 'ali-ibn-abi-talib',
    appearance: 'كان ربعة، عريض المنكبين، قوي البنية، كث اللحية.',
    virtues: 'رابع الخلفاء الراشدين، أبو الحسن، أحد العشرة المبشرين بالجنة، شجاع وعالم.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'caliph', 'companion', 'abu-al-hasan'],
  },
  {
    name: 'الزبير بن العوام',
    fullName: 'الزبير بن العوام بن خويلد الأسدي القرشي',
    slug: 'az-zubayr-ibn-al-awwam',
    appearance: 'كان طويلًا، نحيفًا، خفيف اللحية.',
    virtues: 'حَوَارِيّ النبي، أحد العشرة المبشرين بالجنة، شجاع ومقدام.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'hawari-al-ummah'],
  },
  {
    name: 'طلحة بن عبيد الله',
    fullName: 'طلحة بن عبيد الله بن عثمان التيمي القرشي',
    slug: 'talhah-ibn-ubaydullah',
    appearance: 'كان أشعر، حسن الوجه، كريم اليد.',
    virtues: 'أحد العشرة المبشرين بالجنة، كريم، شجاع، من السابقين إلى الإسلام.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'al-sabiqeen'],
  },
  {
    name: 'عبد الرحمن بن عوف',
    fullName: 'عبد الرحمن بن عوف بن عبد عوف الزهري القرشي',
    slug: 'abdur-rahman-ibn-awf',
    appearance: 'كان طويلًا، أسمر اللون، كث اللحية.',
    virtues: 'أحد العشرة المبشرين بالجنة، تاجر غني، كريم وسخي.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'amin-al-ummah'],
  },
  {
    name: 'سعيد بن زيد',
    fullName: 'سعيد بن زيد بن عمرو العدوي القرشي',
    slug: 'saeed-ibn-zaid',
    appearance: 'كان طويلًا، أسمر اللون، خفيف اللحية.',
    virtues: 'أحد العشرة المبشرين بالجنة، من السابقين إلى الإسلام.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'al-sabiqeen'],
  },
  {
    name: 'أبو عبيدة بن الجراح',
    fullName: 'عامر بن عبد الله بن الجراح الفهري القرشي',
    slug: 'abu-ubaydah-ibn-al-jarrah',
    appearance: 'كان نحيفًا، طويل القامة، خفيف اللحية.',
    virtues: 'أمين الأمة، أحد العشرة المبشرين بالجنة، قائد عسكري بارز.',
    picture: null,
    titles: ['the-ten-promised-paradise', 'companion', 'amin-al-ummah'],
  },
];

export const peopleRelations = [
  {
    fromSlug: 'saad-ibn-abi-waqqas',
    toSlug: 'prophet-muhammad',
    type: 'MATERNAL_UNCLE',
  },
  {
    fromSlug: 'prophet-muhammad',
    toSlug: 'saad-ibn-abi-waqqas',
    type: 'MATERNAL_NEPHEW',
  },
  {
    fromSlug: 'abu-bakr-as-siddiq',
    toSlug: 'prophet-muhammad',
    type: 'FATHER_IN_LAW',
  },
  {
    fromSlug: 'umar-ibn-al-khattab',
    toSlug: 'prophet-muhammad',
    type: 'FATHER_IN_LAW',
  },
  {
    fromSlug: 'uthman-ibn-affan',
    toSlug: 'prophet-muhammad',
    type: 'FATHER_IN_LAW',
  },
  {
    fromSlug: 'ali-ibn-abi-talib',
    toSlug: 'prophet-muhammad',
    type: 'FATHER_IN_LAW',
  },
  {
    fromSlug: 'az-zubayr-ibn-al-awwam',
    toSlug: 'prophet-muhammad',
    type: 'PATERNAL_COUSIN',
  },
  {
    fromSlug: 'abdur-rahman-ibn-awf',
    toSlug: 'prophet-muhammad',
    type: 'FATHER_IN_LAW',
  },
];

export const peopleBattleParticipations = [
  {
    personSlug: 'saad-ibn-abi-waqqas',
    battleSlug: 'badr',
    isMuslim: true,
    status: ['INJURED'],
  },
  {
    personSlug: 'prophet-muhammad',
    battleSlug: 'badr',
    isMuslim: true,
    status: [],
  },
  // Uhud participations
  {
    personSlug: 'saad-ibn-abi-waqqas',
    battleSlug: 'uhud',
    isMuslim: true,
    status: ['INJURED'],
  },
  {
    personSlug: 'prophet-muhammad',
    battleSlug: 'uhud',
    isMuslim: true,
    status: ['INJURED'],
  },
  // Khandaq participations
  {
    personSlug: 'saad-ibn-abi-waqqas',
    battleSlug: 'khandaq',
    isMuslim: true,
    status: [],
  },
  {
    personSlug: 'prophet-muhammad',
    battleSlug: 'khandaq',
    isMuslim: true,
    status: [],
  },
  // Ten promised paradise companions (example participations)
  { personSlug: 'abu-bakr-as-siddiq', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'umar-ibn-al-khattab', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'uthman-ibn-affan', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'ali-ibn-abi-talib', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'az-zubayr-ibn-al-awwam', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'talhah-ibn-ubaydullah', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'abdur-rahman-ibn-awf', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'saeed-ibn-zaid', battleSlug: 'badr', isMuslim: true, status: [] },
  { personSlug: 'abu-ubaydah-ibn-al-jarrah', battleSlug: 'badr', isMuslim: true, status: [] },
]; 