import { Fragment, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BookOpen, ChevronsDown, Hand, Send } from 'lucide-react-native';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { DARK_SEA_KEY, DARK_SEA_READINGS, DARK_SEA_STEPS, darkSeaSources, darkSeaTitle, darkSeaWords, type SceneSaying } from '@shared/quran/scenes/darkSea';
import { Text } from '@/ui/Text';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Saying from '@/ui/Saying';
import StepDots from '@/ui/StepDots';
import Hold from '@/ui/Hold';
import IconButton from '@/ui/IconButton';
import { sourcesOf } from '@/ui/SourceLine';
import { ayahMushafWords } from '@/lib/mushaf';
import { readAyah } from '@/lib/openReader';
import { shareCard } from '@/lib/shareImage';
import type { Palette } from '@/lib/theme';
import AyahFlow, { AyahWords } from './quran/text/AyahFlow';

const LAST = DARK_SEA_STEPS.length - 1;
const at = (layer: string) => DARK_SEA_STEPS.findIndex(step => step.layer === layer);
const SEA = at('sea'), WAVE = at('wave'), WAVE2 = at('wave2'), CLOUD = at('cloud'), NIGHT = at('night'), HAND = at('hand');
/** How far a finger moves for one layer. */
const STEP_PX = 90;
/** The picture the feed card and the shared image show: every layer, the night over them. */
export const STILL_STEP = NIGHT;

export const darkSeaName = () => darkSeaTitle(surahName(Number(DARK_SEA_KEY.split(':')[0])));
export const darkSeaSourceList = () => sourcesOf(darkSeaSources());

/** The ayah, its words lit as the scene reaches them: the step's words in the theme's yellow, those passed in ink. */
function SceneAyah({ step, palette }: { step: number; palette: Palette }) {
  const words = useMemo(() => darkSeaWords(ayahMushafWords), []);
  return (
    <AyahFlow color={palette.ink} center>
      {words.map((word, i) => (
        <Fragment key={i}>
          <AyahWords look={{ color: word.step === step ? palette.highlight : word.step < step ? palette.ink : `${palette.muted}73` }}>{`${i ? ' ' : ''}${word.text}`}</AyahWords>
        </Fragment>
      ))}
      <AyahWords look={{ color: palette.muted }}>{` ${num(Number(DARK_SEA_KEY.split(':')[1]))}`}</AyahWords>
    </AyahFlow>
  );
}

/** A layer's picture comes in as the depth passes it. */
function useLayer(depth: SharedValue<number>, step: number) {
  return useAnimatedStyle(() => ({ opacity: interpolate(depth.value, [step - 1, step], [0, 1], 'clamp') }));
}

/** The art of the scene, layer on layer (drawn shapes until the owner's art comes). */
function SceneArt({ depth, hand }: { depth: SharedValue<number>; hand: SharedValue<number> }) {
  const sea = useLayer(depth, SEA), wave = useLayer(depth, WAVE), wave2 = useLayer(depth, WAVE2), cloud = useLayer(depth, CLOUD);
  const dark = useAnimatedStyle(() => ({ opacity: interpolate(depth.value, [0, CLOUD, NIGHT, LAST], [0, 0.3, 0.85, 0.92], 'clamp') }));
  const handStyle = useAnimatedStyle(() => ({ opacity: hand.value * 0.25 }));
  const fill = StyleSheet.absoluteFill;
  return (
    <>
      <Svg style={fill} viewBox="0 0 440 600" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="surface" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#1f3340" /><Stop offset="0.45" stopColor="#2c4a57" /><Stop offset="0.46" stopColor="#1a3a4a" /><Stop offset="1" stopColor="#0e2230" />
          </LinearGradient>
        </Defs>
        <Rect width="440" height="600" fill="url(#surface)" />
      </Svg>
      <Animated.View style={[fill, sea]}>
        <Svg style={fill} viewBox="0 0 440 600" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#14303e" /><Stop offset="0.5" stopColor="#0b1d28" /><Stop offset="1" stopColor="#03090d" />
            </LinearGradient>
          </Defs>
          <Rect width="440" height="600" fill="url(#deep)" />
        </Svg>
      </Animated.View>
      <Animated.View style={[fill, wave]}>
        <Svg style={fill} viewBox="0 0 440 600" preserveAspectRatio="none">
          <Path d="M0 300 Q50 260 100 300 T200 298 T300 296 T440 298 V200 H0Z" fill="#1b3a49" />
          <Path d="M0 300 Q50 260 100 300 T200 298 T300 296 T440 298" fill="none" stroke="#7fa6b5" strokeWidth={2} />
        </Svg>
      </Animated.View>
      <Animated.View style={[fill, wave2]}>
        <Svg style={fill} viewBox="0 0 440 600" preserveAspectRatio="none">
          <Path d="M0 200 Q40 160 90 198 T190 196 T290 194 T440 196 V130 H0Z" fill="#22455a" />
          <Path d="M0 200 Q40 160 90 198 T190 196 T290 194 T440 196" fill="none" stroke="#8fb5c4" strokeWidth={2} />
        </Svg>
      </Animated.View>
      <Animated.View style={[fill, cloud]}>
        <Svg style={fill} viewBox="0 0 440 600" preserveAspectRatio="none">
          <Path d="M0 130 C60 100 120 100 180 130 S300 160 440 120 V0 H0Z" fill="#2c323c" />
        </Svg>
      </Animated.View>
      <Animated.View style={[fill, { backgroundColor: '#000' }, dark]} />
      <Animated.View style={[fill, handStyle]} pointerEvents="none">
        <Svg style={fill} viewBox="0 0 440 600">
          <Path d="M220 250 v-84 M194 252 v-72 M246 252 v-70 M270 258 v-50 M172 266 l-28 -38 M168 266 q52 76 104 0" stroke="#f2eadc" strokeWidth={4} strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>
    </>
  );
}

/** What the scholars say on the step: each saying with its sayer first (owner, 2026-11-21: named, never «قيل»). */
function Sayings({ sayings, palette }: { sayings: SceneSaying[]; palette: Palette }) {
  return sayings.map((saying, i) => (
    <Saying key={i} by={`قال ${saying.by}:`} palette={palette}>
      <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>«{saying.text}»</Text>
    </Saying>
  ));
}

/** The last step: what the parable means, al-Tabari's words, then each scholar's naming of the darknesses, one at a time. */
function Meaning({ palette }: { palette: Palette }) {
  const sayers = [...new Set(DARK_SEA_READINGS.map(saying => saying.by))];
  const [sayer, setSayer] = useState(sayers[0]);
  return <>
    <Sayings sayings={DARK_SEA_STEPS[LAST].sayings} palette={palette} />
    <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>ما هذه الظلمات؟</Text>
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {sayers.map(name => <Chip key={name} role="tab" label={name} on={name === sayer} onPress={() => setSayer(name)} palette={palette} />)}
    </View>
    <Sayings sayings={DARK_SEA_READINGS.filter(saying => saying.by === sayer)} palette={palette} />
  </>;
}

/**
 * «ظلمات بعضها فوق بعض» (an-Nur 40) as a scene (owner, 2026-11-21; docs/feed-cards.md): the ayah above, its sea below.
 * A finger moving up goes down a layer at a time, each layer lighting its words and saying what it is in the scholars'
 * words; the dots beside it jump to a layer; at the hand the reader holds a finger down to bring a hand out, and barely
 * sees it. `still` draws the whole picture without gestures (the feed card, the shared image).
 */
export default function DarkSea({ palette, still = false }: { palette: Palette; still?: boolean }) {
  const reduced = useReducedMotion();
  const first = still ? STILL_STEP : 0;
  const depth = useSharedValue(first);
  const hand = useSharedValue(0);
  const start = useSharedValue(0);
  const [step, setStep] = useState(first);
  useAnimatedReaction(() => Math.round(depth.value), (now, before) => { if (now !== before) scheduleOnRN(setStep, now); });
  const go = (to: number) => { depth.value = reduced ? to : withTiming(to, { duration: 320 }); };
  const pan = Gesture.Pan()
    .activeOffsetY([-12, 12])
    .onBegin(() => { start.value = depth.value; })
    .onUpdate(event => { depth.value = Math.min(LAST, Math.max(0, start.value - event.translationY / STEP_PX)); })
    .onEnd(event => {
      const target = Math.min(LAST, Math.max(0, Math.round(depth.value - event.velocityY / 2400)));
      depth.value = withTiming(target, { duration: 220 });
    });
  const onHold = (down: boolean) => { hand.value = withTiming(down && Math.round(depth.value) === HAND ? 1 : 0, { duration: down ? 900 : 300 }); };
  const current = DARK_SEA_STEPS[step];
  const scene = (
    <View style={{ flex: still ? undefined : 1, height: still ? 300 : undefined, overflow: 'hidden' }}
      accessible={still} accessibilityLabel={still ? `${darkSeaName()}: البحر والموج والسحاب والليل، ظلمات بعضها فوق بعض` : undefined}>
      <SceneArt depth={depth} hand={hand} />
      {!still && (
        <View style={{ position: 'absolute', start: 4, top: 12 }}>
          <StepDots names={DARK_SEA_STEPS.map(each => each.name)} at={step} onPick={go} palette={palette} />
        </View>
      )}
      {!still && step === 0 && (
        <View style={{ position: 'absolute', top: 24, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <ChevronsDown size={16} color={palette.ink} />
          <Text style={{ color: palette.ink, fontSize: 15 }}>اسحب إلى الأعلى لتنزل في البحر</Text>
        </View>
      )}
      {!still && step === HAND && (
        <View style={{ position: 'absolute', top: 24, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Hand size={16} color={palette.muted} />
          <Text style={{ color: palette.muted, fontSize: 15 }}>اضغط مطوّلًا لتُخرج يدك</Text>
        </View>
      )}
      <View style={{ position: 'absolute', start: still ? 12 : 32, end: 12, bottom: 12 }}>
        <Card palette={palette} pad={[10, 14]} gap={8}>
          {current.layer === 'meaning' ? <Meaning palette={palette} /> : <Sayings sayings={current.sayings} palette={palette} />}
        </Card>
      </View>
    </View>
  );
  return (
    <View style={{ flex: still ? undefined : 1, gap: 10 }}>
      <SceneAyah step={still ? LAST + 1 : step} palette={palette} />
      {still ? scene : <GestureDetector gesture={pan}><View style={{ flex: 1 }}><Hold onHold={onHold}>{scene}</Hold></View></GestureDetector>}
    </View>
  );
}

/** The scene's mushaf and share buttons, in the row under it (the page and the feed card). */
export function DarkSeaActions({ palette, only }: { palette: Palette; only?: 'open' | 'share' }) {
  const name = darkSeaName();
  return <>
    {only !== 'share' && <IconButton Icon={BookOpen} label={`افتح ${name} في المصحف`} onPress={() => readAyah(DARK_SEA_KEY)} />}
    {only !== 'open' && <IconButton Icon={Send} label={`شارك ${name}`} onPress={() => shareCard({ content: width => (
      <View style={{ width }}><Card palette={palette} pad={[10, 16]} gap={10}><DarkSea palette={palette} still /></Card></View>
    ) })} />}
  </>;
}
