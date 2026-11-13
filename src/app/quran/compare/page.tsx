import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { BRANCH_VIEW_COOKIE, parseBranchView } from '@shared/quran/branchView';
import { surahList } from '@/lib/quran/surahList';
import { surahLabel } from '@/lib/quran/surahLabel';
import { curatedComparisons, surahPairHref } from '@shared/quran/curatedComparisons';
import PairCompare from './PairCompare';
import { listedPairs, pairCards, reviewPairs, reviewStates, surahSpans } from './pairCards';
import { parseScope, scopeParam, type CompareScope } from '@shared/quran/compareScope';
import { closestPair } from '@/lib/quran/mutashabih/pairs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'القرآن: مقارنة السور',
};

const surahOf = (value: string | string[] | undefined) => {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null;
};

/** `lead` is the surah being browsed (first in the address), when it is the larger one. */
async function pairPage(a: number, b: number, review = false, todo = false, scope?: CompareScope, lead = a) {
  const surahs = await surahList();
  // Surah names as plain labels («البقرة»), as the app writes them on the cards.
  const names = Object.fromEntries(surahs.map(surah => [surah.number, { ar: surahLabel(surah), en: surah.nameTransliterated ?? undefined }]));
  // Cards open in the default view chosen in settings (tree or matrix), as the branches page does.
  const view = parseBranchView((await cookies()).get(BRANCH_VIEW_COOKIE)?.value);
  return <PairCompare view={view} a={a} b={b} lead={lead} cards={pairCards(a, b, review)} pairs={review ? reviewPairs : listedPairs} names={names} scope={scope} spans={surahSpans} review={review} {...(review ? { states: reviewStates(), editable: process.env.NODE_ENV === 'development', todo } : {})} />;
}

export default async function QuranComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const preset = curatedComparisons.find(story => story.id === query.preset);
  const [x, y] = [surahOf(query.a), surahOf(query.b)];
  if (preset) redirect(surahPairHref(preset.a, preset.b));
  const review = query.review === '1';
  const todo = review && query.todo === '1';
  const scope = parseScope(query);
  const keepReview = `${review ? '&review=1' : ''}${todo ? '&todo=1' : ''}${scopeParam(scope)}`;
  const closest = x !== null && y === null ? closestPair(review ? reviewPairs : listedPairs, x) : undefined;
  // A link to one surah opens its closest pair seen from that surah.
  if (closest) redirect(`/quran/compare?a=${x}&b=${closest.a === x ? closest.b : closest.a}${keepReview}`);
  // A surah with itself (?a=26&b=26) opens only when compare lists it.
  const itself = x !== null && x === y && (review ? reviewPairs : listedPairs).some(pair => pair.a === x && pair.b === x);
  if (x === null || y === null || (x === y && !itself)) {
    if (query.a !== undefined || query.b !== undefined || query.preset !== undefined) redirect(`${surahPairHref(curatedComparisons[0].a, curatedComparisons[0].b)}${keepReview}`);
    return pairPage(curatedComparisons[0].a, curatedComparisons[0].b, review, todo, scope);
  }
  // 3·2 opens the 2·3 page seen from surah 3, so moving on walks surah 3's pairs.
  if (x > y) return pairPage(y, x, review, todo, scope, x);
  return pairPage(x, y, review, todo, scope);
}
