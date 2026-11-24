import { useRef, useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import { nearestBar, stepBar } from '@shared/bars';
import type { Palette } from '@/lib/theme';

const PILL = 260;
const LIFT_SLOP = 10;

/**
 * A row of bars, the first on the right, each as tall as its count, the whole one control: a touch or a slide picks the
 * nearest bar and names it in a pill above the finger, where the finger does not cover it. Where a word gathers by surah
 * (components/SurahStrip.tsx), and a Sahih's kitabs by their hadith (components/Sahih.tsx, owner 2026-11-23: sketch
 * hadith-design), where lifting the finger opens the kitab and `mark` points at the one read last.
 * `holdScroll` keeps the touch from the page's scroll (a sheet); without it a page scrolled over the bars still scrolls.
 */
export default function BarStrip({ counts, stack, picked, onPick, onLift, onSliding, name, under, mark, ends, height = 96, holdScroll = true, label, palette }: {
  counts: number[];
  /** Each bar split into parts from the bottom up, each part its count in its own tone («مدونتي»'s juz: forgotten, notes, saved). */
  stack?: { parts: number[][]; tones: string[] }; picked: number | null; onPick: (index: number) => void;
  /** The finger lifted (or a screen reader activated) on this bar. */
  onLift?: (index: number) => void;
  onSliding?: (sliding: boolean) => void;
  /** What the pill says for a bar. */
  name: (index: number) => string;
  /** The picked bar's name under it once the finger is off. */
  under?: boolean;
  /** A small accent mark over this bar. */
  mark?: number;
  /** The first and last bars' names under the row's two ends. */
  ends?: [string, string];
  height?: number; holdScroll?: boolean; label: string; palette: Palette;
}) {
  const [width, setWidth] = useState(0);
  const [sliding, setSlidingState] = useState(false);
  const grantY = useRef(0);
  const setSliding = (now: boolean) => { setSlidingState(now); onSliding?.(now); };
  const max = Math.max(1, ...counts);
  const bar = width / Math.max(1, counts.length);
  const at = (event: GestureResponderEvent) => nearestBar(counts, Math.floor((1 - event.nativeEvent.locationX / width) * counts.length));
  const pick = (event: GestureResponderEvent) => {
    if (!width) return;
    const index = at(event);
    if (index !== picked) onPick(index);
  };
  const step = (by: 1 | -1) => counts.some(Boolean) && onPick(picked === null ? counts.findIndex(Boolean) : stepBar(counts, picked, by));
  const centre = (index: number) => (index + 0.5) * bar;
  const pill = Math.min(width, PILL);
  const top = mark === undefined ? 0 : 10;
  return (
    <View>
      <View accessible onLayout={event => setWidth(event.nativeEvent.layout.width)} accessibilityLabel={label}
        accessibilityRole="adjustable" accessibilityValue={picked === null ? undefined : { text: name(picked) }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }, ...(onLift ? [{ name: 'activate' }] : [])]}
        onAccessibilityAction={event => {
          if (event.nativeEvent.actionName === 'activate') { if (picked !== null) onLift?.(picked); }
          else step(event.nativeEvent.actionName === 'increment' ? 1 : -1);
        }}
        onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true} onResponderTerminationRequest={() => !holdScroll}
        onResponderGrant={event => { grantY.current = event.nativeEvent.pageY; setSliding(true); pick(event); }} onResponderMove={pick}
        onResponderRelease={event => {
          setSliding(false);
          // A finger that went up or down more than a tap's slop was scrolling (ui/Tap.tsx), so lifting it opens nothing.
          if (onLift && width && Math.abs(event.nativeEvent.pageY - grantY.current) <= LIFT_SLOP) onLift(at(event));
        }}
        onResponderTerminate={() => setSliding(false)} style={{ height: height + top + (under ? 20 : 0), direction: 'ltr' }}>
        <View pointerEvents="none" style={{ marginTop: top, height, borderBottomWidth: 1, borderColor: palette.rule }}>
          {width > 0 && counts.map((count, i) => count > 0 && (stack
            ? <View key={i} style={{ position: 'absolute', bottom: 0, right: i * bar + bar * 0.15, width: Math.max(1, bar * 0.7), opacity: picked === null || i === picked ? 1 : 0.55 }}>
              {stack.parts[i].map((part, k) => part > 0 && (
                <View key={k} style={{ position: 'absolute', bottom: (stack.parts[i].slice(0, k).reduce((sum, n) => sum + n, 0) / max) * (height - 2), left: 0, right: 0,
                  height: Math.max(2, (part / max) * (height - 2)), backgroundColor: stack.tones[k] }} />
              ))}
            </View>
            : <View key={i} style={{ position: 'absolute', bottom: 0, right: i * bar + bar * 0.15, width: Math.max(1, bar * 0.7),
              height: Math.max(2, (count / max) * (height - 2)), borderRadius: 1, backgroundColor: i === picked ? palette.accent : i === mark ? palette.amber : palette.rule }} />
          ))}
        </View>
        {mark !== undefined && width > 0 && (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: centre(mark) - 5, width: 0, height: 0,
            borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: palette.accent }} />
        )}
        {sliding && picked !== null && width > 0 && (
          <View pointerEvents="none" style={{ position: 'absolute', top: -34, zIndex: 1, width: pill, right: Math.min(width - pill, Math.max(0, centre(picked) - pill / 2)), alignItems: 'center' }}>
            <Chip label={name(picked)} on role="text" small palette={palette} />
          </View>
        )}
        {under && !sliding && picked !== null && width > 0 && (
          <View pointerEvents="none" style={{ position: 'absolute', top: height + top + 1, width: 120, right: Math.min(width - 120, Math.max(0, centre(picked) - 60)) }}>
            <Text numberOfLines={1} style={{ textAlign: 'center', color: palette.accent, fontSize: 13 }}>{name(picked)}</Text>
          </View>
        )}
      </View>
      {ends && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={{ color: palette.muted, fontSize: 13 }}>{ends[0]}</Text>
          <Text style={{ color: palette.muted, fontSize: 13 }}>{ends[1]}</Text>
        </View>
      )}
    </View>
  );
}
