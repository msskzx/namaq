'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { useLanguage } from '@/components/language/LanguageContext';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Offers a jump to any page. Useful when pages are addressable, as printed pages are. */
  showSelect?: boolean;
  /** What is on screen, such as a range of items. Replaces the default page count. */
  summary?: string;
  /** Visible text beside the jump control. Without it the control is still named, just not labelled on screen. */
  selectLabel?: string;
}

/**
 * Moves through a paged list: previous on the leading side, next on the
 * trailing side, what you are looking at between them. The arrows swap with the
 * writing direction so each keeps pointing the way the reader is travelling.
 */
export default function Pagination({
  page,
  pageCount,
  onChange,
  showSelect = false,
  summary,
  selectLabel,
}: PaginationProps) {
  const { language } = useLanguage();

  if (pageCount <= 1) return null;

  const rightToLeft = language === 'ar';
  const backIcon = rightToLeft ? faArrowRight : faArrowLeft;
  const forwardIcon = rightToLeft ? faArrowLeft : faArrowRight;
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
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <FontAwesomeIcon icon={backIcon} className="w-3 h-3" />
        {rightToLeft ? 'السابق' : 'Previous'}
      </Button>

      {showSelect ? (
        <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          {selectLabel}
          {/* Matches the outline button beside it: same border, padding and type
              size, with the platform's own control chrome removed so the three
              sit at one height. */}
          <select
            aria-label={selectLabel ?? (rightToLeft ? 'انتقل إلى صفحة' : 'Go to page')}
            className="cursor-pointer appearance-none rounded border border-amber-400 bg-transparent px-2.5 py-1 text-center text-xs text-gray-800 transition hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800"
            value={page}
            onChange={(changed) => onChange(Number(changed.target.value))}
          >
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      )}

      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        {rightToLeft ? 'التالي' : 'Next'}
        <FontAwesomeIcon icon={forwardIcon} className="w-3 h-3" />
      </Button>
    </nav>
  );
}
