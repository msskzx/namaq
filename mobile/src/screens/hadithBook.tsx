import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { searchForty, type FortyEntry } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { FORTY } from '@/lib/hadith';
import { SAHIH, isSahihSlug, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihKitabList, SahihShape } from '@/components/Sahih';
import Card from '@/ui/Card';
import Empty from '@/ui/Empty';
import { kitabsHolding } from '@shared/sahih';
import { FortyCard, openBab, openKitab } from './hadith';

export default function HadithBookScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { book: slug = '' } = useLocalSearchParams<{ book?: string }>();
  const sahih = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const { state } = useSahihText(sahih?.slug);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  const [query, setQuery] = useState('');
  const [, setSeen] = useState(0);
  useFocusEffect(useCallback(() => { setSeen(was => was + 1); }, []));
  const typed = useDeferredValue(query.trim());
  const found = useMemo(() => (sahih && typed ? kitabsHolding(sahih, typed) : undefined), [sahih, typed]);
  const forty = useMemo(() => (sahih || !typed ? FORTY.entries : /[ء-ي]/.test(typed) ? searchForty(FORTY.entries, typed) : []), [sahih, typed]);
  const title = sahih?.title ?? FORTY.books.nawawi.title;
  const card = (entry: FortyEntry) => <FortyCard key={entry.n} entry={entry} palette={palette} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {sahih
        ? <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: `ابحث في كتب ${sahih.title} وأبوابه`, label: `ابحث في ${sahih.title}` }} />
        : <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأربعين النووية', label: 'ابحث في الأربعين النووية' }} />}
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {!sahih && <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{title}</Text>}
        {sahih ? <>
          {!found && <>
            <Card palette={palette}><SahihShape book={sahih} onOpenKitab={kitab => openKitab(sahih.slug, kitab)} palette={palette} /></Card>
            {sahih.headingsBy === 'nawawi' && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>تراجم الأبواب من وضع النووي، كما في طبعة عبد الباقي.</Text>}
            {state !== 'on' && <SahihDownload slug={sahih.slug} state={state} palette={palette} />}
          </>}
          {found && !found.size && <Empty text="لا كتاب ولا باب فيه هذه الكلمات" palette={palette} />}
          <SahihKitabList book={sahih} found={found} here onOpen={kitab => openKitab(sahih.slug, kitab)} onOpenBab={(kitab, bab) => openBab(sahih.slug, kitab, bab)} palette={palette}
            source={[{ line: sahih.title, quotes: [{ text: `${sahih.title}، ${sahih.edition}` }], links: [{ label: 'الكتاب في المكتبة الشاملة', url: `https://shamela.ws/book/${sahih.shamela}` }] }]} />
        </> : <>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: -6 }}>
            {`يحيى بن شرف النووي (ت ${num(676)}هـ)`}
          </Text>
          {forty.length ? forty.map(card) : <Empty text="لا حديث فيه هذه الكلمات" palette={palette} />}
        </>}
      </ScrollView>
    </View>
  );
}
