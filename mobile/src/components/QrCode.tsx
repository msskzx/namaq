import { useMemo } from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { encode } from 'uqr';

/** A QR code of a link, drawn in the page's ink on its paper, as the website's party lobby shows it. */
export default function QrCode({ value, size, ink, paper }: { value: string; size: number; ink: string; paper: string }) {
  const { path, count } = useMemo(() => {
    const { data, size: modules } = encode(value, { border: 1 });
    const dark = data.flatMap((row, y) => row.flatMap((on, x) => on ? [`M${x} ${y}h1v1h-1z`] : []));
    return { path: dark.join(''), count: modules };
  }, [value]);
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${count} ${count}`} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Rect width={count} height={count} fill={paper} />
      <Path d={path} fill={ink} />
    </Svg>
  );
}
