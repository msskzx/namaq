import { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';
import { Tap } from '@/ui/Tap';

type IconType = (props: LucideProps) => React.ReactNode;

export const ICON_BUTTON = {
  bar: { icon: 22, box: 44 },
  small: { icon: 18, box: 28 },
  round: { icon: 22, box: 44 },
  roundBig: { icon: 26, box: 56 },
} as const;
const HIT = 8;

type Props = {
  Icon: IconType;
  label: string;
  onPress: () => void;
  size?: 'bar' | 'small';
  tone?: 'muted' | 'ink' | 'accent' | 'green';
  on?: boolean;
  fill?: boolean;
  round?: boolean;
  big?: boolean;
  disabled?: boolean;
  render?: (icon: { size: number; color: string; fill: string }) => React.ReactNode;
  dot?: boolean;
  expanded?: boolean;
  role?: 'button' | 'link';
};

export default function IconButton({ Icon, label, onPress, size = 'bar', tone = 'muted', on, fill = false, round = false, big = false, disabled, render, dot, expanded, role = 'button' }: Props) {
  const palette = usePalette();
  const dims = round ? ICON_BUTTON[big ? 'roundBig' : 'round'] : ICON_BUTTON[size];
  const off = tone === 'ink' ? palette.ink : tone === 'accent' ? palette.accent : tone === 'green' ? palette.green : palette.muted;
  const color = round ? palette.onAccent : on ? (tone === 'green' ? palette.green : palette.accent) : off;
  const filled = !round && on && fill ? palette.accent : 'none';
  return (
    <Tap onPress={onPress} disabled={disabled} hitSlop={HIT} accessibilityRole={role} accessibilityLabel={label}
      accessibilityState={{ ...(on === undefined ? {} : { selected: on }), ...(expanded === undefined ? {} : { expanded }), ...(disabled ? { disabled } : {}) }}
      style={({ pressed }) => ({
        width: dims.box, height: dims.box, alignItems: 'center', justifyContent: 'center',
        borderRadius: dims.box / 2, backgroundColor: round ? (disabled ? palette.rule : palette.accent) : 'transparent',
        opacity: disabled ? (round ? 1 : 0.4) : pressed ? 0.6 : 1,
      })}>
      {render ? render({ size: dims.icon, color, fill: round ? color : filled }) : <Icon size={dims.icon} color={color} fill={round ? color : filled} strokeWidth={on ? 2.25 : 2} />}
      {dot && <View style={{ position: 'absolute', top: dims.box / 6, end: dims.box / 6, width: 7, height: 7, borderRadius: 4, backgroundColor: palette.accent }} />}
    </Tap>
  );
}
