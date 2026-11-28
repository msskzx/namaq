import { memo, useCallback, useMemo, useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import QuranWords from '@/components/quran/text/QuranWords';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bookmark, BookOpenText, List, Search, Send } from 'lucide-react-native';
import { bookOf } from '@shared/books';
import { entryLabel, entryOfAyah, pageOfPrinted, pageOfSpot, paragraphsOf, runsIn, searchBook, type BookEntry, type BookPage, type ReaderBookId, type Spot } from '@shared/bookReader';
import { isReaderBook, pageName } from '@shared/readerBooks';
import { readFasilas, readSavedParagraphs, serverFasilas, serverSavedParagraphs, setBookFasila, setLastBookSpot, lastBookSpot, subscribeFasilas, subscribeSavedParagraphs, toggleSavedParagraph } from '@shared/readingMarks';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Sheet from '@/ui/Sheet';
import ReaderPager from '@/components/ReaderPager';
import ActButton from '@/ui/ActButton';
import FloatingMenu from '@/ui/FloatingMenu';
import FasilaIcon, { FasilaRibbon } from '@/components/FasilaIcon';
import LoadingDots from '@/ui/LoadingDots';
import { BookList } from '@/components/Books';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { surahNames } from '@/lib/branches';
import { useReaderBook, type ReaderBook } from '@/lib/readerBook';
import { setIntent } from '@/lib/intent';
import { toTab } from '@/lib/ways';
import { buzz } from '@/lib/haptics';
import { usePalette, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';
import Tabs from '@/ui/Tabs';
import { SearchField } from '@/ui/Field';
import Empty from '@/ui/Empty';
import { useDebounced } from '@/lib/hooks/useDebounced';
import { useAdjustOn } from '@/lib/hooks/useAdjustOn';
import { useOnChange } from '@/lib/hooks/useOnChange';

// see docs/plans/book-reader.md
export default function BookScreen() {
  const params = useLocalSearchParams<{ id?: string; entry?: string; at?: string; ayah?: string; printed?: string }>();
  const id: ReaderBookId = isReaderBook(params.id) ? params.id : 'sadi';
  const palette = usePalette();
  const book = useReaderBook(id);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {book ? <BookReader key={id} id={id} book={book} palette={palette} entry={params.entry} at={params.at} ayah={params.ayah} printed={params.printed} />
        : (
          <>
            <TopBar shelf title={bookOf(id).title} />
            {book === null ? <LoadingDots fill /> : (
              <View style={{ padding: 16, gap: 12 }}>
                <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>هذا الكتاب ليس على هاتفك. نزّله ليُقرأ هنا بلا اتصال.</Text>
                <BookList kind={bookOf(id).kind} palette={palette} />
              </View>
            )}
          </>
        )}
    </View>
  );
}

const keyOf = (spot: Spot) => `${spot.entry}:${spot.at}`;
const nameOf = (surah: number | undefined) => (surah ? surahNames[surah] ?? num(surah) : surah === 0 ? 'المقدمة' : '');

function BookReader({ id, book, palette, entry, at, ayah, printed }: { id: ReaderBookId; book: ReaderBook; palette: Palette; entry?: string; at?: string; ayah?: string; printed?: string }) {
  const { entries, pages } = book;
  const insets = useSafeAreaInsets();
  const bottom = useTabBarSpace() + 52;
  const asked = (): Spot | null => {
    if (entry !== undefined && Number.isInteger(Number(entry))) return { entry: Math.min(entries.length - 1, Math.max(0, Number(entry))), at: Number(at) || 0 };
    const [surah, number] = (ayah ?? '').split(':').map(Number);
    return surah && number ? { entry: entryOfAyah(entries, surah, number), at: 0 } : null;
  };
  const askedPage = (): number | null => {
    const [part, number] = (printed ?? '').split(':').map(Number);
    return part > 0 && number > 0 ? pageOfPrinted(pages, part, number) : null;
  };
  const [lit, setLit] = useState<Spot | null>(asked);
  const [page, setPage] = useState(() => {
    const spot = asked() ?? lastBookSpot(id);
    return askedPage() ?? (spot ? pageOfSpot(pages, spot) : 0);
  });
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  const fasila = fasilas[id];
  const savedList = useSyncExternalStore(subscribeSavedParagraphs, readSavedParagraphs, serverSavedParagraphs);
  const saved = useMemo(() => new Set(savedList.filter(item => item.book === id).map(keyOf)), [savedList, id]);
  const [actions, setActions] = useState<{ spot: Spot; y: number } | null>(null);
  const [sheet, setSheet] = useState<'contents' | 'saved' | 'search' | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const onHeight = useCallback((at: number, h: number) => setHeights(prev => (Math.abs((prev[at] ?? 0) - h) < 1 ? prev : { ...prev, [at]: h })), []);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const moved = useRef(0);

  const linked = () => asked() !== null || askedPage() !== null;
  useAdjustOn([entry, at, ayah, printed], () => {
    const spot = asked();
    const printedPage = askedPage();
    if (!spot && printedPage === null) return;
    setLit(spot);
    setPage(printedPage ?? pageOfSpot(pages, spot!));
  });
  useOnChange([entry, at, ayah, printed], () => {
    if (linked()) router.setParams({ entry: undefined, at: undefined, ayah: undefined, printed: undefined });
  });

  useOnChange([id, page, pages], () => {
    const first = pages[page]?.slices[0];
    if (first) setLastBookSpot(id, { entry: first.entry, at: first.from });
    scroller.current?.scrollTo({ y: 0, animated: false });
  });

  const turnTo = useCallback((next: number) => { setPage(next - 1); setActions(null); }, []);
  const onMove = useCallback(() => { moved.current = Date.now(); }, []);
  const goTo = (spot: Spot, light: boolean) => {
    setPage(pageOfSpot(pages, spot));
    setLit(light ? spot : null);
    setActions(null);
    setSheet(null);
  };
  const openAyah = useCallback((surah: number, ayah: number) => {
    setIntent({ tab: 'read', at: `${surah}:${ayah}` });
    toTab('/read');
  }, []);
  const onLong = useCallback((spot: Spot, y: number) => {
    if (Date.now() - moved.current < 350) return;
    buzz();
    setLit(spot);
    setActions({ spot, y });
  }, []);
  const onTap = useCallback(() => {
    if (Date.now() - moved.current < 350) return;
    setActions(null);
    setLit(null);
  }, []);

  const paragraphText = (spot: Spot) => {
    const text = entries[spot.entry].text;
    const end = text.indexOf('\n', spot.at);
    return text.slice(spot.at, end < 0 ? text.length : end).trim();
  };
  const where = (spot: Spot) => { const p = pages[pageOfSpot(pages, spot)]; return { part: p.part, page: p.page }; };
  const height = size ? size.height - insets.top : 0;
  const pagerHeight = Math.max(height, heights[page + 1] ?? 0);
  const render = (at: number) => (
    <BookPageView book={id} entries={entries} page={pages[at - 1]} index={at} palette={palette} minHeight={height} bottom={bottom} top={insets.top + 56}
      lit={lit} saved={saved} onHeight={onHeight} onLong={onLong} onTap={onTap} onAyah={openAyah} />
  );
  const fasilaPage = fasila ? pageOfSpot(pages, fasila) : -1;
  const spot = actions?.spot;
  const isSaved = !!spot && saved.has(keyOf(spot));
  const onFasila = fasilaPage === page;
  const markPage = () => {
    const first = pages[page]?.slices[0];
    if (!first) return;
    buzz();
    setBookFasila(id, onFasila ? null : { entry: first.entry, at: first.from, part: pages[page].part, page: pages[page].page });
  };
  const actionsAt = actions ? { x: (size?.width ?? 300) / 2, y: actions.y } : null;
  return (
    <View style={{ flex: 1 }} onLayout={event => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height })}>
      <ScrollView ref={scroller} showsVerticalScrollIndicator={false} scrollEventThrottle={32} onScrollBeginDrag={() => setActions(null)} style={{ flex: 1 }}>
        {size && height > 0 && (
          <ReaderPager page={page + 1} count={pages.length} width={size.width} height={pagerHeight} onPage={turnTo} onMove={onMove} render={render} backEdge />
        )}
      </ScrollView>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <TopBar shelf title={bookOf(id).title}>
          <IconButton Icon={FasilaIcon} label={onFasila ? 'أزل الفاصلة من هذه الصفحة' : 'ضع الفاصلة في هذه الصفحة: هنا توقفت'} onPress={markPage} on={onFasila} tone="accent"
            render={icon => <FasilaIcon size={icon.size} color={icon.color} filled={onFasila} />} />
          <IconButton Icon={Search} label="ابحث في الكتاب" onPress={() => setSheet('search')} />
          <IconButton Icon={List} label="فهرس الكتاب ومحفوظاته" onPress={() => setSheet('contents')} />
        </TopBar>
      </View>
      {fasila && fasilaPage !== page && !actions && (
        <Pressable onPress={() => goTo(fasila, false)} accessibilityRole="button" accessibilityLabel={`عد إلى فاصلتك، ${pageName(id, fasila.part, fasila.page)}`}
          style={{ position: 'absolute', alignSelf: 'center', bottom: bottom - 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, height: 40, borderRadius: 999, overflow: 'hidden', borderWidth: 1, borderColor: palette.glassEdge }}>
          <BlurView intensity={40} tint={palette.scheme} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: palette.glass }]} />
          <View><FasilaIcon size={18} color={palette.accent} /></View>
          <Text style={{ color: palette.ink, fontSize: 15 }}>{`عُد إلى فاصلتك · ${pageName(id, fasila.part, fasila.page)}`}</Text>
        </Pressable>
      )}
      {actions && spot && (
        <FloatingMenu at={actionsAt} label="أزرار الفقرة" onClose={() => setActions(null)} top={insets.top + 52} palette={palette}>
          <ActButton Icon={Bookmark} label={isSaved ? 'أزلها من المحفوظات' : 'احفظ الفقرة'} name="احفظ" palette={palette} on={isSaved} tint={palette.root} filled
            onPress={() => { toggleSavedParagraph({ book: id, ...spot, ...where(spot), text: paragraphText(spot).slice(0, 160) }); setActions(null); setLit(null); }} />
          {entries[spot.entry].surah > 0 && <ActButton Icon={BookOpenText} label="افتح الآية في المصحف" name="المصحف" palette={palette}
            onPress={() => { const { surah, from } = entries[spot.entry]; setActions(null); openAyah(surah, from || 1); }} />}
          <ActButton Icon={Send} label="مشاركة" name="مشاركة" palette={palette}
            onPress={() => { const text = paragraphText(spot); setActions(null); void Share.share({ message: `${text}\n\n${bookOf(id).title}، ${pageName(id, where(spot).part, where(spot).page)}` }); }} />
        </FloatingMenu>
      )}
      <BookSheet open={sheet} onTab={setSheet} onClose={() => setSheet(null)} id={id} entries={entries} pages={pages} page={page} palette={palette}
        saved={savedList.filter(item => item.book === id)} onGo={goTo} />
    </View>
  );
}

const MARGIN = 20;

const BookPageView = memo(function BookPageView({ book, entries, page, index, palette, minHeight, bottom, top, lit, saved, onHeight, onLong, onTap, onAyah }: {
  book: ReaderBookId; entries: BookEntry[]; page: BookPage; index: number; palette: Palette; minHeight: number; bottom: number; top: number;
  lit: Spot | null; saved: ReadonlySet<string>;
  onHeight: (page: number, height: number) => void; onLong: (spot: Spot, y: number) => void; onTap: () => void; onAyah: (surah: number, ayah: number) => void;
}) {
  return (
    <Pressable onPress={onTap} accessible={false} onLayout={event => onHeight(index, event.nativeEvent.layout.height)}
      style={{ minHeight, paddingTop: top, paddingBottom: bottom, paddingHorizontal: MARGIN + 4, backgroundColor: palette.paper }}>
      {page.slices.map(slice => {
        const entry = entries[slice.entry];
        const previous = entries[slice.entry - 1];
        const heads = slice.from === 0 && entry.surah > 0 && !(previous && previous.surah === entry.surah && previous.from === entry.from && book === 'ukbari');
        const ayah = entry.from || 1;
        return (
          <View key={`${slice.entry}:${slice.from}`}>
            {heads && (
              <Pressable onPress={() => onAyah(entry.surah, ayah)} accessibilityRole="link" accessibilityLabel={`افتح ${entryLabel(entry, surahNames[entry.surah] ?? '')} في المصحف`}
                style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, marginBottom: 4, paddingHorizontal: 10, height: 28, borderRadius: 14, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card }}>
                <BookOpenText size={14} color={palette.muted} />
                <Text style={{ color: palette.ink, fontSize: 14 }}>{entryLabel(entry, surahNames[entry.surah] ?? num(entry.surah))}</Text>
              </Pressable>
            )}
            {paragraphsOf(entry.text, slice).map(({ at, end }) => {
              const key = `${slice.entry}:${at}`;
              const on = lit?.entry === slice.entry && lit.at === at;
              return (
                <Pressable key={at} onLongPress={event => onLong({ entry: slice.entry, at }, event.nativeEvent.pageY)} delayLongPress={350} onPress={onTap}
                  style={{ marginVertical: 3, borderRadius: 8, paddingHorizontal: 4, marginHorizontal: -4, backgroundColor: on ? `${palette.ink}14` : 'transparent' }}>
                  {saved.has(key) && <View style={{ position: 'absolute', right: -MARGIN + 4, top: 6 }}><FasilaRibbon color={palette.root} height={16} width={8} /></View>}
                  <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 36, textAlign: 'right', writingDirection: 'rtl' }}>
                    {runsIn(entry.text, at, end).map((run, i) => (run.quran
                      ? <Text key={i} onPress={entry.surah ? () => onAyah(entry.surah, ayah) : undefined}><QuranWords style={{ color: palette.accent }}>{run.text}</QuranWords></Text>
                      : run.text))}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        );
      })}
      <Text style={{ textAlign: 'center', color: palette.muted, fontSize: 14, marginTop: 14 }}>{pageName(book, page.part, page.page)}</Text>
    </Pressable>
  );
});

const TABS = [
  { tab: 'contents', label: 'الفهرس', Icon: List },
  { tab: 'saved', label: 'المحفوظات', Icon: Bookmark },
  { tab: 'search', label: 'البحث في الكتاب', Icon: Search },
] as const;

function BookSheet({ open, onTab, onClose, id, entries, pages, page, palette, saved, onGo }: {
  open: 'contents' | 'saved' | 'search' | null; onTab: (tab: 'contents' | 'saved' | 'search') => void; onClose: () => void;
  id: ReaderBookId; entries: BookEntry[]; pages: BookPage[]; page: number; palette: Palette;
  saved: { entry: number; at: number; part: number; page: number; text: string }[]; onGo: (spot: Spot, light: boolean) => void;
}) {
  const [kept, setKept] = useState(open ?? 'contents');
  if (open && open !== kept) setKept(open);
  const surahs = useMemo(() => {
    const seen = new Map<number, Spot>();
    entries.forEach((entry, i) => { if (!seen.has(entry.surah)) seen.set(entry.surah, { entry: i, at: 0 }); });
    return [...seen.entries()];
  }, [entries]);
  const here = pages[page]?.slices[0]?.entry ?? 0;
  const hereSurah = entries[here]?.surah;
  const [query, setQuery] = useState('');
  const settled = useDebounced(query, 250);
  const found = useMemo(() => ({ ...searchBook(entries, pages, settled), query: settled }), [settled, entries, pages]);
  const row = { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: `${palette.rule}66` } as const;
  return (
    <Sheet open={!!open} onClose={onClose} palette={palette} tall>
      <View style={{ paddingBottom: 10 }}>
        <Tabs options={TABS.map(({ tab, label, Icon }) => ({ key: tab, label, Icon }))} value={kept} onChange={onTab} palette={palette} iconOnly />
      </View>
      {kept === 'contents' && (
        <FlatList data={surahs} keyExtractor={([surah]) => String(surah)} style={{ flex: 1 }} initialNumToRender={40}
          renderItem={({ item: [surah, spot] }) => {
            const at = pages[pageOfSpot(pages, spot)];
            return (
              <Pressable onPress={() => onGo(spot, false)} accessibilityRole="link" accessibilityLabel={`${nameOf(surah)}، ${pageName(id, at.part, at.page)}`}
                style={[{ height: 44, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 }, surah === hereSurah ? { backgroundColor: palette.paperDeep } : null]}>
                <Text style={{ width: 30, color: palette.accent, fontSize: 13 }}>{surah ? num(surah) : ''}</Text>
                <Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>{nameOf(surah)}</Text>
                <Text style={{ color: palette.muted, fontSize: 13 }}>{pageName(id, at.part, at.page)}</Text>
              </Pressable>
            );
          }} />
      )}
      {kept === 'saved' && (
        <FlatList data={saved} keyExtractor={item => `${item.entry}:${item.at}`} style={{ flex: 1 }}
          ListEmptyComponent={<Empty text="لم تحفظ فقرة من هذا الكتاب بعد. اضغط على فقرة مطولًا لتحفظها." palette={palette} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => onGo(item, true)} accessibilityRole="link" style={row}>
              <Text numberOfLines={2} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>{item.text}</Text>
              <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`${pageName(id, item.part, item.page)} · ${entryLabel(entries[item.entry] ?? { from: 0, to: 0 }, nameOf(entries[item.entry]?.surah))}`}</Text>
            </Pressable>
          )} />
      )}
      {kept === 'search' && (
        <View style={{ flex: 1 }}>
          <SearchField value={query} onChangeText={setQuery} placeholder="كلمة أو عبارة في الكتاب" label="ابحث في الكتاب" palette={palette} style={{ marginHorizontal: 16, marginBottom: 6 }} />
          {found.query === query && query.trim() && (
            <Text style={{ color: palette.muted, fontSize: 13, paddingHorizontal: 16, textAlign: 'right' }}>
              {found.hits.length ? `${found.more ? 'أول ' : ''}${num(found.hits.length)} موضعًا` : 'لا يوجد هذا في الكتاب.'}
            </Text>
          )}
          <FlatList data={found.query === query ? found.hits : []} keyExtractor={hit => `${hit.entry}:${hit.at}`} style={{ flex: 1 }} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag"
            renderItem={({ item: hit }) => {
              const at = pages[hit.page];
              const slice = at.slices.find(item => item.entry === hit.entry);
              const paragraph = Math.max(entries[hit.entry].text.lastIndexOf('\n', hit.at) + 1, slice?.from ?? 0);
              return (
                <Pressable onPress={() => onGo({ entry: hit.entry, at: paragraph }, true)} accessibilityRole="link" style={row}>
                  <Text style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right' }}>
                    {hit.before}<Text style={{ color: palette.accent }}>{hit.match}</Text>{hit.after}
                  </Text>
                  <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`${pageName(id, at.part, at.page)} · ${entryLabel(entries[hit.entry], nameOf(entries[hit.entry].surah))}`}</Text>
                </Pressable>
              );
            }} />
        </View>
      )}
    </Sheet>
  );
}

