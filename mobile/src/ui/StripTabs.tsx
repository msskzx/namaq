import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import { MIN_TAP } from '@/ui/tapSize';
import type { Palette } from '@/lib/theme';
import { useOnChange } from '@/lib/hooks/useOnChange';

export default function StripTabs({ labels, names, at, onPick, progress = false, palette }: {
  labels: string[];
  names?: string[];
  at: number; onPick: (index: number) => void; progress?: boolean; palette: Palette;
}) {
  const row = useRef<ComponentRef<typeof ScrollView>>(null);
  const centres = useRef<number[]>([]);
  const [width, setWidth] = useState(0);
  const show = (i: number, animated = true) => {
    const x = centres.current[i];
    if (x !== undefined && width) row.current?.scrollTo({ x: Math.max(0, x - width / 2), animated });
  };
  useOnChange([at, width], () => show(at));
  return (
    <View accessibilityRole="tablist" style={{ direction: 'ltr', borderBottomWidth: 1, borderColor: palette.rule }} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
      <ScrollView ref={row} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row-reverse', flexGrow: 1, paddingHorizontal: 8 }}>
        {labels.map((label, i) => (
          <Tap key={`${i}:${label}`} onPress={() => onPick(i)} accessibilityRole="tab" accessibilityState={{ selected: i === at }} accessibilityLabel={names?.[i] ?? label}
            onLayout={event => {
              centres.current[i] = event.nativeEvent.layout.x + event.nativeEvent.layout.width / 2;
              if (i === at) show(i, false);
            }}
            style={{ minWidth: MIN_TAP, minHeight: MIN_TAP, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center',
              borderBottomWidth: 2, borderColor: i === at ? palette.accent : 'transparent' }}>
            <Text style={{ color: i === at ? palette.accent : palette.muted, fontSize: 16 }}>{label}</Text>
          </Tap>
        ))}
      </ScrollView>
      {progress && <View style={{ height: 3, backgroundColor: `${palette.rule}80` }}>
        <View style={{ height: 3, width: `${((at + 1) / labels.length) * 100}%`, backgroundColor: palette.accent, alignSelf: 'flex-end' }} />
      </View>}
    </View>
  );
}
