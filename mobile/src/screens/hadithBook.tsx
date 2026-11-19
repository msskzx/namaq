import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import type { FortyEntry } from '@shared/hadith';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Reference from '@/ui/Reference';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { FORTY } from '@/lib/hadith';
import { SAHIH, isSahihSlug, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihKitabList } from '@/components/Sahih';
import { FortyCard, openKitab } from './hadith';

/**
 * A book's kitabs (owner's sketch, 2026-11-19): for a Sahih each kitab a row in one card, its number, its name and its
 * hadith numbers, opening its babs and hadith; for al-Nawawi's Forty, his hadith in his order.
 */
export default function HadithBookScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { book: slug = '' } = useLocalSearchParams<{ book?: string }>();
  const sahih = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const { state } = useSahihText(sahih?.slug);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  const title = sahih?.title ?? FORTY.books.nawawi.title;
  const card = (entry: FortyEntry) => <FortyCard key={entry.n} entry={entry} palette={palette} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={title} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{title}</Text>
        {sahih ? <>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: -6 }}>{`${sahih.author} (ت ${num(sahih.died)}هـ)`}</Text>
          {sahih.headingsBy === 'nawawi' && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>تراجم الأبواب من وضع النووي، كما في طبعة عبد الباقي.</Text>}
          {state !== 'on' && <SahihDownload slug={sahih.slug} state={state} palette={palette} />}
          <SahihKitabList book={sahih} onOpen={kitab => openKitab(sahih.slug, kitab)} palette={palette} />
          <Reference title={sahih.title} quotes={[{ text: `${sahih.title}، ${sahih.edition}` }]} links={[{ label: 'الكتاب في المكتبة الشاملة', url: `https://shamela.ws/book/${sahih.shamela}` }]} palette={palette} />
        </> : <>
          {FORTY.entries.filter(entry => !entry.source).map(card)}
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, textAlign: 'right', marginTop: 8 }}>ما زاده ابن رجب</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: -8 }}>{FORTY.books.ibnrajab.title}</Text>
          {FORTY.entries.filter(entry => entry.source === 'ibnrajab').map(card)}
        </>}
      </ScrollView>
    </View>
  );
}
