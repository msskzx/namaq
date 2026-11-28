import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Tap } from '@/ui/Tap';
import { MIN_TAP } from '@/ui/tapSize';

export default function TapRow({ onPress, onLongPress, role = 'button', label, expanded, selected, disabled, style, children }: {
  onPress: () => void; onLongPress?: () => void; role?: 'button' | 'link'; label?: string;
  expanded?: boolean;
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
