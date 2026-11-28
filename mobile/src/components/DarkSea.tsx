import { useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { cancelAnimation, FadeIn, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useReducedMotion, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ChevronRight, Pause, Play, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { DARK_SEA_KEY, DARK_SEA_STEPS, DARK_SEA_TEASER, darkSeaShots, darkSeaSources, darkSeaTitle, darkSeaWords, shotOf, wordsPage, type Layer, type SceneSaying } from '@shared/quran/scenes/darkSea';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import Shade from '@/ui/Shade';
import Saying from '@/ui/Saying';
import Card from '@/ui/Card';
import Button from '@/ui/Button';
import StepDots from '@/ui/StepDots';
import IconButton from '@/ui/IconButton';
import OpenButton from '@/ui/OpenButton';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { ayahMushafWords } from '@/lib/mushaf';
import { readAyah } from '@/lib/openReader';
import { toTab } from '@/lib/ways';
import { shareCard } from '@/lib/shareImage';
import { dark, ForcePalette, SEA_ART, type Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';
import SeaArt from './scenes/SeaArt';
import SeaThumb, { useSceneWords } from './scenes/SeaThumb';
import SeaCover from './scenes/SeaCover';
import { FEATURE_ICON } from '@/components/featureIcons';
import { useLater } from '@/lib/hooks/useLater';
import { useOnChange } from '@/lib/hooks/useOnChange';

const PAGES = DARK_SEA_STEPS;
const LAST = PAGES.length - 1;
const DARK = PAGES.findIndex(page => page.parts);
const END = PAGES.findIndex(page => page.layer === 'end');
const LOOK: Record<Layer, number> = { surface: 0, sea: 1, wave: 2, wave2: 3, cloud: 4, night: 5, hand: 6, end: 7 };
const LOOKS = PAGES.map(page => LOOK[page.layer]);
const SHOTS = darkSeaShots();

export const darkSeaName = () => darkSeaTitle(surahName(Number(DARK_SEA_KEY.split(':')[0])));
export const darkSeaSourceList = () => sourcesOf(darkSeaSources());
export const openDarkSea = () => router.push({ pathname: '/scene', params: { id: DARK_SEA_KEY } });

const clamp = (v: number) => { 'worklet'; return Math.max(0, Math.min(1, v)); };

function restOf(page: number) {
  const step = PAGES[page];
  const words = step.sayings.reduce((n, saying) => n + saying.text.split(' ').length, 0) + (page === 0 ? 30 : 6);
  return Math.max(3200, (words / 2.5) * 1000 + 1200);
}

function Quote({ saying, parts }: { saying: SceneSaying; parts?: React.ReactNode }) {
  return (
    <Saying by={`قال ${saying.by}:`} palette={dark} size={15} center>
      {parts ?? <Text style={{ color: SEA_ART.ink, fontSize: 20, lineHeight: 34, textAlign: 'center' }}>«{saying.text}»</Text>}
      <Text style={{ color: SEA_ART.source, fontSize: 13, textAlign: 'center' }}>{saying.source.book}</Text>
    </Saying>
  );
}

function Part({ text, index, count, look }: { text: string; index: number; count: number; look: { value: number } }) {
  const style = useAnimatedStyle(() => ({ opacity: withTiming(clamp(look.value - 4) * 4 >= index + 0.55 ? 1 : 0, { duration: 900 }) }));
  return (
    <Animated.View style={style}>
      <Text style={{ color: SEA_ART.ink, fontSize: 20, lineHeight: 34, textAlign: 'center' }}>{`${index ? '' : '«'}${text}${index === count - 1 ? '»' : ''}`}</Text>
    </Animated.View>
  );
}

export default function DarkSea() {
  const palette = dark;
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const pos = useSharedValue(0);
  const start = useSharedValue(0);
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useLater();
  const words = useMemo(() => darkSeaWords(ayahMushafWords), []);
  const look = useDerivedValue(() => {
    const i = Math.min(LAST - 1, Math.floor(pos.value)), f = clamp(pos.value - i);
    return LOOKS[i] + (LOOKS[i + 1] - LOOKS[i]) * f;
  });
  useAnimatedReaction(() => (pos.value > DARK - 0.98 && pos.value < DARK ? DARK : Math.round(pos.value)), (now, before) => { if (now !== before) scheduleOnRN(setPage, now); });

  const goTo = (target: number, at?: number) => {
    'worklet';
    const from = at ?? pos.value;
    const to = Math.max(0, Math.min(LAST, target));
    if (reduced) { pos.value = to; return; }
    if (to === DARK && from < DARK - 0.5) {
      const base = DARK - 1, step = (k: number) => withTiming(base + k / 4, { duration: 700 });
      pos.value = withSequence(withTiming(base, { duration: Math.max(1, (base - from) * 600) }), step(1), withDelay(450, step(2)), withDelay(450, step(3)), withDelay(450, step(4)));
    } else pos.value = withTiming(to, { duration: 700 });
  };
  const stop = () => { timer.cancel(); setPlaying(false); };
  const pan = Gesture.Pan()
    .activeOffsetY([-12, 12])
    .onStart(() => { cancelAnimation(pos); start.value = pos.value; scheduleOnRN(stop); })
    .onUpdate(event => { pos.value = Math.min(LAST, Math.max(0, start.value - event.translationY / (height * 0.45))); })
    .onEnd(event => {
      let target = Math.round(pos.value);
      if (Math.abs(event.velocityY) > 350) target = event.velocityY < 0 ? Math.floor(start.value) + 1 : Math.ceil(start.value) - 1;
      goTo(target);
    });

  useOnChange([playing, page], () => {
    if (!playing) { timer.cancel(); return; }
    if (page >= LAST) { timer.cancel(); setPlaying(false); return; }
    timer.after(restOf(page) + (page === DARK ? 4600 : 0), () => goTo(page + 1, page));
  });
  const play = () => { if (playing) return stop(); if (page >= LAST) { pos.value = 0; setPage(0); } setPlaying(true); };

  const top = useAnimatedStyle(() => {
    const dimming = pos.value > DARK - 1 + 0.02 && pos.value < DARK - 0.03;
    return { opacity: withTiming(dimming || look.value > 6.3 ? 0 : 1, { duration: 600 }) };
  });
  const last = useAnimatedStyle(() => ({ opacity: withTiming(look.value > 6.85 && pos.value < END + 0.4 ? 1 : 0, { duration: 1200 }) }));

  const step = PAGES[page];
  const shown = wordsPage(page);
  const topWords = page === 0 ? words : words.filter(word => word.step === shown);
  const endWords = words.filter(word => word.step === END);
  const shot = shotOf(page);
  const name = darkSeaName();
  return (
    <ForcePalette value={dark}>
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1, backgroundColor: SEA_ART.black }} accessibilityLabel={`${name}: ${step.name}`}
        accessibilityRole="adjustable" accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={({ nativeEvent }) => { stop(); goTo(page + (nativeEvent.actionName === 'increment' ? 1 : -1), page); }}>
        <SeaArt look={look} width={width} height={height} />
        <View style={{ position: 'absolute', top: insets.top + 6, right: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 2 }}>
          <IconButton Icon={ChevronRight} label="رجوع" tone="ink" onPress={() => (router.canGoBack() ? router.back() : toTab('/lataif'))} />
          <View style={{ flex: 1 }} />
          <IconButton Icon={Send} label={`شارك ${name}`} onPress={() => shareDarkSea(palette)} />
          <Button pill label={playing ? 'أوقف' : 'شغّل'} Icon={playing ? Pause : Play} onPress={play} />
        </View>
        <View pointerEvents="box-none" style={{ flex: 1, paddingTop: insets.top + 64, paddingBottom: insets.bottom + 24, paddingHorizontal: 40 }}>
          {page === 0
            ? <View style={{ flex: 1, justifyContent: 'center' }}>
                <Shade style={{ gap: 0, paddingVertical: 18 }}>
                  <AyahFlow menu={DARK_SEA_KEY} color={SEA_ART.gold} center>
                    {topWords.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word.text}`}</AyahWords>)}
                    <AyahWords look={{ color: SEA_ART.muted }}>{` ${num(Number(DARK_SEA_KEY.split(':')[1]))}`}</AyahWords>
                  </AyahFlow>
                  <Text style={{ color: SEA_ART.muted, fontSize: 14, textAlign: 'center', marginTop: 6 }}>{name}</Text>
                </Shade>
              </View>
            : <>
                <Animated.View style={[{ alignItems: 'center', gap: 4 }, top]}>
                  <Animated.View key={shown} entering={FadeIn.duration(450)} style={{ alignSelf: 'stretch', alignItems: 'center', gap: 4 }}>
                  <AyahFlow menu={DARK_SEA_KEY} color={SEA_ART.gold} center style={{ alignSelf: 'stretch' }}>
                    {topWords.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word.text}`}</AyahWords>)}
                  </AyahFlow>
                  <Text style={{ color: SEA_ART.muted, fontSize: 13 }}>{name}</Text>
                  </Animated.View>
                </Animated.View>
                <View style={{ flex: 1 }} />
                <Shade key={page} style={[!step.sayings.length && !step.head && { backgroundColor: 'transparent' }]}>
                  {step.head ? <Text style={{ color: SEA_ART.gold, fontSize: 15, textAlign: 'center' }}>{step.head}</Text> : null}
                  {step.parts
                    ? <Quote saying={step.sayings[0]} parts={<View>{step.parts.map((part, i, all) => <Part key={i} text={part} index={i} count={all.length} look={look} />)}</View>} />
                    : step.sayings.map((saying, i) => <Quote key={i} saying={saying} />)}
                  {page === LAST ? <SourceLine sources={darkSeaSourceList()} palette={palette} /> : null}
                </Shade>
                <View style={{ flex: 1.15 }} />
              </>}
        </View>
        <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 32, right: 32, top: 0, bottom: 0, justifyContent: 'center' }, last]}>
          <AyahFlow menu={DARK_SEA_KEY} color={SEA_ART.gold} center>
            {endWords.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word.text}`}</AyahWords>)}
          </AyahFlow>
        </Animated.View>
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, justifyContent: 'center' }}>
          <StepDots column names={SHOTS.map(each => each.name)} at={shot} onPick={k => { stop(); goTo(SHOTS[k].page); }} palette={{ ...palette, highlight: SEA_ART.gold, muted: SEA_ART.muted, rule: SEA_ART.dotRule }} />
        </View>
      </View>
    </GestureDetector>
    </ForcePalette>
  );
}

export function DarkSeaCard({ palette, onPress, cover = false }: { palette: Palette; onPress?: () => void;
  cover?: boolean }) {
  const title = useSceneWords('sea');
  const [surah, ayah] = DARK_SEA_KEY.split(':').map(Number);
  const authors = [...new Set(darkSeaSources().map(source => source.author))].join(' · ');
  const Icon = FEATURE_ICON.scenes;
  const body = cover
    ? <View style={{ gap: 10 }}>
      <Card palette={palette} pad={0} clip><SeaCover place={darkSeaName()} /></Card>
      <View style={{ gap: 4 }}>
        <AyahFlow menu={DARK_SEA_KEY} color={palette.ink}>{title.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}</AyahFlow>
        <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>
          <Text style={{ color: palette.accent }}>{DARK_SEA_TEASER.by}: </Text>«{DARK_SEA_TEASER.text}»
          <Text style={{ color: palette.muted, fontSize: 14 }}> {DARK_SEA_TEASER.source.book} {DARK_SEA_TEASER.source.at}</Text>
        </Text>
      </View>
    </View>
    : <View style={{ gap: 10 }}>
      <Card palette={palette} pad={0} clip><SeaThumb place={darkSeaName()} /></Card>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Icon size={22} color={palette.accent} style={{ marginTop: 6 }} />
        <View style={{ flex: 1, gap: 2 }}>
          <AyahFlow menu={DARK_SEA_KEY} color={palette.ink}>{title.map((word, i) => <AyahWords key={i}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}</AyahFlow>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`سورة ${surahName(surah)} · الآية ${num(ayah)}`}</Text>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{authors}</Text>
        </View>
      </View>
    </View>;
  return onPress
    ? <TapRow onPress={onPress} role="link" label={`افتح مشهد ${darkSeaName()}`} style={{ flexDirection: 'column' }}>{body}</TapRow>
    : body;
}

const shareDarkSea = (palette: Palette) => shareCard({ content: width => (
  <View style={{ width, padding: 16, backgroundColor: palette.paper }}><DarkSeaCard palette={palette} /></View>
) });

export function DarkSeaActions({ palette, only, feed = false }: { palette: Palette; only?: 'open' | 'share';
  feed?: boolean }) {
  const name = darkSeaName();
  return <>
    {only !== 'share' && (feed ? <OpenButton label={`افتح مشهد ${name}`} onPress={openDarkSea} />
      : <IconButton Icon={FEATURE_ICON.mushaf} label={`افتح ${name} في المصحف`} onPress={() => readAyah(DARK_SEA_KEY)} />)}
    {only !== 'open' && <IconButton Icon={Send} label={`شارك ${name}`} onPress={() => shareDarkSea(palette)} />}
  </>;
}
