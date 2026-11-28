import corpus from './quranText/corpus';
import type { BranchAyah } from './branches';
import { evidenceGroup } from './mutashabih/evidence';
import type { Group } from './mutashabih/types';
import { citationSource, mushafSource, MUSHAF_BOOK, type QuizSource } from '../quiz/sources';
import { SURAH_NAMES } from './surahNames';
import { num } from './arabicNumber';
import { tanasubLink, tanasubSource } from './tanasubCards';

let pages: Map<string, number> | undefined;
const pageOf = (key: string) => (pages ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.page]))).get(key);

export const pieceSources = (keys: string[], group?: Group): QuizSource[] => {
  const link = group?.tanasub ? tanasubLink(group.tanasub) : undefined;
  return [...keys.map(key => mushafSource(key, pageOf(key))), ...(group ? evidenceGroup(group, keys).citations.map(citationSource) : []), ...(link ? [tanasubSource(link)] : [])];
};

export const storySource = (events: { phase: number; segments: { surah: number; range: readonly [number, number] }[] }[], phase: number): QuizSource => ({
  book: MUSHAF_BOOK,
  at: [...new Set(events.filter(event => event.phase === phase).flatMap(event => event.segments.map(({ surah, range: [lo, hi] }) => `${SURAH_NAMES[surah]} ${num(lo)}${hi > lo ? `–${num(hi)}` : ''}`)))].join('، '),
});
