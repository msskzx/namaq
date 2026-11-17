import Svg, { Path } from 'react-native-svg';
import type { LucideProps } from 'lucide-react-native';

/**
 * The «فاصلة»: a narrow ribbon, the page where the reader stopped (docs/plans/book-reader.md). Drawn like a lucide icon so
 * it sits among them; narrower than the bookmark, and it marks one page only. No line across it (owner, 2026-11-17).
 * Filled, it says this page is the فاصلة.
 */
export default function FasilaIcon({ size = 24, color = 'currentColor', strokeWidth = 2, filled = false }: LucideProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 3h6v18l-3-3.2L9 21z" />
    </Svg>
  );
}

/** A small ribbon in a page's margin: a saved paragraph's mark. */
export function FasilaRibbon({ color, height = 24, width = 9 }: { color: string; height?: number; width?: number }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={`M0 0H${width}V${height}L${width / 2} ${height - width * 0.6}L0 ${height}Z`} fill={color} />
    </Svg>
  );
}
