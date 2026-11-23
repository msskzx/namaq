/**
 * The adhkar page's counter. One card counts at a time; a card whose count is reached stays done, so the row of dots shows
 * how far the reader has come (owner, 2026-11-23). It lives in the page's state only and is gone when the tab changes, the
 * page loses focus or the app goes to the background. A card without a stated number counts once.
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
