import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { SharedCard } from '@/ui/CardShare';
import { sourcesOf } from '@/ui/SourceLine';
import Chip from '@/ui/Chip';
import itqan from '@shared/data/quran/itqanBalagha';
import { num } from '@shared/quran/arabicNumber';
import { exampleSource, exampleWords, termSource, type BalaghaTerm, type TermExample, type TermQuote } from '@shared/quran/balaghaTerms';
import { surahNames } from '@/lib/branches';
import { placesLabel } from '@shared/quran/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import { openIntent } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import BookRuns from './quran/text/BookRuns';
import LitAyat from './quran/text/LitAyat';


export function BookWords({ text, palette, lines, size = 18 }: { text: string; palette: Palette; lines?: number; size?: number }) {
  return (
    <BookRuns text={text} quran={palette.accent} lines={lines} style={{ color: palette.ink, fontSize: size, lineHeight: size * 1.85, textAlign: 'right', writingDirection: 'rtl' }} />
  );
}

const BY: Record<TermQuote['book'], string> = { itqan: 'قال السيوطي في الإتقان:', talkhis: 'قال القزويني في تلخيص المفتاح:' };

export const quotesTitle = (term: Pick<BalaghaTerm, 'defines'>) => (term.defines ? 'تعريفه' : 'من كلام السيوطي عليه');

export function TermQuotes({ term, head, palette }: { term: BalaghaTerm;
  head?: React.ReactNode; palette: Palette }) {
  const mixed = new Set(term.quotes.map(quote => quote.book)).size > 1;
  return (
    <SharedCard palette={palette} pad={[10, 14]} gap={4} source={sourcesOf(term.quotes.map(termSource))} shareHead={head} shareLabel={`شارك ${quotesTitle(term)}`}>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{quotesTitle(term)}</Text>
      {term.quotes.map((quote, i) => (
        <View key={`${quote.book}${quote.id}/${i}`}>
          {mixed && quote.book !== term.quotes[i - 1]?.book && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', marginTop: i ? 8 : 0 }}>{BY[quote.book]}</Text>}
          <BookWords text={quote.text} palette={palette} />
        </View>
      ))}
    </SharedCard>
  );
}

export const ayatName = (ayat: string[]) => placesLabel(ayat, surahNames);

export function ExampleAyat({ example, palette }: { example: Pick<TermExample, 'entry' | 'ayat'>; palette: Palette }) {
  return <LitAyat ayat={example.ayat.map(key => ({ words: ayahMushafWords(key), lit: exampleWords(itqan, example, key), number: Number(key.split(':')[1]) }))} menu={example.ayat} palette={palette} />;
}

export function TermExampleCard({ example, head, palette }: { example: TermExample & { inDefinition?: boolean }; head?: React.ReactNode; palette: Palette }) {
  return (
    <SharedCard palette={palette} pad={[10, 14]} gap={6} source={sourcesOf([exampleSource(example)])} shareHead={head} shareLabel={`شارك المثال ${ayatName(example.ayat)}`} row={
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 4 }}>
        {example.ayat.map(key => {
          const [surah, number] = key.split(':').map(Number);
          const name = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          return <Chip key={key} small label={name} on={false} palette={palette} accessibilityLabel={`افتح ${name} في المصحف`} onPress={() => openIntent({ tab: 'read', at: key })} />;
        })}
      </View>}>
      <ExampleAyat example={example} palette={palette} />
      <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6 }} />
      {example.inDefinition
        ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>ذكرها في كلامه المنقول في التعريف أعلاه.</Text>
        : <BookWords text={example.text} palette={palette} />}
    </SharedCard>
  );
}
