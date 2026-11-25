import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { ayahPlace } from '@shared/quiz/sources';
import { sahihName } from '@shared/sahih';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import builtHadith from '@shared/data/quran/rahmanHadith.json';
import {
  BASMALA_AYAH, MERCY_KEPT, MERCY_PARTS, NO_BASMALA, TIKRAR_RUNS, kirmaniOn, tikrarWords, SADI_OPENING, SCENE_HADITH_BY_ID, basmalasBySurah, hadithNumbers, mostPlaces, nameRuns, placeCount, rahmanPlaces,
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
import QuranWords from '../quran/text/QuranWords';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { ShareBrand } from '../SharePages';
import MercyGalaxy from './MercyGalaxy';

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

/** The first page's name, over the map (owner, 2026-11-25: pages 1 and 7 merged), with its number in its medallion. */
const TITLE_ZOOM = 1.5;

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

/**
 * An ayah whole, its words that are the name in colour, and its surah's name over it (owner, 2026-11-25: the number is in
 * its medallion); the first page's name is the surah's own, so nothing repeats it (owner, 2026-11-25). Its long press opens the
 * reader's menu.
 */
function Ayah({ ayahKey, basmala, title }: { ayahKey: string; basmala?: boolean; title?: boolean }) {
  const lit = NAME_AT_OF().get(ayahKey);
  const text = ayahMushafWords(ayahKey);
  return (
    <View style={{ gap: 2 }}>
      {basmala || title ? null : <Ref>{surahName(Number(ayahKey.split(':')[0]))}</Ref>}
      <AyahFlow menu={ayahKey} color={paper.ink} center zoom={title ? TITLE_ZOOM : 1}>
        {text.map((word, i) => <AyahWords key={i} look={lit?.has(i) ? { color: paper.accent } : undefined}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}
        {basmala ? null : <AyahWords look={{ color: paper.muted }}>{`\u00a0${num(Number(ayahKey.split(':')[1]))}`}</AyahWords>}
      </AyahFlow>
    </View>
  );
}

/** Ayat of one surah that follow each other in one flow, each with its number, the surah's name over them. */
function AyahRun({ keys, bare }: { keys: string[]; bare?: boolean }) {
  return (
    <View style={{ gap: 2 }}>
      {bare ? null : <Ref>{surahName(Number(keys[0].split(':')[0]))}</Ref>}
      <AyahFlow menu={keys[0]} color={paper.ink} center>
        {keys.map((key, k) => {
          const lit = NAME_AT_OF().get(key);
          return ayahMushafWords(key).map((word, i) => <AyahWords key={`${k}-${i}`} look={lit?.has(i) ? { color: paper.accent } : undefined}>{`${k || i ? ' ' : ''}${word}`}</AyahWords>)
            .concat(<AyahWords key={`${k}-n`} look={{ color: paper.muted }}>{`\u00a0${num(Number(key.split(':')[1]))}`}</AyahWords>);
        })}
      </AyahFlow>
    </View>
  );
}

/** Words of a book with the name in colour, and the Quran it quotes (﴿…﴾) in the mushaf font (AGENTS.md, "Quran text"). */
function NamedText({ text, size, lit, before }: { text: string; size: number; lit?: string;
  /** Words over it in the muted ink, in the same paragraph (a hadith's narrator). */
  before?: string }) {
  const colour = (run: { name: boolean; lit: boolean }) => (run.name ? { color: paper.accent } : run.lit ? { color: RAHMAN_ART.lit } : undefined);
  return (
    <Text style={{ color: paper.ink, fontSize: size, lineHeight: size * 1.85, textAlign: 'justify', writingDirection: 'rtl' }}>
      {before ? <Text style={{ color: paper.muted }}>{`${before} `}</Text> : null}
      {tafsirRuns(text).map((part, k) => {
        const runs = nameRuns(part.text, lit).map((run, i) => <Text key={i} style={colour(run)}>{run.text}</Text>);
        return part.quran ? <QuranWords key={k}>{runs}</QuranWords> : <Text key={k}>{runs}</Text>;
      })}
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
      {hadith.lead ? <Text style={{ color: paper.muted, fontSize: size * 0.85, lineHeight: size * 1.6, textAlign: 'right' }}>{hadith.lead}</Text> : null}
      <NamedText text={text} size={size} lit={hadith.lit} before={built.narrator} />
      <Ref>{hadithRef(id)}</Ref>
    </View>
  );
  // A tap on it opens the hadith whole on its page; the row lays out as the block does (a column, taller than a finger).
  return live
    ? <TapRow onPress={() => openSahih(hadith.book, hadith.n)} role="link" label={`افتح الحديث كاملًا: ${hadithRef(id)}`} style={{ flexDirection: 'column' }}>{body}</TapRow>
    : body;
}

/** The scene's counts under the name: the basmalas, the places in the ayat, the hadith numbers. */
function Counts({ only }: { only?: 'hadith' }) {
  const line = (before: string, count: number, after: string) => (
    <Text style={{ color: paper.ink, fontSize: 24, lineHeight: 36, textAlign: 'center' }}>{before} <Text style={{ color: paper.accent }}>{num(count)}</Text> {after}</Text>
  );
  return (
    <View>
      {only ? null : line('في', BASMALAS.reduce((sum, n) => sum + n, 0), 'بسملة')}
      {only ? null : line('وفي', placeCount(PLACES_OF()), 'موضعًا من الآيات')}
      {line('وفي', HADITH_COUNT, 'حديثًا من الصحيحين')}
    </View>
  );
}

/**
 * The map on the first page, under the name (owner, 2026-11-25): under the basmala, a box for each surah's basmala in the
 * mushaf's order; then where the name stands in the ayat along the mushaf.
 */
function NameMap({ part }: { part: 'basmala' | 'name' }) {
  const note = (text: string) => <Text style={{ color: paper.muted, fontSize: 14, lineHeight: 20, textAlign: 'center' }}>{text}</Text>;
  if (part === 'basmala') {
    const COLUMNS = 19;
    const GAP = 3;
    const cell = (BLOCK_W - GAP * (COLUMNS - 1)) / COLUMNS;
    return (
      <View style={{ gap: 8 }} accessible accessibilityLabel={`البسملة على رأس كل سورة إلا ${surahName(NO_BASMALA)}، وفي ${ayahPlace(BASMALA_AYAH)}`}>
        <Ayah ayahKey="1:1" basmala />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: GAP, direction: 'rtl' }}>
          {BASMALAS.map((count, i) => (
            <View key={i} style={{ width: cell, height: 9, borderWidth: 1, borderColor: RAHMAN_ART.frame, borderStyle: count ? 'solid' : 'dashed', justifyContent: 'center', gap: 1, paddingHorizontal: 2 }}>
              {Array.from({ length: count }, (_, k) => <View key={k} style={{ height: count > 1 ? 1.5 : 2, backgroundColor: paper.accent }} />)}
            </View>
          ))}
        </View>
        {note(`في ${num(BASMALAS.reduce((sum, n) => sum + n, 0))} بسملة: على رأس كل سورة إلا ${surahName(NO_BASMALA)}، وفي ${ayahPlace(BASMALA_AYAH)}`)}
      </View>
    );
  }
  const ROWS = 4;
  const LAST_PAGE = 604;
  const perRow = LAST_PAGE / ROWS;
  const most = mostPlaces(PLACES_OF());
  const pages = PLACES_OF().map(place => pageOfAyah(place.key) ?? 1);
  return (
    <View style={{ gap: 8 }} accessible accessibilityLabel={`والاسم في ${num(placeCount(PLACES_OF()))} موضعًا من الآيات`}>
      <View style={{ gap: 4 }}>
        {Array.from({ length: ROWS }, (_, row) => (
          <View key={row} style={{ height: 12, justifyContent: 'center' }}>
            <View style={{ height: 5, backgroundColor: RAHMAN_ART.mark }} />
            {pages.filter(page => Math.min(ROWS - 1, Math.floor((page - 1) / perRow)) === row).map((page, k) => (
              <View key={k} style={{ position: 'absolute', top: 0, bottom: 0, width: 1.5, backgroundColor: paper.accent, start: ((page - 1 - row * perRow) / perRow) * BLOCK_W }} />
            ))}
          </View>
        ))}
      </View>
      {note(`في ${num(placeCount(PLACES_OF()))} موضعًا من الآيات، ${num(most.count)} منها في سورة ${surahName(most.surah)}`)}
      <Ref>العدّ: المدونة القرآنية العربية، على صفحات مصحف المدينة</Ref>
    </View>
  );
}

const GALAXY_H = 120;

/**
 * The hundred parts of mercy (sketch B, owner 2026-11-25), small over the hadith: ninety-nine kept, the hundredth left pale,
 * sent down to the earth and spread over all creation, drawn as a galaxy (owner: «موزعة على جميع المخلوقات… الكون»).
 */
function MercyParts() {
  const COLUMNS = 25;
  const DOT = 5;
  const GAP = 3;
  const width = COLUMNS * DOT + (COLUMNS - 1) * GAP;
  const rows = MERCY_PARTS / COLUMNS;
  const sent = (rows - 1) * COLUMNS + Math.floor(COLUMNS / 2);
  return (
    <View style={{ alignItems: 'center' }} accessible accessibilityLabel={`${num(MERCY_PARTS)} جزء: ${num(MERCY_KEPT)} عنده، وجزء في الأرض يتراحم به الخلق`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width, flexDirection: 'row', flexWrap: 'wrap', gap: GAP }}>
          {Array.from({ length: MERCY_PARTS }, (_, i) => (
            <View key={i} style={{ width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: i === sent ? RAHMAN_ART.mark : RAHMAN_ART.title }} />
          ))}
        </View>
        <Text style={{ color: paper.muted, fontSize: 13 }}>{num(MERCY_KEPT)}</Text>
      </View>
      <View style={{ alignItems: 'center', marginEnd: 10 + 13 }}>
        {Array.from({ length: 3 }, (_, k) => <View key={k} style={{ width: 1.5, height: 3, marginTop: 3, backgroundColor: RAHMAN_ART.frame }} />)}
      </View>
      <MercyGalaxy width={BLOCK_W} height={GALAXY_H} />
    </View>
  );
}

/** «فبأي آلاء ربكما تكذبان» in al-Kirmani's four runs: a dot for each time, each run named in his words. */
function TikrarRuns() {
  const DOT = 10;
  return (
    <View style={{ gap: 8 }} accessible accessibilityLabel={TIKRAR_RUNS.map(run => `${tikrarWords(run)}: ${num(run.count)}`).join('، ')}>
      {TIKRAR_RUNS.map(run => (
        <View key={run.words[0]} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
          <Text style={{ color: paper.ink, fontSize: 15 }}>{tikrarWords(run)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, direction: 'rtl' }}>
            {Array.from({ length: run.count }, (_, k) => <View key={k} style={{ width: DOT, height: DOT, borderRadius: DOT / 2, backgroundColor: RAHMAN_ART.title }} />)}
            <Text style={{ color: paper.muted, fontSize: 14, width: 18, textAlign: 'center' }}>{num(run.count)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/** Al-Kirmani's words on a repeated ayah, whole, with his book and page. */
function Kirmani({ ayahKey }: { ayahKey: string }) {
  const citation = kirmaniOn(ayahKey);
  return (
    <View style={{ gap: 2 }}>
      <NamedText text={`قال الكرماني: «${citation.quote.replace(/\n/g, ' ')}»`} size={15} />
      <Ref>{`الكرماني، أسرار التكرار في القرآن، ${citation.locator.replace(/^§ [^،]+، /, '').replace(/\d+/g, d => num(Number(d)))}`}</Ref>
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
    case 'counts': return <Counts only={block.only} />;
    case 'ayah': return <Ayah ayahKey={block.key} basmala={block.basmala} title={block.title} />;
    case 'run': return <AyahRun keys={block.keys} bare={block.bare} />;
    case 'hadith': return <Hadith id={block.id} size={size} live={live} />;
    case 'sadi': return <Sadi />;
    case 'map': return <NameMap part={block.part} />;
    case 'mercy': return <MercyParts />;
    case 'tikrar': return <TikrarRuns />;
    case 'kirmani': return <Kirmani ayahKey={block.key} />;
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
          <Text style={{ color: paper.muted, fontSize: 13 }}>{RAHMAN_NAME}</Text>
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
