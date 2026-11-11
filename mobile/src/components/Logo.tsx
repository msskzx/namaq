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
