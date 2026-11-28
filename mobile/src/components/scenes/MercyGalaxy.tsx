import Svg, { Circle, Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';
import { RAHMAN_ART, RAHMAN_PAPER as paper } from '@/lib/theme';

const ARMS = 4;
const PER_ARM = 110;
const FIELD = 70;
const SPARKS = 5;

function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { x: number; y: number; r: number; o: number; ink: string };

function stars(width: number, height: number): { arms: Star[]; field: Star[]; sparks: { x: number; y: number; s: number }[] } {
  const random = seeded(55);
  const gauss = () => (random() + random() + random() - 1.5) / 1.5;
  const inks = [RAHMAN_ART.title, paper.ink, paper.muted];
  const reach = width * 0.42;
  const arms: Star[] = [];
  for (let arm = 0; arm < ARMS; arm++) {
    for (let k = 0; k < PER_ARM; k++) {
      const t = k / PER_ARM;
      const angle = arm * ((2 * Math.PI) / ARMS) + t * 3.4 * Math.PI * 0.62;
      const radius = 6 + t * reach;
      const spread = 2 + t * 9;
      arms.push({
        x: Math.cos(angle) * radius + gauss() * spread,
        y: (Math.sin(angle) * radius + gauss() * spread) * 0.34,
        r: 0.35 + random() * (1.5 - t),
        o: 0.35 + (1 - t) * 0.55,
        ink: inks[Math.floor(random() * inks.length)],
      });
    }
  }
  const field: Star[] = Array.from({ length: FIELD }, () => ({
    x: (random() - 0.5) * width, y: (random() - 0.5) * height, r: 0.3 + random() * 0.8, o: 0.3 + random() * 0.4, ink: inks[1 + Math.floor(random() * 2)],
  }));
  const sparks = Array.from({ length: SPARKS }, () => ({ x: (random() - 0.5) * width * 0.95, y: (random() - 0.5) * height * 0.85, s: 3 + random() * 3 }));
  return { arms, field, sparks };
}

const spark = (x: number, y: number, s: number) =>
  `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

export default function MercyGalaxy({ width, height }: { width: number; height: number }) {
  const { arms, field, sparks } = stars(width, height);
  const cx = width / 2;
  const cy = height / 2;
  return (
    <Svg width={width} height={height}>
      <Defs>
        <RadialGradient id="core" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={RAHMAN_ART.title} stopOpacity={0.55} />
          <Stop offset="0.45" stopColor={RAHMAN_ART.title} stopOpacity={0.18} />
          <Stop offset="1" stopColor={RAHMAN_ART.title} stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="part" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={paper.accent} stopOpacity={0.6} />
          <Stop offset="1" stopColor={paper.accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      {field.map((star, i) => <Circle key={`f${i}`} cx={cx + star.x} cy={cy + star.y} r={star.r} fill={star.ink} opacity={star.o} />)}
      {sparks.map((one, i) => <Path key={`s${i}`} d={spark(cx + one.x, cy + one.y, one.s)} fill={paper.muted} opacity={0.6} />)}
      <Ellipse cx={cx} cy={cy} rx={width * 0.2} ry={height * 0.22} fill="url(#core)" />
      <G rotation={-12} origin={`${cx}, ${cy}`}>
        {arms.map((star, i) => <Circle key={`a${i}`} cx={cx + star.x} cy={cy + star.y} r={star.r} fill={star.ink} opacity={star.o} />)}
      </G>
      <Circle cx={cx} cy={cy} r={14} fill="url(#part)" />
      <Circle cx={cx} cy={cy} r={4.5} fill={paper.accent} />
    </Svg>
  );
}
