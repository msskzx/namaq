import { useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, Share, View } from 'react-native';
import { Send } from 'lucide-react-native';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { holdsTerms } from '@shared/quran/searchAll';
import Empty from '@/ui/Empty';
import { BY_QUOTES, OATH_BY, OATH_QUOTES, citesOf, kindQuotes, oathSections, sectionQuotes, type OathBy } from '@shared/quran/oathSources';
import { buildOaths, oathPlace, oathShareText, type OathKind, type OathView } from '@shared/quran/oaths';
import { Text } from '@/ui/Text';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { mushafSource } from '@shared/quiz/sources';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { ayahMushafWords } from '@/lib/mushaf';
import { WEBSITE } from '@/lib/website';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette, type Palette } from '@/lib/theme';
import OathWords from '@/components/OathWords';
import IconButton from '@/ui/IconButton';
import { CardWithRow } from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import Chip from '@/ui/Chip';
import { FEATURE_ICON } from '@/components/featureIcons';
import { useLater } from '@/lib/hooks/useLater';
import { useOnChange } from '@/lib/hooks/useOnChange';

const KINDS: { kind: OathKind; label: string }[] = [{ kind: 'allah', label: 'أقسم الله' }, { kind: 'others', label: 'أقسم غيره' }];
const BUILT = { allah: buildOaths('allah', ayahMushafWords), others: buildOaths('others', ayahMushafWords) };
const BY_ID = new Map(BUILT.allah.map(oath => [oath.id, oath]));

type Row = { head: ReturnType<typeof oathSections>[number] } | { oath: OathView };
const oathText = (oath: OathView) => [oathPlace(oath, num), oath.who ?? '', ...oath.by, ...oath.lines.flatMap(line => line.words.map(word => word.text))].join(' ');
const rowsOf = (kind: OathKind, by: OathBy | null, query = ''): Row[] => {
  const held = (oath: OathView) => !query.trim() || holdsTerms(oathText(oath), query);
  if (kind === 'others') return BUILT.others.filter(held).map(oath => ({ oath }));
  return oathSections(by).flatMap(head => {
    const oaths = head.oaths.map(id => BY_ID.get(id)!).filter(held);
    return oaths.length ? [{ head }, ...oaths.map(oath => ({ oath }))] : [];
  });
};

function shareOath(oath: OathView) {
  void Share.share({ message: `${oathShareText(oath, num)}\n${WEBSITE}${ayahHref(oath.id)}` });
}

function OathCard({ oath, palette }: { oath: OathView; palette: Palette }) {
  const place = oathPlace(oath, num);
  const quotes = OATH_QUOTES[oath.id];
  return (
    <View style={{ gap: 2 }}>
      <View style={{ paddingHorizontal: 4 }}>
        <Text accessibilityRole="header" style={{ fontSize: 16, fontWeight: '700', color: palette.ink }}>{place}</Text>
        {oath.who && <Text style={{ color: palette.muted, fontSize: 14 }}>{oath.who}</Text>}
      </View>
      <CardWithRow palette={palette} pad={[6, 14]} source={[...(quotes ? [{ line: citesOf(quotes), quotes }] : []), ...sourcesOf([mushafSource(oath.id)])]}
        lead={<IconButton Icon={FEATURE_ICON.mushaf} label={`افتح ${place} في المصحف`} onPress={() => readAyah(oath.id)} />}
        row={<IconButton Icon={Send} label={`شارك ${place}`} onPress={() => shareOath(oath)} />}>
        <OathWords oath={oath} palette={palette} />
      </CardWithRow>
    </View>
  );
}

// see docs/plans/quran-oaths-full.md
export default function OathsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<ComponentRef<typeof FlatList<Row>>>(null);
  const top = useRef(0);
  const { at } = useLocalSearchParams<{ at?: string }>();
  const [kind, setKind] = useState<OathKind>(() => (BUILT.others.some(oath => oath.id === at) ? 'others' : 'allah'));
  const [by, setBy] = useState<OathBy | null>(null);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query);
  const rows = useMemo(() => rowsOf(kind, by, typed), [kind, by, typed]);
  const reached = useRef<string | undefined>(undefined);
  const atRow = at && reached.current !== at && !typed.trim() ? rows.findIndex(row => 'oath' in row && row.oath.id === at) : -1;
  const later = useLater();
  useOnChange([atRow, at], () => {
    if (atRow < 0) return;
    reached.current = at;
    later.nextFrame(() => list.current?.scrollToIndex({ index: atRow, animated: false, viewOffset: 8 }));
  });
  useTabRetap('oaths', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setBy(null); });
  const pick = (next: OathKind) => { setKind(next); setBy(null); list.current?.scrollToOffset({ offset: 0, animated: false }); };
  const chip = (label: string, value: OathBy | null) => <Chip key={label} label={label} on={by === value} onPress={() => setBy(value)} palette={palette} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأقسام', label: 'ابحث في الأقسام' }} />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        <Tabs options={KINDS.map(option => ({ key: option.kind, label: option.label }))} value={kind} onChange={pick} palette={palette} fill />
      </View>
      <FlatList ref={list} data={rows} keyExtractor={row => ('head' in row ? row.head.on : row.oath.id)} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: bottom, gap: 10 }}
        ListEmptyComponent={<Empty text="لا قسم فيه هذه الكلمات" palette={palette} />}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          list.current?.scrollToOffset({ offset: index * averageItemLength, animated: false });
          later.after(50, () => list.current?.scrollToIndex({ index, animated: false, viewOffset: 8 }));
        }}
        ListHeaderComponent={
          <View style={{ gap: 4 }}>
            <SourceLine key={kind} sources={[{ line: citesOf(kindQuotes(kind)), quotes: kindQuotes(kind) }]} palette={palette} />
            {kind === 'allah' && (
              <>
                <View style={{ direction: 'ltr', marginHorizontal: -16 }}>
                  <FlatList data={[null, ...OATH_BY.map(b => b.by)]} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={value => value ?? 'all'}
                    style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 6 }}
                    renderItem={({ item }) => chip(item ? OATH_BY.find(b => b.by === item)!.label : 'الكل', item)} />
                </View>
                <SourceLine sources={[{ line: citesOf(BY_QUOTES), quotes: BY_QUOTES }]} palette={palette} />
              </>
            )}
          </View>
        }
        renderItem={({ item }) => ('head' in item ? (
          <View style={{ paddingTop: 8, gap: 2 }}>
            <Text accessibilityRole="header" style={{ fontSize: 20, fontWeight: '700', color: palette.accent }}>{item.head.title}</Text>
            <SourceLine sources={[{ line: citesOf(sectionQuotes(item.head)), quotes: sectionQuotes(item.head) }]} palette={palette} />
          </View>
        ) : <OathCard oath={item.oath} palette={palette} />)} />
    </View>
  );
}
