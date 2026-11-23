import { View } from 'react-native';
import { Tap } from '@/ui/Tap';
import type { Palette } from '@/lib/theme';
import { MIN_TAP } from '@/ui/tapSize';

/**
 * A row of dots, one for each step of something walked in order: the step reached is bigger and in the theme's yellow,
 * those passed muted. Each dot's box is a whole tap's size, so neighbouring dots never share a finger. A tap on a dot goes
 * to its step; its name is for screen readers.
 * Without `onPick` the dots only show how far a list has come (the adhkar of a time): small, close, wrapping, each step
 * marked `done` in green and the step reached in the accent, the row read out as one `label`.
 */
export default function StepDots({ names, at, onPick, palette, column = false, done, label }: { names: string[]; at: number; onPick?: (step: number) => void; palette: Palette;
  /** Down the side instead of across (a full-screen scene, its dots on the left edge). */
  column?: boolean;
  /** Steps finished, in any order (a dhikr said); only without `onPick`. */
  done?: readonly boolean[];
  label?: string }) {
  if (!onPick) return (
    <View accessible accessibilityLabel={label} style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
      {names.map((name, i) => {
        const color = done?.[i] ? palette.green : i === at ? palette.accent : undefined;
        return <View key={`${i}:${name}`} style={{ width: 9, height: 9, borderRadius: 5, borderWidth: 1, borderColor: color ?? palette.rule, backgroundColor: color ?? 'transparent' }} />;
      })}
    </View>
  );
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
