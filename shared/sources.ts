/**
 * Every book, text, data set, font and library Namaq draws on, with its licence and the pages that use it.
 * The website's /sources lists the books and /attributions lists everything. A PR that adds a source adds it here
 * (AGENTS.md, "Sources and attributions"). Links point outside: Namaq hosts no book in full.
 */
export type SourceGroup = 'books' | 'quran' | 'data' | 'fonts' | 'code';
export type Bi = { ar: string; en: string };
/** One place a source is used: the website page, where there is one. */
export type SourceUse = Bi & { href?: string };
export type Source = {
  id: string;
  group: SourceGroup;
  title: Bi;
  author?: Bi;
  /** The printed edition the citations follow, in Arabic. */
  edition?: string;
  link: { url: string; label: string };
  licence: Bi;
  uses: SourceUse[];
  /** The website's reader for a book whose pages Namaq holds (/sources/<shelf>). */
  shelf?: string;
};

export const GROUPS: { group: SourceGroup; title: Bi }[] = [
  { group: 'books', title: { ar: 'الكتب', en: 'Books' } },
  { group: 'quran', title: { ar: 'نص القرآن', en: 'Quran text' } },
  { group: 'data', title: { ar: 'البيانات', en: 'Data' } },
  { group: 'fonts', title: { ar: 'الخطوط', en: 'Fonts' } },
  { group: 'code', title: { ar: 'المكتبات البرمجية', en: 'Code libraries' } },
];

/** Shamela library's page for a book. */
export const shamela = (id: number) => ({ url: `https://shamela.ws/book/${id}`, label: 'المكتبة الشاملة' });

const PUBLIC_DOMAIN: Bi = {
  ar: 'نص المؤلف في الملك العام. نقتبس منه ونحيل إلى النسخة الرقمية، ولا ننشر الكتاب ولا تحقيقه.',
  en: 'The author’s text is in the public domain. We quote it and link to the digital edition; we do not publish the book or its editor’s apparatus.',
};

const USE = {
  order: { ar: 'ترتيب السور ومقاصدها', en: 'surah order and aims', href: '/quran/order' },
  openings: { ar: 'فواتح السور', en: 'surah openings', href: '/quran/openings' },
  iltifat: { ar: 'الالتفات', en: 'iltifat', href: '/quran/iltifat' },
  branches: { ar: 'شواهد المتشابه في الفروع', en: 'the cited cases in branches', href: '/quran/branches' },
  prophets: { ar: 'ترتيب الأنبياء في قصصهم', en: 'the order of the prophets’ stories', href: '/quran/prophets' },
  qiraat: { ar: 'القراءات', en: 'the readings', href: '/quran/qiraat' },
  reader: { ar: 'المصحف', en: 'the mushaf reader', href: '/quran/read' },
  words: { ar: 'عدد الكلمات والكلمات المتقابلة', en: 'word counts and opposite words', href: '/quran/words' },
  trees: { ar: 'الأشجار والمقارنة والبحث', en: 'trees, compare and search', href: '/quran/branches' },
  tuhfa: { ar: 'تحفة الأطفال', en: 'Tuhfat al-Atfal', href: '/quran/tajwid/tuhfat-al-atfal' },
  prayer: { ar: 'مواقيت الصلاة والقبلة', en: 'prayer times and the qibla', href: '/utilities' },
  hijri: { ar: 'التاريخ الهجري وجزء اليوم', en: 'the Hijri date and today’s juz', href: '/utilities' },
  people: { ar: 'التراجم والأنساب والمعارك', en: 'biographies, lineages and battles', href: '/people' },
  everywhere: { ar: 'كل الصفحات', en: 'every page' },
} satisfies Record<string, SourceUse>;

export const SOURCES: Source[] = [
  // Books
  {
    id: 'siyar', group: 'books',
    title: { ar: 'سير أعلام النبلاء', en: 'Siyar A‘lam al-Nubala’' }, author: { ar: 'شمس الدين الذهبي', en: 'al-Dhahabi' },
    edition: 'مؤسسة الرسالة، الطبعة الثالثة، ١٤٠٥هـ/١٩٨٥م', link: shamela(10906), licence: PUBLIC_DOMAIN,
    uses: [USE.people, { ar: 'الأحاديث', en: 'hadith', href: '/hadith' }], shelf: 'siyar-alam-al-nubala-risalah',
  },
  {
    id: 'nazm-al-durar', group: 'books',
    title: { ar: 'نظم الدرر في تناسب الآيات والسور', en: 'Nazm al-Durar' }, author: { ar: 'برهان الدين البقاعي', en: 'al-Biqa‘i' },
    edition: 'دار الكتاب الإسلامي، القاهرة (طبعة حيدر آباد)، ٢٢ جزءًا', link: shamela(9098), licence: PUBLIC_DOMAIN, uses: [USE.order],
  },
  {
    id: 'masaid-al-nazar', group: 'books',
    title: { ar: 'مصاعد النظر للإشراف على مقاصد السور', en: 'Masa‘id al-Nazar' }, author: { ar: 'برهان الدين البقاعي', en: 'al-Biqa‘i' },
    link: shamela(1404), licence: PUBLIC_DOMAIN, uses: [USE.order],
  },
  {
    id: 'tanasuq-al-durar', group: 'books',
    title: { ar: 'تناسق الدرر في تناسب السور', en: 'Tanasuq al-Durar' }, author: { ar: 'جلال الدين السيوطي', en: 'al-Suyuti' },
    edition: 'دار الفضيلة، ٢٠٠٢م', link: shamela(9992), licence: PUBLIC_DOMAIN, uses: [USE.order],
  },
  {
    id: 'burhan-tanasub', group: 'books',
    title: { ar: 'البرهان في تناسب سور القرآن', en: 'al-Burhan fi Tanasub Suwar al-Quran' }, author: { ar: 'ابن الزبير الغرناطي', en: 'Ibn al-Zubayr al-Gharnati' },
    link: shamela(1388), licence: PUBLIC_DOMAIN, uses: [USE.order],
  },
  {
    id: 'itqan', group: 'books',
    title: { ar: 'الإتقان في علوم القرآن', en: 'al-Itqan fi ‘Ulum al-Quran' }, author: { ar: 'جلال الدين السيوطي', en: 'al-Suyuti' },
    link: shamela(11728), licence: PUBLIC_DOMAIN, uses: [USE.openings, USE.iltifat],
  },
  {
    id: 'burhan-zarkashi', group: 'books',
    title: { ar: 'البرهان في علوم القرآن', en: 'al-Burhan fi ‘Ulum al-Quran' }, author: { ar: 'بدر الدين الزركشي', en: 'al-Zarkashi' },
    edition: 'تحقيق محمد أبو الفضل إبراهيم، دار إحياء الكتب العربية، ١٣٧٦هـ', link: shamela(11436), licence: PUBLIC_DOMAIN, uses: [USE.branches, USE.iltifat],
  },
  {
    id: 'asrar-al-tikrar', group: 'books',
    title: { ar: 'أسرار التكرار في القرآن', en: 'Asrar al-Tikrar fi al-Quran' }, author: { ar: 'تاج القراء الكرماني', en: 'al-Kirmani' },
    edition: 'تحقيق عبد القادر أحمد عطا، دار الفضيلة', link: shamela(3580), licence: PUBLIC_DOMAIN, uses: [USE.branches],
  },
  {
    id: 'durrat-al-tanzil', group: 'books',
    title: { ar: 'درة التنزيل وغرة التأويل', en: 'Durrat al-Tanzil' }, author: { ar: 'الخطيب الإسكافي', en: 'al-Khatib al-Iskafi' },
    edition: 'تحقيق محمد مصطفى آيدين، جامعة أم القرى، ١٤٢٢هـ', link: shamela(1340), licence: PUBLIC_DOMAIN, uses: [USE.branches],
  },
  {
    id: 'qisas-al-anbiya', group: 'books',
    title: { ar: 'قصص الأنبياء', en: 'Qisas al-Anbiya’' }, author: { ar: 'ابن كثير', en: 'Ibn Kathir' },
    edition: 'من البداية والنهاية، تحقيق مصطفى عبد الواحد', link: shamela(932), licence: PUBLIC_DOMAIN, uses: [USE.prophets],
  },
  {
    id: 'tahrir', group: 'books',
    title: { ar: 'التحرير والتنوير', en: 'al-Tahrir wa al-Tanwir' }, author: { ar: 'محمد الطاهر ابن عاشور', en: 'Ibn ‘Ashur' },
    link: shamela(9776),
    licence: { ar: 'توفي المؤلف سنة ١٣٩٣هـ/١٩٧٣م. نذكر قوله في مثال واحد مع الإحالة، ولا ننقل نصه.', en: 'The author died in 1973. We cite his view on one example with a link and copy none of his text.' },
    uses: [USE.iltifat],
  },
  {
    id: 'tafsir-ksu', group: 'books',
    title: { ar: 'تفاسير الطبري والبغوي والقرطبي', en: 'The tafsirs of al-Tabari, al-Baghawi and al-Qurtubi' },
    link: { url: 'https://quran.ksu.edu.sa', label: 'مصحف جامعة الملك سعود' }, licence: PUBLIC_DOMAIN, uses: [USE.openings, USE.iltifat],
  },
  {
    id: 'tuhfat-al-atfal', group: 'books',
    title: { ar: 'تحفة الأطفال والغلمان في تجويد القرآن', en: 'Tuhfat al-Atfal' }, author: { ar: 'سليمان الجمزوري', en: 'Sulayman al-Jamzuri' },
    edition: 'ضبط الشيخ حسن بن مصطفى الوراقي', link: { url: 'https://islamhouse.com/ar/books/2101', label: 'دار الإسلام' },
    licence: {
      ar: 'المتن في الملك العام. النسخة المكتوبة من مشروع tuhfat-al-atfal على GitHub (novaskilltech)، وقوبلت بطبعة الوراقي.',
      en: 'The poem is in the public domain. The typed text comes from the tuhfat-al-atfal project on GitHub (novaskilltech), checked against al-Warraqi’s edition.',
    },
    uses: [USE.tuhfa],
  },
  // Quran text
  {
    id: 'kfgqpc-hafs', group: 'quran',
    title: { ar: 'مصحف المدينة برواية حفص، طبعة ١٤٤١هـ', en: 'The Madinah mushaf, Hafs, 1441 edition' }, author: { ar: 'مجمع الملك فهد لطباعة المصحف الشريف', en: 'King Fahd Glorious Quran Printing Complex' },
    link: { url: 'https://qurancomplex.gov.sa/en/techquran/dev/', label: 'qurancomplex.gov.sa' },
    licence: {
      ar: 'يأذن المجمع باستعمال نص المصحف مجانًا دون تغيير. أخذنا ملف hafsData_v18 من مستودع quran-data-kfgqpc على GitHub.',
      en: 'The Complex allows free use of its mushaf text, unchanged. We took hafsData_v18 from the quran-data-kfgqpc repository on GitHub.',
    },
    uses: [USE.reader],
  },
  {
    id: 'quran-com', group: 'quran',
    title: { ar: 'واجهة Quran.com البرمجية', en: 'Quran.com API' }, author: { ar: 'مؤسسة القرآن', en: 'Quran Foundation' },
    link: { url: 'https://api-docs.quran.com', label: 'api-docs.quran.com' },
    licence: {
      ar: 'نص مصحف المدينة طبعة ١٤٢١هـ كلمةً كلمة، بشروط استخدام Quran.com. نزّلناه مرة واحدة ولا نتصل بها من التطبيق.',
      en: 'The words of the 1421 Madinah mushaf, under Quran.com’s terms of use. Downloaded once; the app never calls it.',
    },
    uses: [USE.trees],
  },
  {
    id: 'tanzil', group: 'quran',
    title: { ar: 'تنزيل، الرسم العثماني', en: 'Tanzil, Uthmani text' },
    edition: 'الإصدار ١٫٠٫٢', link: { url: 'https://tanzil.net', label: 'tanzil.net' },
    licence: {
      ar: 'ترخيص تنزيل: يجوز النسخ والنشر دون تغيير النص، مع ذكر المصدر والرابط.',
      en: 'Tanzil licence: copying and distribution allowed without changing the text, with credit and a link back.',
    },
    uses: [USE.words],
  },
  {
    id: 'kfgqpc-riwayat', group: 'quran',
    title: { ar: 'نصوص المجمع لسبع روايات', en: 'The Complex’s texts of seven riwayat' },
    edition: 'قالون، ورش، البزي، قنبل، الدوري، السوسي، شعبة', link: { url: 'https://github.com/fawazahmed0/quran-api', label: 'fawazahmed0/quran-api' },
    licence: {
      ar: 'منشورة في الملك العام (Unlicense). تُستعمل لتصحيح الموضع الذي تختلف فيه بيانات القراءات فقط.',
      en: 'Released into the public domain (Unlicense). Used only to settle places where the readings data disagrees.',
    },
    uses: [USE.qiraat],
  },
  // Data
  {
    id: 'quranpedia', group: 'data',
    title: { ar: 'الموسوعة القرآنية: ملف القراءات', en: 'Quranpedia: the qira’at dump' },
    edition: 'إصدار ٢٠٢٦-١١-٠٧', link: { url: 'https://quranpedia.net/dumps', label: 'quranpedia.net' },
    licence: {
      ar: 'رخصة الموسوعة: الاستعمال داخل التطبيقات لا يشترط الإسناد، ونذكرها مع الإصدار على كل حال. نشر البيانات ملفًا للتنزيل يلزم فيه ذكرها مع الرابط ورقم الإصدار.',
      en: 'Quranpedia’s licence: use inside apps needs no credit, and we credit it with the version anyway. Republishing the data as a download needs the name, a link and the version.',
    },
    uses: [USE.qiraat, USE.reader],
  },
  {
    id: 'quranic-arabic-corpus', group: 'data',
    title: { ar: 'المدوّنة القرآنية العربية', en: 'Quranic Arabic Corpus' }, author: { ar: 'Kais Dukes، جامعة ليدز', en: 'Kais Dukes, University of Leeds' },
    edition: 'التحليل الصرفي، الإصدار ٠٫٤', link: { url: 'https://corpus.quran.com', label: 'corpus.quran.com' },
    licence: { ar: 'GNU GPL، مع إبقاء حقوق النشر والرابط دون تغيير.', en: 'GNU GPL, with the copyright notice and link kept unchanged.' },
    uses: [USE.words, { ar: 'الجذور في الأشجار', en: 'roots in the trees', href: '/quran/branches' }],
  },
  {
    id: 'quran-qcf4', group: 'data',
    title: { ar: 'أسطر صفحات مصحف المدينة ١٤٤١هـ', en: 'Line layout of the 1441 Madinah mushaf' },
    link: { url: 'https://www.npmjs.com/package/quran-qcf4', label: 'quran-qcf4' },
    licence: { ar: 'بيانات الأسطر بترخيص MIT. لا نستعمل خطوط الصفحات التي فيه.', en: 'The line data is MIT licensed. We do not use its page fonts.' },
    uses: [USE.reader],
  },
  {
    id: 'umm-al-qura', group: 'data',
    title: { ar: 'تقويم أم القرى', en: 'Umm al-Qura calendar' },
    link: { url: 'https://www.ummulqura.org.sa', label: 'ummulqura.org.sa' },
    licence: {
      ar: 'يحسبه نظام الجهاز نفسه (تقويم islamic-umalqura)، فلا ملف بيانات في نمق.',
      en: 'The device’s own calendar (islamic-umalqura) computes it, so Namaq ships no data for it.',
    },
    uses: [USE.hijri],
  },
  // Fonts
  {
    id: 'kfgqpc-font', group: 'fonts',
    title: { ar: 'خط حفص العثماني، الإصدار ١٨', en: 'KFGQPC HAFS Uthmanic Script, version 18' }, author: { ar: 'مجمع الملك فهد لطباعة المصحف الشريف', en: 'King Fahd Glorious Quran Printing Complex' },
    link: { url: 'https://qurancomplex.gov.sa/en/techquran/dev/', label: 'qurancomplex.gov.sa' },
    licence: { ar: 'رخصة المجمع: الاستعمال والنسخ والتوزيع مجانًا، دون بيع أو تعديل.', en: 'The Complex’s licence: free to use, copy and distribute, not to sell or change.' },
    uses: [{ ar: 'كل نص قرآني', en: 'all Quran text' }],
  },
  {
    id: 'amiri', group: 'fonts',
    title: { ar: 'خط أميري', en: 'Amiri' }, author: { ar: 'خالد حسني', en: 'Khaled Hosny' },
    link: { url: 'https://github.com/aliftype/amiri', label: 'aliftype/amiri' },
    licence: { ar: 'SIL Open Font License 1.1', en: 'SIL Open Font License 1.1' }, uses: [USE.everywhere],
  },
  {
    id: 'kitab', group: 'fonts',
    title: { ar: 'خط كتاب (للصيغ مثل ﷺ)', en: 'Kitab (honorific signs such as ﷺ)' }, author: { ar: 'مشروع كاتب', en: 'The Katib Project' },
    link: { url: 'https://github.com/quranacademy/kitab-font', label: 'quranacademy/kitab-font' },
    licence: { ar: 'SIL Open Font License 1.1', en: 'SIL Open Font License 1.1' }, uses: [USE.people],
  },
  {
    id: 'geist-mono', group: 'fonts',
    title: { ar: 'Geist Mono', en: 'Geist Mono' }, author: { ar: 'Vercel', en: 'Vercel' },
    link: { url: 'https://github.com/vercel/geist-font', label: 'vercel/geist-font' },
    licence: { ar: 'SIL Open Font License 1.1', en: 'SIL Open Font License 1.1' }, uses: [{ ar: 'الأرقام في الموقع', en: 'numbers on the website' }],
  },
  // Code
  {
    id: 'adhan', group: 'code',
    title: { ar: 'adhan-js', en: 'adhan-js' }, author: { ar: 'Batoul Apps', en: 'Batoul Apps' },
    link: { url: 'https://github.com/batoulapps/adhan-js', label: 'batoulapps/adhan-js' },
    licence: { ar: 'MIT. الحساب على الجهاز، وطريقة الهيئة المصرية العامة للمساحة هي الافتراضية.', en: 'MIT. Computed on the device; the Egyptian General Authority of Survey method is the default.' },
    uses: [USE.prayer],
  },
  {
    id: 'lucide', group: 'code',
    title: { ar: 'أيقونات Lucide', en: 'Lucide icons' },
    link: { url: 'https://lucide.dev', label: 'lucide.dev' },
    licence: { ar: 'ISC', en: 'ISC' }, uses: [USE.everywhere],
  },
  {
    id: 'font-awesome', group: 'code',
    title: { ar: 'أيقونات Font Awesome المجانية', en: 'Font Awesome Free icons' },
    link: { url: 'https://fontawesome.com/license/free', label: 'fontawesome.com' },
    licence: { ar: 'الأيقونات CC BY 4.0، والشيفرة MIT.', en: 'Icons CC BY 4.0, code MIT.' }, uses: [{ ar: 'صفحات الموقع', en: 'website pages' }],
  },
];

export const sourcesIn = (group: SourceGroup) => SOURCES.filter(source => source.group === group);
