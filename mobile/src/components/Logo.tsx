import { useEffect, useState } from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { BERRIES, BOWL, BRANCHES } from '@/lib/logo';
import { usePalette } from '@/lib/theme';

// The website's emblem (src/components/common/Emblem.tsx): the tree grown from a dotless ن, its berries in the accent colour.
export default function Logo({ size = 32 }: { size?: number }) {
  const palette = usePalette();
  return (
    <Svg width={size} height={size} viewBox="12 24.7 76 76">
      <Path d={BOWL} fill={palette.ink} />
      <G transform="translate(-3.06 13.49) scale(0.085)">
        {BRANCHES.map(d => <Path key={d.slice(0, 12)} d={d} fill={palette.ink} />)}
        {BERRIES.map(([cx, cy]) => <Circle key={`${cx}:${cy}`} cx={cx} cy={cy} r={30} fill={palette.accent} />)}
      </G>
    </Svg>
  );
}

/**
 * The logo drawn in: the bowl, then each branch, then the berries, one after another (the opening of the first-launch tour).
 * Kept simple: each part fades in on a timer, no stroke drawing.
 */
export function GrowingLogo({ size = 130, step = 140 }: { size?: number; step?: number }) {
  const palette = usePalette();
  const parts = 1 + BRANCHES.length + 1;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= parts) return;
    const timer = setTimeout(() => setShown(count => count + 1), shown === 0 ? 300 : step);
    return () => clearTimeout(timer);
  }, [shown, parts, step]);
  const on = (part: number) => (shown > part ? 1 : 0);
  return (
    <Svg width={size} height={size} viewBox="12 24.7 76 76">
      <Path d={BOWL} fill={palette.ink} opacity={on(0)} />
      <G transform="translate(-3.06 13.49) scale(0.085)">
        {BRANCHES.map((d, i) => <Path key={d.slice(0, 12)} d={d} fill={palette.ink} opacity={on(1 + i)} />)}
        {BERRIES.map(([cx, cy]) => <Circle key={`${cx}:${cy}`} cx={cx} cy={cy} r={30} fill={palette.accent} opacity={on(1 + BRANCHES.length)} />)}
      </G>
    </Svg>
  );
}
