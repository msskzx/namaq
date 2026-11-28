import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MessagesSquare } from 'lucide-react-native';
import { CardWithRow } from '@/ui/Card';
import { sourcesOf } from '@/ui/SourceLine';
import { citeSource, uniqueSources } from '@shared/quiz/sources';
import { storiesOfHadith } from '@/lib/links';
import { People } from '@/components/battles/BattleParts';
import { StoryLinkRow } from '@/components/stories/StoryParts';
import { rangeName, reportHadith } from '@shared/stories/story';
import { findHadith, lastLink, placeOf, type SahihHadith, type SahihIndex } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { SharedCard, ShareHead } from '@/ui/CardShare';
import Button, { Row } from '@/ui/Button';
import LoadingDots from '@/ui/LoadingDots';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { openAyahPage, toTab, openBab, openKitab } from '@/lib/ways';
import { SAHIH, fortyOf, isSahihSlug, rememberOpened, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihHadithView, opening } from '@/components/Sahih';
import HadithBooks from '@/components/HadithBooks';
import { recordedIn, type BookBox } from '@shared/hadith';
import { useWebScrollEnd } from '@/lib/hooks/useWebScrollEnd';

const openBox = (box: BookBox) => {
  const [book, n] = box.key.split(':');
  if (isSahihSlug(book) && n) router.push({ pathname: '/hadith-sahih', params: { book, n } });
};

function SahihPage({ book, hadith, width, palette }: { book: SahihIndex; hadith: SahihHadith; width: number; palette: Palette }) {
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const place = placeOf(book, hadith.n);
  const forty = fortyOf(book.slug, hadith.n);
  const numbers = [hadith.n, ...(hadith.also ?? [])].map(each => num(each)).join(' - ');
  return (
    <ScrollView style={{ width, direction: 'rtl' }} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
      {place && <Button variant="plain" label={`${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}`} onPress={() => (place.bab?.title ? openBab(book.slug, place.kitab.n, hadith.bab) : openKitab(book.slug, place.kitab.n))} />}
      {book.headingsBy === 'nawawi' && place?.bab?.title && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right', marginTop: -10 }}>تبويب النووي</Text>}
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{`${book.title} ${numbers}`}</Text>
      <SharedCard palette={palette} shareLabel={`شارك ${book.title} ${num(hadith.n)}`}
        shareHead={<ShareHead title={`${book.title} ${numbers}`} sub={place ? `${place.kitab.title}${place.bab?.title ? ` › ${place.bab.title}` : ''}` : undefined} palette={palette} />}>
        <SahihHadithView book={book} hadith={hadith} palette={palette} />
      </SharedCard>
      <InHadith book={book.slug} n={hadith.n} palette={palette} />
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

function InHadith({ book, n, palette }: { book: string; n: number; palette: Palette }) {
  const stories = storiesOfHadith(book, n);
  if (!stories.length) return null;
  return (
    <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 17, fontWeight: '700', textAlign: 'right' }}>في هذا الحديث</Text>
      {stories.map(story => (
        <CardWithRow key={story.slug} palette={palette} pad={[10, 14]} gap={8} source={sourcesOf(uniqueSources([
          ...story.reports.filter(report => reportHadith(report)?.n === n && reportHadith(report)?.book === book).map(report => citeSource({ text: '', cite: report.cite, url: report.url })),
          ...story.ayat.flatMap(ayat => ayat.refs).map(citeSource)]))}>
          <People people={story.people} palette={palette} />
          <StoryLinkRow story={story} palette={palette} />
          {story.ayat.map(ayat => (
            <Button key={ayat.from + ayat.label} variant="plain" Icon={ChevronLeft} label={`${rangeName(ayat.from, ayat.to)} · ${ayat.label}`}
              onPress={() => openAyahPage(ayat.from)} />
          ))}
        </CardWithRow>
      ))}
    </View>
  );
}

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
  useEffect(() => { if (book && hadith) rememberOpened(book.slug, hadith.n, lastLink(hadith.routes[0]), opening(hadith)); }, [book, hadith]);
  const [width, setWidth] = useState(0);
  const list = useRef<FlatList<SahihHadith>>(null);
  const settle = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!width) return;
    const to = Math.round(Math.abs(event.nativeEvent.contentOffset.x) / width);
    if (to >= 0 && to < all.length) setIndex(to);
  }, [width, all.length]);
  const scrolled = useWebScrollEnd(settle);
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
