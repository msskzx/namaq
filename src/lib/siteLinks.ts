import translations from '@/components/language/translations';

export interface SiteLink {
  href: string;
  label: string;
}

// The full site nav link list, shared between NavBar's mobile dropdown and
// the graph workspace's menu (src/components/graph/GraphCanvas.tsx) -- kept
// here once so the two never drift apart.
export const getAllNavLinks = (language: 'en' | 'ar'): SiteLink[] => [
  { href: '/graphs', label: translations[language].allGraph },
  { href: '/people/prophet-muhammad', label: translations[language].prophet },
  { href: '/people', label: translations[language].people },
  { href: '/titles', label: translations[language].titles },
  { href: '/events', label: translations[language].events },
  { href: '/quizzes', label: translations[language].quizzes },
  { href: '/sources', label: translations[language].sources },
  { href: '/hadith/bukhari-jibril', label: language === 'ar' ? 'حديث جبريل — البخاري' : 'Hadith of Jibril — Bukhari' },
  { href: '/hadith/muslim-jibril', label: language === 'ar' ? 'حديث جبريل — مسلم' : 'Hadith of Jibril — Muslim' },
  { href: '/hadith/fath-iman-50', label: language === 'ar' ? 'فتح الباري — الحديث ٥٠' : 'Fath al-Bari — hadith 50' },
  { href: '/quran', label: language === 'ar' ? 'القرآن (تجريبي)' : 'Quran (demo)' },
  { href: '/quran/compare', label: language === 'ar' ? 'مقارنة سورتين (تجريبي)' : 'Compare two surahs (demo)' },
  { href: '/quran/shifts', label: language === 'ar' ? 'تحولات داخل السورة (تجريبي)' : 'Shifts within a surah (demo)' },
  { href: '/quran/qiraat', label: language === 'ar' ? 'القراءات (تجريبي)' : 'Readings (demo)' },
  { href: '/quran/themes', label: language === 'ar' ? 'مواضع متقابلة (تجريبي)' : 'Matching topics (demo)' },
  { href: '/references', label: language === 'ar' ? 'المراجع' : 'References' },
];
