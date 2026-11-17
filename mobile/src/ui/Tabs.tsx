import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';

export type TabOption<K extends string> = { key: K; label: string; Icon?: (props: LucideProps) => React.ReactNode };

/**
 * The one row of tabs, the website's `Segmented`: a framed row, the open tab filled in the accent, the others muted.
 * For a few views of one thing (read or recite, two books, a book's contents or search). A list of words or filters
 * that wraps is chips, not tabs. `fill` stretches the tabs across the row; `iconOnly` shows icons with the name for a screen reader.
 */
export default function Tabs<K extends string>({ options, value, onChange, label, palette, fill = false, iconOnly = false }: {
  options: readonly TabOption<K>[]; value: K; onChange: (key: K) => void; label?: string; palette: Palette; fill?: boolean; iconOnly?: boolean;
}) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel={label}
      style={{ flexDirection: 'row', alignSelf: fill ? 'stretch' : 'flex-start', padding: 3, gap: 2, borderRadius: 12, borderWidth: 1, borderColor: palette.rule }}>
      {options.map(({ key, label: name, Icon }) => {
        const on = key === value;
        const color = on ? palette.onAccent : palette.muted;
        return (
          <Tap key={key} onPress={() => onChange(key)} accessibilityRole="tab" accessibilityState={{ selected: on }} aria-selected={on} accessibilityLabel={name}
            style={({ pressed }) => ({ flex: fill ? 1 : undefined, minHeight: 36, paddingVertical: 6, minWidth: iconOnly ? 52 : undefined, paddingHorizontal: iconOnly ? 0 : 14, flexDirection: 'row', gap: 6,
              alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: on ? palette.accent : 'transparent', opacity: pressed && !on ? 0.6 : 1 })}>
            {Icon && <Icon size={iconOnly ? 20 : 16} color={color} />}
            {!iconOnly && <Text style={{ fontSize: 15, color }}>{name}</Text>}
          </Tap>
        );
      })}
    </View>
  );
}
