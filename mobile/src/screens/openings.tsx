import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, PenLine, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { CONDITION_SPANS, OPENING_KINDS, conditionLines, inKind, kindLabel, openingCards, type OpeningCard, type OpeningKindId, type OpeningWord } from '@shared/quran/openingKinds';
import { Text } from '@/components/Text';
import HelpSheet from '@/components/HelpSheet';
import TopBar from '@/components/TopBar';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { ayahOf, surahNames } from '@/lib/branches';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { useTabRetap } from '@/lib/tabRetap';
import { back } from '@/lib/ways';
import { CARD, QURAN_FONT, usePalette, type Palette } from '@/lib/theme';

const words = (key: string) => ayahOf(key)?.words ?? [];

function Ayah({ words: list, cut, palette, size = 22 }: { words: OpeningWord[]; cut?: boolean; palette: Palette; size?: number }) {
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * 1.9, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
      {list.map((word, i) => <Text key={i} style={'text' in word && word.own ? { color: palette.accent } : undefined}>{i > 0 ? ' ' : ''}{'end' in word ? num(word.end) : mushafText(word.text)}</Text>)}
      {cut ? <Text style={{ color: palette.muted }}> …</Text> : null}
    </Text>
  );
}

function Conditions({ surah, palette }: { surah: number; palette: Palette }) {
  return (
    <View style={{ gap: 4, paddingTop: 4 }}>
      {conditionLines(surah).map(line => (
        <View key={line.key} style={{ borderRightWidth: 2, borderStyle: line.role === 'disputed' ? 'dashed' : 'solid', borderColor: line.role === 'answer' ? palette.green : line.role === 'disputed' ? palette.muted : palette.rule, paddingRight: 8 }}>
          {line.role !== 'condition' && <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>{line.role === 'answer' ? (line.ours ? 'الجواب، قراءتنا' : 'الجواب') : 'موضع الخلاف في الجواب'}</Text>}
          <Ayah palette={palette} size={19} words={[...words(line.key).map(text => ({ text, own: false })), { end: Number(line.key.split(':')[1]) }]} />
        </View>
      ))}
    </View>
  );
}

function Rows({ card, palette, open, still }: { card: OpeningCard; palette: Palette; open?: boolean; still?: boolean }) {
  return <>
    {card.rows.map((row, r) => (
      <View key={row.surah} style={{ paddingVertical: 6, borderTopWidth: r ? 1 : 0, borderColor: `${palette.rule}55` }}>
        <Pressable disabled={still} onPress={() => readAyah(`${row.surah}:1`)} accessibilityRole="link" accessibilityLabel={`افتح ${surahNames[row.surah]} في المصحف`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{surahNames[row.surah]}</Text>
          {row.guest && <Text style={{ color: palette.muted, fontSize: 12, borderWidth: 1, borderColor: palette.rule, borderRadius: 999, paddingHorizontal: 8 }}>{kindLabel(row.guest)}</Text>}
        </Pressable>
        {open && CONDITION_SPANS[row.surah] ? <Conditions surah={row.surah} palette={palette} /> : <Ayah words={row.words} cut={row.cut} palette={palette} />}
      </View>
    ))}
  </>;
}

function Card({ card, palette }: { card: OpeningCard; palette: Palette }) {
  const [open, setOpen] = useState(false);
  const share = () => shareCard({ link: `https://namaq.vercel.app/quran/openings?kind=${card.kind}#${card.id}`, content: width => (
    <View style={{ width, padding: 14, ...CARD, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule }}>
      <Text style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{card.title}</Text>
      <Rows card={card} palette={palette} still />
    </View>
  ) });
  return (
    <View style={{ ...CARD, backgroundColor: palette.card, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6, marginBottom: 12 }}>
      <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{card.title}</Text>
      <Rows card={card} palette={palette} open={open} />
      <View style={{ flexDirection: 'row', gap: 14, paddingTop: 4 }}>
        {card.rows.some(row => CONDITION_SPANS[row.surah]) && <Pressable onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel="الشرط وجوابه" hitSlop={8} style={{ padding: 4, transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <ChevronDown size={18} color={palette.muted} />
        </Pressable>}
        <Pressable onPress={share} accessibilityRole="button" accessibilityLabel={`شارك ${card.title}`} hitSlop={8} style={{ padding: 4 }}>
          <Send size={18} color={palette.muted} />
        </Pressable>
      </View>
    </View>
  );
}

/** The website's /quran/openings on the phone (owner, 2026-11-13): the ten kinds of opening as chips, and cards of surahs whose openings look alike. */
export default function OpeningsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [kind, setKind] = useState<OpeningKindId | null>(null);
  const [help, setHelp] = useState(false);
  useTabRetap('openings', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const cards = useMemo(() => openingCards(words), []);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll help={() => setHelp(true)}>
        <Pressable onPress={() => router.push('/quiz/openings')} accessibilityRole="link" accessibilityLabel="اختبار أوائل السور" hitSlop={8} style={{ padding: 4 }}>
          <PenLine size={20} color={palette.muted} />
        </Pressable>
      </TopBar>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, flexShrink: 0 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', flexDirection: 'row' }}>
        {OPENING_KINDS.map(k => {
          const on = kind === k.id;
          return (
            <Pressable key={k.id} onPress={() => { setKind(on ? null : k.id); scroll.current?.scrollTo({ y: 0, animated: false }); }} accessibilityRole="button" accessibilityState={{ selected: on }} accessibilityLabel={k.label}
              style={{ borderWidth: 1, borderColor: on ? palette.accent : palette.rule, backgroundColor: on ? palette.accent : 'transparent', borderRadius: 16, height: 32, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: on ? palette.onAccent : palette.muted, fontSize: 15 }}>{k.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <ScrollView ref={scroll} onScroll={shrink} scrollEventThrottle={16} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: bottom }}>
        {cards.filter(card => !kind || inKind(card, kind)).map(card => <Card key={card.id} card={card} palette={palette} />)}
      </ScrollView>
      <HelpSheet topic={help ? 'openings' : null} onClose={() => setHelp(false)} palette={palette} />
    </View>
  );
}

