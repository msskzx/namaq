import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import Animated, { Easing, interpolate, useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import type { Palette } from '@/lib/theme';

/**
 * A double tap's mark where the finger was: «نسيت» (`forgot`) or the save (`save`), and `on`, what it became (forgotten,
 * saved). `id` tells one pop from the next.
 */
export type Pop = { id: number; x: number; y: number; kind: 'forgot' | 'save'; on: boolean };

const SIZE = 110;
const DURATION = 600;
/** The strike's length in the 24-unit box: from (2,2) to (22,22). */
const STRIKE = Math.hypot(20, 20);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const BULB = 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5';
const BOOKMARK = 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z';

/** Lucide's Lightbulb, with the strike drawn `drawn` of the way (0 none, 1 whole). */
function Bulb({ color, drawn, glow }: { color: string; drawn: SharedValue<number>; glow: boolean }) {
  const strike = useAnimatedProps(() => ({ strokeDashoffset: STRIKE * (1 - drawn.value) }));
  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill={glow ? `${color}33` : 'none'} stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d={BULB} />
      <Path d="M9 18h6" fill="none" />
      <Path d="M10 22h4" fill="none" />
      <AnimatedLine x1={2} y1={2} x2={22} y2={22} strokeWidth={2} strokeDasharray={[STRIKE, STRIKE]} animatedProps={strike} />
    </Svg>
  );
}

const Bookmark = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <Path d={BOOKMARK} />
  </Svg>
);

/**
 * The double tap's pop (owner, 2026-11-21, sketch forgot-double-tap/sketch-dark.png), like the heart on a double tap: it
 * shows where the finger was and fades in about 0.6 s. Forgetting, a lit yellow bulb is struck through and dims to the
 * forgotten wine; remembering, the reverse. Saving, the bookmark fills in the saved colour; unsaving, it empties. With
 * Reduce Motion there is no pop: the ayah's band or colour alone changes.
 */
export default function BulbPop({ pop, palette }: { pop: Pop | null; palette: Palette }) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(1);
  /** From what it was (0) to what it became (1): for «نسيت» the strike drawn, for the save the fill. */
  const turned = useSharedValue(0);
  const drawn = useSharedValue(0);
  useEffect(() => {
    if (!pop || reduced) return;
    progress.value = 0;
    progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.quad) });
    turned.value = 0;
    turned.value = withTiming(1, { duration: DURATION / 2 });
    drawn.value = pop.on ? 0 : 1;
    drawn.value = withTiming(pop.on ? 1 : 0, { duration: DURATION / 2 });
  }, [pop?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const box = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [1, 1, 0]),
    transform: [{ scale: interpolate(progress.value, [0, 0.25, 1], [0.7, 1, 1.05]) }],
  }));
  // The colour turns past halfway: yellow while lit, wine once struck.
  const lit = useAnimatedStyle(() => ({ opacity: interpolate(drawn.value, [0, 0.6, 1], [1, 1, 0]) }));
  const struck = useAnimatedStyle(() => ({ opacity: interpolate(drawn.value, [0, 0.6, 1], [0, 0, 1]) }));
  const before = useAnimatedStyle(() => ({ opacity: 1 - turned.value }));
  const after = useAnimatedStyle(() => ({ opacity: turned.value }));
  if (!pop || reduced) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.pop, { left: pop.x - SIZE / 2, top: pop.y - SIZE / 2 }, box]}>
      {pop.kind === 'forgot' ? <>
        <Animated.View style={[StyleSheet.absoluteFill, lit]}><Bulb color={palette.highlight} drawn={drawn} glow /></Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, struck]}><Bulb color={palette.accent} drawn={drawn} glow={false} /></Animated.View>
      </> : <>
        <Animated.View style={[StyleSheet.absoluteFill, before]}><Bookmark color={palette.root} filled={!pop.on} /></Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, after]}><Bookmark color={palette.root} filled={pop.on} /></Animated.View>
      </>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({ pop: { position: 'absolute', width: SIZE, height: SIZE } });
