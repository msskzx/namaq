type Language = 'en' | 'ar';
type Text = Record<Language, string>;
export type NavItem = { href: string; label: Text; purpose: Text };
export type NavSection = { href: string; label: Text; groups: { title?: Text; items: NavItem[] }[] };

/** Every Quran page with its purpose, for the experiments page (EXPERIMENT_SECTIONS below). */
export const QURAN_CARDS: { href: string; desc: Text }[] = [
  { href: '/quran/read', desc: { ar: 'اقرأ المصحف صفحةً صفحة برواية حفص', en: 'Read the mushaf page by page, in Hafs' } },
  { href: '/quran/compare', desc: { ar: 'اقرأ سورتين متجاورتين، كل آية بجانب أختها المتشابهة، لتتدبّر كيف تُروى القصة الواحدة بألفاظ مختلفة', en: 'Read two surahs side by side, each ayah next to its similar partner, to ponder how one story is told in different words' } },
  { href: '/quran/words', desc: { ar: 'كم مرة ترد كل كلمة، وكلمات متقابلة جنبًا إلى جنب', en: 'How often each word occurs, and opposite words side by side' } },
  { href: '/quran/branches', desc: { ar: 'آيات تبدأ بالكلمات نفسها، وأين تتفرع', en: 'Ayat that open with the same words, and where they branch apart' } },
  { href: '/quran/iltifat', desc: { ar: 'تحولات مختارة في الخطاب بين الغائب والمتكلم والمخاطب', en: 'Hand-picked shifts of address between third, first and second person' } },
  { href: '/quran/qiraat', desc: { ar: 'مواضع تختلف فيها القراءات العشر', en: 'Places where the ten readings differ' } },
  { href: '/quran/order', desc: { ar: 'سور الأجزاء من ٢٥ إلى ٣٠ بمواضيعها، وما يصل كل سورة بالتي تليها', en: 'The surahs of juz 25 to 30 with their themes, and how each joins the next' } },
  { href: '/quran/openings', desc: { ar: 'كيف تبدأ السور: الشرط وجوابه، والتسبيح', en: 'How surahs open: conditions and their answers, and tasbih' } },
  { href: '/quran/oaths', desc: { ar: 'أقسام الأجزاء من ٢٥ إلى ٣٠ وما أُقسم به', en: 'The oaths of juz 25 to 30 and what is sworn by' } },
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
      { href: '/quran/compare?view=similar', label: { ar: 'مقارنة السور بأدواتها كاملة', en: 'Compare surahs with every tool' }, purpose: { ar: 'المقارنة السابقة بكل أدواتها: آية بآية، والمواضيع، ونطاق الأجزاء والسور', en: 'The earlier comparison with every tool: ayah by ayah, topics, and juz or surah ranges' } },
      quran('/quran/words', { ar: 'ألفاظ القرآن', en: 'Words of the Quran' }),
    ] },
    { title: { ar: 'الموضوعات', en: 'Themes' }, items: [
      { href: '/quran/prophets', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: 'أحداث قصص الأنبياء وأين ذُكرت في السور', en: 'The events of the prophets’ stories and the surahs that tell them' } },
      quran('/quran/iltifat', { ar: 'الالتفات', en: 'Iltifat' }),
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


/** The Quran tab's tools, as in the app's Quran hub (owner, 2026-11-13); the Quran tab is lit on the hub and on each of them. */
export const QURAN_TOOLS: NavItem[] = [
  { href: '/quran/branches', label: { ar: 'متشابهات القرآن', en: 'Phrase trees' }, purpose: { ar: '', en: '' } },
  { href: '/quran/compare', label: { ar: 'مقارنة السور', en: 'Compare surahs' }, purpose: { ar: '', en: '' } },
  { href: '/quran/prophets', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: '', en: '' } },
  { href: '/quran/tajwid/tuhfat-al-atfal', label: { ar: 'تحفة الأطفال', en: 'Tuhfat al-Atfal' }, purpose: { ar: '', en: '' } },
];

/** Utilities (prayer times, qibla, Hijri calendar) shows once the first of them lands, as in the app (SHOW_UTILITIES there). */
export const SHOW_UTILITIES = true;

/**
 * The app's five tab buttons (owner, 2026-11-13), first on the right: Quran, mushaf, home, quizzes, utilities.
 * `paths` are the pages that light a section besides its own href and the pages under it.
 */
export const NAV_SECTIONS: (NavSection & { paths?: string[] })[] = [
  { href: '/quran', label: { ar: 'القرآن', en: 'Quran' }, groups: [], paths: QURAN_TOOLS.map(tool => tool.href) },
  { href: '/quran/read', label: { ar: 'المصحف', en: 'Quran reader' }, groups: [] },
  { href: '/', label: { ar: 'الرئيسية', en: 'Home' }, groups: [] },
  { href: '/quizzes', label: { ar: 'الاختبارات', en: 'Quizzes' }, groups: [] },
  ...(SHOW_UTILITIES ? [{ href: '/utilities', label: { ar: 'الأدوات', en: 'Utilities' }, groups: [] }] : []),
];

const under = (pathname: string, href: string) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

export function activeSection(path: string): string | undefined {
  const pathname = path.split('?')[0];
  // The one search opens from home and lights it, as in the app.
  if (pathname === '/search') return '/';
  return NAV_SECTIONS.find(section => section.href === '/quran'
    ? pathname === '/quran' || section.paths!.some(href => under(pathname, href))
    : under(pathname, section.href.split('?')[0]))?.href;
}

/** A Quran tool's page (not the hub): its phone top bar shows a back arrow to the Quran hub in the logo's place, as in the app. */
export const isQuranTool = (path: string) => QURAN_TOOLS.some(tool => under(path.split('?')[0], tool.href));
