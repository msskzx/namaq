import { Fragment, useMemo } from 'react';
import { View } from 'react-native';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import PostHead from '@/ui/PostHead';
import QuoteBar from '@/ui/QuoteBar';
import FactCells from '@/ui/FactCells';
import { CardWithRow } from '@/ui/Card';
import type { Source } from '@/ui/sourceSlot';
import answers from '@shared/data/quran/mutashabihAnswers';
import { cardAnswers, type CardAnswer } from '@shared/quran/mutashabih/bookAnswer';
import { TAGS, type Group } from '@shared/quran/mutashabih/types';
import { num } from '@shared/quran/arabicNumber';
import { openBookPage } from '@/lib/ways';
import type { Palette } from '@/lib/theme';
import DifferenceWords from './quran/text/DifferenceWords';
import BookRuns from './quran/text/BookRuns';
import { FEATURE_ICON } from './featureIcons';

/** «كتاب واحد», «كتابان», «٣ كتب»: how many books set the card's ayat side by side. */
const booksCount = (count: number) => (count === 1 ? 'كتاب واحد' : count === 2 ? 'كتابان' : `${num(count)} كتب`);
/** The page his answer starts on, as the book's own pages are named: al-Kirmani's one volume by page, the others by part and page. */
const pageName = (answer: CardAnswer) => { const [part, page] = answer.page.split(':').map(Number); return answer.book === 'K' ? `ص ${num(page)}` : `ج ${num(part)} ص ${num(page)}`; };

/**
 * Under a book card's ayat (owner, 2026-11-24: sketch quran-design/mutashabih-page, design أ): how many places it joins, the
 * kinds of difference its books name and how many books name it, then the words the ayat differ by.
 */
export function MutashabihCells({ group, palette }: { group: Group; palette: Palette }) {
  const books = new Set(group.citations.map(citation => citation.book.split('،')[0])).size;
  const differing = group.tags.map(tag => group.words?.[tag]).find(Boolean);
  return (
    <View style={{ direction: 'rtl', gap: 8 }}>
      <FactCells open palette={palette} cells={[
        { key: 'places', label: 'مواضعه', readings: [{ value: num(group.places.length) }] },
        ...(group.tags.length ? [{ key: 'kinds', label: 'الفرق', readings: group.tags.map(tag => ({ value: TAGS[tag].ar })) }] : []),
        { key: 'books', label: 'ذكرته', readings: [{ value: booksCount(books) }] },
      ]} />
      {differing && <View style={{ alignItems: 'center' }}><DifferenceWords words={differing} color={palette.accent} fontSize={20} /></View>}
    </View>
  );
}

/**
 * «لماذا؟» after a book card (design أ): each book that sets its ayat side by side gives its reason in its own words, from
 * where its answer starts (shared/quran/mutashabih/bookAnswer.ts), oldest author first; «اقرأ الباقي» opens his book at that page.
 */
export function BookAnswers({ group, palette }: { group: Group; palette: Palette }) {
  const shown = useMemo(() => cardAnswers(group.citations, answers), [group]);
  if (!shown.length) return null;
  const source: Source[] = shown.map(answer => ({ line: answer.title, quotes: [{ text: '', cite: pageName(answer) }] }));
  return (
    <View style={{ gap: 4, paddingTop: 18 }}>
      <PostHead Icon={FEATURE_ICON.trees} title="لماذا؟" sub="عند أهل المتشابه، بلفظهم" palette={palette} />
      <CardWithRow palette={palette} pad={[10, 14]} gap={12} source={source}>
        {shown.map((answer, at) => (
          <Fragment key={answer.id}>
            {at > 0 && <View style={{ height: 1, backgroundColor: `${palette.rule}66` }} />}
            <QuoteBar by={`قال ${answer.name}:`} palette={palette} foot={
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Text style={{ flexShrink: 1, color: palette.muted, fontSize: 13, textAlign: 'right' }}>{`${answer.title}، ${pageName(answer)}`}</Text>
                {answer.cut && <Button variant="plain" label="اقرأ الباقي" accessibilityLabel={`اقرأ كلام ${answer.name} كاملًا في ${answer.title}`} onPress={() => openBookPage(answer.reader, answer.page)} />}
              </View>}>
              <BookRuns text={answer.text} quran={palette.accent} style={{ color: palette.ink, fontSize: 17, lineHeight: 32, textAlign: 'right', writingDirection: 'rtl' }} />
            </QuoteBar>
          </Fragment>
        ))}
      </CardWithRow>
    </View>
  );
}
