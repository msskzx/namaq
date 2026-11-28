import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { FlatList, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useWebScrollEnd } from '@/lib/hooks/useWebScrollEnd';

export default function Pager<T>({ data, index, onIndex, keyOf, renderPage }: {
  data: readonly T[]; index: number; onIndex: (index: number) => void; keyOf: (item: T) => string;
  renderPage: (item: T, size: { width: number; height: number }) => ReactNode;
}) {
  const list = useRef<FlatList<T>>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width } = size;
  const shown = useRef(index);
  const resized = useRef(0);
  useEffect(() => {
    if (!width || shown.current === index) return;
    shown.current = index;
    list.current?.scrollToIndex({ index, animated: true });
  }, [index, width]);
  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const at = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (resized.current) {
      const fresh = Date.now() - resized.current < 600;
      resized.current = 0;
      if (fresh && at !== shown.current) { list.current?.scrollToIndex({ index: shown.current, animated: false }); return; }
    }
    if (at === shown.current || at < 0 || at >= data.length) return;
    shown.current = at;
    onIndex(at);
  }, [width, data.length, onIndex]);
  const scrolled = useWebScrollEnd(settle);
  useEffect(() => { if (width) list.current?.scrollToIndex({ index: shown.current, animated: false }); }, [width]);
  const layout = useCallback((_: unknown, at: number) => ({ length: width, offset: width * at, index: at }), [width]);
  return (
    <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => {
      const next = event.nativeEvent.layout;
      if (width && (next.width !== width || next.height !== size.height)) resized.current = Date.now();
      setSize({ width: next.width, height: next.height });
    }}>
      {width > 0 && <FlatList ref={list} data={data} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
        keyExtractor={keyOf} getItemLayout={layout} initialScrollIndex={Math.min(index, data.length - 1)}
        initialNumToRender={1} maxToRenderPerBatch={2} windowSize={3} extraData={size}
        onMomentumScrollEnd={settle} onScroll={scrolled} scrollEventThrottle={32} onTouchMove={() => { resized.current = 0; }} onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => <View style={{ width: size.width, height: size.height, direction: 'rtl' }}>{renderPage(item, size)}</View>} />}
    </View>
  );
}
