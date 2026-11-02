'use client';

import React from 'react';
import { SettingsHelp } from '@/components/common/SettingsHelp';
import { useLanguage } from '@/components/language/LanguageContext';

export default function BranchHeading() {
  const ar = useLanguage().language === 'ar';
  return <h1 className="sr-only">{ar ? 'متشابهات القرآن' : 'Shared phrase trees'}</h1>;
}

/** The page's matching rules, as a row in the settings sheet. */
export function MatchingRules({ children }: { children?: React.ReactNode }) {
  const ar = useLanguage().language === 'ar';
  const rules = ar ? 'قواعد المطابقة' : 'Matching rules';
  return <SettingsHelp label={rules}><p>{ar
        ? 'تجمع كل شجرة عبارة تكررت في آيتين أو أكثر أينما وردت. لا تفصل واو أو فاء مثبتة صرفيًّا في أول العبارة، ولا اختلافات كرسي الهمزة، بين فروع الشجرة، مع إبقاء الصيغ الأصلية ظاهرة. وتظهر مجموعات السور المسماة في القائمة نفسها. النص برواية حفص كما في صفحة القراءة.'
        : 'Each tree joins wording shared by two or more ayat wherever it occurs. A morphology-marked initial wa or fa and hamza seat differences do not split a tree; original forms remain visible. Named chapter families appear in the same list. Text follows the Hafs reading used in the reader.'}</p>{children}</SettingsHelp>;
}
