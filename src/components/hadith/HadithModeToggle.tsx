'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faScroll } from '@fortawesome/free-solid-svg-icons';
import Toggle from '@/components/common/Toggle';
import { useLanguage } from '@/components/language/LanguageContext';

export type HadithMode = 'text' | 'bubbles';

export default function HadithModeToggle({
  mode,
  onChange,
}: {
  mode: HadithMode;
  onChange: (mode: HadithMode) => void;
}) {
  const ar = useLanguage().language === 'ar';
  const bubbles = mode === 'bubbles';
  const label = (on: boolean) => (on ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400');
  return (
    <div className="mb-4 flex items-center gap-2 text-sm">
      <span className={label(!bubbles)}>{ar ? 'النص كاملاً' : 'Full text'}</span>
      <Toggle
        label={ar ? 'الإسناد والفقاعات' : 'Isnad and bubbles'}
        checked={bubbles}
        onChange={(checked) => onChange(checked ? 'bubbles' : 'text')}
        offIcon={<FontAwesomeIcon icon={faScroll} className="size-3" />}
        onIcon={<FontAwesomeIcon icon={faComments} className="size-3" />}
      />
      <span className={label(bubbles)}>{ar ? 'الإسناد والفقاعات' : 'Isnad and bubbles'}</span>
    </div>
  );
}
