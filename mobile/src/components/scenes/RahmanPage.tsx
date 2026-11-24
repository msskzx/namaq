import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { ayahPlace } from '@shared/quiz/sources';
import { sahihName } from '@shared/sahih';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import builtHadith from '@shared/data/quran/rahmanHadith.json';
import {
  BASMALA_AYAH, NO_BASMALA, SADI_OPENING, SCENE_HADITH_BY_ID, basmalasBySurah, hadithNumbers, mostPlaces, nameRuns, placeCount, rahmanPlaces,
  sadiOpening, sceneHadithNumbers, type BuiltHadith, type RahmanBlock,
} from '@shared/quran/scenes/rahman';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import { ayahMushafWords, pageOfAyah } from '@/lib/mushaf';
import { words } from '@/lib/words';
import type { WordPlace } from '@shared/quran/words';
import { RAHMAN_ART, RAHMAN_PAPER as paper } from '@/lib/theme';
import { openSahih } from '@/screens/hadith';
import AyahFlow, { AyahWords } from '../quran/text/AyahFlow';
import { ShareBrand } from '../SharePages';

/**
 * A page of the «الرحمن» scene (owner, 2026-11-24, sketches /mnt/project-files/mashahid/rahman/paper3 and intro): a 4:5
 * paper page, the same picture in the scene and when shared, drawn at the share's width and scaled to the screen. Paper and
 * ink, only the name in colour; its title over it, the logo at its foot.
 */
export const PAGE_W = 440;
export const PAGE_H = 550;
const EDGE = 10;
const SIDE = 18;
const HEAD = 28;
const FOOT = 34;
/** The width a page's blocks flow in. */
export const BLOCK_W = PAGE_W - EDGE * 2 - 2 - SIDE * 2;
/** Between two blocks: a short line in its middle. */
export const BLOCK_GAP = 19;
/** The height a page holds its blocks in. */
export const PAGE_ROOM = PAGE_H - EDGE * 2 - 2 - 10 - 6 - HEAD - FOOT - 8;
/** The hadith text sizes a section may take, biggest first: the biggest that needs no more pages than the smallest. */
export const HADITH_SIZES = [22, 20, 18, 17, 15.5, 14] as const;

/** The first page's name, as big as the sketch the owner agreed (intro-1): its place stays under it. */
const TITLE_ZOOM = 2.6;

const BUILT = builtHadith as Record<string, BuiltHadith>;
// Read on first use, not when the app starts (the home feed imports this file): it walks the whole corpus.
let places: WordPlace[] | null = null;
let nameAt: Map<string, Set<number>> | null = null;
const PLACES_OF = () => (places ??= rahmanPlaces(words));
const NAME_AT_OF = () => (nameAt ??= new Map(PLACES_OF().map(place => [place.key, new Set(place.words)])));
/** The keys of the ayat that hold the name, in the mushaf's order. */
export const rahmanAyat = () => PLACES_OF().map(place => place.key);
const BASMALAS = basmalasBySurah();
const HADITH_COUNT = sceneHadithNumbers().length;
const BOOK_TITLE = { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم' } as const;

/** The scene's name on its foot and in its labels. */
export const RAHMAN_NAME = 'الرحمن';

/** «صحيح البخاري ٦٤٠٦، ٦٦٨٢ · صحيح مسلم ٢٦٩٤»: a hadith's numbers in both books. */
export function hadithRef(id: string): string {
  const hadith = SCENE_HADITH_BY_ID[id];
  return hadithNumbers(hadith).map(({ book, numbers }) => {
    const [first, ...rest] = numbers;
    const route = book === hadith.book && first === hadith.n ? hadith.route : undefined;
    return [sahihName({ title: BOOK_TITLE[book] }, first, num, route), ...rest.map(n => num(n))].join('، ');
  }).join(' · ');
}

function Ref({ children }: { children: string }) {
  return <Text style={{ color: paper.muted, fontSize: 13, lineHeight: 20, textAlign: 'center' }}>{children}</Text>;
}

/** An ayah whole, its words that are the name in colour, and its place under it; its long press opens the reader's menu. */
function Ayah({ ayahKey, basmala, title }: { ayahKey: string; basmala?: boolean; title?: boolean }) {
  const lit = NAME_AT_OF().get(ayahKey);
  const text = ayahMushafWords(ayahKey);
  return (
    <View style={{ gap: 2 }}>
      <AyahFlow menu={ayahKey} color={paper.ink} center zoom={title ? TITLE_ZOOM : 1}>
        {text.map((word, i) => <AyahWords key={i} look={lit?.has(i) ? { color: paper.accent } : undefined}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}
        {basmala || title ? null : <AyahWords look={{ color: paper.muted }}>{` ${num(Number(ayahKey.split(':')[1]))}`}</AyahWords>}
      </AyahFlow>
      {basmala ? null : <Ref>{ayahPlace(ayahKey)}</Ref>}
    </View>
  );
}

/** Words of a book with the name in colour. */
function NamedText({ text, size }: { text: string; size: number }) {
  return (
    <Text style={{ color: paper.ink, fontSize: size, lineHeight: size * 1.85, textAlign: 'justify', writingDirection: 'rtl' }}>
      {nameRuns(text).map((run, i) => <Text key={i} style={run.name ? { color: paper.accent } : undefined}>{run.text}</Text>)}
    </Text>
  );
}

/** A hadith's words as the Sahih prints them (a part, with «…», where it runs too long for a page), and its numbers. */
function Hadith({ id, size, live }: { id: string; size: number; live: boolean }) {
  const built = BUILT[id];
  const hadith = SCENE_HADITH_BY_ID[id];
  const text = `${built.cutBefore ? '… ' : ''}${built.text}${built.cutAfter ? ' …' : ''}`;
  const body = (
    <View style={{ gap: 2 }}>
      <NamedText text={text} size={size} />
      <Ref>{hadithRef(id)}</Ref>
    </View>
  );
  // A tap on it opens the hadith whole on its page; the row lays out as the block does (a column, taller than a finger).
  return live
    ? <TapRow onPress={() => openSahih(hadith.book, hadith.n)} role="link" label={`افتح الحديث كاملًا: ${hadithRef(id)}`} style={{ flexDirection: 'column' }}>{body}</TapRow>
    : body;
}

/** The scene's counts under the name: the basmalas, the places in the ayat, the hadith numbers. */
function Counts() {
  const line = (before: string, count: number, after: string) => (
    <Text style={{ color: paper.ink, fontSize: 24, lineHeight: 46, textAlign: 'center' }}>{before} <Text style={{ color: paper.accent }}>{num(count)}</Text> {after}</Text>
  );
  return (
    <View>
      {line('في', BASMALAS.reduce((sum, n) => sum + n, 0), 'بسملة')}
      {line('وفي', placeCount(PLACES_OF()), 'موضعًا من الآيات')}
      {line('وفي', HADITH_COUNT, 'حديثًا من الصحيحين')}
    </View>
  );
}

/** The basmala over every surah, a box each in the mushaf's order, and where the name stands in the ayat along the mushaf. */
function NameMap() {
  const COLUMNS = 12;
  const GAP = 4;
  const cell = (BLOCK_W - GAP * (COLUMNS - 1)) / COLUMNS;
  const ROWS = 6;
  const LAST_PAGE = 604;
  const perRow = LAST_PAGE / ROWS;
  const most = mostPlaces(PLACES_OF());
  const pages = PLACES_OF().map(place => pageOfAyah(place.key) ?? 1);
  const note = (text: string) => <Text style={{ color: paper.muted, fontSize: 14, lineHeight: 24, textAlign: 'center' }}>{text}</Text>;
  return (
    <View style={{ gap: 10 }} accessible accessibilityLabel={`البسملة على رأس كل سورة إلا ${surahName(NO_BASMALA)}، وفي ${ayahPlace(BASMALA_AYAH)}؛ والاسم في ${num(placeCount(PLACES_OF()))} موضعًا من الآيات`}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, direction: 'rtl' }}>
        {BASMALAS.map((count, i) => (
          <View key={i} style={{ width: cell, height: 10, borderWidth: 1, borderColor: RAHMAN_ART.frame, borderStyle: count ? 'solid' : 'dashed', justifyContent: 'center', gap: 1, paddingHorizontal: 2 }}>
            {Array.from({ length: count }, (_, k) => <View key={k} style={{ height: count > 1 ? 2 : 3, backgroundColor: paper.accent }} />)}
          </View>
        ))}
      </View>
      {note(`في ${num(BASMALAS.reduce((sum, n) => sum + n, 0))} بسملة: على رأس كل سورة إلا ${surahName(NO_BASMALA)}، وفي ${ayahPlace(BASMALA_AYAH)}`)}
      <View style={{ gap: 6 }}>
        {Array.from({ length: ROWS }, (_, row) => (
          <View key={row} style={{ height: 14, justifyContent: 'center' }}>
            <View style={{ height: 5, backgroundColor: RAHMAN_ART.mark }} />
            {pages.filter(page => Math.min(ROWS - 1, Math.floor((page - 1) / perRow)) === row).map((page, k) => (
              <View key={k} style={{ position: 'absolute', top: 0, bottom: 0, width: 1.5, backgroundColor: paper.accent, start: ((page - 1 - row * perRow) / perRow) * BLOCK_W }} />
            ))}
          </View>
        ))}
      </View>
      {note(`وفي ${num(placeCount(PLACES_OF()))} موضعًا من الآيات، ${num(most.count)} منها في سورة ${surahName(most.surah)}`)}
      <Ref>العدّ: المدونة القرآنية العربية، على صفحات مصحف المدينة</Ref>
    </View>
  );
}

/** Al-Sa'di on the surah's opening, in his words. */
function Sadi() {
  const passage = tafsirSadiOf(SADI_OPENING.key);
  if (!passage) return null;
  const ref = `السعدي، تيسير الكريم الرحمن، ص ${num(passage.pages[0])}`;
  return (
    <View style={{ gap: 2 }}>
      <NamedText text={`قال السعدي: «${sadiOpening(passage.text)}»`} size={17} />
      <Ref>{ref}</Ref>
    </View>
  );
}

/** One block of a page. `live`: a tap opens the hadith (never on the introduction, owner 2026-11-24: it shares clean). */
export function RahmanBlockView({ block, size, live }: { block: RahmanBlock; size: number; live: boolean }) {
  switch (block.kind) {
    case 'counts': return <Counts />;
    case 'ayah': return <Ayah ayahKey={block.key} basmala={block.basmala} title={block.title} />;
    case 'hadith': return <Hadith id={block.id} size={size} live={live} />;
    case 'sadi': return <Sadi />;
    case 'map': return <NameMap />;
  }
}

/** A whole page: its title, its blocks with a short line between them, and the logo at its foot. */
export function RahmanPage({ title, blocks, size, live }: { title: string; blocks: RahmanBlock[]; size: number; live: boolean }) {
  return (
    <View style={{ width: PAGE_W, height: PAGE_H, backgroundColor: paper.paper, padding: EDGE, direction: 'rtl' }}>
      <View style={{ flex: 1, borderWidth: 1, borderColor: RAHMAN_ART.frame, paddingHorizontal: SIDE, paddingTop: 10, paddingBottom: 6, gap: 4 }}>
        <View style={{ height: HEAD, justifyContent: 'center' }}>
          {title ? <Text accessibilityRole="header" style={{ color: RAHMAN_ART.title, fontSize: 15, textAlign: 'center' }}>{title}</Text> : null}
        </View>
        <View style={{ flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
          {blocks.map((block, i) => (
            <View key={i}>
              {i ? <View style={{ height: BLOCK_GAP, justifyContent: 'center', alignItems: 'center' }}><View style={{ width: '30%', height: 1, backgroundColor: RAHMAN_ART.frame }} /></View> : null}
              <RahmanBlockView block={block} size={size} live={live} />
            </View>
          ))}
        </View>
        <View style={{ height: FOOT, borderTopWidth: 1, borderTopColor: RAHMAN_ART.mark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <ShareBrand small palette={paper} />
          <Text style={{ color: paper.muted, fontSize: 13 }}>{`مشاهد · ${RAHMAN_NAME}`}</Text>
        </View>
      </View>
    </View>
  );
}

/** A page drawn at its own size and scaled into `width` (the scene, the list's cover). */
export function ScaledPage({ width, children }: { width: number; children: React.ReactNode }) {
  const scale = width / PAGE_W;
  return (
    <View style={{ width, height: PAGE_H * scale, overflow: 'hidden' }}>
      <View style={{ position: 'absolute', left: (width - PAGE_W) / 2, top: (PAGE_H * scale - PAGE_H) / 2, width: PAGE_W, height: PAGE_H, transform: [{ scale }] }}>
        {children}
      </View>
    </View>
  );
}
