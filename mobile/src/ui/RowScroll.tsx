import { useRef, type ComponentRef, type ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

/**
 * A sideways row that starts on the RIGHT, its first item first (owner, 2026-11-20: home opened on the chips' last pill).
 * Laid out reversed in a left-to-right box, as the shelves are, so the order is right to left on every platform; a scroll
 * view starts at its left edge, so it moves to its end (the right) until the reader scrolls it.
 */
export default function RowScroll({ children, gap = 8, bleed = 16, contentStyle }: { children: ReactNode;
  /** Space between the items. */ gap?: number;
  /** How far the row reaches past its parent's padding on each side, so it runs to the screen's edges. */ bleed?: number;
  contentStyle?: StyleProp<ViewStyle> }) {
  const row = useRef<ComponentRef<typeof ScrollView>>(null);
  const moved = useRef(false);
  return (
    <View style={{ direction: 'ltr', marginHorizontal: -bleed }}>
      <ScrollView ref={row} horizontal showsHorizontalScrollIndicator={false} onScrollBeginDrag={() => { moved.current = true; }}
        onContentSizeChange={() => { if (!moved.current) row.current?.scrollToEnd({ animated: false }); }}
        contentContainerStyle={[{ flexDirection: 'row-reverse', flexGrow: 1, justifyContent: 'flex-start', gap, paddingHorizontal: bleed }, contentStyle]}>
        {children}
      </ScrollView>
    </View>
  );
}
