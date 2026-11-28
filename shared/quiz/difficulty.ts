import { normalizeWord } from '../quran/normalize';
import type { QuizTopic } from './settings';

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];
export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
export const DIFFICULTY_NAMES: Record<Difficulty, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

export const parseDifficulty = (value: unknown): Difficulty => DIFFICULTIES.includes(value as Difficulty) ? value as Difficulty : DEFAULT_DIFFICULTY;

const PER_AYAH = 0.05;
const EASY_BELOW = 0.308;
export const HARD_FROM = 0.468;

function common(a: string[], b: string[]) {
  let row = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) {
    const next = new Array(b.length + 1).fill(0);
    for (let j = 1; j <= b.length; j++) next[j] = a[i - 1] === b[j - 1] ? row[j - 1] + 1 : Math.max(row[j], next[j - 1]);
    row = next;
  }
  return row[b.length];
}

export const wordShare = (a: string[], b: string[]) => common(a.map(normalizeWord), b.map(normalizeWord)) / Math.max(a.length, b.length, 1);

export function treeScore(ayat: string[][]): number {
  const words = ayat.map(ayah => ayah.map(normalizeWord));
  let sum = 0, pairs = 0;
  for (let i = 0; i < words.length; i++) for (let j = i + 1; j < words.length; j++) {
    sum += common(words[i], words[j]) / Math.max(words[i].length, words[j].length, 1);
    pairs++;
  }
  return (pairs ? sum / pairs : 0) + PER_AYAH * Math.max(0, ayat.length - 2);
}

export const levelOf = (score: number): Difficulty => score < EASY_BELOW ? 'easy' : score >= HARD_FROM ? 'hard' : 'medium';

const distance = (a: Difficulty, b: Difficulty) => Math.abs(DIFFICULTIES.indexOf(a) - DIFFICULTIES.indexOf(b));

export function byDifficulty<T>(items: T[], difficulty: Difficulty, level: (item: T) => Difficulty): T[] {
  const levels = new Map(items.map(item => [item, distance(level(item), difficulty)]));
  return [0, 1, 2].flatMap(far => items.filter(item => levels.get(item) === far));
}

export const DIFFICULTY_NOTES: Partial<Record<QuizTopic, { en: string; ar: string }>> = {
  BRANCHES: {
    ar: 'الأشجار، سهل: آيات تفترق سريعًا. صعب: آيات تكاد تتطابق إلا كلمة أو كلمتين.',
    en: 'Trees, easy: ayat that part soon. Hard: ayat alike but for a word or two.',
  },
  SURAH: {
    ar: 'في أي سورة، سهل: سور متباعدة. متوسط: سور متشابهات الآية إن كان لها متشابهات، ثم السور المجاورة. صعب: مثله، مع آيات لها شبيهة قريبة في سورة أخرى أولًا.',
    en: 'Which surah, easy: surahs far apart. Medium: the surahs of the ayah\'s look-alikes, if any, then neighbouring surahs. Hard: the same, asking ayat with a close look-alike in another surah first.',
  },
  COMPARE: {
    ar: 'قارن الموضعين، سهل: آيتان تفترقان كثيرًا. صعب: آيتان تكادان تتطابقان إلا كلمة أو كلمتين.',
    en: 'Compare, easy: two ayat far apart in wording. Hard: two ayat alike but for a word or two.',
  },
  RECITE: {
    ar: 'سمّع بقية الآية، سهل: تظهر كلمتان زيادة من أولها. صعب: يظهر أقل ما يميّزها.',
    en: 'Recite the rest, easy: two more opening words. Hard: just enough to tell the ayah.',
  },
};
