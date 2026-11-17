import { useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { countsBySurah, placesOf } from '@shared/quran/words';
import { ayahOf, surahNames } from '@/lib/branches';
import { readAyah } from '@/lib/openReader';
import { corpusText, words } from '@/lib/words';
import { QURAN_FONT, type Palette } from '@/lib/theme';
import Sheet from '@/ui/Sheet';
import SurahStrip from './SurahStrip';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';

/** Ayat shown at first, and added by each «المزيد». */
export const PLACES_STEP = 20;

/**
 * Where a word occurs in the Quran (owner, 2026-11-13): its count, then its ayat as cards with the word in colour,
 * each opening the mushaf. A mushaf word holding two lemmas («مِمَّا») picks one at the top. docs/plans/word-counts-app.md
 */
export default function WordSheet({ lemmas, onClose, palette }: { lemmas: number[] | null; onClose: () => void; palette: Palette }) {
  // The last word stays in the sheet while it slides away; a new word starts on its first lemma and first ayat.
  const [kept, setKept] = useState({ lemmas, opened: 0 });
  if (lemmas?.length && lemmas !== kept.lemmas) setKept({ lemmas, opened: kept.opened + 1 });
  return (
    <Sheet open={!!lemmas?.length} onClose={onClose} palette={palette}>
      {kept.lemmas?.length ? <WordPlaces key={kept.opened} lemmas={kept.lemmas} onClose={onClose} palette={palette} /> : null}
    </Sheet>
  );
}

function WordPlaces({ lemmas, onClose, palette }: { lemmas: number[]; onClose: () => void; palette: Palette }) {
  const [picked, setPicked] = useState(0);
  const [shown, setShown] = useState(PLACES_STEP);
  const id = lemmas[picked];
  const places = useMemo(() => placesOf(words, id), [id]);
  const counts = useMemo(() => countsBySurah(places), [places]);
  const [surah, setSurah] = useState<number | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const tops = useRef(new Map<string, number>());
  const pending = useRef<string | null>(null);
  const [name, count, root] = words.lemmas[id];
  const open = (key: string) => { onClose(); readAyah(key); };
  // Picking a bar shows that surah's first ayah at the top of the list, loading more ayat first if it is further down.
  const pickSurah = (picked: number) => {
    setSurah(picked);
    const first = places.findIndex(place => place.key.startsWith(`${picked + 1}:`));
    const key = places[first].key;
    const top = tops.current.get(key);
    if (first < shown && top !== undefined) scroll.current?.scrollTo({ y: top, animated: false });
    else { pending.current = key; if (first >= shown) setShown(first + PLACES_STEP); }
  };
  return (
    <View style={{ flexShrink: 1 }}>
      <View style={{ paddingHorizontal: 18, paddingBottom: 10, gap: 6 }}>
        {lemmas.length > 1
          ? <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {lemmas.map((lemma, i) => (
              <Chip key={lemma} role="tab" lit quran label={mushafText(words.lemmas[lemma][0])} on={i === picked} palette={palette}
                onPress={() => { setPicked(i); setShown(PLACES_STEP); setSurah(null); tops.current.clear(); pending.current = null; }} />
            ))}
          </View>
          : <Text accessibilityRole="header" style={{ fontFamily: QURAN_FONT, fontSize: 26, lineHeight: 46, color: palette.accent, textAlign: 'right' }}>{mushafText(name)}</Text>}
        <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
          {`ترد في القرآن ${num(count)} مرة في ${num(places.length)} آية${root ? `، وجذرها «${root}»` : ''}`}
          {surah !== null && <Text style={{ color: palette.accent, fontSize: 15 }}>{`، منها ${num(counts[surah])} في ${surahNames[surah + 1]}`}</Text>}
        </Text>
        {places.length > 0 && <SurahStrip counts={counts} picked={surah} onPick={pickSurah} names={surahNames} palette={palette} />}
      </View>
      <ScrollView key={id} ref={scroll} style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 16 }}>
        {places.slice(0, shown).map(({ key, words: marked }) => {
          const [surah, number] = key.split(':').map(Number);
          const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
          const text = corpusText(ayahOf(key)?.words ?? []);
          return (
            <Card key={key} palette={palette} pad={[7, 14]} onPress={() => open(key)}
              onLayout={event => {
                const y = event.nativeEvent.layout.y;
                tops.current.set(key, y);
                if (pending.current === key) { pending.current = null; scroll.current?.scrollTo({ y, animated: false }); }
              }} accessibilityRole="button" accessibilityLabel={`افتح ${place} في المصحف`}>
              <Text style={{ fontFamily: QURAN_FONT, fontSize: 20, lineHeight: 38, color: palette.ink, textAlign: 'justify', writingDirection: 'rtl' }}>
                {text.map((word, i) => <Text key={i} style={{ fontFamily: QURAN_FONT, color: marked.includes(i) ? palette.accent : palette.ink }}>{`${i ? ' ' : ''}${mushafText(word)}`}</Text>)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <BookOpen size={16} color={palette.muted} />
                <Text style={{ color: palette.muted, fontSize: 13 }}>{place}</Text>
              </View>
            </Card>
          );
        })}
        {shown < places.length && (
          <Pressable onPress={() => setShown(shown + PLACES_STEP)} accessibilityRole="button"
            style={{ alignSelf: 'center', minHeight: 44, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, justifyContent: 'center' }}>
            <Text style={{ color: palette.ink, fontSize: 16 }}>{`المزيد (${num(places.length - shown)})`}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
