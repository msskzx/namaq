'use client';

import { useLanguage } from '@/components/language/LanguageContext';
import styles from '@/components/common/PaperPage.module.css';

export default function BranchHeading() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return <header className={styles.heading} dir={ar ? 'rtl' : 'ltr'}>
    <p className={styles.eyebrow}>{ar ? 'نمق · القرآن الكريم' : 'Namaq · Quran'}</p>
    <h1>{ar ? 'العبارات المشتركة في الآيات' : 'Shared ayah phrases'}</h1>
    <p className="text-sm text-[var(--home-muted)]">{ar
      ? 'عبارات مشتركة في أول الآية أو داخلها، تتفرع حيث تختلف كلماتها، ومجموعات من فواتح السور.'
      : 'Explore shared phrases at the start or inside ayat and families of chapter openings, branching where their wording differs.'}</p>
    <details className="text-sm text-[var(--home-muted)]">
      <summary className="cursor-pointer select-none text-[var(--home-ink)]">{ar ? 'قواعد المطابقة' : 'Matching rules'}</summary>
      <p className="mt-2">{ar
        ? 'تُجمع الآية المبدوءة بواو أو فاء عاطفة مع التي تبدأ بالكلمة نفسها دونها، وتظهر الصيغتان قبل الشجرة. تُجمع الفواتح بلا تشكيل ولا علامات وقف مع اتفاق جذور الكلمات، وفي الشجرة تصير الكلمة التي يختلف تشكيلها عقدة مستقلة، والنص برواية حفص كما في صفحة القراءة.'
        : 'Initial conjunctions wa and fa are grouped with the same opening without the conjunction, with each form shown before the tree. Openings match without vowel and pause marks and must have matching word roots. Significant vowel differences create separate tree nodes. Text follows the Hafs reading used in the reader.'}</p>
    </details>
  </header>;
}
