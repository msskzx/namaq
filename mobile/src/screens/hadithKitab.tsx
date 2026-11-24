import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import type { SahihBab, SahihHadith } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { holdsTerms } from '@shared/quran/searchAll';
import Empty from '@/ui/Empty';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Chip from '@/ui/Chip';
import LoadingDots from '@/ui/LoadingDots';
import { usePalette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { SAHIH, isSahihSlug, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihHadithCard } from '@/components/Sahih';
import { openSahih } from './hadith';

type Row = { kind: 'bab'; bab: SahihBab; i: number; said?: string } | { kind: 'hadith'; hadith: SahihHadith };

/**
 * A kitab (owner's sketch, 2026-11-19): each bab heading in the accent, what the author put under it before its first
 * hadith (al-Bukhari's ayat and reports) in muted ink, then its hadith, each a card that opens it. In Muslim the headings
 * are al-Nawawi's, and say so. The search in the top bar keeps the babs and hadith that hold the words typed.
 */
export default function HadithKitabScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { book: slug = '', kitab: at = '' } = useLocalSearchParams<{ book?: string; kitab?: string }>();
  const book = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const kitab = book?.kitabs.find(each => each.n === Number(at));
  const { state, text } = useSahihText(book?.slug);
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  // Searched, a bab whose heading or opening words hold the words typed comes whole; any other bab only with its hadith
  // that hold them, under its heading so the find keeps its place.
  const rows = useMemo<Row[]>(() => {
    if (!kitab) return [];
    const file = text?.kitabs.find(each => each.n === kitab.n);
    return kitab.babs.flatMap((bab, i) => {
      const head = { kind: 'bab' as const, bab, i, said: file?.said[i] };
      const hadith = (file?.hadith.filter(each => each.bab === i) ?? []).map(each => ({ kind: 'hadith' as const, hadith: each }));
      if (!typed || holdsTerms(`${bab.title} ${head.said ?? ''}`, typed)) return [head, ...hadith];
      const found = hadith.filter(row => row.hadith.routes.some(route => holdsTerms(route.text, typed)));
      return found.length ? [head, ...found] : [];
    }).filter(row => row.kind === 'hadith' || row.bab.title || row.said);
  }, [kitab, text, typed]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!book || !kitab) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: `ابحث في ${kitab.title}`, label: `ابحث في ${kitab.title}` }} />
      <FlatList data={rows} onScroll={onScroll} scrollEventThrottle={16} initialNumToRender={12} windowSize={9}
        keyExtractor={row => (row.kind === 'bab' ? `b${row.i}` : `h${row.hadith.n}`)}
        keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}
        ListEmptyComponent={typed ? <Empty text="لا باب ولا حديث فيه هذه الكلمات" palette={palette} /> : undefined}
        ListHeaderComponent={<View style={{ gap: 8 }}>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{book.title}</Text>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{kitab.title}</Text>
          {kitab.from > 0 && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{`الأحاديث ${num(kitab.from)}–${num(kitab.to)}`}</Text>}
          {state !== 'on' ? <SahihDownload slug={book.slug} state={state} palette={palette} /> : !text && <LoadingDots />}
        </View>}
        renderItem={({ item: row }) => row.kind === 'bab'
          ? <View style={{ gap: 6, marginTop: 8 }}>
            {row.bab.title !== '' && <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 18, lineHeight: 32, textAlign: 'right' }}>{row.bab.title}</Text>}
            {book.headingsBy === 'nawawi' && row.bab.title !== '' && <View style={{ flexDirection: 'row' }}><Chip label="تبويب النووي" on={false} small role="text" palette={palette} /></View>}
            {row.said ? <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 30, textAlign: 'right' }}>{row.said}</Text> : null}
          </View>
          : <SahihHadithCard hadith={row.hadith} palette={palette} onPress={() => openSahih(book.slug, row.hadith.n)} />} />
    </View>
  );
}
