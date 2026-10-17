import translations from '@/components/language/translations';
import { PROPHETS } from '@/lib/quran/prophets';

export interface SiteLink {
  href: string;
  label: string;
}

// The full site nav link list, shared between NavBar's mobile dropdown and
// the graph workspace's menu (src/components/graph/GraphCanvas.tsx) -- kept
// here once so the two never drift apart.
export const getAllNavLinks = (language: 'en' | 'ar'): SiteLink[] => [
  { href: '/graphs', label: translations[language].allGraph },
  { href: '/nasab', label: language === 'ar' ? 'النسب' : 'Nasab' },
  { href: '/people/prophet-muhammad', label: translations[language].prophet },
  { href: '/people', label: translations[language].people },
  { href: '/titles', label: translations[language].titles },
  { href: '/events', label: translations[language].events },
  { href: '/quizzes', label: translations[language].quizzes },
  { href: '/sources', label: translations[language].sources },
  { href: '/hadith/bukhari-jibril', label: language === 'ar' ? 'حديث جبريل — البخاري' : 'Hadith of Jibril — Bukhari' },
  { href: '/hadith/muslim-jibril', label: language === 'ar' ? 'حديث جبريل — مسلم' : 'Hadith of Jibril — Muslim' },
  { href: '/hadith/fath-iman-50', label: language === 'ar' ? 'فتح الباري — الحديث ٥٠' : 'Fath al-Bari — hadith 50' },
  { href: '/quran/read', label: language === 'ar' ? 'قراءة القرآن' : 'Read the Quran' },
  { href: '/quran', label: language === 'ar' ? 'القرآن' : 'Quran' },
  { href: '/quran/compare', label: language === 'ar' ? 'مقارنة السور وتكرار العبارات' : 'Compare surahs and repeated phrases' },
  { href: '/quran/words', label: language === 'ar' ? 'ألفاظ القرآن' : 'Words of the Quran' },
  { href: '/quran/branches', label: language === 'ar' ? 'فواتح الآيات المشتركة' : 'Shared ayah openings' },
  { href: '/quran/iltifat', label: language === 'ar' ? 'التفات: تحولات مختارة' : 'Iltifat: hand-picked shifts' },
  { href: '/quran/qiraat', label: language === 'ar' ? 'القراءات' : 'Readings' },
  { href: '/quran/order', label: language === 'ar' ? 'ترتيب السور' : 'Surah order' },
  { href: '/quran/openings', label: language === 'ar' ? 'افتتاح السور: الشرط وجوابه والتسبيح' : 'Surah openings: conditions and tasbih' },
  { href: '/quran/oaths', label: language === 'ar' ? 'الأقسام في القرآن' : 'Oaths in the Qur\'an' },
  ...PROPHETS.map(({ slug, name, nameEn }) => ({ href: `/quran/prophets/${slug}`, label: language === 'ar' ? `خط ${name} الزمني` : `${nameEn} timeline` })),
  { href: '/attributions', label: language === 'ar' ? 'العزو' : 'Attributions' },
];
