import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ListTree } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import ExternalLink from '@/ui/ExternalLink';
import OpenInBook from './OpenInBook';
import { num } from '@shared/quran/arabicNumber';
import { IRAB_SOURCES, ukbariCredit, ukbariOf, ukbariPage, type BookPassage, type UkbariData } from '@shared/quran/irab';
import { irabWordsAt } from '@shared/quran/irabData';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { corpusWords } from '@shared/quran/words';
import { bookState, readBook, useBooks } from '@/lib/books';
import { surahNames } from '@/lib/branches';
import { ayahMushafWords } from '@/lib/mushaf';
import { CARD, QURAN_FONT, type Palette } from '@/lib/theme';
import { BookList } from './Books';
import Sheet from '@/ui/Sheet';

export type IrabTarget = { key: string; word: number };

/**
 * A word's i'rab (owner, 2026-11-15; docs/plans/irab.md): the ayah's words as chips, the pressed one lit; under it the
 * short line from the corpus and treebank, then al-'Ukbari's passages on the word when his book is on the phone. A
 * tap on another chip moves to that word. With no i'rab book kept, the sheet offers them.
 */
export default function IrabSheet({ target, onClose, palette }: { target: IrabTarget | null; onClose: () => void; palette: Palette }) {
  const [kept, setKept] = useState(target);
  if (target && target !== kept) setKept(target);
  return (
    <Sheet open={!!target} onClose={onClose} palette={palette}>
      {kept && <IrabBody key={`${kept.key}/${kept.word}`} target={kept} palette={palette} onClose={onClose} />}
    </Sheet>
  );
}

function IrabBody({ target, palette, onClose }: { target: IrabTarget; palette: Palette; onClose: () => void }) {
  useBooks();
  const { key } = target;
  const [surah, ayah] = key.split(':').map(Number);
  const words = useMemo(() => ayahMushafWords(key), [key]);
  const lines = useMemo(() => irabWordsAt(key), [key]);
  const [picked, setPicked] = useState(Math.min(target.word, Math.max(0, words.length - 1)));
  const corpus = corpusWords(key, picked);
  const shortOn = bookState('irab-words') === 'on';
  const ukbariOn = bookState('ukbari') === 'on';
  // null while reading the file, false when it cannot be read.
  const [ukbari, setUkbari] = useState<UkbariData | null | false>(null);
  useEffect(() => {
    let live = true;
    setUkbari(null);
    if (ukbariOn) void readBook<UkbariData>('ukbari').then(data => { if (live) setUkbari(data ?? false); });
    return () => { live = false; };
  }, [ukbariOn]);
  const passages = ukbari ? ukbariOf(ukbari, key, corpus) : [];
  // The word the role points at («صفة» of «ٱللَّهِ»), outlined among the chips.
  const heads = new Set(corpus.map(i => lines[i]?.head).filter((head): head is number => head !== null && head !== undefined));
  const headChip = words.findIndex((_, i) => corpusWords(key, i).some(c => heads.has(c)));
  const card = { ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card };
  const none = !shortOn && !ukbariOn;
  return (
    <View style={{ flexShrink: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 8 }}>
        <ListTree size={20} color={palette.muted} />
        <Text accessibilityRole="header" style={{ color: palette.muted, fontSize: 16 }}>{`${surahNames[surah] ?? num(surah)} ${num(ayah)}`}</Text>
      </View>
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 8 }}>
        {!none && (
          <View accessibilityRole="tablist" accessibilityLabel="كلمات الآية" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {words.map((word, i) => {
              const on = i === picked;
              const head = i === headChip && !on;
              return (
                <Pressable key={i} onPress={() => setPicked(i)} accessibilityRole="tab" aria-selected={on} accessibilityLabel={word}
                  style={{ ...CARD, paddingHorizontal: 10, borderWidth: 1, borderStyle: head ? 'dashed' : 'solid', borderColor: on || head ? palette.accent : palette.rule, backgroundColor: on ? palette.paperDeep : palette.card }}>
                  <Text style={{ fontFamily: QURAN_FONT, fontSize: 22, lineHeight: 40, color: on ? palette.accent : palette.ink }}>{word}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
        {shortOn && (
          <View style={{ ...card, paddingHorizontal: 14, paddingVertical: 10, gap: 4 }}>
            <Text style={{ fontFamily: QURAN_FONT, fontSize: 30, lineHeight: 56, color: palette.accent, textAlign: 'right', writingDirection: 'rtl' }}>{words[picked]}</Text>
            {corpus.map(i => lines[i] && (
              <View key={i} style={{ gap: 2 }}>
                {lines[i].role && <Text style={{ color: palette.ink, fontSize: 21, lineHeight: 34, textAlign: 'right' }}>{lines[i].role}</Text>}
                <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{lines[i].morph}</Text>
              </View>
            ))}
          </View>
        )}
        {ukbariOn && ukbari && (passages.length ? passages.map((passage, i) => <Passage key={i} passage={passage} onWord={passage.from >= 0} palette={palette} onClose={onClose} />)
          : <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right', paddingHorizontal: 2 }}>لم يتكلم العكبري على هذه الكلمة ولا على آيتها.</Text>)}
        {none && <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>لم تبقِ كتابًا للإعراب على هاتفك. اختر ما تريد، ويعمل بلا اتصال.</Text>}
        {ukbariOn && ukbari === false && (
          <Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>تعذّرت قراءة كتاب العكبري على هاتفك. احذفه ونزّله مرة أخرى.</Text>
        )}
        {(none || !ukbariOn || ukbari === false) && <BookList kind="irab" palette={palette} />}
      </ScrollView>
      {shortOn && (
        <View style={{ marginHorizontal: 16, marginTop: 6, marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {IRAB_SOURCES.map(source => <ExternalLink key={source.url} url={source.url} color={palette.muted} size={13}>{source.name}</ExternalLink>)}
        </View>
      )}
    </View>
  );
}

/** One of al-'Ukbari's passages: the book and page on top (a link to the page), then his text with Quran words in the Quran font. */
function Passage({ passage, onWord, palette, onClose }: { passage: BookPassage; onWord: boolean; palette: Palette; onClose: () => void }) {
  return (
    <View style={{ ...CARD, borderWidth: 1, borderColor: palette.rule, backgroundColor: palette.card, paddingHorizontal: 14, paddingVertical: 10, gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <ExternalLink url={ukbariPage(passage)} color={palette.muted} size={13} style={{ textAlign: 'right' }}>
            {onWord ? ukbariCredit(passage) : `${ukbariCredit(passage)}، على الآية`}
          </ExternalLink>
        </View>
        <OpenInBook book="ukbari" ayah={`${passage.surah}:${passage.ayah}`} onClose={onClose} palette={palette} />
      </View>
      <Text selectable style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }}>
        {tafsirRuns(passage.text).map((run, i) => (run.quran ? <Text key={i} style={{ fontFamily: QURAN_FONT, color: palette.accent }}>{run.text}</Text> : run.text))}
      </Text>
    </View>
  );
}
