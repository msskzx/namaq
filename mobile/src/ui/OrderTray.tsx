import { useState } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { measure, scrollTo, useAnimatedRef, useAnimatedStyle, useFrameCallback, useScrollOffset, useSharedValue, type AnimatedRef, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BookSearch, Check } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { Tap } from '@/ui/Tap';
import Button from '@/ui/Button';
import { SearchField } from '@/ui/Field';
import { num } from '@shared/quran/arabicNumber';
import { boxNumbers, dropOn, emptyTray, inTray, put, sentTray, takeOut, tapBox, trayFinds, trayOf, trayResults, type Tray } from '@shared/quiz/orderTray';
import { sentOrder } from '@shared/quiz/orderAnswer';
import { CARD, type Palette } from '@/lib/theme';

type Choice = { value: string; labelArabic: string };
type Lift = { value: string; from: 'list' | 'box' };
const BOX = 44;
const GAP = 6;
const STEP = BOX + GAP;
const SPLIT = 10;
const LIFT_AFTER = 180;
const EDGE = 56;
const SCROLL_PER_FRAME = 7;
const NONE = -1;
const TO_LIST = -2;

const over = (ref: AnimatedRef<Animated.ScrollView>, x: number, y: number) => {
  'worklet';
  const frame = measure(ref);
  return frame && x >= frame.pageX && x <= frame.pageX + frame.width && y >= frame.pageY && y <= frame.pageY + frame.height ? frame : null;
};

function Draggable({ id, from, lifted, target, at, palette, onTap, grab, follow, release, label, accessibilityLabel, style, children }: {
  id: number; from: Lift['from']; lifted: SharedValue<number>; target: SharedValue<number>; at?: number; palette: Palette; onTap: () => void;
  grab: (id: number, from: Lift['from'], x: number, y: number) => void; follow: (id: number, x: number, y: number) => void; release: (id: number) => void;
  label: string; accessibilityLabel?: string; style: object; children: React.ReactNode;
}) {
  const lift = Gesture.Pan().activateAfterLongPress(LIFT_AFTER)
    .onStart(event => { 'worklet'; grab(id, from, event.absoluteX, event.absoluteY); })
    .onUpdate(event => { 'worklet'; follow(id, event.absoluteX, event.absoluteY); })
    .onFinalize(() => { 'worklet'; release(id); });
  const tap = Gesture.Tap().maxDistance(10).onEnd(() => { 'worklet'; scheduleOnRN(onTap); });
  const look = useAnimatedStyle(() => ({
    opacity: lifted.get() === id ? 0.3 : 1,
    borderColor: at !== undefined && target.get() === at ? palette.accent : palette.rule,
  }));
  return (
    <GestureDetector gesture={Gesture.Exclusive(lift, tap)}>
      <Animated.View accessible accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} onAccessibilityTap={onTap} style={[style, look]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

function EmptyBox({ at, n, lit, target, palette, onPress }: { at: number; n: number; lit: boolean; target: SharedValue<number>; palette: Palette; onPress?: () => void }) {
  const look = useAnimatedStyle(() => {
    const aimed = target.get() === at;
    return { borderColor: aimed || lit ? palette.accent : palette.rule, borderStyle: aimed || lit ? 'solid' : 'dashed', backgroundColor: aimed ? palette.paperDeep : 'transparent' };
  });
  return (
    <Tap onPress={onPress} accessibilityRole="button" accessibilityLabel={`${num(n)}، ${lit ? 'المربع التالي' : 'فارغ، اضغط ليكون التالي'}`}>
      <Animated.View style={[{ height: BOX, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, borderWidth: 1.5, ...CARD }, look]}>
        <Text style={{ color: lit ? palette.accent : palette.muted, fontSize: 15 }}>{num(n)}</Text>
      </Animated.View>
    </Tap>
  );
}

export default function OrderTray({ question, picked, palette, onPick, onDraft, onRetry, onLook, onBox, pinned = false, start, header, footer }: {
  question: { key: string; choices: Choice[]; order?: string[] };
  picked: string | undefined;
  palette: Palette;
  onPick?: (value: string) => void;
  onDraft?: (value: string) => void;
  onRetry?: (start: string) => void;
  onLook?: (surah: number) => void;
  onBox?: (surah: number) => void;
  pinned?: boolean;
  start?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const values = question.choices.map(choice => choice.value);
  const numbers = boxNumbers(values);
  const label = (value: string) => question.choices.find(choice => choice.value === value)?.labelArabic ?? value;
  const [tray, setTray] = useState<Tray>(() => (start ? trayOf(start, numbers.length) : emptyTray(numbers.length)));
  const [typed, setTyped] = useState('');
  const [room, setRoom] = useState(0);
  const [held, setHeld] = useState<Lift | null>(null);
  const root = useAnimatedRef<Animated.View>();
  const boxesRef = useAnimatedRef<Animated.ScrollView>();
  const listRef = useAnimatedRef<Animated.ScrollView>();
  const boxesScrolled = useScrollOffset(boxesRef);
  const lifted = useSharedValue(NONE);
  const target = useSharedValue(NONE);
  const fingerX = useSharedValue(0);
  const fingerY = useSharedValue(0);
  const fromBox = useSharedValue(false);
  const answered = picked !== undefined && !!question.order?.length;

  const change = (next: Tray) => {
    setTray(next);
    onDraft?.(sentTray(next));
  };

  const count = numbers.length;
  const aim = () => {
    'worklet';
    const x = fingerX.get();
    const y = fingerY.get();
    const boxes = over(boxesRef, x, y);
    if (boxes) {
      const at = Math.floor((y - boxes.pageY + boxesScrolled.get()) / STEP);
      target.set(at >= 0 && at < count ? at : NONE);
    } else target.set(fromBox.get() && over(listRef, x, y) ? TO_LIST : NONE);
  };
  const move = (x: number, y: number) => {
    'worklet';
    fingerX.set(x);
    fingerY.set(y);
    aim();
  };

  const autoScroll = useFrameCallback(() => {
    'worklet';
    if (lifted.get() === NONE || !pinned) return;
    const boxes = measure(boxesRef);
    if (!boxes || fingerX.get() < boxes.pageX || fingerX.get() > boxes.pageX + boxes.width) return;
    const fromTop = fingerY.get() - boxes.pageY;
    const fromBottom = boxes.pageY + boxes.height - fingerY.get();
    const step = fromTop < EDGE ? -SCROLL_PER_FRAME : fromBottom < EDGE ? SCROLL_PER_FRAME : 0;
    if (!step) return;
    scrollTo(boxesRef, 0, Math.max(0, boxesScrolled.get() + step), false);
    aim();
  }, false);

  const lift = (id: number, from: Lift['from']) => {
    setHeld({ value: values[id], from });
    autoScroll.setActive(true);
  };
  const grab = (id: number, from: Lift['from'], x: number, y: number) => {
    'worklet';
    if (lifted.get() !== NONE) return;
    lifted.set(id);
    fromBox.set(from === 'box');
    move(x, y);
    scheduleOnRN(lift, id, from);
  };
  const follow = (id: number, x: number, y: number) => {
    'worklet';
    if (lifted.get() === id) move(x, y);
  };
  const drop = (id: number, at: number) => {
    autoScroll.setActive(false);
    setHeld(null);
    if (at >= 0) change(dropOn(tray, values[id], at));
    if (at === TO_LIST) change(takeOut(tray, values[id]));
  };
  const release = (id: number) => {
    'worklet';
    if (lifted.get() !== id) return;
    const dropped = target.get();
    lifted.set(NONE);
    target.set(NONE);
    scheduleOnRN(drop, id, dropped);
  };

  const ghost = useAnimatedStyle(() => {
    const frame = measure(root);
    const list = measure(listRef);
    const width = list?.width ?? 160;
    return frame ? { width, transform: [{ translateX: fingerX.get() - frame.pageX - width / 2 }, { translateY: fingerY.get() - frame.pageY - BOX }] } : { width };
  });

  const result = (n: number, i: number) => {
    const all = trayResults(question.order!, picked);
    const each = all[i];
    const color = each.state === 'right' ? palette.green : each.state === 'wrong' ? palette.accent : palette.rule;
    const name = label(each.right);
    return (
      <Tap key={n} onPress={onBox ? () => onBox(n) : undefined} accessibilityRole={onBox ? 'button' : undefined}
        accessibilityLabel={`${num(n)} ${name}، ${each.state === 'right' ? 'في مكانها' : each.state === 'wrong' ? `وضعت ${label(each.given!)}` : 'لم تضعها'}`}
        style={{ minHeight: BOX, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, borderWidth: 1.5, borderColor: color, ...CARD }}>
        <Text style={{ color: palette.muted, fontSize: 15, width: 30 }}>{num(n)}</Text>
        <Text style={{ color: each.state === 'empty' ? palette.muted : palette.ink, fontSize: 18, flex: 1 }}>{name}</Text>
        {each.state === 'right' ? <Check size={18} color={color} />
          : each.state === 'wrong' ? <Text style={{ color, fontSize: 14, textDecorationLine: 'line-through' }}>{label(each.given!)}</Text>
          : <Text style={{ color: palette.muted, fontSize: 14 }}>لم تضعها</Text>}
      </Tap>
    );
  };

  if (answered) {
    const all = trayResults(question.order!, picked);
    const missed = all.filter(each => each.state !== 'right').length;
    const body = (
      <>
        {header}
        <Text style={{ color: missed ? palette.accent : palette.green, fontSize: 16, textAlign: 'right' }}>
          {missed ? `${num(all.length - missed)} من ${num(all.length)} في مكانها.` : 'كلها في مكانها.'}
        </Text>
        {onBox && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>اضغط أي سورة لترى بطاقتها.</Text>}
        {onRetry && missed > 0 && <View style={{ alignItems: 'flex-start' }}>
          <Button variant="primary" label="أعد الخطأ فقط" onPress={() => onRetry(sentOrder(all.map(each => each.state === 'right' ? each.right : '')))} />
        </View>}
        <View style={{ gap: GAP }}>{numbers.map(result)}</View>
        {footer}
      </>
    );
    return pinned
      ? <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 10 }}>{body}</ScrollView>
      : <View style={{ paddingHorizontal: 16, gap: 10 }}>{body}</View>;
  }

  const open = !!onPick;
  const box = (n: number, i: number) => {
    const value = tray.boxes[i];
    if (!value) return <EmptyBox key={n} at={i} n={n} lit={tray.at === i} target={target} palette={palette} onPress={open ? () => change(tapBox(tray, i)) : undefined} />;
    return (
      <Draggable key={n} id={values.indexOf(value)} from="box" at={i} lifted={lifted} target={target} palette={palette}
        onTap={() => open && change(tapBox(tray, i))} grab={grab} follow={follow} release={release} label={label(value)}
        accessibilityLabel={`${num(n)}، ${label(value)}، اضغط لإرجاعها`}
        style={{ height: BOX, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, borderWidth: 1, backgroundColor: palette.card, ...CARD }}>
        <Text style={{ color: palette.muted, fontSize: 15 }}>{num(n)}</Text>
        <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 17, flexShrink: 1 }}>{label(value)}</Text>
      </Draggable>
    );
  };

  const left = inTray(values, tray);
  const searchable = pinned && room > 0 && values.length * STEP > room;
  const shown = searchable ? left.filter(value => trayFinds(label(value), typed)) : left;
  const pill = (value: string) => (
    <Draggable key={value} id={values.indexOf(value)} from="list" lifted={lifted} target={target} palette={palette}
      onTap={() => open && change(put(tray, value))} grab={grab} follow={follow} release={release} label={label(value)}
      style={{ height: BOX, borderRadius: BOX / 2, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
      <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 17 }}>{label(value)}</Text>
    </Draggable>
  );
  const measured = (event: LayoutChangeEvent) => setRoom(event.nativeEvent.layout.height);

  return (
    <Animated.View ref={root} style={{ flex: pinned ? 1 : undefined, gap: 10 }}>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {header}
          {open && <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>اسحب السورة إلى رقمها، أو اضغطها فتوضع في المربع المضيء.</Text>}
        </View>
        <View style={{ flex: pinned ? 1 : undefined, flexDirection: 'row', gap: SPLIT, paddingHorizontal: 16 }}>
          <Animated.ScrollView ref={boxesRef} scrollEnabled={pinned} style={{ flex: 1 }} contentContainerStyle={{ gap: GAP }}>
            {numbers.map(box)}
          </Animated.ScrollView>
          <View onLayout={measured} style={{ flex: 1, gap: GAP, borderStartWidth: 1, borderColor: palette.rule, paddingStart: SPLIT }}>
            {searchable && <SearchField palette={palette} label="ابحث عن سورة" placeholder="ابحث عن سورة" value={typed} onChangeText={setTyped} />}
            <Animated.ScrollView ref={listRef} scrollEnabled={pinned} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
              style={{ flex: pinned ? 1 : undefined }} contentContainerStyle={{ gap: GAP }}>
              {shown.map(pill)}
              {!shown.length && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
                {left.length ? 'لا سورة تبدأ بهذا.' : 'وضعتها كلها.'}
              </Text>}
            </Animated.ScrollView>
          </View>
        </View>
        {open && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: pinned ? 10 : 0 }}>
            <Button variant="primary" Icon={Check} label="تحقق" onPress={() => onPick(sentTray(tray))} />
            {onLook && tray.at !== null && <Button Icon={BookSearch} label="تلميح" accessibilityLabel="تلميح: ابحث عن الجواب" onPress={() => onLook(numbers[tray.at!])} />}
          </View>
        )}
        {footer && <View style={{ paddingHorizontal: 16 }}>{footer}</View>}
        {held && (
          <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, height: BOX, borderRadius: BOX / 2, borderWidth: 1.5, borderColor: palette.accent,
            backgroundColor: palette.card, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }, ghost]}>
            <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 17 }}>{label(held.value)}</Text>
          </Animated.View>
        )}
    </Animated.View>
  );
}
