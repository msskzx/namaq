
import { useRef, type ComponentRef } from 'react';
import type { View } from 'react-native';
import type { LucideProps } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import type { Palette } from '@/lib/theme';
import QuranWords from '@/components/quran/text/QuranWords';
import { Tap } from '@/ui/Tap';

/**
 * A long-press button: the icon with its name under it (owner, 2026-11-13: the buttons got many, so each says what it is).
 * On (saved, forgotten, noted), the icon and its name take the mark's colour, filled where the icon has a body, with
 * nothing behind them (owner, 2026-11-17: no coloured square, as the فاصلة in the top bar).
 */
/** Where a button is on the screen. */
export type ButtonBox = { x: number; y: number; width: number; height: number };

export default function ActButton({ Icon, label, name, onPress, onPressAt, expanded, quran = false, palette, on = false, color, tint, filled = false, wide = false }: { Icon: (props: LucideProps) => React.ReactNode; label: string; name: string; palette: Palette; on?: boolean; color?: string;
  onPress?: () => void;
  /** Instead of onPress, for a press that opens something over the button (the reader's bubble): where the button is. */
  onPressAt?: (box: ButtonBox) => void;
  /** Its bubble is open. */
  expanded?: boolean;
  /** Its name is Quran words (the reader's bubble names the lit words), in the mushaf's font. */
  quran?: boolean;
  /** As wide as its name, for a name of a few words (a feed card's «ليس من اهتماماتي»). */
  wide?: boolean;
  /** The colour when on: the mark's own (purple for saved), the accent otherwise. */
  tint?: string;
  /** Fill the icon when on (the bookmark). */
  filled?: boolean }) {
  const onColor = tint ?? palette.accent;
  const box = useRef<ComponentRef<typeof View>>(null);
  return (
    <Tap ref={box} onPress={() => (onPressAt ? box.current?.measureInWindow((x, y, width, height) => onPressAt({ x, y, width, height })) : onPress?.())} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on, ...(expanded !== undefined ? { expanded } : {}) }}
      style={{ ...(wide ? { minWidth: ACT_WIDTH, paddingHorizontal: 8 } : { width: ACT_WIDTH }), alignItems: 'center', gap: 3, paddingTop: 7, paddingBottom: 5, borderRadius: 10 }}>
      <Icon size={22} color={on ? onColor : color ?? palette.ink} fill={on && filled ? onColor : 'none'} strokeWidth={on ? 2.25 : 2} />
      {quran
        ? <QuranWords style={{ fontSize: 15, color: on ? onColor : palette.muted }}>{name}</QuranWords>
        : <Text numberOfLines={1} style={{ fontSize: 11, color: on ? onColor : palette.muted }}>{name}</Text>}
    </Tap>
  );
}
export const ACT_WIDTH = 56;
