import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { FEATURE_ICON } from './featureIcons';
import { Text } from '@/ui/Text';
import gharib from '@shared/data/quran/gharib';
import mufradat from '@shared/data/quran/mufradat';
import { num } from '@shared/quran/arabicNumber';
import { GHARIB_BOOK, GHARIB_EDITION, MUFRADAT_BOOK, MUFRADAT_EDITION, gharibAt, gharibCredit, gharibOfWord, gharibPage, mufradatCredit, mufradatOf, mufradatPage, type GharibAt, type MufradatEntry } from '@shared/quran/gharib';
import { bookState, useBooks } from '@/lib/books';
import { surahNames } from '@/lib/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import type { Palette } from '@/lib/theme';
import { BookList } from './Books';
import Sheet from '@/ui/Sheet';
import Card, { CardWithRow } from '@/ui/Card';
import { NoShare, SharedCard } from '@/ui/CardShare';
import Tabs from '@/ui/Tabs';
import Pickable from '@/ui/Pickable';
import LitAyat from './quran/text/LitAyat';
import BookRuns from './quran/text/BookRuns';

export type GharibTarget = { key: string; word: number };

type Book = 'gharib' | 'mufradat';
export const BOOK_NAMES: Record<Book, string> = { gharib: 'غريب القرآن لابن قتيبة', mufradat: 'المفردات للراغب' };

// see docs/plans/alfaz-al-quran.md
export default function GharibSheet({ target, onClose, palette }: { target: GharibTarget | null; onClose: () => void; palette: Palette }) {
  const [kept, setKept] = useState(target);
  if (target && target !== kept) setKept(target);
  return (
    <Sheet open={!!target} onClose={onClose} palette={palette}>
      <NoShare.Provider value>
      {kept && <GharibBody key={`${kept.key}/${kept.word}`} target={kept} palette={palette} />}
      </NoShare.Provider>
    </Sheet>
  );
}

export function GharibBody({ target, palette }: { target: GharibTarget; palette: Palette }) {
  useBooks();
  const { key, word } = target;
  const [surah, ayah] = key.split(':').map(Number);
  const words = useMemo(() => ayahMushafWords(key), [key]);
  const gharibOn = bookState('gharib') === 'on';
  const mufradatOn = bookState('mufradat') === 'on';
  const entries = useMemo(() => {
    if (!gharibOn) return [];
    const all = gharibAt(gharib, key);
    const own = gharibOfWord(all, word);
    return [...own, ...all.filter(entry => !own.includes(entry))];
  }, [key, word, gharibOn]);
  const article = useMemo(() => (mufradatOn ? mufradatOf(mufradat, key, word) : null), [key, word, mufradatOn]);
  const books = (['gharib', 'mufradat'] as const).filter(book => (book === 'gharib' ? entries.length : article));
  const ownWord = entries.length > 0 && gharibOfWord(entries, word).length > 0;
  const [shown, setShown] = useState<Book>(ownWord || !article ? 'gharib' : 'mufradat');
  const [picked, setPicked] = useState<number | null>(null);
  const lit: [number, number][] = shown === 'gharib' && picked !== null ? entries[picked]?.words ?? [] : [[word, word]];
  return (
    <View style={{ flexShrink: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
        <FEATURE_ICON.words size={20} color={palette.muted} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${num(ayah)}`}</Text>
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        <Card palette={palette} pad={[10, 14]}>
          <LitAyat ayat={[{ words, lit }]} menu={false} palette={palette} />
        </Card>
        {books.length > 1 && <Tabs options={books.map(book => ({ key: book, label: BOOK_NAMES[book] }))} value={shown} onChange={book => { setShown(book); setPicked(null); }} palette={palette} />}
        {!books.length && !(gharibOn && mufradatOn) ? null
          : !books.length ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 16 }}>لا كلام في الكتابين على هذه الكلمة.</Text>
          : (books.length === 1 ? books[0] : shown) === 'gharib'
            ? <Gharib entries={entries} picked={picked} onPick={setPicked} palette={palette} />
            : article && <Mufradat article={article} palette={palette} />}
        {(!gharibOn || !mufradatOn) && <BookList kind="gharib" palette={palette} />}
      </ScrollView>
    </View>
  );
}

export const gharibSource = (entry: { page: number; id: number }) => [{ line: GHARIB_BOOK, quotes: [{ text: '', cite: gharibCredit(entry), url: gharibPage(entry) },
  { text: `${GHARIB_BOOK}، ${GHARIB_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، كلام ابن قتيبة وحده بلا حواشي المحقق.` }],
  places: [`ص ${num(entry.page)}`], editions: [GHARIB_EDITION] }];

function Gharib({ entries, picked, onPick, palette }: { entries: GharibAt[]; picked: number | null; onPick: (at: number) => void; palette: Palette }) {
  return entries.map((entry, i) => (
    <CardWithRow key={entry.at} palette={palette} pad={[10, 14]} picked={picked === i} source={gharibSource(entry)}>
      <Pickable picked={picked === i} onPick={() => onPick(i)}>
        <BookRuns text={entry.text} quran={palette.accent} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }} />
      </Pickable>
    </CardWithRow>
  ));
}

export function Mufradat({ article, head, palette }: { article: MufradatEntry;
  head?: React.ReactNode; palette: Palette }) {
  return (
    <SharedCard palette={palette} pad={[10, 14]} shareHead={head} shareLabel="شارك كلام الراغب" source={[{ line: MUFRADAT_BOOK, quotes: [{ text: '', cite: mufradatCredit(article), url: mufradatPage(article) },
      { text: `${MUFRADAT_BOOK}، ${MUFRADAT_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، كلام الراغب وحده بلا حواشي المحقق. المادة كاملة تحت عنوانه، ووُصلت بالكلمة من جذرها في المدونة القرآنية.` }],
      places: [`ص ${num(article[1])}${article[2] !== article[1] ? `–${num(article[2])}` : ''}`], editions: [MUFRADAT_EDITION] }]}>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`[${article[0]}]`}</Text>
      <BookRuns text={article[4]} quran={palette.accent} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }} />
    </SharedCard>
  );
}
