import { Pressable, Text, View } from 'react-native';
import type { Palette } from '@/lib/theme';

/** The website's switch: on means the knob sits on the right. */
export default function Toggle({ on, onChange, label, palette, disabled = false }: { on: boolean; onChange: (on: boolean) => void; label: string; palette: Palette; disabled?: boolean }) {
  return (
    <Pressable onPress={() => !disabled && onChange(!on)} accessibilityRole="switch" accessibilityState={{ checked: on, disabled }} accessibilityLabel={label}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, opacity: disabled ? 0.5 : 1, paddingVertical: 6 }}>
      <View style={{ width: 46, height: 28, borderRadius: 14, padding: 3, backgroundColor: on ? palette.accent : palette.rule, direction: 'ltr', alignItems: on ? 'flex-end' : 'flex-start' }}>
        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: palette.paper }} />
      </View>
      <Text style={{ color: palette.ink, fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}
