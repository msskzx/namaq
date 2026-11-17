import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, PenLine, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { CONDITION_NOTES, CONDITION_SOURCES, CONDITION_SPANS, ITQAN_KIND_NOTES, ITQAN_OPENING, ITQAN_QUOTES, OPENINGS_LEGEND, OPENING_KINDS, conditionLines, inKind, soleCard, openingCards, type OpeningCard, type OpeningKindId, type OpeningWord } from '@shared/quran/openingKinds';
import { blend } from '@shared/quran/compareCardLook';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import Reference from '@/ui/Reference';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { ayahOf, surahNames } from '@/lib/branches';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { readSettings, writeSettings } from '@/lib/soloStore';
import { useTabRetap } from '@/lib/tabRetap';
import { CARD, QURAN_FONT, usePalette, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';

const words = (key: string) => ayahOf(key)?.words ?? [];

/** A shared word's colour, as the matrix gives it (mobile/src/lib/marks.ts): faded into the card when only some rows share it. */
function tone(palette: Palette, kind: keyof Palette['marks'], some: boolean) {
  const colour = palette.marks[kind];
  return colour && (some ? blend(colour, palette.card, 0.55) : colour);
}

function Ayah({ words: list, cut, palette, size = 22 }: { words: OpeningWord[]; cut?: boolean; palette: Palette; size?: number }) {
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: size, lineHeight: size * 1.9, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
      {list.map((word, i) => <Text key={i} style={'text' in word && word.mark ? { color: tone(palette, word.mark.kind, word.mark.some) } : undefined}>{i > 0 ? ' ' : ''}{'end' in word ? num(word.end) : mushafText(word.text)}</Text>)}
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
          <Ayah palette={palette} size={19} words={[...words(line.key).map(text => ({ text })), { end: Number(line.key.split(':')[1]) }]} />
        </View>
      ))}
    </View>
  );
}

function Rows({ card, palette, open, still }: { card: OpeningCard; palette: Palette; open?: boolean; still?: boolean }) {
  return <>
    {card.rows.map((row, r) => (
      <View key={row.surah} style={{ paddingVertical: 6, borderTopWidth: r ? 1 : 0, borderColor: `${palette.rule}55` }}>
        {card.parts?.find(part => part.surahs[0] === row.surah) && <Text style={{ color: palette.ink, fontSize: 14, fontWeight: '700', textAlign: 'right', paddingBottom: 2 }}>{card.parts.find(part => part.surahs[0] === row.surah)!.label}</Text>}
        <Pressable disabled={still} onPress={() => readAyah(`${row.surah}:1`)} accessibilityRole="link" accessibilityLabel={`افتح ${surahNames[row.surah]} في المصحف`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{surahNames[row.surah]}</Text>
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
    <View style={{ marginBottom: 12, gap: 2 }}>
      <View style={{ ...CARD, backgroundColor: palette.card, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
        {!soleCard(card) && <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{card.title}</Text>}
        {card.refs && !soleCard(card) && <Reference title={card.refs[0].cite!} quotes={card.refs} palette={palette} />}
        <Rows card={card} palette={palette} open={open} />
        {open && <View style={{ gap: 4, borderTopWidth: 1, borderColor: `${palette.rule}55`, paddingTop: 8 }}>
          {CONDITION_NOTES.map(text => <Text key={text} style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' }}>{text}</Text>)}
          {CONDITION_SOURCES.map(source => <ExternalLink key={source.url} url={source.url} color={palette.muted} size={13} style={{ textAlign: 'right' }}>{source.title}</ExternalLink>)}
        </View>}
      </View>
      <View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 4 }}>
        {card.rows.some(row => CONDITION_SPANS[row.surah]) && <IconButton Icon={open ? ChevronUp : ChevronDown} label="الشرط وجوابه" onPress={() => setOpen(!open)} size="small" expanded={open} />}
        <IconButton Icon={Send} label={`شارك ${card.title}`} onPress={share} size="small" />
      </View>
    </View>
  );
}

/** The quiz button: the solo quiz set to ask the surahs' openings (a kind inside the quizzes, owner 2026-11-17). */
const quizOpenings = () => {
  writeSettings({ ...readSettings(), kinds: ['OPENINGS'] });
  router.push('/quiz/solo');
};

/** The website's /quran/openings on the phone (owner, 2026-11-13): the ten kinds of opening as chips, and cards of surahs whose openings look alike. */
export default function OpeningsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [kind, setKind] = useState<OpeningKindId | null>(null);
  useTabRetap('openings', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const cards = useMemo(() => openingCards(ayahOf), []);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll>
        <IconButton Icon={PenLine} label="اختبار أوائل السور" onPress={quizOpenings} role="link" />
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
        <View style={{ gap: 6, marginBottom: 8 }}>
          <Reference title={ITQAN_OPENING.cite} quotes={[ITQAN_OPENING]} palette={palette} />
          <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' }}>{OPENINGS_LEGEND}</Text>
        </View>
        {OPENING_KINDS.filter(k => !kind || k.id === kind).map(k => {
          const quote = ITQAN_QUOTES.find(q => q.kind === k.id)!;
          const sole = cards.find(card => card.kind === k.id && soleCard(card));
          return (
            <View key={k.id}>
              <View style={{ gap: 4, paddingTop: 8, marginBottom: 10 }}>
                <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, fontWeight: '700', textAlign: 'right' }}>{k.label}</Text>
                <Reference title={quote.cite} quotes={[quote, ...(ITQAN_KIND_NOTES[k.id] ?? [])]} palette={palette} />
                {sole?.refs && <Reference title={sole.refs[0].cite!} quotes={sole.refs} palette={palette} />}
              </View>
              {cards.filter(card => (kind ? inKind(card, k.id) : card.kind === k.id)).map(card => <Card key={card.id} card={card} palette={palette} />)}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

