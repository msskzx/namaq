import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Pressable, Share, View } from 'react-native';
import { BookOpen, Send } from 'lucide-react-native';
import { ayahHref } from '@shared/ayahMarks';
import { num } from '@shared/quran/arabicNumber';
import { BY_QUOTES, OATH_BY, OATH_QUOTES, citesOf, kindQuotes, oathSections, sectionQuotes, type OathBy } from '@shared/quran/oathSources';
import { buildOaths, oathPlace, oathShareText, type OathKind, type OathView } from '@shared/quran/oaths';
import { Text } from '@/ui/Text';
import Reference from '@/ui/Reference';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { ayahMushafWords } from '@/lib/mushaf';
import { WEBSITE } from '@/lib/website';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { useTabRetap } from '@/lib/tabRetap';
import { QURAN_FONT, usePalette, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import Card from '@/ui/Card';

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
        {quotes && <Reference title={citesOf(quotes)} quotes={quotes} palette={palette} />}
      </View>
      <Card palette={palette} pad={[6, 14]}>
        <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 42, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
          {oath.lines.map(line => [
            ...line.words.map((word, i) => <Text key={`${line.ayah}-${i}`} style={{ fontFamily: QURAN_FONT, color: word.sworn ? palette.accent : palette.ink }}>{`${word.text} `}</Text>),
            <Text key={`${line.ayah}-n`} style={{ fontFamily: QURAN_FONT, color: palette.amber }}>{`${num(line.ayah)} `}</Text>,
          ])}
        </Text>
      </Card>
      {/* Card actions under the card, on the right (owner): the mushaf, then share last. */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <IconButton Icon={BookOpen} label={`افتح ${place} في المصحف`} onPress={() => readAyah(oath.id)} size="small" />
        <IconButton Icon={Send} label={`شارك ${place}`} onPress={() => shareOath(oath)} size="small" />
      </View>
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
  const chip = (label: string, value: OathBy | null) => {
    const on = by === value;
    return (
      <Pressable key={label} onPress={() => setBy(value)} accessibilityRole="button" accessibilityState={{ selected: on }}
        style={{ paddingHorizontal: 14, height: 34, justifyContent: 'center', borderRadius: 999, borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent' }}>
        <Text style={{ fontSize: 16, color: on ? palette.onAccent : palette.ink }}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll />
      <View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', padding: 3, borderRadius: 12, backgroundColor: palette.paperDeep }}>
          {KINDS.map(option => {
            const on = option.kind === kind;
            return (
              <Pressable key={option.kind} onPress={() => pick(option.kind)} accessibilityRole="tab" accessibilityState={{ selected: on }}
                style={{ flex: 1, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: on ? palette.accent : 'transparent' }}>
                <Text style={{ fontSize: 16, color: on ? palette.onAccent : palette.muted }}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      {/* The references and chips scroll with the list, as on the website, so an open reference never pins the cards down. */}
      <FlatList ref={list} data={rows} keyExtractor={row => ('head' in row ? row.head.on : row.oath.id)} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: bottom, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 4 }}>
            <Reference key={kind} title={citesOf(kindQuotes(kind))} quotes={kindQuotes(kind)} palette={palette} />
            {kind === 'allah' && (
              <>
                {/* Inverted in a left-to-right box, as the home shelves, so «الكل» sits on the right on every platform. */}
                <View style={{ direction: 'ltr', marginHorizontal: -16 }}>
                  <FlatList data={[null, ...OATH_BY.map(b => b.by)]} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={value => value ?? 'all'}
                    style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 6 }}
                    renderItem={({ item }) => chip(item ? OATH_BY.find(b => b.by === item)!.label : 'الكل', item)} />
                </View>
                <Reference title={citesOf(BY_QUOTES)} quotes={BY_QUOTES} palette={palette} />
              </>
            )}
          </View>
        }
        renderItem={({ item }) => ('head' in item ? (
          <View style={{ paddingTop: 8, gap: 2 }}>
            <Text accessibilityRole="header" style={{ fontSize: 20, fontWeight: '700', color: palette.accent }}>{item.head.title}</Text>
            <Reference title={citesOf(sectionQuotes(item.head))} quotes={sectionQuotes(item.head)} palette={palette} />
          </View>
        ) : <OathCard oath={item.oath} palette={palette} />)} />
    </View>
  );
}
