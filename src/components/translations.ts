const translations = {
  en: {
    // NavBar
    appName: 'Namaq',
    title: 'Learn Through Interactive Visual Articles & Data-Driven Explorations',
    arabic: 'Arabic Language',
    home: 'Home',
    about: 'About',
    learn: 'Learn Arabic',
    grammar: 'Grammar',
    history: 'Islamic History',
    prophet: 'Prophet Muhammad ﷺ',
    companions: 'Companions',
    practice: 'Practice',
    articles: 'Articles',
    titles: 'Titles',
    poems: 'Poems',
    quran: 'Quran',
    hadith: 'Hadith',
    articlesLoadError: 'Failed to load articles.',
    articlesNotFound: 'No articles found.',
    categories: 'Categories',
    categoriesLoadError: 'Failed to load categories.',
    categoriesNotFound: 'No categories found.',
    events: 'Events',
    eventsLoadError: 'Failed to load events.',
    eventsNotFound: 'No events found.',
    
    // Common UI
    loading: 'Loading...',
    backToList: 'Back to list',
    backToSurahs: 'Back to Surahs',
    dataSource: 'Data source',
    
    // Battle/Event Participants
    participants: 'Participants',
    noParticipants: 'No participants in this battle.',
    peopleInvolved: 'People Involved',
    noPeopleInvolved: 'No people involved in this event.',
    noBattleParticipations: 'No battle participations.',
    
    // Quran
    theHolyQuran: 'The Holy Quran',
    selectSurah: 'Select a surah from the list below to read its verses',
    ayahs: 'Ayahs',
    juz: 'Juz',
    page: 'Page',
    manzil: 'Manzil',
    previous: 'Previous',
    next: 'Next',
    
    // Coming Soon Messages
    comingSoon: 'Content will be added soon',
    poetryComingSoon: 'Poetry content will be added soon',
    hadithComingSoon: 'Hadith content will be added soon',
    
    // Battle Map
    battleLocation: 'Battle Location on Map',
    
    // Family Relations
    familyRelations: 'Family Relations',
    
    // Articles
    specialArticles: 'Special Articles',
    noArticles: 'No articles found',
    noArticlesForEvent: 'No articles for this event.',
    
    // Notable People
    notablePeople: 'Notable People',
    
    // Quranic Verses
    quranicVerses: 'Quranic Verses',
    quranicVersesAboutPeople: 'Quranic Verses About People',
    sampleVerses: 'Sample Verses',
    
    // Battle Status
    martyred: 'Martyred',
    injured: 'Injured',
    captured: 'Captured',
    absentExcused: 'Absent (Excused)',
    battles: {
      title: 'Battles & Expeditions',
      name: 'Name',
      location: 'Location',
      hijriYear: 'Hijri Year',
      nameTransliterated: 'Name (EN)',
      locationEn: 'Location (EN)',
      loadError: 'Failed to load battles',
    },
    // Homepage
    welcome: 'Welcome to Namaq',
    intro: 'Uncover the fascinating stories of remarkable individuals who shaped the course of human civilization. Learn about many topics in an interactive manner and explore',
    definition: 'What is Namaq?',
    nounTitle: 'نَمَق (Noun)',
    nounDefinition: 'النَّمَقُ : الكِتابُ الذي يُكْتَب فيه',
    verbTitle: 'نَمَّقَ (Verb)',
    verbDefinition: 'نمَّقَ ينمِّق ، تنميقًا ، فهو مُنمِّق ، والمفعول مُنمَّق',
    verbForms: [
      'نمَّق الكتابَ :جوَّد كتابتَه وحسَّنها',
      'نمَّق جلْدًا: زخرفه ونقشَه وزيَّنه',
      'نمَّق القولَ: نمَقه، جوّده وصاغَه بأنواعٍ من البديع، حسَّنه وزوّقه'
    ],
    whyLearn: 'Why Learn with Namaq?',
    arabicLanguage: 'Arabic Language',
    arabicLanguageDesc: 'Master the beautiful Arabic language through interactive lessons, grammar rules, and authentic Islamic texts',
    islamicHistory: 'Islamic History',
    islamicHistoryDesc: 'Discover the rich history of Islam, the life of Prophet Muhammad ﷺ, and the stories of his noble companions',
    grammarMastery: 'Grammar & Structure',
    grammarMasteryDesc: 'Learn Arabic grammar systematically with clear explanations and practical examples from Quran and Hadith',
    culturalHeritage: 'Cultural Heritage',
    culturalHeritageDesc: 'Connect with centuries of Arabic literary tradition and Islamic cultural heritage',
    spiritualGrowth: 'Spiritual Growth',
    spiritualGrowthDesc: 'Deepen your faith through learning the language of the Quran and understanding Islamic teachings',
    interactiveLearning: 'Interactive Learning',
    interactiveLearningDesc: 'Engage with animated lessons, quizzes, and interactive exercises designed for effective learning',
    search: 'Search',
    people: 'People',
    fullName: 'Full Name',
    appearance: 'Appearance',
    virtues: 'Virtues',
    relations: 'Relations',
    personLoadError: 'Failed to load person data',
    personGenericError: 'An error occurred while loading data',
    ayatReferences: 'Verses revealed about',
    // Battle participation statuses
    battleStatus: {
      MARTYRED: 'Martyred',
      INJURED: 'Injured',
      CAPTURED: 'Captured',
      ABSENT_EXCUSED: 'Absent (Excused)',
    },
    battlesAndExpeditions: 'Battles & Expeditions',
    // Event Types
    eventTypes: {
      BIRTH: 'Birth',
      DEATH: 'Death',
      MARRIAGE: 'Marriage',
      BATTLE: 'Battle',
      GAVE_BIRTH: 'Gave Birth',
      LIBERATED: 'Liberated',
      MET: 'Met',
      TRAVEL: 'Travel',
      HIJRA: 'Hijra',
      HIJRA_HABASHA: 'Hijra to Abyssinia',
      OTHER: 'Other',
    },
    // Categories
    relationTypes: {
      FATHER: 'Father',
      MOTHER: 'Mother',
      SON: 'Son',
      DAUGHTER: 'Daughter',
      SIBLING: 'Sibling',
      HUSBAND: 'Husband',
      WIFE: 'Wife',
      MATERNAL_COUSIN: 'Maternal Cousin',
      PATERNAL_COUSIN: 'Paternal Cousin',
      MATERNAL_UNCLE: 'Maternal Uncle',
      PATERNAL_UNCLE: 'Paternal Uncle',
      MATERNAL_AUNT: 'Maternal Aunt',
      PATERNAL_AUNT: 'Paternal Aunt',
      HALF_BROTHER: 'Half Brother',
      HALF_SISTER: 'Half Sister',
      MOTHER_IN_LAW: 'Mother-in-law',
      STEP_FATHER: 'Stepfather',
      STEP_MOTHER: 'Stepmother',
      STEP_BROTHER: 'Stepbrother',
      STEP_SISTER: 'Stepsister',
      STEP_SON: 'Stepson',
      STEP_DAUGHTER: 'Stepdaughter',
      FATHER_IN_LAW: 'Father-in-law',
      SON_IN_LAW: 'Son-in-law',
      DAUGHTER_IN_LAW: 'Daughter-in-law',
      BROTHER_IN_LAW: 'Brother-in-law',
      SISTER_IN_LAW: 'Sister-in-law',
      GRANDFATHER: 'Grandfather',
      GRANDMOTHER: 'Grandmother',
      GRANDSON: 'Grandson',
      GRANDDAUGHTER: 'Granddaughter',
      ANCESTOR: 'Ancestor',
      DESCENDANT: 'Descendant',
      MAWLA: 'Mawla',
      CONCUBINE: 'Concubine',
      MATERNAL_NEPHEW: 'Maternal Nephew',
      MATERNAL_NIECE: 'Maternal Niece',
      PATERNAL_NEPHEW: 'Paternal Nephew',
      PATERNAL_NIECE: 'Paternal Niece',
    },
    articlesInCategory: 'Articles in this category',
    // Motivation Cards
    motivation: {
      prophet: {
        title: 'Prophet Muhammad ﷺ',
        desc: 'Learn about the life, teachings, and legacy of the Prophet Muhammad ﷺ.'
      },
      companions: {
        title: 'Companions',
        desc: 'Explore the stories and virtues of the noble companions of the Prophet.'
      },
      battles: {
        title: 'Battles',
        desc: 'Discover the key battles and expeditions in Islamic history.'
      },
      articles: {
        title: 'Articles',
        desc: 'Read insightful articles on Arabic, Islam, and history.'
      },
      categories: {
        title: 'Categories',
        desc: 'Browse topics by category for focused learning.'
      },
      poems: {
        title: 'Poems',
        desc: 'Enjoy classical and modern Arabic poetry.'
      },
      titles: {
        title: 'Titles',
        desc: 'Explore Islamic titles and their significance in history.'
      },
      quran: {
        title: 'Quran',
        desc: 'Learn and reflect on the verses of the Quran.'
      },
      hadith: {
        title: 'Hadith',
        desc: 'Discover the sayings of Prophet Muhammad ﷺ and understand their meanings.'
      },
    },
  },
  ar: {
    // NavBar
    appName: 'نَمَق',
    title: 'تعلَّم من خلال المقالات التفاعلية والاستكشافات المعتمدة على البيانات',
    arabic: 'العربية',
    home: 'الرئيسية',
    about: 'حول',
    learn: 'تعلم العربية',
    grammar: 'النحو',
    history: 'التاريخ الإسلامي',
    prophet: 'النبي محمد ﷺ',
    companions: 'الصحابة',
    practice: 'تدرب',
    articles: 'المقالات',
    titles: 'الألقاب',
    poems: 'الشعر العربي',
    quran: 'القرآن الكريم',
    hadith: 'الحديث الشريف',
    articlesLoadError: 'تعذر تحميل المقالات.',
    articlesNotFound: 'لا توجد مقالات.',
    categories: 'التصنيفات',
    categoriesLoadError: 'تعذر تحميل التصنيفات.',
    categoriesNotFound: 'لم يتم العثور على تصنيفات.',
    events: 'الأحداث',
    eventsLoadError: 'فشل تحميل الأحداث.',
    eventsNotFound: 'لم يتم العثور على أحداث.',
    
    // Common UI
    loading: 'جاري التحميل...',
    backToList: 'العودة إلى القائمة',
    backToSurahs: 'العودة إلى قائمة السور',
    dataSource: 'مصدر البيانات',
    
    // Battle/Event Participants
    participants: 'المشاركون',
    noParticipants: 'لا يوجد مشاركون في هذه المعركة.',
    peopleInvolved: 'الأشخاص المشاركون',
    noPeopleInvolved: 'لا يوجد أشخاص مشاركون في هذا الحدث.',
    noBattleParticipations: 'لا توجد مشاركات في المعارك.',
    
    // Quran
    theHolyQuran: 'القرآن الكريم',
    selectSurah: 'اختر سورة من القائمة أدناه لقراءة آياتها',
    ayahs: 'الآيات',
    juz: 'الجزء',
    page: 'الصفحة',
    manzil: 'المنزل',
    previous: 'السابق',
    next: 'التالي',
    
    // Coming Soon Messages
    comingSoon: 'سيتم إضافة المحتوى قريباً',
    poetryComingSoon: 'سيتم إضافة محتوى الشعر قريباً',
    hadithComingSoon: 'سيتم إضافة محتوى الحديث قريباً',
    
    // Battle Map
    battleLocation: 'موقع المعركة على الخريطة',
    
    // Family Relations
    familyRelations: 'العلاقات العائلية',
    
    // Articles
    specialArticles: 'مقالات مميزة',
    noArticles: 'لا توجد مقالات',
    noArticlesForEvent: 'لا توجد مقالات لهذا الحدث.',
    
    // Notable People
    notablePeople: 'شخصيات بارزة',
    
    // Quranic Verses
    quranicVerses: 'الآيات القرآنية',
    quranicVersesAboutPeople: 'آيات نزلت في الأشخاص',
    sampleVerses: 'نماذج من الآيات',
    
    // Battle Status
    martyred: 'استشهد',
    injured: 'أصيب',
    captured: 'أُسر',
    absentExcused: 'غائب بعذر',
    battles: {
      title: 'المعارك والغزوات',
      name: 'الاسم',
      location: 'الموقع',
      hijriYear: 'السنة الهجرية',
      nameTransliterated: 'الاسم بالإنجليزية',
      locationEn: 'الموقع بالإنجليزية',
      loadError: 'تعذر تحميل المعارك',
    },
    // Homepage
    welcome: 'مرحبًا بكم في نَمَق',
    intro: 'اكتشف القصص المذهلة للشخصيات البارزة الذين شكّلوا مسار التاريخ البشري وتعلم عن العديد من الموضوعات بطريقة تفاعلية',
    definition: 'ما هو نَمَق؟',
    nounTitle: 'نَمَق (اسم)',
    nounDefinition: 'النَّمَقُ : الكِتابُ الذي يُكْتَب فيه',
    verbTitle: 'نَمَّقَ (فعل)',
    verbDefinition: 'نمَّقَ ينمِّق ، تنميقًا ، فهو مُنمِّق ، والمفعول مُنمَّق',
    verbForms: [
      'نمَّق الكتابَ :جوَّد كتابتَه وحسَّنها',
      'نمَّق جلْدًا: زخرفه ونقشَه وزيَّنه',
      'نمَّق القولَ: نمَقه، جوّده وصاغَه بأنواعٍ من البديع، حسَّنه وزوّقه'
    ],
    whyLearn: 'لماذا تتعلم مع نَمَق؟',
    arabicLanguage: 'اللغة العربية',
    arabicLanguageDesc: 'أتقن اللغة العربية الجميلة من خلال الدروس التفاعلية وقواعد النحو والنصوص الإسلامية الأصيلة',
    islamicHistory: 'التاريخ الإسلامي',
    islamicHistoryDesc: 'اكتشف التاريخ الغني للإسلام وحياة النبي محمد ﷺ وقصص أصحابه الكرام',
    grammarMastery: 'النحو والتركيب',
    grammarMasteryDesc: 'تعلم نحو العربية بشكل منهجي مع شرح واضح وأمثلة عملية من القرآن والحديث',
    culturalHeritage: 'التراث الثقافي',
    culturalHeritageDesc: 'تواصل مع قرون من التقاليد الأدبية العربية والتراث الثقافي الإسلامي',
    spiritualGrowth: 'النمو الروحي',
    spiritualGrowthDesc: 'عمق إيمانك من خلال تعلم لغة القرآن وفهم التعاليم الإسلامية',
    interactiveLearning: 'التعلم التفاعلي',
    interactiveLearningDesc: 'تفاعل مع الدروس المتحركة والاختبارات والتمارين التفاعلية المصممة للتعلم الفعال',
    search: 'بحث',
    people: 'الشخصيات',
    fullName: 'الاسم الكامل',
    appearance: 'الهيئة',
    virtues: 'الفضائل',
    relations: 'العلاقات',
    personLoadError: 'تعذر تحميل بيانات الشخصية',
    personGenericError: 'حدث خطأ أثناء تحميل البيانات',
    ayatReferences: 'آيات نزلت في',
    // Battle participation statuses
    battleStatus: {
      MARTYRED: 'استشهد',
      INJURED: 'جُرح',
      CAPTURED: 'أُسر',
      ABSENT_EXCUSED: 'غائب بعذر',
    },
    battlesAndExpeditions: 'المعارك والغزوات',
    // أنواع الأحداث
    eventTypes: {
      BIRTH: 'ولادة',
      DEATH: 'وفاة',
      MARRIAGE: 'زواج',
      BATTLE: 'معركة',
      GAVE_BIRTH: 'ولادة',
      LIBERATED: 'تحرير',
      MET: 'لقاء',
      TRAVEL: 'سفر',
      HIJRA: 'هجرة',
      HIJRA_HABASHA: 'هجرة الحبشة',
      OTHER: 'أخرى',
    },
    relationTypes: {
      FATHER: 'أب',
      MOTHER: 'أم',
      SON: 'ابن',
      DAUGHTER: 'ابنة',
      SIBLING: 'أخ/أخت',
      HUSBAND: 'زوج',
      WIFE: 'زوجة',
      MATERNAL_COUSIN: 'ابن/ابنة خال',
      PATERNAL_COUSIN: 'ابن/ابنة عم',
      MATERNAL_UNCLE: 'خال',
      PATERNAL_UNCLE: 'عم',
      MATERNAL_AUNT: 'خالة',
      PATERNAL_AUNT: 'عمة',
      HALF_BROTHER: 'أخ غير شقيق',
      HALF_SISTER: 'أخت غير شقيقة',
      MOTHER_IN_LAW: 'حمات',
      STEP_FATHER: 'زوج الأم',
      STEP_MOTHER: 'زوجة الأب',
      STEP_BROTHER: 'أخ غير شقيق (زواج)',
      STEP_SISTER: 'أخت غير شقيقة (زواج)',
      STEP_SON: 'ابن الزوج/الزوجة',
      STEP_DAUGHTER: 'ابنة الزوج/الزوجة',
      FATHER_IN_LAW: 'حمو',
      SON_IN_LAW: 'زوج الابنة',
      DAUGHTER_IN_LAW: 'زوجة الابن',
      BROTHER_IN_LAW: 'صهر (أخ الزوج/الزوجة)',
      SISTER_IN_LAW: 'سلفة (أخت الزوج/الزوجة)',
      GRANDFATHER: 'جد',
      GRANDMOTHER: 'جدة',
      GRANDSON: 'حفيد',
      GRANDDAUGHTER: 'حفيدة',
      ANCESTOR: 'سلف',
      DESCENDANT: 'خلف',
      MAWLA: 'مولى',
      CONCUBINE: 'جارية',
      MATERNAL_NEPHEW: 'ابن الأخت',
      MATERNAL_NIECE: 'ابنة الأخت',
      PATERNAL_NEPHEW: 'ابن الأخ',
      PATERNAL_NIECE: 'ابنة الأخ',
    },
    articlesInCategory: 'المقالات في هذا التصنيف',
    // Motivation Cards
    motivation: {
      prophet: {
        title: 'النبي محمد ﷺ',
        desc: 'تعرّف على حياة النبي محمد ﷺ وتعاليمه وإرثه.'
      },
      companions: {
        title: 'الصحابة',
        desc: 'استكشف قصص وفضائل الصحابة الكرام.'
      },
      battles: {
        title: 'الغزوات',
        desc: 'اكتشف أهم المعارك والغزوات في التاريخ الإسلامي.'
      },
      articles: {
        title: 'المقالات',
        desc: 'اقرأ مقالات مميزة عن العربية والإسلام والتاريخ.'
      },
      categories: {
        title: 'التصنيفات',
        desc: 'تصفح المواضيع حسب التصنيف للتعلم المركّز.'
      },
      poems: {
        title: 'الشعر العربي',
        desc: 'استمتع بالشعر العربي الكلاسيكي والحديث.'
      },
      titles: {
        title: 'الألقاب',
        desc: 'استكشف الألقاب الإسلامية وأهميتها في التاريخ.'
      },
      quran: {
        title: 'القرآن الكريم',
        desc: 'تعلم وتدبر آيات القرآن الكريم.'
      },
      hadith: {
        title: 'الحديث الشريف',
        desc: 'اكتشف أحاديث النبي محمد ﷺ وفهم معانيها.'
      },
    },
  },
};

export default translations; 