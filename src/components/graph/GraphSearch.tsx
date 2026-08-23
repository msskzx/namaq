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

interface Suggestion {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
  nameTransliterated: string | null;
  match: 'exact' | 'prefix' | 'contains';
  // Node kind: 'person' (or absent, for the Postgres-backed suggestions
  // below) selects/scopes a person the way this component always has.
  // Any other kind (title/battle/event) comes from `nodes` instead -- a
  // client-side match against the graph already loaded, since the
  // Postgres-backed suggest endpoint only ever covers people. Picking one
  // just selects/centers it (see selectNode); it can't be an ancestry root.
  kind?: string;
}

type SearchMode = 'person' | 'ancestorsOf' | 'descendantsOf';

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
  // Non-person nodes (title/battle/event) from the graph GraphCanvas has
  // already fetched, so Relations-mode search can jump straight to them
  // too -- the Postgres-backed suggest endpoint only ever covers people.
  // Omit when there's nothing else worth searching (e.g. a person-only
  // embed): the component still works as a person-only search either way.
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

  const [mode, setMode] = React.useState<SearchMode>('person');
  const [inputValue, setInputValue] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<Suggestion[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Depends on mode/nodes -- both feed into what a search actually matches
  // against (see below), so this must be recreated whenever either changes,
  // not captured once. debouncedFetch below re-derives from this same
  // dependency, or it would keep calling a stale closure that never saw a
  // later mode switch or a since-loaded graph.
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/people/suggest?q=${encodeURIComponent(query)}`);
      const personMatches: Suggestion[] = response.ok ? ((await response.json()).data ?? []) : [];
      // Ancestors/Descendants only ever make sense rooted at a person, so
      // only Relations mode also offers non-person nodes.
      const nodeMatches = mode === 'person' ? matchGraphNodes(query, nodes ?? []) : [];
      setSuggestions([...personMatches, ...nodeMatches]);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [mode, nodes]);

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

  // Latest local state, readable without making the URL-sync effect below
  // re-run every time local state (rather than the URL) changes.
  const selectedPeopleRef = useRef(selectedPeople);
  selectedPeopleRef.current = selectedPeople;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // True while the effect below is resolving a person/ancestorsOf slug from
  // the URL into a Suggestion via an async lookup. The write-back effect
  // must not treat "selectedPeople is still empty" as "user cleared the
  // selection" during this window, or it strips the param the lookup is
  // trying to resolve before the lookup ever gets a chance to finish.
  const isHydratingRef = useRef(false);

  // Sync from URL whenever the URL itself changes. Must not depend on
  // selectedPeople/mode: those are also written *to* the URL by the effect
  // below, and depending on them here caused the two effects to fight over
  // stale reads of each other's output, flapping the `person` param.
  React.useEffect(() => {
    if (!searchParams) return;

    // Dev-only React Strict Mode double-mounts this effect: a phantom
    // instance kicks off its own person/ancestor lookup fetch, then the
    // cleanup below marks it stale before its promise resolves. Without this
    // guard, that phantom fetch would still land on the real instance's
    // setSelectedPeople and immediately clear the just-resolved person.
    let ignore = false;

    const selectedPeople = selectedPeopleRef.current;
    const mode = modeRef.current;

    const existingPerson = searchParams.get('person');
    const existingAncestorsList = searchParams.getAll('ancestorsOf');
    const existingDescendantsList = searchParams.getAll('descendantsOf');
    // ancestorsOf/descendantsOf share the same "list of slugs" URL shape, so
    // whichever one is actually present in the URL drives both the mode and
    // which list gets compared/fetched below.
    const existingListMode = existingAncestorsList.length ? 'ancestorsOf' : existingDescendantsList.length ? 'descendantsOf' : null;
    const existingList = existingListMode === 'ancestorsOf' ? existingAncestorsList : existingDescendantsList;
    const currentMode = existingPerson ? 'person' : existingListMode ?? mode;

    // Only update if there's a change in URL params
    const shouldUpdate =
      (existingPerson && selectedPeople[0]?.slug !== existingPerson) ||
      (existingList.length > 0 && (
        selectedPeople.length !== existingList.length ||
        !selectedPeople.every((p, i) => p.slug === existingList[i])
      )) ||
      (!existingPerson && existingList.length === 0 && selectedPeople.length > 0);

    if (!shouldUpdate) return;

    setMode(currentMode);

    if (existingPerson) {
      // Only fetch if we don't already have this person selected
      if (selectedPeople[0]?.slug !== existingPerson) {
        isHydratingRef.current = true;
        fetch(`/api/people/suggest?q=${encodeURIComponent(existingPerson)}`)
          .then(res => res.json())
          .then(data => {
            if (ignore) return;
            isHydratingRef.current = false;
            if (data.data?.[0]?.slug === existingPerson) {
              setSelectedPeople([data.data[0]]);
            }
          });
      }
    } else if (existingList.length > 0) {
      // Only fetch if the lists are different
      if (selectedPeople.length !== existingList.length ||
        !selectedPeople.every((p, i) => p.slug === existingList[i])) {
        isHydratingRef.current = true;
        Promise.all(
          existingList.map(slug =>
            fetch(`/api/people/suggest?q=${encodeURIComponent(slug)}`)
              .then(res => res.json())
              .then(data => data.data?.find((p: Suggestion) => p.slug === slug))
          )
        ).then(people => {
          if (ignore) return;
          isHydratingRef.current = false;
          setSelectedPeople(people.filter(Boolean));
        });
      }
    } else {
      // Clear selection if no params
      setSelectedPeople([]);
    }

    return () => {
      ignore = true;
      isHydratingRef.current = false;
    };
  }, [searchParams]);

  // A non-person match (title/battle/event) isn't an ancestry root or a
  // relation-search subject -- there's nothing to add a pill for or scope a
  // fetch to. It just selects/centers that node directly, the same `selected`
  // URL param GraphCanvas's own node clicks and side-list entries already use.
  const selectNode = (suggestion: Suggestion) => {
    if (!searchParams) return;
    const params = new URLSearchParams(searchParams.toString());
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

  const openProfile = (suggestion: Suggestion) => {
    setShowSuggestions(false);
    router.push(profilePath(suggestion.kind, suggestion.slug));
  };

  // Update URL when selectedPeople or mode changes
  useEffect(() => {
    if (!searchParams) return;
    // A URL-driven lookup is still resolving; don't strip its param out from
    // under it just because selectedPeople hasn't caught up yet.
    if (isHydratingRef.current) return;

    // Keep graph-view state (selected person, relationship filters, focused
    // neighbourhood) intact when the relation search changes.
    const params = new URLSearchParams(searchParams.toString());
    params.delete('person');
    params.delete('ancestorsOf');
    params.delete('descendantsOf');

    if (mode === 'person' && selectedPeople.length > 0) {
      const lastPerson = selectedPeople[selectedPeople.length - 1];
      if (lastPerson?.slug) {
        params.set('person', lastPerson.slug);
      }
    } else if ((mode === 'ancestorsOf' || mode === 'descendantsOf') && selectedPeople.length > 0) {
      selectedPeople.forEach(person => {
        if (person?.slug) {
          params.append(mode, person.slug);
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
          <option value="descendantsOf" className="text-gray-800 dark:text-gray-950">
            {isArabic ? 'الذرية' : 'Descendants'}
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
                  ? (mode !== 'person'
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
