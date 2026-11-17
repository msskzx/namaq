// «قارن الموضعين» (owner, 2026-11-17): a compare card of one ayah against one ayah, asked as its matrix only (no trees):
// one ayah given whole, the other blank wherever its wording parts from it (the card's braid, shared/quran/braid.ts).
import generated from '../data/quran/compareCards';
import corpus from '../data/quran/trees.json';
import surahRows from '../data/quran/surahs.json';
import type { BranchAyah } from '../quran/branches';
import { braidOf, type BraidStrand } from '../quran/braid';
import { shownCards, type PairCard, type StoredCards } from '../quran/compareCards';
import { writtenLinks } from '../quran/compareCardLook';
import { filteredAyat } from '../quran/mutashabih/browse';
import { likeness } from '../quran/wordMatch';
import { num } from '../quran/arabicNumber';
import { spoken } from './branchAnswers';
import { byDifficulty, levelOf, treeScore, type Difficulty } from './difficulty';
import { COMPARE_QUIZ, type CompareAsk, type CompareLine, type Tone } from './compareAnswers';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';
import { shuffle, type Random } from './random';

const names = Object.fromEntries(surahRows.map(row => [row.number, row.name])) as Record<number, string>;
/** «يس ٥٣»: surah first, then ayah. */
export const compareLabel = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return `${names[surah]} ${num(ayah)}`; };

/** A card asked one way: the side given whole and the blanks on the other. */
type Asked = { card: PairCard; ask: CompareAsk; level: Difficulty };
let built: { ayat: Map<string, BranchAyah>; asks: Asked[] } | undefined;

/** Each side's words with their tones, as a compare card colours them: shared runs by their likeness, parted words by their mark. */
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

/** The word ranges of one side that part from the other: its words in each split, when they hold a spoken word. */
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

/** Built once: every card of one ayah against one ayah, asked each way that has something to ask. */
function index() {
  if (built) return built;
  const stored = generated as unknown as StoredCards;
  const ayat = new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));
  const words = (key: string) => ayat.get(key)?.words;
  const asks: Asked[] = [];
  for (const pair of stored.listed) for (const card of shownCards(stored, words, pair.a, pair.b)) {
    if (card.many || card.pairs || card.sides.some(side => side.ayat.length !== 1)) continue;
    const strands = braidOf(card.sides);
    const [a, b] = lines(card, strands);
    const level = levelOf(treeScore([a.words, b.words]));
    ([0, 1] as const).forEach(side => {
      const blanks = blanksOf(strands, side);
      if (blanks.length) asks.push({ card, level, ask: { card: card.id, shown: side ? a : b, asked: side ? b : a, blanks } });
    });
  }
  return (built = { ayat, asks });
}

/** The cards in the scope: both ayat inside it. One way per card, picked at random where both have blanks. */
function candidates(scope: ChoiceScope, random: Random): Asked[] {
  const { ayat, asks } = index();
  const inScope = filteredAyat(ayat, scope.filters, scope.range);
  const byCard = new Map<string, Asked[]>();
  for (const asked of asks) if (inScope.has(asked.ask.shown.key) && inScope.has(asked.ask.asked.key)) byCard.set(asked.card.id, [...byCard.get(asked.card.id) ?? [], asked]);
  return shuffle([...byCard.values()], random).map(ways => ways[Math.floor(random() * ways.length)]);
}

function question({ ask }: Asked): ChoiceQuestion {
  return {
    key: `${COMPARE_QUIZ}:${ask.card}:${ask.asked.key}`,
    family: COMPARE_QUIZ,
    promptArabic: `أكمل ${compareLabel(ask.asked.key)} حيث تفترق عن ${compareLabel(ask.shown.key)}، وتكفي من كل فراغ كلمتاه الأوليان.`,
    choices: [],
    // Typed questions are scored by their blanks (compareAnswers.ts); the answer names them, so a check that got every one right can give it.
    correctAnswer: ask.blanks.map(([from, to]) => ask.asked.words.slice(from, to).join(' ')).join(' … '),
    compare: ask,
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
