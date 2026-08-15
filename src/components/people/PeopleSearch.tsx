import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import translations from '@/components/language/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import type { Title } from '@/generated/prisma';

interface PeopleSearchProps {
  titles: Title[];
  selectedTitle: string;
  onTitleChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  language: 'en' | 'ar';
}

interface Suggestion {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
  nameTransliterated: string | null;
  match: 'exact' | 'prefix' | 'contains';
}

export default function PeopleSearch({
  titles,
  selectedTitle,
  onTitleChange,
  search,
  onSearchChange,
  language,
}: PeopleSearchProps) {
  const isArabic = language === 'ar';
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = React.useState(search);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setInputValue(search);
  }, [search]);

  const fetchSuggestions = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/people/suggest?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching people suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback((value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
      debounceTimeout.current = null;
    }, 300);
  }, [fetchSuggestions]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
    if (value.trim()) {
      debouncedFetch(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    setShowSuggestions(false);
    onSearchChange(inputValue);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setInputValue(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearchChange(suggestion.name);
  };

  const openProfile = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    router.push(`/people/${suggestion.slug}`);
  };

  return (
    <form
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-stretch sm:items-end w-full"
      onSubmit={handleSearch}
    >
      <div className="w-full sm:w-auto">
        <select
          className="border border-amber-400 rounded px-3 h-10 text-base w-full min-w-[140px] bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
          value={selectedTitle}
          onChange={e => onTitleChange(e.target.value)}
        >
          <option value="" className="text-gray-800 dark:text-gray-950">{isArabic ? 'الكل' : 'All'}</option>
          {titles.map((title) => (
            <option key={title.id} value={title.slug} className="text-gray-800 dark:text-gray-950">
              {isArabic ? title.name : title.nameTransliterated}
            </option>
          ))}
        </select>
      </div>
      {/* Input and button: stacked on mobile, inline on sm+ */}
      <div className="flex flex-col sm:flex-row w-full sm:flex-1 gap-3 sm:gap-2">
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            className="border border-amber-400 rounded px-3 h-10 text-base w-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-amber-400 focus:border-amber-400 focus:ring-amber-400 dark:focus:border-amber-400 dark:focus:ring-amber-400 placeholder:text-gray-500 dark:placeholder-amber-200 focus-visible:outline-amber-400 dark:focus-visible:outline-amber-400"
            placeholder={translations[language]?.search}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          {isLoading && (
            <div className="absolute inset-y-0 end-3 flex items-center">
              <FontAwesomeIcon icon={faSpinner} spin className="text-amber-500" />
            </div>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id} className="px-4 py-2 text-gray-800 dark:text-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left rtl:text-right hover:text-amber-700 dark:hover:text-amber-300"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(suggestion);
                      }}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      {suggestion.nameTransliterated && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
                          {suggestion.nameTransliterated}
                        </div>
                      )}
                      {suggestion.fullName && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
                          {suggestion.fullName}
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      className="shrink-0 rounded border border-amber-400 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-gray-800"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        openProfile(suggestion);
                      }}
                    >
                      {translations[language]?.viewProfile}
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {translations[language]?.selectToSearch}
                  </div>
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
