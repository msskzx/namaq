import { View } from 'react-native';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';

/**
 * A column of dots, one for each step of something walked in order: the step reached is bigger and in the theme's yellow,
 * those passed muted. A tap on a dot goes to its step; its name is for screen readers.
 */
export default function StepDots({ names, at, onPick, palette }: { names: string[]; at: number; onPick: (step: number) => void; palette: Palette }) {
  return (
    <View accessibilityRole="tablist" style={{ gap: 2 }}>
      {names.map((name, i) => (
        <Tap key={`${i}:${name}`} onPress={() => onPick(i)} accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: i === at }} aria-selected={i === at}
          style={{ width: 24, height: 22, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: i === at ? 10 : 7, height: i === at ? 10 : 7, borderRadius: 5, backgroundColor: i === at ? palette.highlight : i < at ? palette.muted : palette.rule }} />
        </Tap>
      ))}
    </View>
  );
}
