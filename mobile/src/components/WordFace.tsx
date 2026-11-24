import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import PostHead from '@/ui/PostHead';
import OpenButton from '@/ui/OpenButton';
import { CardWithRow } from '@/ui/Card';
import FactCells from '@/ui/FactCells';
import QuoteBar from '@/ui/QuoteBar';
import TraitChips from '@/ui/TraitChips';
import type { Source } from '@/ui/sourceSlot';
import gharib from '@shared/data/quran/gharib';
import { num } from '@shared/quran/arabicNumber';
import { MUFRADAT_BOOK, MUFRADAT_EDITION, mufradatCredit, mufradatPage, type GharibPlaced, type MufradatEntry } from '@shared/quran/gharib';
import { meaningBranches, mostIn, raghibOpening } from '@shared/quran/wordFace';
import { surahNames } from '@/lib/branches';
import type { Palette } from '@/lib/theme';
import { QuranWord } from './quran/text/AyahFlow';
import BookRuns from './quran/text/BookRuns';
import { gharibSource } from './GharibSheet';
import { FEATURE_ICON } from './featureIcons';

const CORPUS: Source = { line: 'المدوّنة القرآنية العربية', quotes: [{ text: 'تُعدّ الكلمة بمدخلها المعجمي كما حلّلتها المدوّنة القرآنية العربية (الإصدار ٠٫٤).' }] };

const bookStyle = { color: '', fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' } as const;

/**
 * The head of a word's page (owner, 2026-11-24: sketch quran-design/word-page, designs أ and ب together, with its «أصلها»
 * and «مواضعها»): the word with its root and counts as a person's card gives his, al-Raghib's opening words on its root,
 * then Ibn Qutaybah's meanings of it hung as a tree's branches, the picked one's entry whole under them. The ayat follow it
 * on the page (components/WordSheet.tsx WordView).
 */
export default function WordFace({ name, root, count, ayat, counts, entries, article, onOpen, onWhole, palette }: {
  name: string; root?: string; count: number; ayat: number; counts: number[]; entries: GharibPlaced[];
  article?: MufradatEntry; onOpen: (key: string) => void;
  /** Opens al-Raghib's whole article in the page's own section. */
  onWhole: () => void; palette: Palette;
}) {
  const surahs = counts.filter(Boolean).length;
  const most = mostIn(counts);
  const opening = useMemo(() => (article ? raghibOpening(article[4]) : null), [article]);
  const branches = useMemo(() => meaningBranches(gharib, entries), [entries]);
  const [picked, setPicked] = useState(0);
  const branch = branches[Math.min(picked, branches.length - 1)];
  const placeOf = (key: string) => { const [surah, number] = key.split(':').map(Number); return `${surahNames[surah] ?? num(surah)} ${num(number)}`; };
  return (
    <View style={{ gap: 18 }}>
      <CardWithRow palette={palette} pad={0} gap={0} clip source={[CORPUS]}>
        <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 8 }}>
          <QuranWord header look={{ color: palette.accent }} place={{ textAlign: 'right' }}>{name}</QuranWord>
          {root ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`جذرها «${root}»`}</Text> : null}
        </View>
        <FactCells palette={palette} cells={[
          { key: 'count', label: 'مرات ورودها', readings: [{ value: num(count) }] },
          { key: 'ayat', label: 'آياتها', readings: [{ value: num(ayat) }] },
          { key: 'surahs', label: 'سورها', readings: [{ value: num(surahs) }] },
        ]} />
        {most && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', paddingHorizontal: 14, paddingVertical: 8 }}>
          {`أكثرها في ${most.surahs.map(surah => surahNames[surah]).join(' و')}، ${num(most.count)}${most.surahs.length > 1 ? ' لكلٍّ' : ''}`}
        </Text>}
      </CardWithRow>
      {article && (
        <View style={{ gap: 4 }}>
          <PostHead Icon={FEATURE_ICON.words} title="أصلها" sub={`جذرها «${article[0]}» عند الراغب`} palette={palette} />
          <CardWithRow palette={palette} pad={[10, 14]} gap={6} lead={<OpenButton label="كلام الراغب فيها كاملًا" onPress={onWhole} />}
            source={[{ line: MUFRADAT_BOOK, quotes: [{ text: '', cite: mufradatCredit(article), url: mufradatPage(article) }], editions: [MUFRADAT_EDITION] }]}>
            <QuoteBar by="قال الراغب:" palette={palette}>
              {opening ? <BookRuns text={opening.text} quran={palette.accent} style={{ ...bookStyle, color: palette.ink }} />
                : <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>يفتتح كلامه فيها بآية، فاقرأه كاملًا.</Text>}
            </QuoteBar>
          </CardWithRow>
        </View>
      )}
      {branch && (
        <View style={{ gap: 4 }}>
          <PostHead Icon={FEATURE_ICON.words} title="معانيها في القرآن" sub="عند ابن قتيبة، بلفظه" palette={palette} />
          <CardWithRow palette={palette} pad={[10, 14]} gap={10} source={gharibSource(branch)}
            lead={<OpenButton label={`افتح ${placeOf(branch.key)} في المصحف`} onPress={() => onOpen(branch.key)} />}>
            {branches.length > 1 && <View>
              <QuranWord look={{ color: palette.accent }} place={{ textAlign: 'right' }}>{name}</QuranWord>
              <TraitChips branches palette={palette} picked={picked} onPick={setPicked}
                traits={branches.map(each => ({ label: each.meaning, names: [], agreed: false, place: placeOf(each.key) }))} />
            </View>}
            <QuoteBar by={`قال ابن قتيبة في ${placeOf(branch.key)}:`} palette={palette}>
              <BookRuns text={branch.text.replace(/^[٠-٩]+-\s*/, '')} quran={palette.accent} style={{ ...bookStyle, color: palette.ink }} />
            </QuoteBar>
          </CardWithRow>
        </View>
      )}
    </View>
  );
}
