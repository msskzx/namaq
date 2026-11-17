import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { ayahHref } from '@shared/ayahMarks';
import { Text } from '@/ui/Text';
import { ayahText } from '@/lib/mushaf';
import { WEBSITE } from '@/lib/website';
import { shareCard, shareCardLater } from '@/lib/shareImage';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import { surahName } from '@shared/quran/surahNames';
import Card from '@/ui/Card';

/** One ayah as share as image draws it: its surah and number, the ayah in Hafs, and the reader's own note under it (in Amiri). */
export default function AyahShare({ ayahKey, note, palette, width }: { ayahKey: string; note?: string; palette: Palette; width: number }) {
  const [surah, number] = ayahKey.split(':').map(Number);
  return (
    <Card palette={palette} gap={6} style={{ width }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{surahName(surah)} {num(number)}</Text>
      <Text style={{ color: palette.ink, fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 44, textAlign: 'right', writingDirection: 'rtl' }}>{ayahText(ayahKey)}</Text>
      {note ? <View style={{ paddingTop: 8, borderTopWidth: 1, borderColor: palette.rule }}>
        <Text style={{ color: palette.ink, fontSize: 17, lineHeight: 28, textAlign: 'right' }}>{note}</Text>
      </View> : null}
    </Card>
  );
}

/** Opens the share sheet on an ayah, with the reader's note when there is one; `later` when called from a closing sheet or menu. */
export const shareAyah = (ayahKey: string, palette: Palette, note?: string, later = false) => (later ? shareCardLater : shareCard)({
  content: width => <AyahShare ayahKey={ayahKey} note={note} palette={palette} width={width} />,
  link: `${WEBSITE}${ayahHref(ayahKey)}`,
});
