import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import type { FortyEntry } from '@shared/hadith';
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
import { ADDED_TITLE, FortyCard, openKitab } from './hadith';

/**
 * A book's page. A Sahih: its shape (its kitabs as bars, a touch opening one), a search in the top bar over its kitabs and
 * bab headings, and its kitabs on a line, each with a bar as long as its hadith (owner, 2026-11-23: sketch hadith-design).
 * al-Nawawi's Forty: his hadith in his order; the eight Ibn Rajab adds (his «الأحاديث المزيدة على ما ذكره الشيخ», 43–50): his.
 */
export default function HadithBookScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { book: slug = '' } = useLocalSearchParams<{ book?: string }>();
  const sahih = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const { state } = useSahihText(sahih?.slug);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  const added = slug === 'added';
  const [query, setQuery] = useState('');
  // The mark and «وقفت هنا» read the last hadith again each time the page comes back into view.
  const [, setSeen] = useState(0);
  useFocusEffect(useCallback(() => { setSeen(was => was + 1); }, []));
  const typed = useDeferredValue(query.trim());
  const found = useMemo(() => (sahih && typed ? kitabsHolding(sahih, typed) : undefined), [sahih, typed]);
  const title = sahih?.title ?? (added ? ADDED_TITLE : FORTY.books.nawawi.title);
  const card = (entry: FortyEntry) => <FortyCard key={entry.n} entry={entry} palette={palette} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {sahih
        ? <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: `ابحث في كتب ${sahih.title} وأبوابه`, label: `ابحث في ${sahih.title}` }} />
        : <TopBar back={back} title={title} hideOnScroll />}
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {!sahih && <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{title}</Text>}
        {sahih ? <>
          {!found && <>
            <Card palette={palette}><SahihShape book={sahih} onOpenKitab={kitab => openKitab(sahih.slug, kitab)} palette={palette} /></Card>
            {sahih.headingsBy === 'nawawi' && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>تراجم الأبواب من وضع النووي، كما في طبعة عبد الباقي.</Text>}
            {state !== 'on' && <SahihDownload slug={sahih.slug} state={state} palette={palette} />}
          </>}
          {found && !found.size && <Empty text="لا كتاب ولا باب فيه هذه الكلمات" palette={palette} />}
          <SahihKitabList book={sahih} found={found} here onOpen={kitab => openKitab(sahih.slug, kitab)} palette={palette}
            source={[{ line: sahih.title, quotes: [{ text: `${sahih.title}، ${sahih.edition}` }], links: [{ label: 'الكتاب في المكتبة الشاملة', url: `https://shamela.ws/book/${sahih.shamela}` }] }]} />
        </> : <>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: -6 }}>
            {added ? `ابن رجب الحنبلي (ت ${num(795)}هـ)، في ${FORTY.books.ibnrajab.title}` : `يحيى بن شرف النووي (ت ${num(676)}هـ)`}
          </Text>
          {FORTY.entries.filter(entry => (added ? entry.source === 'ibnrajab' : !entry.source)).map(card)}
        </>}
      </ScrollView>
    </View>
  );
}
