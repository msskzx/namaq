import { useCallback, useEffect, useRef } from 'react';
import { Platform, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

export const SCROLL_QUIET_MS = 150;

export function useWebScrollEnd(settle: (event: ScrollEvent) => void) {
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(quiet.current), []);
  return useCallback((event: ScrollEvent) => {
    if (Platform.OS !== 'web') return;
    const { nativeEvent } = event;
    clearTimeout(quiet.current);
    quiet.current = setTimeout(() => settle({ nativeEvent } as ScrollEvent), SCROLL_QUIET_MS);
  }, [settle]);
}
