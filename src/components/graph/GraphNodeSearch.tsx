'use client';

import React, { useMemo, useRef, useState } from 'react';
import { GraphNodeFull } from '@/types/graph';
import { normalizePersonSearch } from '@/lib/personSearch';

interface GraphNodeSearchProps {
  // The already-fetched graph's nodes. This searches client-side over
  // whatever GraphCanvas has already loaded rather than hitting a new API
  // route -- the battles/titles/all graph endpoints always return their
  // full dataset regardless of query params, so there is nothing a
  // server-side suggest endpoint would filter that isn't already sitting
  // in memory here.
  nodes: GraphNodeFull[];
  onSelect: (node: GraphNodeFull) => void;
  placeholder?: string;
  typeLabel?: (type: string | undefined) => string;
  isArabic?: boolean;
  maxResults?: number;
}

const MAX_RESULTS_DEFAULT = 8;

function rankMatch(query: string, node: GraphNodeFull): number | null {
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

export default function GraphNodeSearch({ nodes, onSelect, placeholder, typeLabel, isArabic = false, maxResults = MAX_RESULTS_DEFAULT }: GraphNodeSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const query = normalizePersonSearch(inputValue);
    if (!query) return [];
    return nodes
      .map((node) => {
        const score = rankMatch(query, node);
        return score === null ? null : { node, score };
      })
      .filter((result): result is { node: GraphNodeFull; score: number } => result !== null)
      .sort((a, b) => a.score - b.score || a.node.label.localeCompare(b.node.label))
      .slice(0, maxResults)
      .map((result) => result.node);
  }, [nodes, inputValue, maxResults]);

  const selectNode = (node: GraphNodeFull) => {
    onSelect(node);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (matches[0]) selectNode(matches[0]);
  };

  return (
    <form onSubmit={onSubmit} className="mb-6 w-full" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="relative w-full sm:max-w-md">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded border border-amber-400 bg-gray-50 px-3 h-10 text-base text-gray-800 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-amber-400 dark:bg-gray-950 dark:text-gray-300 dark:placeholder-gray-200"
        />

        {showSuggestions && matches.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border border-amber-200 bg-white shadow-lg dark:border-amber-700 dark:bg-gray-900 max-h-60 overflow-auto">
            {matches.map((node) => (
              <li key={node.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-gray-800 hover:bg-amber-50 dark:text-gray-100 dark:hover:bg-gray-800"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectNode(node);
                  }}
                >
                  <span className="min-w-0 truncate font-medium">{node.label}</span>
                  {typeLabel && node.type && (
                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{typeLabel(node.type)}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
}
