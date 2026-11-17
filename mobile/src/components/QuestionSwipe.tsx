import { type ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

/** How far, or how fast, a finger must move sideways to turn the question. */
const TURN = 80;
const FLICK = 500;
const SLIDE = 180;

/**
 * Swipes between quiz questions (owner, 2026-11-17). The question follows the finger; as in the mushaf, the next question
 * is on the left, so a finger moving right goes forward. A swipe that falls short springs back. Vertical scrolling and a
 * wide tree's own sideways scroll keep their gestures: the swipe only starts on a clearly sideways move.
 */
export default function QuestionSwipe({ onNext, onPrevious, children }: { onNext?: () => void; onPrevious?: () => void; children: ReactNode }) {
  const shift = useSharedValue(0);
  const width = useSharedValue(400);
  const canNext = !!onNext, canPrevious = !!onPrevious;
  const turn = (forward: boolean) => (forward ? onNext : onPrevious)?.();
  const pan = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-14, 14])
    .onUpdate(event => {
      const allowed = event.translationX > 0 ? canNext : canPrevious;
      shift.value = allowed ? event.translationX : event.translationX / 4;
    })
    .onEnd(event => {
      const forward = event.translationX > 0;
      const far = Math.abs(event.translationX) > TURN || Math.abs(event.velocityX) > FLICK;
      if (far && (forward ? canNext : canPrevious)) {
        shift.value = withTiming((forward ? 1 : -1) * width.value, { duration: SLIDE }, finished => {
          // A new touch that stops the slide leaves the question where it is.
          if (!finished) return;
          scheduleOnRN(turn, forward);
          // The new question comes in from the other side.
          shift.value = (forward ? -1 : 1) * width.value / 3;
          shift.value = withTiming(0, { duration: SLIDE });
        });
      } else shift.value = withTiming(0, { duration: SLIDE });
    });
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: shift.value }] }));
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ flex: 1 }, style]} onLayout={event => { width.value = event.nativeEvent.layout.width; }}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
