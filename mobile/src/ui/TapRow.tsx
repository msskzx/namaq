import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Tap } from '@/ui/Tap';

/**
 * A row of a drawing that opens what it names on a tap and shows its source on a long press, with no frame of its own:
 * a row on the «حياته» timeline (components/LifeTimeline.tsx). At least 44 tall; `role` is `link` when it opens a page.
 */
export default function TapRow({ onPress, onLongPress, role = 'button', label, style, children }: {
  onPress: () => void; onLongPress?: () => void; role?: 'button' | 'link'; label?: string; style?: StyleProp<ViewStyle>; children: ReactNode;
}) {
  return (
    <Tap onPress={onPress} onLongPress={onLongPress} accessibilityRole={role} accessibilityLabel={label}
      style={[{ flexDirection: 'row', alignItems: 'stretch', minHeight: 44 }, style]}>
      {children}
    </Tap>
  );
}
