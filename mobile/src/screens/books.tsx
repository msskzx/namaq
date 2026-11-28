import { useRef, useState, useSyncExternalStore, type ComponentRef } from 'react';
import { ScrollView, View } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { router } from 'expo-router';
import { Check, Download, Eye, EyeOff, Pencil, RotateCw, Trash2 } from 'lucide-react-native';
import { BOOK_KINDS, BOOKS, type Book } from '@shared/books';
import { holdsTerms } from '@shared/quran/searchAll';
import Empty from '@/ui/Empty';
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

export const TUHFA = { id: 'tuhfa', kind: 'التجويد', title: 'تحفة الأطفال', by: 'سليمان الجمزوري' } as const;
const kindTitle = (book: Book) => BOOK_KINDS.find(kind => kind.kind === book.kind)?.title ?? '';

export default function LibraryScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const [editing, setEditing] = useState(false);
  useBooks();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useTabRetap('books', () => { setEditing(false); setQuery(''); scroll.current?.scrollTo({ y: 0, animated: true }); });
  const fasilas = useSyncExternalStore(subscribeFasilas, readFasilas, serverFasilas);
  const [query, setQuery] = useState('');
  const held = (book: { title: string; by: string; kind: string }) => !query.trim() || holdsTerms(`${book.title} ${book.by} ${book.kind}`, query);
  const shown = BOOKS.filter(book => (editing || !(book.builtIn && bookState(book.id) === 'off')) && held({ ...book, kind: kindTitle(book) }));
  const tuhfa = held(TUHFA);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar hideOnScroll back={() => (router.canGoBack() ? router.back() : toTab('/'))} search={{ value: query, onChangeText: setQuery, placeholder: 'ابحث في المكتبة', label: 'ابحث في المكتبة' }}>
        <IconButton Icon={editing ? Check : Pencil} label={editing ? 'تم' : 'تعديل الكتب'} onPress={() => setEditing(!editing)} on={editing} />
      </TopBar>
      <ScrollView ref={scroll} onScroll={onScroll} scrollEventThrottle={16} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={{ padding: 16, paddingBottom: bottom, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {shown.map(book => {
          const fasila = isReaderBook(book.id) ? fasilas[book.id] : undefined;
          return <BookCard key={book.id} book={book} palette={palette} editing={editing} fasila={fasila && isReaderBook(book.id) ? pageName(book.id, fasila.part, fasila.page) : null} />;
        })}
        {!shown.length && !tuhfa && <View style={{ flexBasis: '100%' }}><Empty text="لا كتاب بهذا الاسم" palette={palette} /></View>}
        {tuhfa && <Shelf palette={palette} label={TUHFA.title} onPress={editing ? undefined : () => toTab('/tuhfa')} kind={TUHFA.kind} title={TUHFA.title} by={TUHFA.by} />}
      </ScrollView>
    </View>
  );
}

export function BookCard({ book, palette, editing, fasila, width }: { book: Book; palette: Palette; editing: boolean; fasila: string | null; width?: number }) {
  const state = bookState(book.id);
  const reads = isReaderBook(book.id);
  const open = book.kind === 'hadith' ? () => toTab({ pathname: '/hadith-book', params: { book: book.id } })
    : reads && state === 'on' ? () => toTab({ pathname: '/book', params: { id: book.id } }) : undefined;
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

function Action({ book, state, editing, palette }: { book: Book; state: BookState; editing: boolean; palette: Palette }) {
  if (state === 'downloading') return <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><LoadingDots label={`ينزل ${book.title}`} /></View>;
  const on = state === 'on';
  if (on && !editing) return null;
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

const BOOK_SHAPE = 1.2;

type Foot = { text: string; accent: boolean; fasila?: boolean } | null;

export function Shelf({ palette, label, onPress, kind, title, by, foot = null, action, faded = false, width }: { palette: Palette; label: string; onPress?: () => void;
  kind: string; title: string; by: string; foot?: Foot; action?: React.ReactNode; faded?: boolean; width?: number }) {
  const shelf = (usePageWidth() - 32 - 12) / 2;
  const side = width ?? shelf;
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
