import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { plainText, type SahihBab, type SahihIndex, type SahihKitab } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Chip from '@/ui/Chip';
import Ring from '@/ui/Ring';
import TapRow from '@/ui/TapRow';
import Button from '@/ui/Button';
import OpenButton from '@/ui/OpenButton';
import { CardWithRow } from '@/ui/Card';
import Empty from '@/ui/Empty';
import LoadingDots from '@/ui/LoadingDots';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { SAHIH, isSahihSlug, useSahihText } from '@/lib/sahih';
import { SahihDownload, SahihHadithCard } from '@/components/Sahih';
import { openBab, openSahih } from './hadith';

/** A bab's name in its kitab's list: its number among the kitab's headed babs, or the hadith before the first heading. */
const babNumber = (kitab: SahihKitab, at: number) => kitab.babs.slice(0, at + 1).filter(bab => bab.title).length;

/** «حديث ٩»، «حديثان ١٤–١٥»، «٣ أحاديث ٩–١١»، or a heading al-Bukhari gives no hadith under. */
function hadithLine(bab: SahihBab) {
  if (!bab.from) return 'ترجمة بلا حديث مسند';
  const count = bab.to - bab.from + 1;
  if (count === 1) return `حديث ${num(bab.from)}`;
  return `${count === 2 ? 'حديثان' : `${num(count)} ${count <= 10 ? 'أحاديث' : 'حديثًا'}`} ${num(bab.from)}–${num(bab.to)}`;
}

function BabRow({ book, kitab, at, palette }: { book: SahihIndex; kitab: SahihKitab; at: number; palette: Palette }) {
  const bab = kitab.babs[at];
  const title = bab.title || 'في أول الكتاب، قبل أول باب';
  return (
    <TapRow role="link" label={title} onPress={() => openBab(book.slug, kitab.n, at)} style={{ gap: 12, paddingVertical: 10 }}>
      <View style={{ marginTop: 3 }}>
        <Ring tone={palette.rule} size={32} palette={palette}><Text style={{ color: palette.muted, fontSize: 14 }}>{bab.title ? num(babNumber(kitab, at)) : '·'}</Text></Ring>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: bab.title ? palette.ink : palette.muted, fontSize: 18, lineHeight: 31, textAlign: 'right' }}>{title}</Text>
        <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{hadithLine(bab)}</Text>
      </View>
    </TapRow>
  );
}

/**
 * A kitab (owner's choice, 2026-11-24, sketch hadith-design/sketch5 «أ»): the list of its babs, each numbered with its
 * hadith, a tap opening the bab; the list ships with the app, so it shows before the book's text is downloaded.
 */
function KitabIndex({ book, kitab }: { book: SahihIndex; kitab: SahihKitab }) {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const [query, setQuery] = useState('');
  const typed = useDeferredValue(query.trim());
  const shown = useMemo(() => {
    const words = plainText(typed).split(' ').filter(Boolean);
    return kitab.babs.map((_, at) => at).filter(at => words.every(word => plainText(kitab.babs[at].title).includes(word)));
  }, [kitab, typed]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  const headed = kitab.babs.filter(bab => bab.title).length;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll search={{ value: query, onChangeText: setQuery, placeholder: `ابحث في أبواب ${kitab.title}`, label: `ابحث في أبواب ${kitab.title}` }} />
      <FlatList data={shown} onScroll={onScroll} scrollEventThrottle={16} initialNumToRender={16} windowSize={9}
        keyExtractor={at => String(at)}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom }}
        ListHeaderComponent={<View style={{ gap: 6, marginBottom: 6 }}>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{`${book.title} · الكتاب ${num(kitab.n)}`}</Text>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{kitab.title}</Text>
          <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>
            {`${num(headed)} ${headed > 10 ? 'بابًا' : headed > 2 ? 'أبواب' : headed === 2 ? 'بابان' : 'باب'}${kitab.from ? ` · الأحاديث ${num(kitab.from)}–${num(kitab.to)}` : ''}`}
          </Text>
          {book.headingsBy === 'nawawi' && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>تراجم الأبواب من وضع النووي، كما في طبعة عبد الباقي.</Text>}
        </View>}
        ListEmptyComponent={<Empty text="لا باب فيه هذه الكلمات" palette={palette} />}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.4 }} />}
        renderItem={({ item: at }) => <BabRow book={book} kitab={kitab} at={at} palette={palette} />} />
    </View>
  );
}

/**
 * A bab (sketch5 «أ ٢»): its heading large, what the author put under it before its first hadith (al-Bukhari's ayat and
 * reports, his «ترجمة») folded in its own card, then its hadith, each opening its page, and the babs on either side.
 */
function BabPage({ book, kitab, at }: { book: SahihIndex; kitab: SahihKitab; at: number }) {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { state, text } = useSahihText(book.slug);
  const [whole, setWhole] = useState(false);
  const bab = kitab.babs[at];
  const file = text?.kitabs.find(each => each.n === kitab.n);
  const said = file?.said[at] ?? '';
  const hadith = file?.hadith.filter(each => each.bab === at) ?? [];
  const headed = kitab.babs.filter(each => each.title).length;
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  const go = (to: number) => router.replace({ pathname: '/hadith-kitab', params: { book: book.slug, kitab: String(kitab.n), bab: String(to) } });
  const neighbour = (to: number) => kitab.babs[to] && (kitab.babs[to].title || to === 0) ? to : undefined;
  const before = neighbour(at - 1);
  const after = neighbour(at + 1);
  const saidBy = book.headingsBy === 'author' ? 'ترجمة البخاري للباب' : 'ما قبل أحاديث الباب';
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 12 }}>
        <View style={{ flexDirection: 'row' }}>
          <Button variant="plain" label={`${kitab.title}${bab.title ? ` · الباب ${num(babNumber(kitab, at))} من ${num(headed)}` : ''}`} onPress={() => router.replace({ pathname: '/hadith-kitab', params: { book: book.slug, kitab: String(kitab.n) } })} />
        </View>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, lineHeight: 44, textAlign: 'right' }}>{bab.title || 'في أول الكتاب، قبل أول باب'}</Text>
        {book.headingsBy === 'nawawi' && bab.title !== '' && <View style={{ flexDirection: 'row' }}><Chip label="تبويب النووي" on={false} small role="text" palette={palette} /></View>}
        {state !== 'on' ? <SahihDownload slug={book.slug} state={state} palette={palette} /> : !text ? <LoadingDots /> : <>
          {said !== '' && (
            <CardWithRow palette={palette} gap={6} {...(said.length > 260 ? { onPress: () => setWhole(was => !was), accessibilityState: { expanded: whole }, accessibilityLabel: `${saidBy}، ${whole ? 'اطوِها' : 'افتحها كاملة'}` } : {})}
              lead={said.length > 260 && !whole ? <OpenButton label={`${saidBy} كاملة`} onPress={() => setWhole(true)} /> : undefined}>
              <Text style={{ color: palette.amber, fontSize: 14, textAlign: 'right' }}>{saidBy}</Text>
              <Text numberOfLines={whole ? undefined : 6} style={{ color: palette.muted, fontSize: 17, lineHeight: 32, textAlign: 'right' }}>{said}</Text>
            </CardWithRow>
          )}
          <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 15, textAlign: 'right', marginTop: 4 }}>{hadith.length > 1 ? 'أحاديث الباب' : hadith.length ? 'حديث الباب' : 'لم يسند في هذا الباب حديثًا'}</Text>
          {hadith.map(each => <SahihHadithCard key={each.n} hadith={each} palette={palette} onPress={() => openSahih(book.slug, each.n)} />)}
        </>}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 8 }}>
          {before !== undefined ? <OpenButton what="الباب السابق" label={kitab.babs[before].title || 'أول الكتاب'} onPress={() => go(before)} /> : <View />}
          {after !== undefined ? <OpenButton what="الباب التالي" label={kitab.babs[after].title} onPress={() => go(after)} /> : <View />}
        </View>
      </ScrollView>
    </View>
  );
}

export default function HadithKitabScreen() {
  const palette = usePalette();
  const { book: slug = '', kitab: n = '', bab: at } = useLocalSearchParams<{ book?: string; kitab?: string; bab?: string }>();
  const book = isSahihSlug(slug) ? SAHIH[slug] : undefined;
  const kitab = book?.kitabs.find(each => each.n === Number(n));
  const back = () => (router.canGoBack() ? router.back() : toTab('/hadith'));
  if (!book || !kitab) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  if (at !== undefined && kitab.babs[Number(at)]) return <BabPage key={at} book={book} kitab={kitab} at={Number(at)} />;
  return <KitabIndex book={book} kitab={kitab} />;
}
