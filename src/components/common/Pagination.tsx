'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import NumberInput from './NumberInput';
import { useLanguage } from '@/components/language/LanguageContext';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange?: (page: number) => void;
  hrefs?: string[];
  language?: 'ar' | 'en';
  showSelect?: boolean;
  summary?: string;
  selectLabel?: string;
  pageLabels?: string[];
}

export default function Pagination({
  page,
  pageCount,
  onChange,
  showSelect = false,
  summary,
  selectLabel,
  pageLabels,
  hrefs,
  language: pageLanguage,
}: PaginationProps) {
  const { language: siteLanguage } = useLanguage();
  const language = pageLanguage ?? siteLanguage;

  if (pageCount <= 1) return null;

  const rightToLeft = language === 'ar';
  const backIcon = rightToLeft ? faArrowRight : faArrowLeft;
  const forwardIcon = rightToLeft ? faArrowLeft : faArrowRight;
  const step = (target: number, disabled: boolean) =>
    hrefs && !disabled ? { href: hrefs[target - 1] } : { disabled, onClick: () => onChange?.(target) };
  const label = summary ?? (rightToLeft ? `صفحة ${page} من ${pageCount}` : `Page ${page} of ${pageCount}`);

  return (
    <nav
      aria-label={rightToLeft ? 'التنقل بين الصفحات' : 'Pagination'}
      className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-gray-200 pt-3 dark:border-gray-700"
    >
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        {...step(page - 1, page <= 1)}
      >
        <FontAwesomeIcon icon={backIcon} className="w-3 h-3" />
        {rightToLeft ? 'السابق' : 'Previous'}
      </Button>

      {showSelect ? (
        <span className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          {selectLabel}
          {pageLabels ? (
            <select
              aria-label={selectLabel ?? (rightToLeft ? 'انتقل إلى صفحة' : 'Go to page')}
              className="cursor-pointer appearance-none rounded border border-amber-400 bg-transparent px-2.5 py-1 text-center text-xs text-gray-800 transition hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800"
              value={page}
              onChange={(changed) => onChange?.(Number(changed.target.value))}
            >
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((option) => (
                <option key={option} value={option}>
                  {pageLabels?.[option - 1] ?? option}
                </option>
              ))}
            </select>
          ) : (
            <NumberInput label={selectLabel ?? (rightToLeft ? 'انتقل إلى صفحة' : 'Go to page')} value={page} min={1} max={pageCount} onChange={onChange} />
          )}
        </span>
      ) : (
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}

      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        {...step(page + 1, page >= pageCount)}
      >
        {rightToLeft ? 'التالي' : 'Next'}
        <FontAwesomeIcon icon={forwardIcon} className="w-3 h-3" />
      </Button>
    </nav>
  );
}
