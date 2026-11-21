import { useState } from 'react';
import { View } from 'react-native';
import { Check, Download } from 'lucide-react-native';
import { bookOf } from '@shared/books';
import { lastLink, sahihName, searchSahih, splitRoute, type SahihHadith, type SahihIndex, type SahihRoute } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Card, { CardWithRow } from '@/ui/Card';
import type { Source } from '@/ui/sourceSlot';
import Tabs from '@/ui/Tabs';
import Folded from '@/ui/Folded';
import Reference from '@/ui/Reference';
import Button from '@/ui/Button';
import TapRow from '@/ui/TapRow';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import LoadingDots from '@/ui/LoadingDots';
import type { Palette } from '@/lib/theme';
import { addBook, type BookState } from '@/lib/books';

type Mode = 'drawing' | 'text';
const MODES = [{ key: 'drawing', label: 'الرسم' }, { key: 'text', label: 'النص' }] as const;
// The owner's names (2026-11-18): the drawing, and the whole text with its isnad.

const body = (palette: Palette, big = false) => ({ color: palette.ink, fontSize: big ? 21 : 19, lineHeight: big ? 40 : 36, textAlign: 'right' as const });
const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);

/** A page of a Sahih on Shamela, by the page's id there. */
export const sahihPage = (book: SahihIndex, shamela: number) => `https://shamela.ws/book/${book.shamela}/${shamela}`;

/** The opening of a hadith's words, for a list: its first route's words after the chain. */
export const opening = (hadith: SahihHadith) => splitRoute(hadith.routes[0]).words.trim();

/**
 * A chain as the edition prints it, drawn top to bottom: the collector, then each narrator under the one who narrated from
 * him, the word he narrated with on the line between them. Only a plain chain (one line, no ح) is drawn.
 */
export function SahihChain({ book, route, palette }: { book: SahihIndex; route: SahihRoute; palette: Palette }) {
  const chain = route.chain ?? [];
  const collector = book.slug === 'bukhari' ? 'البخاري' : 'مسلم';
  return (
    <View accessible accessibilityLabel={`الإسناد: ${[collector, ...chain.map(link => link.name)].join('، ')}`} style={{ alignItems: 'center' }}>
      <Text style={{ color: palette.accent, fontSize: 17 }}>{collector}</Text>
      {chain.map((link, i) => (
        <View key={`${link.name}-${i}`} style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 30 }}>
            <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: palette.rule }} />
            <Text style={{ color: palette.amber, fontSize: 13 }}>{link.mode}</Text>
          </View>
          <Text style={{ color: i === chain.length - 1 ? palette.ink : palette.muted, fontSize: 16, textAlign: 'center' }}>{link.name}</Text>
        </View>
      ))}
    </View>
  );
}

/** One printed text: its chain drawn and its words under it, or the whole text with the chain in muted ink; its page folded. */
export function SahihRouteView({ book, n, route, mode, palette, big }: { book: SahihIndex; n: number; route: SahihRoute; mode: Mode; palette: Palette; big?: boolean }) {
  const { chain, words } = splitRoute(route);
  return (
    <View style={{ gap: 10 }}>
      {mode === 'drawing' && route.chain
        ? <><SahihChain book={book} route={route} palette={palette} /><Text style={body(palette, big)}>{words}</Text></>
        : <Text style={body(palette, big)}><Text style={{ color: palette.muted }}>{chain}</Text>{words}</Text>}
      {/* In a card with a row, the book joins its line and the page (linked to al-Shamela) its sheet (owner 2026-11-20). */}
      <Reference title={book.title} palette={palette}
        quotes={[{ text: '', cite: `${sahihName(book, n, num, route.route)}، ج ${num(route.volume)}، ${pagesName(route.pages)}`, url: sahihPage(book, route.shamela) }, { text: `${book.title}، ${book.edition}` }]} />
    </View>
  );
}

/**
 * A hadith of a Sahih whole (owner's sketch, 2026-11-19): the narrator it comes from, its words large, «الرسم» or «النص»
 * when its chain is drawn, and in Muslim its other routes folded under the first. The page, the feed card and a quiz's
 * look-up all draw it.
 */
export function SahihHadithView({ book, hadith, palette }: { book: SahihIndex; hadith: SahihHadith; palette: Palette }) {
  const [mode, setMode] = useState<Mode>('drawing');
  const [first, ...rest] = hadith.routes;
  const from = lastLink(first);
  const drawn = hadith.routes.some(route => route.chain);
  return (
    <View style={{ gap: 12 }}>
      {from && <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{from}</Text>}
      {drawn && <Tabs label="طريقة العرض" options={MODES} value={mode} onChange={setMode} palette={palette} />}
      <SahihRouteView book={book} n={hadith.n} route={first} mode={mode} palette={palette} big />
      {rest.length > 0 && (
        <Folded credit={`طرق أخرى عند ${book.slug === 'muslim' ? 'مسلم' : 'البخاري'} (${num(rest.length)})`} palette={palette}>
          {rest.map((route, i) => <SahihRouteView key={`${route.route}-${i}`} book={book} n={hadith.n} route={route} mode={mode} palette={palette} />)}
        </Folded>
      )}
    </View>
  );
}

/** A hadith in a kitab's list: its number, the narrator it comes from and the opening of its words; a tap opens it. */
export function SahihHadithCard({ hadith, palette, onPress }: { hadith: SahihHadith; palette: Palette; onPress: () => void }) {
  const from = lastLink(hadith.routes[0]);
  const numbers = [hadith.n, ...(hadith.also ?? [])].map(n => num(n)).join(' - ');
  return (
    <Card palette={palette} pad={[10, 14]} gap={4} accessibilityRole="link" accessibilityLabel={`الحديث ${numbers}`} onPress={onPress}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Text style={{ color: palette.accent, fontSize: 15 }}>{numbers}</Text>
        {from && <Text numberOfLines={1} style={{ flexShrink: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{from}</Text>}
      </View>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' }}>{opening(hadith)}</Text>
      {hadith.routes.length > 1 && <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`${num(hadith.routes.length)} طرق`}</Text>}
    </Card>
  );
}

/** A Sahih's text is not on the phone yet: what it is and a button to download it once, or the loader while it comes. */
export function SahihDownload({ slug, state, palette }: { slug: SahihIndex['slug']; state: BookState; palette: Palette }) {
  const book = bookOf(slug);
  if (state === 'downloading') return <LoadingDots label={`ينزل ${book.title}`} />;
  return (
    <Card palette={palette} gap={8}>
      <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{`نص ${book.title} يُنزَّل مرة واحدة (${num(book.megabytes)} م.ب)، ثم يُقرأ بلا إنترنت.`}</Text>
      {state === 'failed' && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>لم يكتمل التنزيل، فأعد المحاولة.</Text>}
      <View style={{ flexDirection: 'row' }}><Button Icon={Download} variant="primary" label="نزّل الكتاب" onPress={() => { void addBook(slug); }} /></View>
    </Card>
  );
}

/**
 * A Sahih's kitabs as rows in one card, each its number, name and hadith numbers; `mark` checks one (a quiz's answer).
 * The book's page opens a kitab on a tap; a quiz's look-up opens its bab headings under it.
 */
export function SahihKitabList({ book, onOpen, mark, open, palette, source }: { book: SahihIndex; onOpen: (kitab: number) => void; mark?: number; open?: number; palette: Palette;
  /** The book itself, on the line under the list (the book's page). */
  source?: Source[] }) {
  return (
    <CardWithRow palette={palette} pad={[4, 14]} source={source}>
      {book.kitabs.map((kitab, i) => (
        <View key={kitab.n} style={{ borderTopWidth: i ? 1 : 0, borderColor: palette.rule }}>
          <TapRow role="link" label={kitab.n === mark ? `${kitab.title}، الجواب` : kitab.title} onPress={() => onOpen(kitab.n)}
            style={{ alignItems: 'center', gap: 10, paddingVertical: 8 }}>
            <Text style={{ width: 28, color: palette.accent, fontSize: 15 }}>{num(kitab.n)}</Text>
            <Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>{kitab.title}</Text>
            {kitab.n === mark ? <Check size={18} color={palette.green} /> : <Text style={{ color: palette.muted, fontSize: 13 }}>{kitab.from ? `${num(kitab.from)}–${num(kitab.to)}` : ''}</Text>}
          </TapRow>
          {open === kitab.n && kitab.babs.filter(bab => bab.title).map((bab, at) => (
            <Text key={at} style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right', paddingBottom: 6 }}>{bab.title}</Text>
          ))}
        </View>
      ))}
    </CardWithRow>
  );
}

/** A quiz's look-up for «في أيّ كتاب؟»: a search over the book's bab headings, or its kitabs, each opening its headings. */
export function SahihLook({ book, mark, palette }: { book: SahihIndex; mark?: number; palette: Palette }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<number | undefined>();
  const found = query.trim() ? searchSahih([{ index: book }], query, Infinity).babs : null;
  return (
    <View style={{ gap: 12 }}>
      <SearchField palette={palette} label={`ابحث في أبواب ${book.title}`} placeholder="ابحث بكلمات من الباب" value={query} onChangeText={setQuery} />
      {found
        ? found.length ? found.map(hit => {
          const kitab = book.kitabs.find(each => each.n === hit.kitab)!;
          return (
            <Card key={`${hit.kitab}-${hit.bab}`} palette={palette} pad={[10, 14]} gap={4}>
              <Text style={{ color: hit.kitab === mark ? palette.green : palette.muted, fontSize: 13, textAlign: 'right' }}>{kitab.title}</Text>
              <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{kitab.babs[hit.bab ?? 0].title}</Text>
            </Card>
          );
        }) : <Empty text="لا باب فيه هذه الكلمات." palette={palette} />
        : <SahihKitabList book={book} mark={mark} open={open} onOpen={n => setOpen(was => (was === n ? undefined : n))} palette={palette} />}
    </View>
  );
}
