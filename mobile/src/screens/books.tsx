import { useSyncExternalStore } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { BookMarked, Download, RotateCw } from 'lucide-react-native';
import { BOOK_KINDS, bookOf } from '@shared/books';
import { READER_BOOKS, pageName } from '@shared/readerBooks';
import { readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import type { ReaderBookId } from '@shared/bookReader';
import { Text } from '@/components/Text';
import TopBar from '@/components/TopBar';
import FasilaIcon from '@/components/FasilaIcon';
import { useTabBarSpace } from '@/components/tabBarSpace';
import { addBook, bookState, useBooks } from '@/lib/books';
import { useShrinkOnScroll } from '@/lib/chrome';
import { toTab } from '@/lib/ways';
import { CARD, usePalette, type Palette } from '@/lib/theme';

/** Tuhfat al-Atfal is a poem with a page of its own (screens/tuhfa.tsx), listed on the shelf with the books. */
type Shelved = { id: ReaderBookId | 'tuhfa'; title: string; by: string };
const SHELVES: { title: string; books: Shelved[] }[] = [
  ...BOOK_KINDS.map(kind => ({ title: kind.title, books: READER_BOOKS.filter(id => bookOf(id).kind === kind.kind).map((id): Shelved => ({ id, title: bookOf(id).title, by: bookOf(id).by })) })),
  { title: 'التجويد', books: [{ id: 'tuhfa' as const, title: 'تحفة الأطفال', by: 'سليمان الجمزوري' }] },
].filter(shelf => shelf.books.length);

/**
 * The books (owner, 2026-11-16; docs/plans/book-reader.md): every book the app reads, on shelves by kind. A book on the
 * phone opens in the book reader; one that is not shows its download. Under a book only its «فاصلة», where the reader
 * stopped: no counts of pages read.
 */
export default function BooksScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  useBooks();
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hub hideOnScroll><Text style={{ flex: 1, color: palette.ink, fontSize: 17, textAlign: 'right' }}>الكتب</Text></TopBar>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 6 }}>
        {SHELVES.map(shelf => (
          <View key={shelf.title} style={{ gap: 8, marginBottom: 8 }}>
            <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{shelf.title}</Text>
            {shelf.books.map(book => <ShelfBook key={book.id} book={book} palette={palette} fasila={book.id === 'tuhfa' ? null : fasilas[book.id] ?? null} />)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ShelfBook({ book, palette, fasila }: { book: Shelved; palette: Palette; fasila: { part: number; page: number } | null }) {
  const state = book.id === 'tuhfa' ? 'on' : bookState(book.id);
  const open = () => (book.id === 'tuhfa' ? toTab('/tuhfa') : toTab({ pathname: '/book', params: { id: book.id } }));
  return (
    <Pressable onPress={state === 'on' ? open : undefined} accessibilityRole={state === 'on' ? 'link' : undefined} accessibilityLabel={book.title}
      style={({ pressed }) => ({ ...CARD, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: palette.rule, backgroundColor: pressed && state === 'on' ? palette.paperDeep : palette.card })}>
      <View style={{ width: 42, height: 58, borderRadius: 6, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.paperDeep, alignItems: 'center', justifyContent: 'center' }}>
        <BookMarked size={20} color={palette.muted} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{book.title}</Text>
        <Text style={{ color: state === 'failed' ? palette.accent : palette.muted, fontSize: 13, textAlign: 'right' }}>{state === 'failed' ? 'تعذّر التنزيل، تحقق من الاتصال' : book.by}</Text>
        {fasila && book.id !== 'tuhfa' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <FasilaIcon size={15} color={palette.accent} />
            <Text style={{ color: palette.accent, fontSize: 13 }}>{`فاصلتك: ${pageName(book.id, fasila.part, fasila.page)}`}</Text>
          </View>
        )}
      </View>
      {book.id !== 'tuhfa' && state === 'downloading' && <ActivityIndicator color={palette.accent} />}
      {book.id !== 'tuhfa' && (state === 'off' || state === 'failed') && (
        <Pressable onPress={() => addBook(book.id as ReaderBookId)} accessibilityRole="button" accessibilityLabel={`${bookOf(book.id as ReaderBookId).builtIn ? 'أعد' : 'نزّل'} ${book.title}`}
          style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
          {state === 'failed' ? <RotateCw size={20} color={palette.accent} /> : <Download size={20} color={palette.accent} />}
        </Pressable>
      )}
    </Pressable>
  );
}
