
import { useRef, type ComponentRef } from 'react';
import type { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';
import QuranWords from '@/components/quran/text/QuranWords';
import { Tap } from '@/ui/Tap';

export type ButtonBox = { x: number; y: number; width: number; height: number };

export default function ActButton({ Icon, label, name, onPress, onPressAt, expanded, quran = false, palette, on = false, color, tint, filled = false, wide = false }: { Icon: (props: LucideProps) => React.ReactNode; label: string; name: string; palette: Palette; on?: boolean; color?: string;
  onPress?: () => void;
  onPressAt?: (box: ButtonBox) => void;
  expanded?: boolean;
  quran?: boolean;
  wide?: boolean;
  tint?: string;
  filled?: boolean }) {
  const onColor = tint ?? palette.accent;
  const box = useRef<ComponentRef<typeof View>>(null);
  return (
    <Tap ref={box} onPress={() => (onPressAt ? box.current?.measureInWindow((x, y, width, height) => onPressAt({ x, y, width, height })) : onPress?.())} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on, ...(expanded !== undefined ? { expanded } : {}) }}
      style={{ ...(wide ? { minWidth: ACT_WIDTH, paddingHorizontal: 8 } : { width: ACT_WIDTH }), alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 5, borderRadius: 10 }}>
      <Icon size={22} color={on ? onColor : color ?? palette.ink} fill={on && filled ? onColor : 'none'} strokeWidth={on ? 2.25 : 2} />
      {quran
        ? <QuranWords style={{ fontSize: 15, color: on ? onColor : palette.muted }}>{name}</QuranWords>
        : <Text numberOfLines={1} style={{ fontSize: 11, color: on ? onColor : palette.muted }}>{name}</Text>}
    </Tap>
  );
}
export const ACT_WIDTH = 56;
