import { Platform } from 'react-native';
import { usePalette } from './theme';
import { useColumnSide } from '@/ui/column';

export function useStackOptions(column?: number) {
  const palette = usePalette();
  const side = useColumnSide(column);
  return { headerShown: false, contentStyle: { backgroundColor: palette.paper, paddingHorizontal: side }, gestureEnabled: true, fullScreenGestureEnabled: false } as const;
}

export const BACK_EDGE_SLOP = Platform.OS === 'ios' ? { right: -24 } : {};
