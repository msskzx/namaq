import { useCallback, useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { fromCompanion, sayingStart, searchForty, type FortyEntry } from '@shared/hadith';
import { placeOf, searchSahih, type SahihHit, type SahihSlug } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card, { CardWithRow } from '@/ui/Card';
import Chip from '@/ui/Chip';
import Tabs from '@/ui/Tabs';
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
import { SahihDownload, SahihShape, opening } from '@/components/Sahih';
import OpenButton from '@/ui/OpenButton';
import QuoteBar from '@/ui/QuoteBar';
import TapRow from '@/ui/TapRow';
import NumberGrid from '@/ui/NumberGrid';

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
export const openBab = (book: SahihSlug, kitab: number, bab: number) => router.push({ pathname: '/hadith-kitab', params: { book, kitab: String(kitab), bab: String(bab) } });
export const openSahih = (book: SahihSlug, n: number) => router.push({ pathname: '/hadith-sahih', params: { book, n: String(n) } });

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

const FORTY_COUNT = FORTY.entries.length;

type Found = 'hadith' | 'babs' | 'forty';

const SEARCH_STEP = 40;

function Hit({ hit, line, palette }: { hit: SahihHit; line: string; palette: Palette }) {
  const book = SAHIH[hit.book];
  const place = placeOf(book, hit.n);
  return (
    <Card palette={palette} pad={[10, 14]} gap={4} accessibilityRole="link" onPress={() => (hit.n ? openSahih(hit.book, hit.n) : hit.bab !== undefined ? openBab(hit.book, hit.kitab, hit.bab) : openKitab(hit.book, hit.kitab))}>
      <Text numberOfLines={1} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{hit.n ? `${book.title} ${num(hit.n)}، ${place?.kitab.title ?? ''}` : `${book.title}، ${book.kitabs.find(each => each.n === hit.kitab)?.title ?? ''}`}</Text>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{line}</Text>
    </Card>
  );
}

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
  const missing = SAHIH_SLUGS.filter(slug => bookState(slug) !== 'on');
  const forty = useMemo(() => (/[ء-ي]/.test(typed) ? searchForty(FORTY.entries, typed) : []), [typed]);
  const [picked, setPicked] = useState<{ typed: string; key: Found } | null>(null);
  const lists = found ? ([
    { key: 'hadith', label: missing.length === SAHIH_SLUGS.length ? 'الأحاديث' : `الأحاديث ${num(found.hadith.length)}`, size: found.hadith.length },
    { key: 'babs', label: `الأبواب ${num(found.babs.length)}`, size: found.babs.length },
    { key: 'forty', label: `الأربعون ${num(forty.length)}`, size: forty.length },
  ] as const).filter(list => list.key === 'hadith' || list.size) : [];
  const list: Found = (picked?.typed === typed ? lists.find(each => each.key === picked.key)?.key : undefined)
    ?? (reading ? 'hadith' : lists.find(each => each.size)?.key ?? 'hadith');
  const [drawn, setDrawn] = useState({ typed: '', list, count: SEARCH_STEP });
  const count = drawn.typed === typed && drawn.list === list ? drawn.count : SEARCH_STEP;
  const [, setSeen] = useState(0);
  const read = lastRead();
  useFocusEffect(useCallback(() => { setSeen(was => was + 1); }, []));
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll(event);
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (found && contentOffset.y + layoutMeasurement.height > contentSize.height - 800) setDrawn({ typed, list, count: count + SEARCH_STEP });
  };
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في الأبواب والأحاديث', label: 'ابحث في الصحيحين' }} />
      <ScrollView ref={scroll} onScroll={scrolled} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        {found ? <>
          {lists.length > 1 && <Tabs label="نتائج البحث" options={lists.map(({ key, label }) => ({ key, label }))} value={list} onChange={key => setPicked({ typed, key })} palette={palette} fill />}
          {list === 'babs' && found.babs.slice(0, count).map(hit => {
            const kitab = SAHIH[hit.book].kitabs.find(each => each.n === hit.kitab);
            return <Hit key={`b-${hit.book}-${hit.kitab}-${hit.bab}`} hit={hit} line={kitab?.babs[hit.bab ?? 0]?.title ?? ''} palette={palette} />;
          })}
          {list === 'forty' && forty.slice(0, count).map(entry => <FortyCard key={entry.n} entry={entry} palette={palette} onPress={() => router.push({ pathname: '/hadith-forty', params: { n: String(entry.n) } })} />)}
          {list === 'hadith' && <>
            {found.hadith.slice(0, count).map(hit => {
              const hadith = texts[hit.book] && findHadith(texts[hit.book]!, hit.n)?.hadith;
              return hadith ? <Hit key={`h-${hit.book}-${hit.n}`} hit={hit} line={opening(hadith)} palette={palette} /> : null;
            })}
            {reading ? <LoadingDots label="يقرأ نص الصحيحين" />
              : !found.hadith.length && missing.length < SAHIH_SLUGS.length && <Empty text="لا حديث فيه هذه الكلمات" palette={palette} />}
            {missing.map(slug => <SahihDownload key={slug} slug={slug} state={bookState(slug)} palette={palette} />)}
          </>}
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
