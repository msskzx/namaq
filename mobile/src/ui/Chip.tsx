import { View } from 'react-native';
import { Check, X, type LucideProps } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import { QuranWord } from '@/components/quran/text/AyahFlow';

export default function Chip({ label, on, onPress, palette, role = 'button', check = false, lit = false, tint, quran = false, dashed = false, small = false, count, onClear, Icon, accessibilityLabel }: {
  label: string; on: boolean; onPress?: () => void; palette: Palette;
  role?: 'button' | 'radio' | 'tab' | 'text';
  check?: boolean;
  lit?: boolean;
  tint?: string;
  quran?: boolean;
  dashed?: boolean;
  small?: boolean;
  count?: number;
  Icon?: (props: LucideProps) => React.ReactNode;
  onClear?: () => void;
  accessibilityLabel?: string;
}) {
  const accent = tint ?? palette.accent;
  const filled = on && !lit;
  const color = filled ? palette.onAccent : on ? accent : palette.ink;
  if (onClear) return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 32, paddingStart: 12, paddingEnd: 4, flexShrink: 1, borderRadius: 999, borderWidth: 1, borderColor: palette.rule }}>
      <Text numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 14 }}>{label}</Text>
      <IconButton Icon={X} label={`إزالة ${label}`} onPress={onClear} size="small" />
    </View>
  );
  return (
    <Tap onPress={onPress} disabled={!onPress} hitSlop={small ? 6 : undefined} accessibilityRole={role} accessibilityLabel={accessibilityLabel}
      accessibilityState={role === 'radio' ? { checked: on } : role === 'text' ? undefined : { selected: on }} aria-selected={role === 'tab' ? on : undefined} aria-checked={role === 'radio' ? on : undefined}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 5, ...(small ? { height: 32 } : { minHeight: 36 }), paddingHorizontal: quran ? 14 : 12, borderRadius: 999,
        borderWidth: 1, borderStyle: dashed ? 'dashed' : 'solid', borderColor: on || dashed ? accent : palette.rule,
        backgroundColor: filled ? accent : on ? palette.paperDeep : 'transparent', opacity: pressed ? 0.6 : 1 })}>
      {check && on && <Check size={13} color={color} />}
      {Icon && <Icon size={15} color={color} />}
      {quran ? <QuranWord look={{ color }}>{label}</QuranWord> : <Text style={{ flexShrink: 1, fontSize: small ? 14 : 15, color, textAlign: 'center' }}>{label}</Text>}
      {count !== undefined && <Text style={{ color: on ? accent : palette.muted, fontSize: 11 }}>{num(count)}</Text>}
    </Tap>
  );
}
