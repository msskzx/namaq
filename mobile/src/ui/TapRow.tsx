import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Tap } from '@/ui/Tap';
import { MIN_TAP } from '@/ui/tapSize';

/**
 * A row of a drawing that opens what it names on a tap and shows its source on a long press, with no frame of its own:
 * a row on the «حياته» timeline (components/LifeTimeline.tsx), or with a column `style` a year on the battles timeline
 * (components/battles/BattleTimeline.tsx), a story in a chapter of «قصص السيرة». At least MIN_TAP tall; `role` is `link` when it opens a page.
 */
export default function TapRow({ onPress, onLongPress, role = 'button', label, expanded, selected, disabled, style, children }: {
  onPress: () => void; onLongPress?: () => void; role?: 'button' | 'link'; label?: string;
  /** A row that opens or folds what is under it (a chapter's stories, a whole chain): read out as open or not. */
  expanded?: boolean;
  /** One of a set to pick from (a place on the atlas's map in «أين كانت؟»): read out as picked or not. */
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>; children?: ReactNode;
}) {
  return (
    <Tap onPress={onPress} onLongPress={onLongPress} accessibilityRole={role} accessibilityLabel={label} disabled={disabled}
      {...(expanded === undefined && selected === undefined ? {} : { accessibilityState: { expanded, selected } })}
      style={[{ flexDirection: 'row', alignItems: 'stretch', minHeight: MIN_TAP }, style]}>
      {children}
    </Tap>
  );
}
