import { useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Check, GripVertical } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import { givenOrder, misplaced, sentOrder } from '@shared/quiz/orderAnswer';
import { CARD, type Palette } from '@/lib/theme';

type Choice = { value: string; labelArabic: string };
const GAP = 10;
const ROW = 56;
const SETTLE = 150;
const STEP = ROW + GAP;

const landing = (from: number, dy: number, count: number) => {
  'worklet';
  return Math.max(0, Math.min(count - 1, from + Math.round(dy / STEP)));
};

function Row({ id, count, label, slots, lifted, dy, palette, locked, onDrop }: {
  id: number; count: number; label: string; slots: SharedValue<number[]>; lifted: SharedValue<number>; dy: SharedValue<number>;
  palette: Palette; locked: boolean; onDrop: (slots: number[]) => void;
}) {
  const start = () => { 'worklet'; if (lifted.value < 0) { lifted.value = id; dy.value = 0; } };
  const move = (y: number) => { 'worklet'; if (lifted.value === id) dy.value = y; };
  const drop = () => {
    'worklet';
    if (lifted.value !== id) return;
    const from = slots.value[id];
    const to = landing(from, dy.value, count);
    const next = slots.value.map(slot => slot === from ? to : from < to && slot > from && slot <= to ? slot - 1 : to < from && slot >= to && slot < from ? slot + 1 : slot);
    dy.value = (from - to) * STEP + dy.value;
    slots.value = next;
    dy.value = withTiming(0, { duration: SETTLE }, () => { lifted.value = -1; });
    scheduleOnRN(onDrop, next);
  };
  const grip = Gesture.Pan().enabled(!locked).minDistance(1).onStart(start).onUpdate(event => move(event.translationY)).onFinalize(drop);
  const hold = Gesture.Pan().enabled(!locked).activateAfterLongPress(180).onStart(start).onUpdate(event => move(event.translationY)).onFinalize(drop);
  const style = useAnimatedStyle(() => {
    const slot = slots.value[id];
    if (lifted.value === id) return { top: slot * STEP, transform: [{ translateY: dy.value }], zIndex: 2, borderColor: palette.accent, borderWidth: 1.5 };
    let shift = 0;
    if (lifted.value >= 0 && dy.value !== 0) {
      const from = slots.value[lifted.value];
      const to = landing(from, dy.value, count);
      if (from < slot && slot <= to) shift = -1;
      if (to <= slot && slot < from) shift = 1;
    }
    return { top: withTiming((slot + shift) * STEP, { duration: SETTLE }), transform: [{ translateY: 0 }], zIndex: 1, borderColor: palette.rule, borderWidth: 1 };
  });
  return (
    <GestureDetector gesture={hold}>
      <Animated.View accessible accessibilityLabel={label}
        accessibilityActions={locked ? undefined : [{ name: 'up', label: 'إلى أعلى' }, { name: 'down', label: 'إلى أسفل' }]}
        onAccessibilityAction={event => {
          const from = slots.value[id];
          const to = from + (event.nativeEvent.actionName === 'up' ? -1 : 1);
          if (to < 0 || to >= count) return;
          const next = slots.value.map(slot => slot === from ? to : slot === to ? from : slot);
          slots.value = next;
          onDrop(next);
        }}
        style={[{ position: 'absolute', left: 0, right: 0, height: ROW, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, ...CARD,
        backgroundColor: palette.card, paddingHorizontal: 16 }, style]}>
        <Text style={{ color: palette.ink, fontSize: 19 }}>{label}</Text>
        {!locked && (
          <GestureDetector gesture={grip}>
            <View style={{ width: 44, height: ROW, alignItems: 'center', justifyContent: 'center' }} accessibilityElementsHidden>
              <GripVertical size={22} color={palette.muted} />
            </View>
          </GestureDetector>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

export default function OrderRows({ question, picked, palette, onPick, onDraft }: {
  question: { key: string; choices: Choice[]; order?: string[]; whereOf?: Record<string, string> };
  picked: string | undefined;
  palette: Palette;
  onPick?: (value: string) => void;
  onDraft?: (value: string) => void;
}) {
  const answered = picked !== undefined && !!question.order?.length;
  const first = question.choices.map(choice => choice.value);
  const [values, setValues] = useState(first);
  const slots = useSharedValue(first.map((_, i) => i));
  const lifted = useSharedValue(-1);
  const dy = useSharedValue(0);
  const label = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? value;
  const drop = (next: number[]) => {
    const ordered = [...first];
    next.forEach((slot, id) => { ordered[slot] = first[id]; });
    setValues(ordered);
    onDraft?.(sentOrder(ordered));
  };

  if (answered) {
    const right = question.order!;
    const placed = givenOrder(picked);
    return (
      <View style={{ paddingHorizontal: 16, gap: GAP }}>
        {right.map(value => {
          const wrong = misplaced(right, placed, value);
          const color = wrong ? palette.accent : palette.green;
          return (
            <View key={value} accessible accessibilityLabel={`${label(value)}${wrong ? `، ${wrong.ar}` : '، في مكانها'}`}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: ROW, borderWidth: 1.5, borderColor: color, ...CARD, paddingHorizontal: 16 }}>
              <Text style={{ color: palette.ink, fontSize: 19 }}>{label(value)}
                {question.whereOf?.[value] ? <Text style={{ color: palette.muted, fontSize: 15 }}>{`  ${question.whereOf[value]}`}</Text> : null}</Text>
              {wrong ? <Text style={{ color, fontSize: 14 }}>{wrong.ar}</Text> : <Check size={20} color={color} />}
            </View>
          );
        })}
      </View>
    );
  }

  const locked = !onPick;
  return (
    <View style={{ paddingHorizontal: 16, gap: GAP }}>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اسحب كل سورة إلى مكانها، الأولى في المصحف في الأعلى.</Text>
      <View style={{ height: first.length * STEP - GAP }}>
        {first.map((value, id) => (
          <Row key={value} id={id} count={first.length} label={label(value)} slots={slots} lifted={lifted} dy={dy} palette={palette} locked={locked} onDrop={drop} />
        ))}
      </View>
      {onPick && <View style={{ alignItems: 'flex-start' }}><Button variant="primary" Icon={Check} label="تحقق" onPress={() => onPick(sentOrder(values))} /></View>}
    </View>
  );
}
