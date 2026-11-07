'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageContext';
import { EXPERIMENT_SECTIONS, NAV_SECTIONS } from '@/lib/navigation';
import styles from '@/components/common/PaperPage.module.css';

const LAUNCHED = new Set(NAV_SECTIONS.map(section => section.href));

/** Marks a page that is open to everyone in the main navigation. */
function Live({ ar }: { ar: boolean }) {
  return <span className="ms-2 inline-flex items-center gap-1 rounded-full border border-[var(--home-green)] px-2 align-middle text-xs leading-5 text-[var(--home-green)]">
    <span aria-hidden className="size-1.5 rounded-full bg-[var(--home-green)]" />{ar ? 'متاح' : 'Live'}
  </span>;
}

export default function Experiments() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className={`${styles.page} mx-auto max-w-[var(--home-width)] px-[var(--home-gutter)] py-6`}>
      <header className={styles.heading}>
        <h1>{ar ? 'تجارب' : 'Experiments'}</h1>
        <p>{ar ? 'دليل الصفحات المتاحة. بعض الأدوات تجريبية وغير مكتملة، وقد تتغير نتائجها وطريقة استخدامها.' : 'A directory of available pages. Some tools are experimental and incomplete; their results and interactions may change.'}</p>
      </header>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 xl:grid-cols-4">
      {EXPERIMENT_SECTIONS.map(section => (
        <section key={section.href} className={`min-w-0 ${section.href === '/quran' ? 'md:col-span-2 xl:col-span-4' : 'border-t border-[var(--home-rule)] pt-3'}`} aria-labelledby={`experiment-${section.href.slice(1)}`}>
          <div className="flex flex-wrap items-center">
            <h2 id={`experiment-${section.href.slice(1)}`} className="text-2xl text-[var(--home-accent)]">
              <Link href={section.href} className="hover:underline">{section.label[language]}</Link>
            </h2>
            {LAUNCHED.has(section.href) && <Live ar={ar} />}
          </div>
          <div className={section.href === '/quran' ? 'grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4' : ''}>
          {section.groups.map((group, index) => (
            <div key={index} className="mt-4">
              {group.title && <h3 className="mb-1 border-b border-[var(--home-rule)] pb-1 text-base text-[var(--home-muted)]">{group.title[language]}</h3>}
              <ul>
                {group.items.map(item => (
                  <li key={item.href} className="py-1.5">
                    <Link href={item.href} className="text-base text-[var(--home-accent)] hover:underline">{item.label[language]}</Link>{LAUNCHED.has(item.href) && <Live ar={ar} />}
                    <p className="text-sm leading-relaxed text-[var(--home-muted)]">{item.purpose[language]}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
          {section.href === '/quizzes' && <ul className="mt-3 space-y-3">
            <li><Link href="/quizzes/party" className="text-[var(--home-accent)] hover:underline">{ar ? 'اختبار جماعي' : 'Party quiz'}</Link></li>
            <li><Link href="/quizzes/questions" className="text-[var(--home-accent)] hover:underline">{ar ? 'بنك الأسئلة' : 'Question bank'}</Link></li>
          </ul>}
        </section>
      ))}
      </div>
    </div>
  );
}
