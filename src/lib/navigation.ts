import { QURAN_CARDS } from '@/app/quran/QuranHub';

type Language = 'en' | 'ar';
type Text = Record<Language, string>;
export type NavItem = { href: string; label: Text; purpose: Text };
export type NavSection = { href: string; label: Text; groups: { title?: Text; items: NavItem[] }[] };

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
      { href: '/quran/prophets/musa', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: 'قصص الأنبياء في القرآن على خط زمني', en: 'The prophets’ stories in the Quran on a timeline' } },
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


export const NAV_SECTIONS: NavSection[] = [
  { href: '/quran/branches', label: { ar: 'متشابهات القرآن', en: 'Phrase trees' }, groups: [] },
  { href: '/quran/read', label: { ar: 'المصحف', en: 'Quran reader' }, groups: [] },
  { href: '/quizzes?topic=BRANCHES', label: { ar: 'اختبار فردي', en: 'Solo quiz' }, groups: [] },
  { href: '/quizzes/party', label: { ar: 'اختبار جماعي', en: 'Party quiz' }, groups: [] },
];

export function activeSection(path: string): string | undefined {
  const pathname = path.split('?')[0];
  return [...NAV_SECTIONS].reverse().find(section => {
    const href = section.href.split('?')[0];
    return pathname === href || pathname.startsWith(`${href}/`);
  })?.href;
}

