import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import data from '@shared/data/quran/surahOrder.json';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { citeLabel, citeUrl, ORDER_JUZ, orderInJuz, orderSurahs, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';
import { Text } from '@/components/Text';
import ExternalLink from '@/components/ExternalLink';
import HelpSheet from '@/components/HelpSheet';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { useTabRetap } from '@/lib/tabRetap';
import { back } from '@/lib/ways';
import { CARD, QURAN_FONT, usePalette, type Palette } from '@/lib/theme';

const SURAHS = orderSurahs(data, num);
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
      <Text style={{ flex: 1, fontFamily: QURAN_FONT, fontSize: 19, lineHeight: 36, color: palette.ink, writingDirection: 'rtl' }}>
        {ayah.words.map((w, i) => <Text key={i} style={{ fontFamily: QURAN_FONT, color: w.shared ? palette.accent : palette.ink }}>{`${mushafText(w.text)} `}</Text>)}
      </Text>
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
    <View style={{ ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, paddingHorizontal: 14, paddingTop: 8, paddingBottom: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>{s.name}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{num(s.surah)}</Text>
      </View>
      <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 42, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
        {s.opening.map(a => [
          <Text key={a.ayah} style={{ fontFamily: QURAN_FONT }}>{`${mushafText(a.text)} `}</Text>,
          <Text key={`${a.ayah}-n`} style={{ fontFamily: QURAN_FONT, color: palette.amber }}>{`${num(a.ayah)} `}</Text>,
        ])}
      </Text>
      <Text style={[quote(palette), { marginTop: 4 }]}>«{s.aim.text}»</Text>
      <Source cite={s.aim.src} palette={palette} />
      {/* Card actions on the right (owner): the mushaf. */}
      <View style={{ flexDirection: 'row', gap: 4 }}>
        <Pressable onPress={() => readAyah(`${s.surah}:1`)} accessibilityRole="button" accessibilityLabel={`افتح سورة ${s.name} في المصحف`} hitSlop={6} style={{ padding: 8 }}>
          <BookOpen size={19} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
}

/**
 * The website's /quran/order on the phone (owner, 2026-11-13): from Fussilat to al-Nas, each surah's opening ayat and aim,
 * and between two surahs what joins them, all quoted from the books with their pages. A juz chip narrows the list.
 * docs/plans/quran-order-sources.md
 */
export default function OrderScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<ComponentRef<typeof FlatList<Row>>>(null);
  const top = useRef(0);
  const [juz, setJuz] = useState<number | null>(null);
  const [help, setHelp] = useState(false);
  const rows = useMemo(() => orderInJuz(SURAHS, juz).flatMap((s, i): Row[] => [
    ...(s.link && i > 0 ? [{ kind: 'link' as const, surah: s.surah, link: s.link }] : []),
    { kind: 'surah', s },
  ]), [juz]);
  useTabRetap('order', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setJuz(null); });
  const pick = (value: number | null) => { setJuz(value); list.current?.scrollToOffset({ offset: 0, animated: false }); };
  const chip = (label: string, value: number | null) => {
    const on = juz === value;
    return (
      <Pressable key={label} onPress={() => pick(value)} accessibilityRole="button" accessibilityState={{ selected: on }}
        style={{ paddingHorizontal: 14, height: 34, justifyContent: 'center', borderRadius: 999, borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent' }}>
        <Text style={{ fontSize: 16, color: on ? palette.onAccent : palette.ink }}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll help={() => setHelp(true)} />
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

