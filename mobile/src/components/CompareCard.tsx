import { Fragment, memo, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@/components/Text';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Bookmark, BookOpen, Clapperboard, GalleryHorizontal, Pause, UnfoldHorizontal, Play, RotateCcw, Send, X } from 'lucide-react-native';
import type { CardAyah, CardSide, PairCard } from '@shared/quran/compareCards';
import { ayahStarts, isRefrain, type ReadStep } from '@shared/quran/readPlan';
import { readBookmarks, subscribeBookmarks } from '@shared/bookmarks';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { aroundOf, savedIdsOf, shownAyat, sideKeys, sideLabel, surahName, toggleCardSaved, type AroundAyah } from '@/lib/compare';
import { around as aroundSetting, branchView, type BranchView } from '@/lib/settings';
import CompareBraid from './CompareBraid';
import { QURAN_FONT, blend, type Palette } from '@/lib/theme';
import { nextSpeed, useReadAlong } from './useReadAlong';
import VideoSheet from './VideoSheet';
import TreeIcon from './TreeIcon';
import { compareRecorderPage, compareVideoInput } from '@/lib/compareVideo';

const DOUBLE_TAP = 280;

type Light = { lit: string | null; reading?: number; onWord?: (link: string) => void };

/** One ayah: same words in the accent, same root in purple, a lit word and its partner on a highlight, the word read underlined. */
function AyahText({ ayah, palette, light, plain = false, inline = false }: { ayah: CardAyah; palette: Palette; light?: Light; plain?: boolean; inline?: boolean }) {
  const related = blend(palette.root, palette.muted, 0.45);
  return (
    <Text style={inline ? { color: plain ? palette.muted : palette.ink } : { fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 44, color: plain ? palette.muted : palette.ink, writingDirection: 'rtl', textAlign: 'center' }}>
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

/** The ayah before or after a side in the matrix: muted, its words coloured where the other side's neighbour shares them. */
function Neighbour({ ayah, palette }: { ayah: AroundAyah; palette: Palette }) {
  return (
    <Text style={{ fontSize: 18, color: palette.muted }}>
      {ayah.words.map((word, i) => {
        const color = ayah.rooted.has(i) ? palette.root : ayah.exact.has(i) ? palette.accent : undefined;
        return <Text key={i} style={color ? { color, opacity: 0.8 } : undefined}>{i > 0 ? ' ' : ''}{mushafText(word)}</Text>;
      })}
      <Text> {num(ayah.number)}</Text>
    </Text>
  );
}

/** A side's ayat as one running text, with the ayah before and after (muted) when the surrounding switch is on. */
function RunningAyat({ ayat, before, after, palette, light }: { ayat: CardAyah[]; before?: AroundAyah | null; after?: AroundAyah | null; palette: Palette; light: (ayah: CardAyah) => Light }) {
  return (
    <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 44, color: palette.ink, writingDirection: 'rtl', textAlign: 'center' }}>
      {before && <><Neighbour ayah={before} palette={palette} />{' '}</>}
      {ayat.map((ayah, i) => <Text key={ayah.number}>{i > 0 ? ' ' : ''}<AyahText ayah={ayah} palette={palette} light={light(ayah)} inline /></Text>)}
      {after && <>{' '}<Neighbour ayah={after} palette={palette} /></>}
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
        <Pressable onPress={nextSpeed} accessibilityRole="button" accessibilityLabel={`السرعة ${read.speed}×`} style={[button, { minWidth: 44, alignItems: 'center' }]}>
          <Text style={{ color: palette.muted, fontSize: 15 }}>{read.speed}×</Text>
        </Pressable>
        <Pressable onPress={() => (playing ? read.pause() : read.play())} accessibilityRole="button" accessibilityLabel={label} style={button}>
          {playing ? <Pause size={22} color={palette.accent} /> : <Play size={22} color={active ? palette.accent : palette.muted} />}
        </Pressable>
        <Pressable onPress={read.reset} accessibilityRole="button" accessibilityLabel="إعادة ضبط" style={button}><RotateCcw size={22} color={palette.muted} /></Pressable>
        <Pressable onPress={record} accessibilityRole="button" accessibilityLabel="مشاركة كفيديو" style={button}><Send size={22} color={palette.muted} /></Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={read.close} accessibilityRole="button" accessibilityLabel="إغلاق الاستوديو" style={button}><X size={22} color={palette.muted} /></Pressable>
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
  const [view, setView] = useState<BranchView>(branchView.get);
  // The read-along studio lights words in the matrix, so it shows the matrix while open.
  const tree = view === 'tree' && !read.studio;
  const sides = shownAyat(card, selected);
  // The surrounding-ayat switch is the branches tab's: one setting for every tree and matrix.
  const [aroundOn, setAround] = aroundSetting.use();
  const around = aroundOn ? aroundOf(sides) : undefined;

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

  const side = (cardSide: CardSide, i: 0 | 1) => {
    if (card.many && card.many.side === i) {
      const options = card.many.options;
      if (isRefrain(options)) return (
        <View key={i} style={{ gap: 2 }}>
          <SideHead label={`${surahName(cardSide.surah)} ${options.map(item => num(item.ayah.number)).join(' · ')}`} keys={options.map(item => `${cardSide.surah}:${item.ayah.number}`)} palette={palette} group={i === 0 ? card.group : undefined} />
          <RunningAyat ayat={[options[0].ayah]} before={around?.before[i]} after={around?.after[i]} palette={palette} light={ayah => lightFor(lit, step, i, ayah.number, onWord)} />
        </View>
      );
      return (
        <View key={i} style={{ gap: 6 }}>
          <SideHead label={`${surahName(cardSide.surah)} ${options.map(item => num(item.ayah.number)).join(' · ')}`} keys={options.map(item => `${cardSide.surah}:${item.ayah.number}`)} palette={palette} group={i === 0 ? card.group : undefined} />
          {around?.before[i] && <RunningAyat ayat={[]} before={around.before[i]} palette={palette} light={() => ({ lit: null })} />}
          {options.map((item, row) => (<Fragment key={item.id}>
            {row > 0 && <Rule dashed color={palette.rule} />}
            <Pressable onPress={() => { if (!step && row !== selected) { setPicked(row); setTapped(null); } }} accessibilityRole="button" accessibilityState={{ selected: row === selected }}
              accessibilityLabel={`${surahName(cardSide.surah)} ${num(item.ayah.number)}`}
              style={{ borderRightWidth: 3, borderRightColor: row === selected ? palette.accent : 'transparent', paddingRight: 8 }}>
              <AyahText ayah={item.ayah} palette={palette} plain={row !== selected} light={row === selected ? lightFor(lit, step, i, item.ayah.number, onWord) : undefined} />
            </Pressable>
          </Fragment>))}
          {around?.after[i] && <RunningAyat ayat={[]} after={around.after[i]} palette={palette} light={() => ({ lit: null })} />}
        </View>
      );
    }
    const ayat = option && card.many ? [option.shared] : cardSide.ayat;
    return (
      <View key={i} style={{ gap: 2 }}>
        <SideHead label={sideLabel(cardSide)} keys={sideKeys(cardSide)} palette={palette} group={i === 0 ? card.group : undefined} />
        <RunningAyat ayat={ayat} before={around?.before[i]} after={around?.after[i]} palette={palette} light={ayah => lightFor(lit, step, i, ayah.number, onWord)} />
      </View>
    );
  };

  // A refrain card's tree names every place the refrain repeats, as its matrix does.
  const refrainLabels = card.many && isRefrain(card.many.options)
    ? sides.map((side, i) => (i === card.many!.side ? `${surahName(side.surah)} ${card.many!.options.map(item => num(item.ayah.number)).join(' · ')}` : sideLabel(side))) as [string, string]
    : undefined;

  const pickers = card.many && !isRefrain(card.many.options) && (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
      {card.many.options.map((item, row) => (
        <Pressable key={item.id} onPress={() => setPicked(row)} accessibilityRole="button" accessibilityState={{ selected: row === selected }}
          accessibilityLabel={`${surahName(card.sides[card.many!.side].surah)} ${num(item.ayah.number)}`}
          style={{ minWidth: 44, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: row === selected ? palette.accent : palette.rule, paddingHorizontal: 8 }}>
          <Text style={{ color: row === selected ? palette.accent : palette.muted, fontSize: 14 }}>{num(item.ayah.number)}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View style={{ gap: 4 }}>
      <Pressable onPress={tap} accessibilityHint="انقر مرتين للحفظ"
        style={{ backgroundColor: palette.card, borderWidth: 1, borderColor: palette.rule, borderRadius: 12, padding: 12, gap: 10 }}>
        {tree ? <>
          {pickers}
          <CompareBraid sides={sides} palette={palette} around={around} labels={refrainLabels} />
        </> : <>
          {side(card.sides[0], 0)}
          <Rule dashed={card.sides[0].surah === card.sides[1].surah} color={palette.rule} />
          {side(card.sides[1], 1)}
        </>}
      </Pressable>
      {read.studio ? <Studio read={read} palette={palette} card={card} /> : (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          {/* In matrix view this button sits on the first ayah's line instead, as on the website. */}
          {tree && card.group && <Pressable onPress={() => router.navigate({ pathname: '/branches', params: { tree: card.group } })} hitSlop={6} accessibilityRole="button" accessibilityLabel="افتح في متشابهات القرآن" style={{ padding: 8 }}>
            <TreeIcon size={22} color={palette.muted} />
          </Pressable>}
          <Pressable onPress={() => setView(view === 'tree' ? 'matrix' : 'tree')} hitSlop={6} accessibilityRole="button" accessibilityLabel={view === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة'} style={{ padding: 8 }}>
            {view === 'tree' ? <GalleryHorizontal size={22} color={palette.muted} /> : <TreeIcon size={22} color={palette.muted} />}
          </Pressable>
          <Pressable onPress={() => setAround(!aroundOn)} hitSlop={6} accessibilityRole="button" accessibilityState={{ selected: aroundOn }} accessibilityLabel="الآيات المحيطة" style={{ padding: 8 }}>
            <UnfoldHorizontal size={22} color={aroundOn ? palette.accent : palette.muted} />
          </Pressable>
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

// A line between ayat: solid between two surahs, dashed between ayat of one surah, as on the website.
// iOS draws no dashed border on one edge only, so a dashed box is clipped to its top edge.
function Rule({ dashed, color }: { dashed?: boolean; color: string }) {
  if (!dashed) return <View style={{ height: 1, backgroundColor: color }} />;
  return (
    <View style={{ height: 1, overflow: 'hidden' }}>
      <View style={{ height: 3, borderWidth: 1, borderColor: color, borderStyle: 'dashed' }} />
    </View>
  );
}
