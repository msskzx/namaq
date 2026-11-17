import { useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
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
import { CARD, usePalette, type Palette } from '@/lib/theme';
import IconButton from '@/ui/IconButton';

/** Tuhfat al-Atfal is a poem with a page of its own (screens/tuhfa.tsx), shelved with the books. It ships with the app and has nothing to manage. */
const TUHFA = { id: 'tuhfa', kind: 'التجويد', title: 'تحفة الأطفال', by: 'سليمان الجمزوري' } as const;
const kindTitle = (book: Book) => BOOK_KINDS.find(kind => kind.kind === book.kind)?.title ?? '';

/**
 * The library (owner, 2026-11-17): its own button in the tab bar, in the utilities' old place. Every book on square cards,
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
      <TopBar hideOnScroll>
        <Text accessibilityRole="header" style={{ flex: 1, color: palette.ink, fontSize: 19, textAlign: 'right' }}>المكتبة</Text>
        <IconButton Icon={editing ? Check : Pencil} label={editing ? 'تم' : 'تعديل الكتب'} onPress={() => setEditing(!editing)} on={editing} />
      </TopBar>
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {shown.map(book => {
          const fasila = isReaderBook(book.id) ? fasilas[book.id] : undefined;
          return <BookCard key={book.id} book={book} palette={palette} editing={editing} fasila={fasila && isReaderBook(book.id) ? pageName(book.id, fasila.part, fasila.page) : null} />;
        })}
        <Card palette={palette} label={TUHFA.title} onPress={editing ? undefined : () => toTab('/tuhfa')} kind={TUHFA.kind} title={TUHFA.title} by={TUHFA.by} />
      </ScrollView>
    </View>
  );
}

function BookCard({ book, palette, editing, fasila }: { book: Book; palette: Palette; editing: boolean; fasila: string | null }) {
  const state = bookState(book.id);
  const reads = isReaderBook(book.id);
  const open = reads && state === 'on' ? () => toTab({ pathname: '/book', params: { id: book.id } }) : undefined;
  // The card's last line: the فاصلة, or what the book is when there is none.
  const foot = state === 'failed' ? { text: 'تعذّر التنزيل', accent: true }
    : fasila && state === 'on' && !editing ? { text: `فاصلتك: ${fasila}`, accent: true, fasila: true }
    : !reads && state === 'on' && !editing ? { text: 'يُقرأ من أزرار الآية', accent: false }
    : state === 'off' && !book.builtIn ? { text: size(book), accent: false }
    : editing ? { text: book.builtIn ? (state === 'off' ? 'مخفي' : 'مع التطبيق') : 'على هاتفك', accent: false }
    : null;
  return (
    <Card palette={palette} label={book.title} onPress={editing ? undefined : open} kind={kindTitle(book)} title={book.title} by={book.by}
      faded={state === 'off' && book.builtIn} foot={foot} action={<Action book={book} state={state} editing={editing} palette={palette} />} />
  );
}

/** The card's one button: download (or retry) when the book is not on the phone; while editing, remove, hide or bring back. */
function Action({ book, state, editing, palette }: { book: Book; state: BookState; editing: boolean; palette: Palette }) {
  if (state === 'downloading') return <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={palette.accent} /></View>;
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
    <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => ({ width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 })}>
      <Icon size={20} color={muted ? palette.muted : palette.accent} />
    </Pressable>
  );
}

type Foot = { text: string; accent: boolean; fasila?: boolean } | null;

function Card({ palette, label, onPress, kind, title, by, foot = null, action, faded = false }: { palette: Palette; label: string; onPress?: () => void;
  kind: string; title: string; by: string; foot?: Foot; action?: React.ReactNode; faded?: boolean }) {
  // Square, two to a row, and taller when a long title or author needs the room (the row's other card grows with it).
  const side = (useWindowDimensions().width - 32 - 12) / 2;
  const look = { ...CARD, width: side, minHeight: side, padding: 14, borderWidth: 1, borderColor: palette.rule,
    backgroundColor: palette.card, opacity: faded ? 0.55 : 1, justifyContent: 'space-between', gap: 8 } as const;
  const body = (
    <>
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
    </>
  );
  // A card that opens is one link. One that does not (editing, or a book to download) is a plain view, so a screen reader
  // reaches its button: a pressable card would read as one element with the button folded inside it.
  if (!onPress) return <View style={look}>{body}</View>;
  return (
    <Pressable onPress={onPress} accessibilityRole="link" accessibilityLabel={label} style={({ pressed }) => [look, pressed && { backgroundColor: palette.paperDeep }]}>
      {body}
    </Pressable>
  );
}
