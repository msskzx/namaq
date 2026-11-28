import { BlurMask, Canvas, DashPathEffect, Group, LinearGradient, Path, RadialGradient, Rect, Skia, vec, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import { useDerivedValue, useFrameCallback, useReducedMotion, useSharedValue, type SharedValue } from 'react-native-reanimated';
import { SEA_ART } from '@/lib/theme';


const clamp = (v: number) => { 'worklet'; return Math.max(0, Math.min(1, v)); };
const ease = (x: number) => { 'worklet'; return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const lerp = (a: number, b: number, u: number) => { 'worklet'; return a + (b - a) * u; };

function state(t: number, H: number) {
  'worklet';
  const sea = ease(clamp(t)), w1 = ease(clamp(t - 1)), w2 = ease(clamp(t - 2)), cl = ease(clamp(t - 3)), dk = clamp(t - 4);
  return {
    sea, w1, w2, cl,
    dSea: ease(clamp(dk * 4)), dWave: ease(clamp(dk * 4 - 1)), dCloud: ease(clamp(dk * 4 - 2)), dNight: ease(clamp(dk * 4 - 3)),
    deeper: ease(clamp(t - 5)), black: ease(clamp(t - 6)),
    light: 1 - 0.1 * w1 - 0.1 * w2 - 0.22 * cl,
    sy: H * (lerp(0.62, 0.5, sea) + 0.12 * cl),
  };
}
function rim(t: number, at: number, alpha: number) {
  'worklet';
  const f = clamp(1 - Math.abs(t - at) * 1.4), a = alpha * (t > at + 0.5 ? 0.55 : 1);
  return { own: a * (1 - f), gold: a * f };
}
function addLine(path: SkPathBuilder, W: number, y: (x: number) => number, step: number, joined = false) {
  'worklet';
  for (let x = 0; x <= W + step; x += step) {
    if (x === 0 && !joined) path.moveTo(x, y(x));
    else path.lineTo(x, y(x));
  }
}
function waveY(x: number, W: number, base: number, amp: number, ph: number, time: number, k: number) {
  'worklet';
  const u = x / W;
  return base - amp * (0.62 + 0.24 * Math.sin(u * Math.PI * 2 * k + ph + time * 0.35) + 0.14 * Math.sin(u * Math.PI * 2 * k * 2.3 + ph * 1.7 - time * 0.5));
}
function bankY(x: number, W: number, bottom: number, amp: number, ph: number, k: number, time: number) {
  'worklet';
  const u = x / W;
  return bottom + amp * (0.55 * Math.abs(Math.sin(u * Math.PI * 2 * k + ph + time * 0.04)) + 0.3 * Math.abs(Math.sin(u * Math.PI * 2 * k * 2.2 + ph * 1.6 - time * 0.03)));
}

const WAVES = [{ at: 2, lift: 0, amp: 0.1, ph: 0, k: 1.15, rise: 0.55, alpha: 0.75 },
  { at: 3, lift: 0.05, amp: 0.13, ph: 2.2, k: 0.85, rise: 0.6, alpha: 0.8 }];
const BANKS = [[0.2, 0.05, 0.6, 0.7, 0.85], [0.26, 0.045, 2.1, 1.0, 1], [0.32, 0.04, 4.0, 1.35, 1.15]] as const;
const SPECKS = Array.from({ length: 48 }, (_, i) => ({ x: ((i * 0.618) % 1), y: ((i * 0.377) % 1), r: 0.5 + ((i * 7) % 10) / 10, s: 0.2 + ((i * 3) % 7) / 10 }));

export default function SeaSkia({ look, width: W, height: H, still = false }: { look: SharedValue<number>; width: number; height: number;
  still?: boolean }) {
  const reduced = useReducedMotion();
  const clock = useSharedValue(0);
  useFrameCallback(frame => { clock.value = (frame.timeSinceFirstFrame ?? 0) / 1000; }, !still && !reduced);
  const s = useDerivedValue(() => state(look.value, H));

  const waterY = useDerivedValue(() => s.value.sy);
  const waterH = useDerivedValue(() => H - s.value.sy);
  const waterTop = useDerivedValue(() => vec(0, s.value.sy));
  const glow = useDerivedValue(() => 0.45 * s.value.light * (1 - s.value.cl * 0.85));

  const crests = useDerivedValue(() => {
    const p = Skia.PathBuilder.Make(), { sy, sea } = s.value, time = clock.value, calm = 1 - sea * 0.75;
    for (let i = 0; i < 7; i++) {
      const f = i / 6, y = sy + H * (0.006 + 0.3 * f * f) * calm + 2, amp = 1 + f * 6, wl = 0.012 - f * 0.007;
      addLine(p, W, x => y + Math.sin(x * wl + time * (0.4 + f * 0.3) + i * 1.7) * amp, 10);
    }
    return p.build();
  });
  const crestsOpacity = useDerivedValue(() => s.value.light * (1 - s.value.sea * 0.75));
  const glintsOpacity = useDerivedValue(() => s.value.light * (1 - s.value.sea * 0.75) * (1 - s.value.dWave));
  const glintPhase = useDerivedValue(() => clock.value * 30);

  const rays = useDerivedValue(() => {
    const p = Skia.PathBuilder.Make(), { sy } = s.value, time = clock.value;
    for (let i = 0; i < 6; i++) {
      const x0 = W * (0.08 + i * 0.17) + Math.sin(time * 0.25 + i * 2) * W * 0.03, top = W * 0.05, len = (H - sy) * (0.55 + 0.1 * Math.sin(i * 3));
      p.moveTo(x0, sy); p.lineTo(x0 + top, sy); p.lineTo(x0 + top * 2.6 + len * 0.18, sy + len); p.lineTo(x0 + len * 0.18, sy + len); p.close();
    }
    return p.build();
  });
  const raysOpacity = useDerivedValue(() => s.value.sea * s.value.light * (1 - s.value.dSea));
  const specks = useDerivedValue(() => {
    const p = Skia.PathBuilder.Make(), { sy } = s.value, time = clock.value, depth = Math.max(1, H - sy);
    for (const k of SPECKS) {
      const y = sy + ((((k.y * depth - time * k.s * 6) % depth) + depth) % depth), x = k.x * W + Math.sin(time * 0.3 + k.y * 9) * 3;
      p.addCircle(x, y, k.r);
    }
    return p.build();
  });
  const specksOpacity = useDerivedValue(() => 0.3 * s.value.sea * s.value.light * (1 - s.value.dSea));

  const wave = (n: 0 | 1) => {
    const w = WAVES[n];
    const shape = (worklet: (base: number, amp: number, time: number) => SkPath) => () => {
      'worklet';
      const v = s.value, grow = n ? v.w2 : v.w1;
      return worklet(v.sy - H * w.lift + (1 - grow) * H * w.rise, H * w.amp * grow, clock.value * (n ? 1.1 : 1));
    };
    /* eslint-disable react-hooks/rules-of-hooks */
    const body = useDerivedValue(shape((base, amp, time) => {
      'worklet';
      const p = Skia.PathBuilder.Make();
      p.moveTo(0, H);
      addLine(p, W, x => waveY(x, W, base, amp, w.ph, time, w.k), 8, true);
      p.lineTo(W, H); p.close();
      return p.build();
    }));
    const edge = useDerivedValue(shape((base, amp, time) => {
      'worklet';
      const p = Skia.PathBuilder.Make();
      addLine(p, W, x => waveY(x, W, base, amp, w.ph, time, w.k), 8);
      return p.build();
    }));
    const foam = useDerivedValue(shape((base, amp, time) => {
      'worklet';
      const p = Skia.PathBuilder.Make();
      for (let j = 1; j <= 3; j++) addLine(p, W, x => waveY(x, W, base, amp, w.ph, time, w.k) + j * 5, 10);
      return p.build();
    }));
    const shown = useDerivedValue(() => ((n ? s.value.w2 : s.value.w1) > 0 ? 1 : 0));
    const own = useDerivedValue(() => rim(look.value, w.at, w.alpha * s.value.light * (1 - s.value.dWave * 0.85)).own);
    const gold = useDerivedValue(() => rim(look.value, w.at, w.alpha * s.value.light * (1 - s.value.dWave * 0.85)).gold);
    const foamOpacity = useDerivedValue(() => 0.22 * s.value.light * (1 - s.value.dWave));
    const foamPhase = useDerivedValue(() => clock.value * 12);
    /* eslint-enable react-hooks/rules-of-hooks */
    return { body, edge, foam, shown, own, gold, foamOpacity, foamPhase };
  };
  const waves = [wave(0), wave(1)];

  const bank = (n: 0 | 1 | 2) => {
    const [by, ba, ph, k, sh] = BANKS[n];
    const shape = (under: number, closed: boolean) => () => {
      'worklet';
      const v = s.value, bottom = lerp(-H * 0.25, H * by, v.cl), amp = H * ba, time = clock.value, p = Skia.PathBuilder.Make();
      if (closed) p.moveTo(0, -2);
      addLine(p, W, x => bankY(x, W, bottom, amp, ph, k, time) + under, 6, closed);
      if (closed) { p.lineTo(W, -2); p.close(); }
      return p.build();
    };
    /* eslint-disable react-hooks/rules-of-hooks */
    const body = useDerivedValue(shape(0, true));
    const edge = useDerivedValue(shape(0, false));
    const underside = useDerivedValue(shape(6, false));
    const shown = useDerivedValue(() => (s.value.cl > 0 ? 0.6 + 0.4 * (sh - 0.85) / 0.3 : 0));
    const own = useDerivedValue(() => rim(look.value, 4, 0.6 * sh * s.value.light * (1 - s.value.dCloud * 0.8)).own);
    const gold = useDerivedValue(() => rim(look.value, 4, 0.6 * sh * s.value.light * (1 - s.value.dCloud * 0.8)).gold);
    const under = useDerivedValue(() => (s.value.cl > 0 ? 0.22 * sh * s.value.light * (1 - s.value.dCloud) : 0));
    /* eslint-enable react-hooks/rules-of-hooks */
    return { body, edge, underside, shown, own, gold, under };
  };
  const banks = [bank(0), bank(1), bank(2)];

  const dim = useDerivedValue(() => 1 - s.value.light);
  const darkSea = useDerivedValue(() => 0.88 * s.value.dSea);
  const darkWaves = useDerivedValue(() => 0.85 * s.value.dWave);
  const darkClouds = useDerivedValue(() => 0.86 * s.value.dCloud);
  const night = useDerivedValue(() => Math.min(1, 0.93 * s.value.dNight + 0.06 * s.value.deeper + 0.01 * s.value.black));
  const blacker = useDerivedValue(() => 0.75 * s.value.deeper + 0.25 * s.value.black);

  const sy = H * 0.62;
  const BAND = [SEA_ART.clear, SEA_ART.black, SEA_ART.black, SEA_ART.clear];
  const band = (opacity: SharedValue<number>, y: number, h: number) => (
    <Rect x={0} y={y} width={W} height={h} opacity={opacity}>
      <LinearGradient start={vec(0, y)} end={vec(0, y + h)} colors={BAND} positions={[0, 0.15, 0.85, 1]} />
    </Rect>
  );
  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Rect x={0} y={0} width={W} height={H}>
        <LinearGradient start={vec(0, 0)} end={vec(0, H)} colors={[SEA_ART.sky[0], SEA_ART.sky[1], SEA_ART.sky[2]]} positions={[0, 0.45, 0.62]} />
      </Rect>
      <Rect x={0} y={0} width={W} height={H} opacity={glow}>
        <RadialGradient c={vec(W * 0.62, H * 0.5)} r={Math.max(W, H) * 0.7} colors={[SEA_ART.glow, SEA_ART.glow + '00']} />
      </Rect>
      <Group>
        <Rect x={0} y={waterY} width={W} height={waterH}>
          <LinearGradient start={waterTop} end={vec(0, H)} colors={[SEA_ART.deep[0], SEA_ART.deep[1], SEA_ART.deep[2]]} positions={[0, 0.35, 1]} />
        </Rect>
      </Group>
      <Path path={rays} opacity={raysOpacity} color={SEA_ART.ray + '33'}><BlurMask blur={6} style="normal" /></Path>
      <Path path={specks} opacity={specksOpacity} color={SEA_ART.speck} />
      <Path path={crests} opacity={crestsOpacity} style="stroke" strokeWidth={1.2} color={SEA_ART.crest} />
      <Path path={crests} opacity={glintsOpacity} style="stroke" strokeWidth={1.6} color={SEA_ART.glint}><DashPathEffect intervals={[10, 70]} phase={glintPhase} /></Path>
      {waves.map((w, i) => (
        <Group key={`wave${i}`} opacity={w.shown}>
          <Path path={w.body}>
            <LinearGradient start={vec(0, H * 0.3)} end={vec(0, H)} colors={[SEA_ART.wave[0], SEA_ART.wave[1], SEA_ART.wave[2], SEA_ART.wave[3]]} positions={[0, 0.12, 0.45, 1]} />
          </Path>
          <Path path={w.foam} opacity={w.foamOpacity} style="stroke" strokeWidth={1} color={SEA_ART.foam}><DashPathEffect intervals={[14, 22]} phase={w.foamPhase} /></Path>
          <Path path={w.edge} opacity={w.own} style="stroke" strokeWidth={i ? 2.2 : 1.8} color={SEA_ART.rim[i]} />
          <Path path={w.edge} opacity={w.gold} style="stroke" strokeWidth={i ? 2.2 : 1.8} color={SEA_ART.gold} />
        </Group>
      ))}
      {banks.map((b, i) => (
        <Group key={`bank${i}`}>
          <Path path={b.body} opacity={b.shown}>
            <LinearGradient start={vec(0, 0)} end={vec(0, H * 0.4)} colors={[SEA_ART.cloud[0], SEA_ART.cloud[1], SEA_ART.cloud[2]]} positions={[0, 0.7, 1]} />
          </Path>
          <Path path={b.underside} opacity={b.under} style="stroke" strokeWidth={14} color={SEA_ART.underlight}><BlurMask blur={8} style="normal" /></Path>
          <Path path={b.edge} opacity={b.own} style="stroke" strokeWidth={1.5} color={SEA_ART.rim[2]} />
          <Path path={b.edge} opacity={b.gold} style="stroke" strokeWidth={1.5} color={SEA_ART.gold} />
        </Group>
      ))}
      <Rect x={0} y={0} width={W} height={H} color={SEA_ART.black} opacity={dim} />
      {band(darkSea, sy + H * 0.08, H - sy)}
      {band(darkWaves, sy - H * 0.25, H * 0.46)}
      {band(darkClouds, -H * 0.05, sy - H * 0.06)}
      <Rect x={0} y={0} width={W} height={H} color={SEA_ART.black} opacity={night} />
      <Rect x={0} y={0} width={W} height={H} color={SEA_ART.black} opacity={blacker} />
      <Rect x={0} y={0} width={W} height={H}>
        <RadialGradient c={vec(W / 2, H / 2)} r={Math.max(W, H) * 0.75} colors={[SEA_ART.clear, SEA_ART.clear, SEA_ART.vignette]} positions={[0, 0.55, 1]} />
      </Rect>
    </Canvas>
  );
}
