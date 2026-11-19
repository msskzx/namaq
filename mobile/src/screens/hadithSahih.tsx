import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MessagesSquare } from 'lucide-react-native';
import { findHadith, placeOf, type SahihHadith, type SahihIndex } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Button, { Row } from '@/ui/Button';
import LoadingDots from '@/ui/LoadingDots';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { SAHIH, fortyOf, isSahihSlug, rememberOpened, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihHadithView } from '@/components/Sahih';
import HadithBooks from '@/components/HadithBooks';
import { recordedIn, type BookBox } from '@shared/hadith';
import { openKitab, openSahih } from './hadith';

/** A box of «من أخرجه» opens that hadith's page when it is in the Sahihayn. */
const openBox = (box: BookBox) => {
  const [book, n] = box.key.split(':');
  if (isSahihSlug(book) && n) openSahih(book, Number(n));
};

/** One hadith's page: where it sits (kitab › bab, a tap opens the kitab), its words and chain, and the ones of the Forty that hold it. */
function SahihPage({ book, hadith, width, palette }: { book: SahihIndex; hadith: SahihHadith; width: number; palette: Palette }) {
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const place = placeOf(book, hadith.n);
  const forty = fortyOf(book.slug, hadith.n);
  const numbers = [hadith.n, ...(hadith.also ?? [])].map(each => num(each)).join(' - ');
  return (
    <ScrollView style={{ width, direction: 'rtl' }} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
      {place && <Button variant="plain" label={`${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}`} onPress={() => openKitab(book.slug, place.kitab.n)} />}
      {book.headingsBy === 'nawawi' && place?.bab?.title && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right', marginTop: -10 }}>تبويب النووي</Text>}
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{`${book.title} ${numbers}`}</Text>
      <Card palette={palette}><SahihHadithView book={book} hadith={hadith} palette={palette} /></Card>
      {forty.length > 0 && (
        <View style={{ gap: 8 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>من أخرجه</Text>
          {forty.map(entry => <HadithBooks key={entry.n} top={`${book.title} ${num(hadith.n)}`} boxes={recordedIn(entry)} palette={palette} onOpen={box => openBox(box)} />)}
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>من الأربعين النووية</Text>
          <Row>{forty.map(entry => <Button key={entry.n} Icon={MessagesSquare} label={entry.heading} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />)}</Row>
        </View>
      )}
    </ScrollView>
  );
}

/**
 * One hadith of a Sahih (owner's sketch, 2026-11-19): its place, the narrator, its words large, its chain drawn or read whole,
 * Muslim's other routes folded, the ones of the Forty that hold it. A swipe brings the hadith before or after it, across
 * kitab ends, following the finger (owner: swipes, not step buttons, on the phone).
 */
export default function HadithSahihScreen() {
  const palette = usePalette();
  const { book: slug = '', n: at = '' } = useLocalSearchParams<{ book?: string; n?: string }>();
  const book = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const { state, text } = useSahihText(book?.slug);
  const all = useMemo(() => text?.kitabs.flatMap(file => file.hadith) ?? [], [text]);
  const start = useMemo(() => {
    const found = text ? findHadith(text, Number(at)) : undefined;
    return found ? all.indexOf(found.hadith) : -1;
  }, [text, all, at]);
  const [index, setIndex] = useState(-1);
  const shown = index >= 0 ? index : start;
  const hadith = all[shown];
  useEffect(() => { if (book && hadith) rememberOpened(book.slug, hadith.n); }, [book, hadith]);
  const [width, setWidth] = useState(0);
  const list = useRef<FlatList<SahihHadith>>(null);
  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const to = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (to >= 0 && to < all.length) setIndex(to);
  }, [width, all.length]);
  // The web build snaps with CSS and sends no momentum event, so it settles when scrolling stops.
  const quiet = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const scrolled = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (Platform.OS !== 'web') return;
    const { nativeEvent } = event;
    clearTimeout(quiet.current);
    quiet.current = setTimeout(() => settle({ nativeEvent } as NativeSyntheticEvent<NativeScrollEvent>), 150);
  }, [settle]);
  const layout = useCallback((_: unknown, i: number) => ({ length: width, offset: width * i, index: i }), [width]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  const title = book ? `${book.title} ${num(hadith?.n ?? Number(at))}` : undefined;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} title={title} hideOnScroll />
      {!book ? null
        : state !== 'on' ? <View style={{ padding: 16 }}><SahihDownload slug={book.slug} state={state} palette={palette} /></View>
        : !text ? <LoadingDots fill />
        : start < 0 ? <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'center', padding: 16 }}>{`ليس في ${book.title} المطبوع حديث بهذا الرقم.`}</Text>
        : <View style={{ flex: 1, direction: 'ltr' }} onLayout={event => setWidth(event.nativeEvent.layout.width)}>
          {width > 0 && <FlatList ref={list} data={all} horizontal inverted pagingEnabled showsHorizontalScrollIndicator={false}
            keyExtractor={item => String(item.n)} getItemLayout={layout} initialScrollIndex={start}
            initialNumToRender={1} maxToRenderPerBatch={2} windowSize={3}
            onMomentumScrollEnd={settle} onScroll={scrolled} scrollEventThrottle={32} onScrollToIndexFailed={() => {}}
            renderItem={({ item }) => <SahihPage book={book} hadith={item} width={width} palette={palette} />} />}
        </View>}
    </View>
  );
}
