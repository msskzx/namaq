import { useDeferredValue, useMemo, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { fromCompanion, sayingStart, type FortyEntry } from '@shared/hadith';
import { placeOf, searchSahih, type SahihHit, type SahihSlug } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { useTabRetap } from '@/lib/tabRetap';
import { FORTY } from '@/lib/hadith';
import { SAHIH, SAHIH_SLUGS, lastOpened, useSahihTexts } from '@/lib/sahih';
import { findHadith } from '@shared/sahih';
import { opening } from '@/components/Sahih';

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

/** A book on the tab: its title, author and size; the card opens its kitabs, «تابع» the last hadith read in it. */
function BookCard({ title, by, size, last, onOpen, onContinue, palette }: {
  title: string; by: string; size: string; last?: string; onOpen: () => void; onContinue?: () => void; palette: Palette;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Card palette={palette} gap={4} accessibilityRole="link" accessibilityLabel={title} onPress={onOpen}>
        <Text style={{ color: palette.ink, fontSize: 20, textAlign: 'right' }}>{title}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{by}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{size}</Text>
      </Card>
      {onContinue && last && <View style={{ flexDirection: 'row' }}><Button label={`تابع: ${last}`} onPress={onContinue} /></View>}
    </View>
  );
}

const SEARCH_LIMIT = 30;

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
 * The hadith tab (owner's sketch, 2026-11-19): one search over both Sahihs' babs and hadith, then a card for each book,
 * Sahih al-Bukhari, Sahih Muslim and al-Nawawi's Forty, each opening its kitabs, with «تابع» to the last hadith read.
 */
export default function HadithScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('hadith', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  const texts = useSahihTexts();
  const found = useMemo(() => (typed ? searchSahih(SAHIH_SLUGS.map(slug => ({ index: SAHIH[slug], text: texts[slug] })), typed, SEARCH_LIMIT) : null), [typed, texts]);
  const missing = SAHIH_SLUGS.filter(slug => !texts[slug]);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>الحديث</Text>
        <SearchField palette={palette} label="ابحث في الصحيحين" placeholder="ابحث في الأبواب والأحاديث" value={query} onChangeText={setQuery} />
        {found ? <>
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>في الأبواب</Text>
          {found.babs.length ? found.babs.map(hit => {
            const kitab = SAHIH[hit.book].kitabs.find(each => each.n === hit.kitab);
            return <Hit key={`b-${hit.book}-${hit.kitab}-${hit.bab}`} hit={hit} line={kitab?.babs[hit.bab ?? 0]?.title ?? ''} palette={palette} />;
          }) : <Empty text="لا باب فيه هذه الكلمات" palette={palette} />}
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>في الأحاديث</Text>
          {found.hadith.map(hit => {
            const hadith = texts[hit.book] && findHadith(texts[hit.book]!, hit.n)?.hadith;
            return hadith ? <Hit key={`h-${hit.book}-${hit.n}`} hit={hit} line={opening(hadith)} palette={palette} /> : null;
          })}
          {!found.hadith.length && <Empty text={missing.length === SAHIH_SLUGS.length ? 'نزّل الصحيحين من المكتبة ليبحث في نص الأحاديث' : 'لا حديث فيه هذه الكلمات'} palette={palette} />}
          {missing.length > 0 && missing.length < SAHIH_SLUGS.length && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`نزّل ${SAHIH[missing[0]].title} من المكتبة ليبحث فيه أيضًا`}</Text>}
        </> : <>
          {SAHIH_SLUGS.map(slug => {
            const book = SAHIH[slug];
            const last = lastOpened(slug);
            const kitab = last ? placeOf(book, last)?.kitab : undefined;
            const count = book.kitabs[book.kitabs.length - 1].to;
            return <BookCard key={slug} title={book.title} by={`${book.author} (ت ${num(book.died)}هـ)`} size={`${num(book.kitabs.length)} كتابًا، ${num(count)} حديثًا`}
              last={last && kitab ? `${num(last)}، ${kitab.title}` : undefined} onOpen={() => openBook(slug)} onContinue={last ? () => openSahih(slug, last) : undefined} palette={palette} />;
          })}
          <BookCard title={FORTY.books.nawawi.title} by="يحيى بن شرف النووي" size={`${num(FORTY.entries.length)} حديثًا`} onOpen={() => openBook('forty')} palette={palette} />
        </>}
      </ScrollView>
    </View>
  );
}
