import { View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { TextInput } from '@/ui/Text';
import { Search, X } from 'lucide-react-native';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';

const HEIGHT = 44;
const frame = (palette: Palette): ViewStyle => ({ borderWidth: 1, borderColor: palette.rule, borderRadius: 12, backgroundColor: palette.card });

type Props = Omit<TextInputProps, 'style' | 'placeholderTextColor' | 'accessibilityLabel'> & {
  palette: Palette;
  /** What a screen reader says: the field's question, also when it has a placeholder. */
  label: string;
  /** A number to type in, large and spaced, left to right (a party's code). */
  code?: boolean;
  /** Its place only (flex, margins), never its look. */
  style?: StyleProp<ViewStyle>;
};

/**
 * The one text field (owner: inputs 16px): framed like a card, one height, right-aligned; `multiline` grows from five lines
 * for the reader's own words (a note). Search goes in `SearchField`. The recite writing boxes are the quiz's own.
 */
export default function Field({ palette, label, code = false, multiline, style, ...input }: Props) {
  return (
    <TextInput {...input} multiline={multiline} accessibilityLabel={label} placeholderTextColor={palette.muted}
      style={[frame(palette), { color: palette.ink, fontSize: 16, paddingHorizontal: 12 },
        multiline ? { minHeight: 140, paddingVertical: 10, lineHeight: 28, textAlign: 'right', textAlignVertical: 'top' }
        : code ? { height: 56, fontSize: input.value ? 26 : 16, letterSpacing: input.value ? 6 : 0, textAlign: 'center', writingDirection: 'ltr' }
        : { height: HEIGHT, textAlign: 'right', writingDirection: 'rtl' }, style]} />
  );
}

/** The one search field: the field with a magnifier at its start and, once something is typed, a clear button at its end. */
export function SearchField({ palette, label, value, onChangeText, style, ...input }: Omit<Props, 'code' | 'multiline' | 'value' | 'onChangeText'> & {
  value: string; onChangeText: (text: string) => void;
}) {
  return (
    <View style={[frame(palette), { flexDirection: 'row', alignItems: 'center', height: HEIGHT, paddingStart: 12, paddingEnd: value ? 4 : 12 }, style]}>
      <Search size={18} color={palette.muted} />
      <TextInput returnKeyType="search" {...input} value={value} onChangeText={onChangeText} accessibilityLabel={label} placeholderTextColor={palette.muted}
        style={{ flex: 1, width: 0, height: '100%', paddingHorizontal: 8, color: palette.ink, fontSize: 16, textAlign: 'right', writingDirection: 'rtl' }} />
      {value !== '' && <IconButton Icon={X} label="مسح" onPress={() => onChangeText('')} size="small" />}
    </View>
  );
}

/**
 * The search field as a button: the field's frame and magnifier, with nothing typed in it, that opens the search page (home's
 * top bar, owner 2026-11-18: a field says "search" better than an icon). `label` is what a screen reader says.
 */
export function SearchOpener({ palette, label, onPress, style }: { palette: Palette; label: string; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Tap onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={4}
      style={({ pressed }) => [frame(palette), { flexDirection: 'row', alignItems: 'center', height: 40, paddingHorizontal: 12, opacity: pressed ? 0.7 : 1 }, style]}>
      <Search size={18} color={palette.muted} />
    </Tap>
  );
}
