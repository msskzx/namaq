'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useLanguage } from '@/components/language/LanguageContext';
import translations from '@/components/language/translations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GraphNodeFull } from '@/types/graph';
import { normalizePersonSearch } from '@/lib/personSearch';
import { profilePath } from '@/lib/nodeProfile';
import { subjectId } from '@/lib/relationship/types';

interface Suggestion {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
  nameTransliterated: string | null;
  match: 'exact' | 'prefix' | 'contains';
  kind?: string;
}

// A single, coarse ranking shared with person suggestions' own 'exact' /
// 'prefix' / 'contains' match field -- fine-grained scoring doesn't matter
// here since these only ever get sorted amongst themselves, not compared
// numerically against the Postgres results.
function rankNodeMatch(query: string, node: GraphNodeFull): number | null {
  const candidates = [node.label, node.slug.replace(/-/g, ' ')]
    .map(normalizePersonSearch)
    .filter(Boolean);
  let best: number | null = null;
  for (const candidate of candidates) {
    let score: number | null = null;
    if (candidate === query) score = 0;
    else if (candidate.split(' ').includes(query)) score = 1;
    else if (candidate.startsWith(query)) score = 2;
    else if (candidate.includes(query)) score = 3;
    if (score !== null && (best === null || score < best)) best = score;
  }
  return best;
}

const MAX_NODE_MATCHES = 8;

function matchGraphNodes(rawQuery: string, nodes: GraphNodeFull[]): Suggestion[] {
  const query = normalizePersonSearch(rawQuery);
  if (!query) return [];
  return nodes
    // Person nodes are excluded here, not just de-prioritized: the Postgres
    // suggest call above already covers every person, so including them
    // again from `nodes` would just duplicate entries under a different id
    // shape.
    .filter(node => (node.type ?? 'person') !== 'person')
    .map(node => {
      const score = rankNodeMatch(query, node);
      return score === null ? null : { node, score };
    })
    .filter((result): result is { node: GraphNodeFull; score: number } => result !== null)
    .sort((a, b) => a.score - b.score || a.node.label.localeCompare(b.node.label))
    .slice(0, MAX_NODE_MATCHES)
    .map(({ node, score }): Suggestion => ({
      id: node.id,
      slug: node.slug,
      name: node.label,
      fullName: null,
      nameTransliterated: null,
      match: score === 0 ? 'exact' : score <= 2 ? 'prefix' : 'contains',
      kind: node.type ?? 'person',
    }));
}

interface GraphSearchProps {
  nodes?: GraphNodeFull[];
}

export default function GraphSearch({ nodes }: GraphSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  const t = translations[language];
  const kindLabels: Record<string, string> = useMemo(() => ({ title: t.titles, battle: t.battles.title, event: t.events }), [t]);
  const kindLabel = (kind: string) => kindLabels[kind] ?? kind;

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/people/suggest?q=${encodeURIComponent(query)}`);
      const personMatches: Suggestion[] = response.ok ? ((await response.json()).data ?? []) : [];
      const nodeMatches = matchGraphNodes(query, nodes ?? []);
      setSuggestions([...personMatches, ...nodeMatches]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nodes]);

  const debouncedFetch = useCallback((value: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
      debounceTimeout.current = null;
    }, 300);
  }, [fetchSuggestions]);

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

  const selectNode = (suggestion: Suggestion) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('selected', suggestion.slug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const addPersonRoot = (suggestion: Suggestion) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
    const rootId = subjectId('person', suggestion.slug);
    const existingRoots = params.getAll('subject');
    if (!existingRoots.includes(rootId)) params.append('subject', rootId);
    params.set('selected', suggestion.slug);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    if (suggestion.kind && suggestion.kind !== 'person') {
      selectNode(suggestion);
      return;
    }
    addPersonRoot(suggestion);
  };

  const openProfile = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    router.push(profilePath(suggestion.kind, suggestion.slug));
  };

  const onSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // If there's a matching suggestion, use it
    const exactMatch = suggestions.find(s => s.match === 'exact');

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
      <div className="flex flex-col sm:flex-row w-full sm:flex-1 gap-3 sm:gap-2">
        <div className="relative w-full">
          <div
            className={`relative min-h-[2.5rem] flex flex-wrap items-center gap-2 p-1.5 border border-amber-400 rounded bg-gray-50 dark:bg-gray-950 ${showSuggestions ? 'ring-2 ring-amber-200 dark:ring-amber-600' : ''}`}
            onClick={() => inputRef.current?.focus()}
          >
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
              placeholder={translations[language]?.search}
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
              {suggestions.map((suggestion) => (
                <li key={suggestion.id} className="px-4 py-2 text-gray-800 dark:text-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left hover:text-amber-700 dark:hover:text-amber-300"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectSuggestion(suggestion);
                      }}
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <span>{suggestion.name}</span>
                        {suggestion.kind && suggestion.kind !== 'person' && (
                          <span className="shrink-0 text-xs font-normal text-gray-500 dark:text-gray-400">{kindLabel(suggestion.kind)}</span>
                        )}
                      </div>
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
                      {language === 'ar' ? 'الصفحة الشخصية' : 'Profile'}
                    </button>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'اختر لعرض الرسم البياني' : 'Select to focus the graph'}
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
