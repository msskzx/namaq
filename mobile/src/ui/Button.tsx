import { View } from 'react-native';
import { Text } from '@/ui/Text';
import type { LucideProps } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

type Props = {
  label?: string;
  Icon?: (props: LucideProps) => React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'plain';
  active?: boolean;
  disabled?: boolean;
  /** Read out by screen readers; needed when the button shows only an icon. */
  accessibilityLabel?: string;
  big?: boolean;
  /** Grows to share the row's width with its neighbours, with a little less side padding so three fit on a phone. */
  grow?: boolean;
  /** Round ends: the one labelled button in a feed card's row of icons («تلميح», owner 2026-11-20). */
  pill?: boolean;
  /** Green words and icon («تذكّرتها»); `active` then rings it in green instead of filling it. */
  tone?: 'green';
};

/** The app's button: a filled terracotta primary, an outlined one, or a plain icon button. */
export default function Button({ label, Icon, onPress, variant = 'outline', active, disabled, accessibilityLabel, big, grow, pill = false, tone }: Props) {
  const palette = usePalette();
  // A disabled button is never filled: faded text on the accent was hard to read.
  const green = tone === 'green';
  const filled = !disabled && (variant === 'primary' || (active && !green));
  const color = filled ? palette.onAccent : disabled ? palette.muted : green ? palette.green : palette.ink;
  return (
    <Tap onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled, selected: active }} hitSlop={6}
      style={({ pressed }) => ({
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        minHeight: big ? 50 : 42, minWidth: label ? undefined : 42, paddingHorizontal: label ? (big ? 20 : grow ? 10 : 14) : 8, borderRadius: pill ? (big ? 25 : 21) : 10, flexGrow: grow ? 1 : 0,
        backgroundColor: filled ? palette.accent : 'transparent',
        borderWidth: variant === 'plain' ? 0 : 1, borderColor: filled ? palette.accent : green && active ? palette.green : palette.rule,
        opacity: disabled ? 0.6 : pressed ? 0.7 : 1,
      })}>
      {label ? <Text style={{ color, fontSize: big ? 18 : 16, fontWeight: variant === 'primary' ? '600' : '400' }}>{label}</Text> : null}
      {/* The word first, then its icon, on every button (owner, 2026-11-22). */}
      {Icon && <Icon size={big ? 22 : 20} color={color} />}
    </Tap>
  );
}

/** A row of buttons that wraps on a narrow phone. */
export function Row({ children, gap = 8 }: { children: React.ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap }}>{children}</View>;
}
