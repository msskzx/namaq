import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, { useAnimatedStyle, useFrameCallback, useReducedMotion, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { SEA_ART } from '@/lib/theme';

/*
 * The sea of an-Nur 40, drawn once and moved whole (owner, 2026-11-23: the first build stuttered and closed Expo Go).
 * Every shape is a still SVG drawn when the screen's size is known; a frame only moves layers and fades them
 * (transform and opacity, which the phone moves without drawing again). Each layer stands alone, so hand-made art can
 * take its place later.
 */

const clamp = (v: number) => { 'worklet'; return Math.max(0, Math.min(1, v)); };
const ease = (x: number) => { 'worklet'; return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const lerp = (a: number, b: number, u: number) => { 'worklet'; return a + (b - a) * u; };

/** Where each part of the picture stands at a look (0 the calm sea … 7 the black). */
function state(t: number, H: number) {
  'worklet';
  const sea = ease(clamp(t)), w1 = ease(clamp(t - 1)), w2 = ease(clamp(t - 2)), cl = ease(clamp(t - 3)), dk = clamp(t - 4);
  return {
    sea, w1, w2, cl,
    // The four darknesses, one after another.
    dSea: ease(clamp(dk * 4)), dWave: ease(clamp(dk * 4 - 1)), dCloud: ease(clamp(dk * 4 - 2)), dNight: ease(clamp(dk * 4 - 3)),
    deeper: ease(clamp(t - 5)), black: ease(clamp(t - 6)),
    light: 1 - 0.1 * w1 - 0.1 * w2 - 0.22 * cl,
    // The waterline: up as the depth opens, down as the clouds come so they never touch the waves.
    sy: H * (lerp(0.62, 0.5, sea) + 0.12 * cl),
  };
}
/** The edge of the newest layer is gold; once passed, it goes quiet. Returns its own stroke's and the gold's share. */
function rim(t: number, at: number, alpha: number) {
  'worklet';
  const f = clamp(1 - Math.abs(t - at) * 1.4), a = alpha * (t > at + 0.5 ? 0.55 : 1);
  return { own: a * (1 - f), gold: a * f };
}

/** A line through points every `step` across [x0, x1]. */
function line(x0: number, x1: number, y: (x: number) => number, step = 8) {
  let d = '';
  for (let x = x0; x <= x1 + step; x += step) d += `${x === x0 ? 'M' : 'L'}${x.toFixed(1)} ${y(x).toFixed(1)}`;
  return d;
}

const WAVES = [{ at: 2, lift: 0, amp: 0.1, ph: 0, k: 1.15, rise: 0.55, alpha: 0.75, sway: 0.35 },
  { at: 3, lift: 0.05, amp: 0.13, ph: 2.2, k: 0.85, rise: 0.6, alpha: 0.8, sway: 0.27 }];
const BANKS = [[0.2, 0.05, 0.6, 0.7, 0.85], [0.26, 0.045, 2.1, 1.0, 1], [0.32, 0.04, 4.0, 1.35, 1.15]] as const;
const SPECKS = Array.from({ length: 36 }, (_, i) => ({ x: ((i * 0.618) % 1), y: ((i * 0.377) % 1), r: 0.5 + ((i * 7) % 10) / 10 }));

/** One layer: a still drawing moved and faded by `style`. */
function Layer({ style, children, left = 0, width, height }: { style: object; children: React.ReactNode; left?: number; width: number; height: number }) {
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left, top: 0, width, height }, style]}>
      <Svg width={width} height={height}>{children}</Svg>
    </Animated.View>
  );
}

export default function SeaArt({ look, width: W, height: H, still = false }: { look: SharedValue<number>; width: number; height: number;
  /** A picture that does not move (the share image). */
  still?: boolean }) {
  const reduced = useReducedMotion();
  const clock = useSharedValue(0);
  useFrameCallback(frame => { clock.value = (frame.timeSinceFirstFrame ?? 0) / 1000; }, !still && !reduced);

  // The moving layers are wider than the screen by this much on each side, so their sway never shows an end.
  const over = W * 0.1, wide = W + 2 * over;
  const shapes = useMemo(() => {
    const crestH = H * 0.4, crests = Array.from({ length: 7 }, (_, i) => {
      const f = i / 6, y = H * (0.006 + 0.3 * f * f) + 2, amp = 1 + f * 6, wl = 0.012 - f * 0.007;
      return line(0, wide, x => y + Math.sin(x * wl + i * 1.7) * amp, 10);
    }).join('');
    const deep = H * 0.6;
    const rays = Array.from({ length: 6 }, (_, i) => {
      const x0 = W * (0.08 + i * 0.17), top = W * 0.05, len = deep * (0.55 + 0.1 * Math.sin(i * 3));
      return `M${x0} 0L${x0 + top} 0L${x0 + top * 2.6 + len * 0.18} ${len}L${x0 + len * 0.18} ${len}Z`;
    }).join('');
    const specks = SPECKS.map(p => {
      const x = p.x * W, y = 10 + p.y * deep;
      return `M${x - p.r} ${y}a${p.r} ${p.r} 0 1 0 ${2 * p.r} 0a${p.r} ${p.r} 0 1 0 ${-2 * p.r} 0`;
    }).join('');
    // A wave stands with its crest line near the top of its own drawing; the body runs below the screen.
    const waves = WAVES.map(w => {
      const base = H * 0.3, amp = H * w.amp;
      const y = (x: number) => { const u = (x - over) / W; return base - amp * (0.62 + 0.24 * Math.sin(u * Math.PI * 2 * w.k + w.ph) + 0.14 * Math.sin(u * Math.PI * 2 * w.k * 2.3 + w.ph * 1.7)); };
      const edge = line(0, wide, y);
      return { base, body: `M0 ${H * 1.4}${edge.replace(/^M/, 'L')}L${wide} ${H * 1.4}Z`, edge, foam: [1, 2, 3].map(j => line(0, wide, x => y(x) + j * 5, 10)).join('') };
    });
    // A cloud bank's lower edge at its resting place; its body runs to above the screen.
    const banks = BANKS.map(([by, ba, ph, k]) => {
      const amp = H * ba, bottom = H * by;
      const y = (x: number) => { const u = (x - over) / W; return bottom + amp * (0.55 * Math.abs(Math.sin(u * Math.PI * 2 * k + ph)) + 0.3 * Math.abs(Math.sin(u * Math.PI * 2 * k * 2.2 + ph * 1.6))); };
      const edge = line(0, wide, y, 6);
      return { body: `M0 ${-H * 0.6}${edge.replace(/^M/, 'L')}L${wide} ${-H * 0.6}Z`, edge, under: line(0, wide, x => y(x) + 6, 6) };
    });
    return { crestH, crests, deep, rays, specks, waves, banks };
  }, [W, H, over, wide]);

  // The water, its light and its specks hang from the waterline.
  const water = useAnimatedStyle(() => ({ transform: [{ translateY: state(look.value, H).sy }] }));
  const glow = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: 0.45 * s.light * (1 - s.cl * 0.85) }; });
  const rays = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: s.sea * s.light * (1 - s.dSea) }; });
  const specks = useAnimatedStyle(() => {
    const s = state(look.value, H);
    return { opacity: 0.3 * s.sea * s.light * (1 - s.dSea), transform: [{ translateY: s.sy + Math.sin(clock.value * 0.3) * 6 }] };
  });
  const crests = useAnimatedStyle(() => {
    const s = state(look.value, H), calm = 1 - s.sea * 0.75;
    return { opacity: s.light * calm, transform: [{ translateX: -over + Math.sin(clock.value * 0.4) * over * 0.4 }, { translateY: s.sy }] };
  });
  // Glints breathe on the crests.
  const glints = useAnimatedStyle(() => {
    const s = state(look.value, H), calm = 1 - s.sea * 0.75;
    return { opacity: s.light * calm * (1 - s.dWave) * (0.55 + 0.45 * Math.sin(clock.value * 1.3)), transform: [{ translateX: -over + Math.sin(clock.value * 0.4) * over * 0.4 }, { translateY: s.sy }] };
  });

  const wave = (n: 0 | 1) => {
    const w = WAVES[n];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const body = useAnimatedStyle(() => {
      const s = state(look.value, H), grow = n ? s.w2 : s.w1, time = clock.value;
      const at = s.sy - H * w.lift + (1 - grow) * H * w.rise;
      return {
        opacity: grow > 0 ? 1 : 0,
        transform: [{ translateX: -over + Math.sin(time * w.sway + w.ph) * over * 0.6 }, { translateY: at - shapes.waves[n].base + Math.sin(time * 0.5 + w.ph) * 3 }],
      };
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const own = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: rim(look.value, w.at, w.alpha * s.light * (1 - s.dWave * 0.85)).own }; });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const gold = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: rim(look.value, w.at, w.alpha * s.light * (1 - s.dWave * 0.85)).gold }; });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const foam = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: 0.22 * s.light * (1 - s.dWave) }; });
    return { body, own, gold, foam };
  };
  const waves = [wave(0), wave(1)];

  const bank = (n: 0 | 1 | 2) => {
    const [by, , , , sh] = BANKS[n];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const body = useAnimatedStyle(() => {
      const s = state(look.value, H), bottom = lerp(-H * 0.25, H * by, s.cl);
      return { opacity: s.cl > 0 ? 1 : 0, transform: [{ translateX: -over + Math.sin(clock.value * 0.03 + n * 2) * over * 0.5 }, { translateY: bottom - H * by }] };
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const own = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: rim(look.value, 4, 0.6 * sh * s.light * (1 - s.dCloud * 0.8)).own }; });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const gold = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: rim(look.value, 4, 0.6 * sh * s.light * (1 - s.dCloud * 0.8)).gold }; });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const under = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: 0.16 * sh * s.light * (1 - s.dCloud) }; });
    return { body, own, gold, under, sh };
  };
  const banks = [bank(0), bank(1), bank(2)];

  // How dark it has grown: the colours fade as each layer comes, then the darknesses fall one over another.
  const dim = useAnimatedStyle(() => ({ opacity: 1 - state(look.value, H).light }));
  const darkSea = useAnimatedStyle(() => ({ opacity: 0.88 * state(look.value, H).dSea }));
  const darkWaves = useAnimatedStyle(() => ({ opacity: 0.85 * state(look.value, H).dWave }));
  const darkClouds = useAnimatedStyle(() => ({ opacity: 0.86 * state(look.value, H).dCloud }));
  const night = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: Math.min(1, 0.93 * s.dNight + 0.06 * s.deeper + 0.01 * s.black) }; });
  const blacker = useAnimatedStyle(() => { const s = state(look.value, H); return { opacity: 0.75 * s.deeper + 0.25 * s.black }; });

  // The darknesses' bands stand where the layers are once all have come (the waterline then at 0.62).
  const sy = H * 0.62;
  const black = (style: object) => <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: SEA_ART.black }, style]} />;
  const band = (style: object, y: number, h: number) => (
    <Layer style={style} width={W} height={H}>
      <Defs>
        <LinearGradient id="band" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SEA_ART.black} stopOpacity={0} /><Stop offset="0.15" stopColor={SEA_ART.black} stopOpacity={1} /><Stop offset="0.85" stopColor={SEA_ART.black} stopOpacity={1} /><Stop offset="1" stopColor={SEA_ART.black} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect y={y} width={W} height={h} fill="url(#band)" />
    </Layer>
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill} width={W} height={H}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={SEA_ART.sky[0]} /><Stop offset="0.45" stopColor={SEA_ART.sky[1]} /><Stop offset="0.62" stopColor={SEA_ART.sky[2]} />
          </LinearGradient>
        </Defs>
        <Rect width={W} height={H} fill="url(#sky)" />
      </Svg>
      <Layer style={glow} width={W} height={H}>
        <Defs><RadialGradient id="glow" cx="0.62" cy="0.5" r="0.7"><Stop offset="0" stopColor={SEA_ART.glow} stopOpacity={1} /><Stop offset="1" stopColor={SEA_ART.glow} stopOpacity={0} /></RadialGradient></Defs>
        <Rect width={W} height={H} fill="url(#glow)" />
      </Layer>
      <Layer style={water} width={W} height={H}>
        <Defs>
          <LinearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={SEA_ART.deep[0]} /><Stop offset="0.35" stopColor={SEA_ART.deep[1]} /><Stop offset="1" stopColor={SEA_ART.deep[2]} />
          </LinearGradient>
        </Defs>
        <Rect width={W} height={H} fill="url(#deep)" />
      </Layer>
      <Layer style={[water, rays]} width={W} height={shapes.deep}>
        <Defs><LinearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={SEA_ART.ray} stopOpacity={0.2} /><Stop offset="1" stopColor={SEA_ART.ray} stopOpacity={0} /></LinearGradient></Defs>
        <Path d={shapes.rays} fill="url(#ray)" />
      </Layer>
      <Layer style={specks} width={W} height={shapes.deep + 20}><Path d={shapes.specks} fill={SEA_ART.speck} /></Layer>
      <Layer style={crests} width={wide} height={shapes.crestH}><Path d={shapes.crests} fill="none" stroke={SEA_ART.crest} strokeWidth={1.2} /></Layer>
      <Layer style={glints} width={wide} height={shapes.crestH}><Path d={shapes.crests} fill="none" stroke={SEA_ART.glint} strokeWidth={1.6} strokeDasharray="10 70" /></Layer>
      {waves.map((w, i) => (
        <Animated.View key={`wave${i}`} pointerEvents="none" style={[{ position: 'absolute', left: 0, top: 0, width: wide, height: H * 1.4 }, w.body]}>
          <Svg width={wide} height={H * 1.4}>
            <Defs>
              <LinearGradient id={`wave${i}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={SEA_ART.wave[0]} /><Stop offset="0.12" stopColor={SEA_ART.wave[1]} /><Stop offset="0.45" stopColor={SEA_ART.wave[2]} /><Stop offset="1" stopColor={SEA_ART.wave[3]} />
              </LinearGradient>
            </Defs>
            <Path d={shapes.waves[i].body} fill={`url(#wave${i})`} />
          </Svg>
          <Layer style={w.foam} width={wide} height={H * 1.4}><Path d={shapes.waves[i].foam} fill="none" stroke={SEA_ART.foam} strokeWidth={1} strokeDasharray="14 22" /></Layer>
          <Layer style={w.own} width={wide} height={H * 1.4}><Path d={shapes.waves[i].edge} fill="none" stroke={SEA_ART.rim[i]} strokeWidth={i ? 2.2 : 1.8} /></Layer>
          <Layer style={w.gold} width={wide} height={H * 1.4}><Path d={shapes.waves[i].edge} fill="none" stroke={SEA_ART.gold} strokeWidth={i ? 2.2 : 1.8} /></Layer>
        </Animated.View>
      ))}
      {banks.map((b, i) => (
        <Animated.View key={`bank${i}`} pointerEvents="none" style={[{ position: 'absolute', left: 0, top: 0, width: wide, height: H * 0.5 }, b.body]}>
          <Svg width={wide} height={H * 0.5}>
            <Defs>
              <LinearGradient id={`cloud${i}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={SEA_ART.cloud[0]} /><Stop offset="0.7" stopColor={SEA_ART.cloud[1]} /><Stop offset="1" stopColor={SEA_ART.cloud[2]} />
              </LinearGradient>
            </Defs>
            <G opacity={0.6 + 0.4 * (b.sh - 0.85) / 0.3}><Path d={shapes.banks[i].body} fill={`url(#cloud${i})`} /></G>
          </Svg>
          <Layer style={b.under} width={wide} height={H * 0.5}><Path d={shapes.banks[i].under} fill="none" stroke={SEA_ART.underlight} strokeWidth={16} /></Layer>
          <Layer style={b.own} width={wide} height={H * 0.5}><Path d={shapes.banks[i].edge} fill="none" stroke={SEA_ART.rim[2]} strokeWidth={1.5} /></Layer>
          <Layer style={b.gold} width={wide} height={H * 0.5}><Path d={shapes.banks[i].edge} fill="none" stroke={SEA_ART.gold} strokeWidth={1.5} /></Layer>
        </Animated.View>
      ))}
      {black(dim)}
      {band(darkSea, sy + H * 0.08, H - sy)}
      {band(darkWaves, sy - H * 0.25, H * 0.46)}
      {band(darkClouds, -H * 0.05, sy - H * 0.06)}
      {black(night)}
      {black(blacker)}
      <Svg style={StyleSheet.absoluteFill} width={W} height={H}>
        <Defs><RadialGradient id="vignette" cx="0.5" cy="0.5" r="0.75"><Stop offset="0.55" stopColor={SEA_ART.black} stopOpacity={0} /><Stop offset="1" stopColor={SEA_ART.black} stopOpacity={0.55} /></RadialGradient></Defs>
        <Rect width={W} height={H} fill="url(#vignette)" />
      </Svg>
    </View>
  );
}
