import { useState } from 'react';
import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { rajabOpening, type RajabChapter, type RajabParagraph } from '@shared/hadith';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import Reference from '@/ui/Reference';
import type { Palette } from '@/lib/theme';
import { FORTY, shamelaPage } from '@/lib/hadith';

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' as const });
/** «جامع العلوم والحكم، ٢/ ١٥٠»: a paragraph's place, as the edition's two parts are cited. */
export const rajabPlace = (paragraph: Pick<RajabParagraph, 'volume' | 'page'>) => `${FORTY.books.ibnrajab.title}، ${num(paragraph.volume)}/ ${num(paragraph.page)}`;

/** Ibn Rajab's paragraphs with their page under a rule where a new page starts. */
function Paragraphs({ paragraphs, palette }: { paragraphs: RajabParagraph[]; palette: Palette }) {
  return (
    <View style={{ gap: 10 }}>
      {paragraphs.map((paragraph, i) => (
        <View key={`${paragraph.shamela}-${i}`} style={{ gap: 4 }}>
          {i > 0 && paragraph.page !== paragraphs[i - 1].page && (
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'left' }}>{`${num(paragraph.volume)}/ ${num(paragraph.page)}`}</Text>
          )}
          <Text style={body(palette)}>{paragraph.text}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Ibn Rajab's words on a hadith (the owner's sketch, 2026-11-18): his explanation's opening, then the whole chapter a tap away,
 * each page marked, and its reference. The hadith page shows it and the feed card shows one passage of it (`only`).
 */
export default function IbnRajab({ chapter, only, palette }: { chapter: RajabChapter; only?: RajabParagraph; palette: Palette }) {
  const [whole, setWhole] = useState(false);
  const opening = only ? [only] : rajabOpening(chapter);
  const shown = whole ? chapter.paragraphs : opening;
  const first = shown[0];
  const last = shown[shown.length - 1];
  const book = FORTY.books.ibnrajab;
  return (
    <View style={{ gap: 8 }}>
      <Paragraphs paragraphs={shown} palette={palette} />
      {!only && (
        <View style={{ flexDirection: 'row' }}>
          <Button variant="plain" label={whole ? 'أقل' : 'الشرح كاملًا'} onPress={() => setWhole(was => !was)}
            accessibilityLabel={whole ? 'اطو الشرح' : 'اقرأ شرح ابن رجب للحديث كاملًا'} />
        </View>
      )}
      <Reference title={first.page === last.page && first.volume === last.volume ? rajabPlace(first) : `${rajabPlace(first)}–${num(last.page)}`}
        quotes={[{ text: `${book.title}، ${book.edition}` }]} links={[{ label: 'الصفحة في المكتبة الشاملة', url: shamelaPage('ibnrajab', first.shamela) }]} palette={palette} />
    </View>
  );
}
