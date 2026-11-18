import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { TAGS, type Citation } from '@shared/quran/mutashabih/types';
import type { Palette } from '@/lib/theme';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';

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
    <View style={{ gap: 6, paddingTop: 10, paddingBottom: 4 }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
        <Text numberOfLines={1} style={{ flex: 1, color: palette.muted, fontSize: 14, textAlign: 'right' }}>{first.book}</Text>
        {tag && <Chip small role="text" label={tag} on={false} palette={palette} />}
      </View>
      <Text numberOfLines={3} style={{ color: palette.ink, fontSize: 16, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' }}>{`«${first.quote.replace(/\s+/g, ' ')}»`}</Text>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{placeLabel(first.locator)}{citations.length > 1 ? ` · ${otherBooks(citations.length - 1)}` : ''}</Text>
        <Button variant="plain" label="اقرأ الباقي" onPress={onMore} accessibilityLabel={`اقرأ كلام ${first.book} كاملًا`} />
      </View>
    </View>
  );
}
