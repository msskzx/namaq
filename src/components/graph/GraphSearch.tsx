'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

type SearchMode = 'person' | 'ancestorsOf';

export default function GraphSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [mode, setMode] = React.useState<SearchMode>('person');
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    // Pre-fill from URL when possible
    if (!searchParams) return;
    const existingPerson = searchParams.get('person') || '';
    const existingAncestorsList = searchParams.getAll('ancestorsOf');
    const existingAncestors = existingAncestorsList.join(', ');
    if (existingPerson) {
      setMode('person');
      setInputValue(existingPerson);
    } else if (existingAncestors) {
      setMode('ancestorsOf');
      setInputValue(existingAncestors);
    }
  }, [searchParams]);

  const onSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const params = new URLSearchParams(searchParams?.toString() || '');
    if (mode === 'person') {
      params.set('person', inputValue.trim());
      // optional: do not remove existing ancestorsOf; `person` will take precedence server-side
    } else {
      // ancestorsOf supports multiple values; accept comma/whitespace separated list
      const pieces = inputValue
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (pieces.length === 0) return;

      // Merge with existing values and dedupe
      const existing = new Set<string>(params.getAll('ancestorsOf'));
      for (const p of pieces) existing.add(p);
      params.delete('ancestorsOf');
      for (const v of existing) params.append('ancestorsOf', v);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-stretch sm:items-end w-full"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Mode selector */}
      <div className="w-full sm:w-auto">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as SearchMode)}
          className="border border-amber-400 rounded px-3 h-10 text-base w-full min-w-[160px] bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
        >
          <option value="person" className="text-gray-800 dark:text-gray-950">
            {isArabic ? 'علاقات' : 'Relations'}
          </option>
          <option value="ancestorsOf" className="text-gray-800 dark:text-gray-950">
            {isArabic ? 'نسب' : 'Ancestors'}
          </option>
        </select>
      </div>

      {/* Input and button */}
      <div className="flex flex-col sm:flex-row w-full sm:flex-1 gap-3 sm:gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            mode === 'ancestorsOf'
              ? (language === 'ar' ? 'ابحث (أكثر من قيمة مفصولة بفواصل أو مسافات)' : 'Search (multiple, comma/space-separated)')
              : translations[language]?.search
          }
          className="border border-amber-400 rounded px-3 h-10 text-base w-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 dark:focus:border-amber-400 dark:focus:ring-amber-400 placeholder:text-gray-500 dark:placeholder-amber-200 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
        />
        <button
          type="submit"
          className="bg-amber-400 hover:bg-amber-300 text-gray-950 rounded flex items-center justify-center h-10 w-full sm:w-10 border border-amber-400 transition-colors"
          aria-label={translations[language]?.search}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </form>
  );
}