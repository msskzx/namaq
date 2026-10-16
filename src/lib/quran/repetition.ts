// docs/plans/quran-repetition-merge.md
import { ayahWords, bareWord } from './normalize';
import { findPassages, type Passage } from './passages';
import { groupPassages, type PassageGroup } from './passageGroups';
import { findPhrases, type Occ } from './shifts';

export type RepetitionInput = { number: number; name: string; ayat: string[] }[];
export type Repetition = {
  surahs: { number: number; name: string; ayat: number; words: number }[];
  cells: { a: number; b: number; words: number; phrases: number }[];
  within: { surah: number; text: string; len: number; at: Occ[] }[];
  across: PassageGroup[];
  passages: Passage[];
  ayat: Record<string, string>;
  words: [word: string, count: number][];
};

const surahWords = (s: RepetitionInput[number]) => s.ayat.map((text, k) => ayahWords(text, k === 0 && s.number !== 1 && s.number !== 9));

export function countWords(surahs: RepetitionInput): Repetition['words'] {
  const counts = new Map<string, number>();
  for (const word of surahs.flatMap(s => surahWords(s).flatMap(a => a.display.map(bareWord)))) counts.set(word, (counts.get(word) ?? 0) + 1);
  return [...counts].sort((p, q) => q[1] - p[1] || p[0].localeCompare(q[0], 'ar'));
}

export function buildRepetition(surahs: RepetitionInput): Repetition {
  const cells = new Map<string, { a: number; b: number; words: number; phrases: number }>();
  const bump = (a: number, b: number, n: number) => {
    const cell = cells.get(`${a}:${b}`) ?? { a, b, words: 0, phrases: 0 };
    cell.words += n;
    cell.phrases++;
    cells.set(`${a}:${b}`, cell);
  };
  const shown: Record<string, string> = {};
  const show = (s: RepetitionInput[number], ayah: number) => {
    shown[`${s.number}:${ayah}`] = ayahWords(s.ayat[ayah - 1], ayah === 1 && s.number !== 1 && s.number !== 9).display.join(' ');
  };

  const within = surahs.flatMap(s =>
    findPhrases(surahWords(s)).map(p => {
      bump(s.number, s.number, p.len * (p.at.length - 1));
      p.at.forEach(o => show(s, o.ayah));
      return { surah: s.number, ...p };
    }),
  );

  const passages = findPassages(surahs.flatMap(s => s.ayat.map((text, k) => ({ surah: s.number, ayah: k + 1, text }))));
  const byNumber = new Map(surahs.map(s => [s.number, s]));
  for (const p of passages) {
    bump(Math.min(p.a.from.surah, p.b.from.surah), Math.max(p.a.from.surah, p.b.from.surah), p.matched);
    for (const side of [p.a, p.b]) {
      const s = byNumber.get(side.from.surah)!;
      for (let ayah = side.from.ayah; ayah <= side.to.ayah; ayah++) show(s, ayah);
    }
  }

  const diagonal = new Map([...cells.values()].filter(c => c.a === c.b).map(c => [c.a, c.words]));
  return {
    surahs: surahs.map(s => ({ number: s.number, name: s.name, ayat: s.ayat.length, words: diagonal.get(s.number) ?? 0 })),
    cells: [...cells.values()].filter(c => c.words > 0).sort((p, q) => p.a - q.a || p.b - q.b),
    within,
    across: groupPassages(passages),
    passages,
    ayat: shown,
    words: countWords(surahs),
  };
}
