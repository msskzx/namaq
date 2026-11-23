import { useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { router } from 'expo-router';
import { Check, Download, Eye, EyeOff, Pencil, RotateCw, Trash2 } from 'lucide-react-native';
import { BOOK_KINDS, BOOKS, type Book } from '@shared/books';
import { isReaderBook, pageName } from '@shared/readerBooks';
import { readFasilas, serverFasilas, subscribeFasilas } from '@shared/readingMarks';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import FasilaIcon from '@/components/FasilaIcon';
import { size } from '@/components/Books';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { addBook, bookState, removeBook, useBooks, type BookState } from '@/lib/books';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { toTab } from '@/lib/ways';
import { usePalette, type Palette } from '@/lib/theme';
import Card from '@/ui/Card';
import IconButton from '@/ui/IconButton';
import { Tap } from '@/ui/Tap';
import LoadingDots from '@/ui/LoadingDots';

/** Tuhfat al-Atfal is a poem with a page of its own (screens/tuhfa.tsx), shelved with the books. It ships with the app and has nothing to manage. */
export const TUHFA = { id: 'tuhfa', kind: 'التجويد', title: 'تحفة الأطفال', by: 'سليمان الجمزوري' } as const;
const kindTitle = (book: Book) => BOOK_KINDS.find(kind => kind.kind === book.kind)?.title ?? '';

/**
 * The library (owner, 2026-11-17): its own button in the tab bar, in the utilities' old place. Every book on a card a little taller than wide,
 * two to a row, no headings by kind until there are more books (the kind sits on each card). A reader book opens in the
 * book reader; the short i'rab and al-Itqan are read from an ayah's buttons in the mushaf, so their cards only say so.
 * Under a book only its «فاصلة», where the reader stopped: no counts of pages read.
 *
 * The books are managed here, not in the settings: the pencil turns on editing, where a downloaded book has a bin,
 * a built-in one an eye to hide it (hidden ones show only while editing, with an eye to bring them back), and the check ends it.
 */
export default function LibraryScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const [editing, setEditing] = useState(false);
  useBooks();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  // The library button tapped again: editing ends and the shelf goes back to its top.
  useTabRetap('books', () => { setEditing(false); scroll.current?.scrollTo({ y: 0, animated: true }); });
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  const shown = BOOKS.filter(book => editing || !(book.builtIn && bookState(book.id) === 'off'));
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      {/* The shelf opens from home's المكتبة, not from a button of the bar (owner, 2026-11-18), so it has a way back. */}
      <TopBar hideOnScroll back={() => (router.canGoBack() ? router.back() : toTab('/'))}>
        <IconButton Icon={editing ? Check : Pencil} label={editing ? 'تم' : 'تعديل الكتب'} onPress={() => setEditing(!editing)} on={editing} />
      </TopBar>
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {shown.map(book => {
          const fasila = isReaderBook(book.id) ? fasilas[book.id] : undefined;
          return <BookCard key={book.id} book={book} palette={palette} editing={editing} fasila={fasila && isReaderBook(book.id) ? pageName(book.id, fasila.part, fasila.page) : null} />;
        })}
        <Shelf palette={palette} label={TUHFA.title} onPress={editing ? undefined : () => toTab('/tuhfa')} kind={TUHFA.kind} title={TUHFA.title} by={TUHFA.by} />
      </ScrollView>
    </View>
  );
}

/** A book on the shelf; home's books card shows the same card, narrower (`width`). */
export function BookCard({ book, palette, editing, fasila, width }: { book: Book; palette: Palette; editing: boolean; fasila: string | null; width?: number }) {
  const state = bookState(book.id);
  const reads = isReaderBook(book.id);
  // A Sahih opens its kitabs on the hadith tab, there on the phone or not (its kitabs ship with the app).
  const open = book.kind === 'hadith' ? () => toTab({ pathname: '/hadith-book', params: { book: book.id } })
    : reads && state === 'on' ? () => toTab({ pathname: '/book', params: { id: book.id } }) : undefined;
  // The card's last line: the فاصلة, or what the book is when there is none.
  const foot = state === 'failed' ? { text: 'تعذّر التنزيل', accent: true }
    : fasila && state === 'on' && !editing ? { text: `فاصلتك: ${fasila}`, accent: true, fasila: true }
    : book.kind === 'hadith' && state === 'on' && !editing ? { text: 'يُقرأ من تبويب الحديث', accent: false }
    : !reads && state === 'on' && !editing ? { text: 'يُقرأ من أزرار الآية', accent: false }
    : state === 'off' && !book.builtIn ? { text: size(book), accent: false }
    : editing ? { text: book.builtIn ? (state === 'off' ? 'مخفي' : 'مع التطبيق') : 'على هاتفك', accent: false }
    : null;
  return (
    <Shelf palette={palette} label={book.title} onPress={editing ? undefined : open} kind={kindTitle(book)} title={book.title} by={book.by}
      faded={state === 'off' && book.builtIn} foot={foot} width={width} action={<Action book={book} state={state} editing={editing} palette={palette} />} />
  );
}

/** The card's one button: download (or retry) when the book is not on the phone; while editing, remove, hide or bring back. */
function Action({ book, state, editing, palette }: { book: Book; state: BookState; editing: boolean; palette: Palette }) {
  if (state === 'downloading') return <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><LoadingDots label={`ينزل ${book.title}`} /></View>;
  const on = state === 'on';
  if (on && !editing) return null;
  // While editing, a download that failed can be dropped as well as retried.
  if (state === 'failed' && editing) return <Button Icon={Trash2} label={`احذف ${book.title}`} press={() => removeBook(book.id)} muted palette={palette} />;
  if (state === 'off' && book.builtIn && !editing) return null;
  const [Icon, label, press] = on
    ? book.builtIn ? [EyeOff, `أخفِ ${book.title}`, () => removeBook(book.id)] as const : [Trash2, `احذف ${book.title}`, () => removeBook(book.id)] as const
    : book.builtIn ? [Eye, `أظهر ${book.title}`, () => addBook(book.id)] as const
    : [state === 'failed' ? RotateCw : Download, `نزّل ${book.title}`, () => addBook(book.id)] as const;
  return <Button Icon={Icon} label={label} press={press} muted={on} palette={palette} />;
}

function Button({ Icon, label, press, muted, palette }: { Icon: typeof Trash2; label: string; press: () => void; muted: boolean; palette: Palette }) {
  return (
    <Tap onPress={press} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
      <Icon size={20} color={muted ? palette.muted : palette.accent} />
    </Tap>
  );
}

/** A book card's height over its width. */
const BOOK_SHAPE = 1.2;

type Foot = { text: string; accent: boolean; fasila?: boolean } | null;

export function Shelf({ palette, label, onPress, kind, title, by, foot = null, action, faded = false, width }: { palette: Palette; label: string; onPress?: () => void;
  kind: string; title: string; by: string; foot?: Foot; action?: React.ReactNode; faded?: boolean; width?: number }) {
  // Two to a row, a little taller than wide like a book (owner, 2026-11-18), and taller still when a long title or author
  // needs the room (the row's other card grows with it).
  const shelf = (usePageWidth() - 32 - 12) / 2;
  const side = width ?? shelf;
  // A card that opens is one link. One that does not (editing, or a book to download) is a plain view, so a screen reader
  // reaches its button: a pressable card would read as one element with the button folded inside it.
  return (
    <Card palette={palette} gap={8} faded={faded} onPress={onPress} accessibilityRole={onPress ? 'link' : undefined} accessibilityLabel={onPress ? label : undefined}
      style={{ width: side, minHeight: Math.round(side * BOOK_SHAPE), justifyContent: 'space-between' }}>
      <View style={{ gap: 4 }}>
        <Text style={{ color: palette.accent, fontSize: 13, textAlign: 'right' }}>{kind}</Text>
        <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 18, lineHeight: 28, textAlign: 'right' }}>{title}</Text>
        <Text numberOfLines={2} style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{by}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 }}>
        {foot?.fasila && <FasilaIcon size={15} color={palette.accent} />}
        <Text style={{ flex: 1, color: foot?.accent ? palette.accent : palette.muted, fontSize: 13, textAlign: 'right' }}>{foot?.text ?? ''}</Text>
        {action}
      </View>
    </Card>
  );
}
