import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Funnel, GalleryHorizontal, RotateCwSquare, Search, UnfoldHorizontal, X, type LucideProps } from 'lucide-react-native';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import TopBar from '@/components/TopBar';
import TreePager from '@/components/TreePager';
import TreeIcon from '@/components/TreeIcon';
import LoadingDots from '@/components/LoadingDots';
import FilterSheet from '@/components/FilterSheet';
import BranchSearch from '@/components/BranchSearch';
import { surahNames } from '@/lib/branches';
import { branchList, isFiltered, openingIndex, type ListState } from '@/lib/branchList';
import { loadPrefs, closeStudio, type Prefs } from '@/lib/growPlayer';
import { around as aroundSetting, branchView, listState } from '@/lib/settings';
import { readJson, writeJson } from '@/lib/storage';
import { usePalette, type Palette } from '@/lib/theme';

function BarButton({ label, onPress, Icon, palette, on, dot }: { label: string; onPress: () => void; Icon: (props: LucideProps) => React.ReactNode; palette: Palette; on?: boolean; dot?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={4} accessibilityRole="button" accessibilityLabel={label} accessibilityState={on === undefined ? undefined : { selected: on }}
      style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: on ? 1 : 0, borderColor: palette.accent }}>
      <Icon size={22} color={on ? palette.accent : palette.muted} />
      {dot && <View style={{ position: 'absolute', top: 7, end: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: palette.accent }} />}
    </Pressable>
  );
}

function Chip({ text, onClear, palette }: { text: string; onClear: () => void; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: palette.rule, borderRadius: 16, paddingStart: 12, paddingEnd: 4, height: 32 }}>
      <Text style={{ color: palette.ink, fontSize: 14 }} numberOfLines={1}>{text}</Text>
      <Pressable onPress={onClear} accessibilityRole="button" accessibilityLabel={`إزالة ${text}`} hitSlop={8} style={{ padding: 4 }}><X size={14} color={palette.muted} /></Pressable>
    </View>
  );
}

export default function BranchesScreen() {
  const palette = usePalette();
  const [list, setList] = listState.use();
  const [mode, setMode] = branchView.use();
  const [around, setAround] = aroundSetting.use();
  const [rotated, setRotated] = useState(false);
  const [searching, setSearching] = useState(false);
  const [filtering, setFiltering] = useState(false);
  /** Where a new list opens: a picked phrase, else the search's best tree; undefined keeps the saved place. */
  const [start, setStart] = useState<{ id?: string; query?: string } | undefined>(undefined);
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const [pieces, setPieces] = useState<BranchPiece[] | null>(null);
  useEffect(() => loadPrefs(readJson<Prefs>('branches-grow'), prefs => writeJson('branches-grow', prefs)), []);
  // The list is built from the bundled data after the first frame, so the tab opens at once.
  const savedKey = list.saved ? bookmarks : null;
  useEffect(() => {
    const frame = requestAnimationFrame(() => setTimeout(() => setPieces(branchList(list, bookmarks)), 0));
    return () => cancelAnimationFrame(frame);
  }, [list, savedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const change = useCallback((next: ListState, opening?: { id?: string; query?: string }) => {
    closeStudio();
    setPieces(null);
    setStart(opening ?? {});
    setList(next);
  }, [setList]);
  const startIndex = useMemo(() => {
    if (!pieces || !start) return undefined;
    if (start.id) { const at = pieces.findIndex(piece => piece.id === start.id); if (at >= 0) return at; }
    return openingIndex(pieces, start.query ?? '');
  }, [pieces, start]);
  const onIndex = useCallback(() => setRotated(false), []);
  const listKey = JSON.stringify([list, start, list.saved ? pieces?.length : 0]);

  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar>
        <BarButton label="ابحث" onPress={() => setSearching(true)} Icon={Search} palette={palette} dot={!!list.query} />
        <BarButton label="تصفية" onPress={() => setFiltering(true)} Icon={Funnel} palette={palette} dot={isFiltered(list)} />
        <BarButton label={mode === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة'} onPress={() => { closeStudio(); setMode(mode === 'tree' ? 'matrix' : 'tree'); }} Icon={mode === 'tree' ? GalleryHorizontal : TreeIcon} palette={palette} />
        {mode === 'tree' && <BarButton label="تدوير الشجرة" onPress={() => setRotated(!rotated)} Icon={RotateCwSquare} palette={palette} />}
        <BarButton label="الآيات المحيطة" onPress={() => { closeStudio(); setAround(!around); }} Icon={UnfoldHorizontal} palette={palette} on={around} />
      </TopBar>
      {(list.query || list.surah) ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 12, paddingTop: 8 }}>
        {list.query ? <Chip text={`«${list.query}»`} onClear={() => change({ ...list, query: '' })} palette={palette} /> : null}
        {list.surah ? <Chip text={`سورة ${surahNames[list.surah]}`} onClear={() => change({ ...list, surah: undefined })} palette={palette} /> : null}
      </View> : null}
      {pieces?.length ? <TreePager key={listKey} pieces={pieces} list={list} palette={palette} mode={mode} around={around} rotated={rotated} start={startIndex} onIndex={onIndex} />
        : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          {pieces ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center' }}>{list.query ? `لا شجرة تطابق «${list.query}».` : isFiltered(list) ? 'لا مواضع متشابهة تطابق التصفية.' : 'لا شجرة في هذا النطاق.'}</Text> : <LoadingDots />}
        </View>}
      <FilterSheet open={filtering} onClose={() => setFiltering(false)} state={list} onApply={next => change(next)} palette={palette} />
      {searching && <BranchSearch state={list} palette={palette} onClose={() => setSearching(false)}
        onPhrase={(text, id) => { setSearching(false); change({ ...list, query: text, surah: undefined }, { id, query: text }); }}
        onSearch={query => { setSearching(false); change({ ...list, query, surah: undefined }, { query }); }}
        onSurah={surah => { setSearching(false); change({ ...list, query: '', surah }); }} />}
    </View>
  );
}
