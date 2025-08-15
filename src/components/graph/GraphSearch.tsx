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
  const [selectedPeople, setSelectedPeople] = useState<Suggestion[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (inputValue.trim()) {
      debouncedFetch(inputValue);
    } else {
      setSuggestions([]);
    }
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue, debouncedFetch]);

  // Initialize from URL on component mount
  React.useEffect(() => {
    if (!searchParams) return;

    const existingPerson = searchParams.get('person');
    const existingAncestorsList = searchParams.getAll('ancestorsOf');
    const currentMode = existingPerson ? 'person' : existingAncestorsList.length ? 'ancestorsOf' : mode;

    // Only update if there's a change in URL params
    const shouldUpdate =
      (existingPerson && selectedPeople[0]?.slug !== existingPerson) ||
      (existingAncestorsList.length > 0 && (
        selectedPeople.length !== existingAncestorsList.length ||
        !selectedPeople.every((p, i) => p.slug === existingAncestorsList[i])
      ));

    if (!shouldUpdate) return;

    setMode(currentMode);

    if (existingPerson) {
      // Only fetch if we don't already have this person selected
      if (selectedPeople[0]?.slug !== existingPerson) {
        fetch(`/api/people/suggest?q=${encodeURIComponent(existingPerson)}`)
          .then(res => res.json())
          .then(data => {
            if (data.data?.[0]?.slug === existingPerson) {
              setSelectedPeople([data.data[0]]);
            }
          });
      }
    } else if (existingAncestorsList.length > 0) {
      // Only fetch if the lists are different
      if (selectedPeople.length !== existingAncestorsList.length ||
        !selectedPeople.every((p, i) => p.slug === existingAncestorsList[i])) {
        Promise.all(
          existingAncestorsList.map(slug =>
            fetch(`/api/people/suggest?q=${encodeURIComponent(slug)}`)
              .then(res => res.json())
              .then(data => data.data?.find((p: Suggestion) => p.slug === slug))
          )
        ).then(people => {
          setSelectedPeople(people.filter(Boolean));
        });
      }
    } else {
      // Clear selection if no params
      setSelectedPeople([]);
    }
  }, [searchParams, mode, selectedPeople]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    // Add to selected people if not already selected
    if (!selectedPeople.some(p => p.id === suggestion.id)) {
      // TODO why do you have to go through the whole list add a new person
      setSelectedPeople(prev => [...prev, suggestion]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removePerson = (id: string) => {
    // why do you have to build the list again when you can just remove the person
    setSelectedPeople(prev => prev.filter(p => p.id !== id));
  };

  // Update URL when selectedPeople or mode changes
  useEffect(() => {
    if (!searchParams) return;

    const params = new URLSearchParams();

    if (mode === 'person' && selectedPeople.length > 0) {
      const lastPerson = selectedPeople[selectedPeople.length - 1];
      if (lastPerson?.slug) {
        params.set('person', lastPerson.slug);
      }
    } else if (mode === 'ancestorsOf' && selectedPeople.length > 0) {
      selectedPeople.forEach(person => {
        if (person?.slug) {
          params.append('ancestorsOf', person.slug);
        }
      });
    }

    const newSearch = params.toString();
    const currentSearch = searchParams.toString();

    // Only update if there's an actual change and we're not in the middle of an update
    if (newSearch !== currentSearch) {
      router.replace(`${pathname}${newSearch ? `?${newSearch}` : ''}`);
    }
  }, [selectedPeople, mode, searchParams, pathname, router]);

  const onSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // If there's a matching suggestion, use it
    const exactMatch = suggestions.find(
      s => s.name.toLowerCase() === inputValue.trim().toLowerCase()
    );

    if (exactMatch) {
      handleSelectSuggestion(exactMatch);
      return;
    }
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
          <div
            className={`relative min-h-[2.5rem] flex flex-wrap items-center gap-2 p-1.5 border border-amber-400 rounded bg-gray-50 dark:bg-gray-950 ${showSuggestions ? 'ring-2 ring-amber-200 dark:ring-amber-600' : ''}`}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Selected People Pills */}
            {selectedPeople.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-full"
              >
                <span>{person.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePerson(person.id);
                  }}
                  className="ml-1 text-amber-600 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-100"
                  aria-label={`Remove ${person.name}`}
                >
                  &times;
                </button>
              </div>
            ))}

            {/* Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                setShowSuggestions(true);
                if (value.trim()) {
                  debouncedFetch(value);
                } else {
                  setSuggestions([]);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !inputValue && selectedPeople.length > 0) {
                  // Remove last person on backspace when input is empty
                  const lastPerson = selectedPeople[selectedPeople.length - 1];
                  removePerson(lastPerson.id);
                }
              }}
              placeholder={
                selectedPeople.length === 0
                  ? (mode === 'ancestorsOf'
                    ? (language === 'ar' ? 'ابحث عن الأشخاص' : 'Search for people')
                    : translations[language]?.search)
                  : ''
              }
              className="flex-1 min-w-[100px] bg-transparent border-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-200"
            />

            {/* TODO Loading Spinner should show in the dropdown not in the input */}
            {isLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <FontAwesomeIcon icon={faSpinner} spin className="text-amber-500" />
              </div>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions
                .filter(suggestion => !selectedPeople.some(p => p.id === suggestion.id))
                .map((suggestion) => (
                  <li
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-amber-50 dark:hover:bg-gray-800 cursor-pointer text-gray-800 dark:text-gray-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(suggestion);
                    }}
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    {suggestion.fullName && (
                      <div className="text-sm text-gray-500 dark:text-gray-300 truncate">
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