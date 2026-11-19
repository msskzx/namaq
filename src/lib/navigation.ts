type Language = 'en' | 'ar';
type Text = Record<Language, string>;
export type NavItem = { href: string; label: Text; purpose: Text };
export type NavSection = { href: string; label: Text; groups: { title?: Text; items: NavItem[] }[] };

/** Every Quran page with its purpose, for the section hubs (EXPERIMENT_SECTIONS below). */
export const QURAN_CARDS: { href: string; desc: Text }[] = [
  { href: '/quran/read', desc: { ar: 'اقرأ المصحف صفحةً صفحة برواية حفص', en: 'Read the mushaf page by page, in Hafs' } },
  { href: '/quran/compare', desc: { ar: 'اقرأ سورتين متجاورتين، كل آية بجانب أختها المتشابهة، لتتدبّر كيف تُروى القصة الواحدة بألفاظ مختلفة', en: 'Read two surahs side by side, each ayah next to its similar partner, to ponder how one story is told in different words' } },
  { href: '/quran/words', desc: { ar: 'كم مرة ترد كل كلمة، وكلمات متقابلة جنبًا إلى جنب', en: 'How often each word occurs, and opposite words side by side' } },
  { href: '/quran/branches', desc: { ar: 'آيات تبدأ بالكلمات نفسها، وأين تتفرع', en: 'Ayat that open with the same words, and where they branch apart' } },
  { href: '/quran/lataif', desc: { ar: 'أمثلة مختارة في موضوعات شتى، لكل مثال صورته ومرجعه', en: 'Chosen examples on many topics, each with its own picture and reference' } },
  { href: '/quran/qiraat', desc: { ar: 'مواضع تختلف فيها القراءات العشر', en: 'Places where the ten readings differ' } },
  { href: '/quran/order', desc: { ar: 'سور الأجزاء من ٢٥ إلى ٣٠ بأوائلها ومقاصدها، وما يصل كل سورة بالتي قبلها من كتب التناسب', en: 'The surahs of juz 25 to 30 with their openings and aims, and what joins each to the one before, from the books on surah order' } },
  { href: '/quran/openings', desc: { ar: 'أنواع افتتاح السور العشرة، ومقارنة الأوائل المتشابهة', en: 'The ten kinds of surah opening, with look-alike openings side by side' } },
  { href: '/quran/oaths', desc: { ar: 'كل قسم في القرآن وما أُقسم به، من الله ومن غيره', en: 'Every oath in the Quran and what is sworn by, Allah’s and others’' } },
  { href: '/quran/books', desc: { ar: 'كتب التفسير والإعراب والبلاغة صفحة صفحة كما طُبعت، بفاصلة تضعها حيث توقفت', en: 'The tafsir, i‘rab and balagha books page by printed page, with a stop mark where you left off' } },
  { href: '/quran/tajwid/tuhfat-al-atfal', desc: { ar: 'منظومة الجمزوري في أحكام النون والميم والمد، مضبوطة بالشكل', en: 'Al-Jamzuri’s poem on the rules of nun, mim and madd, fully vowelled' } },
  { href: '/quran/prophets', desc: { ar: 'أحداث قصص الأنبياء وأين ذُكرت في السور', en: 'The events of the prophets’ stories and the surahs that tell them' } },
];

const quran = (href: string, label: Text): NavItem => ({ href, label, purpose: QURAN_CARDS.find(card => card.href === href)!.desc });
export const EXPERIMENT_SECTIONS: NavSection[] = [
  { href: '/quran', label: { ar: 'القرآن', en: 'Quran' }, groups: [
    { title: { ar: 'القراءة', en: 'Read' }, items: [
      quran('/quran/read', { ar: 'المصحف', en: 'The mushaf' }),
      quran('/quran/qiraat', { ar: 'القراءات', en: 'Readings' }),
    ] },
    { title: { ar: 'الألفاظ', en: 'Words' }, items: [
      quran('/quran/branches', { ar: 'متشابهات القرآن', en: 'Shared phrase trees' }),
      quran('/quran/compare', { ar: 'مقارنة السور', en: 'Compare surahs' }),
      quran('/quran/words', { ar: 'ألفاظ القرآن', en: 'Words of the Quran' }),
    ] },
    { title: { ar: 'الموضوعات', en: 'Themes' }, items: [
      { href: '/quran/prophets', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: 'أحداث قصص الأنبياء وأين ذُكرت في السور', en: 'The events of the prophets’ stories and the surahs that tell them' } },
      quran('/quran/lataif', { ar: 'مشاهد', en: 'Scenes' }),
      quran('/quran/openings', { ar: 'افتتاح السور', en: 'Surah openings' }),
      quran('/quran/oaths', { ar: 'الأقسام', en: 'Oaths' }),
      quran('/quran/order', { ar: 'ترتيب السور', en: 'Surah order' }),
    ] },
    { title: { ar: 'التجويد', en: 'Tajwid' }, items: [
      quran('/quran/tajwid/tuhfat-al-atfal', { ar: 'تحفة الأطفال', en: 'Tuhfat al-Atfal' }),
    ] },
  ] },
  { href: '/hadith', label: { ar: 'الحديث', en: 'Hadith' }, groups: [{ items: [
    { href: '/hadith/bukhari-jibril', label: { ar: 'صحيح البخاري', en: 'Sahih al-Bukhari' }, purpose: { ar: 'الحديث بإسناده وحواره', en: 'Hadith with their isnad and dialogue' } },
    { href: '/hadith/muslim-jibril', label: { ar: 'صحيح مسلم', en: 'Sahih Muslim' }, purpose: { ar: 'الحديث بإسناده وحواره', en: 'Hadith with their isnad and dialogue' } },
    { href: '/hadith/fath-iman-50', label: { ar: 'فتح الباري', en: 'Fath al-Bari' }, purpose: { ar: 'شرح ابن حجر لصحيح البخاري', en: 'Ibn Hajar’s commentary on Sahih al-Bukhari' } },
  ] }] },
  { href: '/biographies', label: { ar: 'التراجم', en: 'Biographies' }, groups: [
    { title: { ar: 'الأشخاص والأحداث', en: 'People and events' }, items: [
      { href: '/stories', label: { ar: 'قصص السيرة', en: 'Sira stories' }, purpose: { ar: 'القصة كاملة كما يرويها الكتاب، بإسنادها', en: 'Each story whole as the book tells it, with its chain' } },
      { href: '/people', label: { ar: 'الأعلام', en: 'Notable people' }, purpose: { ar: 'الأسماء والأنساب والأحوال مع مصادرها', en: 'Names, lineage and lives, with their sources' } },
      { href: '/titles', label: { ar: 'الألقاب', en: 'Titles' }, purpose: { ar: 'الألقاب ومن عُرف بها', en: 'Titles and the people known by them' } },
      { href: '/events', label: { ar: 'الأحداث', en: 'Events' }, purpose: { ar: 'الأحداث والغزوات ومن شهدها', en: 'Events and battles, and who took part' } },
    ] },
    { title: { ar: 'شبكة العلاقات', en: 'Relationships' }, items: [
      { href: '/graphs', label: { ar: 'استكشاف الشبكة', en: 'Explore the graph' }, purpose: { ar: 'استكشف الصلات بين الأشخاص وصفّها بحسب نوع العلاقة', en: 'Explore the connections between people and filter them by relationship' } },
      { href: '/nasab', label: { ar: 'النسب', en: 'Lineage' }, purpose: { ar: 'تتبّع سلاسل الآباء وقارن أنساب عدة أشخاص', en: 'Trace paternal lines and compare several people’s ancestry' } },
    ] },
  ] },
  { href: '/sources', label: { ar: 'المصادر', en: 'Sources' }, groups: [{ items: [
    { href: '/sources', label: { ar: 'الكتب', en: 'Books' }, purpose: { ar: 'الكتب التي تُستخرج منها المعلومات، تُقرأ بنصها', en: 'The books the information comes from, readable in full' } },
    { href: '/attributions', label: { ar: 'العزو', en: 'Attributions' }, purpose: { ar: 'مصادر البيانات وتراخيصها', en: 'Where the data comes from and its licences' } },
  ] }] },
  { href: '/quizzes', label: { ar: 'الاختبارات', en: 'Quizzes' }, groups: [] },
];


/** The Quran tab's tools, as in the app's Quran hub (owner, 2026-11-13; its QURAN_TILES order); the Quran tab is lit on the hub and on each of them. */
export const QURAN_TOOLS: NavItem[] = [
  { href: '/quran/branches', label: { ar: 'متشابهات القرآن', en: 'Phrase trees' }, purpose: { ar: '', en: '' } },
  { href: '/quran/compare', label: { ar: 'مقارنة السور', en: 'Compare surahs' }, purpose: { ar: '', en: '' } },
  { href: '/quran/prophets', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: '', en: '' } },
  { href: '/quran/tajwid/tuhfat-al-atfal', label: { ar: 'تحفة الأطفال', en: 'Tuhfat al-Atfal' }, purpose: { ar: '', en: '' } },
  { href: '/quran/words', label: { ar: 'ألفاظ القرآن', en: 'Words of the Quran' }, purpose: { ar: '', en: '' } },
  { href: '/quran/oaths', label: { ar: 'الأقسام', en: 'Oaths' }, purpose: { ar: '', en: '' } },
  { href: '/quran/lataif', label: { ar: 'مشاهد', en: 'Scenes' }, purpose: { ar: '', en: '' } },
  { href: '/quran/terms', label: { ar: 'مصطلحات البلاغة', en: 'Balagha terms' }, purpose: { ar: '', en: '' } },
  { href: '/quran/qiraat', label: { ar: 'القراءات', en: 'Readings' }, purpose: { ar: '', en: '' } },
  { href: '/quran/openings', label: { ar: 'افتتاح السور', en: 'Surah openings' }, purpose: { ar: '', en: '' } },
  { href: '/quran/order', label: { ar: 'ترتيب السور', en: 'Surah order' }, purpose: { ar: '', en: '' } },
];

/** The library: the book shelf and each book's pages. */
export const LIBRARY = '/quran/books';

/** The Quran hub's tiles: the mushaf first (it lost its own button, owner 2026-11-18), then the tools, as in the app. */
export const QURAN_HUB: NavItem[] = [
  { href: '/quran/read', label: { ar: 'المصحف', en: 'The mushaf' }, purpose: { ar: '', en: '' } },
  ...QURAN_TOOLS,
];

/**
 * The app's five tab buttons, first on the right: Quran, hadith, home, tarajim, quizzes (owner, 2026-11-18). The mushaf
 * opens from the Quran hub and lights the Quran; the library, the search and the utilities open from home and light it.
 * `paths` are the pages that light a section besides its own href and the pages under it.
 */
export const NAV_SECTIONS: (NavSection & { paths?: string[] })[] = [
  { href: '/quran', label: { ar: 'القرآن', en: 'Quran' }, groups: [], paths: QURAN_HUB.map(tool => tool.href) },
  { href: '/hadith', label: { ar: 'الحديث', en: 'Hadith' }, groups: [] },
  { href: '/', label: { ar: 'الرئيسية', en: 'Home' }, groups: [], paths: [LIBRARY, '/search', '/utilities'] },
  { href: '/biographies', label: { ar: 'التراجم', en: 'Biographies' }, groups: [], paths: ['/biographies', '/stories', '/people', '/titles', '/events', '/battles', '/graphs', '/nasab'] },
  { href: '/quizzes', label: { ar: 'الاختبارات', en: 'Quizzes' }, groups: [] },
];

const under = (pathname: string, href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

export function activeSection(path: string): string | undefined {
  const pathname = path.split('?')[0];
  // A section with `paths` lights on its own page and those; one without, on its page and every page under it.
  return NAV_SECTIONS.find(section => pathname === section.href
    || (section.paths ? section.paths.some(href => under(pathname, href)) : under(pathname, section.href)))?.href;
}

/** A book's pages (not the shelf): the phone top bar shows the library in the logo's place, back to the shelf, as in the app. */
export const isBookPage = (path: string) => path.split('?')[0].startsWith(`${LIBRARY}/`);

/** A Quran tool's page (not the hub): its phone top bar shows a back arrow to the Quran hub in the logo's place, as in the app. */
export const isQuranTool = (path: string) => QURAN_TOOLS.some(tool => under(path.split('?')[0], tool.href));
