// What the screens need to draw a question that puts its choices in order («رتّب السور»), light enough not to load the
// Quran's text: the order a reader gives, where each choice was put, and where the surah-order page opens.
import { juzOf } from '../quran/juz';
import { PICKS, picksOf } from './choiceKinds';

/** The order as it is sent: the values joined (PICKS), as `correctAnswer` holds the right one. */
export const sentOrder = (values: readonly string[]) => values.join(PICKS);
export const givenOrder = picksOf;

/** Where the reader put a choice, said as a place («جعلتها الثالثة»); undefined when it is in its right place. */
const PLACES = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];
export function misplaced(right: readonly string[], given: readonly string[], value: string): { ar: string; en: string } | undefined {
  const at = given.indexOf(value);
  if (at === right.indexOf(value)) return undefined;
  if (at < 0) return { ar: 'لم تضعها', en: 'Not placed' };
  return { ar: `جعلتها ${PLACES[at] ?? at + 1}`, en: `You put it ${at + 1}${['st', 'nd', 'rd'][at] ?? 'th'}` };
}

/** Moves the value at `from` to `to`, the others closing up behind it, as a dragged row lands. */
export function moved<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** The juz the surah-order page opens at for a question: the juz its first surah starts in. */
export const orderJuz = (order: readonly string[]) => juzOf(`${order[0]}:1`);
