'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Suggestion {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
}

type SearchMode = 'person' | 'ancestorsOf';

export default function GraphSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  const [mode, setMode] = React.useState<SearchMode>('person');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const debouncedFetch = useCallback((value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
      debounceTimeout.current = null;
    }, 300);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/people/suggest?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch suggestions when input changes
  useEffect(() => {
    debouncedFetch(inputValue);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue, debouncedFetch]);

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

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.name);
    setShowSuggestions(false);

    // Use the slug for navigation
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (mode === 'person') {
      params.set('person', suggestion.slug);
    } else {
      const existing = new Set<string>(params.getAll('ancestorsOf'));
      existing.add(suggestion.slug);
      params.delete('ancestorsOf');
      for (const v of existing) params.append('ancestorsOf', v);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const onSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // If there's a matching suggestion, use its slug
    const exactMatch = suggestions.find(
      s => s.name.toLowerCase() === inputValue.trim().toLowerCase()
    );

    if (exactMatch) {
      handleSelectSuggestion(exactMatch);
      return;
    }

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
        <div className="relative w-full">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                setShowSuggestions(true);
                debouncedFetch(value);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={
                mode === 'ancestorsOf'
                  ? (language === 'ar' ? 'ابحث (أكثر من قيمة مفصولة بفواصل أو مسافات)' : 'Search (multiple, comma/space-separated)')
                  : translations[language]?.search
              }
              className="border border-amber-400 rounded px-3 h-10 text-base w-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 dark:focus:border-amber-400 dark:focus:ring-amber-400 placeholder:text-gray-500 dark:placeholder-amber-200 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
            />
            {isLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <FontAwesomeIcon icon={faSpinner} spin className="text-amber-500" />
              </div>
            )}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-gray-800 cursor-pointer text-gray-800 dark:text-amber-100"
                  onMouseDown={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="font-medium">{suggestion.name}</div>

                  {suggestion.fullName && (
                    <div className="text-sm text-gray-500 dark:text-amber-300 truncate">
                      {suggestion.fullName}
                    </div>
                  )}
                  {suggestion.slug && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {suggestion.slug}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
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