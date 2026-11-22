import { View } from 'react-native';
import { Text } from '@/ui/Text';
import { CardWithRow } from '@/ui/Card';
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

/**
 * The pieces of the balagha terms page (shared/quran/balaghaTerms.ts), shared by the term's page and its feed card: a
 * book's words with the Quran in them coloured, a term's defining quotes each with its folded credit, and an example of
 * al-Suyuti's with the ayah words he quotes lit.
 */

/** A book's words, its ﴿…﴾ quotes in the mushaf's font and the accent (BookRuns). `lines` cuts it short (a feed card). */
export function BookWords({ text, palette, lines, size = 18 }: { text: string; palette: Palette; lines?: number; size?: number }) {
  return (
    <BookRuns text={text} quran={palette.accent} lines={lines} style={{ color: palette.ink, fontSize: size, lineHeight: size * 1.85, textAlign: 'right', writingDirection: 'rtl' }} />
  );
}

const BY: Record<TermQuote['book'], string> = { itqan: 'قال السيوطي في الإتقان:', talkhis: 'قال القزويني في تلخيص المفتاح:' };

/** What heads a term's quotes: «تعريفه» where they define it, otherwise his words on it. */
export const quotesTitle = (term: Pick<BalaghaTerm, 'defines'>) => (term.defines ? 'تعريفه' : 'من كلام السيوطي عليه');

/** A term's quotes in one card, each whole, their books on the line under it (owner 2026-11-20). */
export function TermQuotes({ term, palette }: { term: BalaghaTerm; palette: Palette }) {
  const mixed = new Set(term.quotes.map(quote => quote.book)).size > 1;
  return (
    <CardWithRow palette={palette} pad={[10, 14]} gap={4} source={sourcesOf(term.quotes.map(termSource))}>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{quotesTitle(term)}</Text>
      {term.quotes.map((quote, i) => (
        <View key={`${quote.book}${quote.id}/${i}`}>
          {/* Two books on one term: each book's words under its name. */}
          {mixed && quote.book !== term.quotes[i - 1]?.book && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', marginTop: i ? 8 : 0 }}>{BY[quote.book]}</Text>}
          <BookWords text={quote.text} palette={palette} />
        </View>
      ))}
    </CardWithRow>
  );
}

/** «القيامة ٢٩–٣٠», «المسد ١، ٤–٥», «الأنفال ٢، القصص ٤، غافر ٣٦» (placesLabel). */
export const ayatName = (ayat: string[]) => placesLabel(ayat, surahNames);

/** The ayat of an example in the mushaf's font, with the words he quotes lit and each ayah's number after it. */
export function ExampleAyat({ example, palette }: { example: Pick<TermExample, 'entry' | 'ayat'>; palette: Palette }) {
  return <LitAyat ayat={example.ayat.map(key => ({ words: ayahMushafWords(key), lit: exampleWords(itqan, example, key), number: Number(key.split(':')[1]) }))} menu={example.ayat[0] ?? false} palette={palette} />;
}

/**
 * One example: the ayat with his quoted words lit and his paragraph whole (unless the definition above already quotes it);
 * under the card each ayah as a chip to the mushaf, then his book on the line (owner 2026-11-20).
 */
export function TermExampleCard({ example, palette }: { example: TermExample & { inDefinition?: boolean }; palette: Palette }) {
  return (
    <CardWithRow palette={palette} pad={[10, 14]} gap={6} source={sourcesOf([exampleSource(example)])} row={
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
    </CardWithRow>
  );
}
