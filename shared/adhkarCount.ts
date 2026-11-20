/**
 * The tap counter on a card whose hadith states a number. One card counts at a time; it lives in the page's state only and
 * is gone when the card changes, the page loses focus or the app goes to the background. It stops at the stated number.
 */
export type Counting = { id: string; count: number } | null;
export type CountEvent = { type: 'tap'; id: string; target: number } | { type: 'reset' } | { type: 'leave' };

export function counting(state: Counting, event: CountEvent): Counting {
  if (event.type !== 'tap') return null;
  if (state?.id !== event.id) return { id: event.id, count: 1 };
  return { id: event.id, count: Math.min(state.count + 1, event.target) };
}

export const countOf = (state: Counting, id: string) => (state?.id === id ? state.count : 0);
