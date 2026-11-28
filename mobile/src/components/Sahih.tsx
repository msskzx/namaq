import { useState } from 'react';
import { View } from 'react-native';
import { Check, Download } from 'lucide-react-native';
import { bookOf } from '@shared/books';
import { lastLink, leadIn, sahihName, searchSahih, splitRoute, type ChainLink, type SahihHadith, type SahihIndex, type SahihRoute } from '@shared/sahih';
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


const body = (palette: Palette, big = false) => ({ color: palette.ink, fontSize: big ? 21 : 19, lineHeight: big ? 40 : 36, textAlign: 'right' as const });
const pagesName = (pages: number[]) => (pages.length > 1 ? `ص ${num(pages[0])}–${num(pages[pages.length - 1])}` : `ص ${num(pages[0])}`);

export const sahihPage = (book: SahihIndex, shamela: number) => `https://shamela.ws/book/${book.shamela}/${shamela}`;

export const opening = (hadith: SahihHadith) => splitRoute(hadith.routes[0]).words.trim();

export function SahihChain({ book, route, palette }: { book: SahihIndex; route: SahihRoute; palette: Palette }) {
  return <Isnad isnad={chainIsnad(book.slug === 'bukhari' ? 'البخاري' : 'مسلم', route.chain ?? [])} palette={palette} />;
}

export function ChainSaying({ chain, links, words, palette, big, lines }: { chain: string; links: readonly ChainLink[]; words: string; palette: Palette; big?: boolean;
  lines?: number }) {
  const { lead, prophet } = leadIn(chain, links) ?? { lead: '' };
  return <>
    {lead ? <Text style={{ color: palette.muted, fontSize: 16, lineHeight: 29, textAlign: 'right' }}>{lead}</Text> : null}
    {prophet
      ? <QuoteBar by={prophet} tone={palette.amber} palette={palette}><Text numberOfLines={lines} style={body(palette, big)}>{words.trim()}</Text></QuoteBar>
      : <Text numberOfLines={lines} style={body(palette, big)}>{words.trim()}</Text>}
  </>;
}

export function SahihRouteView({ book, n, route, mode, palette, big }: { book: SahihIndex; n: number; route: SahihRoute; mode: DrawMode; palette: Palette; big?: boolean }) {
  const { chain, words } = splitRoute(route);
  const drawsWhole = !!route.chain && leadIn(chain, route.chain) !== undefined;
  const place = `${sahihName(book, n, num, route.route)}، ج ${num(route.volume)}، ${pagesName(route.pages)}`;
  return (
    <View style={{ gap: 10 }}>
      {mode === 'drawing' && drawsWhole
        ? <><SahihChain book={book} route={route} palette={palette} /><ChainSaying chain={chain} links={route.chain!} words={words} palette={palette} big={big} /></>
        : <Text style={body(palette, big)}><Text style={{ color: palette.muted }}>{chain}</Text>{words}</Text>}
      <Reference title={book.title} palette={palette} places={[place]} editions={[book.edition]}
        quotes={[{ text: '', cite: place, url: sahihPage(book, route.shamela) }, { text: `${book.title}، ${book.edition}` }]} />
    </View>
  );
}

export function SahihHadithView({ book, hadith, palette }: { book: SahihIndex; hadith: SahihHadith; palette: Palette }) {
  const [mode, setMode] = useState<DrawMode>('drawing');
  const [first, ...rest] = hadith.routes;
  const from = lastLink(first);
  const drawsWhole = (route: SahihRoute) => !!route.chain && leadIn(splitRoute(route).chain, route.chain) !== undefined;
  const drawn = hadith.routes.some(drawsWhole);
  return (
    <View style={{ gap: 12 }}>
      {from && !(mode === 'drawing' && drawsWhole(first)) && <Text style={{ color: palette.ink, fontSize: 16, textAlign: 'right' }}>{from}</Text>}
      {drawn && <Tabs label="طريقة العرض" options={DRAW_MODES} value={mode} onChange={setMode} palette={palette} />}
      <SahihRouteView book={book} n={hadith.n} route={first} mode={mode} palette={palette} big />
      {rest.length > 0 && (
        <Folded credit={`طرق أخرى عند ${book.slug === 'muslim' ? 'مسلم' : 'البخاري'} (${num(rest.length)})`} palette={palette}>
          {rest.map((route, i) => <SahihRouteView key={`${route.route}-${i}`} book={book} n={hadith.n} route={route} mode={mode} palette={palette} />)}
        </Folded>
      )}
    </View>
  );
}

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

const babsName = (n: number) => (n === 1 ? 'باب واحد' : n === 2 ? 'بابان' : `${num(n)} ${n % 100 >= 3 && n % 100 <= 10 ? 'أبواب' : n % 100 >= 11 ? 'بابًا' : 'باب'}`);

const sizeOf = (kitab: SahihIndex['kitabs'][number]) => (kitab.from ? kitab.to - kitab.from + 1 : 0);

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

export function SahihKitabList({ book, onOpen, onOpenBab, mark, open, found, here: showHere = false, palette, source }: { book: SahihIndex; onOpen: (kitab: number) => void; mark?: number; open?: number; palette: Palette;
  onOpenBab?: (kitab: number, bab: number) => void;
  here?: boolean;
  found?: Map<number, number[]>;
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
              {(open === kitab.n ? kitab.babs.map((_, at) => at) : found?.get(kitab.n) ?? []).filter(at => kitab.babs[at].title).map(at => onOpenBab
                ? <TapRow key={at} role="link" label={kitab.babs[at].title} onPress={() => onOpenBab(kitab.n, at)} style={{ paddingRight: 38 }}>
                  <Text style={{ flex: 1, color: palette.ink, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{kitab.babs[at].title}</Text>
                </TapRow>
                : <Text key={at} style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right', paddingBottom: 6, paddingRight: 38 }}>{kitab.babs[at].title}</Text>)}
            </View>
          );
        })}
      </View>
    </CardWithRow>
  );
}

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
