import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** The floating tab bar (TabBar.tsx): its full height, and how far it floats in from the sides and up from the bottom edge. */
export const TAB_BAR = { height: 56, side: 20, lift: 12 };

/** Where the bar's top edge sits above the screen's bottom edge, for controls that sit just above it (the mushaf's recite bar). */
export const tabBarTop = (bottomInset: number) => bottomInset + TAB_BAR.lift + TAB_BAR.height;

/** The room a tab's page leaves at its bottom, so its last line and buttons clear the floating bar. */
export function useTabBarSpace() {
  return tabBarTop(useSafeAreaInsets().bottom) + 8;
}
