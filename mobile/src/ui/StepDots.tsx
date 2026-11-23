import { View } from 'react-native';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import { MIN_TAP } from '@/ui/tapSize';

/**
 * A row of dots, one for each step of something walked in order: the step reached is bigger and in the theme's yellow,
 * those passed muted. Each dot's box is a whole tap's size, so neighbouring dots never share a finger. A tap on a dot goes
 * to its step; its name is for screen readers.
 */
export default function StepDots({ names, at, onPick, palette, column = false }: { names: string[]; at: number; onPick: (step: number) => void; palette: Palette;
  /** Down the side instead of across (a full-screen scene, its dots on the left edge). */
  column?: boolean }) {
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: column ? 'column' : 'row', justifyContent: 'center' }}>
      {names.map((name, i) => (
        <Tap key={`${i}:${name}`} onPress={() => onPick(i)} accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: i === at }} aria-selected={i === at}
          style={{ width: MIN_TAP, height: MIN_TAP, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: i === at ? 10 : 7, height: i === at ? 10 : 7, borderRadius: 5, backgroundColor: i === at ? palette.highlight : i < at ? palette.muted : palette.rule }} />
        </Tap>
      ))}
    </View>
  );
}
