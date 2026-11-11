import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDown01, ArrowDownWideNarrow, ChevronDown, Funnel, RotateCcw, Search, X } from 'lucide-react-native';
import type { SurahPair } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { filterOfList, listOfFilter, pairMatches, storiesIn, surahName, type PairFilter } from '@/lib/compare';
import { applyDraft, draftOf, type FilterDraft } from '@/lib/branchList';
import { FilterFields } from './FilterFields';
import { readJson, writeJson } from '@/lib/storage';
import type { Palette } from '@/lib/theme';

const SORT_KEY = 'compare-pairs-sort';

type Row =
  | { kind: 'heading'; key: string; text: string }
  | { kind: 'story'; key: string; pair: SurahPair; name: string }
  | { kind: 'surah'; key: string; surah: number; count: number; open: boolean; current: boolean }
  | { kind: 'pair'; key: string; pair: SurahPair; lead: number; nested: boolean };

/** What the filter keeps, in a few words for the filter row. */
function scopeText(filter: PairFilter) {
  const scope = filter.scope;
  const parts: string[] = [];
  if (filter.savedOnly) parts.push('المحفوظة');
  if (scope && 'list' in scope) parts.push(scope.unit === 'surahs' ? `${num(scope.list.length)} سور` : `${num(scope.list.length)} أجزاء`);
  else if (scope) parts.push(`${scope.unit === 'juz' ? 'الأجزاء' : scope.unit === 'surah' ? 'السور' : 'الصفحات'} ${num(scope.from)} إلى ${num(scope.to)}`);
  return parts.length ? parts.join(' · ') : 'كل القرآن';
}

/** The page's one dropdown (owner, 2026-11-10): search, sort, the filter (saved only and the part of the Quran, applied as you pick),
 *  then the surah pairs grouped under each surah. The filter opens in place of the list. */
export default function CompareSheet({ open, onClose, pairs, filter, onFilter, lead, other, onPick, palette }: {
  open: boolean; onClose: () => void; pairs: SurahPair[]; filter: PairFilter; onFilter: (filter: PairFilter) => void;
  lead: number; other: number; onPick: (lead: number, other: number) => void; palette: Palette;
}) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [byCount, setByCount] = useState(() => readJson<boolean>(SORT_KEY) ?? false);
  const [expanded, setExpanded] = useState(() => new Set([lead]));
  const [filtering, setFiltering] = useState(false);
  const [draft, setDraftState] = useState<FilterDraft>(() => draftOf(listOfFilter(filter)));
  useEffect(() => { if (open) { setDraftState(draftOf(listOfFilter(filter))); setFiltering(false); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  // Each pick applies at once; a half-made one (no surah picked yet) waits.
  const setDraft = (next: FilterDraft) => {
    setDraftState(next);
    const list = applyDraft(next);
    if (list && (list.saved || Object.keys(list.filters).length || list.range || !(next.unit === 'surahs' || next.unit === 'juzs'))) onFilter(filterOfList(list));
  };
  const filtered = !!(filter.scope || filter.savedOnly);
  useEffect(() => setExpanded(current => (current.has(lead) ? current : new Set([...current, lead]))), [lead]);
  const rows = useMemo(() => {
    const list: Row[] = [];
    const stories = filter.savedOnly ? [] : storiesIn(pairs, query);
    if (stories.length) {
      list.push({ kind: 'heading', key: 'h-stories', text: 'مختارة' });
      for (const story of stories) list.push({ kind: 'story', key: `s-${story.id}`, pair: pairs.find(pair => pair.a === story.a && pair.b === story.b)!, name: story.name.ar });
    }
    list.push({ kind: 'heading', key: 'h-all', text: 'كل السور المتشابهة' });
    const matching = pairs.filter(pair => pairMatches(pair, query));
    if (!byCount && !query.trim()) {
      const groups = new Map<number, SurahPair[]>();
      for (const pair of matching) for (const n of new Set([pair.a, pair.b])) groups.set(n, [...(groups.get(n) ?? []), pair]);
      for (const n of [...groups.keys()].sort((x, y) => x - y)) {
        const isOpen = expanded.has(n);
        list.push({ kind: 'surah', key: `g-${n}`, surah: n, count: groups.get(n)!.length, open: isOpen, current: n === lead || n === other });
        if (isOpen) for (const pair of groups.get(n)!) list.push({ kind: 'pair', key: `p-${n}-${pair.a}-${pair.b}`, pair, lead: n, nested: true });
      }
    } else {
      const sorted = byCount ? [...matching].sort((p, q) => q.count - p.count || p.a - q.a || p.b - q.b) : matching;
      for (const pair of sorted) list.push({ kind: 'pair', key: `p-${pair.a}-${pair.b}`, pair, lead: pair.a, nested: false });
    }
    return list;
  }, [pairs, query, byCount, expanded, filter.savedOnly, lead, other]);

  const empty = rows[rows.length - 1]?.kind === 'heading';
  const isCurrent = (pair: SurahPair, from: number) => from === lead && (pair.a === other || pair.b === other);
  const otherOf = (pair: SurahPair, n: number) => (pair.a === n ? pair.b : pair.a);

  const drag = useSharedValue(0);
  const close = () => { drag.value = 0; onClose(); };
  const pan = Gesture.Pan().activeOffsetY(8).onUpdate(event => { drag.value = Math.max(0, event.translationY); })
    .onEnd(event => {
      if (event.translationY > 90 || event.velocityY > 700) scheduleOnRN(close);
      else drag.value = withTiming(0, { duration: 180 });
    });
  const moved = useAnimatedStyle(() => ({ transform: [{ translateY: drag.value }] }));

  const field = { borderWidth: 1, borderColor: palette.rule, borderRadius: 8, color: palette.ink, fontSize: 16, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: palette.paper };
  const sortButton = (active: boolean) => ({ flex: 1, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: active ? palette.accent : 'transparent' });

  const renderRow = ({ item }: { item: Row }) => {
    if (item.kind === 'heading') return <Text style={{ color: palette.muted, fontSize: 14, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 }}>{item.text}</Text>;
    if (item.kind === 'surah') return (
      <Pressable onPress={() => setExpanded(current => { const next = new Set(current); if (next.has(item.surah)) next.delete(item.surah); else next.add(item.surah); return next; })}
        accessibilityRole="button" accessibilityState={{ expanded: item.open }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ transform: [{ rotate: item.open ? '0deg' : '90deg' }] }}><ChevronDown size={16} color={palette.muted} /></View>
        <Text style={{ flex: 1, fontSize: 16, color: item.current ? palette.accent : palette.ink, textAlign: 'right' }}>{surahName(item.surah)}</Text>
        <Text style={{ fontSize: 13, color: palette.muted }}>{num(item.count)}</Text>
      </Pressable>
    );
    const pair = item.pair;
    const from = item.kind === 'pair' ? item.lead : pair.a;
    const current = isCurrent(pair, from);
    const label = item.kind === 'story' ? item.name : pair.a === pair.b ? (item.nested ? 'مع نفسها' : `${surahName(pair.a)} مع نفسها`) : item.nested ? surahName(otherOf(pair, from)) : `${surahName(pair.a)} · ${surahName(pair.b)}`;
    return (
      <Pressable onPress={() => onPick(from, otherOf(pair, from))} accessibilityRole="button" accessibilityState={{ selected: current }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, marginRight: item.kind === 'pair' && item.nested ? 22 : 0, borderRightWidth: 2, borderColor: current ? palette.accent : item.kind === 'pair' && item.nested ? palette.rule : 'transparent', backgroundColor: current ? palette.paperDeep : 'transparent', borderRadius: 6 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, color: palette.ink, textAlign: 'right' }}>{label}</Text>
          {item.kind === 'story' && <Text style={{ fontSize: 12, color: palette.muted, textAlign: 'right' }}>{surahName(pair.a)} · {surahName(pair.b)}</Text>}
        </View>
        <Text style={{ fontSize: 14, color: palette.accent }}>{num(pair.count)}</Text>
      </Pressable>
    );
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable onPress={close} accessibilityLabel="إغلاق" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        <Animated.View style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '85%', direction: 'rtl', backgroundColor: palette.paper, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderTopWidth: 1, borderColor: palette.rule, paddingHorizontal: 12, paddingBottom: insets.bottom + 8, gap: 8 }, moved]}>
          <GestureDetector gesture={pan}>
            <View style={{ height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: palette.rule }} />
              <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="إغلاق" hitSlop={8} style={{ position: 'absolute', left: 0, padding: 6 }}><X size={20} color={palette.muted} /></Pressable>
            </View>
          </GestureDetector>
          <View style={{ justifyContent: 'center' }}>
            <TextInput value={query} onChangeText={setQuery} placeholder="ابحث عن سورة: الطور، ٥٢…" placeholderTextColor={palette.muted} accessibilityLabel="ابحث عن سورة"
              style={[field, { paddingRight: 34, textAlign: 'right' }]} />
            <View pointerEvents="none" style={{ position: 'absolute', right: 10 }}><Search size={16} color={palette.muted} /></View>
          </View>
          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: palette.rule, borderRadius: 10, padding: 2 }} accessibilityLabel="ترتيب القائمة">
            {[{ count: false, label: 'ترتيب المصحف', Icon: ArrowDown01 }, { count: true, label: 'الأكثر تشابهًا', Icon: ArrowDownWideNarrow }].map(({ count, label, Icon }) => (
              <Pressable key={label} onPress={() => { setByCount(count); writeJson(SORT_KEY, count); }} accessibilityRole="button" accessibilityState={{ selected: byCount === count }} style={sortButton(byCount === count)}>
                <Icon size={16} color={byCount === count ? palette.onAccent : palette.muted} />
                <Text style={{ fontSize: 15, color: byCount === count ? palette.onAccent : palette.ink }}>{label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Pressable onPress={() => setFiltering(!filtering)} accessibilityRole="button" accessibilityLabel={`تصفية: ${scopeText(filter)}`} accessibilityState={{ expanded: filtering }}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, height: 44, borderWidth: 1, borderColor: filtering || filtered ? palette.accent : palette.rule, borderRadius: 10 }}>
              <Funnel size={16} color={filtered ? palette.accent : palette.muted} />
              <Text numberOfLines={1} style={{ flex: 1, fontSize: 15, color: filtered ? palette.accent : palette.ink, textAlign: 'right' }}>{scopeText(filter)}</Text>
              <View style={{ transform: [{ rotate: filtering ? '180deg' : '0deg' }] }}><ChevronDown size={16} color={palette.muted} /></View>
            </Pressable>
            {filtered && <Pressable onPress={() => { onFilter({}); setDraftState(draftOf(listOfFilter({}))); }} accessibilityRole="button" accessibilityLabel="إعادة ضبط" hitSlop={4}
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><RotateCcw size={20} color={palette.ink} /></Pressable>}
          </View>
          {filtering
            ? <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8, gap: 18 }} keyboardShouldPersistTaps="handled">
                <FilterFields compare draft={draft} setDraft={setDraft} palette={palette} />
                <Pressable onPress={() => setFiltering(false)} accessibilityRole="button"
                  style={{ alignSelf: 'center', paddingHorizontal: 20, height: 44, justifyContent: 'center', borderRadius: 22, backgroundColor: palette.accent }}>
                  <Text style={{ color: palette.onAccent, fontSize: 15 }}>{pairs.length ? `عرض ${num(pairs.length)} زوجًا` : 'لا صفحات بهذه التصفية'}</Text>
                </Pressable>
              </ScrollView>
            : <FlatList data={rows} keyExtractor={row => row.key} renderItem={renderRow} keyboardShouldPersistTaps="handled" style={{ flex: 1 }}
                ListFooterComponent={empty ? <Text style={{ color: palette.muted, padding: 12, textAlign: 'right' }}>{query.trim() ? 'لا سورة بهذا البحث.' : 'لا صفحات بهذه التصفية.'}</Text> : undefined} />}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
