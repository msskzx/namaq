'use client';

import { useLanguage } from '@/components/language/LanguageContext';

export default function BranchHeading() {
  const { language } = useLanguage();
  const ar = language === 'ar';
  return <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1" dir={ar ? 'rtl' : 'ltr'}>
    <h1 className="text-2xl">{ar ? 'متشابهات القرآن' : 'Shared phrase trees'}</h1>
    <details className="min-w-40 flex-1 text-sm text-[var(--home-muted)]">
      <summary className="cursor-pointer select-none text-[var(--home-ink)]">{ar ? 'قواعد المطابقة' : 'Matching rules'}</summary>
      <p className="mt-2">{ar
        ? 'تجمع كل شجرة عبارة تكررت في آيتين أو أكثر أينما وردت. لا تفصل واو أو فاء مثبتة صرفيًّا في أول العبارة، ولا اختلافات كرسي الهمزة، بين فروع الشجرة، مع إبقاء الصيغ الأصلية ظاهرة. وتظهر مجموعات السور المسماة في القائمة نفسها. النص برواية حفص كما في صفحة القراءة.'
        : 'Each tree joins wording shared by two or more ayat wherever it occurs. A morphology-marked initial wa or fa and hamza seat differences do not split a tree; original forms remain visible. Named chapter families appear in the same list. Text follows the Hafs reading used in the reader.'}</p>
    </details>
  </header>;
}
