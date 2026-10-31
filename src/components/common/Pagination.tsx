'use client';

import React, { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  scrollTarget?: string;
  iconFamily?: 'fontawesome' | 'lucide';
  iconOnly?: boolean;
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
  scrollTarget,
  language: pageLanguage,
  iconOnly = false,
}: PaginationProps) {
  const { language: siteLanguage } = useLanguage();
  const language = pageLanguage ?? siteLanguage;

  const previousPage = useRef(page);
  useEffect(() => {
    if (previousPage.current !== page && scrollTarget) document.getElementById(scrollTarget)?.scrollIntoView({ block: 'start' });
    previousPage.current = page;
  }, [page, scrollTarget]);

  if (pageCount <= 1) return null;

  const rightToLeft = language === 'ar';
  const BackArrow = rightToLeft ? ArrowRight : ArrowLeft;
  const ForwardArrow = rightToLeft ? ArrowLeft : ArrowRight;
  const step = (target: number, disabled: boolean) =>
    hrefs && !disabled ? { href: hrefs[target - 1] } : { disabled, onClick: () => onChange?.(target) };
  const label = summary ?? (rightToLeft ? `صفحة ${page} من ${pageCount}` : `Page ${page} of ${pageCount}`);

  return (
    <nav
      aria-label={rightToLeft ? 'التنقل بين الصفحات' : 'Pagination'}
      className="mt-4 flex flex-wrap items-center justify-center gap-3 border-t border-[var(--home-rule)] pt-3"
    >
      <Button
        variant="outline"
        size={iconOnly ? 'lg' : 'sm'}
        className="shrink-0"
        {...(iconOnly ? { 'aria-label': rightToLeft ? 'السابق' : 'Previous', title: rightToLeft ? 'السابق' : 'Previous' } : {})}
        {...step(page - 1, page <= 1)}
      >
        <BackArrow className={iconOnly ? undefined : 'size-3'} aria-hidden />
        {!iconOnly && (rightToLeft ? 'السابق' : 'Previous')}
      </Button>

      {showSelect ? (
        <span className="flex items-center gap-2 text-xs text-[var(--home-ink)]">
          {selectLabel}
          {pageLabels ? (
            <select
              aria-label={selectLabel ?? (rightToLeft ? 'انتقل إلى صفحة' : 'Go to page')}
              className="cursor-pointer appearance-none rounded border border-[var(--home-rule)] bg-transparent px-2.5 py-1 text-center text-xs text-[var(--home-ink)] transition hover:bg-[var(--home-paper-deep)]"
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
        <span className="text-sm text-[var(--home-ink)]">{label}</span>
      )}

      <Button
        variant="outline"
        size={iconOnly ? 'lg' : 'sm'}
        className="shrink-0"
        {...(iconOnly ? { 'aria-label': rightToLeft ? 'التالي' : 'Next', title: rightToLeft ? 'التالي' : 'Next' } : {})}
        {...step(page + 1, page >= pageCount)}
      >
        {!iconOnly && (rightToLeft ? 'التالي' : 'Next')}
        <ForwardArrow className={iconOnly ? undefined : 'size-3'} aria-hidden />
      </Button>
    </nav>
  );
}
