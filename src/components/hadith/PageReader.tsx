'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';
import type { ReaderPage } from '@/lib/model/hadithView';

export default function PageReader({ pages }: { pages: ReaderPage[] }) {
  const ar = useLanguage().language === 'ar';
  const [index, setIndex] = useState(0);
  const page = pages[index];
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Button size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <FontAwesomeIcon icon={ar ? faArrowRight : faArrowLeft} />
          {ar ? 'السابقة' : 'Previous'}
        </Button>
        <span className="text-gray-700 dark:text-gray-300">
          {ar ? 'ص' : 'p.'} {page.label}
        </span>
        <Button size="sm" disabled={index === pages.length - 1} onClick={() => setIndex(index + 1)}>
          {ar ? 'التالية' : 'Next'}
          <FontAwesomeIcon icon={ar ? faArrowLeft : faArrowRight} />
        </Button>
      </div>
      <div dir="rtl" className="max-h-[32rem] overflow-y-auto rounded border border-gray-200 p-4 text-xl leading-loose whitespace-pre-line text-gray-900 dark:border-white/10 dark:text-gray-200">
        {page.parts.map((part, i) =>
          part.mark ? (
            <mark key={i} className="rounded bg-amber-200 px-1 text-gray-900 dark:bg-amber-700 dark:text-gray-100">
              {part.text}
            </mark>
          ) : (
            <span key={i}>{part.text}</span>
          ),
        )}
      </div>
    </div>
  );
}
