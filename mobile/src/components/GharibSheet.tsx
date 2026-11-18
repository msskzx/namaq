import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { BookA } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
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
import Card from '@/ui/Card';
import Tabs from '@/ui/Tabs';
import Folded from '@/ui/Folded';
import Pickable from '@/ui/Pickable';
import QuranWords from './quran/text/QuranWords';
import BookRuns from './quran/text/BookRuns';

export type GharibTarget = { key: string; word: number };

/** The ayah's words in a card, the lit ones on a deeper band (BalaghaSheet's). */
const deepBand = (palette: Palette) => `${palette.ink}33`;
type Book = 'gharib' | 'mufradat';
const BOOK_NAMES: Record<Book, string> = { gharib: 'غريب القرآن لابن قتيبة', mufradat: 'المفردات للراغب' };

/**
 * A word's meaning (owner, 2026-11-18; docs/plans/alfaz-al-quran.md), from two books picked with pills, like the balagha
 * sheet. Ibn Qutaybah: his entries on the ayah, whole, the ones on the pressed word first; a tap on one lights the words
 * it quotes. Al-Raghib: his whole article on the word's root. A book with nothing on the word or ayah has no pill.
 */
export default function GharibSheet({ target, onClose, palette }: { target: GharibTarget | null; onClose: () => void; palette: Palette }) {
  const [kept, setKept] = useState(target);
  if (target && target !== kept) setKept(target);
  return (
    <Sheet open={!!target} onClose={onClose} palette={palette}>
      {kept && <GharibBody key={`${kept.key}/${kept.word}`} target={kept} palette={palette} />}
    </Sheet>
  );
}

function GharibBody({ target, palette }: { target: GharibTarget; palette: Palette }) {
  useBooks();
  const { key, word } = target;
  const [surah, ayah] = key.split(':').map(Number);
  const words = useMemo(() => ayahMushafWords(key), [key]);
  const gharibOn = bookState('gharib') === 'on';
  const mufradatOn = bookState('mufradat') === 'on';
  // The entries on the pressed word first, then the ayah's others, each in his order.
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
        <BookA size={20} color={palette.muted} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${num(ayah)}`}</Text>
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        <Card palette={palette} pad={[10, 14]}>
          <QuranWords style={{ fontSize: 23, lineHeight: 46, color: palette.ink, textAlign: 'right', writingDirection: 'rtl' }}>
            {words.map((text, i) => (
              <Text key={i} style={lit.some(([from, to]) => i >= from && i <= to) ? { backgroundColor: deepBand(palette) } : undefined}>{`${i ? ' ' : ''}${text}`}</Text>
            ))}
          </QuranWords>
        </Card>
        {books.length > 1 && <Tabs options={books.map(book => ({ key: book, label: BOOK_NAMES[book] }))} value={shown} onChange={book => { setShown(book); setPicked(null); }} palette={palette} />}
        {!gharibOn && !mufradatOn ? <BookList kind="gharib" palette={palette} />
          : !books.length ? <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'center', paddingVertical: 16 }}>لا كلام في الكتابين على هذه الكلمة.</Text>
          : (books.length === 1 ? books[0] : shown) === 'gharib'
            ? <Gharib entries={entries} picked={picked} onPick={setPicked} palette={palette} />
            : article && <Mufradat article={article} palette={palette} />}
      </ScrollView>
    </View>
  );
}

function Gharib({ entries, picked, onPick, palette }: { entries: GharibAt[]; picked: number | null; onPick: (at: number) => void; palette: Palette }) {
  return entries.map((entry, i) => (
    <Card key={entry.at} palette={palette} pad={[10, 14]} picked={picked === i}>
      {/* The entry lights the words it quotes; its reference below is a control of its own. */}
      <Pickable picked={picked === i} onPick={() => onPick(i)}>
        <BookRuns text={entry.text} quran={palette.accent} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }} />
      </Pickable>
      <Folded credit={gharibCredit(entry)} palette={palette}>
        <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
          {`${GHARIB_BOOK}، ${GHARIB_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، كلام ابن قتيبة وحده بلا حواشي المحقق.`}
        </Text>
        <ExternalLink url={gharibPage(entry)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
      </Folded>
    </Card>
  ));
}

function Mufradat({ article, palette }: { article: MufradatEntry; palette: Palette }) {
  return (
    <Card palette={palette} pad={[10, 14]}>
      <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>{`[${article[0]}]`}</Text>
      <BookRuns text={article[4]} quran={palette.accent} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }} />
      <Folded credit={mufradatCredit(article)} palette={palette}>
        <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>
          {`${MUFRADAT_BOOK}، ${MUFRADAT_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، كلام الراغب وحده بلا حواشي المحقق. المادة كاملة تحت عنوانه، ووُصلت بالكلمة من جذرها في المدونة القرآنية.`}
        </Text>
        <ExternalLink url={mufradatPage(article)} color={palette.muted} size={14} style={{ textAlign: 'right' }}>اقرأ الصفحة</ExternalLink>
      </Folded>
    </Card>
  );
}
