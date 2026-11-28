import generated from '../data/quran/compareCards';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { braidOf, type BraidStrand } from '../quran/braid';
import { shownCards, type PairCard, type StoredCards } from '../quran/compareCards';
import { writtenLinks } from '../quran/compareCardLook';
import { filteredAyat } from '../quran/mutashabih/browse';
import { branchInventory } from '../quran/branchInventory';
import { QUIZ_CATEGORIES } from './scopeParams';
import { likeness } from '../quran/wordMatch';
import { spoken } from './branchAnswers';
import { byDifficulty, levelOf, treeScore, type Difficulty } from './difficulty';
import { COMPARE_QUIZ, compareLabel, type CompareAsk, type CompareLine, type Tone } from './compareAnswers';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';
import { shuffle, type Random } from './random';
import { citationSource, mushafSource, uniqueSources, type QuizSource } from './sources';
import type { Citation } from '../quran/mutashabih/types';


type Asked = { card: PairCard; ask: CompareAsk; level: Difficulty; sources: QuizSource[] };
let built: { ayat: Map<string, BranchAyah>; asks: Asked[] } | undefined;

function lines(card: PairCard, strands: BraidStrand[]): [CompareLine, CompareLine] {
  const written = writtenLinks(card);
  const tones: [Tone[], Tone[]] = [[], []];
  for (const strand of strands) {
    const sides = [strand.a, strand.b];
    sides.forEach((words, side) => words.forEach((word, i) => tones[side].push(strand.kind === 'shared'
      ? likeness([word.text, sides[1 - side][i].text])
      : word.moved || (word.mark?.kind === 'exact' && word.mark.link && written.has(word.mark.link)) ? 'written' : word.mark?.kind)));
  }
  return card.sides.map((side, i) => ({ key: `${side.surah}:${side.ayat[0].number}`, words: side.ayat[0].words, tones: tones[i] })) as [CompareLine, CompareLine];
}

function blanksOf(strands: BraidStrand[], side: 0 | 1): [number, number][] {
  const blanks: [number, number][] = [];
  let at = 0;
  for (const strand of strands) {
    const words = side === 0 ? strand.a : strand.b;
    if (strand.kind === 'split' && spoken(words.map(word => word.text)).length) blanks.push([at, at + words.length]);
    at += words.length;
  }
  return blanks;
}

function index() {
  if (built) return built;
  const stored = generated as unknown as StoredCards;
  const ayat = new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));
  const words = (key: string) => ayat.get(key)?.words;
  const asks: Asked[] = [];
  const together = new Set(branchInventory({ categories: QUIZ_CATEGORIES }, null).flatMap(piece => piece.keys.flatMap(a => piece.keys.map(b => `${a}|${b}`))));
  const cited = new Map<string, Citation[]>();
  for (const piece of branchInventory({ categories: QUIZ_CATEGORIES }, null)) {
    const all = piece.group?.citations ?? [];
    for (const a of piece.keys) for (const b of piece.keys) {
      const both = all.filter(citation => citation.places.includes(a) && citation.places.includes(b));
      cited.set(`${a}|${b}`, [...cited.get(`${a}|${b}`) ?? [], ...(both.length ? both : all)]);
    }
  }
  for (const pair of stored.listed) for (const card of shownCards(stored, words, pair.a, pair.b)) {
    if (card.sides.some(side => side.ayat.length !== 1) || !together.has(`${card.sides[0].surah}:${card.sides[0].ayat[0].number}|${card.sides[1].surah}:${card.sides[1].ayat[0].number}`)) continue;
    if (card.many || card.pairs) continue;
    const strands = braidOf(card.sides);
    const [a, b] = lines(card, strands);
    const level = levelOf(treeScore([a.words, b.words]));
    const books = uniqueSources((cited.get(`${a.key}|${b.key}`) ?? []).map(citationSource));
    ([0, 1] as const).forEach(side => {
      const blanks = blanksOf(strands, side);
      const asked = side ? b : a;
      if (blanks.length) asks.push({ card, level, sources: [mushafSource(asked.key, ayat.get(asked.key)?.page), ...books], ask: { card: card.id, shown: side ? a : b, asked, blanks } });
    });
  }
  return (built = { ayat, asks });
}

function candidates(scope: ChoiceScope, random: Random): Asked[] {
  const { ayat, asks } = index();
  const inScope = filteredAyat(ayat, scope.filters, scope.range);
  const byCard = new Map<string, Asked[]>();
  for (const asked of asks) if (inScope.has(asked.ask.shown.key) && inScope.has(asked.ask.asked.key)) byCard.set(asked.card.id, [...byCard.get(asked.card.id) ?? [], asked]);
  return shuffle([...byCard.values()], random).map(ways => ways[Math.floor(random() * ways.length)]);
}

function question({ ask, sources }: Asked): ChoiceQuestion {
  return {
    key: `${COMPARE_QUIZ}:${ask.card}:${ask.asked.key}`,
    family: COMPARE_QUIZ,
    promptArabic: `أكمل ${compareLabel(ask.asked.key)} حيث تفترق عن ${compareLabel(ask.shown.key)}، وتكفي من كل فراغ كلمتاه الأوليان.`,
    choices: [],
    correctAnswer: ask.blanks.map(([from, to]) => ask.asked.words.slice(from, to).join(' ')).join(' … '),
    compare: ask,
    sources,
    evidence: { claimKeys: [] },
  };
}

export const compareQuiz: ChoiceKind = {
  id: COMPARE_QUIZ,
  name: 'قارن الموضعين',
  party: true,
  questions: (scope, difficulty, random, limit = Infinity) =>
    byDifficulty(candidates(scope, random), difficulty, asked => asked.level).slice(0, limit).map(question),
  count: scope => candidates(scope, () => 0).length,
};
