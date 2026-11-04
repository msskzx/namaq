'use client';

import React from 'react';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BranchHeading() {
  const ar = useLanguage().language === 'ar';
  return <h1 className="sr-only">{ar ? 'متشابهات القرآن' : 'Quran parallels'}</h1>;
}

/** The page's matching rules, as a row in the settings sheet. */
export function MatchingRules({ children }: { children?: React.ReactNode }) {
  const ar = useLanguage().language === 'ar';
  const rules = ar ? 'قواعد المطابقة' : 'Matching rules';
  return <SettingsHelp label={rules}><p>{ar
        ? 'تجمع البطاقة مواضع متشابهة، وتعرضها كشجرة أو مصفوفة. تطابق كل موضعين شرط للتجميع الآلي، وتحفظ مجموعات الكتب كما وردت. نوع الاختلاف تحت البطاقة قابل للنقر لتصفية المواضع. الخط تحت الكلمة يبين اختلافًا يحتاج الانتباه، والألوان تبقى للمطابقة اللفظية أو الصرفية. تظل العبارات العامة متاحة بالبحث. وسوم التذكير والتأنيث والإظهار والإضمار والإعراب والقالب الواحد امتدادات نمق. حدود المطابقة العددية اختيارات نمق، والنص برواية حفص كما في صفحة القراءة.'
        : 'Each card groups parallel passages, shown as a tree or matrix. Automatic groups require every pair to match; cited book groups are retained. Click a difference type below a card to filter passages. Underlines highlight differing words, while colors show word or morphology matches. General phrases remain available through search. Gender, noun/pronoun, case and same-frame tags are Namaq extensions. Numerical matching thresholds are Namaq choices. Text follows the Hafs reading used in the reader.'}</p>{children}</SettingsHelp>;
}
