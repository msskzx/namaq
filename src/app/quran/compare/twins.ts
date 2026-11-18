import { branchInventory, reviewFilters } from '@shared/quran/branchInventory';
import { compareViews } from '@shared/quran/compareViews';
import type { TwinVerdicts } from '@shared/quran/branchVerdicts';
import { compareVerdicts } from '@/lib/quran/curation/comparePairs';

const order = (key: string) => key.split(':').map(Number);
/** The compare key of two ayat: lower surah (then ayah) first, as comparePairs.json keys it. */
export const pairKey = (x: string, y: string) => {
  const [[s1, a1], [s2, a2]] = [order(x), order(y)];
  return s1 < s2 || (s1 === s2 && a1 <= a2) ? `${x}|${y}` : `${y}|${x}`;
};

/**
 * Every branches card of exactly two ayat that compare also judges as a pair, with that pair's verdict: one verdict for both pages.
 * Dropped branches cards are included, since the twin's verdict is what decides whether they show.
 */
export function buildTwinVerdicts(verdicts = compareVerdicts, views = compareViews): TwinVerdicts {
  const twins: TwinVerdicts = {};
  for (const piece of branchInventory(reviewFilters({}), null, true)) {
    if (piece.keys.length !== 2) continue;
    const pair = pairKey(piece.keys[0], piece.keys[1]);
    const verdict = verdicts[pair];
    if (!verdict) continue;
    twins[piece.id] = {
      pair,
      keep: verdict.keep,
      why: verdict.why,
      ...(verdict.checked ? { checked: true } : {}),
      ...(verdict.ask ? { ask: verdict.ask } : {}),
      ...(views[pair]?.view === 'matrix' ? { view: 'matrix' as const } : {}),
    };
  }
  return Object.fromEntries(Object.entries(twins).sort(([a], [b]) => a.localeCompare(b)));
}
