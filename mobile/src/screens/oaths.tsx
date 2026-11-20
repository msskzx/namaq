import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Share, View } from 'react-native';
import { BookOpen, Send } from 'lucide-react-native';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
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
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import IconButton from '@/ui/IconButton';
import { CardWithRow } from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import Chip from '@/ui/Chip';

const KINDS: { kind: OathKind; label: string }[] = [{ kind: 'allah', label: 'أقسم الله' }, { kind: 'others', label: 'أقسم غيره' }];
const BUILT = { allah: buildOaths('allah', ayahMushafWords), others: buildOaths('others', ayahMushafWords) };
const BY_ID = new Map(BUILT.allah.map(oath => [oath.id, oath]));

/** A row of the list: a section's heading with its reference, or an oath's card. */
type Row = { head: ReturnType<typeof oathSections>[number] } | { oath: OathView };
const rowsOf = (kind: OathKind, by: OathBy | null): Row[] =>
  kind === 'others' ? BUILT.others.map(oath => ({ oath })) : oathSections(by).flatMap(head => [{ head }, ...head.oaths.map(id => ({ oath: BY_ID.get(id)! }))]);

function shareOath(oath: OathView) {
  void Share.share({ message: `${oathShareText(oath, num)}\n${WEBSITE}${ayahHref(oath.id)}` });
}

function OathCard({ oath, palette }: { oath: OathView; palette: Palette }) {
  const place = oathPlace(oath, num);
  const quotes = OATH_QUOTES[oath.id];
  return (
    <View style={{ gap: 2 }}>
      {/* The home feed's head (owner, 2026-11-16): a bold title, a muted line under it, then the card. */}
      <View style={{ paddingHorizontal: 4 }}>
        <Text accessibilityRole="header" style={{ fontSize: 16, fontWeight: '700', color: palette.ink }}>{place}</Text>
        {oath.who && <Text style={{ color: palette.muted, fontSize: 14 }}>{oath.who}</Text>}
      </View>
      {/* The home card's shape (owner 2026-11-20): the mushaf first in the row, share last, the books on the line. */}
      <CardWithRow palette={palette} pad={[6, 14]} source={[...(quotes ? [{ line: citesOf(quotes), quotes }] : []), ...sourcesOf([mushafSource(oath.id)])]}
        lead={<IconButton Icon={BookOpen} label={`افتح ${place} في المصحف`} onPress={() => readAyah(oath.id)} />}
        row={<IconButton Icon={Send} label={`شارك ${place}`} onPress={() => shareOath(oath)} />}>
        <AyahFlow color={palette.ink}>
          {oath.lines.map(line => [
            ...line.words.map((word, i) => <AyahWords key={`${line.ayah}-${i}`} look={word.sworn ? { color: palette.accent } : undefined}>{`${word.text} `}</AyahWords>),
            <AyahWords key={`${line.ayah}-n`} look={{ color: palette.amber }}>{`${num(line.ayah)} `}</AyahWords>,
          ])}
        </AyahFlow>
      </CardWithRow>
    </View>
  );
}

/**
 * The website's /quran/oaths on the phone (owner, 2026-11-13): every oath in the Quran, Allah's or those it quotes from others,
 * the words sworn by in colour. Allah's are grouped by what He swears on, as Ibn al-Qayyim names it, and a chip keeps only those
 * sworn by one of al-Suyuti's kinds (owner, 2026-11-16). docs/plans/quran-oaths-full.md
 */
export default function OathsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<ComponentRef<typeof FlatList<Row>>>(null);
  const top = useRef(0);
  const [kind, setKind] = useState<OathKind>('allah');
  const [by, setBy] = useState<OathBy | null>(null);
  const rows = useMemo(() => rowsOf(kind, by), [kind, by]);
  useTabRetap('oaths', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setBy(null); });
  const pick = (next: OathKind) => { setKind(next); setBy(null); list.current?.scrollToOffset({ offset: 0, animated: false }); };
  const chip = (label: string, value: OathBy | null) => <Chip key={label} label={label} on={by === value} onPress={() => setBy(value)} palette={palette} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        <Tabs options={KINDS.map(option => ({ key: option.kind, label: option.label }))} value={kind} onChange={pick} palette={palette} fill />
      </View>
      {/* The references and chips scroll with the list, as on the website, so an open reference never pins the cards down. */}
      <FlatList ref={list} data={rows} keyExtractor={row => ('head' in row ? row.head.on : row.oath.id)} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: bottom, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 4 }}>
            <SourceLine key={kind} sources={[{ line: citesOf(kindQuotes(kind)), quotes: kindQuotes(kind) }]} palette={palette} />
            {kind === 'allah' && (
              <>
                {/* Inverted in a left-to-right box, as the home shelves, so «الكل» sits on the right on every platform. */}
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
