import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { router, useLocalSearchParams } from 'expo-router';
import { CalendarDays, ChevronLeft, Link2, MapPin, Network, Waypoints } from 'lucide-react-native';
import { factSources, kunyaName, namePieces, pageLabel, pageSources, sayerAt, saidBy, virtueGroups, volumeLabel, type AppPerson, type PersonFact, type PersonLink } from '@shared/tarajim';
import { surahName } from '@shared/quran/surahNames';
import { counted, num } from '@shared/quran/arabicNumber';
import { sourceById } from '@shared/sources';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { SharedCard, ShareHead } from '@/ui/CardShare';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import BattleMap from '@/components/battles/BattleMap';
import LitAyat from '@/components/quran/text/LitAyat';
import { ayahMushafWords } from '@/lib/mushaf';
import { openAyahPage, toTab } from '@/lib/ways';
import { placeSources } from '@shared/drawingCards';
import type { AppBattle } from '@shared/battles/battle';
import IconButton from '@/ui/IconButton';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { findPerson, personName, unvowelled } from '@/lib/tarajim';
import { personLife } from '@/lib/life';
import { battleOf } from '@/lib/battles';
import { storiesOfPerson, storyAyatOf } from '@/lib/links';
import { StoryLinkRow } from '@/components/stories/StoryParts';
import { citeSource } from '@shared/quiz/sources';
import LifeTimeline from '@/components/LifeTimeline';
import { FEATURE_ICON } from '@/components/featureIcons';
import Tabs from '@/ui/Tabs';
import Saying from '@/ui/Saying';
import FactCells, { type FactCell, type Reading } from '@/ui/FactCells';
import TitleCells from '@/ui/TitleCells';
import QuoteBar, { type QuotePiece } from '@/ui/QuoteBar';
import SahihSaying from '@/components/SahihSaying';
import SayingBand from '@/ui/SayingBand';
import TraitChips from '@/ui/TraitChips';
import { traitChips, traitSpans } from '@shared/tarajimTraits';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import { lifeSources } from '@shared/events/lifeTimeline';
import type { QuizSource } from '@shared/quiz/sources';
import TiesRing, { TieSheet } from '@/components/TiesRing';
import type { Tie } from '@shared/tarajimGraph';
import { settledTies } from '@shared/peopleCards';
import { Credit } from '@/components/Credit';

const siyar = sourceById('siyar')!;
const STORIES_SHOWN = 3;
const RING_ROOM = 32 + 30;
const body = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' as const });
const muted = (palette: Palette) => ({ color: palette.muted, fontSize: 14, textAlign: 'right' as const });
const openPerson = (slug: string) => router.push({ pathname: '/person', params: { slug } });

function Part({ n, title, palette, children, above, row, source, head, pad, gap = 10 }: { n: number; title: string; palette: Palette; children: React.ReactNode;
  pad?: number; gap?: number;
  head: React.ReactNode;
  above?: React.ReactNode;
  row?: React.ReactNode;
  source?: QuizSource[] }) {
  return (
    <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>{num(n)} · {title}</Text>
      {above}
      <SharedCard palette={palette} gap={gap} pad={pad} clip={pad === 0} row={row} source={source && sourcesOf(source)} shareLabel={`شارك ${title}`}
        shareHead={<>{head}<Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right', paddingHorizontal: 8 }}>{title}</Text></>}>{children}</SharedCard>
    </View>
  );
}


const sayerOf = (fact: PersonFact, many = false) => (fact.anonymous ? 'قيل:' : many ? sayerAt(fact) : saidBy(fact));

function Quote({ fact, palette, marked = false, many = false, children }: { fact: PersonFact; palette: Palette; marked?: boolean; many?: boolean;
  children?: React.ReactNode }) {
  return (
    <Saying by={sayerOf(fact, many)} palette={palette}>
      {children ?? <Text style={marked ? { ...body(palette), color: palette.green } : body(palette)}>{fact.text}</Text>}
    </Saying>
  );
}

const namesOf = (person: AppPerson) => [personName(person), ...person.kunya.map(fact => fact.text), ...person.laqab.map(fact => fact.text)];

function PageOf({ fact, palette }: { fact: PersonFact; palette: Palette }) {
  if (!fact.refs.length) return null;
  const books = sourcesOf(pageSources(fact.refs, { text: fact.text, by: saidBy(fact) }));
  return <SourceLine named={books} sources={books} label={pageLabel(fact.refs)} palette={palette} small />;
}

function VirtueList({ person, palette, marked }: { person: AppPerson; palette: Palette; marked?: number }) {
  const names = namesOf(person);
  const groups = virtueGroups(person.virtues).map(group => ({ ...group, items: group.items.filter(({ fact }) => !fact.sahih) })).filter(group => group.items.length);
  const sahih = virtueGroups(person.virtues).flatMap(group => group.items.filter(({ fact }) => fact.sahih).map(item => ({ ...item, prophet: group.by === PROPHET_SAYS })))
    .sort((a, b) => Number(b.prophet) - Number(a.prophet) || a.at - b.at);
  const prophet = groups.find(group => group.by === PROPHET_SAYS);
  const author = (fact: PersonFact) => `قال ${pageSources(fact.refs)[0]?.author ?? 'الذهبي'}:`;
  return <>
    {prophet && (
      <SayingBand by={PROPHET_SAYS} tone={palette.amber} palette={palette}>
        {prophet.items.map(({ fact, at }) => (
          <QuoteBar key={at} quoted tone={palette.amber} pieces={namePieces(fact.text, names)} palette={palette} marked={at === marked}
            foot={<PageOf fact={fact} palette={palette} />} />
        ))}
      </SayingBand>
    )}
    {(sahih.length > 0 || groups.some(group => group !== prophet)) && (
      <View style={{ padding: 16, gap: 14 }}>
        {sahih.map(({ fact, at, prophet: his }) => (
          <SahihSaying key={at} fact={fact} names={names} palette={palette} tone={his ? palette.amber : undefined} marked={at === marked} />
        ))}
        {groups.filter(group => group !== prophet).flatMap(group => group.items.map(({ fact, at }) => (
          <QuoteBar key={at} by={group.by ?? (fact.anonymous ? 'قيل:' : author(fact))} pieces={namePieces(fact.text, names)} palette={palette}
            marked={at === marked} foot={<PageOf fact={fact} palette={palette} />} />
        )))}
      </View>
    )}
  </>;
}
const PROPHET_SAYS = 'قال النبي ﷺ:';

export function Virtues({ person, palette, marked }: { person: AppPerson; palette: Palette; marked?: number }) {
  return <>
    <VirtueList person={person} palette={palette} marked={marked} />
    <Credit facts={person.virtues} palette={palette} />
  </>;
}

function Looks({ person, palette }: { person: AppPerson; palette: Palette }) {
  const names = namesOf(person);
  const author = (fact: PersonFact) => pageSources(fact.refs)[0]?.author ?? 'الذهبي';
  const named = (fact: PersonFact) => (fact.anonymous ? undefined : fact.by.length ? saidBy(fact)?.replace(/^قالت? /u, '').replace(/:$/u, '') : author(fact));
  const traits = traitChips(person.appearance, named);
  return <>
    {traits.length > 0 && <View style={{ padding: 16 }}><TraitChips traits={traits} palette={palette} /></View>}
    <View style={{ padding: 16, paddingTop: traits.length ? 0 : 16, gap: 14 }}>
      {person.appearance.map((fact, i) => (
        <QuoteBar key={i} by={saidBy(fact) ?? `قال ${author(fact)}:`} pieces={lookPieces(fact.text, names)} palette={palette} size={17} />
      ))}
    </View>
    <Credit facts={person.appearance} palette={palette} />
  </>;
}

function lookPieces(text: string, names: string[]): QuotePiece[] {
  const out: QuotePiece[] = [];
  let at = 0;
  for (const span of traitSpans(text)) {
    if (span.start > at) out.push(...namePieces(text.slice(at, span.start), names));
    out.push({ text: text.slice(span.start, span.end), mark: true });
    at = span.end;
  }
  if (at < text.length) out.push(...namePieces(text.slice(at), names));
  return out;
}

const readingOf = (fact: PersonFact, value: string): Reading => ({ value,
  by: fact.anonymous ? 'قيل' : fact.by.length ? sayerAt(fact) : `عند ${pageSources(fact.refs)[0]?.author ?? 'الذهبي'}` });

function personCells(person: AppPerson, islam = false): FactCell[] {
  const f = person.sex === 'FEMALE';
  const { year, month, place, age } = person.died;
  return [
    ...(islam && person.islamAge.length ? [{ key: 'islam', label: f ? 'أسلمت وعمرها' : 'أسلم وعمره', readings: person.islamAge.map(fact => readingOf(fact, ageOf(fact))) }] : []),
    ...(year.length ? [{ key: 'year', Icon: CalendarDays, label: f ? 'وفاتها' : 'وفاته', readings: [
      ...year.map(fact => readingOf(fact, yearOf(fact))), ...(islam ? month.map(fact => readingOf(fact, unvowelled(fact.text))) : [])] }] : []),
    ...(islam && !year.length && month.length ? [{ key: 'month', label: f ? 'شهر وفاتها' : 'شهر وفاته', readings: month.map(fact => readingOf(fact, unvowelled(fact.text))) }] : []),
    ...(place.length ? [{ key: 'place', Icon: MapPin, label: f ? 'ماتت في' : 'مات في', readings: place.map(fact => readingOf(fact, unvowelled(fact.text).replace(/^ب(?=ال)/u, ''))) }] : []),
    ...(age.length ? [{ key: 'age', label: f ? 'عمرها' : 'عمره', readings: age.map(fact => readingOf(fact, ageOf(fact))) }] : []),
  ];
}

export function PersonBrief({ person, palette }: { person: AppPerson; palette: Palette }) {
  const cells = personCells(person);
  const names = namesOf(person);
  const sayer = (fact: PersonFact, by?: string) => by ?? (fact.anonymous ? 'قيل:' : `قال ${pageSources(fact.refs)[0]?.author ?? 'الذهبي'}:`);
  return (
    <View>
      <TitleCells title={personName(person)} line={person.fullName?.text} cells={cells} palette={palette} />
      {person.virtues.length > 0 && (
        <View style={{ padding: 16, paddingTop: 14, gap: 14 }}>
          {virtueGroups(person.virtues).flatMap(group => group.items.map(({ fact, at }) => (fact.sahih
            ? <SahihSaying key={at} fact={fact} names={names} palette={palette} tone={group.by === PROPHET_SAYS ? palette.amber : undefined} />
            : <QuoteBar key={at} pieces={namePieces(fact.text, names)} palette={palette} by={sayer(fact, group.by)}
              tone={group.by === PROPHET_SAYS ? palette.amber : undefined} />
          )))}
        </View>
      )}
    </View>
  );
}
export const briefFacts = (person: AppPerson) => [...(person.fullName ? [person.fullName] : []), ...person.virtues, ...person.died.year, ...person.died.place, ...person.died.age];

function Line({ label, palette, children }: { label: string; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <Text style={{ color: palette.muted, fontSize: 14, paddingTop: 4 }}>{label}</Text>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function Names({ links, palette, onShow }: { links: PersonLink[]; palette: Palette; onShow: (link: PersonLink) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6 }}>
      {links.map(link => (
        <View key={link.slug} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Button variant="plain" label={personName(link)} onPress={link.inApp ? () => openPerson(link.slug) : () => onShow(link)} />
          {link.disputed && <Text style={muted(palette)}>(على خلاف)</Text>}
        </View>
      ))}
    </View>
  );
}

const suffixOf = (person: AppPerson) => (person.sex === 'FEMALE' ? 'ها' : 'ه');

function ties(person: AppPerson) {
  const s = suffixOf(person);
  const spouses = person.spouses;
  const fathers = person.parents.filter(p => p.sex !== 'FEMALE');
  const mothers = person.parents.filter(p => p.sex === 'FEMALE');
  return [
    { label: `أبو${s}`, links: fathers },
    { label: `أم${s}`, links: mothers },
    { label: spouses.length > 1 ? `أزواج${s}` : `زوج${s}`, links: spouses },
    { label: `أولاد${s}`, links: settledTies(person.slug, 'child', person.children) },
    { label: `إخوت${s}`, links: person.siblings },
    { label: `قرابت${s}`, links: person.cousins },
    { label: person.sex === 'FEMALE' ? 'صحبت' : 'صحب', links: person.companionOf },
  ].filter(tie => tie.links.length > 0);
}

const yearOf = (fact: PersonFact) => (typeof fact.value === 'number' ? `سنة ${num(fact.value)}هـ` : unvowelled(fact.text));
const ageOf = (fact: PersonFact) => (typeof fact.value === 'number' ? counted(fact.value, ['سنة', 'سنتين', 'سنين']) : unvowelled(fact.text));

export default function PersonScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const width = usePageWidth();
  const [tie, setTie] = useState<Pick<Tie, 'to' | 'link' | 'reversed'> | undefined>();
  const showLink = (link: PersonLink) => setTie({ to: link.slug, link });
  const showBattle = (link: PersonLink) => (battleOf(link.slug) ? toTab({ pathname: '/battle', params: { slug: link.slug } }) : showLink(link));
  const [tiesView, setTiesView] = useState<DrawingOrText>('drawing');
  const [allStories, setAllStories] = useState(false);
  const person = findPerson(slug);
  const lifeItems = useMemo(() => (person ? personLife(person) : []), [person]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  if (!person) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const tree = () => router.push({ pathname: '/nasab', params: { slug: person.slug, pick: '1' } });
  const names = [...person.kunya.map(fact => ({ label: `كنيت${suffixOf(person)}`, fact, kunya: true })), ...person.laqab.map(fact => ({ label: `لقب${suffixOf(person)}`, fact, kunya: false }))];
  const f = person.sex === 'FEMALE';
  const drawn = new Set(lifeItems.map(item => item.open?.slug));
  const battles = uniq(person.battles).filter(b => !drawn.has(b.slug));
  const life = [...battles, ...person.absentFrom];
  const places = mapBattles(person, lifeItems);
  const ayat = person.ayat.filter(fact => typeof fact.value === 'string');
  const told = storyAyatOf(person.slug, ayat.map(fact => fact.value as string));
  const allRevealed = ayat.every(fact => fact.kind === 'REVEALED_ABOUT');
  const stories = storiesOfPerson(person.slug);
  const tieList = ties(person);
  const head = <ShareHead title={personName(person)} palette={palette} />;
  let n = 0;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll>
        <IconButton Icon={Network} label="شجرة النسب" onPress={tree} />
      </TopBar>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 18 }}>
        <SharedCard palette={palette} pad={0} gap={0} clip source={heroSources(person)} shareLabel={`شارك ${personName(person)}`} shareHead={head}
          row={person.fullName && <IconButton Icon={FEATURE_ICON.nasab} label={f ? 'قارن نسبها بغيرها' : 'قارن نسبه بغيره'} onPress={tree} />}>
          <View style={{ padding: 16, paddingBottom: 14, gap: 10 }}>
            <View style={{ gap: 2 }}>
              <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, lineHeight: 40, textAlign: 'right' }}>{personName(person)}</Text>
              {person.fullName && <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{`${saidBy(person.fullName) ? `${saidBy(person.fullName)} ` : ''}${person.fullName.text}`}</Text>}
              {[...(person.otherNames ?? []), ...person.nameVariants].map((fact, i) => (
                <Text key={i} style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{`${saidBy(fact) ?? 'وقيل:'} ${fact.text}`}</Text>
              ))}
            </View>
            {names.map(({ label, fact, kunya }, i) => {
              const value = kunya ? kunyaName(fact.text) : fact.text;
              return saidBy(fact)
                ? <Line key={i} label={label} palette={palette}><Quote fact={fact} palette={palette}><Text style={body(palette)}>{value}</Text></Quote></Line>
                : <Text key={i} style={{ ...body(palette), lineHeight: 28 }}><Text style={{ color: palette.muted, fontSize: 14 }}>{`${label} `}</Text>{value}</Text>;
            })}
            {person.titles.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {person.titles.map(title => (
                  <Chip key={title.title} label={title.name} on={false} small palette={palette}
                    onPress={title.shared ? () => router.navigate({ pathname: '/people', params: { title: title.title, at: String(Date.now()) } }) : undefined} />
                ))}
              </View>
            )}
          </View>
          <FactCells cells={personCells(person, true)} palette={palette} />
        </SharedCard>

        {person.virtues.length > 0 && (
          <Part head={head} n={++n} title={f ? 'مناقبها' : 'مناقبه'} palette={palette} pad={0} gap={0}>
            <Virtues person={person} palette={palette} />
          </Part>
        )}

        {person.appearance.length > 0 && (
          <Part head={head} n={++n} title={f ? 'صفتها' : 'صفته'} palette={palette} pad={0} gap={0}>
            <Looks person={person} palette={palette} />
          </Part>
        )}

        {(life.length > 0 || lifeItems.length > 0) && (
          <Part head={head} n={++n} title={f ? 'حياتها' : 'حياته'} palette={palette} source={lifeSources(lifeItems)}
            row={lifeItems.length > 0 && <IconButton Icon={FEATURE_ICON.life} label={f ? 'قارن حياتها بغيرها' : 'قارن حياته بغيره'} onPress={() => router.push({ pathname: '/life', params: { slugs: person.slug } })} />}>
            {lifeItems.length > 0 && <LifeTimeline items={lifeItems} palette={palette} inCard foldable />}
            {battles.length > 0 && <Line label={f ? 'شهدت' : 'شهد'} palette={palette}><Names links={battles} palette={palette} onShow={showBattle} /></Line>}
            {person.absentFrom.length > 0 && <Line label={f ? 'غابت عن' : 'غاب عن'} palette={palette}><Names links={uniq(person.absentFrom)} palette={palette} onShow={showBattle} /></Line>}
            {life.length > 0 && <Credit facts={life} palette={palette} quotes />}
          </Part>
        )}

        {places.length > 0 && (
          <Part head={head} n={++n} title={f ? 'أماكنها' : 'أماكنه'} palette={palette} pad={0} gap={0} source={placesSources(places, person, lifeItems)}>
            <BattleMap places={places.map(battle => ({ name: battle.place!.name, at: battle.place!.at }))} palette={palette}
              onPin={names => { const at = places.find(battle => names.includes(battle.place!.name)); if (at) openBattle(at.slug); }} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 12 }}>
              {places.map(battle => <Chip key={battle.slug} label={battle.name} on={false} small palette={palette} onPress={() => openBattle(battle.slug)} />)}
            </View>
          </Part>
        )}

        {tieList.length > 0 && (
          <Part head={head} n={++n} title={f ? 'صلاتها' : 'صلاته'} palette={palette}
            above={<Tabs palette={palette} label="كيف تُعرض الصلات" value={tiesView} onChange={setTiesView} options={DRAWING_OR_TEXT} />}
            row={<>
              <IconButton Icon={Waypoints} label={f ? 'تنقّل في صلاتها' : 'تنقّل في صلاته'} onPress={() => router.push({ pathname: '/ties', params: { slug: person.slug } })} />
              <IconButton Icon={Link2} label={f ? 'بينها وبين…' : 'بينه وبين…'} onPress={() => router.push({ pathname: '/between', params: { slugs: person.slug } })} />
            </>}>
            {tiesView === 'drawing'
              ? <TiesRing slug={person.slug} width={Math.min(width - RING_ROOM, 480)} palette={palette} onPick={openPerson} onShow={setTie} />
              : tieList.map(tie => <Line key={tie.label} label={tie.label} palette={palette}><Names links={tie.links} palette={palette} onShow={showLink} /></Line>)}
            <Credit facts={tieList.flatMap(tie => tie.links)} palette={palette} quotes />
          </Part>
        )}

        {stories.length > 0 && (
          <Part head={head} n={++n} title={f ? 'قصصها' : 'قصصه'} palette={palette} gap={0}
            row={stories.length > STORIES_SHOWN && !allStories && <Button pill label={f ? 'كل قصصها' : 'كل قصصه'} Icon={ChevronLeft} onPress={() => setAllStories(true)} />}>
            {(allStories ? stories : stories.slice(0, STORIES_SHOWN)).map((story, i) => <StoryLinkRow key={story.slug} story={story} palette={palette} first={i === 0} />)}
          </Part>
        )}

        {(ayat.length > 0 || told.length > 0) && (
          <Part head={head} n={++n} palette={palette} source={[...factSources(ayat, true), ...told.flatMap(({ ayat: set }) => set.refs.map(citeSource))]}
            title={allRevealed ? (f ? 'آيات نزلت فيها' : 'آيات نزلت فيه') : (f ? 'آيات فيها' : 'آيات فيه')}>
            {groupBySentence(ayat).map(({ facts, keys }) => (
              <View key={keys[0]} style={{ gap: 8 }}>
                <LitAyat ayat={keys.map(key => ({ words: ayahMushafWords(key), lit: [], number: Number(key.split(':')[1]) }))} menu={keys} palette={palette} />
                <Button variant="plain" label={`${ayatName(keys)}${facts.some(fact => fact.kind === 'REVEALED_ABOUT') && !allRevealed ? (f ? ' · نزلت فيها' : ' · نزلت فيه') : ''}`} Icon={ChevronLeft} onPress={() => openAyahPage(keys[0])} />
                {facts.map(fact => (fact.sahih
                  ? <SahihSaying key={fact.text} fact={fact} names={namesOf(person)} palette={palette} />
                  : <QuoteBar key={fact.text} by={saidBy(fact) ?? `قال ${pageSources(fact.refs)[0]?.author ?? 'الذهبي'}:`} pieces={namePieces(fact.text, namesOf(person))} palette={palette} size={17} />))}
              </View>
            ))}
            {told.map(({ story, ayat: set, keys }) => (
              <View key={story.slug + set.from} style={{ gap: 8 }}>
                <LitAyat ayat={keys.map(key => ({ words: ayahMushafWords(key), lit: [], number: Number(key.split(':')[1]) }))} menu={keys} palette={palette} />
                <Button variant="plain" label={ayatName(keys)} Icon={ChevronLeft} onPress={() => openAyahPage(keys[0])} />
                <StoryLinkRow story={story} palette={palette} />
              </View>
            ))}
            {ayat.length > 0 && <Credit facts={ayat} palette={palette} quotes />}
          </Part>
        )}
      </ScrollView>
      <TieSheet tie={tie} onClose={() => setTie(undefined)} palette={palette} />
    </View>
  );
}

const openBattle = (slug: string) => toTab({ pathname: '/battle', params: { slug } });


function heroSources(person: AppPerson) {
  const { book, part } = volumeLabel(person.entry.volume);
  const at = person.entry.toVolume !== undefined && part !== undefined
    ? `${num(part)}/${num(Number(person.entry.from))} – ${num(volumeLabel(person.entry.toVolume).part ?? person.entry.toVolume)}/${num(Number(person.entry.to))}`
    : `${part !== undefined ? `${num(part)}/` : ''}${num(Number(person.entry.from))}${person.entry.to && person.entry.to !== person.entry.from ? `–${num(Number(person.entry.to))}` : ''}`;
  const entry: QuizSource = { book, author: 'الذهبي', at, url: siyar.link.url, ...(siyar.edition && { edition: siyar.edition }) };
  const facts = [...(person.fullName ? [person.fullName] : []), ...(person.otherNames ?? []), ...person.nameVariants, ...person.kunya, ...person.laqab,
    ...person.titles, ...person.islamAge, ...person.died.year, ...person.died.month, ...person.died.place, ...person.died.age];
  return sourcesOf([entry, ...factSources(facts, true)]);
}

function mapBattles(person: AppPerson, life: ReturnType<typeof personLife>) {
  const slugs = [...person.battles.map(link => link.slug), ...life.flatMap(item => (item.open?.to === 'battle' ? [item.open.slug] : []))];
  return [...new Set(slugs)].flatMap(slug => battleOf(slug) ?? []).filter(battle => battle.place)
    .sort((a, b) => (a.year?.value ?? Infinity) - (b.year?.value ?? Infinity));
}
const placesSources = (places: AppBattle[], person: AppPerson, life: ReturnType<typeof personLife>): QuizSource[] => [
  ...factSources(person.battles.filter(link => places.some(battle => battle.slug === link.slug)), true),
  ...lifeSources(life.filter(item => places.some(battle => battle.slug === item.open?.slug))),
  ...placeSources(places),
];

function groupBySentence(ayat: AppPerson['ayat']) {
  const groups: { facts: AppPerson['ayat']; keys: string[] }[] = [];
  for (const fact of ayat) {
    const last = groups[groups.length - 1];
    const head = last?.facts[0];
    const [surah, ayah] = (fact.value as string).split(':').map(Number);
    const [lastSurah, lastAyah] = (last?.keys[last.keys.length - 1] ?? '').split(':').map(Number);
    if (head && last.facts.length === 1 && head.text === fact.text && head.kind === fact.kind && surah === lastSurah && ayah === lastAyah + 1) last.keys.push(fact.value as string);
    else if (last?.keys.includes(fact.value as string)) last.facts.push(fact);
    else groups.push({ facts: [fact], keys: [fact.value as string] });
  }
  return groups;
}

function ayatName(keys: string[]) {
  const runs: [number, number, number][] = [];
  for (const [surah, ayah] of keys.map(key => key.split(':').map(Number))) {
    const last = runs[runs.length - 1];
    if (last && last[0] === surah && last[2] === ayah - 1) last[2] = ayah;
    else runs.push([surah, ayah, ayah]);
  }
  const named = runs.map(([surah, first, last], i) => `${i && runs[i - 1][0] === surah ? '' : `${surahName(surah)} `}${num(first)}${last > first ? `–${num(last)}` : ''}`);
  return named.join('، ');
}

function uniq(links: PersonLink[]) {
  return links.filter((link, i) => links.findIndex(other => other.slug === link.slug) === i);
}
