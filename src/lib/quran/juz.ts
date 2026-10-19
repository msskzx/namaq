// docs/quiz-ayah-branches.md
export const JUZ_STARTS = [
  '1:1', '2:142', '2:253', '3:93', '4:24', '4:148', '5:82', '6:111', '7:88', '8:41',
  '9:93', '11:6', '12:53', '15:1', '17:1', '18:75', '21:1', '23:1', '25:21', '27:56',
  '29:46', '33:31', '36:28', '39:32', '41:47', '46:1', '51:31', '58:1', '67:1', '78:1',
];

export type JuzRange = { from: number; to: number };

const order = (key: string) => key.split(':').map(Number);
const before = (a: string, b: string) => {
  const [x, y] = [order(a), order(b)];
  return x[0] < y[0] || (x[0] === y[0] && x[1] < y[1]);
};

export const juzOf = (key: string) => JUZ_STARTS.findLastIndex((start) => !before(key, start)) + 1;

export const inJuzRange = (key: string, range: JuzRange) => {
  const juz = juzOf(key);
  return juz >= range.from && juz <= range.to;
};

export function parseJuzRange(from: string | null, to: string | null): JuzRange | null {
  if (!from && !to) return null;
  const clamp = (value: string | null, fallback: number) => {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= JUZ_STARTS.length ? n : fallback;
  };
  const [a, b] = [clamp(from, 1), clamp(to, JUZ_STARTS.length)];
  return { from: Math.min(a, b), to: Math.max(a, b) };
}
