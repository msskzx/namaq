import { useRef, useState } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import { nearestBar, stepBar } from '@shared/bars';
import type { Palette } from '@/lib/theme';

const PILL = 260;
const LIFT_SLOP = 10;

export default function BarStrip({ counts, tone, picked, onPick, onLift, onSliding, name, under, mark, ends, height = 96, holdScroll = true, label, palette }: {
  counts: number[];
  tone?: string;
  picked: number | null; onPick: (index: number) => void;
  onLift?: (index: number) => void;
  onSliding?: (sliding: boolean) => void;
  name: (index: number) => string;
  under?: boolean;
  mark?: number;
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
          if (onLift && width && Math.abs(event.nativeEvent.pageY - grantY.current) <= LIFT_SLOP) onLift(at(event));
        }}
        onResponderTerminate={() => setSliding(false)} style={{ height: height + top + (under ? 20 : 0), direction: 'ltr' }}>
        <View pointerEvents="none" style={{ marginTop: top, height, borderBottomWidth: 1, borderColor: palette.rule }}>
          {width > 0 && counts.map((count, i) => count > 0 && (
            <View key={i} style={{ position: 'absolute', bottom: 0, right: i * bar + bar * 0.15, width: Math.max(1, bar * 0.7),
              height: Math.max(2, (count / max) * (height - 2)), borderRadius: 1, backgroundColor: i === picked ? palette.accent : i === mark ? palette.amber : tone ?? palette.rule, opacity: tone && picked !== null && i !== picked ? 0.55 : 1 }} />
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
