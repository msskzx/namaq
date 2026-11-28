import type { ManyOption, PairCard } from './compareCards';
import { normalizeWord } from './normalize';

export type ReadStep = { side: 0 | 1; ayah: number; word: number; link?: string; option?: number; last: boolean };

export function isRefrain(options: ManyOption[]) {
  const text = (item: ManyOption) => item.ayah.words.map(normalizeWord).join(' ');
  return options.every(item => text(item) === text(options[0]));
}

export function readPlan(card: PairCard): ReadStep[] {
  const words = (side: 0 | 1, ayah: { number: number; words: string[]; marks?: Record<number, { link?: string }> }, option?: number) =>
    ayah.words.map((_, word): ReadStep => ({ side, ayah: ayah.number, word, link: ayah.marks?.[word]?.link, ...(option === undefined ? {} : { option }), last: word === ayah.words.length - 1 }));
  if (!card.many) return card.sides[0].ayat.flatMap(ayah => words(0, ayah));
  const many = card.many.side;
  const shared = (1 - many) as 0 | 1;
  return [
    ...words(shared, card.many.options[0].shared, 0),
    ...(isRefrain(card.many.options) ? card.many.options.slice(0, 1) : card.many.options).flatMap((option, i) => words(many, option.ayah, i)),
  ];
}

export const ayahStarts = (plan: ReadStep[]) => plan.flatMap((step, i) => (i === 0 || plan[i - 1].last ? [i] : []));

export const READ_SPEEDS = [1, 1.5, 2, 0.5];
const WORD = 760;
const MATCH = 1300;
const AYAH_END = 1800;
export const stepTime = (step: ReadStep, speed: number) => ((step.link ? MATCH : WORD) + (step.last ? AYAH_END : 0)) / speed;
