const translations = {
  en: {
    // NavBar
    title: 'Namaq',
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
    battles: {
      title: 'Battles & Expeditions',
      name: 'Name',
      location: 'Location',
      hijriYear: 'Hijri Year',
      nameEn: 'Name (EN)',
      locationEn: 'Location (EN)',
      loadError: 'Failed to load battles',
    },
    // Homepage
    welcome: 'Welcome to Namaq',
    intro: 'Learn Arabic language, Islamic history, and the beautiful teachings of our Prophet Muhammad ﷺ and his noble companions',
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
    title: 'نَمَق',
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
    poems: 'القصائد',
    quran: 'القرآن الكريم',
    hadith: 'الحديث الشريف',
    articlesLoadError: 'تعذر تحميل المقالات.',
    articlesNotFound: 'لا توجد مقالات.',
    categories: 'التصنيفات',
    categoriesLoadError: 'تعذر تحميل التصنيفات.',
    categoriesNotFound: 'لا توجد تصنيفات.',
    battles: {
      title: 'المعارك والغزوات',
      name: 'الاسم',
      location: 'الموقع',
      hijriYear: 'السنة الهجرية',
      nameEn: 'الاسم بالإنجليزية',
      locationEn: 'الموقع بالإنجليزية',
      loadError: 'تعذر تحميل المعارك',
    },
    // Homepage
    welcome: 'مرحبًا بكم في نَمَق',
    intro: 'تعلم اللغة العربية والتاريخ الإسلامي والتعاليم الجميلة لنبينا محمد ﷺ وأصحابه الكرام',
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
        title: 'المعارك',
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
        title: 'القصائد',
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