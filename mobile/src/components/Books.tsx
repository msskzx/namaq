import { Pressable, View } from 'react-native';
import { Download, RotateCw, Trash2 } from 'lucide-react-native';
import { BOOK_KINDS, BOOKS, type Book, type BookKind } from '@shared/books';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import { addBook, bookState, removeBook, useBooks } from '@/lib/books';
import { type Palette } from '@/lib/theme';
import Card from '@/ui/Card';
import LoadingDots from '@/ui/LoadingDots';

export const size = (book: Book) => (book.builtIn ? 'مع التطبيق' : `${num(Math.round(book.megabytes * 10) / 10).replace('.', '٫')} م.ب`);

function BookRow({ book, palette, first }: { book: Book; palette: Palette; first: boolean }) {
  const state = bookState(book.id);
  const button = { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' } as const;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: first ? 0 : 1, borderColor: palette.rule }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ color: palette.ink, fontSize: 17, textAlign: 'right' }}>{book.title}</Text>
        <Text style={{ color: state === 'failed' ? palette.accent : palette.muted, fontSize: 13, textAlign: 'right' }}>
          {state === 'failed' ? 'تعذّر التنزيل، تحقق من الاتصال' : `${book.by} · ${size(book)}`}
        </Text>
      </View>
      {state === 'downloading' ? <View style={button}><LoadingDots label={`ينزل ${book.title}`} /></View>
        : state === 'on' ? (
          <Pressable onPress={() => removeBook(book.id)} accessibilityRole="button" accessibilityLabel={`احذف ${book.title}`} style={({ pressed }) => [button, { opacity: pressed ? 0.6 : 1 }]}>
            <Trash2 size={20} color={palette.muted} />
          </Pressable>
        ) : (
          <Pressable onPress={() => addBook(book.id)} accessibilityRole="button" accessibilityLabel={`${book.builtIn ? 'أعد' : 'نزّل'} ${book.title}`}
            style={({ pressed }) => [button, { borderWidth: 1, borderColor: palette.rule, opacity: pressed ? 0.6 : 1 }]}>
            {state === 'failed' ? <RotateCw size={20} color={palette.accent} /> : <Download size={20} color={palette.accent} />}
          </Pressable>
        )}
    </View>
  );
}

/** The books of one kind, or all of them under their kinds, each with its download or remove button. */
export function BookList({ kind, palette }: { kind?: BookKind; palette: Palette }) {
  useBooks();
  const kinds = BOOK_KINDS.filter(k => !kind || k.kind === kind);
  return (
    <View style={{ gap: 10 }}>
      {kinds.map(k => {
        const books = BOOKS.filter(book => book.kind === k.kind);
        return (
          <View key={k.kind} style={{ gap: 6 }}>
            {!kind && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{k.title}</Text>}
            <Card palette={palette} pad={0}>{books.map((book, i) => <BookRow key={book.id} book={book} palette={palette} first={i === 0} />)}</Card>
          </View>
        );
      })}
    </View>
  );
}
