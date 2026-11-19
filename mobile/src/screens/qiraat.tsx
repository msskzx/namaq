import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import { ChevronUp } from 'lucide-react-native';
import Empty from '@/ui/Empty';
import ExternalLink from '@/ui/ExternalLink';
import { SearchField } from '@/ui/Field';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import { back } from '@/lib/ways';
import { QIRAAT_SOURCE, READERS, RIWAYAT, type ReaderId } from '@shared/quran/qiraat';
import { filterName, filterRawis, qiraatPlaces, riwayatOf, type QiraatFilter } from '@shared/quran/qiraatPlaces';
import { surahName } from '@shared/quran/surahNames';
import QiraatPlace from '@/components/QiraatPlace';

type Row = { kind: 'surah'; surah: number } | { kind: 'place'; key: string; words: number[] };

/**
 * «القراءات» (owner, 2026-11-19): every place the ten readers differ, under its surah in the mushaf's order, found by a word
 * or a surah's name. A reader's chip keeps the places where he reads otherwise than Hafs and shades his reading; under it,
 * his two riwayat. Opened from the feed's readings card, it starts at that card's ayah.
 */
export default function QiraatScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<FlatList<Row>>(null);
  // `at` changes on every open from a card, so a second open of the same ayah scrolls to it again.
  const { ayah, at } = useLocalSearchParams<{ ayah?: string; at?: string }>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<QiraatFilter>({});
  useTabRetap('qiraat', () => list.current?.scrollToOffset({ offset: 0, animated: true }));
  const rows = useMemo(() => qiraatPlaces(filter, query).flatMap((surah): Row[] => [
    { kind: 'surah', surah: surah.surah }, ...surah.places.map(place => ({ kind: 'place' as const, ...place })),
  ]), [filter, query]);
  const mark = filterRawis(filter);
  const reader = (id: ReaderId | undefined) => { setFrom(undefined); setFilter(id ? { reader: id } : {}); };
  // Opened for an ayah (the feed's readings card): the filters and search are cleared and the list starts at that ayah's
  // place, its surah's heading first; a button above brings back the places before it. A list of rows of many heights
  // cannot jump to a far row reliably, so it starts there instead.
  const [from, setFrom] = useState<string | undefined>(ayah);
  useEffect(() => {
    if (!ayah) return;
    setFilter({});
    setQuery('');
    setFrom(ayah);
    list.current?.scrollToOffset({ offset: 0, animated: false });
  }, [ayah, at]);
  const start = from ? rows.findIndex(row => row.kind === 'place' && row.key === from) : -1;
  const shown = start > 0 ? rows.slice(rows[start - 1].kind === 'surah' ? start - 1 : start) : rows;
  const head = (
    <View style={{ gap: 10, paddingBottom: 4 }}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>القراءات</Text>
      <SearchField palette={palette} label="ابحث عن كلمة أو سورة" placeholder="ابحث عن كلمة أو سورة" value={query} onChangeText={text => { setFrom(undefined); setQuery(text); }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="tablist">
        <Chip role="tab" label="الكل" on={!filter.reader} onPress={() => reader(undefined)} palette={palette} />
        {READERS.map(r => <Chip key={r.id} role="tab" label={r.name} on={filter.reader === r.id} onPress={() => reader(r.id)} palette={palette} />)}
      </View>
      {filter.reader && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} accessibilityRole="tablist">
          <Chip role="tab" label={READERS.find(r => r.id === filter.reader)!.name} on={!filter.riwaya} onPress={() => { setFrom(undefined); setFilter({ reader: filter.reader }); }} palette={palette} />
          {riwayatOf(filter.reader).map(n => (
            <Chip key={n} role="tab" label={RIWAYAT[n - 1].name} on={filter.riwaya === n} onPress={() => { setFrom(undefined); setFilter({ reader: filter.reader, riwaya: n }); }} palette={palette} />
          ))}
        </View>
      )}
      {filter.reader && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`المواضع التي يقرأ فيها ${filterName(filter)} بغير قراءة حفص`}</Text>}
      {shown !== rows && <Button label="المواضع قبلها" Icon={ChevronUp} onPress={() => setFrom(undefined)} />}
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <FlatList ref={list} data={shown} onScroll={shrink} scrollEventThrottle={16} keyboardShouldPersistTaps="handled"
        keyExtractor={row => (row.kind === 'surah' ? `s${row.surah}` : row.key)}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 10 }}
        ListHeaderComponent={head}
        ListEmptyComponent={<Empty text="لا موضع بهذه الكلمة. جرّب كلمة أقصر." palette={palette} />}
        ListFooterComponent={rows.length ? (
          <ExternalLink url={QIRAAT_SOURCE.url} color={palette.muted} size={14} style={{ textAlign: 'right' }}>{`المصدر: ${QIRAAT_SOURCE.name}`}</ExternalLink>
        ) : undefined}
        renderItem={({ item }) => (item.kind === 'surah'
          ? <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: 6 }}>{surahName(item.surah)}</Text>
          : <QiraatPlace ayah={item.key} words={item.words} mark={mark} palette={palette} />)} />
    </View>
  );
}
