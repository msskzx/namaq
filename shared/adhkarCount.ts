/**
 * The adhkar counter. One card counts at a time; a card whose count is reached stays done, so the row of dots shows how far
 * the reader has come (owner, 2026-11-23). A card without a stated number counts once. On the website it lives in the
 * page's state only and is gone when the page is left; the phone keeps it until the day ends (owner, 2026-11-24).
 */
export type Counting = { id: string | null; count: number; done: Readonly<Record<string, number>> } | null;
export type CountEvent = { type: 'tap'; id: string; target: number } | { type: 'reset'; id?: string } | { type: 'leave' };

export function counting(state: Counting, event: CountEvent): Counting {
  if (event.type === 'leave') return null;
  const done = state?.done ?? {};
  if (event.type === 'reset') {
    const id = event.id ?? state?.id;
    if (!state || !id) return state;
    const rest = Object.fromEntries(Object.entries(done).filter(([key]) => key !== id));
    return { id: state.id === id ? null : state.id, count: state.id === id ? 0 : state.count, done: rest };
  }
  if (event.id in done) return state;
  const count = state?.id === event.id ? Math.min(state.count + 1, event.target) : 1;
  return { id: event.id, count, done: count >= event.target ? { ...done, [event.id]: count } : done };
}

export const countOf = (state: Counting, id: string) => (state?.done[id] ?? (state?.id === id ? state.count : 0));
export const isDone = (state: Counting, id: string) => !!state && id in state.done;

/**
 * What the phone keeps (owner, 2026-11-24: until the day ends): the day, and each dhikr's count with the number it counts
 * to. Each keeps its own count, so moving between adhkar mid-count loses nothing.
 */
export type SaidToday = { day: string; counts: Readonly<Record<string, { n: number; of: number }>> };

/** The phone's own day, so the count ends at the reader's midnight. */
export const localDay = (date: Date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

/** The kept counts while their day lasts; a new day starts with nothing said. */
export const countsOnDay = (saved: SaidToday | null | undefined, day: string): SaidToday['counts'] => (saved?.day === day ? saved.counts : {});

/** A dhikr said in one time is not said in another that shares it (the morning and the evening): the count is kept per time. */
export const saidKey = (occasion: string, id: string) => `${occasion}:${id}`;

export const saidCount = (counts: SaidToday['counts'], key: string) => counts[key]?.n ?? 0;
export const saidDone = (counts: SaidToday['counts'], key: string) => !!counts[key] && counts[key].n >= counts[key].of;

/** One more count, never past the number; `null` starts that dhikr again. */
export function sayOnce(counts: SaidToday['counts'], key: string, of: number | null): SaidToday['counts'] {
  if (of === null) return Object.fromEntries(Object.entries(counts).filter(([name]) => name !== key));
  return { ...counts, [key]: { n: Math.min(saidCount(counts, key) + 1, of), of } };
}

export const isSaidToday = (value: unknown): value is SaidToday => {
  if (!value || typeof value !== 'object') return false;
  const { day, counts } = value as SaidToday;
  return typeof day === 'string' && !!counts && typeof counts === 'object'
    && Object.values(counts).every(count => !!count && typeof count.n === 'number' && typeof count.of === 'number');
};
