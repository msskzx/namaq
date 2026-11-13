import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** The floating tab bar (TabBar.tsx): its full height, and how far it floats in from the sides. */
export const TAB_BAR = { height: 56, side: 20 };

/**
 * How far the bar's bottom edge sits above the screen's bottom edge: low, dipping into the home indicator's area
 * as Instagram's and YouTube's do (owner, 2026-11-13), and a little off the edge on phones without one.
 * A tall inset is Android's three-button bar, which takes touches: there the bar stays clear above it.
 */
export const tabBarBottom = (bottomInset: number) => (bottomInset > 40 ? bottomInset + 8 : Math.max(8, bottomInset - 10));

/** Where the bar's top edge sits above the screen's bottom edge, for controls that sit just above it (the mushaf's recite bar). */
export const tabBarTop = (bottomInset: number) => tabBarBottom(bottomInset) + TAB_BAR.height;

/** The room a tab's page leaves at its bottom, so its last line and buttons clear the floating bar. */
export function useTabBarSpace() {
  return tabBarTop(useSafeAreaInsets().bottom) + 8;
}
