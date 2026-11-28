import { View } from 'react-native';
import { num } from '@shared/quran/arabicNumber';
import { surahName } from '@shared/quran/surahNames';
import { ayahPlace } from '@shared/quiz/sources';
import { sahihName } from '@shared/sahih';
import { tafsirSadiOf } from '@shared/quran/tafsirSadiData';
import builtHadith from '@shared/data/quran/rahmanHadith.json';
import {
  BASMALA_AYAH, MERCY_KEPT, MERCY_PARTS, NO_BASMALA, TIKRAR_RUNS, kirmaniOn, tikrarWords, SADI_OPENING, SCENE_HADITH_BY_ID, basmalasBySurah, surahBars, hadithNumbers, nameRuns, placeCount, rahmanPlaces,
  sadiOpening, sceneHadithNumbers, type BuiltHadith, type RahmanBlock,
} from '@shared/quran/scenes/rahman';
import { Text } from '@/ui/Text';
import TapRow from '@/ui/TapRow';
import { ayahMushafWords } from '@/lib/mushaf';
import { words } from '@/lib/words';
import type { WordPlace } from '@shared/quran/words';
import { RAHMAN_ART, RAHMAN_PAPER as paper } from '@/lib/theme';
import { openSahih } from '@/screens/hadith';
import AyahFlow, { AyahWords } from '../quran/text/AyahFlow';
import QuranWords from '../quran/text/QuranWords';
import { tafsirRuns } from '@shared/quran/tafsirSadi';
import { ShareBrand } from '../SharePages';
import MercyGalaxy from './MercyGalaxy';

export const PAGE_W = 440;
export const PAGE_H = 550;
const EDGE = 10;
const SIDE = 18;
const HEAD = 28;
const FOOT = 34;
export const BLOCK_W = PAGE_W - EDGE * 2 - 2 - SIDE * 2;
export const BLOCK_GAP = 19;
export const PAGE_ROOM = PAGE_H - EDGE * 2 - 2 - 10 - 6 - HEAD - FOOT - 8;
export const HADITH_SIZES = [22, 20, 18, 17, 15.5, 14] as const;

const TITLE_ZOOM = 1.8;

const BUILT = builtHadith as Record<string, BuiltHadith>;
let places: WordPlace[] | null = null;
let nameAt: Map<string, Set<number>> | null = null;
const PLACES_OF = () => (places ??= rahmanPlaces(words));
const NAME_AT_OF = () => (nameAt ??= new Map(PLACES_OF().map(place => [place.key, new Set(place.words)])));
export const rahmanAyat = () => PLACES_OF().map(place => place.key);
const BASMALAS = basmalasBySurah();
const HADITH_COUNT = sceneHadithNumbers().length;
const BOOK_TITLE = { bukhari: 'صحيح البخاري', muslim: 'صحيح مسلم' } as const;

export const RAHMAN_NAME = 'الرحمن';

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

function Ayah({ ayahKey, basmala, title }: { ayahKey: string; basmala?: boolean; title?: boolean }) {
  const lit = NAME_AT_OF().get(ayahKey);
  const text = ayahMushafWords(ayahKey);
  return (
    <View style={{ gap: 2 }}>
      {basmala || title ? null : <Ref>{surahName(Number(ayahKey.split(':')[0]))}</Ref>}
      <AyahFlow menu={ayahKey} color={paper.ink} center zoom={title ? TITLE_ZOOM : 1}>
        {text.map((word, i) => <AyahWords key={i} look={lit?.has(i) ? { color: paper.accent } : undefined}>{`${i ? ' ' : ''}${word}`}</AyahWords>)}
        {basmala || title ? null : <AyahWords look={{ color: paper.muted }}>{`\u00a0${num(Number(ayahKey.split(':')[1]))}`}</AyahWords>}
      </AyahFlow>
    </View>
  );
}

function AyahRun({ keys, bare, breakAfter }: { keys: string[]; bare?: boolean; breakAfter?: string }) {
  return (
    <View style={{ gap: 2 }}>
      {bare ? null : <Ref>{surahName(Number(keys[0].split(':')[0]))}</Ref>}
      <AyahFlow menu={keys[0]} color={paper.ink} center>
        {keys.map((key, k) => {
          const lit = NAME_AT_OF().get(key);
          const after = keys[k - 1] === breakAfter ? '\n' : ' ';
          return ayahMushafWords(key).map((word, i) => <AyahWords key={`${k}-${i}`} look={lit?.has(i) ? { color: paper.accent } : undefined}>{`${k && !i ? after : i ? ' ' : ''}${word}`}</AyahWords>)
            .concat(<AyahWords key={`${k}-n`} look={{ color: paper.muted }}>{`\u00a0${num(Number(key.split(':')[1]))}`}</AyahWords>);
        })}
      </AyahFlow>
    </View>
  );
}

function NamedText({ text, size, lit, before }: { text: string; size: number; lit?: string;
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
  return live
    ? <TapRow onPress={() => openSahih(hadith.book, hadith.n)} role="link" label={`افتح الحديث كاملًا: ${hadithRef(id)}`} style={{ flexDirection: 'column' }}>{body}</TapRow>
    : body;
}

const GALAXY_H = 120;

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

function Kirmani({ ayahKey }: { ayahKey: string }) {
  const citation = kirmaniOn(ayahKey);
  return (
    <View style={{ gap: 2 }}>
      <NamedText text={`قال الكرماني: «${citation.quote.replace(/\n/g, ' ')}»`} size={15} />
      <Ref>{`الكرماني، أسرار التكرار في القرآن، ${citation.locator.replace(/^§ [^،]+، /, '').replace(/\d+/g, d => num(Number(d)))}`}</Ref>
    </View>
  );
}

const PLOT_UNIT = 5.5;
const PLOT_BAR = 10;
const PLOT_ROW = 21;
const PLOT_NAME_W = 52;
const PLOT_COUNT_W = 18;
const PLOT_COLUMNS = 2;

function CoverPlot() {
  const bars = surahBars(PLACES_OF()).map((bar, i) => ({ surah: i + 1, count: bar.name + bar.both })).filter(bar => bar.count > 0);
  const basmalas = BASMALAS.reduce((sum, n) => sum + n, 0);
  const places = placeCount(PLACES_OF());
  const perColumn = Math.ceil(bars.length / PLOT_COLUMNS);
  const row = (bar: (typeof bars)[number]) => (
    <View key={bar.surah} style={{ flexDirection: 'row', alignItems: 'center', height: PLOT_ROW, gap: 4, direction: 'rtl' }}>
      <Text style={{ width: PLOT_NAME_W, color: paper.ink, fontSize: 12, lineHeight: PLOT_ROW }} numberOfLines={1}>{surahName(bar.surah)}</Text>
      <View style={{ width: bar.count * PLOT_UNIT, height: PLOT_BAR, backgroundColor: paper.accent }} />
      <Text style={{ width: PLOT_COUNT_W, color: paper.accent, fontSize: 12, lineHeight: PLOT_ROW }}>{num(bar.count)}</Text>
    </View>
  );
  return (
    <View style={{ gap: 8 }} accessible accessibilityLabel={`«الرحمن» في ${num(places)} موضعًا من الآيات، والبسملة في ${num(basmalas)} موضعًا، وفي ${num(HADITH_COUNT)} حديثًا من الصحيحين`}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', direction: 'rtl' }}>
        {Array.from({ length: PLOT_COLUMNS }, (_, c) => <View key={c}>{bars.slice(c * perColumn, (c + 1) * perColumn).map(row)}</View>)}
      </View>
      <Text style={{ color: paper.ink, fontSize: 15, lineHeight: 24, textAlign: 'center', borderTopWidth: 1, borderTopColor: RAHMAN_ART.mark, paddingTop: 8 }}>
        {'البسملة في '}<Text style={{ color: paper.accent }}>{num(basmalas)}</Text>{` موضعًا: على رأس كل سورة إلا ${surahName(NO_BASMALA)}، وفي ${ayahPlace(BASMALA_AYAH).replace(' ', '\u00a0')}؛ و«الرحمن» في `}
        <Text style={{ color: paper.accent }}>{num(HADITH_COUNT)}</Text>{' حديثًا من الصحيحين'}
      </Text>
      <Ref>العدّ: المدونة القرآنية العربية، على صفحات مصحف المدينة</Ref>
    </View>
  );
}

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

export function RahmanBlockView({ block, size, live }: { block: RahmanBlock; size: number; live: boolean }) {
  switch (block.kind) {
    case 'ayah': return <Ayah ayahKey={block.key} basmala={block.basmala} title={block.title} />;
    case 'run': return <AyahRun keys={block.keys} bare={block.bare} breakAfter={block.breakAfter} />;
    case 'hadith': return <Hadith id={block.id} size={size} live={live} />;
    case 'sadi': return <Sadi />;
    case 'cover': return <CoverPlot />;
    case 'mercy': return <MercyParts />;
    case 'tikrar': return <TikrarRuns />;
    case 'kirmani': return <Kirmani ayahKey={block.key} />;
  }
}

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
