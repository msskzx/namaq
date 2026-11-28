import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { ArrowLeftRight } from 'lucide-react-native';
import type { Visit } from '@shared/quran/compareCards';
import type { CompareScope } from '@shared/quran/compareScope';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { savedAs } from '@shared/compareBookmarks';
import { num } from '@shared/quran/arabicNumber';
import TabHint from '@/components/TabHint';
import BarPicker from '@/ui/BarPicker';
import TopBar from '@/ui/TopBar';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import HelpSheet from '@/components/HelpSheet';
import PageProgress from '@/components/PageProgress';
import ComparePager, { type Focus, type PagerHandle } from '@/components/ComparePager';
import CompareSheet from '@/components/CompareSheet';
import { cardsFor, filteredPairs, landingIndex, pairTitle, visitKey, visitsOf, type PairFilter } from '@/lib/compare';
import { isBoolean, isNumberIn, isRecord, readJson, writeJson } from '@/lib/storage';
import { useIntent } from '@/lib/intent';
import { usePalette } from '@/lib/theme';

const PLACE = 'compare-place';
const FILTER = 'compare-filter';
type Place = Pick<Visit, 'lead' | 'other'>;
const isSurah = isNumberIn(1, 114);
const isPlace = (value: unknown): value is Place => isRecord(value) && isSurah(value.lead) && isSurah(value.other);
const isScope = (value: unknown): value is CompareScope => isRecord(value) && (
  ['juz', 'surah', 'page'].includes(value.unit as string) ? isNumberIn(1, 604)(value.from) && isNumberIn(1, 604)(value.to)
    : ['surahs', 'juzs'].includes(value.unit as string) && Array.isArray(value.list) && value.list.every(isNumberIn(1, 114)));
const isFilter = (value: unknown): value is PairFilter => isRecord(value) && (value.scope === undefined || isScope(value.scope)) && (value.savedOnly === undefined || isBoolean(value.savedOnly));

export default function CompareScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const [help, setHelp] = useState(false);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const [filter, setFilter] = useState<PairFilter>(() => readJson(FILTER, isFilter) ?? {});
  const pairs = useMemo(() => filteredPairs(filter), [filter]);
  const visits = useMemo(() => visitsOf(pairs), [pairs]);
  const [index, setIndex] = useState(() => landingIndex(visits, readJson(PLACE, isPlace)));
  const visit = visits[index];
  const pager = useRef<PagerHandle>(null);
  const [sheet, setSheet] = useState(false);

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
  useTabRetap('compare', () => {
    if (index > 0) go(0);
    else if (filter.scope || filter.savedOnly) { writeJson(FILTER, {}); setFilter({}); setIndex(0); setJumps(value => value + 1); }
  });
  const pick = (lead: number, other: number) => {
    const at = visits.findIndex(item => item.lead === lead && item.other === other);
    setSheet(false);
    if (at >= 0) { pager.current?.goTo(at, false); arrive(at); }
  };
  const [jumps, setJumps] = useState(0);
  const [focus, setFocus] = useState<Focus | undefined>(undefined);
  useIntent('compare', ({ lead, other, ayat }) => {
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
    setFocus(ayat?.length ? { visit: visitKey(list[at]), ayat } : undefined);
    setIndex(at);
    setJumps(value => value + 1);
  });
  const listKey = useMemo(() => `${filter.savedOnly ? 's' : ''}${filter.scope ? JSON.stringify(filter.scope) : ''}`, [filter]);
  useEffect(() => { if (visit) writeJson(PLACE, { lead: visit.lead, other: visit.other }); }, [listKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const savedIds = useCallback((id: string) => savedAs(id, bookmarks).length > 0, [bookmarks]);
  const count = visit ? (filter.savedOnly ? cardsFor(visit.lead, visit.other).filter(card => savedIds(card.id)).length : cardsFor(visit.lead, visit.other).length) : 0;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper, paddingBottom: bottom }}>
      <TopBar hub hideOnScroll center help={() => setHelp(true)}>
        <BarPicker Icon={ArrowLeftRight} text={visit ? pairTitle(visit.lead, visit.other) : 'اختر سورتين'} count={num(count)}
          label={`اختر سورتين: ${visit ? pairTitle(visit.lead, visit.other) : ''}`} onPress={() => setSheet(true)} />
      </TopBar>
      <PageProgress at={index + 1} count={visits.length} label="الصفحة" palette={palette} />
      {visits.length ? <ComparePager key={`${listKey}:${jumps}`} ref={pager} visits={visits} index={index} onIndex={arrive} palette={palette} savedOnly={!!filter.savedOnly} savedIds={savedIds} focus={focus} onLanded={() => setFocus(undefined)} />
        : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}><Text style={{ color: palette.muted, fontSize: 16, textAlign: 'center' }}>{filter.savedOnly && !filter.scope ? 'لا بطاقة محفوظة بعد. احفظ بطاقة بزر الحفظ تحتها أولًا.' : 'لا صفحات بهذه التصفية.'}</Text></View>}
      <CompareSheet open={sheet} onClose={() => setSheet(false)} pairs={pairs} filter={filter} onFilter={changeFilter}
        lead={visit?.lead ?? 0} other={visit?.other ?? 0} onPick={pick} palette={palette} />
      <HelpSheet topic={help ? 'compare' : null} onClose={() => setHelp(false)} palette={palette} />
      <TabHint id="compare" palette={palette} />
    </View>
  );
}

