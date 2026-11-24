import { useCallback, useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { fromCompanion, sayingStart, type FortyEntry } from '@shared/hadith';
import { placeOf, searchSahih, type SahihHit, type SahihSlug } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';
import LoadingDots from '@/ui/LoadingDots';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { FORTY } from '@/lib/hadith';
import { SAHIH, SAHIH_SLUGS, lastRead, useSahihTexts, type LastRead } from '@/lib/sahih';
import { bookState, useBooks } from '@/lib/books';
import { findHadith } from '@shared/sahih';
import { SahihShape, opening } from '@/components/Sahih';
import { CardWithRow } from '@/ui/Card';
import OpenButton from '@/ui/OpenButton';
import QuoteBar from '@/ui/QuoteBar';
import TapRow from '@/ui/TapRow';
import NumberGrid from '@/ui/NumberGrid';

/** One of the Forty in a list: his number, the Companion, the opening of his text and the books he names. */
export function FortyCard({ entry, palette, onPress }: { entry: FortyEntry; palette: Palette; onPress: () => void }) {
  return (
    <Card palette={palette} pad={[10, 14]} gap={4} accessibilityRole="link" accessibilityLabel={`${entry.heading}، ${fromCompanion(entry.companion)}`} onPress={onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Text style={{ color: palette.accent, fontSize: 15 }}>{entry.heading}</Text>
        <Text style={{ flexShrink: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{entry.companion}</Text>
      </View>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{sayingStart(entry.text)}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {entry.named.map(book => <Chip key={book} label={book} on={false} small role="text" palette={palette} />)}
      </View>
    </Card>
  );
}

export const openBook = (book: SahihSlug | 'forty') => router.push({ pathname: '/hadith-book', params: { book } });
export const openKitab = (book: SahihSlug, kitab: number) => router.push({ pathname: '/hadith-kitab', params: { book, kitab: String(kitab) } });
export const openSahih = (book: SahihSlug, n: number) => router.push({ pathname: '/hadith-sahih', params: { book, n: String(n) } });

/** The hadith read last, its narrator and the opening of its words, with «افتح» back to it (owner, 2026-11-23: sketch hadith-design). */
function ContinueCard({ read, palette }: { read: LastRead; palette: Palette }) {
  const book = SAHIH[read.slug];
  const kitab = placeOf(book, read.n)?.kitab;
  const name = `${book.title} ${num(read.n)}`;
  return (
    <CardWithRow palette={palette} gap={6} lead={<OpenButton label={`افتح ${name}`} onPress={() => openSahih(read.slug, read.n)} />}
      source={[{ line: `${name}${kitab ? `، ${kitab.title}` : ''}`, quotes: [{ text: `${book.title}، ${book.edition}` }], links: [{ label: 'الكتاب في المكتبة الشاملة', url: `https://shamela.ws/book/${book.shamela}` }] }]}>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>تابع من حيث وقفت</Text>
      <QuoteBar by={read.from ? `${read.from}:` : undefined} pieces={[{ text: read.words.trim() }]} lines={3} palette={palette} />
    </CardWithRow>
  );
}

/** A Forty on the tab: its name and author, then its numbers in rings, each opening its hadith. */
function FortyShape({ title, by, numbers, onOpenBook, tone, palette }: { title: string; by: string; numbers: number[]; onOpenBook: () => void; tone?: string; palette: Palette }) {
  return (
    <Card palette={palette} gap={12}>
      <TapRow role="link" label={title} onPress={onOpenBook}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 24, textAlign: 'right' }}>{title}</Text>
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{by}</Text>
        </View>
      </TapRow>
      <NumberGrid numbers={numbers} tone={tone} label={n => FORTY.entries.find(entry => entry.n === n)?.heading ?? num(n)} palette={palette}
        onOpen={n => router.push({ pathname: '/hadith-forty', params: { n: String(n) } })} />
    </Card>
  );
}

/** al-Nawawi's Forty: his own forty-two (Ibn Rajab's eight are out of the app for now, mobile/src/lib/hadith.ts). */
const FORTY_COUNT = FORTY.entries.length;

/** Hits drawn at a time; more come as the list nears its end, so every hit shows without drawing thousands at once. */
const SEARCH_STEP = 40;

/** A search hit: the bab heading (or the hadith's opening) with its book and kitab. */
function Hit({ hit, line, palette }: { hit: SahihHit; line: string; palette: Palette }) {
  const book = SAHIH[hit.book];
  const place = placeOf(book, hit.n);
  return (
    <Card palette={palette} pad={[10, 14]} gap={4} accessibilityRole="link" onPress={() => (hit.n ? openSahih(hit.book, hit.n) : openKitab(hit.book, hit.kitab))}>
      <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{hit.n ? `${book.title} ${num(hit.n)}، ${place?.kitab.title ?? ''}` : `${book.title}، ${book.kitabs.find(each => each.n === hit.kitab)?.title ?? ''}`}</Text>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{line}</Text>
    </Card>
  );
}

/**
 * The hadith tab: one search over both Sahihs' babs and hadith, in the top bar with no page title, as on every tab (owner,
 * 2026-11-22); then «تابع» on the hadith read last, each Sahih's shape (its kitabs as bars, a touch opening one), and the
 * Forty and Ibn Rajab's eight as numbers (owner, 2026-11-23: sketch hadith-design).
 */
export default function HadithScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('hadith', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  useBooks();
  const { texts, reading } = useSahihTexts(!!typed);
  const found = useMemo(() => (typed ? searchSahih(SAHIH_SLUGS.map(slug => ({ index: SAHIH[slug], text: texts[slug] })), typed, Infinity) : null), [typed, texts]);
  const [drawn, setDrawn] = useState({ typed: '', count: SEARCH_STEP });
  const count = drawn.typed === typed ? drawn.count : SEARCH_STEP;
  const missing = SAHIH_SLUGS.filter(slug => bookState(slug) !== 'on');
  // «تابع» and the mark on each book read the last hadith again each time the tab comes back into view.
  const [, setSeen] = useState(0);
  const read = lastRead();
  useFocusEffect(useCallback(() => { setSeen(was => was + 1); }, []));
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll(event);
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (found && contentOffset.y + layoutMeasurement.height > contentSize.height - 800) setDrawn({ typed, count: count + SEARCH_STEP });
  };
  const babs = found ? found.babs.slice(0, count) : [];
  const hadithHits = found ? found.hadith.slice(0, Math.max(0, count - found.babs.length)) : [];
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأبواب والأحاديث', label: 'ابحث في الصحيحين' }} />
      <ScrollView ref={scroll} onScroll={scrolled} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {found ? <>
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>في الأبواب</Text>
          {found.babs.length ? babs.map(hit => {
            const kitab = SAHIH[hit.book].kitabs.find(each => each.n === hit.kitab);
            return <Hit key={`b-${hit.book}-${hit.kitab}-${hit.bab}`} hit={hit} line={kitab?.babs[hit.bab ?? 0]?.title ?? ''} palette={palette} />;
          }) : <Empty text="لا باب فيه هذه الكلمات" palette={palette} />}
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>في الأحاديث</Text>
          {hadithHits.map(hit => {
            const hadith = texts[hit.book] && findHadith(texts[hit.book]!, hit.n)?.hadith;
            return hadith ? <Hit key={`h-${hit.book}-${hit.n}`} hit={hit} line={opening(hadith)} palette={palette} /> : null;
          })}
          {reading ? <LoadingDots label="يقرأ نص الصحيحين" />
            : !found.hadith.length && <Empty text={missing.length === SAHIH_SLUGS.length ? 'نزّل الصحيحين من المكتبة ليبحث في نص الأحاديث' : 'لا حديث فيه هذه الكلمات'} palette={palette} />}
          {missing.length > 0 && missing.length < SAHIH_SLUGS.length && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`نزّل ${SAHIH[missing[0]].title} من المكتبة ليبحث فيه أيضًا`}</Text>}
        </> : <>
          {read && <ContinueCard read={read} palette={palette} />}
          {SAHIH_SLUGS.map(slug => (
            <Card key={slug} palette={palette}>
              <SahihShape book={SAHIH[slug]} onOpenBook={() => openBook(slug)} onOpenKitab={kitab => openKitab(slug, kitab)} palette={palette} />
            </Card>
          ))}
          <FortyShape title={FORTY.books.nawawi.title} by={`يحيى بن شرف النووي (ت ${num(676)}هـ)، ${num(FORTY_COUNT)} حديثًا`}
            numbers={FORTY.entries.map(entry => entry.n)} onOpenBook={() => openBook('forty')} palette={palette} />
        </>}
      </ScrollView>
    </View>
  );
}
