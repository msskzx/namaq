import { StyleSheet } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, { useAnimatedProps, useFrameCallback, useReducedMotion, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { colourOf, SEA_ART } from '@/lib/theme';

const APath = Animated.createAnimatedComponent(Path);
const ARect = Animated.createAnimatedComponent(Rect);
const AG = Animated.createAnimatedComponent(G);

/*
 * The sea of an-Nur 40 drawn in code, layer over layer (owner, 2026-11-22; the agreed prototype is
 * /mnt/project-files/mashahid/shorts-prototype/sea-scene.html). `look` runs 0 to 7: 0 the calm sea at dusk, 1 its depth
 * opening (light falling in and fading), 2 a wave covering it, 3 a wave over the wave, 4 clouds over them, 4→5 the
 * darknesses going out in al-Sa'di's order (the deep, the waves, the clouds, then night with no stars), 6 darker still,
 * 7 black. Each layer is its own shapes, so owner art can take one's place later. The newest layer's edge is a faint gold,
 * the colour of its words.
 */

const clamp = (v: number) => { 'worklet'; return Math.max(0, Math.min(1, v)); };
const ease = (x: number) => { 'worklet'; return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const lerp = (a: number, b: number, u: number) => { 'worklet'; return a + (b - a) * u; };

/** Where each part of the picture stands at a look. */
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

function waveY(x: number, W: number, base: number, amp: number, ph: number, time: number, k: number) {
  'worklet';
  const u = x / W;
  return base - amp * (0.62 + 0.24 * Math.sin(u * Math.PI * 2 * k + ph + time * 0.35) + 0.14 * Math.sin(u * Math.PI * 2 * k * 2.3 + ph * 1.7 - time * 0.5));
}
function line(W: number, y: (x: number) => number, step = 8) {
  'worklet';
  let d = '';
  for (let x = 0; x <= W + step; x += step) d += `${x ? 'L' : 'M'}${x.toFixed(1)} ${y(x).toFixed(1)}`;
  return d;
}
/** The edge of the newest layer is gold; once passed, it goes quiet. */
function rim(t: number, at: number, base: [number, number, number], alpha: number) {
  'worklet';
  const f = clamp(1 - Math.abs(t - at) * 1.4), old = t > at + 0.5 ? 0.55 : 1;
  return colourOf(lerp(base[0], 240, f), lerp(base[1], 214, f), lerp(base[2], 160, f), alpha * old);
}

const WAVES = [{ at: 2, lift: 0, amp: 0.1, ph: 0, k: 1.15, rise: 0.55, rim: [225, 240, 244] as [number, number, number], alpha: 0.75 },
  { at: 3, lift: 0.05, amp: 0.13, ph: 2.2, k: 0.85, rise: 0.6, rim: [235, 245, 247] as [number, number, number], alpha: 0.8 }];
const BANKS = [[0.2, 0.05, 0.6, 0.7, 0.85], [0.26, 0.045, 2.1, 1.0, 1], [0.32, 0.04, 4.0, 1.35, 1.15]] as const;
const RAYS = Array.from({ length: 6 }, (_, i) => i);
const SPECKS = Array.from({ length: 36 }, (_, i) => ({ x: ((i * 0.618) % 1), y: ((i * 0.377) % 1), r: 0.5 + ((i * 7) % 10) / 10, s: 0.2 + ((i * 3) % 7) / 10 }));

export default function SeaArt({ look, width: W, height: H, still = false }: { look: SharedValue<number>; width: number; height: number;
  /** A picture that does not move (the share image). */
  still?: boolean }) {
  const reduced = useReducedMotion();
  const clock = useSharedValue(0);
  useFrameCallback(frame => { clock.value = (frame.timeSinceFirstFrame ?? 0) / 1000; }, !still && !reduced);

  // The water under the line, and the sky's last light.
  const water = useAnimatedProps(() => { const { sy } = state(look.value, H); return { y: sy, height: H - sy }; });
  const glow = useAnimatedProps(() => { const s = state(look.value, H); return { opacity: 0.45 * s.light * (1 - s.cl * 0.85) }; });
  // Seven crest lines, smaller as they go far; glints slide along them. They sink away as the depth opens.
  const crests = useAnimatedProps(() => {
    const s = state(look.value, H), time = clock.value, calm = 1 - s.sea * 0.75;
    let d = '';
    for (let i = 0; i < 7; i++) {
      const f = i / 6, y = s.sy + H * (0.006 + 0.3 * f * f) * calm + 2, amp = 1 + f * 6, wl = 0.012 - f * 0.007;
      d += line(W, x => y + Math.sin(x * wl + time * (0.4 + f * 0.3) + i * 1.7) * amp, 8);
    }
    return { d, opacity: s.light * calm };
  });
  const glints = useAnimatedProps(() => {
    const s = state(look.value, H), time = clock.value, calm = 1 - s.sea * 0.75;
    let d = '';
    for (let i = 0; i < 7; i++) {
      const f = i / 6, y = s.sy + H * (0.006 + 0.3 * f * f) * calm + 2, amp = 1 + f * 6, wl = 0.012 - f * 0.007;
      d += line(W, x => y + Math.sin(x * wl + time * (0.4 + f * 0.3) + i * 1.7) * amp, 8);
    }
    return { d, strokeDashoffset: -time * 30, opacity: s.light * calm * (1 - s.dWave) };
  });
  // Light falling into the deep, fading as it goes down; and specks drifting in it (its size).
  const rays = useAnimatedProps(() => {
    const s = state(look.value, H), time = clock.value;
    let d = '';
    for (const i of RAYS) {
      const x0 = W * (0.08 + i * 0.17) + Math.sin(time * 0.25 + i * 2) * W * 0.03, top = W * 0.05, len = (H - s.sy) * (0.55 + 0.1 * Math.sin(i * 3));
      d += `M${x0} ${s.sy}L${x0 + top} ${s.sy}L${x0 + top * 2.6 + len * 0.18} ${s.sy + len}L${x0 + len * 0.18} ${s.sy + len}Z`;
    }
    return { d, opacity: s.sea * s.light * (1 - s.dSea) };
  });
  const specks = useAnimatedProps(() => {
    const s = state(look.value, H), time = clock.value, depth = Math.max(1, H - s.sy);
    let d = '';
    for (const p of SPECKS) {
      const y = s.sy + ((((p.y * depth - time * p.s * 6) % depth) + depth) % depth), x = p.x * W + Math.sin(time * 0.3 + p.y * 9) * 3;
      d += `M${x - p.r} ${y}a${p.r} ${p.r} 0 1 0 ${2 * p.r} 0a${p.r} ${p.r} 0 1 0 ${-2 * p.r} 0`;
    }
    return { d, opacity: 0.3 * s.sea * s.light * (1 - s.dSea) };
  });

  const wave = (n: 0 | 1) => {
    const w = WAVES[n];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const body = useAnimatedProps(() => {
      const s = state(look.value, H), grow = n ? s.w2 : s.w1, time = clock.value * (n ? 1.1 : 1);
      const base = s.sy - H * w.lift + (1 - grow) * H * w.rise, amp = H * w.amp * grow;
      return { d: `M0 ${H}` + line(W, x => waveY(x, W, base, amp, w.ph, time, w.k)).replace(/^M/, 'L') + `L${W} ${H}Z`, opacity: grow > 0 ? 1 : 0 };
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const edge = useAnimatedProps(() => {
      const s = state(look.value, H), grow = n ? s.w2 : s.w1, time = clock.value * (n ? 1.1 : 1);
      const base = s.sy - H * w.lift + (1 - grow) * H * w.rise, amp = H * w.amp * grow;
      return { d: line(W, x => waveY(x, W, base, amp, w.ph, time, w.k)), stroke: rim(look.value, w.at, w.rim, w.alpha * s.light * (1 - s.dWave * 0.85)), opacity: grow > 0 ? 1 : 0 };
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const foam = useAnimatedProps(() => {
      const s = state(look.value, H), grow = n ? s.w2 : s.w1, time = clock.value * (n ? 1.1 : 1);
      const base = s.sy - H * w.lift + (1 - grow) * H * w.rise, amp = H * w.amp * grow;
      let d = '';
      for (let j = 1; j <= 3; j++) d += line(W, x => waveY(x, W, base, amp, w.ph, time, w.k) + j * 5, 10);
      return { d, strokeDashoffset: -time * 12, opacity: grow > 0 ? 0.22 * s.light * (1 - s.dWave) : 0 };
    });
    return { body, edge, foam };
  };
  const one = wave(0), two = wave(1);

  const bank = (n: 0 | 1 | 2) => {
    const [by, ba, ph, k, sh] = BANKS[n];
    const edgeY = (x: number, bottom: number, amp: number, time: number) => {
      'worklet';
      const u = x / W;
      return bottom + amp * (0.55 * Math.abs(Math.sin(u * Math.PI * 2 * k + ph + time * 0.04)) + 0.3 * Math.abs(Math.sin(u * Math.PI * 2 * k * 2.2 + ph * 1.6 - time * 0.03)));
    };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const body = useAnimatedProps(() => {
      const s = state(look.value, H), bottom = lerp(-H * 0.25, H * by, s.cl), amp = H * ba, time = clock.value;
      return { d: `M0 -2` + line(W, x => edgeY(x, bottom, amp, time), 6).replace(/^M/, 'L') + `L${W} -2Z`, opacity: s.cl > 0 ? 0.6 + 0.4 * (sh - 0.85) / 0.3 : 0 };
    });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const edge = useAnimatedProps(() => {
      const s = state(look.value, H), bottom = lerp(-H * 0.25, H * by, s.cl), amp = H * ba, time = clock.value;
      return { d: line(W, x => edgeY(x, bottom, amp, time), 6), stroke: rim(look.value, 4, [215, 230, 234], 0.6 * sh * s.light * (1 - s.dCloud * 0.8)), opacity: s.cl > 0 ? 1 : 0 };
    });
    // The underside lit by the last light: a wide soft stroke along the edge.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const under = useAnimatedProps(() => {
      const s = state(look.value, H), bottom = lerp(-H * 0.25, H * by, s.cl), amp = H * ba, time = clock.value;
      return { d: line(W, x => edgeY(x, bottom, amp, time) + 6, 6), opacity: s.cl > 0 ? 0.16 * sh * s.light * (1 - s.dCloud) : 0 };
    });
    return { body, edge, under };
  };
  const banks = [bank(0), bank(1), bank(2)];

  // How dark it has grown: the colours fade as each layer comes, then the darknesses fall one over another.
  const dim = useAnimatedProps(() => ({ opacity: 1 - state(look.value, H).light }));
  const darkSea = useAnimatedProps(() => ({ opacity: 0.88 * state(look.value, H).dSea }));
  const darkWaves = useAnimatedProps(() => ({ opacity: 0.85 * state(look.value, H).dWave }));
  const darkClouds = useAnimatedProps(() => ({ opacity: 0.86 * state(look.value, H).dCloud }));
  const night = useAnimatedProps(() => { const s = state(look.value, H); return { opacity: Math.min(1, 0.93 * s.dNight + 0.06 * s.deeper + 0.01 * s.black) }; });
  const blacker = useAnimatedProps(() => { const s = state(look.value, H); return { opacity: 0.75 * s.deeper + 0.25 * s.black }; });

  // The darknesses' bands stand where the layers are once all have come (the waterline then at 0.62).
  const sy = H * 0.62;
  return (
    <Svg style={StyleSheet.absoluteFill} width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SEA_ART.sky[0]} /><Stop offset="0.45" stopColor={SEA_ART.sky[1]} /><Stop offset="0.62" stopColor={SEA_ART.sky[2]} />
        </LinearGradient>
        <RadialGradient id="glow" cx="0.62" cy="0.5" r="0.7"><Stop offset="0" stopColor={SEA_ART.glow} stopOpacity={1} /><Stop offset="1" stopColor={SEA_ART.glow} stopOpacity={0} /></RadialGradient>
        <LinearGradient id="deep" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SEA_ART.deep[0]} /><Stop offset="0.35" stopColor={SEA_ART.deep[1]} /><Stop offset="1" stopColor={SEA_ART.deep[2]} />
        </LinearGradient>
        <LinearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><Stop offset="0" stopColor={SEA_ART.ray} stopOpacity={0.2} /><Stop offset="1" stopColor={SEA_ART.ray} stopOpacity={0} /></LinearGradient>
        <LinearGradient id="wave" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SEA_ART.wave[0]} /><Stop offset="0.12" stopColor={SEA_ART.wave[1]} /><Stop offset="0.45" stopColor={SEA_ART.wave[2]} /><Stop offset="1" stopColor={SEA_ART.wave[3]} />
        </LinearGradient>
        <LinearGradient id="cloud" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SEA_ART.cloud[0]} /><Stop offset="0.7" stopColor={SEA_ART.cloud[1]} /><Stop offset="1" stopColor={SEA_ART.cloud[2]} />
        </LinearGradient>
        <LinearGradient id="band" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={SEA_ART.black} stopOpacity={0} /><Stop offset="0.15" stopColor={SEA_ART.black} stopOpacity={1} /><Stop offset="0.85" stopColor={SEA_ART.black} stopOpacity={1} /><Stop offset="1" stopColor={SEA_ART.black} stopOpacity={0} />
        </LinearGradient>
        <RadialGradient id="vignette" cx="0.5" cy="0.5" r="0.75"><Stop offset="0.55" stopColor={SEA_ART.black} stopOpacity={0} /><Stop offset="1" stopColor={SEA_ART.black} stopOpacity={0.55} /></RadialGradient>
      </Defs>
      <Rect width={W} height={H} fill="url(#sky)" />
      <ARect animatedProps={glow} width={W} height={H} fill="url(#glow)" />
      <ARect animatedProps={water} x={0} width={W} fill="url(#deep)" />
      <APath animatedProps={rays} fill="url(#ray)" />
      <APath animatedProps={specks} fill={SEA_ART.speck} />
      <APath animatedProps={crests} fill="none" stroke={SEA_ART.crest} strokeWidth={1.2} />
      <APath animatedProps={glints} fill="none" stroke={SEA_ART.glint} strokeWidth={1.6} strokeDasharray="10 70" />
      {[one, two].map((w, i) => (
        <G key={`wave${i}`}>
          <APath animatedProps={w.body} fill="url(#wave)" />
          <APath animatedProps={w.edge} fill="none" strokeWidth={i ? 2.2 : 1.8} />
          <APath animatedProps={w.foam} fill="none" stroke={SEA_ART.foam} strokeWidth={1} strokeDasharray="14 22" />
        </G>
      ))}
      {banks.map((b, i) => (
        <G key={`bank${i}`}>
          <APath animatedProps={b.body} fill="url(#cloud)" />
          <APath animatedProps={b.under} fill="none" stroke={SEA_ART.underlight} strokeWidth={16} />
          <APath animatedProps={b.edge} fill="none" strokeWidth={1.5} />
        </G>
      ))}
      <ARect animatedProps={dim} width={W} height={H} fill={SEA_ART.black} />
      <AG animatedProps={darkSea}><Rect y={sy + H * 0.08} width={W} height={H - sy} fill="url(#band)" /></AG>
      <AG animatedProps={darkWaves}><Rect y={sy - H * 0.25} width={W} height={H * 0.46} fill="url(#band)" /></AG>
      <AG animatedProps={darkClouds}><Rect y={-H * 0.05} width={W} height={sy - H * 0.06} fill="url(#band)" /></AG>
      <ARect animatedProps={night} width={W} height={H} fill={SEA_ART.black} />
      <ARect animatedProps={blacker} width={W} height={H} fill={SEA_ART.black} />
      <Rect width={W} height={H} fill="url(#vignette)" />
    </Svg>
  );
}
