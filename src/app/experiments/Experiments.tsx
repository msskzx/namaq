'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageContext';
import { EXPERIMENT_SECTIONS } from '@/lib/navigation';
import styles from '@/components/common/PaperPage.module.css';

export default function Experiments() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return (
    <div dir={ar ? 'rtl' : 'ltr'} className={`${styles.page} mx-auto max-w-5xl px-4 py-8`}>
      <header className={styles.heading}>
        <h1>{ar ? 'تجارب' : 'Experiments'}</h1>
        <p>{ar ? 'دليل الصفحات المتاحة. بعض الأدوات تجريبية وغير مكتملة، وقد تتغير نتائجها وطريقة استخدامها.' : 'A directory of available pages. Some tools are experimental and incomplete; their results and interactions may change.'}</p>
      </header>
      {EXPERIMENT_SECTIONS.map(section => (
        <section key={section.href} className="mb-8" aria-labelledby={`experiment-${section.href.slice(1)}`}>
          <h2 id={`experiment-${section.href.slice(1)}`} className="text-2xl text-[var(--home-accent)]">
            <Link href={section.href} className="hover:underline">{section.label[language]}</Link>
          </h2>
          {section.groups.map((group, index) => (
            <div key={index} className="mt-4">
              {group.title && <h3 className="text-lg text-[var(--home-muted)]">{group.title[language]}</h3>}
              <ul className="divide-y divide-[var(--home-rule)]">
                {group.items.map(item => (
                  <li key={item.href} className="py-3">
                    <Link href={item.href} className="text-lg text-[var(--home-accent)] hover:underline">{item.label[language]}</Link>
                    <p className="text-sm text-[var(--home-muted)]">{item.purpose[language]}</p>
                    <p dir="ltr" className="text-start text-xs text-[var(--home-muted)]">{item.href}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {section.href === '/quizzes' && <ul className="mt-3 space-y-3">
            <li><Link href="/quizzes/party" className="text-[var(--home-accent)] hover:underline">{ar ? 'اختبار جماعي' : 'Party quiz'}</Link></li>
            <li><Link href="/quizzes/questions" className="text-[var(--home-accent)] hover:underline">{ar ? 'بنك الأسئلة' : 'Question bank'}</Link></li>
          </ul>}
        </section>
      ))}
    </div>
  );
}
