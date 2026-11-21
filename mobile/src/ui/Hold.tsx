import type { ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';

/**
 * A finger held down on what it wraps: `onHold(true)` once held, `onHold(false)` when it lifts or the hold is cancelled. A finger that moves (a
 * scroll or a swipe) is never a hold, so a gesture around it keeps working.
 */
export default function Hold({ onHold, enabled = true, children }: { onHold: (down: boolean) => void;
  /** Off, a press goes through to the buttons inside. */
  enabled?: boolean; children: ReactNode }) {
  const hold = Gesture.LongPress()
    .enabled(enabled)
    .minDuration(250)
    .maxDistance(30)
    .onStart(() => { scheduleOnRN(onHold, true); })
    .onFinalize(() => { scheduleOnRN(onHold, false); });
  return <GestureDetector gesture={hold}>{children}</GestureDetector>;
}
