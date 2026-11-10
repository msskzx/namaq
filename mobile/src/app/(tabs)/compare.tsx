import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ArrowLeftRight, ChevronDown, Funnel } from 'lucide-react-native';
import type { Visit } from '@shared/quran/compareCards';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { savedAs } from '@shared/compareBookmarks';
import { num } from '@shared/quran/arabicNumber';
import TopBar from '@/components/TopBar';
import PageProgress from '@/components/PageProgress';
import ComparePager, { type PagerHandle } from '@/components/ComparePager';
import CompareSheet from '@/components/CompareSheet';
import FilterSheet from '@/components/FilterSheet';
import { cardsFor, filteredPairs, filterOfList, landingIndex, listOfFilter, pairTitle, visitsOf, type PairFilter } from '@/lib/compare';
import { readJson, writeJson } from '@/lib/storage';
import { useIntent } from '@/lib/intent';
import { usePalette } from '@/lib/theme';

const PLACE = 'compare-place';
const FILTER = 'compare-filter';
type Place = Pick<Visit, 'lead' | 'other'>;

/** The website's compare page on the phone: surah pairs side by side, their cards scrolled, the pair list in a bottom sheet. */
export default function CompareScreen() {
  const palette = usePalette();
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const [filter, setFilter] = useState<PairFilter>(() => readJson<PairFilter>(FILTER) ?? {});
  // The saved-only list follows the bookmarks only when the filter changes, so unsaving a card doesn't pull the page away.
  const pairs = useMemo(() => filteredPairs(filter), [filter]); // eslint-disable-line react-hooks/exhaustive-deps
  const visits = useMemo(() => visitsOf(pairs), [pairs]);
  const [index, setIndex] = useState(() => landingIndex(visits, readJson<Place>(PLACE)));
  const visit = visits[index];
  const pager = useRef<PagerHandle>(null);
  const [sheet, setSheet] = useState(false);
  const [filtering, setFiltering] = useState(false);

  const arrive = useCallback((at: number) => {
    setIndex(at);
    const next = visits[at];
    if (next) writeJson(PLACE, { lead: next.lead, other: next.other });
  }, [visits]);
  const go = (at: number) => { if (at >= 0 && at < visits.length) { pager.current?.goTo(at); arrive(at); } };

  const changeFilter = (next: PairFilter) => {
    const list = visitsOf(filteredPairs(next));
    const at = landingIndex(list, visit);
    writeJson(FILTER, next);
    setFilter(next);
    setIndex(at);
  };
  const pick = (lead: number, other: number) => {
    const at = visits.findIndex(item => item.lead === lead && item.other === other);
    setSheet(false);
    if (at >= 0) { pager.current?.goTo(at, false); arrive(at); }
  };
  // The homepage opens a surah's first pair, or the pair of a saved card; a filter that hides it is cleared.
  // The pager remounts on the pair, so it lands there whether the tab was open or opens now.
  const [jumps, setJumps] = useState(0);
  useIntent('compare', ({ lead, other }) => {
    const find = (list: typeof visits) => list.findIndex(item => (item.lead === lead && (!other || item.other === other)) || (!!other && item.lead === other && item.other === lead));
    let list = visits;
    let at = find(list);
    if (at < 0 && (filter.scope || filter.savedOnly)) {
      list = visitsOf(filteredPairs({}));
      at = find(list);
      if (at >= 0) { writeJson(FILTER, {}); setFilter({}); }
    }
    if (at < 0) return;
    writeJson(PLACE, { lead: list[at].lead, other: list[at].other });
    setIndex(at);
    setJumps(value => value + 1);
  });
  // A new list (after a filter) remounts the pager at the kept page.
  const listKey = useMemo(() => `${filter.savedOnly ? 's' : ''}${filter.scope ? JSON.stringify(filter.scope) : ''}`, [filter]);
  useEffect(() => { if (visit) writeJson(PLACE, { lead: visit.lead, other: visit.other }); }, [listKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const savedIds = useCallback((id: string) => savedAs(id, bookmarks).length > 0, [bookmarks]);
  const count = visit ? (filter.savedOnly ? cardsFor(visit.lead, visit.other).filter(card => savedIds(card.id)).length : cardsFor(visit.lead, visit.other).length) : 0;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar>
        <Pressable onPress={() => setSheet(true)} accessibilityRole="button" accessibilityLabel={`اختر سورتين: ${visit ? pairTitle(visit.lead, visit.other) : ''}`}
          style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: palette.rule, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7 }}>
          <ArrowLeftRight size={16} color={palette.ink} />
          <Text numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 15 }}>{visit ? pairTitle(visit.lead, visit.other) : 'اختر سورتين'}</Text>
          <Text style={{ color: palette.accent, fontSize: 14 }}>{num(count)}</Text>
          <ChevronDown size={14} color={palette.ink} />
        </Pressable>
        <Pressable onPress={() => setFiltering(true)} hitSlop={4} accessibilityRole="button" accessibilityLabel="تصفية" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Funnel size={22} color={palette.muted} />
          {(filter.scope || filter.savedOnly) && <View style={{ position: 'absolute', top: 7, end: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: palette.accent }} />}
        </Pressable>
      </TopBar>
      <PageProgress at={index + 1} count={visits.length} label="الصفحة" palette={palette} />
      {visits.length ? <ComparePager key={`${listKey}:${jumps}`} ref={pager} visits={visits} index={index} onIndex={arrive} palette={palette} savedOnly={!!filter.savedOnly} savedIds={savedIds} />
        : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}><Text style={{ color: palette.muted, fontSize: 16 }}>لا صفحات بهذه التصفية.</Text></View>}
      <CompareSheet open={sheet} onClose={() => setSheet(false)} pairs={pairs} filter={filter}
        lead={visit?.lead ?? 0} other={visit?.other ?? 0} onPick={pick} palette={palette} />
      <FilterSheet compare open={filtering} onClose={() => setFiltering(false)} state={listOfFilter(filter)} onApply={next => changeFilter(filterOfList(next))} palette={palette} />
    </View>
  );
}
