import { useEffect, useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { ChevronLeft, ChevronsLeft, GripVertical, PenLine, Undo2, X, type LucideProps } from 'lucide-react-native';
import { SHOW } from '@/ui/motion';
import IconButton from '@/ui/IconButton';
import GlassBar, { GLASS_BAR } from '@/ui/GlassBar';
import type { Palette } from '@/lib/theme';
import type { Recite } from './useRecite';

/** The bar's height. */
export const RECITE_BAR = GLASS_BAR;

type Icon = (props: LucideProps) => React.ReactNode;

export type DockEdge = 'top' | 'bottom';
/**
 * A bar the reader drags to the top or the bottom of the screen, near the thumb (owner, 2026-11-17). `top` is where it sits at
 * the top (from the screen's top), `bottom` where it sits at the bottom (from the screen's bottom), `height` the screen's.
 */
export type Dock = { edge: DockEdge; top: number; bottom: number; height: number; onEdge: (edge: DockEdge) => void };


/**
 * Recite mode's bar, the one every place recites with (owner, 2026-11-17): step back, the next word, the next ayah, the pen,
 * and in the mushaf the end of the recitation. See-through like the tab bar. A place leaves a button out by giving it no
 * handler (`onClose`), and says what the next-ayah button does once its ayat are done (`after`: the reader's next forgotten
 * ayah, or the next page) and whether there is anything after (`more`).
 */
export default function RecitePill({ recite, writing, onWriting, onClose, after, more = false, lead, style, palette, dock }: {
  recite: Recite; writing: boolean; onWriting: () => void; onClose?: () => void;
  /** The bar dragged to the top or the bottom (the reader); without it the bar stays where `style` puts it. */
  dock?: Dock;
  after?: { Icon: Icon; label: string }; more?: boolean; lead?: React.ReactNode;
  style?: StyleProp<ViewStyle>; palette: Palette;
}) {
  const ended = recite.done || !recite.view?.upcoming;
  const next = recite.done && after ? after : { Icon: ChevronsLeft, label: 'أظهر الآية التالية' };
  // The grip asks the docked bar to slide over; the edge changes once it is there, so the page makes room after the bar moves.
  const [moving, setMoving] = useState<DockEdge | null>(null);
  const bar = (
    <GlassBar label="أدوات التسميع" style={dock ? null : style}>
      {lead}
      <IconButton Icon={Undo2} label="ارجع خطوة" tone="ink" disabled={recite.atStart} onPress={recite.back} />
      <IconButton Icon={ChevronLeft} label="أظهر الكلمة التالية" tone="ink" disabled={recite.done} onPress={recite.nextWord} />
      {/* In a party the next ayah waits for everyone, and the pen is on for all (owner, 2026-11-17). */}
      {!recite.party && <IconButton Icon={next.Icon} label={next.label} tone="ink" disabled={ended && !more} onPress={recite.nextAyah} />}
      <IconButton Icon={PenLine} label={writing ? 'أوقف الكتابة' : recite.pen === 'whole' ? 'اكتب كل آية كاملة' : 'اكتب أول كل آية وآخرها'} tone="ink" on={writing} disabled={recite.party} onPress={onWriting} />
      {onClose && <IconButton Icon={X} label="إنهاء التسميع" tone="ink" onPress={onClose} />}
      {/* The grip, on the far left away from the buttons: drag the bar by it (or anywhere on the bar), or tap it to move the bar to the other edge. */}
      {dock && <IconButton Icon={GripVertical} label={dock.edge === 'top' ? 'انقل الشريط إلى الأسفل' : 'انقل الشريط إلى الأعلى'} size="small" onPress={() => setMoving(dock.edge === 'top' ? 'bottom' : 'top')} />}
    </GlassBar>
  );
  return dock ? <Docked dock={dock} moving={moving} onMoved={() => setMoving(null)} style={style}>{bar}</Docked> : bar;
}

/** The bar held at its edge, following the finger while dragged and settling at the nearer edge (or the one it was flung to). */
function Docked({ dock, moving, onMoved, style, children }: { dock: Dock; moving: DockEdge | null; onMoved: () => void; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const { edge, top, bottom, height, onEdge } = dock;
  const low = height - bottom - RECITE_BAR;
  const at = (side: DockEdge) => (side === 'top' ? top : low);
  const y = useSharedValue(at(edge));
  const start = useSharedValue(0);
  useEffect(() => {
    const to = edge === 'top' ? top : low;
    if (y.value !== to) y.value = withTiming(to, SHOW);
  }, [edge, top, low, y]);
  const settle = (side: DockEdge) => {
    'worklet';
    y.value = withTiming(side === 'top' ? top : low, SHOW, done => { if (done && side !== edge) scheduleOnRN(onEdge, side); });
  };
  useEffect(() => {
    if (!moving) return;
    settle(moving);
    onMoved();
  }, [moving]); // eslint-disable-line react-hooks/exhaustive-deps
  const pan = Gesture.Pan().activeOffsetY([-8, 8])
    .onBegin(() => { start.value = y.value; })
    .onUpdate(event => { y.value = Math.min(low, Math.max(top, start.value + event.translationY)); })
    .onEnd(event => {
      const side: DockEdge = Math.abs(event.velocityY) > 700 ? (event.velocityY < 0 ? 'top' : 'bottom') : y.value - top < low - y.value ? 'top' : 'bottom';
      settle(side);
    });
  const moved = useAnimatedStyle(() => ({ top: y.value }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ position: 'absolute' }, style, moved]}>{children}</Animated.View>
    </GestureDetector>
  );
}
