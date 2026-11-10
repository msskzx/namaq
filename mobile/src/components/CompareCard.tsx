import { memo, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Bookmark, BookOpen, Clapperboard, Pause, Play, RotateCcw, Send, X } from 'lucide-react-native';
import type { CardAyah, CardSide, PairCard } from '@shared/quran/compareCards';
import { ayahStarts, isRefrain, type ReadStep } from '@shared/quran/readPlan';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { savedIdsOf, sideKeys, sideLabel, surahName, toggleCardSaved } from '@/lib/compare';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { nextSpeed, useReadAlong } from './useReadAlong';
import VideoSheet from './VideoSheet';
import TreeIcon from './TreeIcon';
import { compareRecorderPage, compareVideoInput } from '@/lib/compareVideo';

const DOUBLE_TAP = 280;

/** Halfway between two colours, for marks that share only a root: a faint purple, as on the website. */
function blend(a: string, b: string, weight: number) {
  const parts = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [parts(a), parts(b)];
  return `#${x.map((value, i) => Math.round(value * weight + y[i] * (1 - weight)).toString(16).padStart(2, '0')).join('')}`;
}

type Light = { lit: string | null; reading?: number; onWord?: (link: string) => void };

/** One ayah: same words in the accent, same root in purple, a lit word and its partner on a highlight, the word read underlined. */
function AyahText({ ayah, palette, light, plain = false }: { ayah: CardAyah; palette: Palette; light?: Light; plain?: boolean }) {
  const related = blend(palette.root, palette.muted, 0.45);
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 44, color: plain ? palette.muted : palette.ink, writingDirection: 'rtl', textAlign: 'right' }}>
      {ayah.words.map((word, i) => {
        const mark = plain ? undefined : ayah.marks?.[i];
        const lit = !!mark?.link && mark.link === light?.lit;
        const reading = light?.reading === i;
        const color = lit ? palette.onHighlight : mark?.kind === 'root' ? palette.root : mark?.kind === 'related' ? related : mark ? palette.accent : undefined;
        const link = mark?.link;
        return (
          <Text key={i}>
            {i > 0 ? ' ' : ''}
            <Text onPress={link && light?.onWord ? () => light.onWord!(link) : undefined}
              style={[color ? { color } : null, lit ? { backgroundColor: palette.highlight } : null, reading ? { textDecorationLine: 'underline', textDecorationColor: palette.accent, backgroundColor: lit ? palette.highlight : palette.paperDeep } : null]}>
              {mushafText(word)}
            </Text>
          </Text>
        );
      })}
      <Text style={{ color: palette.accent }}> {num(ayah.number)}</Text>
    </Text>
  );
}

function SideHead({ label, keys, palette, group }: { label: string; keys: string[]; palette: Palette; group?: string }) {
  const read = `اقرأ ${label} في المصحف`;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{label}</Text>
      {group && <Pressable onPress={() => router.navigate({ pathname: '/branches', params: { tree: group } })} hitSlop={8} accessibilityRole="button" accessibilityLabel="افتح في متشابهات القرآن" style={{ padding: 6 }}>
        <TreeIcon size={18} color={palette.muted} />
      </Pressable>}
      <Pressable onPress={() => router.push({ pathname: '/ayah', params: { keys: keys.join(',') } })} hitSlop={8} accessibilityRole="button" accessibilityLabel={read} style={{ padding: 6 }}>
        <BookOpen size={18} color={palette.muted} />
      </Pressable>
    </View>
  );
}

const lightFor = (lit: string | null, step: ReadStep | undefined, side: number, number: number, onWord: (link: string) => void): Light =>
  ({ lit, reading: step && step.side === side && step.ayah === number ? step.word : undefined, onWord });

function Studio({ read, palette, card }: { read: ReturnType<typeof useReadAlong>; palette: Palette; card: PairCard }) {
  const [video, setVideo] = useState<((font: string) => string) | null>(null);
  const record = () => { read.reset(); const input = compareVideoInput(card, read.plan, read.speed, palette); setVideo(() => (font: string) => compareRecorderPage(input, font)); };
  const starts = ayahStarts(read.plan);
  const playing = read.status === 'playing';
  const active = playing || read.status === 'paused';
  const reached = read.status === 'done' ? starts.length : active ? starts.filter(start => start <= read.at).length : 0;
  const label = playing ? 'إيقاف مؤقت' : read.status === 'paused' ? 'متابعة' : read.status === 'done' ? 'إعادة' : 'اقرأ مع التظليل';
  const button = { padding: 8 };
  return (
    <View style={{ gap: 2 }}>
      {starts.length > 1 && <View style={{ flexDirection: 'row', gap: 4 }} accessibilityLabel="تقدّم القراءة">
        {starts.map((start, i) => (
          <Pressable key={start} onPress={() => read.play(start)} accessibilityRole="button" accessibilityLabel={`من الآية ${num(i + 1)}`} style={{ flex: 1, height: 22, justifyContent: 'center' }}>
            <View style={{ height: 4, borderRadius: 2, backgroundColor: i < reached ? palette.green : palette.rule }} />
          </Pressable>
        ))}
      </View>}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={read.close} accessibilityRole="button" accessibilityLabel="إغلاق الاستوديو" style={button}><X size={22} color={palette.muted} /></Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={nextSpeed} accessibilityRole="button" accessibilityLabel={`السرعة ${read.speed}×`} style={[button, { minWidth: 44, alignItems: 'center' }]}>
          <Text style={{ color: palette.muted, fontSize: 15 }}>{read.speed}×</Text>
        </Pressable>
        <Pressable onPress={record} accessibilityRole="button" accessibilityLabel="مشاركة كفيديو" style={button}><Send size={22} color={palette.muted} /></Pressable>
        <Pressable onPress={() => (playing ? read.pause() : read.play())} accessibilityRole="button" accessibilityLabel={label} style={button}>
          {playing ? <Pause size={22} color={palette.accent} /> : <Play size={22} color={active ? palette.accent : palette.muted} />}
        </Pressable>
        <Pressable onPress={read.reset} accessibilityRole="button" accessibilityLabel="إعادة ضبط" style={button}><RotateCcw size={22} color={palette.muted} /></Pressable>
      </View>
      <VideoSheet page={video} onClose={() => setVideo(null)} palette={palette} />
    </View>
  );
}

/** One compare card: both sides stacked, tap a coloured word to light its partner, double tap to save, the studio reads along. */
function CompareCard({ card, palette }: { card: PairCard; palette: Palette }) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks);
  const saved = savedIdsOf(card, bookmarks).length > 0;
  const read = useReadAlong(card);
  const step = read.step;
  const [tapped, setTapped] = useState<string | null>(null);
  const [picked, setPicked] = useState(0);
  const lit = step ? step.link ?? null : tapped;
  const selected = step?.option ?? picked;
  const onWord = (link: string) => { if (!step) setTapped(current => (current === link ? null : link)); };
  const option = card.many?.options[selected];

  const scale = useSharedValue(1);
  const [pop, setPop] = useState(0);
  useEffect(() => { if (pop) scale.value = withSequence(withTiming(1.35, { duration: 120 }), withTiming(1, { duration: 160 })); }, [pop, scale]);
  const popped = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const lastTap = useRef(0);
  const tap = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP) {
      lastTap.current = 0;
      if (!saved) toggleCardSaved(card);
      setPop(value => value + 1);
    } else lastTap.current = now;
  };

  const side = (cardSide: CardSide, i: number) => {
    if (card.many && card.many.side === i) {
      const options = card.many.options;
      if (isRefrain(options)) return (
        <View key={i} style={{ gap: 2 }}>
          <SideHead label={`${surahName(cardSide.surah)} ${options.map(item => num(item.ayah.number)).join(' · ')}`} keys={options.map(item => `${cardSide.surah}:${item.ayah.number}`)} palette={palette} group={i === 0 ? card.group : undefined} />
          <AyahText ayah={options[0].ayah} palette={palette} light={lightFor(lit, step, i, options[0].ayah.number, onWord)} />
        </View>
      );
      return (
        <View key={i} style={{ gap: 6 }}>
          <SideHead label={`${surahName(cardSide.surah)} ${options.map(item => num(item.ayah.number)).join(' · ')}`} keys={options.map(item => `${cardSide.surah}:${item.ayah.number}`)} palette={palette} group={i === 0 ? card.group : undefined} />
          {options.map((item, row) => (
            <Pressable key={item.id} onPress={() => { if (!step && row !== selected) { setPicked(row); setTapped(null); } }} accessibilityRole="button" accessibilityState={{ selected: row === selected }}
              accessibilityLabel={`${surahName(cardSide.surah)} ${num(item.ayah.number)}`}
              style={{ borderRightWidth: 3, borderColor: row === selected ? palette.accent : 'transparent', paddingRight: 8 }}>
              <AyahText ayah={item.ayah} palette={palette} plain={row !== selected} light={row === selected ? lightFor(lit, step, i, item.ayah.number, onWord) : undefined} />
            </Pressable>
          ))}
        </View>
      );
    }
    const ayat = option && card.many ? [option.shared] : cardSide.ayat;
    return (
      <View key={i} style={{ gap: 2 }}>
        <SideHead label={sideLabel(cardSide)} keys={sideKeys(cardSide)} palette={palette} group={i === 0 ? card.group : undefined} />
        {ayat.map(ayah => <AyahText key={ayah.number} ayah={ayah} palette={palette} light={lightFor(lit, step, i, ayah.number, onWord)} />)}
      </View>
    );
  };

  return (
    <View style={{ gap: 4 }}>
      <Pressable onPress={tap} accessibilityHint="انقر مرتين للحفظ"
        style={{ backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, borderRadius: 12, padding: 12, gap: 10 }}>
        {side(card.sides[0], 0)}
        <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6 }} />
        {side(card.sides[1], 1)}
      </Pressable>
      {read.studio ? <Studio read={read} palette={palette} card={card} /> : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable onPress={read.open} hitSlop={6} accessibilityRole="button" accessibilityLabel="استوديو القراءة" style={{ padding: 8 }}>
            <Clapperboard size={22} color={palette.muted} />
          </Pressable>
          <Pressable onPress={() => toggleCardSaved(card)} hitSlop={6} accessibilityRole="button" accessibilityState={{ selected: saved }} accessibilityLabel={saved ? 'إزالة من المحفوظة' : 'حفظ'} style={{ padding: 8 }}>
            <Animated.View style={popped}><Bookmark size={22} color={saved ? palette.accent : palette.muted} fill={saved ? palette.accent : 'transparent'} /></Animated.View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default memo(CompareCard);
