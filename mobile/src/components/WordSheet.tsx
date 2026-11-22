import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ComponentRef, type MutableRefObject } from 'react';
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '@/ui/Text';
import gharib from '@shared/data/quran/gharib';
import gharibWords from '@shared/data/quran/gharibWords.json';
import mufradat from '@shared/data/quran/mufradat';
import { num } from '@shared/quran/arabicNumber';
import { countsBySurah, lemmasAtMushafWord, mushafPlacesOf, placesOf } from '@shared/quran/words';
import { gharibOfPlaces, mufradatOfPlaces, type GharibPlaced, type GharibWordsData } from '@shared/quran/gharib';
import { ayahOf, surahNames } from '@/lib/branches';
import { readAyah } from '@/lib/openReader';
import { bookState, useBooks } from '@/lib/books';
import { ayahMushafWords } from '@/lib/mushaf';
import { TOP, nextCompact, type ScrollPoint } from '@/lib/scrollShrink';
import { corpusText, words } from '@/lib/words';
import type { Palette } from '@/lib/theme';
import { hiddenProps, useSlideAway } from '@/ui/motion';
import AyahFlow, { AyahWords, QuranWord } from './quran/text/AyahFlow';
import LitAyat from './quran/text/LitAyat';
import BookRuns from './quran/text/BookRuns';
import { BOOK_NAMES, Mufradat, gharibSource } from './GharibSheet';
import Sheet from '@/ui/Sheet';
import SurahStrip from './SurahStrip';
import Card, { CardWithRow } from '@/ui/Card';
import Chip from '@/ui/Chip';
import Tabs from '@/ui/Tabs';
import IconButton from '@/ui/IconButton';
import { FEATURE_ICON } from '@/components/featureIcons';

/** Ayat (or Ibn Qutaybah's entries) shown at first, and added by each «المزيد». */
export const PLACES_STEP = 20;

type Section = 'places' | 'gharib' | 'mufradat';

/** How long after the list's own jump its scroll events go on arriving. */
const SETTLE_MS = 150;

/**
 * Where a word occurs in the Quran (owner, 2026-11-13) as a sheet: from the mushaf's long press and from search. The words
 * page opens the same view as a page of its own (screens/word.tsx).
 */
export default function WordSheet({ lemmas, onClose, palette }: { lemmas: number[] | null; onClose: () => void; palette: Palette }) {
  // The last word stays in the sheet while it slides away; a new word starts on its first lemma and first ayat.
  const [kept, setKept] = useState({ lemmas, opened: 0 });
  if (lemmas?.length && lemmas !== kept.lemmas) setKept({ lemmas, opened: kept.opened + 1 });
  return (
    <Sheet open={!!lemmas?.length} onClose={onClose} palette={palette}>
      {kept.lemmas?.length ? <SheetWord key={kept.opened} lemmas={kept.lemmas} onOpen={onClose} palette={palette} /> : null}
    </Sheet>
  );
}

/** Each word opened in the sheet starts with its top shown, whatever the last one was scrolled to. */
function SheetWord({ lemmas, onOpen, palette }: { lemmas: number[]; onOpen: () => void; palette: Palette }) {
  const [hidden, onScroll, reveal] = useHideOnScroll();
  return <WordView lemmas={lemmas} onOpen={onOpen} hidden={hidden} onScroll={onScroll} reveal={reveal} palette={palette} />;
}

/** A scroll view's own hide-on-scroll (the sheet's), by the same rule as the app's bars (lib/scrollShrink.ts). */
export function useHideOnScroll(): [boolean, (event: NativeSyntheticEvent<NativeScrollEvent>) => void, () => void] {
  const [hidden, setHidden] = useState(false);
  const last = useRef<ScrollPoint | null>(null);
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const now = { y: contentOffset.y, maxY: Math.max(0, contentSize.height - layoutMeasurement.height) };
    setHidden(was => nextCompact(was, last.current ?? { y: 0, maxY: now.maxY }, now));
    last.current = now;
  }, []);
  return [hidden, onScroll, useCallback(() => setHidden(false), [])];
}

/**
 * A word: its count, then three sections (owner, 2026-11-21: Ibn Qutaybah's and al-Raghib's books live with the word
 * counts): «المواضع», its ayat as cards with the word in colour and the chart of where it gathers; Ibn Qutaybah's entries on
 * it wherever the Quran uses it, in mushaf order, then those on a phrase it is in under «في عبارة»; al-Raghib's article on its root. A book with nothing on the word, or
 * hidden from the books page, has no section. Nothing at the top stays pinned (owner, 2026-11-21): the word, its count,
 * the sections and the chart slide away while the list scrolls down and come back on any scroll up (`hidden`).
 * A mushaf word holding two lemmas («مِمَّا») picks one at the top. docs/plans/word-counts-app.md
 */
export function WordView({ lemmas, onOpen, toTop, hidden, onScroll, reveal, bottom = 16, palette }: {
  /** Filled with what brings the list back to its top, for the page's tab button tapped again (lib/tabRetap.ts). */
  toTop?: MutableRefObject<() => void>;
  lemmas: number[]; onOpen?: () => void; hidden: boolean; onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void; reveal: () => void;
  bottom?: number; palette: Palette;
}) {
  useBooks();
  const [picked, setPicked] = useState(0);
  const [section, setSection] = useState<Section>('places');
  const [shown, setShown] = useState(PLACES_STEP);
  const id = lemmas[picked];
  const places = useMemo(() => placesOf(words, id), [id]);
  const counts = useMemo(() => countsBySurah(places), [places]);
  const gharibOn = bookState('gharib') === 'on';
  const mufradatOn = bookState('mufradat') === 'on';
  const mushafPlaces = useMemo(() => mushafPlacesOf(words, id), [id]);
  const entries = useMemo(() => (gharibOn ? gharibOfPlaces(gharib, gharibWords as unknown as GharibWordsData, mushafPlaces) : []), [mushafPlaces, gharibOn]);
  // Al-Raghib by the word's root: a word without one (a particle) has no article, and a mushaf word holding a second lemma
  // («بِئۡسَمَا») speaks for the other one.
  const articles = useMemo(() => (mufradatOn && words.lemmas[id][2]
    ? mufradatOfPlaces(mufradat, mushafPlaces.map(({ key, words: at }) => ({ key, words: at.filter(word => lemmasAtMushafWord(words, key, word).length === 1) })))
    : []), [id, mushafPlaces, mufradatOn]);
  const sections = (['places', 'gharib', 'mufradat'] as const).filter(at => at === 'places' || (at === 'gharib' ? entries.length : articles.length));
  const showing = sections.includes(section) ? section : 'places';
  const [surah, setSurah] = useState<number | null>(null);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  if (toTop) toTop.current = () => scroll.current?.scrollTo({ y: 0, animated: true });
  const tops = useRef(new Map<string, number>());
  const pending = useRef<string | null>(null);
  const [top, setTop] = useState(0);
  // The chart stays while a finger slides on it, and after the list's own jump to a picked surah, which is not the reader scrolling.
  const [sliding, setSliding] = useState(false);
  const away = hidden && !sliding;
  const slide = useSlideAway(away, 'top', top);
  // The scroll events of a jump come in after it, so the top is brought back once they have.
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const settled = () => { clearTimeout(timer.current); timer.current = setTimeout(reveal, SETTLE_MS); };
  // A list that overflows by less than the top's height would fit once the top left, snap back and bring it again: it keeps its top.
  const scrolled = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentSize, layoutMeasurement } = event.nativeEvent;
    if (contentSize.height - layoutMeasurement.height + (away ? top : 0) > top + TOP) onScroll(event);
  };
  const jump = (y: number) => { scroll.current?.scrollTo({ y, animated: false }); settled(); };
  const onSlide = (now: boolean) => { setSliding(now); if (!now) settled(); };
  const [name, count, root] = words.lemmas[id];
  const open = (key: string) => { onOpen?.(); readAyah(key); };
  const restart = () => { setShown(PLACES_STEP); setSurah(null); tops.current.clear(); pending.current = null; scroll.current?.scrollTo({ y: 0, animated: false }); };
  // Picking a bar shows that surah's first ayah at the top of the list, loading more ayat first if it is further down.
  const pickSurah = (at: number) => {
    setSurah(at);
    const first = places.findIndex(place => place.key.startsWith(`${at + 1}:`));
    const key = places[first].key;
    const y = tops.current.get(key);
    if (first < shown && y !== undefined) jump(y);
    else { pending.current = key; if (first >= shown) setShown(first + PLACES_STEP); }
  };
  const total = showing === 'gharib' ? entries.length : places.length;
  return (
    <View style={{ flexShrink: 1, flexGrow: 1 }}>
      {/* The top's frame gives its room back as it slides away; the top itself is laid out at full height to be measured. */}
      <Animated.View {...hiddenProps(away)} style={[{ overflow: 'hidden' }, top ? slide.frame : null]}>
        <Animated.View onLayout={event => setTop(event.nativeEvent.layout.height)} style={[{ position: top ? 'absolute' : 'relative', left: 0, right: 0, paddingHorizontal: 18, paddingBottom: 10, gap: 6 }, slide.content]}>
          {lemmas.length > 1
            ? <View accessibilityRole="tablist" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {lemmas.map((lemma, i) => (
                <Chip key={lemma} role="tab" lit quran label={words.lemmas[lemma][0]} on={i === picked} palette={palette} onPress={() => { setPicked(i); restart(); }} />
              ))}
            </View>
            : <QuranWord header look={{ color: palette.accent }} place={{ textAlign: 'right' }}>{name}</QuranWord>}
          <Text style={{ color: palette.muted, fontSize: 15, textAlign: 'right' }}>
            {`ترد في القرآن ${num(count)} مرة في ${num(places.length)} آية${root ? `، وجذرها «${root}»` : ''}`}
            {showing === 'places' && surah !== null && <Text style={{ color: palette.accent, fontSize: 15 }}>{`، منها ${num(counts[surah])} في ${surahNames[surah + 1]}`}</Text>}
          </Text>
          {sections.length > 1 && <Tabs options={sections.map(at => ({ key: at, label: at === 'places' ? 'المواضع' : BOOK_NAMES[at] }))} value={showing}
            onChange={at => { setSection(at); restart(); }} label="أقسام الكلمة" palette={palette} />}
          {showing === 'places' && places.length > 0 && <SurahStrip counts={counts} picked={surah} onPick={pickSurah} onSliding={onSlide} names={surahNames} palette={palette} />}
        </Animated.View>
      </Animated.View>
      <ScrollView key={id} ref={scroll} onScroll={scrolled} scrollEventThrottle={16} style={{ flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: bottom }}>
        {showing === 'places' && places.slice(0, shown).map(({ key, words: marked }) => {
          const [s, number] = key.split(':').map(Number);
          const place = `${surahNames[s] ?? num(s)} ${num(number)}`;
          const text = corpusText(ayahOf(key)?.words ?? []);
          return (
            <Card key={key} palette={palette} pad={[7, 14]} onPress={() => open(key)}
              onLayout={event => {
                const y = event.nativeEvent.layout.y;
                tops.current.set(key, y);
                if (pending.current === key) { pending.current = null; jump(y); }
              }} accessibilityRole="button" accessibilityLabel={`افتح ${place} في المصحف`}>
              <AyahFlow color={palette.ink}>
                {text.map((word, i) => <AyahWords key={i} look={marked.includes(i) ? { color: palette.accent } : undefined}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}
              </AyahFlow>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <FEATURE_ICON.mushaf size={16} color={palette.muted} />
                <Text style={{ color: palette.muted, fontSize: 13 }}>{place}</Text>
              </View>
            </Card>
          );
        })}
        {showing === 'gharib' && entries.slice(0, shown).map((entry, i) => (
          <Fragment key={entry.at}>
            {entry.phrase && !entries[i - 1]?.phrase && <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right', marginTop: 8 }}>في عبارة</Text>}
            <GharibCard entry={entry} onOpen={open} palette={palette} />
          </Fragment>
        ))}
        {showing === 'mufradat' && articles.map(article => <Mufradat key={article.at} article={article} palette={palette} />)}
        {showing !== 'mufradat' && shown < total && (
          <Pressable onPress={() => setShown(shown + PLACES_STEP)} accessibilityRole="button"
            style={{ alignSelf: 'center', minHeight: 44, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1, borderColor: palette.rule, justifyContent: 'center' }}>
            <Text style={{ color: palette.ink, fontSize: 16 }}>{`المزيد (${num(total - shown)})`}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

/** One of Ibn Qutaybah's entries on the word: its ayah with the words he quotes on the band, his entry whole, then the mushaf button and his page. */
function GharibCard({ entry, onOpen, palette }: { entry: GharibPlaced; onOpen: (key: string) => void; palette: Palette }) {
  const [surah, number] = entry.key.split(':').map(Number);
  const place = `${surahNames[surah] ?? num(surah)} ${num(number)}`;
  const ayah = useMemo(() => ayahMushafWords(entry.key), [entry.key]);
  return (
    <CardWithRow palette={palette} pad={[10, 14]} source={gharibSource(entry)}
      lead={<IconButton Icon={FEATURE_ICON.mushaf} label={`افتح ${place} في المصحف`} onPress={() => onOpen(entry.key)} />}
      row={<Text style={{ color: palette.muted, fontSize: 14 }}>{place}</Text>}>
      <LitAyat ayat={[{ words: ayah, lit: entry.words }]} palette={palette} />
      <View style={{ height: 1, backgroundColor: `${palette.rule}60`, marginVertical: 6 }} />
      <BookRuns text={entry.text} quran={palette.accent} style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' }} />
    </CardWithRow>
  );
}
