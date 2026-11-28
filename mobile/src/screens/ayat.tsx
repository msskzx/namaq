import { useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { FlatList, View } from 'react-native';
import { ayatFound, SURAHS, type SurahRow } from '@shared/quran/ayatList';
import TopBar from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import { toTab } from '@/lib/ways';
import { useAfter } from '@/lib/hooks/useAfter';
import { warmSearch } from '@/lib/searchAll';
import { AyahListRow, SurahListRow } from '@/components/AyahListRow';

type Row = { kind: 'surah'; surah: SurahRow } | { kind: 'ayah'; key: string };

const openSurah = (surah: number) => toTab({ pathname: '/ayat-surah', params: { surah: String(surah) } });

export default function AyatScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const list = useRef<ComponentRef<typeof FlatList<Row>>>(null);
  const top = useRef(0);
  useAfter(400, warmSearch);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  useTabRetap('ayat', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setQuery(''); });
  const rows = useMemo<Row[]>(() => {
    if (!typed) return SURAHS.map(surah => ({ kind: 'surah', surah }));
    const found = ayatFound(typed);
    return [...found.surahs.map(surah => ({ kind: 'surah' as const, surah })), ...found.ayat.map(key => ({ kind: 'ayah' as const, key }))];
  }, [typed]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الآيات', label: 'ابحث عن سورة أو آية' }} />
      <FlatList ref={list} data={rows} keyExtractor={row => (row.kind === 'surah' ? `s${row.surah.number}` : row.key)} initialNumToRender={16} windowSize={7}
        onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: bottom }}
        ListEmptyComponent={<Empty text="لا توجد نتيجة مطابقة." palette={palette} />}
        renderItem={({ item }) => (item.kind === 'surah'
          ? <SurahListRow surah={item.surah} onOpen={() => openSurah(item.surah.number)} palette={palette} />
          : <AyahListRow ayahKey={item.key} named palette={palette} />)} />
    </View>
  );
}
