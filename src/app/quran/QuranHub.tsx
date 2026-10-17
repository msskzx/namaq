'use client';

import React from 'react';
import ExplorationCard from '@/components/common/ExplorationCard';
import { useLanguage } from '@/components/language/LanguageContext';
import { getAllNavLinks } from '@/lib/siteLinks';
import { PROPHETS } from '@/lib/quran/prophets';

type Language = 'en' | 'ar';

export const QURAN_CARDS: { href: string; desc: Record<Language, string> }[] = [
  { href: '/quran/read', desc: { ar: 'اقرأ المصحف صفحةً صفحة برواية حفص', en: 'Read the mushaf page by page, in Hafs' } },
  { href: '/quran/compare', desc: { ar: 'قارن سورتين، وتتبّع العبارات التي تتكرر داخل السورة وبين السور', en: 'Compare two surahs, and follow the phrases repeated inside a surah and across surahs' } },
  { href: '/quran/words', desc: { ar: 'كم مرة ترد كل كلمة، وكلمات متقابلة جنبًا إلى جنب', en: 'How often each word occurs, and opposite words side by side' } },
  { href: '/quran/branches', desc: { ar: 'آيات تبدأ بالكلمات نفسها، وأين تتفرع', en: 'Ayat that open with the same words, and where they branch apart' } },
  { href: '/quran/iltifat', desc: { ar: 'تحولات مختارة في الخطاب بين الغائب والمتكلم والمخاطب', en: 'Hand-picked shifts of address between third, first and second person' } },
  { href: '/quran/qiraat', desc: { ar: 'مواضع تختلف فيها القراءات العشر', en: 'Places where the ten readings differ' } },
  { href: '/quran/order', desc: { ar: 'سور الأجزاء من ٢٥ إلى ٣٠ بمواضيعها، وما يصل كل سورة بالتي تليها', en: 'The surahs of juz 25 to 30 with their themes, and how each joins the next' } },
  { href: '/quran/openings', desc: { ar: 'كيف تبدأ السور: الشرط وجوابه، والتسبيح', en: 'How surahs open: conditions and their answers, and tasbih' } },
  { href: '/quran/oaths', desc: { ar: 'أقسام الأجزاء من ٢٥ إلى ٣٠ وما أُقسم به', en: 'The oaths of juz 25 to 30 and what is sworn by' } },
  ...PROPHETS.map(({ slug, name, nameEn }) => ({
    href: `/quran/prophets/${slug}`,
    desc: { ar: `قصة ${name} في القرآن على خط زمني`, en: `The story of ${nameEn} in the Quran on a timeline` },
  })),
];

export default function QuranHub() {
  const { language } = useLanguage() as { language: Language };
  const links = getAllNavLinks(language);
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="w-full max-w-5xl mx-auto p-4 text-gray-900 dark:text-gray-200">
      <h1 className="text-3xl mb-6">{language === 'ar' ? 'القرآن' : 'Quran'}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QURAN_CARDS.map(({ href, desc }) => (
          <ExplorationCard key={href} url={href} title={links.find(l => l.href === href)?.label ?? href} desc={desc[language]} />
        ))}
      </div>
    </div>
  );
}
