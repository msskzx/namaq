import { Pressable } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';

/**
 * A long-press button: the icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is).
 * On (saved, forgotten, noted), the icon and its name take the mark's colour, filled where the icon has a body, with
 * nothing behind them (owner, 2026-11-17: no coloured square, as the فاصلة in the top bar).
 */
export default function ActButton({ Icon, label, name, onPress, palette, on = false, color, tint, filled = false }: { Icon: (props: LucideProps) => React.ReactNode; label: string; name: string; onPress: () => void; palette: Palette; on?: boolean; color?: string;
  /** The colour when on: the mark's own (purple for saved), the accent otherwise. */
  tint?: string;
  /** Fill the icon when on (the bookmark). */
  filled?: boolean }) {
  const onColor = tint ?? palette.accent;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }}
      style={{ width: ACT_WIDTH, alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 5, borderRadius: 10 }}>
      <Icon size={22} color={on ? onColor : color ?? palette.ink} fill={on && filled ? onColor : 'none'} strokeWidth={on ? 2.25 : 2} />
      <Text numberOfLines={1} style={{ fontSize: 11, color: on ? onColor : palette.muted }}>{name}</Text>
    </Pressable>
  );
}
export const ACT_WIDTH = 56;
