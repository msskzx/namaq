import { juzOf } from '../quran/juz';
import { PICKS, picksOf } from './choiceKinds';

export const sentOrder = (values: readonly string[]) => values.join(PICKS);
export const givenOrder = picksOf;

const PLACES = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];
export function misplaced(right: readonly string[], given: readonly string[], value: string): { ar: string; en: string } | undefined {
  const at = given.indexOf(value);
  if (at === right.indexOf(value)) return undefined;
  if (at < 0) return { ar: 'لم تضعها', en: 'Not placed' };
  return { ar: `جعلتها ${PLACES[at] ?? at + 1}`, en: `You put it ${at + 1}${['st', 'nd', 'rd'][at] ?? 'th'}` };
}

export function moved<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export const orderJuz = (order: readonly string[]) => juzOf(`${order[0]}:1`);
