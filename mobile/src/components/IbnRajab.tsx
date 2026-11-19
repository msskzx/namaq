import { useState } from 'react';
import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { lastPage, rajabOpening, type RajabChapter, type RajabParagraph } from '@shared/hadith';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import Reference from '@/ui/Reference';
import type { Palette } from '@/lib/theme';
import { FORTY, shamelaPage } from '@/lib/hadith';

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' as const });
/** «جامع العلوم والحكم، ٢/ ١٥٠»: a paragraph's place, as the edition's two parts are cited. */
export const rajabPlace = (paragraph: Pick<RajabParagraph, 'volume' | 'page'>) => `${FORTY.books.ibnrajab.title}، ${num(paragraph.volume)}/ ${num(paragraph.page)}`;

/** A paragraph's text cut where each page it runs onto starts, with that page. */
const pieces = (paragraph: RajabParagraph) => {
  const turns = paragraph.turns ?? [];
  return [{ page: paragraph.page, at: 0 }, ...turns].map((turn, i) => ({ page: turn.page, text: paragraph.text.slice(turn.at, turns[i]?.at ?? paragraph.text.length).trim() }));
};

/** Ibn Rajab's paragraphs with their page where a new page starts: on its own line between paragraphs, in the line inside one. */
function Paragraphs({ paragraphs, palette }: { paragraphs: RajabParagraph[]; palette: Palette }) {
  const mark = (volume: number, page: number) => <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'left' }}>{`${num(volume)}/ ${num(page)}`}</Text>;
  return (
    <View style={{ gap: 10 }}>
      {paragraphs.map((paragraph, i) => (
        <View key={`${paragraph.shamela}-${i}`} style={{ gap: 4 }}>
          {i > 0 && paragraph.page !== lastPage(paragraphs[i - 1]) && mark(paragraph.volume, paragraph.page)}
          {/* A page that starts inside a paragraph is marked in its line, so the sentence it cuts reads on. */}
          <Text style={body(palette)}>
            {pieces(paragraph).map((piece, j) => (
              <Text key={j}>
                {j > 0 && <Text style={{ color: palette.muted, fontSize: 13 }}>{` [${num(paragraph.volume)}/ ${num(piece.page)}] `}</Text>}
                {piece.text}
              </Text>
            ))}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** «جامع العلوم والحكم، ١/ ٢٨٨–٢٨٩»: where the shown paragraphs run, from the first's page to the last page the last runs onto. */
function rajabRange(first: RajabParagraph, last: RajabParagraph) {
  const end = lastPage(last);
  if (first.volume !== last.volume) return `${rajabPlace(first)}–${num(last.volume)}/ ${num(end)}`;
  return end === first.page ? rajabPlace(first) : `${rajabPlace(first)}–${num(end)}`;
}

/**
 * Ibn Rajab's words on a hadith (the owner's sketch, 2026-11-18): his explanation's opening, then the whole chapter a tap away,
 * each page marked, and its reference. The hadith page shows it and the feed card shows one passage of it (`only`).
 */
export default function IbnRajab({ chapter, only, palette }: { chapter: RajabChapter; only?: RajabParagraph[]; palette: Palette }) {
  const [whole, setWhole] = useState(false);
  const opening = only ?? rajabOpening(chapter);
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
      <Reference title={rajabRange(first, last)}
        quotes={[{ text: `${book.title}، ${book.edition}` }]} links={[{ label: 'الصفحة في المكتبة الشاملة', url: shamelaPage('ibnrajab', first.shamela) }]} palette={palette} />
    </View>
  );
}
