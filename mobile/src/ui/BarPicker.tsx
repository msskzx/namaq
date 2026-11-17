
import { ChevronDown, type LucideProps } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';

/**
 * A top bar's dropdown: what is open, with a chevron, opening the page's list (the timeline's prophet, the saved lists, the
 * compare pair, the poem's chapter). No border: in a top bar the chevron says it opens (owner, 2026-11-17).
 */
export default function BarPicker({ text, label, onPress, Icon, count }: {
  text: string;
  /** Read out: what the picker picks and what is open. */
  label: string;
  onPress: () => void;
  /** An icon before the text (the compare pair's arrows). */
  Icon?: (props: LucideProps) => React.ReactNode;
  /** A count after the text, in the accent (the compare pair's cards). */
  count?: string;
}) {
  const palette = usePalette();
  return (
    <Tap onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={6}
      style={({ pressed }) => ({ maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 7, opacity: pressed ? 0.6 : 1 })}>
      {Icon && <Icon size={16} color={palette.ink} />}
      <Text numberOfLines={1} style={{ flexShrink: 1, color: palette.ink, fontSize: 16 }}>{text}</Text>
      {count !== undefined && <Text style={{ color: palette.accent, fontSize: 14 }}>{count}</Text>}
      <ChevronDown size={16} color={palette.ink} />
    </Tap>
  );
}
