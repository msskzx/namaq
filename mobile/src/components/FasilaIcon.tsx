import Svg, { Path } from 'react-native-svg';
import type { LucideProps } from 'lucide-react-native';

/**
 * The «فاصلة»: a ribbon lying across a line, where the reader stopped (docs/plans/book-reader.md). Drawn like a lucide
 * icon so it sits among them; unlike the bookmark it marks one place only.
 */
export default function FasilaIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }: LucideProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 13h18" />
      <Path d="M10 3h4v17l-2-2.2L10 20z" />
    </Svg>
  );
}

/** The ribbon itself in a page's margin, beside the line where the reader stopped. */
export function FasilaRibbon({ color, height = 24, width = 9 }: { color: string; height?: number; width?: number }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={`M0 0H${width}V${height}L${width / 2} ${height - width * 0.6}L0 ${height}Z`} fill={color} />
    </Svg>
  );
}
