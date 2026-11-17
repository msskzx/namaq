import { Pressable, View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { usePalette } from '@/lib/theme';

type IconType = (props: LucideProps) => React.ReactNode;

/** The two sizes: `bar` for top, bottom and card button rows; `small` for a button inside a line of text or a list row. */
export const ICON_BUTTON = {
  bar: { icon: 22, box: 40 },
  small: { icon: 18, box: 28 },
  /** A filled round button: the main action of a bar (play, send, record). */
  round: { icon: 22, box: 44 },
  roundBig: { icon: 26, box: 56 },
} as const;
/** Every icon button reaches this far past its box, so a small one is as easy to hit as a bar one. */
const HIT = 8;

type Props = {
  Icon: IconType;
  /** Read out by screen readers: icon buttons carry no words. */
  label: string;
  onPress: () => void;
  size?: 'bar' | 'small';
  /** The icon's colour when off: muted (most buttons), ink (bar buttons that lead the eye), accent (a button that is the page's next step), green (remembered). */
  tone?: 'muted' | 'ink' | 'accent' | 'green';
  /** On (saved, shown, playing): the icon turns the accent, with nothing behind it (owner, 2026-11-17: no coloured square). */
  on?: boolean;
  /** Fill the icon's body when on (the bookmark). */
  fill?: boolean;
  /** A filled accent circle: the bar's main action (play, send, record). `big` for a full-screen sheet's. */
  round?: boolean;
  big?: boolean;
  disabled?: boolean;
  /** Draws the icon itself, for an icon that animates (the bookmark's pop). Gets the size and colour the button would use. */
  render?: (icon: { size: number; color: string; fill: string }) => React.ReactNode;
  /** A small accent dot in the corner: something waits behind the button (a filter set). */
  dot?: boolean;
  /** Opens or folds something below it: read out as expanded or not. */
  expanded?: boolean;
  /** `link` when it goes to another page rather than acting here. */
  role?: 'button' | 'link';
};

/** The app's icon-only button. Every button that shows only an icon is this one; a look it lacks is a new option here. */
export default function IconButton({ Icon, label, onPress, size = 'bar', tone = 'muted', on, fill = false, round = false, big = false, disabled, render, dot, expanded, role = 'button' }: Props) {
  const palette = usePalette();
  const dims = round ? ICON_BUTTON[big ? 'roundBig' : 'round'] : ICON_BUTTON[size];
  const off = tone === 'ink' ? palette.ink : tone === 'accent' ? palette.accent : tone === 'green' ? palette.green : palette.muted;
  const color = round ? palette.onAccent : on ? palette.accent : off;
  const filled = !round && on && fill ? palette.accent : 'none';
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={HIT} accessibilityRole={role} accessibilityLabel={label}
      accessibilityState={{ ...(on === undefined ? {} : { selected: on }), ...(expanded === undefined ? {} : { expanded }), ...(disabled ? { disabled } : {}) }}
      style={({ pressed }) => ({
        width: dims.box, height: dims.box, alignItems: 'center', justifyContent: 'center',
        borderRadius: dims.box / 2, backgroundColor: round ? (disabled ? palette.rule : palette.accent) : 'transparent',
        // A round button that can't act yet turns grey rather than faint.
        opacity: disabled ? (round ? 1 : 0.4) : pressed ? 0.6 : 1,
      })}>
      {render ? render({ size: dims.icon, color, fill: round ? color : filled }) : <Icon size={dims.icon} color={color} fill={round ? color : filled} strokeWidth={on ? 2.25 : 2} />}
      {dot && <View style={{ position: 'absolute', top: dims.box / 6, end: dims.box / 6, width: 7, height: 7, borderRadius: 4, backgroundColor: palette.accent }} />}
    </Pressable>
  );
}
