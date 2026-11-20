import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, ChevronUp, PenLine, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { CONDITION_NOTES, CONDITION_SOURCES, CONDITION_SPANS, ITQAN_KIND_NOTES, ITQAN_OPENING, ITQAN_QUOTES, OPENINGS_LEGEND, OPENING_KINDS, conditionLines, inKind, soleCard, openingCards, type OpeningCard, type OpeningKindId, type OpeningWord } from '@shared/quran/openingKinds';
import { someTone } from '@/lib/marks';
import { Text } from '@/ui/Text';
import SourceLine from '@/ui/SourceLine';
import Reference from '@/ui/Reference';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { ayahOf, surahNames } from '@/lib/branches';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { readSettings, writeSettings } from '@/lib/soloStore';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import IconButton from '@/ui/IconButton';
import Card, { CardWithRow } from '@/ui/Card';

const words = (key: string) => ayahOf(key)?.words ?? [];

/** A shared word's colour, as the matrix gives it (mobile/src/lib/marks.ts): mixed with the muted colour when only some rows share it. */
function tone(palette: Palette, kind: keyof Palette['marks'], some: boolean) {
  const colour = palette.marks[kind];
  return colour && (some ? someTone(palette, colour) : colour);
}

function Ayah({ words: list, cut, palette }: { words: OpeningWord[]; cut?: boolean; palette: Palette }) {
  return (
    <AyahFlow color={palette.ink}>
      {list.map((word, i) => <AyahWords key={i} look={'text' in word && word.mark ? { color: tone(palette, word.mark.kind, word.mark.some) } : undefined}>{`${i > 0 ? ' ' : ''}${'end' in word ? num(word.end) : word.text}`}</AyahWords>)}
      {cut ? <AyahWords look={{ color: palette.muted }}> …</AyahWords> : null}
    </AyahFlow>
  );
}

function Conditions({ surah, palette }: { surah: number; palette: Palette }) {
  return (
    <View style={{ gap: 4, paddingTop: 4 }}>
      {conditionLines(surah).map(line => (
        <View key={line.key} style={{ borderRightWidth: 2, borderStyle: line.role === 'disputed' ? 'dashed' : 'solid', borderColor: line.role === 'answer' ? palette.green : line.role === 'disputed' ? palette.muted : palette.rule, paddingRight: 8 }}>
          {line.role !== 'condition' && <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>{line.role === 'answer' ? (line.ours ? 'الجواب، قراءتنا' : 'الجواب') : 'موضع الخلاف في الجواب'}</Text>}
          <Ayah palette={palette} words={[...words(line.key).map(text => ({ text })), { end: Number(line.key.split(':')[1]) }]} />
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

function Opening({ card, palette }: { card: OpeningCard; palette: Palette }) {
  const [open, setOpen] = useState(false);
  const share = () => shareCard({ link: `https://namaq.vercel.app/quran/openings?kind=${card.kind}#${card.id}`, content: width => (
    <Card palette={palette} style={{ width }}>
      <Text style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{card.title}</Text>
      <Rows card={card} palette={palette} still />
    </Card>
  ) });
  return (
    <View style={{ marginBottom: 12, gap: 2 }}>
      <CardWithRow palette={palette} pad={[9, 16]} row={<>
        {card.rows.some(row => CONDITION_SPANS[row.surah]) && <IconButton Icon={open ? ChevronUp : ChevronDown} label="الشرط وجوابه" onPress={() => setOpen(!open)} expanded={open} />}
        <IconButton Icon={Send} label={`شارك ${card.title}`} onPress={share} />
      </>}>
        {!soleCard(card) && <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{card.title}</Text>}
        {card.refs && !soleCard(card) && <Reference title={card.refs[0].cite!} quotes={card.refs} palette={palette} />}
        <Rows card={card} palette={palette} open={open} />
        {open && <View style={{ gap: 4, borderTopWidth: 1, borderColor: `${palette.rule}55`, paddingTop: 8 }}>
          {CONDITION_NOTES.map(text => <Text key={text} style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' }}>{text}</Text>)}
          {CONDITION_SOURCES.map(source => <Reference key={source.url} title={source.title} quotes={[]} links={[{ label: source.title, url: source.url }]} palette={palette} />)}
        </View>}
      </CardWithRow>
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
          <SourceLine sources={[{ line: ITQAN_OPENING.cite, quotes: [ITQAN_OPENING] }]} palette={palette} />
          <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right' }}>{OPENINGS_LEGEND}</Text>
        </View>
        {OPENING_KINDS.filter(k => !kind || k.id === kind).map(k => {
          const quote = ITQAN_QUOTES.find(q => q.kind === k.id)!;
          const sole = cards.find(card => card.kind === k.id && soleCard(card));
          return (
            <View key={k.id}>
              <View style={{ gap: 4, paddingTop: 8, marginBottom: 10 }}>
                <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, fontWeight: '700', textAlign: 'right' }}>{k.label}</Text>
                <SourceLine palette={palette} sources={[{ line: quote.cite, quotes: [quote, ...(ITQAN_KIND_NOTES[k.id] ?? [])] }, ...(sole?.refs ? [{ line: sole.refs[0].cite!, quotes: sole.refs }] : [])]} />
              </View>
              {cards.filter(card => (kind ? inKind(card, k.id) : card.kind === k.id)).map(card => <Opening key={card.id} card={card} palette={palette} />)}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

