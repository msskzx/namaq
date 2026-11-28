import Svg, { Path } from 'react-native-svg';
import type { LucideProps } from 'lucide-react-native';

// see docs/plans/book-reader.md
export default function FasilaIcon({ size = 24, color = 'currentColor', strokeWidth = 2, filled = false }: LucideProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 3h6v18l-3-3.2L9 21z" />
    </Svg>
  );
}

export function FasilaRibbon({ color, height = 24, width = 9 }: { color: string; height?: number; width?: number }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Path d={`M0 0H${width}V${height}L${width / 2} ${height - width * 0.6}L0 ${height}Z`} fill={color} />
    </Svg>
  );
}
