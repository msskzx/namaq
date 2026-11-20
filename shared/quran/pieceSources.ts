// A look-alike pair's, a tree's or a prophet's story's sources, for its home card's source line (owner, 2026-11-20: every card has one).
import corpus from './quranText/corpus';
import type { BranchAyah } from './branches';
import { evidenceGroup } from './mutashabih/evidence';
import type { Group } from './mutashabih/types';
import { citationSource, mushafSource, MUSHAF_BOOK, type QuizSource } from '../quiz/sources';
import { SURAH_NAMES } from './surahNames';
import { num } from './arabicNumber';

let pages: Map<string, number> | undefined;
const pageOf = (key: string) => (pages ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.page]))).get(key);

/** The mushaf at each of its ayat, then the mutashabih books that set them side by side. */
export const pieceSources = (keys: string[], group?: Group): QuizSource[] =>
  [...keys.map(key => mushafSource(key, pageOf(key))), ...(group ? evidenceGroup(group, keys).citations.map(citationSource) : [])];

/** A prophet's story card's source: the mushaf at the ayat of the group it shows («المصحف · البقرة ٣٠–٣٩، …»). */
export const storySource = (events: { phase: number; segments: { surah: number; range: readonly [number, number] }[] }[], phase: number): QuizSource => ({
  book: MUSHAF_BOOK,
  at: [...new Set(events.filter(event => event.phase === phase).flatMap(event => event.segments.map(({ surah, range: [lo, hi] }) => `${SURAH_NAMES[surah]} ${num(lo)}${hi > lo ? `–${num(hi)}` : ''}`)))].join('، '),
});
