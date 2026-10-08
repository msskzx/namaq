'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faScroll } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
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
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button active={mode === 'text'} onClick={() => onChange('text')}>
        <FontAwesomeIcon icon={faScroll} />
        {ar ? 'النص كاملاً' : 'Full text'}
      </Button>
      <Button active={mode === 'bubbles'} onClick={() => onChange('bubbles')}>
        <FontAwesomeIcon icon={faComments} />
        {ar ? 'الإسناد والفقاعات' : 'Isnad and bubbles'}
      </Button>
    </div>
  );
}
