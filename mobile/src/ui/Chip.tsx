import { View } from 'react-native';
import { Check, X } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import QuranWords from '@/components/quran/text/QuranWords';

/**
 * The one chip: a round, framed word to pick among others in a row that wraps (filters, a gesture's action, a topic).
 * On, a chip is filled in the accent. `lit` chips (the words of an ayah, a tree's surahs) stay framed when on, in
 * `tint` with a deeper paper, so the Quran's words keep their colour. `quran` sets the label in the mushaf font.
 * With `onClear` it is a filter in use, removed by its ×.
 * A few views of one thing are tabs (ui/Tabs), not chips.
 */
export default function Chip({ label, on, onPress, palette, role = 'button', check = false, lit = false, tint, quran = false, dashed = false, small = false, count, onClear, accessibilityLabel }: {
  label: string; on: boolean; onPress?: () => void; palette: Palette;
  /** `radio` for one of a set (a setting), `tab` for one word of several, `button` for a filter. */
  role?: 'button' | 'radio' | 'tab' | 'text';
  /** A check before the label when on (filters that combine). */
  check?: boolean;
  lit?: boolean;
  tint?: string;
  quran?: boolean;
  /** A dashed frame: the one to look at first, not yet picked (the i'rab's head word). */
  dashed?: boolean;
  /** Smaller, for a row under a card (a tree's surahs). */
  small?: boolean;
  /** A number after the label (how many ayat). */
  count?: number;
  /** Removable: an × that clears this filter (a search's terms); the chip itself does not press. */
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
      accessibilityState={role === 'radio' ? { checked: on } : role === 'text' ? undefined : { selected: on }} aria-selected={role === 'tab' ? on : undefined}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 5, ...(small ? { height: 32 } : { minHeight: 36 }), paddingHorizontal: quran ? 14 : 12, borderRadius: 999,
        borderWidth: 1, borderStyle: dashed ? 'dashed' : 'solid', borderColor: on || dashed ? accent : palette.rule,
        backgroundColor: filled ? accent : on ? palette.paperDeep : 'transparent', opacity: pressed ? 0.6 : 1 })}>
      {check && on && <Check size={13} color={color} />}
      {quran ? <QuranWords style={{ fontSize: 22, lineHeight: 40, color }}>{label}</QuranWords> : <Text style={{ fontSize: small ? 14 : 15, color }}>{label}</Text>}
      {count !== undefined && <Text style={{ color: on ? accent : palette.muted, fontSize: 11 }}>{num(count)}</Text>}
    </Tap>
  );
}
