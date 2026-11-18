import { Pressable, View } from 'react-native';
import { Text } from '@/ui/Text';
import { TAGS, type Citation } from '@shared/quran/mutashabih/types';
import type { Palette } from '@/lib/theme';

const arabicDigits = (text: string) => text.replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);
/** «§ الفاتحة، ج 1 ص 11» as the card's foot reads it: «الفاتحة، ج ١ ص ١١». */
export const placeLabel = (locator: string) => arabicDigits(locator.replace(/^§\s*/, ''));
const OTHER_BOOKS = ['', 'وفي كتاب آخر', 'وفي كتابين آخرين'];
export const otherBooks = (count: number) => OTHER_BOOKS[count] ?? `وفي ${arabicDigits(String(count))} كتب أخرى`;

/**
 * Inside a book's card, under its ayat (the owner's sketch, 2026-11-18): the book's name, its kind of difference as a small tag,
 * its words as printed (the first lines, the rest one tap away in the sources sheet) and where they are in the book.
 */
export default function BookQuote({ citations, onMore, palette }: { citations: Citation[]; onMore: () => void; palette: Palette }) {
  const [first] = citations;
  if (!first) return null;
  const tag = first.tags.map(id => TAGS[id]?.ar).find(Boolean);
  return (
    <Pressable onPress={onMore} accessibilityRole="button" accessibilityLabel={`كلام ${first.book}، اقرأ الباقي`} style={{ gap: 6, paddingTop: 10, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
        <Text numberOfLines={1} style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{first.book}</Text>
        {tag && <View style={{ borderWidth: 1, borderColor: palette.rule, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: palette.muted, fontSize: 13 }}>{tag}</Text>
        </View>}
      </View>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' }}>{`«${first.quote.replace(/\s+/g, ' ')}»`}</Text>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>
        {placeLabel(first.locator)}
        <Text style={{ color: palette.accent }}>{` · اقرأ الباقي${citations.length > 1 ? ` · ${otherBooks(citations.length - 1)}` : ''}`}</Text>
      </Text>
    </Pressable>
  );
}
