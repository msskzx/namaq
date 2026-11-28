import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector, type GestureType } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { landingPage, MAX_ZOOM, settleZoom } from '@/lib/pageZoom';
import { BACK_EDGE_SLOP } from '@/lib/stackOptions';

const PULL = 70;
const PULL_FLICK = 600;
const TURN = 220;

type Props = {
  page: number;
  count: number;
  width: number;
  height: number;
  onPage: (page: number) => void;
  onMove: () => void;
  render: (page: number) => ReactNode;
  onPull?: () => void;
  zoom?: number;
  onZoom?: (zoom: number, focalY: number) => void;
  backEdge?: boolean;
  scrollTop?: number;
  scroll?: GestureType;
  onPinch?: (on: boolean) => void;
  hold?: boolean;
};

export default function ReaderPager({ page, count, width, height, onPage, onMove, render, onPull, zoom = 1, onZoom, backEdge, scrollTop = 0, scroll, onPinch, hold = false }: Props) {
  const offset = useSharedValue((page - 1) * width);
  const from = useSharedValue(0);
  const settled = useRef(page);
  const pinching = useSharedValue(false);
  const stretch = useSharedValue(1);
  const focal = useSharedValue({ x: 0, y: 0 });

  const laidOut = useRef(width);
  useLayoutEffect(() => {
    if (!width) return;
    const target = (page - 1) * width;
    if (laidOut.current !== width) {
      laidOut.current = width;
      offset.value = target;
    } else if (settled.current !== page) {
      offset.value = Math.abs(settled.current - page) === 1 ? withTiming(target, { duration: TURN }) : target;
    }
    settled.current = page;
  }, [page, width, offset]);

  useEffect(() => () => onPinch?.(false), [onPinch]);

  useLayoutEffect(() => { stretch.value = 1; }, [zoom, stretch]);

  const arrive = useCallback((next: number) => {
    settled.current = next;
    onPage(next);
  }, [onPage]);

  const last = (count - 1) * width;
  const pan = Gesture.Pan()
    .enabled(!hold)
    .maxPointers(1)
    .hitSlop(backEdge ? BACK_EDGE_SLOP : {})
    .activeOffsetX([-12, 12])
    .failOffsetY([-24, 24])
    .onStart(() => {
      from.value = offset.value;
      scheduleOnRN(onMove);
    })
    .onUpdate(event => {
      const next = from.value + event.translationX;
      offset.value = next < 0 ? next / 4 : next > last ? last + (next - last) / 4 : next;
    })
    .onEnd((event, success) => {
      scheduleOnRN(onMove);
      const at = Math.round(from.value / width);
      const target = success && !pinching.value ? landingPage(at, event.translationX, event.velocityX, width, count) : at;
      offset.value = withTiming(target * width, { duration: TURN });
      if (target !== at) scheduleOnRN(arrive, target + 1);
    });

  const pull = Gesture.Pan()
    .enabled(!!onPull && zoom === 1 && !hold)
    .maxPointers(1)
    .activeOffsetY(24)
    .failOffsetX([-16, 16])
    .onStart(() => scheduleOnRN(onMove))
    .onEnd((event, success) => {
      scheduleOnRN(onMove);
      if (onPull && success && !pinching.value && (event.translationY > PULL || event.velocityY > PULL_FLICK)) scheduleOnRN(onPull);
    });

  const pinch = Gesture.Pinch()
    .enabled(!!onZoom)
    .onStart(event => {
      pinching.value = true;
      focal.value = { x: event.focalX, y: event.focalY };
      scheduleOnRN(onMove);
      if (onPinch) scheduleOnRN(onPinch, true);
    })
    .onUpdate(event => {
      stretch.value = Math.min(MAX_ZOOM, Math.max(0.9, zoom * event.scale)) / zoom;
    })
    .onFinalize(() => {
      if (pinching.value && onPinch) scheduleOnRN(onPinch, false);
      pinching.value = false;
    })
    .onEnd(() => {
      scheduleOnRN(onMove);
      const next = settleZoom(zoom * stretch.value);
      if (next === zoom) stretch.value = withTiming(1, { duration: 150 });
      else if (onZoom) scheduleOnRN(onZoom, next, focal.value.y);
    });
  if (scroll) pinch.simultaneousWithExternalGesture(scroll);

  const track = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }] }));
  const preview = useAnimatedStyle(() => {
    const k = stretch.value;
    return { transform: [{ translateX: focal.value.x * (1 - k) }, { translateY: focal.value.y * (1 - k) }, { scale: k }] };
  });
  const shown = [page - 1, page, page + 1].filter(at => at >= 1 && at <= count);
  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinch, Gesture.Race(pan, pull))}>
      <View style={{ width, height, overflow: 'hidden' }}>
        <Animated.View style={[{ position: 'absolute', left: 0, top: 0, width, height, direction: 'ltr' }, track]}>
          {shown.map(at => (
            <View key={at} style={{ position: 'absolute', top: at === page ? 0 : scrollTop, left: -(at - 1) * width, width, height: at === page ? height : height - scrollTop, overflow: 'hidden' }}>
              <Animated.View style={[{ width, transformOrigin: 'left top', direction: 'rtl' }, at === page ? preview : null]}>
                {render(at)}
              </Animated.View>
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
