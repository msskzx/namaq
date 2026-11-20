import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Tap } from '@/ui/Tap';
import { MIN_TAP } from '@/ui/tapSize';

/**
 * A row of a drawing that opens what it names on a tap and shows its source on a long press, with no frame of its own:
 * a row on the «حياته» timeline (components/LifeTimeline.tsx), or with a column `style` a year on the battles timeline
 * (components/battles/BattleTimeline.tsx). At least MIN_TAP tall; `role` is `link` when it opens a page.
 */
export default function TapRow({ onPress, onLongPress, role = 'button', label, style, children }: {
  onPress: () => void; onLongPress?: () => void; role?: 'button' | 'link'; label?: string; style?: StyleProp<ViewStyle>; children: ReactNode;
}) {
  return (
    <Tap onPress={onPress} onLongPress={onLongPress} accessibilityRole={role} accessibilityLabel={label}
      style={[{ flexDirection: 'row', alignItems: 'stretch', minHeight: MIN_TAP }, style]}>
      {children}
    </Tap>
  );
}
