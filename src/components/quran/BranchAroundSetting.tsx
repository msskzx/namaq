'use client';

import { useId } from 'react';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';
import { useAroundSetting } from '@/app/quran/branches/Surroundings';

/** How a tree, matrix or compare card opens; each card's own button switches it there. */
export default function BranchAroundSetting() {
  const id = useId();
  const ar = useLanguage().language === 'ar';
  const [on, set] = useAroundSetting();
  const label = ar ? 'إظهار الآيات المحيطة افتراضيًا' : 'Show surrounding ayat by default';
  return <div className="flex items-center justify-between gap-3 px-3 py-2">
    <label htmlFor={id} className="text-sm text-[var(--home-ink)]">{label}</label>
    <Toggle id={id} label={label} checked={on} onChange={set} />
  </div>;
}
