import { EventType } from '../src/generated/prisma';

export const eventsData = [
  // Birth Events
  {
    name: 'مولد النبي محمد ﷺ',
    nameTransliterated: 'Birth of the Prophet Muhammad (PBUH)',
    slug: 'birth-prophet-muhammad',
    type: EventType.BIRTH,
    hijriYear: -53,
    hijriPeriod: '53 قبل الهجرة',
    gregorianYear: 570,
    gregorianPeriod: '570 م',
    description: 'مولد النبي محمد صلى الله عليه وسلم',
    descriptionTransliterated: 'Birth of the Prophet Muhammad (PBUH)',
    location: 'مكة المكرمة',
    locationTransliterated: 'Mecca',
    personSlugs: ['prophet-muhammad']
  },
  {
    name: 'مولد فاطمة بنت محمد',
    nameTransliterated: 'Birth of Fatimah bint Muhammad',
    slug: 'birth-fatimah',
    type: EventType.BIRTH,
    hijriYear: -3,
    hijriPeriod: '3 قبل الهجرة',
    gregorianYear: 619,
    gregorianPeriod: '619 م',
    description: 'مولد فاطمة بنت محمد',
    descriptionTransliterated: 'Birth of Fatimah bint Muhammad',
    location: 'مكة المكرمة',
    locationTransliterated: 'Mecca',
    personSlugs: ['fatimah-bint-muhammad']
  },

  // Hijra Events
  {
    name: 'هجرة إلى المدينة',
    nameTransliterated: 'Hijra to Medina',
    slug: 'hijra-to-medina',
    type: EventType.HIJRA,
    hijriYear: 1,
    hijriPeriod: '1 هـ',
    gregorianYear: 622,
    gregorianPeriod: '622 م',
    description: 'هجرة النبي محمد صلى الله عليه وسلم من مكة إلى المدينة',
    descriptionTransliterated: 'Hijra (Migration) of the Prophet Muhammad (PBUH) from Mecca to Medina',
    location: 'من مكة إلى المدينة',
    locationTransliterated: 'From Mecca to Medina',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq'],
    categories: ['hijra'],
  },
  {
    name: 'الهجرة الأولى إلى الحبشة',
    nameTransliterated: 'First Hijra to Abyssinia',
    slug: 'first-hijra-to-abyssinia',
    type: EventType.HIJRA_HABASHA,
    hijriYear: -7,
    hijriPeriod: '7 قبل الهجرة',
    gregorianYear: 615,
    gregorianPeriod: '615 م',
    description: 'الهجرة الأولى إلى الحبشة',
    descriptionTransliterated: 'First Hijra to Abyssinia',
    location: 'من مكة إلى الحبشة',
    locationTransliterated: 'From Mecca to Abyssinia',
    personSlugs: ['jaafar-ibn-abi-talib', 'usman-ibn-affan', 'ruqayyah-bint-muhammad']
  },

  // Battle Events
  {
    name: 'غزوة بدر',
    nameTransliterated: 'Battle of Badr',
    slug: 'battle-of-badr',
    type: EventType.BATTLE,
    battleSlug: 'badr',
    hijriYear: 2,
    hijriPeriod: '2 هـ',
    gregorianYear: 624,
    gregorianPeriod: '624 م',
    description: 'غزوة بدر - أول معركة كبرى في التاريخ الإسلامي',
    descriptionTransliterated: 'Battle of Badr - First major battle in Islamic history',
    location: 'بدر',
    locationTransliterated: 'Badr',
    personSlugs: ['prophet-muhammad', 'ali-ibn-abi-talib', 'hamzah-ibn-abdul-muttalib', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'نصر حاسم للمسلمين، تأسيس المجتمع الإسلامي المبكر',
      participants: '313 مسلماً مقابل 1000 من قريش'
    }
  },
  {
    name: 'غزوة أحد',
    nameTransliterated: 'Battle of Uhud',
    slug: 'battle-of-uhud',
    type: EventType.BATTLE,
    battleSlug: 'uhud',
    hijriYear: 3,
    hijriPeriod: '3 هـ',
    gregorianYear: 625,
    gregorianPeriod: '625 م',
    description: 'غزوة أحد - اختبار صعب للمسلمين',
    descriptionTransliterated: 'Battle of Uhud - A challenging battle for Muslims',
    location: 'جبل أحد',
    locationTransliterated: 'Mount Uhud',
    personSlugs: ['prophet-muhammad', 'ali-ibn-abi-talib', 'hamzah-ibn-abdul-muttalib', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'واجه المسلمون صعوبات لكنهم تعلموا دروساً مهة',
      participants: '700 مسلم مقابل 3000 من قريش'
    }
  },
  {
    name: 'غزوة الخندق',
    nameTransliterated: 'Battle of the Trench',
    slug: 'battle-of-the-trench',
    type: EventType.BATTLE,
    battleSlug: 'khandaq',
    hijriYear: 5,
    hijriPeriod: '5 هـ',
    gregorianYear: 627,
    gregorianPeriod: '627 م',
    description: 'غزوة الخندق - دفاع عن المدينة المنورة',
    descriptionTransliterated: 'Battle of the Trench (Khandaq) - Defense of Medina',
    location: 'المدينة المنورة',
    locationTransliterated: 'Medina',
    personSlugs: ['prophet-muhammad', 'ali-ibn-abi-talib', 'salman-al-farsi', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'دفاع ناجح عن المدينة، نهاية التهديد المكي',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // Death Events
  {
    name: 'وفاة النبي محمد ﷺ',
    nameTransliterated: 'Passing of the Prophet Muhammad (PBUH)',
    slug: 'passing-of-the-prophet-muhammad',
    type: EventType.DEATH,
    hijriYear: 11,
    hijriPeriod: '11 هـ',
    gregorianYear: 632,
    gregorianPeriod: '632 م',
    description: 'وفاة النبي محمد صلى الله عليه وسلم',
    descriptionTransliterated: 'Passing of the Prophet Muhammad (PBUH)',
    location: 'المدينة المنورة',
    locationTransliterated: 'Medina',
    personSlugs: ['prophet-muhammad', 'aisha-bint-abi-bakr', 'fatimah-bint-muhammad', 'ali-ibn-abi-talib']
  },
  {
    name: 'نزول القرآن',
    nameTransliterated: 'First Revelation of the Quran',
    slug: 'first-revelation-of-the-quran',
    type: EventType.OTHER,
    hijriYear: -12,
    hijriPeriod: '12 قبل الهجرة',
    gregorianYear: 610,
    gregorianPeriod: '610 م',
    description: 'نزول الوحي على النبي محمد صلى الله عليه وسلم في غار حراء',
    descriptionTransliterated: 'First revelation to the Prophet Muhammad (PBUH) in Cave Hira',
    location: 'مكة المكرمة',
    locationTransliterated: 'Mecca',
    personSlugs: ['prophet-muhammad', 'khadijah-bint-khuwaylid'],
    metadata: {
      significance: 'بداية النبوة ونزول الوحي بالقرآن الكريم'
    }
  },
  {
    name: 'الإسراء والمعراج',
    nameTransliterated: 'Night Journey and Ascension (Isra and Mi\'raj)',
    slug: 'night-journey-and-ascension-isra-and-miraaj',
    type: EventType.TRAVEL,
    hijriYear: -10,
    hijriPeriod: '10 قبل الهجرة',
    gregorianYear: 620,
    gregorianPeriod: '620 م',
    description: 'الإسراء والمعراج',
    descriptionTransliterated: 'Night Journey and Ascension (Isra and Mi\'raj)',
    location: 'من مكة إلى القدس ثم السماوات العلى',
    locationTransliterated: 'From Mecca to Jerusalem then through the heavens',
    personSlugs: ['prophet-muhammad'],
    metadata: {
      significance: 'رحلة من مكة إلى القدس ثم العروج إلى السماوات'
    }
  },
  // add the following events for these battles with slugs:
  // slug: 'banu-qurayzah',
  {
    name: 'غزوة بني قريظة',
    nameTransliterated: 'Battle of Banu Qurayzah',
    slug: 'battle-of-bani-qurayzah',
    type: EventType.BATTLE,
    battleSlug: 'banu-qurayzah',
    hijriYear: 5,
    hijriPeriod: '5 هـ',
    gregorianYear: 625,
    gregorianPeriod: '625 م',
    description: 'غزوة بني قريظة',
    descriptionTransliterated: 'Battle of Banu Qurayzah',
    location: 'بني قريظة',
    locationTransliterated: 'Banu Qurayzah',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // slug: 'hudaybiyyah',
  {
    name: 'صلح الحديبية',
    nameTransliterated: 'Treaty of Hudaybiyyah',
    slug: 'treaty-of-hudaybiyyah',
    type: EventType.OTHER,
    hijriYear: 6,
    hijriPeriod: '6 هـ',
    gregorianYear: 628,
    gregorianPeriod: '628 م',
    description: 'صلح الحديبية',
    descriptionTransliterated: 'Treaty of Hudaybiyyah',
    location: 'الحديبية',
    locationTransliterated: 'Hudaybiyyah',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // slug: 'khaybar',
  {
    name: 'غزوة خيبر',
    nameTransliterated: 'Battle of Khaybar',
    slug: 'battle-of-khaybar',
    type: EventType.BATTLE,
    battleSlug: 'khaybar',
    hijriYear: 7,
    hijriPeriod: '7 هـ',
    gregorianYear: 628,
    gregorianPeriod: '628 م',
    description: 'غزوة خيبر',
    descriptionTransliterated: 'Battle of Khaybar',
    location: 'خيبر',
    locationTransliterated: 'Khaybar',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // slug: 'fath-makkah',
  {
    name: 'فتح مكة',
    nameTransliterated: 'Conquest of Mecca',
    slug: 'conquest-of-mecca',
    type: EventType.BATTLE,
    battleSlug: 'fath-makkah',
    hijriYear: 8,
    hijriPeriod: '8 هـ',
    gregorianYear: 628,
    gregorianPeriod: '628 م',
    description: 'فتح مكة',
    descriptionTransliterated: 'Conquest of Mecca',
    location: 'مكة',
    locationTransliterated: 'Mecca',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // slug: 'hunayn',
  {
    name: 'غزوة حنين',
    nameTransliterated: 'Battle of Hunayn',
    slug: 'battle-of-hunayn',
    type: EventType.BATTLE,
    battleSlug: 'hunayn',
    hijriYear: 8,
    hijriPeriod: '8 هـ',
    gregorianYear: 628,
    gregorianPeriod: '628 م',
    description: 'غزوة حنين',
    descriptionTransliterated: 'Battle of Hunayn',
    location: 'حنين',
    locationTransliterated: 'Hunayn',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // slug: 'taif',
  {
    name: 'غزوة الطائف',
    nameTransliterated: 'Battle of Taif',
    slug: 'battle-of-taif',
    type: EventType.BATTLE,
    battleSlug: 'taif',
    hijriYear: 8,
    hijriPeriod: '8 هـ',
    gregorianYear: 628,
    gregorianPeriod: '628 م',
    description: 'غزوة الطائف',
    descriptionTransliterated: 'Battle of Taif',
    location: 'الطائف',
    locationTransliterated: 'Taif',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
  // slug: 'tabuk',
  {
    name: 'غزوة تبوك',
    nameTransliterated: 'Battle of Tabuk',
    slug: 'battle-of-tabuk',
    type: EventType.BATTLE,
    battleSlug: 'tabuk',
    hijriYear: 9,
    hijriPeriod: '9 هـ',
    gregorianYear: 628,
    gregorianPeriod: '628 م',
    description: 'غزوة تبوك',
    descriptionTransliterated: 'Battle of Tabuk',
    location: 'تبوك',
    locationTransliterated: 'Tabuk',
    personSlugs: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
    metadata: {
      significance: 'انتصار المسلمون على قريظة، انتهاء الحرب المكية',
      participants: '3000 مسلم مقابل أكثر من 10000 من الأحزاب'
    }
  },
];
