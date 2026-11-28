import { useRef, type ComponentRef, type ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

export default function RowScroll({ children, gap = 8, bleed = 16, contentStyle }: { children: ReactNode;
 gap?: number;
 bleed?: number;
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
