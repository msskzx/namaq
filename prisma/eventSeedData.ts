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
    // Was 'fatimah-bint-muhammad', a slug that doesn't exist anywhere in
    // personSeedData -- silently matched no one, leaving this event with
    // zero connected people. Corrected to the real slugs.
    personSlugs: ['prophet-muhammad', 'khadijah-bint-khuwaylid', 'fatimah-bint-muhammad']
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
  // الإسراء والمعراج is authored in data/catalog/events/al-isra-wal-miraj.ts.
  // This entry slugged it night-journey-and-ascension-isra-and-miraaj and the
  // catalog al-isra-wal-miraj, which made two events out of one; the catalog
  // dates it -1 against this entry's -10, and cites al-Zuhri for it.
  // add the following events for these battles with slugs:
  // slug: 'banu-qurayzah',
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
  // slug: 'fath-makkah',
  // slug: 'hunayn',
  // slug: 'taif',
  // slug: 'tabuk',
];
