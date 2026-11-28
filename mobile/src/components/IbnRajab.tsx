import { useState } from 'react';
import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { lastPage, rajabOpening, type RajabChapter, type RajabParagraph } from '@shared/hadith';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import Reference from '@/ui/Reference';
import { UnderCard } from '@/ui/Card';
import type { Palette } from '@/lib/theme';
import { FORTY, shamelaPage } from '@/lib/hadith';

const body = (palette: Palette) => ({ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' as const });
export const rajabPlace = (paragraph: Pick<RajabParagraph, 'volume' | 'page'>) => `${FORTY.books.ibnrajab.title}، ${num(paragraph.volume)}/ ${num(paragraph.page)}`;

const pieces = (paragraph: RajabParagraph) => {
  const turns = paragraph.turns ?? [];
  return [{ page: paragraph.page, at: 0 }, ...turns].map((turn, i) => ({ page: turn.page, text: paragraph.text.slice(turn.at, turns[i]?.at ?? paragraph.text.length).trim() }));
};

function Paragraphs({ paragraphs, palette }: { paragraphs: RajabParagraph[]; palette: Palette }) {
  const mark = (volume: number, page: number) => <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'left' }}>{`${num(volume)}/ ${num(page)}`}</Text>;
  return (
    <View style={{ gap: 10 }}>
      {paragraphs.map((paragraph, i) => (
        <View key={`${paragraph.shamela}-${i}`} style={{ gap: 4 }}>
          {i > 0 && paragraph.page !== lastPage(paragraphs[i - 1]) && mark(paragraph.volume, paragraph.page)}
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

function rajabRange(first: RajabParagraph, last: RajabParagraph) {
  const end = lastPage(last);
  if (first.volume !== last.volume) return `${rajabPlace(first)}–${num(last.volume)}/ ${num(end)}`;
  return end === first.page ? rajabPlace(first) : `${rajabPlace(first)}–${num(end)}`;
}

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
        <UnderCard>
          <Button variant="plain" label={whole ? 'أقل' : 'الشرح كاملًا'} onPress={() => setWhole(was => !was)}
            accessibilityLabel={whole ? 'اطو الشرح' : 'اقرأ شرح ابن رجب للحديث كاملًا'} />
        </UnderCard>
      )}
      <Reference title={book.title} places={[rajabRange(first, last)]} editions={[book.edition]}
        quotes={[{ text: '', cite: rajabRange(first, last), url: shamelaPage('ibnrajab', first.shamela) }, { text: `${book.title}، ${book.edition}` }]} palette={palette} />
    </View>
  );
}
