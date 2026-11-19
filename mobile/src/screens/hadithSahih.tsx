import { useEffect, useRef, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight, MessagesSquare } from 'lucide-react-native';
import { findHadith, placeOf } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Button, { Row } from '@/ui/Button';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { SAHIH, fortyOf, isSahihSlug, rememberOpened, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihHadithView } from '@/components/Sahih';
import { openKitab } from './hadith';

/**
 * One hadith of a Sahih (owner's sketch, 2026-11-19): where it sits (kitab › bab, a tap opens the kitab), the narrator it
 * comes from, its words large, its chain drawn or read whole, Muslim's other routes folded, the ones of the Forty that
 * hold it, and the hadith before and after it.
 */
export default function HadithSahihScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const { book: slug = '', n: at = '' } = useLocalSearchParams<{ book?: string; n?: string }>();
  const book = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const n = Number(at);
  const { state, text } = useSahihText(book?.slug);
  const found = text ? findHadith(text, n) : undefined;
  const place = book ? placeOf(book, n) : undefined;
  useEffect(() => { if (book && found) rememberOpened(book.slug, found.hadith.n); }, [book, found]);
  useEffect(() => { scroll.current?.scrollTo({ y: 0, animated: false }); }, [n]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!book || !place) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const all = found ? found.file.hadith : [];
  const i = found ? all.indexOf(found.hadith) : -1;
  // The hadith before and after: across a kitab's end, the next kitab's first.
  const files = text?.kitabs ?? [];
  const f = found ? files.indexOf(found.file) : -1;
  const before = i > 0 ? all[i - 1] : files[f - 1]?.hadith.at(-1);
  const after = i >= 0 && i < all.length - 1 ? all[i + 1] : files[f + 1]?.hadith[0];
  const go = (to: number) => router.setParams({ n: String(to) });
  const forty = found ? fortyOf(book.slug, found.hadith.n) : [];
  const numbers = found ? [found.hadith.n, ...(found.hadith.also ?? [])].map(each => num(each)).join(' - ') : num(n);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={`${book.title} ${num(n)}`} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        <Button variant="plain" label={`${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}`} onPress={() => openKitab(book.slug, place.kitab.n)} />
        {book.headingsBy === 'nawawi' && place.bab?.title && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right', marginTop: -10 }}>تبويب النووي</Text>}
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{`${book.title} ${numbers}`}</Text>
        {state !== 'on' && <SahihDownload slug={book.slug} state={state} palette={palette} />}
        {found && <Card palette={palette}><SahihHadithView book={book} hadith={found.hadith} palette={palette} /></Card>}
        {forty.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>من الأربعين النووية</Text>
            <Row>{forty.map(entry => <Button key={entry.n} Icon={MessagesSquare} label={entry.heading} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />)}</Row>
          </View>
        )}
        {found && (
          <Row>
            {before && <Button Icon={ChevronRight} label={`السابق ${num(before.n)}`} onPress={() => go(before.n)} />}
            {after && <Button Icon={ChevronLeft} label={`التالي ${num(after.n)}`} onPress={() => go(after.n)} />}
          </Row>
        )}
      </ScrollView>
    </View>
  );
}
