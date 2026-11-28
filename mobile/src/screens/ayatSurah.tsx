import { useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, View } from 'react-native';
import { ayatCount } from '@shared/quran/arabicNumber';
import { SURAHS, surahAyat, surahAyatFound, type SurahRow } from '@shared/quran/ayatList';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Empty from '@/ui/Empty';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { usePalette } from '@/lib/theme';
import { back } from '@/lib/ways';
import { surahName } from '@shared/quran/surahNames';
import { useAfter } from '@/lib/hooks/useAfter';
import { warmSearch } from '@/lib/searchAll';
import { AyahListRow } from '@/components/AyahListRow';

export default function AyatSurahScreen() {
  const palette = usePalette();
  const asked = Number(useLocalSearchParams<{ surah?: string }>().surah);
  const surah = SURAHS.find(row => row.number === asked);
  if (surah) return <SurahAyat surah={surah} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} />
      <Empty text="لا توجد هذه السورة." palette={palette} />
    </View>
  );
}

function SurahAyat({ surah }: { surah: SurahRow }) {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  useAfter(400, warmSearch);
  const name = surahName(surah.number);
  const list = useRef<ComponentRef<typeof FlatList<string>>>(null);
  const top = useRef(0);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  useTabRetap('ayat-surah', () => { if (top.current > 4) list.current?.scrollToOffset({ offset: 0, animated: true }); else setQuery(''); });
  const keys = useMemo(() => (typed ? surahAyatFound(surah.number, typed) : surahAyat(surah.number).map(ayah => ayah.key)), [surah.number, typed]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: `ابحث في آيات ${name}`, label: `ابحث في آيات سورة ${name}` }} />
      <FlatList ref={list} data={keys} keyExtractor={key => key} initialNumToRender={10} windowSize={7}
        onScroll={event => { top.current = event.nativeEvent.contentOffset.y; shrink(event); }} scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ paddingBottom: bottom }}
        ListHeaderComponent={<View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22 }}>{name}</Text>
          <Text style={{ color: palette.muted, fontSize: 14 }}>{ayatCount(surah.numberOfAyat)}</Text>
        </View>}
        ListEmptyComponent={<Empty text="لا توجد آية مطابقة." palette={palette} />}
        renderItem={({ item }) => <AyahListRow ayahKey={item} palette={palette} />} />
    </View>
  );
}
