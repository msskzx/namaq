'use client';

import { useState } from 'react';
import surahRows from '@shared/data/quran/surahs.json';
import type { JuzRange } from '@shared/quran/juz';
import type { ScopeFilters } from '@shared/quiz/scopeParams';
import { QUIZ_CATEGORIES } from '@shared/quiz/scopeParams';
import type { RangeDraft } from '@/components/quran/RangeFilter';
import { isRangeUnit, ScopeFields, scopeRange, type FilterUnit } from '@/components/quran/ScopeFilter';
import GroupFilterControls from '@/app/quran/branches/GroupFilters';
import { SavedOnly } from '@/app/quran/branches/Filters';

export type TreeChoice = { range: JuzRange | null; filters: ScopeFilters; saved: boolean };

const allSurahs = surahRows.map(row => ({ number: row.number, name: row.name, nameEn: row.nameTransliterated }));
const PLACE_KEYS = ['surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo'] as const;

type Draft = { unit: FilterUnit; values: RangeDraft; filters: ScopeFilters; saved: boolean };

function draftOf({ range, filters, saved }: TreeChoice): Draft {
  const unit: FilterUnit = filters.surahFrom || filters.surahTo ? 'surah' : filters.pageFrom || filters.pageTo ? 'page' : filters.surahs ? 'surahs' : filters.juz ? 'juzs' : 'juz';
  const values: RangeDraft = unit === 'surah' ? [filters.surahFrom ?? '1', filters.surahTo ?? '114']
    : unit === 'page' ? [filters.pageFrom ?? '1', filters.pageTo ?? '604'] : [String(range?.from ?? 1), String(range?.to ?? 30)];
  return { unit, values, filters, saved };
}

/** The draft as a choice, as the branches filter sheet applies it; null while a typed range is not whole. */
function choiceOf(draft: Draft): TreeChoice | null {
  const next = scopeRange(draft.unit, draft.values);
  if (isRangeUnit(draft.unit) && !next) return null;
  const filters = { ...draft.filters };
  PLACE_KEYS.forEach(key => delete filters[key]);
  if (draft.unit === 'surahs') filters.surahs = draft.filters.surahs ?? '';
  else if (draft.unit === 'juzs') filters.juz = draft.filters.juz ?? '';
  else if (draft.unit !== 'juz' && next) {
    filters[draft.unit === 'surah' ? 'surahFrom' : 'pageFrom'] = String(next.from);
    filters[draft.unit === 'surah' ? 'surahTo' : 'pageTo'] = String(next.to);
  }
  const range = draft.unit === 'juz' && next && (next.from !== 1 || next.to !== 30) ? next : null;
  return { range, filters, saved: draft.saved };
}

/**
 * The branches page's filters for the quiz's trees, inline instead of in a sheet: saved only (solo), the part of the
 * Quran, and the kinds of comparison and difference. Sort means nothing for a random quiz, so it is left out.
 * Without trees in the quiz only the part of the Quran is left.
 */
export default function TreeFilters({ choice, onChange, savedOnly = true, trees = true }: { choice: TreeChoice; onChange: (choice: TreeChoice) => void; savedOnly?: boolean; trees?: boolean }) {
  const [draft, setDraftState] = useState<Draft>(() => draftOf(choice));
  const setDraft = (next: Draft) => {
    setDraftState(next);
    const picked = choiceOf(next);
    if (picked) onChange(picked);
  };
  return <div className="flex w-full min-w-0 flex-col gap-3">
    {savedOnly && trees && <SavedOnly checked={draft.saved} onChange={saved => setDraft({ ...draft, saved })} />}
    <ScopeFields range={choice.range} allSurahs={allSurahs} draft={{ unit: draft.unit, values: draft.values, surahs: draft.filters.surahs, juz: draft.filters.juz }}
      onChange={({ unit, values, surahs, juz }) => setDraft({ ...draft, unit, values, filters: { ...draft.filters, ...(surahs !== undefined ? { surahs } : {}), ...(juz !== undefined ? { juz } : {}) } })} />
    {trees && <GroupFilterControls filters={draft.filters} onChange={filters => setDraft({ ...draft, filters })} sort={false} defaultCategories={QUIZ_CATEGORIES} />}
  </div>;
}
