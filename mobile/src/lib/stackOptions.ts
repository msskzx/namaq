import { Platform } from 'react-native';
import { usePalette } from './theme';

/**
 * Every page stack (the root one and the home and Quran stacks inside the tabs) slides the same way.
 * Back is a swipe from the RIGHT edge that follows the finger with the page before peeking under it, the way Arabic
 * apps go back on iPhone; the root layout sets the stacks right to left (LocaleProvider), which also brings pages in from the left.
 * Only the edge starts it, never the middle of a page, so the trees, compare cards, story maps and mushaf pages keep their own sideways swipes.
 * Android keeps its system back.
 */
export function useStackOptions() {
  const palette = usePalette();
  return { headerShown: false, contentStyle: { backgroundColor: palette.paper }, gestureEnabled: true, fullScreenGestureEnabled: false } as const;
}

/**
 * The strip along the right edge where the back swipe starts on iPhone. The cards' own sideways swipes (trees, matrices,
 * a story's places) leave it alone (hitSlop), so a swipe from the edge always goes back. Android's back is the system's.
 */
export const BACK_EDGE_SLOP = Platform.OS === 'ios' ? { right: -24 } : {};
