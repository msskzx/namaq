import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { List, Search, type LucideProps } from 'lucide-react-native';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { num } from '@shared/quran/arabicNumber';
import TabHint from '@/components/TabHint';
import TopBar from '@/ui/TopBar';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import HelpSheet from '@/components/HelpSheet';
import TreePager from '@/components/TreePager';
import MutashabihIndex from '@/components/MutashabihIndex';
import LoadingDots from '@/ui/LoadingDots';
import BranchSearch from '@/components/BranchSearch';
import { surahNames } from '@/lib/branches';
import { aliasesOf, BOTH_KINDS_LIST, branchList, EMPTY_LIST, isFiltered, listShowing, openingIndex, tabOf, type ListState } from '@/lib/branchList';
import { PAGE_KINDS } from '@shared/quran/branchSearch';
import { router, useLocalSearchParams } from 'expo-router';
import { useIntent } from '@/lib/intent';
import { loadPrefs, closeStudio, type Prefs } from '@/lib/growPlayer';
import { around as aroundSetting, listState } from '@/lib/settings';
import { isRecord, readJson, writeJson } from '@/lib/storage';
import { usePalette, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';

function BarButton({ label, onPress, Icon, on, dot }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; palette: Palette; on?: boolean; dot?: boolean }) {
  return <IconButton Icon={Icon} label={label} onPress={onPress} on={on} dot={dot} />;
}

type Opening = { id?: string; query?: string; view?: 'tree' };
const indexes = (list: ListState) => !list.query && !list.surah && !list.ayah && !list.range && !list.saved;

export default function BranchesScreen() {
  const palette = usePalette();
  const bottom = useTabBarSpace();
  const [help, setHelp] = useState(false);
  const [list, setList] = listState.use();
  const [around] = aroundSetting.use();
  const [searching, setSearching] = useState(false);
  const [browsing, setBrowsing] = useState(() => indexes(list));
  const [indexSurah, setIndexSurah] = useState<number | undefined>(list.surah);
  const [start, setStart] = useState<Opening | undefined>(undefined);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const [pieces, setPieces] = useState<BranchPiece[] | null>(null);
  useEffect(() => loadPrefs(readJson('branches-grow', isRecord) as Partial<Prefs> | undefined, prefs => writeJson('branches-grow', prefs)), []);
  const savedKey = list.saved ? bookmarks : null;
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const frame = requestAnimationFrame(() => { timer = setTimeout(() => setPieces(branchList(list, bookmarks)), 0); });
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, [list, savedKey, start]); // eslint-disable-line react-hooks/exhaustive-deps

  const change = useCallback((next: ListState, opening?: Opening) => {
    closeStudio();
    setBrowsing(!opening?.id && indexes(next));
    setPieces(null);
    setStart(opening ?? {});
    setList(next);
  }, [setList]);
  const startIndex = useMemo(() => {
    if (!pieces || !start) return undefined;
    if (start.id) { const at = pieces.findIndex(piece => piece.id === start.id || aliasesOf(piece).includes(start.id!)); if (at >= 0) return at; }
    return openingIndex(pieces, start.query ?? '');
  }, [pieces, start]);
  const startMode = start?.view && start.id && pieces?.[startIndex ?? -1] && [pieces[startIndex!].id, ...aliasesOf(pieces[startIndex!])].includes(start.id) ? start.view : undefined;
  const [jumps, setJumps] = useState(0);
  const openPart = useCallback((piece: BranchPiece) => change({ ...list, query: piece.text }, { id: piece.id, query: piece.text }), [change, list]);
  useIntent('branches', intent => {
    setJumps(value => value + 1);
    const found = intent.open && !intent.saved && !intent.query ? listShowing({ ...EMPTY_LIST, saved: true }, intent.open, bookmarks) : null;
    const view = intent.view;
    if (intent.query) change({ ...EMPTY_LIST, query: intent.query }, { id: intent.open, query: intent.query, view });
    else if (found) change(found.list, { id: found.piece.id, view });
    else if (intent.open || intent.saved) change({ ...EMPTY_LIST, saved: true }, { id: intent.open, view });
    else if (intent.ayah) change({ ...BOTH_KINDS_LIST, ayah: intent.ayah });
    else if (intent.surah) change({ ...BOTH_KINDS_LIST, surah: intent.surah });
    else if (intent.juz) change({ ...BOTH_KINDS_LIST, range: { from: intent.juz, to: intent.juz } });
  });
  const at = useRef(0);
  const onIndex = useCallback((index: number) => { at.current = index; }, []);
  useTabRetap('branches', () => {
    if (searching) return;
    if (!browsing) toIndex();
    else if (isFiltered(list)) change({ ...EMPTY_LIST, filters: tabOf(list) ? { categories: list.filters.categories } : {} });
  });
  const openSearch = useCallback(() => setSearching(true), []);
  const toIndex = () => {
    if (browsing) return;
    const open = pieces?.[at.current];
    const surahs = open ? (open.group?.places ?? open.phrase.occurrences).map(place => Number(place.key.split(':')[0])) : [];
    const surah = list.surah ?? (indexSurah && surahs.includes(indexSurah) ? indexSurah : surahs[0]);
    if (surah) setIndexSurah(surah);
    change({ ...EMPTY_LIST, filters: list.filters });
  };
  const openCard = (piece: BranchPiece, surah: number) => { setIndexSurah(surah); change(list, { id: piece.id }); };
  const { tree, view } = useLocalSearchParams<{ tree?: string; view?: string }>();
  useEffect(() => {
    if (!tree) return;
    const found = listShowing(list, tree, bookmarks);
    if (found) change(found.list, { id: found.piece.id, view: view === 'tree' ? 'tree' : undefined });
    router.setParams({ tree: undefined, view: undefined });
  }, [tree]); // eslint-disable-line react-hooks/exhaustive-deps
  const listKey = JSON.stringify([list, start, jumps]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll help={() => setHelp(true)}>
        <BarButton label="ابحث" onPress={() => setSearching(true)} Icon={Search} palette={palette} dot={!!list.query || isFiltered(list)} />
        <BarButton label="فهرس المتشابه بالسور" onPress={toIndex} Icon={List} palette={palette} on={browsing} />
        {(list.query || list.surah || list.ayah) ? <View style={{ flex: 1, flexDirection: 'row', gap: 6, overflow: 'hidden' }}>
          {list.query ? <Chip on={false} label={`«${list.query}»`} onClear={() => change({ ...list, query: '' })} palette={palette} /> : null}
          {list.surah ? <Chip on={false} label={`سورة ${surahNames[list.surah]}`} onClear={() => change({ ...list, surah: undefined })} palette={palette} /> : null}
          {list.ayah ? <Chip on={false} label={`${surahNames[Number(list.ayah.split(':')[0])]} ${num(Number(list.ayah.split(':')[1]))}`} onClear={() => change({ ...list, ayah: undefined })} palette={palette} /> : null}
        </View> : null}
      </TopBar>
      <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 }}>
        {PAGE_KINDS.map(kind => <Chip key={kind.id} role="tab" label={kind.ar} on={tabOf(list) === kind.id} palette={palette}
          onPress={() => { if (tabOf(list) !== kind.id) change({ ...list, filters: { ...list.filters, categories: kind.id } }); }} />)}
      </View>
      {pieces?.length && browsing ? <MutashabihIndex key={tabOf(list)} pieces={pieces} start={indexSurah} onOpen={openCard} palette={palette} bottom={0} />
        : pieces?.length ? <TreePager key={listKey} pieces={pieces} list={list} palette={palette} around={around} start={startIndex} startMode={startMode} onIndex={onIndex} onPull={openSearch} onOpen={openPart} />
        : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {pieces ? <Empty palette={palette} text={list.query ? `لا شجرة تطابق «${list.query}».` : list.saved && !isFiltered({ ...list, saved: false }) ? 'لا شجرة محفوظة بعد. احفظ شجرة بزر الحفظ تحتها أولًا.' : isFiltered(list) ? 'لا مواضع متشابهة تطابق التصفية.' : 'لا شجرة في هذا النطاق.'} /> : <LoadingDots />}
        </View>}
      <View style={{ height: bottom }} />
      {searching && <BranchSearch state={list} bookmarks={bookmarks} palette={palette} onClose={() => setSearching(false)}
        onApply={(next, opening) => { setSearching(false); change(next, opening); }} />}
      <HelpSheet topic={help ? 'branches' : null} onClose={() => setHelp(false)} palette={palette} />
      <TabHint id="branches" palette={palette} hidden={searching || browsing} />
    </View>
  );
}

