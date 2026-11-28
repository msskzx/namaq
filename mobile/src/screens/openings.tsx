import { useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { CONDITION_NOTES, CONDITION_SPANS, ITQAN_KIND_NOTES, ITQAN_QUOTES, OPENING_KINDS, conditionLines, inKind, openingFound, soleCard, openingCards, type OpeningCard, type OpeningKindId, type OpeningWord } from '@shared/quran/openingKinds';
import { Text } from '@/ui/Text';
import SourceLine from '@/ui/SourceLine';
import Reference from '@/ui/Reference';
import TopBar from '@/ui/TopBar';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { ayahOf, surahNames } from '@/lib/branches';
import { useShrinkOnScroll } from '@/lib/chrome';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from '@/components/quran/text/AyahFlow';
import IconButton from '@/ui/IconButton';
import Card, { CardWithRow } from '@/ui/Card';
import { Tap } from '@/ui/Tap';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';
import Folded from '@/ui/Folded';
import { useLater } from '@/lib/hooks/useLater';

const words = (key: string) => ayahOf(key)?.words ?? [];

type Light = { lit: string | null; onWord: (link: string) => void };

function Ayah({ words: list, menu, palette, light }: { words: OpeningWord[]; menu: string | string[]; palette: Palette; light?: Light }) {
  return (
    <AyahFlow color={palette.ink} menu={menu}>
      {list.map((word, i) => {
        const mark = 'text' in word ? word.mark : undefined;
        const lit = !!mark && mark.link === light?.lit;
        return <AyahWords key={i} lit={lit} mark={mark && { kind: mark.kind, some: mark.some }} onPress={mark && light ? () => light.onWord(mark.link) : undefined}>
          {`${i > 0 ? ' ' : ''}${'end' in word ? num(word.end) : word.text}`}
        </AyahWords>;
      })}
    </AyahFlow>
  );
}

function Conditions({ surah, after, palette }: { surah: number; after: number; palette: Palette }) {
  const note = CONDITION_NOTES[surah];
  return (
    <View style={{ gap: 4, paddingTop: 4 }}>
      {conditionLines(surah).filter(line => Number(line.key.split(':')[1]) > after).map(line => (
        <View key={line.key} style={{ borderRightWidth: 2, borderColor: line.role === 'answer' ? palette.green : palette.rule, paddingRight: 8 }}>
          {line.role === 'answer' && <Text style={{ color: palette.muted, fontSize: 12, textAlign: 'right' }}>الجواب</Text>}
          <Ayah palette={palette} menu={line.key} words={[...words(line.key).map(text => ({ text })), { end: Number(line.key.split(':')[1]) }]} />
        </View>
      ))}
      <Text style={{ color: palette.muted, fontSize: 13, lineHeight: 21, textAlign: 'right', paddingTop: 4 }}>{note.text}</Text>
      <Reference title={note.source.title} quotes={[]} links={[{ label: note.source.title, url: note.source.url }]} palette={palette} />
    </View>
  );
}

export function OpeningRows({ card, palette, still, conditions }: { card: OpeningCard; palette: Palette; still?: boolean;
  conditions?: boolean }) {
  const [lit, setLit] = useState<string | null>(null);
  const light = still ? undefined : { lit, onWord: (link: string) => setLit(now => (now === link ? null : link)) };
  return <>
    {card.rows.map((row, r) => {
      const ends = row.words.flatMap(word => ('end' in word ? [word.end] : []));
      return (
        <View key={row.surah} style={{ paddingVertical: 6, borderTopWidth: r ? 1 : 0, borderColor: `${palette.rule}55` }}>
          {card.parts?.find(part => part.surahs[0] === row.surah) && <Text style={{ color: palette.ink, fontSize: 14, fontWeight: '700', textAlign: 'right', paddingBottom: 2 }}>{card.parts.find(part => part.surahs[0] === row.surah)!.label}</Text>}
          <Tap disabled={still} onPress={() => readAyah(`${row.surah}:1`)} accessibilityRole="link" accessibilityLabel={`افتح ${surahNames[row.surah]} في المصحف`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: palette.muted, fontSize: 14 }}>{surahNames[row.surah]}</Text>
          </Tap>
          <Ayah words={row.words} menu={ends.map(end => `${row.surah}:${end}`)} palette={palette} light={light} />
          {conditions && CONDITION_SPANS[row.surah] && <Folded credit="الشرط وجوابه" bare palette={palette}><Conditions surah={row.surah} after={Math.max(...ends)} palette={palette} /></Folded>}
        </View>
      );
    })}
  </>;
}

function Opening({ card, palette, onLayout }: { card: OpeningCard; palette: Palette; onLayout?: (y: number) => void }) {
  const share = () => shareCard({ link: `https://namaq.vercel.app/quran/openings?kind=${card.kind}#${card.id}`, content: width => (
    <Card palette={palette} style={{ width }}>
      <Text style={{ color: palette.accent, fontSize: 19, textAlign: 'right' }}>{card.title}</Text>
      <OpeningRows card={card} palette={palette} still />
    </Card>
  ) });
  return (
    <View style={{ marginBottom: 20, gap: 2 }} onLayout={onLayout && (e => onLayout(e.nativeEvent.layout.y))}>
      {!soleCard(card) && <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 16, fontWeight: '700', textAlign: 'right', paddingHorizontal: 4, paddingBottom: 4 }}>{card.title}</Text>}
      <CardWithRow palette={palette} pad={[9, 16]} row={<>
        <IconButton Icon={Send} label={`شارك ${card.title}`} onPress={share} />
      </>}>
        {card.refs && !soleCard(card) && <Reference title={card.refs[0].cite!} quotes={card.refs} palette={palette} />}
        <OpeningRows card={card} palette={palette} conditions />
      </CardWithRow>
    </View>
  );
}

export default function OpeningsScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const [kind, setKind] = useState<OpeningKindId | null>(null);
  useTabRetap('openings', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const cards = useMemo(() => openingCards(ayahOf), []);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  const shown = (k: OpeningKindId) => cards.filter(card => (kind ? inKind(card, k) : card.kind === k) && openingFound(card, typed, surah => surahNames[surah]));
  const kinds = OPENING_KINDS.filter(k => (!kind || k.id === kind) && shown(k.id).length > 0);
  const { at } = useLocalSearchParams<{ at?: string }>();
  const atKind = cards.find(card => card.id === at)?.kind;
  const later = useLater();
  const place = useRef<{ kind?: number; card?: number; done?: boolean }>({});
  const placed = (part: 'kind' | 'card', y: number) => {
    place.current[part] = y;
    const { kind: top, card, done } = place.current;
    if (done || top === undefined || card === undefined) return;
    place.current.done = true;
    later.nextFrame(() => scroll.current?.scrollTo({ y: top + card, animated: false }));
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'اسم سورة أو كلمة من فاتحتها', label: 'ابحث في فواتح السور' }} />
      <ScrollView ref={scroll} onScroll={shrink} scrollEventThrottle={16} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: bottom }}>
        <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 4, paddingBottom: 8 }}>
          {OPENING_KINDS.map(k => {
            const on = kind === k.id;
            return <Chip key={k.id} role="tab" label={k.label} on={on} onPress={() => { setKind(on ? null : k.id); scroll.current?.scrollTo({ y: 0, animated: false }); }} palette={palette} />;
          })}
        </View>
        {!kinds.length && <Empty text="لا سورة بهذا الاسم ولا فاتحة فيها هذه الكلمة" palette={palette} />}
        {kinds.map(k => {
          const quote = ITQAN_QUOTES.find(q => q.kind === k.id)!;
          const sole = cards.find(card => card.kind === k.id && soleCard(card));
          return (
            <View key={k.id} onLayout={k.id === atKind ? e => placed('kind', e.nativeEvent.layout.y) : undefined}>
              <View style={{ gap: 4, paddingTop: 8, marginBottom: 10 }}>
                <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, fontWeight: '700', textAlign: 'right' }}>{k.label}</Text>
                <SourceLine palette={palette} sources={[{ line: quote.cite, quotes: [quote, ...(ITQAN_KIND_NOTES[k.id] ?? [])] }, ...(sole?.refs ? [{ line: sole.refs[0].cite!, quotes: sole.refs }] : [])]} />
              </View>
              {shown(k.id).map(card => <Opening key={card.id} card={card} palette={palette} onLayout={card.id === at && !kind ? y => placed('card', y) : undefined} />)}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

