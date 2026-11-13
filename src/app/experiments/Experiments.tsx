'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageContext';
import { EXPERIMENT_SECTIONS, type NavItem } from '@/lib/navigation';
import styles from '@/components/common/PaperPage.module.css';

type Text = NavItem['label'];

/** Features that are built and open to everyone, in the order a reader meets them. */
export const LIVE: NavItem[] = [
  { href: '/quran/read', label: { ar: 'المصحف', en: 'The mushaf' }, purpose: { ar: 'مصحف المدينة صفحةً صفحة، مع أزرار كل آية', en: 'The Madinah mushaf page by page, with buttons on each ayah' } },
  { href: '/quran/read/recite', label: { ar: 'التسميع', en: 'Recite' }, purpose: { ar: 'سمّع حفظك كلمةً كلمة، وراجع ما نسيته', en: 'Recite from memory word by word, and review what you forgot' } },
  { href: '/quran/branches', label: { ar: 'متشابهات القرآن', en: 'Phrase trees' }, purpose: { ar: 'آيات تبدأ بالكلمات نفسها، شجرةً أو جدولًا، وأين تتفرع', en: 'Ayat that open with the same words, as a tree or a matrix, and where they branch' } },
  { href: '/quran/compare', label: { ar: 'مقارنة السور', en: 'Compare surahs' }, purpose: { ar: 'سورتان جنبًا إلى جنب، مع بطاقات قصص الأنبياء المشتركة', en: 'Two surahs side by side, with story cards for the prophets they share' } },
  { href: '/quran/prophets', label: { ar: 'قصص الأنبياء', en: 'Prophets’ stories' }, purpose: { ar: 'أحداث كل قصة وكيف تُروى في السور', en: 'The events of each story and how the surahs tell them' } },
  { href: '/quran/prophets/muhammad', label: { ar: 'سيرة النبي ﷺ في القرآن', en: 'The Prophet ﷺ in the Quran' }, purpose: { ar: 'أحداث السيرة التي ذكرها القرآن', en: 'The events of his life that the Quran mentions' } },
  { href: '/quizzes?topic=BRANCHES', label: { ar: 'اختبار فردي', en: 'Solo quiz' }, purpose: { ar: 'أكمل فروع شجرة المتشابهات', en: 'Complete the branches of a phrase tree' } },
  { href: '/quizzes/party', label: { ar: 'اختبار جماعي', en: 'Party quiz' }, purpose: { ar: 'الاختبار نفسه مع أصحابك برابط واحد', en: 'The same quiz with friends, from one link' } },
  { href: '/library?tab=saved', label: { ar: 'المحفوظات', en: 'Saved' }, purpose: { ar: 'الآيات والشجرات والمقارنات التي حفظتها', en: 'The ayat, trees and comparisons you saved' } },
  { href: '/library?tab=forgotten', label: { ar: 'ما نسيته', en: 'Forgotten' }, purpose: { ar: 'الآيات التي نسيتها، تعود إليك حتى تثبت', en: 'The ayat you forgot, coming back until they stick' } },
];

/** Being built now; listed without links until they are live. */
const COMING: Text[] = [
  { ar: 'مواقيت الصلاة والقبلة', en: 'Prayer times and qibla' },
  { ar: 'التاريخ الهجري وبطاقة اليوم', en: 'Hijri date and a daily card' },
  { ar: 'خواطر على الآيات', en: 'Reflection notes on ayat' },
  { ar: 'عدّ الكلمات', en: 'Word counts' },
];

const LIVE_PATHS = new Set(LIVE.map(item => item.href.split('?')[0]).concat('/quizzes'));

function Item({ item, language }: { item: NavItem; language: 'en' | 'ar' }) {
  return <li className="py-1.5">
    <Link href={item.href} className="text-base text-[var(--home-accent)] hover:underline">{item.label[language]}</Link>
    <p className="text-sm leading-relaxed text-[var(--home-muted)]">{item.purpose[language]}</p>
  </li>;
}

export default function Experiments() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  // Experiments are the pages not yet live; the live ones sit in the first section.
  const sections = EXPERIMENT_SECTIONS.map(section => ({
    ...section,
    groups: section.groups.map(group => ({ ...group, items: group.items.filter(item => !LIVE_PATHS.has(item.href)) })).filter(group => group.items.length),
  }));
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className={`${styles.page} mx-auto max-w-[var(--home-width)] px-[var(--home-gutter)] py-6`}>
      <section aria-labelledby="experiment-live" className="mb-8 grid gap-x-8 sm:grid-cols-2">
        <div>
          <h2 id="experiment-live" className="text-2xl text-[var(--home-accent)]">{ar ? 'متاح' : 'Live'}</h2>
          <ul className="mt-2 sm:columns-2 sm:gap-8 [&>li]:break-inside-avoid">
            {LIVE.map(item => <Item key={item.href} item={item} language={language} />)}
          </ul>
        </div>
        <div className="mt-6 border-t border-[var(--home-rule)] pt-3 sm:mt-0 sm:border-t-0 sm:pt-0">
          <h2 className="text-2xl text-[var(--home-muted)]">{ar ? 'قريبًا' : 'Coming'}</h2>
          <ul className="mt-2">
            {COMING.map(text => <li key={text.en} className="py-1.5 text-base text-[var(--home-muted)]">{text[language]}</li>)}
          </ul>
        </div>
      </section>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
      {sections.map(section => (
        <section key={section.href} className={`min-w-0 border-t border-[var(--home-rule)] pt-3 ${section.href === '/quran' ? 'md:col-span-2 xl:col-span-4' : ''}`} aria-labelledby={`experiment-${section.href.slice(1)}`}>
          <h2 id={`experiment-${section.href.slice(1)}`} className="text-2xl text-[var(--home-accent)]">
            <Link href={section.href} className="hover:underline">{section.label[language]}</Link>
          </h2>
          <div className={section.href === '/quran' ? 'grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4' : ''}>
          {section.groups.map((group, index) => (
            <div key={index} className="mt-4">
              {group.title && <h3 className="mb-1 border-b border-[var(--home-rule)] pb-1 text-base text-[var(--home-muted)]">{group.title[language]}</h3>}
              <ul>{group.items.map(item => <Item key={item.href} item={item} language={language} />)}</ul>
            </div>
          ))}
          </div>
          {section.href === '/quizzes' && <ul className="mt-3">
            <li className="py-1.5"><Link href="/quizzes/questions" className="text-[var(--home-accent)] hover:underline">{ar ? 'بنك الأسئلة' : 'Question bank'}</Link></li>
          </ul>}
        </section>
      ))}
      </div>
    </div>
  );
}
