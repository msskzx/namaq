import { View } from 'react-native';

/**
 * A block with a bar down its right edge, in `tone` (a saying's bar in ui/QuoteBar; a battle's passage in the atlas's
 * sheet, owner 2026-11-23). `width` thickens it.
 */
export default function EdgeBar({ tone, width = 3, gap = 2, children }: { tone: string; width?: number; gap?: number; children: React.ReactNode }) {
  return <View style={{ borderRightWidth: width, borderColor: tone, paddingRight: 12, gap }}>{children}</View>;
}
