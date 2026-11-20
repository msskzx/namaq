import { useEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, ScrollView, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { linkShows, orderSource, ORDER_JUZ, orderInJuz, orderSurahs, toggledJuz, type Cite, type OrderAyah, type OrderLinkView, type OrderSurah } from '@shared/quran/surahOrder';
import { Text } from '@/ui/Text';
import SourceLine from '@/ui/SourceLine';
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
import { CardWithRow } from '@/ui/Card';
import Chip from '@/ui/Chip';

const SURAHS = orderSurahs(ayahMushafWords, num);

/** A quote's book as the line under it (owner 2026-11-20): its page and full title in the line's sheet. */
function Source({ cite, palette }: { cite: Cite; palette: Palette }) {
  const source = [orderSource(cite, num)];
  return <SourceLine named={source} sources={source} palette={palette} />;
}

const quote = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 31, textAlign: 'justify' as const, writingDirection: 'rtl' as const });

function PairAyah({ ayah, palette }: { ayah: OrderAyah; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
      <Text style={{ color: palette.muted, fontSize: 13, minWidth: 64 }}>{ayah.place}</Text>
      <AyahFlow color={palette.ink} screen style={{ flex: 1 }}>
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
    <CardWithRow palette={palette} pad={[6, 14]} source={[orderSource(s.aim.src, num)]}
      lead={<IconButton Icon={BookOpen} label={`افتح سورة ${s.name} في المصحف`} onPress={() => readAyah(`${s.surah}:1`)} />}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
        <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 22, fontWeight: '700' }}>{s.name}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{num(s.surah)}</Text>
      </View>
      <AyahFlow color={palette.ink} screen>
        {s.opening.map(a => [
          <AyahWords key={a.ayah}>{`${a.text} `}</AyahWords>,
          <AyahWords key={`${a.ayah}-n`} look={{ color: palette.amber }}>{`${num(a.ayah)} `}</AyahWords>,
        ])}
      </AyahFlow>
      <Text style={[quote(palette), { marginTop: 4, marginBottom: 6 }]}>«{s.aim.text}»</Text>
    </CardWithRow>
  );
}

/**
 * The website's /quran/order on the phone (owner, 2026-11-13): from al-Fatiha to al-Nas, each surah's opening ayat and aim,
 * and between two surahs what joins them, all quoted from the books with their pages. Juz chips narrow the list, several at once.
 * docs/plans/quran-order-sources.md
 */
export default function OrderScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const top = useRef(0);
  // `juz` opens the list at a juz, as «رتّب السور» links it after an answer.
  const asked = Number(useLocalSearchParams<{ juz?: string }>().juz);
  const opened = ORDER_JUZ.includes(asked) ? asked : null;
  // Several juz at once (owner, 2026-11-20); none picked shows them all.
  const [juz, setJuz] = useState<readonly number[]>(opened ? [opened] : []);
  useEffect(() => { if (opened) setJuz([opened]); }, [opened]);
  const [help, setHelp] = useState(false);
  const shown = useMemo(() => orderInJuz(SURAHS, juz), [juz]);
  useTabRetap('order', () => { if (top.current > 4) scroll.current?.scrollTo({ y: 0, animated: true }); else setJuz([]); });
  const pick = (value: number | null) => { setJuz(value === null ? [] : toggledJuz(juz, value)); scroll.current?.scrollTo({ y: 0, animated: false }); };
  const chip = (label: string, value: number | null) => <Chip key={label} label={label} on={value === null ? !juz.length : juz.includes(value)} onPress={() => pick(value)} palette={palette} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll help={() => setHelp(true)} />
      {/* Inverted in a left-to-right box, as the home shelves, so «الكل» sits on the right on every platform. */}
      <View style={{ direction: 'ltr' }}>
        <FlatList data={[null, ...ORDER_JUZ]} horizontal inverted showsHorizontalScrollIndicator={false} keyExtractor={value => String(value)}
          extraData={juz} style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 6 }}
          renderItem={({ item }) => chip(item === null ? 'الكل' : num(item), item)} />
      </View>
      {/* A plain scroll, not a virtualized list (owner, 2026-11-20: the list flickered while scrolling): every card is laid out
          once, at its final size, so nothing above the reader is measured again and moves the page. */}
      <ScrollView ref={scroll} onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottom, gap: 10 }}>
        {shown.flatMap((s, i) => [
          ...(linkShows(shown, i) ? [<LinkBlock key={`link-${s.surah}`} link={s.link!} palette={palette} />] : []),
          <SurahCard key={s.surah} s={s} palette={palette} />,
        ])}
      </ScrollView>
      <HelpSheet topic={help ? 'order' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}
