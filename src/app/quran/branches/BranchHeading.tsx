'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BranchHeading() {
  const ar = useLanguage().language === 'ar';
  return <h1 className="sr-only">{ar ? 'متشابهات القرآن' : 'Shared phrase trees'}</h1>;
}

export function MatchingRules() {
  const ar = useLanguage().language === 'ar';
  const rules = ar ? 'قواعد المطابقة' : 'Matching rules';
  return <details className="group relative shrink-0">
      <summary title={rules} className="flex size-11 cursor-pointer list-none items-center justify-center rounded-sm border border-[var(--home-rule)] text-[var(--home-muted)] hover:bg-[var(--home-paper-deep)] hover:text-[var(--home-ink)] group-open:text-[var(--home-ink)] [&::-webkit-details-marker]:hidden">
        <Info size={20} aria-hidden /><span className="sr-only">{rules}</span>
      </summary>
      <p className="absolute start-0 top-full z-20 mt-1 w-80 max-w-[85vw] rounded-sm border border-[var(--home-rule)] bg-[var(--home-paper)] p-3 text-sm text-[var(--home-muted)] shadow-md">{ar
        ? 'تجمع كل شجرة عبارة تكررت في آيتين أو أكثر أينما وردت. لا تفصل واو أو فاء مثبتة صرفيًّا في أول العبارة، ولا اختلافات كرسي الهمزة، بين فروع الشجرة، مع إبقاء الصيغ الأصلية ظاهرة. وتظهر مجموعات السور المسماة في القائمة نفسها. النص برواية حفص كما في صفحة القراءة.'
        : 'Each tree joins wording shared by two or more ayat wherever it occurs. A morphology-marked initial wa or fa and hamza seat differences do not split a tree; original forms remain visible. Named chapter families appear in the same list. Text follows the Hafs reading used in the reader.'}</p>
    </details>;
}
