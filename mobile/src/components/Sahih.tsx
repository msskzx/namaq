import { useState } from 'react';
import { View } from 'react-native';
import { Check, Download } from 'lucide-react-native';
import { bookOf } from '@shared/books';
import { lastLink, leadIn, sahihName, searchSahih, splitRoute, type SahihHadith, type SahihIndex, type SahihRoute } from '@shared/sahih';
import { num } from '@shared/quran/arabicNumber';
import { DRAW_MODES, type DrawMode } from '@shared/hadith';
import { Text } from '@/ui/Text';
import Card, { CardWithRow } from '@/ui/Card';
import QuoteBar from '@/ui/QuoteBar';
import Isnad from '@/components/Isnad';
import { chainIsnad } from '@shared/isnadMetro';
import type { Source } from '@/ui/sourceSlot';
import Tabs from '@/ui/Tabs';
import Folded from '@/ui/Folded';
import Reference from '@/ui/Reference';
import Button from '@/ui/Button';
import TapRow from '@/ui/TapRow';
import FactCells from '@/ui/FactCells';
import BarStrip from '@/ui/BarStrip';
import Ring from '@/ui/Ring';
import ShareBar from '@/ui/ShareBar';
import Empty from '@/ui/Empty';
import { SearchField } from '@/ui/Field';
import LoadingDots from '@/ui/LoadingDots';
import type { Palette } from '@/lib/theme';
import { addBook, type BookState } from '@/lib/books';
import { lastOpened } from '@/lib/sahih';
import { JIBRIL, hadithUnit } from '@/lib/hadith';


const body = (palette: Palette, big = false) => ({ color: palette.ink, fontSize: big ? 21 : 19, lineHeight: big ? 40 : 36, textAlign: 'right' as const });
const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);

/** A page of a Sahih on Shamela, by the page's id there. */
export const sahihPage = (book: SahihIndex, shamela: number) => `https://shamela.ws/book/${book.shamela}/${shamela}`;

/** The opening of a hadith's words, for a list: its first route's words after the chain. */
export const opening = (hadith: SahihHadith) => splitRoute(hadith.routes[0]).words.trim();

/** A plain chain (one line, no ح) drawn as the metro line, the collector on top. */
export function SahihChain({ book, route, palette }: { book: SahihIndex; route: SahihRoute; palette: Palette }) {
  return <Isnad isnad={chainIsnad(book.slug === 'bukhari' ? 'البخاري' : 'مسلم', route.chain ?? [])} palette={palette} />;
}

/**
 * The printed words after the drawn chain (owner 2026-11-24, sketch hadith-design/sketch4): the last narrator's link with
 * what he tells, muted, then the saying; when the Prophet ﷺ is named just before it, the saying under that line in amber.
 */
export function ChainSaying({ chain, last, words, palette, big, lines }: { chain: string; last?: { name: string; mode: string }; words: string; palette: Palette; big?: boolean;
  /** At most these lines of the words, for a card that opens the whole (never cut with «…»). */
  lines?: number }) {
  const { lead, prophet } = leadIn(chain, last);
  return <>
    {lead ? <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 29, textAlign: 'right' }}>{lead}</Text> : null}
    {prophet
      ? <QuoteBar by={prophet} tone={palette.amber} palette={palette}><Text numberOfLines={lines} style={body(palette, big)}>{words.trim()}</Text></QuoteBar>
      : <Text numberOfLines={lines} style={body(palette, big)}>{words.trim()}</Text>}
  </>;
}

/**
 * A Sahih hadith drawn as one of the hadith pages draws it (owner 2026-11-24: Muslim 8 opened from the hadith tab showed
 * no drawing): its isnad with Muslim's two routes and the tabaqat, and the narrator its routes meet at, where his words begin.
 */
const UNIT_OF: Record<string, string> = { 'muslim:8': JIBRIL.muslim, 'bukhari:50': JIBRIL.bukhari };
export function unitDrawing(book: SahihIndex, n: number) {
  const unit = hadithUnit(UNIT_OF[`${book.slug}:${n}`] ?? '');
  const report = unit?.reports.find(each => unit.isnad[each.id]);
  return unit && report ? { isnad: unit.isnad[report.id], origin: report.origin } : undefined;
}

/** One printed text: its chain drawn and its words under it, or the whole text with the chain in muted ink; its page folded. */
export function SahihRouteView({ book, n, route, mode, palette, big, drawing }: { book: SahihIndex; n: number; route: SahihRoute; mode: DrawMode; palette: Palette; big?: boolean;
  /** Its isnad as a hadith page draws it, routes and tabaqat. */
  drawing?: ReturnType<typeof unitDrawing> }) {
  const { chain, words } = splitRoute(route);
  const place = `${sahihName(book, n, num, route.route)}، ج ${num(route.volume)}، ${pagesName(route.pages)}`;
  // Where routes are joined (Muslim's «ح»), the words are read whole from the narrator they meet at: his story is the text.
  const from = drawing && !route.chain && drawing.origin ? route.text.lastIndexOf(drawing.origin, route.isnadEnd ?? route.text.length) : -1;
  return (
    <View style={{ gap: 10 }}>
      {mode === 'drawing' && drawing && (route.chain || from >= 0)
        ? <><Isnad isnad={drawing.isnad} palette={palette} />{route.chain
          ? <ChainSaying chain={chain} last={route.chain[route.chain.length - 1]} words={words} palette={palette} big={big} />
          : <Text style={body(palette, big)}>{route.text.slice(Math.max(0, route.text.lastIndexOf(' ', from - 2) + 1))}</Text>}</>
        : mode === 'drawing' && route.chain
        ? <><SahihChain book={book} route={route} palette={palette} /><ChainSaying chain={chain} last={route.chain[route.chain.length - 1]} words={words} palette={palette} big={big} /></>
        : <Text style={body(palette, big)}><Text style={{ color: palette.muted }}>{chain}</Text>{words}</Text>}
      {/* In a card with a row, the book joins its line and the page (linked to al-Shamela) its sheet (owner 2026-11-20). */}
      <Reference title={book.title} palette={palette} places={[place]} editions={[book.edition]}
        quotes={[{ text: '', cite: place, url: sahihPage(book, route.shamela) }, { text: `${book.title}، ${book.edition}` }]} />
    </View>
  );
}

/**
 * A hadith of a Sahih whole (owner's sketch, 2026-11-19): the narrator it comes from, its words large, «الرسم» or «النص»
 * when its chain is drawn, and in Muslim its other routes folded under the first. The page, the feed card and a quiz's
 * look-up all draw it.
 */
export function SahihHadithView({ book, hadith, palette }: { book: SahihIndex; hadith: SahihHadith; palette: Palette }) {
  const [mode, setMode] = useState<DrawMode>('drawing');
  const [first, ...rest] = hadith.routes;
  const from = lastLink(first);
  const drawing = unitDrawing(book, hadith.n);
  const drawn = !!drawing || hadith.routes.some(route => route.chain);
  return (
    <View style={{ gap: 12 }}>
      {from && !(mode === 'drawing' && (first.chain || drawing)) && <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{from}</Text>}
      {drawn && <Tabs label="طريقة العرض" options={DRAW_MODES} value={mode} onChange={setMode} palette={palette} />}
      <SahihRouteView book={book} n={hadith.n} route={first} mode={mode} palette={palette} big drawing={drawing} />
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

/** «باب واحد», «بابان», «٣ أبواب», «٤٣ بابًا». */
const babsName = (n: number) => (n === 1 ? 'باب واحد' : n === 2 ? 'بابان' : `${num(n)} ${n % 100 >= 3 && n % 100 <= 10 ? 'أبواب' : n % 100 >= 11 ? 'بابًا' : 'باب'}`);

/** How many hadith a kitab holds by its numbers (none for a kitab of headings only). */
const sizeOf = (kitab: SahihIndex['kitabs'][number]) => (kitab.from ? kitab.to - kitab.from + 1 : 0);

/**
 * A Sahih's shape (owner, 2026-11-23: sketch hadith-design): its name and author, how many kitabs and hadith, and a bar for
 * each kitab as tall as its hadith, the first on the right. A touch names the kitab under the finger and lifting it opens
 * that kitab; the mark is over the kitab read last. On the hadith tab its head opens the book.
 */
export function SahihShape({ book, onOpenBook, onOpenKitab, palette }: { book: SahihIndex; onOpenBook?: () => void; onOpenKitab: (kitab: number) => void; palette: Palette }) {
  const [picked, setPicked] = useState<number | null>(null);
  const last = lastOpened(book.slug);
  const lastKitab = last ? book.kitabs.findIndex(kitab => last >= kitab.from && last <= kitab.to) : -1;
  const head = (
    <View style={{ flex: 1, gap: 2 }}>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 26, textAlign: 'right' }}>{book.title}</Text>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`${book.author} (ت ${num(book.died)}هـ)`}</Text>
    </View>
  );
  const name = (i: number) => {
    const kitab = book.kitabs[i];
    return `${kitab.title}${kitab.from ? `، ${num(kitab.from)}–${num(kitab.to)}` : ''}`;
  };
  return (
    <View style={{ gap: 12 }}>
      {onOpenBook ? <TapRow role="link" label={book.title} onPress={onOpenBook}>{head}</TapRow> : head}
      <View style={{ marginHorizontal: -14 }}>
        <FactCells palette={palette} cells={[
          { key: 'kitabs', label: 'كتبه', readings: [{ value: num(book.kitabs.length) }] },
          { key: 'hadith', label: 'أحاديثه', readings: [{ value: num(book.kitabs[book.kitabs.length - 1].to) }] },
        ]} />
      </View>
      <View style={{ marginTop: 22 }}>
        <BarStrip counts={book.kitabs.map(sizeOf)} picked={picked} onPick={setPicked} height={64} holdScroll={false}
          mark={lastKitab >= 0 ? lastKitab : undefined} name={name} label={`كتب ${book.title}، المس واسحب`}
          ends={[book.kitabs[0].title, book.kitabs[book.kitabs.length - 1].title]}
          onLift={i => { setPicked(null); onOpenKitab(book.kitabs[i].n); }} palette={palette} />
      </View>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>
        {`كل خطّ كتابٌ من كتبه، طوله على قدر أحاديثه. المسه واسحب تر اسمه، وارفع إصبعك يُفتح.${lastKitab >= 0 ? ' المؤشر حيث وقفت.' : ''}`}
      </Text>
    </View>
  );
}

/**
 * A Sahih's kitabs on one line down the card (owner, 2026-11-23: sketch hadith-design), each its number in a ring, its
 * name, a bar as long as its hadith beside the longest kitab's, its babs and hadith numbers; «وقفت هنا» on the kitab read
 * last when `here`. `mark` checks one (a quiz's answer). The book's page opens a kitab on a tap; a quiz's look-up opens its bab headings under it.
 */
export function SahihKitabList({ book, onOpen, mark, open, found, here: showHere = false, palette, source }: { book: SahihIndex; onOpen: (kitab: number) => void; mark?: number; open?: number; palette: Palette;
  /** «وقفت هنا» on the kitab read last (the book's page, never a quiz). */
  here?: boolean;
  /** A search's hits: only these kitabs, each with the bab headings that hold the words (none when its name holds them). */
  found?: Map<number, number[]>;
  /** The book itself, on the line under the list (the book's page). */
  source?: Source[] }) {
  const longest = Math.max(1, ...book.kitabs.map(sizeOf));
  const last = showHere ? lastOpened(book.slug) : undefined;
  return (
    <CardWithRow palette={palette} pad={[8, 14]} source={source}>
      <View>
        <View style={{ position: 'absolute', right: 13.5, top: 20, bottom: 20, width: 1, backgroundColor: palette.rule }} />
        {book.kitabs.filter(kitab => !found || found.has(kitab.n)).map(kitab => {
          const here = last !== undefined && last >= kitab.from && last <= kitab.to;
          const answer = kitab.n === mark;
          const tone = here ? palette.accent : answer ? palette.green : palette.rule;
          return (
            <View key={kitab.n}>
              <TapRow role="link" label={answer ? `${kitab.title}، الجواب` : here ? `${kitab.title}، وقفت هنا` : kitab.title} onPress={() => onOpen(kitab.n)}
                style={{ gap: 10, paddingVertical: 8 }}>
                <View style={{ marginTop: 4 }}>
                  <Ring tone={tone} palette={palette}>
                    {answer ? <Check size={15} color={palette.green} /> : <Text style={{ color: here ? palette.accent : palette.muted, fontSize: 13 }}>{num(kitab.n)}</Text>}
                  </Ring>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ color: palette.ink, fontSize: 18, textAlign: 'right' }}>
                    {kitab.title}{here ? <Text style={{ color: palette.accent, fontSize: 14 }}>{'  · وقفت هنا'}</Text> : null}
                  </Text>
                  {sizeOf(kitab) > 0 && <ShareBar share={sizeOf(kitab) / longest} colour={tone} />}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: palette.muted, fontSize: 13 }}>{babsName(kitab.babs.length)}</Text>
                    <Text style={{ color: palette.muted, fontSize: 13 }}>{kitab.from ? `${num(kitab.from)}–${num(kitab.to)}` : ''}</Text>
                  </View>
                </View>
              </TapRow>
              {(open === kitab.n ? kitab.babs : (found?.get(kitab.n) ?? []).map(at => kitab.babs[at])).filter(bab => bab.title).map((bab, at) => (
                <Text key={at} style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right', paddingBottom: 6, paddingRight: 38 }}>{bab.title}</Text>
              ))}
            </View>
          );
        })}
      </View>
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
