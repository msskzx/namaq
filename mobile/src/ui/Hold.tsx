import type { ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

/**
 * A finger held down on what it wraps: `onHold(true)` once held, `onHold(false)` when it lifts. A finger that moves (a
 * scroll or a swipe) is never a hold, so a gesture around it keeps working.
 */
export default function Hold({ onHold, children }: { onHold: (down: boolean) => void; children: ReactNode }) {
  const hold = Gesture.LongPress()
    .minDuration(250)
    .maxDistance(30)
    .onStart(() => { scheduleOnRN(onHold, true); })
    .onFinalize((_, success) => { if (success) scheduleOnRN(onHold, false); });
  return <GestureDetector gesture={hold}>{children}</GestureDetector>;
}
