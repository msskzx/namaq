'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BranchHeading({ children }: { children?: React.ReactNode }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const rules = ar ? 'قواعد المطابقة' : 'Matching rules';
  return <header className="flex flex-wrap items-center gap-x-3 gap-y-2" dir={ar ? 'rtl' : 'ltr'}>
    <h1 className="text-xl">{ar ? 'متشابهات القرآن' : 'Shared phrase trees'}</h1>
    <details className="relative">
      <summary title={rules} className="flex cursor-pointer list-none rounded-sm p-1.5 text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)] [&::-webkit-details-marker]:hidden">
        <Info size={18} aria-hidden /><span className="sr-only">{rules}</span>
      </summary>
      <p className="absolute start-0 top-full z-20 mt-1 w-80 max-w-[85vw] rounded-sm border border-[var(--home-rule)] bg-[var(--home-paper)] p-3 text-sm text-[var(--home-muted)] shadow-md">{ar
        ? 'تجمع كل شجرة عبارة تكررت في آيتين أو أكثر أينما وردت. لا تفصل واو أو فاء مثبتة صرفيًّا في أول العبارة، ولا اختلافات كرسي الهمزة، بين فروع الشجرة، مع إبقاء الصيغ الأصلية ظاهرة. وتظهر مجموعات السور المسماة في القائمة نفسها. النص برواية حفص كما في صفحة القراءة.'
        : 'Each tree joins wording shared by two or more ayat wherever it occurs. A morphology-marked initial wa or fa and hamza seat differences do not split a tree; original forms remain visible. Named chapter families appear in the same list. Text follows the Hafs reading used in the reader.'}</p>
    </details>
    {children && <div className="min-w-64 flex-[1_1_24rem]">{children}</div>}
  </header>;
}
