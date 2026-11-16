import { Pressable } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Text } from './Text';
import type { Palette } from '@/lib/theme';

/** A long-press button: the icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is). */
export default function ActButton({ Icon, label, name, onPress, palette, on = false, color }: { Icon: (props: LucideProps) => React.ReactNode; label: string; name: string; onPress: () => void; palette: Palette; on?: boolean; color?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }}
      style={{ width: ACT_WIDTH, alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 5, borderRadius: 10, backgroundColor: on ? palette.accent : 'transparent' }}>
      <Icon size={22} color={on ? palette.onAccent : color ?? palette.ink} />
      <Text numberOfLines={1} style={{ fontSize: 11, color: on ? palette.onAccent : palette.muted }}>{name}</Text>
    </Pressable>
  );
}
export const ACT_WIDTH = 56;
