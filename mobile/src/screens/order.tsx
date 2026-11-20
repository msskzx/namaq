import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { citeLabel, citeUrl, ORDER_JUZ, orderInJuz, orderSurahs, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import HelpSheet from '@/components/HelpSheet';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import { ayahMushafWords } from '@/lib/mushaf';
import IconButton from '@/ui/IconButton';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';

const SURAHS = orderSurahs(ayahMushafWords, num);
type Row = { kind: 'link'; surah: number; link: OrderLinkView } | { kind: 'surah'; s: OrderSurah };

function Source({ cite, palette }: { cite: Cite; palette: Palette }) {
  return (
    <ExternalLink url={citeUrl(cite)} color={palette.muted} size={13}
      style={{ textDecorationLine: 'underline', textDecorationColor: palette.rule, textAlign: 'right' }}>
      {citeLabel(cite, num)}
    </ExternalLink>
  );
}

const quote = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'justify' as const, writingDirection: 'rtl' as const });

function PairAyah({ ayah, palette }: { ayah: OrderAyah; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 13, minWidth: 64 }}>{ayah.place}</Text>
      <AyahFlow color={palette.ink} style={{ flex: 1 }}>
        {ayah.words.map((w, i) => <AyahWords key={i} look={w.shared ? { color: palette.accent } : undefined}>{`${w.text} `}</AyahWords>)}
      </AyahFlow>
    </View>
  );
}

function LinkBlock({ link, palette }: { link: OrderLinkView; palette: Palette }) {
  return (
    <View accessibilityLabel="الصلة بما قبلها" style={{ marginStart: 22, borderStartWidth: 2, borderColor: palette.rule, paddingStart: 14, paddingVertical: 4, gap: 2 }}>
      <Text style={quote(palette)}>«{link.text}»</Text>
      {link.pairs.map(([a, b]) => (
        <View key={a.key + b.key}>
          <PairAyah ayah={a} palette={palette} />
          <PairAyah ayah={b} palette={palette} />
        </View>
      ))}
      <Source cite={link.src} palette={palette} />
    </View>
  );
}

function SurahCard({ s, palette }: { s: OrderSurah; palette: Palette }) {
  return (
    <Card palette={palette} pad={[6, 14]}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>{s.name}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{num(s.surah)}</Text>
      </View>
      <AyahFlow color={palette.ink}>
        {s.opening.map(a => [
          <AyahWords key={a.ayah}>{`${a.text} `}</AyahWords>,
          <AyahWords key={`${a.ayah}-n`} look={{ color: palette.amber }}>{`${num(a.ayah)} `}</AyahWords>,
        ])}
      </AyahFlow>
      <Text style={[quote(palette), { marginTop: 4 }]}>«{s.aim.text}»</Text>
      <Source cite={s.aim.src} palette={palette} />
      {/* Card actions on the right (owner): the mushaf. */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <IconButton Icon={BookOpen} label={`افتح سورة ${s.name} في المصحف`} onPress={() => readAyah(`${s.surah}:1`)} size="small" />
      </View>
    </Card>
  );
}

/**
 * The website's /quran/order on the phone (owner, 2026-11-13): from al-Fatiha to al-Nas, each surah's opening ayat and aim,
 * and between two surahs what joins them, all quoted from the books with their pages. A juz chip narrows the list.
 * docs/plans/quran-order-sources.md
 */
export default function OrderScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<ComponentRef<typeof FlatList<Row>>>(null);
  const top = useRef(0);
  // `juz` opens the list at a juz, as «رتّب السور» links it after an answer.
  const asked = Number(useLocalSearchParams<{ juz?: string }>().juz);
  const opened = ORDER_JUZ.includes(asked) ? asked : null;
  const [juz, setJuz] = useState<number | null>(opened);
  useEffect(() => { if (opened) setJuz(opened); }, [opened]);
  const [help, setHelp] = useState(false);
  const rows = useMemo(() => orderInJuz(SURAHS, juz).flatMap((s, i): Row[] => [
    ...(s.link && i > 0 ? [{ kind: 'link' as const, surah: s.surah, link: s.link }] : []),
    { kind: 'surah', s },
  ]), [juz]);
  useTabRetap('order', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setJuz(null); });
  const pick = (value: number | null) => { setJuz(value); list.current?.scrollToOffset({ offset: 0, animated: false }); };
  const chip = (label: string, value: number | null) => <Chip key={label} label={label} on={juz === value} onPress={() => pick(value)} palette={palette} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll help={() => setHelp(true)} />
      {/* Inverted in a left-to-right box, as the home shelves, so «الكل» sits on the right on every platform. */}
      <View style={{ direction: 'ltr' }}>
        <FlatList data={[null, ...ORDER_JUZ]} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={value => String(value)}
          style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
          renderItem={({ item }) => chip(item === null ? 'الكل' : num(item), item)} />
      </View>
      <FlatList ref={list} data={rows} keyExtractor={row => (row.kind === 'link' ? `link-${row.surah}` : String(row.s.surah))}
        onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom, gap: 10 }}
        renderItem={({ item }) => (item.kind === 'link' ? <LinkBlock link={item.link} palette={palette} /> : <SurahCard s={item.s} palette={palette} />)} />
      <HelpSheet topic={help ? 'order' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}

