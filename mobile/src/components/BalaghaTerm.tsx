import { View } from 'react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import Folded from '@/ui/Folded';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import itqan from '@shared/data/quran/itqanBalagha';
import { num } from '@shared/quran/arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanCredit, itqanPage } from '@shared/quran/itqanBalagha';
import { exampleWords, termCredit, termPage, type BalaghaTerm, type TermExample, type TermQuote } from '@shared/quran/balaghaTerms';
import { surahNames } from '@/lib/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import { openIntent } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import BookRuns from './quran/text/BookRuns';
import QuranWords from './quran/text/QuranWords';

/**
 * The pieces of the balagha terms page (shared/quran/balaghaTerms.ts), shared by the term's page and its feed card: a
 * book's words with the Quran in them coloured, a term's defining quotes each with its folded credit, and an example of
 * al-Suyuti's with the ayah words he quotes lit.
 */
const TALKHIS_EDITION = 'تلخيص المفتاح لجلال الدين القزويني (ت ٧٣٩هـ)، متنًا فوق شرح بهاء الدين السبكي «عروس الأفراح في شرح تلخيص المفتاح»، تحقيق عبد الحميد هنداوي، المكتبة العصرية، ١٤٢٣هـ/٢٠٠٣م';
/** The lit ayah words: a deeper band than the reader's (BalaghaSheet). */
const lit = (palette: Palette) => `${palette.ink}33`;

/** A book's words, its ﴿…﴾ quotes in the mushaf's font and the accent (BookRuns). `lines` cuts it short (a feed card). */
export function BookWords({ text, palette, lines, size = 18 }: { text: string; palette: Palette; lines?: number; size?: number }) {
  return (
    <BookRuns text={text} quran={palette.accent} lines={lines} style={{ color: palette.ink, fontSize: size, lineHeight: size * 1.85, textAlign: 'right', writingDirection: 'rtl' }} />
  );
}

/** A quote's credit, folded: the edition, and the page on Shamela. */
function QuoteCredit({ quote, palette }: { quote: TermQuote; palette: Palette }) {
  return (
    <Folded credit={termCredit(quote)} palette={palette}>
      <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
        {quote.book === 'itqan'
          ? `${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، الفقرة كاملة كما في الكتاب.`
          : `${TALKHIS_EDITION}. كلام القزويني في أعلى الصفحة، من نسخة المكتبة الشاملة التي نشرها موقع تراث. لم يعرّفه السيوطي في الإتقان، فنقلنا تعريف القزويني.`}
      </Text>
      <ExternalLink url={termPage(quote)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
    </Folded>
  );
}

const BY: Record<TermQuote['book'], string> = { itqan: 'قال السيوطي في الإتقان:', talkhis: 'قال القزويني في تلخيص المفتاح:' };

/** What heads a term's quotes: «تعريفه» where they define it, otherwise what al-Suyuti says under his heading. */
export const quotesTitle = (term: Pick<BalaghaTerm, 'defines'>) => (term.defines ? 'تعريفه' : 'قال السيوطي تحت هذا العنوان');

/** A term's quotes in one card, each whole, with its credit under it. */
export function TermQuotes({ term, palette }: { term: BalaghaTerm; palette: Palette }) {
  const mixed = new Set(term.quotes.map(quote => quote.book)).size > 1;
  return (
    <Card palette={palette} pad={[10, 14]} gap={4}>
      <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right' }}>{quotesTitle(term)}</Text>
      {term.quotes.map((quote, i) => (
        <View key={`${quote.book}${quote.id}/${i}`}>
          {/* Two books on one term: each book's words under its name. */}
          {mixed && quote.book !== term.quotes[i - 1]?.book && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', marginTop: i ? 8 : 0 }}>{BY[quote.book]}</Text>}
          <BookWords text={quote.text} palette={palette} />
          <QuoteCredit quote={quote} palette={palette} />
        </View>
      ))}
    </Card>
  );
}

/** «القيامة ٢٩» or «القيامة ٢٩–٣٠». */
export function ayatName(ayat: string[]) {
  const [surah, first] = ayat[0].split(':').map(Number);
  const last = Number(ayat.at(-1)!.split(':')[1]);
  const sameSurah = ayat.every(key => Number(key.split(':')[0]) === surah);
  return `${surahNames[surah] ?? num(surah)} ${num(first)}${sameSurah && last !== first ? `–${num(last)}` : ''}`;
}

/** The ayat of an example in the mushaf's font, with the words he quotes lit and each ayah's number after it. */
export function ExampleAyat({ example, palette, size = 23 }: { example: Pick<TermExample, 'entry' | 'ayat'>; palette: Palette; size?: number }) {
  return (
    <QuranWords style={{ fontSize: size, lineHeight: size * 2, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
      {example.ayat.map((key, k) => {
        const runs = exampleWords(itqan, example, key);
        const number = Number(key.split(':')[1]);
        return ayahMushafWords(key).map((word, i) => (
          <Text key={`${key}/${i}`} style={runs.some(([from, to]) => i >= from && i <= to) ? { backgroundColor: lit(palette) } : undefined}>{`${k || i ? ' ' : ''}${word}`}</Text>
        )).concat(<Text key={`${key}#`}>{` ${num(number)}`}</Text>);
      })}
    </QuranWords>
  );
}

/** One example: the ayat with his quoted words lit, his paragraph whole (unless the definition above already quotes it), its credit, and the ayat as links to the mushaf. */
export function TermExampleCard({ example, palette }: { example: TermExample & { inDefinition?: boolean }; palette: Palette }) {
  return (
    <Card palette={palette} pad={[10, 14]} gap={6}>
      <ExampleAyat example={example} palette={palette} />
      <View style={{ height: 1, backgroundColor: palette.rule, opacity: 0.6 }} />
      {example.inDefinition
        ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>ذكرها في كلامه المنقول في التعريف أعلاه.</Text>
        : <BookWords text={example.text} palette={palette} />}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingTop: 2 }}>
        {example.ayat.map(key => {
          const [surah, number] = key.split(':').map(Number);
          const name = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          return <Chip key={key} small label={name} on={false} palette={palette} accessibilityLabel={`افتح ${name} في المصحف`} onPress={() => openIntent({ tab: 'read', at: key })} />;
        })}
      </View>
      <Folded credit={itqanCredit(example)} palette={palette}>
        <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
          {`${ITQAN_BOOK}، ${ITQAN_EDITION}. الفقرة كاملة كما في الكتاب، تحت عنوانه.`}
        </Text>
        <ExternalLink url={itqanPage(example)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
      </Folded>
    </Card>
  );
}
