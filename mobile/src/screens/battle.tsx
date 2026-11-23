import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Button from '@/ui/Button';
import StripTabs from '@/ui/StripTabs';
import QuoteBar from '@/ui/QuoteBar';
import PullQuote from '@/ui/PullQuote';
import Step from '@/ui/Step';
import { PassageShare, ShareHead } from '@/ui/CardShare';
import { sourcesOf } from '@/ui/SourceLine';
import { citeSource, uniqueSources } from '@shared/quiz/sources';
import { LeadLink } from '@/ui/ExternalLink';
import { Section } from '@/components/QuizForm';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabRetap } from '@/lib/tabRetap';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { back } from '@/lib/ways';
import { battleOf } from '@/lib/battles';
import { battleLine, courseTitle, placeRefs, prophetSaying, type AppBattle, type AppMoment } from '@shared/battles/battle';
import { placeSayer } from '@shared/battles/places';
import { num } from '@shared/quran/arabicNumber';
import BattleMap, { MAP_ASPECT } from '@/components/battles/BattleMap';
import { Counts, People, Readings, Refs } from '@/components/battles/BattleParts';

/** Where the reader is in a battle's course, and the ways to move through it (the battle screen only). */
type CourseNav = { current: number; past: boolean; go: (i: number) => void;
  /** Each scene's view, measured against the page when the reader moves (on the web a scene keeps its first place otherwise). */
  held: (i: number, view: ComponentRef<typeof View> | null) => void; laidOut: () => void;
  /** The contents' own height, so a scene brought up clears them. */
  sized: (height: number) => void };

/** The battle's head as an article opens: its kind and year, its name large, and its place in its book's words. */
function HeadBody({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const said = battle.place?.refs.find(ref => ref.text && placeSayer(ref.cite));
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: palette.amber, fontSize: 15, textAlign: 'right' }}>{battleLine(battle)}</Text>
      <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 44, lineHeight: 60, textAlign: 'right' }}>{battle.name}</Text>
      {battle.location ? <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{battle.location.value}</Text> : null}
      {said ? <QuoteBar by={placeSayer(said.cite)} pieces={[{ text: said.text, name: false }]} tone={palette.rule} size={17} palette={palette} /> : null}
      <Refs refs={[battle.kind, battle.year, battle.location].flatMap(value => value?.refs ?? [])} palette={palette} />
      {/* Where the map pins it, in its book's words (owner, 2026-11-23: every place on the map carries its reference). */}
      {placeRefs(battle).map(refs => <Refs key={refs[0]?.cite} refs={refs} palette={palette} />)}
      <Readings values={[battle.kind, battle.year, battle.location]} palette={palette} />
    </View>
  );
}

/** The head with its share (release 1: every page shares): the map, when it has one, and the head as one picture. */
function Head({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  return (
    <View style={{ gap: 4 }}>
      <HeadBody battle={battle} palette={palette} />
      <View style={{ alignItems: 'flex-start' }}>
        <PassageShare label={`شارك ${battle.name}`} palette={palette} gap={10} sources={sourcesOf(uniqueSources([battle.kind, battle.year, battle.location, battle.place]
          .flatMap(value => value?.refs ?? []).map(citeSource)))}>
          {battle.place ? <View style={{ aspectRatio: 1 / MAP_ASPECT }}><BattleMap places={[battle.place]} palette={palette} /></View> : null}
          <HeadBody battle={battle} palette={palette} />
        </PassageShare>
      </View>
    </View>
  );
}

/** The course's contents: one tab a scene, the one being read underlined and kept in view, and a bar of how far through them the reader is. */
function Contents({ moments, nav, palette }: { moments: AppMoment[]; nav: CourseNav; palette: Palette }) {
  return (
    // Past the course the contents step aside (they stay in the page's flow, so nothing under them moves).
    <View style={{ backgroundColor: palette.paper, paddingVertical: 8, opacity: nav.past ? 0 : 1 }} pointerEvents={nav.past ? 'none' : 'auto'}
      onLayout={event => nav.sized(event.nativeEvent.layout.height)}>
      <StripTabs labels={moments.map((moment, i) => `${num(i + 1)} ${moment.title}`)} at={nav.current} onPick={nav.go} progress palette={palette} />
    </View>
  );
}

/**
 * One scene of the course as a passage of an article: its number and our few words naming it, who the source has it from,
 * the report itself with the Prophet's ﷺ words set apart large in amber where the report gives him as their speaker, its
 * grading and page, the people in it, and the way on to the next scene.
 */
function Scene({ moment, n, palette, next, head }: { moment: AppMoment; n: number; palette: Palette; next?: () => void; head: React.ReactNode }) {
  const share = <PassageShare label={`شارك ${moment.title}`} head={head} palette={palette} gap={8}
    sources={sourcesOf(uniqueSources([citeSource({ text: '', cite: moment.cite, url: moment.url })]))}>
    <SceneBody moment={moment} n={n} palette={palette} />
  </PassageShare>;
  return (
    <View style={{ gap: 8, paddingTop: 10 }}>
      <SceneBody moment={moment} n={n} palette={palette} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {next ? <Button label="المشهد التالي" Icon={ArrowLeft} variant="plain" onPress={next} /> : <View />}
        {share}
      </View>
    </View>
  );
}

/** A scene's words, drawn on the page and in its share picture. */
function SceneBody({ moment, n, palette }: { moment: AppMoment; n: number; palette: Palette }) {
  const split = prophetSaying(moment.quote);
  const body = { color: palette.ink, fontSize: 19, lineHeight: 36, textAlign: 'right' as const };
  return (
    <View style={{ gap: 8 }}>
      <Step n={n} palette={palette}>
        <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 22, textAlign: 'right' }}>{moment.title}</Text>
      </Step>
      {moment.isnad ? <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{moment.isnad}</Text> : null}
      {split ? <>
        <Text style={body}>{split.lead}</Text>
        <PullQuote text={split.saying} palette={palette} />
        {split.rest ? <Text style={body}>{split.rest}</Text> : null}
      </> : <Text style={body}>{moment.quote}</Text>}
      <LeadLink lead={`${moment.grading} ·`} url={moment.url} color={palette.muted}>{moment.cite}</LeadLink>
      {moment.people.length ? <People people={moment.people} palette={palette} /> : null}
    </View>
  );
}

/**
 * A battle as an article (owner, 2026-11-23; sketch tools-design/battles page-v2): its place on the map across the top, its
 * name large with its place in its book's words, then its course scene by scene under contents that follow the reader, then
 * its numbers as dots (after the course, not at the top), and the people. Returned as the page's parts, so the battle
 * screen can keep the contents in view (`stuck`); a quiz that looks it up draws them in a column, the contents without jumps.
 */
export function battleParts(battle: AppBattle, palette: Palette, nav?: CourseNav): { parts: React.ReactNode[]; stuck?: number } {
  // Each card shares as a picture under the battle's name (release 1: every page shares).
  const head = <ShareHead title={battle.name} palette={palette} />;
  const course = courseTitle(battle.kind?.value);
  const parts: React.ReactNode[] = [];
  let stuck: number | undefined;
  if (battle.place) parts.push(<View key="map" style={nav ? { marginHorizontal: -16, marginTop: -16, aspectRatio: 1 / MAP_ASPECT } : { aspectRatio: 1 / MAP_ASPECT }}><BattleMap places={[battle.place]} palette={palette} /></View>);
  parts.push(<Head key="head" battle={battle} palette={palette} />);
  if (battle.moments.length) {
    parts.push(<Text key="course" accessibilityRole="header" style={{ color: palette.accent, fontSize: 18, textAlign: 'right', marginTop: 10 }}>{course}</Text>);
    if (nav) { stuck = parts.length; parts.push(<Contents key="contents" moments={battle.moments} nav={nav} palette={palette} />); }
    battle.moments.forEach((moment, i) => parts.push(
      <View key={`scene-${moment.title}`} ref={nav ? view => nav.held(i, view) : undefined} onLayout={nav?.laidOut}>
        <Scene moment={moment} n={i + 1} palette={palette} head={head} next={nav && i < battle.moments.length - 1 ? () => nav.go(i + 1) : undefined} />
      </View>,
    ));
  }
  if (Object.values(battle.counts).some(Boolean)) parts.push(<Section key="counts" title="العدد" palette={palette} share={{ head }}><Counts battle={battle} palette={palette} /></Section>);
  if (battle.martyrs.length) parts.push(<Section key="martyrs" title="من استشهد يومئذ" palette={palette} share={{ head }}><People people={battle.martyrs} palette={palette} /></Section>);
  if (battle.present.length) parts.push(<Section key="present" title="ممن شهدها" palette={palette} share={{ head }}><People people={battle.present} palette={palette} /></Section>);
  return { parts, stuck };
}

/** A battle drawn whole in a column (a quiz's look-up). */
export function BattleView({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  return <>{battleParts(battle, palette).parts}</>;
}

/** Room between the contents stuck at the top and the head of the scene they bring up. */
const UNDER_GAP = 14;

/** A battle (owner, 2026-11-18; as an article 2026-11-23): its course's contents stay at the top once reached and follow the reading. */
export default function BattleScreen() {
  const palette = usePalette();
  const shrink = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const scenes = useRef(new Map<number, ComponentRef<typeof View>>());
  const sceneAt = useRef(new Map<number, number>());
  const courseEnd = useRef(Infinity);
  const contentsHeight = useRef(0);
  const [current, setCurrent] = useState(0);
  const [past, setPast] = useState(false);
  useTabRetap('battle', () => scroll.current?.scrollTo({ y: 0, animated: true }));
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const battle = battleOf(slug);
  if (!battle) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  // Where each scene is on the page now: what is above it (the head's fonts, a reference opened) may have moved it.
  const measure = (then?: () => void) => {
    const page = scroll.current?.getInnerViewRef();
    let left = scenes.current.size;
    if (!page || !left) return;
    const done = () => { left -= 1; if (!left) then?.(); };
    for (const [i, view] of scenes.current) {
      view.measureLayout(page, (_x, y, _width, height) => {
        sceneAt.current.set(i, y);
        if (i === battle.moments.length - 1) courseEnd.current = y + height;
        done();
      }, done);
    }
  };
  const nav: CourseNav = {
    current, past,
    go: i => measure(() => {
      const y = sceneAt.current.get(i);
      if (y !== undefined) scroll.current?.scrollTo({ y: Math.max(0, y - contentsHeight.current - UNDER_GAP), animated: true });
    }),
    sized: height => { contentsHeight.current = height; },
    held: (i, view) => { if (view) scenes.current.set(i, view); else scenes.current.delete(i); },
    laidOut: () => measure(),
  };
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    shrink(event);
    const y = event.nativeEvent.contentOffset.y + contentsHeight.current + UNDER_GAP + 1;
    let reading = 0;
    for (const [i, top] of sceneAt.current) if (top <= y && i > reading) reading = i;
    if (reading !== current) setCurrent(reading);
    const beyond = event.nativeEvent.contentOffset.y > courseEnd.current;
    if (beyond !== past) setPast(beyond);
  };
  const { parts, stuck } = battleParts(battle, palette, nav);
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll />
      <ScrollView ref={scroll} onScroll={onScroll} onScrollBeginDrag={() => measure()} onContentSizeChange={() => measure()} scrollEventThrottle={16} stickyHeaderIndices={stuck === undefined ? undefined : [stuck]}
        contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 14 }}>
        {parts}
      </ScrollView>
    </View>
  );
}
