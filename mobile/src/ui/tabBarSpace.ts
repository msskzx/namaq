import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR = { height: 56, side: 20 };

export const tabBarBottom = (bottomInset: number) => (bottomInset > 40 ? bottomInset + 8 : Math.max(8, bottomInset - 10));

export const tabBarTop = (bottomInset: number) => tabBarBottom(bottomInset) + TAB_BAR.height;

export function useTabBarSpace() {
  return tabBarTop(useSafeAreaInsets().bottom) + 8;
}
