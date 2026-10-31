import translations from '@/components/language/translations';

export interface SiteLink {
  href: string;
  label: string;
}

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
  { href: '/quran/branches', label: language === 'ar' ? 'متشابهات القرآن' : 'Shared phrase trees' },
  { href: '/quran/iltifat', label: language === 'ar' ? 'التفات: تحولات مختارة' : 'Iltifat: hand-picked shifts' },
  { href: '/quran/qiraat', label: language === 'ar' ? 'القراءات' : 'Readings' },
  { href: '/quran/order', label: language === 'ar' ? 'ترتيب السور' : 'Surah order' },
  { href: '/quran/openings', label: language === 'ar' ? 'افتتاح السور: الشرط وجوابه والتسبيح' : 'Surah openings: conditions and tasbih' },
  { href: '/quran/oaths', label: language === 'ar' ? 'الأقسام في القرآن' : 'Oaths in the Qur\'an' },
  { href: '/quran/tajwid/tuhfat-al-atfal', label: language === 'ar' ? 'تحفة الأطفال' : 'Tuhfat al-Atfal' },
  { href: '/quran/prophets/musa', label: language === 'ar' ? 'قصص الأنبياء في القرآن' : 'Prophets’ stories in the Quran' },
  { href: '/attributions', label: language === 'ar' ? 'العزو' : 'Attributions' },
];
