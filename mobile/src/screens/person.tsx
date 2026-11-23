import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { usePageWidth } from '@/ui/column';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeftRight, Link2, Network, Waypoints } from 'lucide-react-native';
import { factSources, kunyaName, sayerAt, saidBy, volumeLabel, type AppPerson, type PersonFact, type PersonLink } from '@shared/tarajim';
import { surahName } from '@shared/quran/surahNames';
import { counted, num } from '@shared/quran/arabicNumber';
import { sourceById } from '@shared/sources';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import { SharedCard, ShareHead } from '@/ui/CardShare';
import Chip from '@/ui/Chip';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import Reference from '@/ui/Reference';
import SourceLine, { sourcesOf } from '@/ui/SourceLine';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, personName, unvowelled } from '@/lib/tarajim';
import { personLife } from '@/lib/life';
import { battleOf } from '@/lib/battles';
import LifeTimeline from '@/components/LifeTimeline';
import Tabs from '@/ui/Tabs';
import Saying from '@/ui/Saying';
import { DRAWING_OR_TEXT, type DrawingOrText } from '@shared/drawingText';
import { lifeSources } from '@shared/events/lifeTimeline';
import type { QuizSource } from '@shared/quiz/sources';
import { NasabTree } from './nasab';
import TiesRing, { TieSheet } from '@/components/TiesRing';
import type { Tie } from '@shared/tarajimGraph';

const siyar = sourceById('siyar')!;
/** The page's side room and the card's padding and frame, taken from the screen's width for the ties ring inside its card. */
const RING_ROOM = 32 + 30;
const body = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' as const });
const muted = (palette: Palette) => ({ color: palette.muted, fontSize: 14, textAlign: 'right' as const });
const openPerson = (slug: string) => router.push({ pathname: '/person', params: { slug } });

/**
 * A section (owner 2026-11-20: the home card's shape): its name in the accent, numbered as on the sketch («١ · نسبه»), a
 * switch above the card where it has one, the card, its own buttons in the row under it and its books on the line under them.
 */
function Part({ n, title, palette, children, above, row, source, head }: { n: number; title: string; palette: Palette; children: React.ReactNode;
  /** The person's name over the section's share picture (release 1: every page shares). */
  head: React.ReactNode;
  /** Above the card: the «الرسم | النص» switch. */
  above?: React.ReactNode;
  /** The section's own buttons, under the card. */
  row?: React.ReactNode;
  /** Books the section names besides the `Credit`s inside it. */
  source?: QuizSource[] }) {
  return (
    <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>{num(n)} · {title}</Text>
      {above}
      <SharedCard palette={palette} gap={10} row={row} source={source && sourcesOf(source)} shareLabel={`شارك ${title}`}
        shareHead={<>{head}<Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right', paddingHorizontal: 8 }}>{title}</Text></>}>{children}</SharedCard>
    </View>
  );
}

/**
 * The books a section rests on (each value's words with who says them at its pages when `quotes`, then the edition and its
 * link): in a card with a row they join its book line (ui/sourceSlot.ts), elsewhere each is a collapsed reference.
 */
export function Credit({ facts, palette, quotes = false }: { facts: PersonFact[]; palette: Palette; quotes?: boolean }) {
  return <>{sourcesOf(factSources(facts, quotes)).map(book => <Reference key={book.line} title={book.line} quotes={book.quotes} links={book.links} places={book.places} editions={book.editions} palette={palette} />)}</>;
}

/**
 * Who says it, on the line before the value (owner 2026-11-20: the speaker first): a narrator's or the Prophet's ﷺ words
 * always carry the line; the author's own words carry it only where the book gives more than one value (`many`), so each
 * of them reads as one saying among others.
 */
const sayerOf = (fact: PersonFact, many = false) => (fact.anonymous ? 'قيل:' : many ? sayerAt(fact) : saidBy(fact));

/** A value from the entry, with who says it before it; a `marked` one (a quiz's answer, once shown) in green. */
function Quote({ fact, palette, marked = false, many = false, children }: { fact: PersonFact; palette: Palette; marked?: boolean; many?: boolean;
  /** What is shown for the fact, when not its words as printed (a year, an age, a kunya as one says it). */
  children?: React.ReactNode }) {
  return (
    <Saying by={sayerOf(fact, many)} palette={palette}>
      {children ?? <Text style={marked ? { ...body(palette), color: palette.green } : body(palette)}>{fact.text}</Text>}
    </Saying>
  );
}

/** A person's virtues as the entry gives them, with the pages: the person page's «مناقبه» and a quiz's look-up draw it. */
export function Virtues({ person, palette, marked }: { person: AppPerson; palette: Palette; marked?: number }) {
  return <>
    {person.virtues.map((fact, i) => <Quote key={i} fact={fact} palette={palette} marked={i === marked} />)}
    <Credit facts={person.virtues} palette={palette} />
  </>;
}

/** A labelled line: the label small on the left, the value on the right («أبوه  العوام بن خويلد»). */
function Line({ label, palette, children }: { label: string; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      <View style={{ flex: 1 }}>{children}</View>
      <Text style={{ color: palette.muted, fontSize: 13, paddingTop: 4 }}>{label}</Text>
    </View>
  );
}

/** Names in a line, all alike (owner, 2026-11-22): one with a page in the app opens it, the others the sentence that names them. */
function Names({ links, palette, onShow }: { links: PersonLink[]; palette: Palette; onShow: (link: PersonLink) => void }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6 }}>
      {links.map(link => (
        <View key={link.slug} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Button variant="plain" label={personName(link)} onPress={link.inApp ? () => openPerson(link.slug) : () => onShow(link)} />
          {/* A tie the book gives with a word against it: both texts and sayers are in the sources under the section. */}
          {link.disputed && <Text style={muted(palette)}>(على خلاف)</Text>}
        </View>
      ))}
    </View>
  );
}

/** «ـه» or «ـها»: the labels follow the person's sex. */
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
    { label: `أولاد${s}`, links: person.children },
    { label: `إخوت${s}`, links: person.siblings },
    { label: `قرابت${s}`, links: person.cousins },
    { label: person.sex === 'FEMALE' ? 'صحبت' : 'صحب', links: person.companionOf },
  ].filter(tie => tie.links.length > 0);
}

/** «سنة ٣٦هـ», «جمادى الآخرة», «٨٨ سنة»: the number the reader confirmed, else the words as printed. */
const yearOf = (fact: PersonFact) => (typeof fact.value === 'number' ? `سنة ${num(fact.value)}هـ` : unvowelled(fact.text));
const ageOf = (fact: PersonFact) => (typeof fact.value === 'number' ? counted(fact.value, ['سنة', 'سنتين', 'سنين']) : unvowelled(fact.text));
const ayahOf = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${surahName(surah)} ${num(ayah)}`;
};

/**
 * A person's page (owner, 2026-11-18; sketch tarajim-app/person-page-dark.png): the name as the book prints it, then
 * each section from the converted entry only, every value with who says it and its pages. A section with nothing in the
 * entry is not drawn.
 */
export default function PersonScreen() {
  const palette = usePalette();
  const onScroll = useShrinkOnScroll();
  const bottom = useTabBarSpace();
  const { slug = '' } = useLocalSearchParams<{ slug?: string }>();
  const width = usePageWidth();
  const [tie, setTie] = useState<Pick<Tie, 'to' | 'link' | 'reversed'> | undefined>();
  const showLink = (link: PersonLink) => setTie({ to: link.slug, link });
  // A battle opens its page when the app has one, as the timeline's battles do.
  const showBattle = (link: PersonLink) => (battleOf(link.slug) ? toTab({ pathname: '/battle', params: { slug: link.slug } }) : showLink(link));
  // «نسبه» drawn as the tree of fathers or as the book writes it (owner 2026-11-20: «الرسم | النص», the drawing first).
  const [nasabView, setNasabView] = useState<DrawingOrText>('drawing');
  // «صلاته» as the ring or as the lines of names, which name the same people (the drawing first).
  const [tiesView, setTiesView] = useState<DrawingOrText>('drawing');
  const person = findPerson(slug);
  const lifeItems = useMemo(() => (person ? personLife(person) : []), [person]);
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  if (!person) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const tree = () => router.push({ pathname: '/nasab', params: { slug: person.slug } });
  const names = [...person.kunya.map(fact => ({ label: `كنيت${suffixOf(person)}`, fact, kunya: true })), ...person.laqab.map(fact => ({ label: `لقب${suffixOf(person)}`, fact, kunya: false }))];
  const f = person.sex === 'FEMALE';
  // A battle the timeline draws is not named again under it; one the entry names that the timeline lacks stays in the line.
  const drawn = new Set(lifeItems.map(item => item.open?.slug));
  const battles = uniq(person.battles).filter(b => !drawn.has(b.slug));
  const life = [...person.islamAge, ...battles, ...person.absentFrom, ...person.died.year, ...person.died.month, ...person.died.age, ...person.died.place];
  const tieList = ties(person);
  const { book, part } = volumeLabel(person.entry.volume);
  const titleSources = sourcesOf(factSources(person.titles, true));
  const head = <ShareHead title={personName(person)} palette={palette} />;
  let n = 0;
  return (
    <View style={{ flex: 1, backgroundColor: palette.paper }}>
      <TopBar back={back} hideOnScroll>
        <IconButton Icon={Network} label="شجرة النسب" onPress={tree} />
      </TopBar>
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ padding: 16, paddingBottom: bottom, gap: 18 }}>
        <View style={{ gap: 6 }}>
          <Text accessibilityRole="header" style={{ color: palette.ink, fontSize: 28, textAlign: 'right' }}>{personName(person)}</Text>
          {person.kunya[0] && <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{kunyaName(person.kunya[0].text)}</Text>}
          {person.titles.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {person.titles.map(title => (
                <Chip key={title.title} label={title.name} on={false} small palette={palette}
                  onPress={title.shared ? () => router.navigate({ pathname: '/people', params: { title: title.title, at: String(Date.now()) } }) : undefined} />
              ))}
            </View>
          )}
          {titleSources.length > 0 && <SourceLine named={titleSources} sources={titleSources} palette={palette} />}
        </View>

        {person.fullName && (
          <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'نسبها' : 'نسبه'} palette={palette}
            above={<Tabs palette={palette} label="كيف يُعرض النسب" value={nasabView} onChange={setNasabView} options={DRAWING_OR_TEXT} />}
            row={<IconButton Icon={ArrowLeftRight} label={person.sex === 'FEMALE' ? 'قارن نسبها بغيرها' : 'قارن نسبه بغيره'} onPress={tree} />}>
            {nasabView === 'drawing' ? <NasabTree slugs={[person.slug]} palette={palette} meetings={false} text={false} /> : <>
            <Quote fact={person.fullName} palette={palette} many={!!person.otherNames?.length} />
            {person.otherNames?.map((fact, i) => (
              <Quote key={i} fact={fact} palette={palette} many><Text style={body(palette)}>وقيل: {fact.text}</Text></Quote>
            ))}
            {person.nameVariants.map((fact, i) => <Quote key={`v${i}`} fact={fact} palette={palette} many />)}
            </>}
            <Credit facts={[person.fullName, ...(person.otherNames ?? []), ...person.nameVariants]} palette={palette} />
          </Part>
        )}

        {names.length > 0 && (
          <Part head={head} n={++n} title={[person.kunya.length ? 'كنيت' : '', person.laqab.length ? 'لقب' : ''].filter(Boolean).map(w => w + suffixOf(person)).join(' و')} palette={palette}>
            {names.map(({ label, fact, kunya }, i) => (
              <Line key={i} label={label} palette={palette}>
                {/* A kunya reads as a name (nominative); the book's own words are in the sources below. */}
                {kunya ? <Quote fact={fact} palette={palette}><Text style={body(palette)}>{kunyaName(fact.text)}</Text></Quote>
                  : <Quote fact={fact} palette={palette} />}
              </Line>
            ))}
            <Credit facts={names.map(name => name.fact)} palette={palette} quotes />
          </Part>
        )}

        {person.appearance.length > 0 && (
          <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'صفتها' : 'صفته'} palette={palette}>
            {person.appearance.map((fact, i) => <Quote key={i} fact={fact} palette={palette} />)}
            <Credit facts={person.appearance} palette={palette} />
          </Part>
        )}

        {person.virtues.length > 0 && (
          <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'مناقبها' : 'مناقبه'} palette={palette}>
            <Virtues person={person} palette={palette} />
          </Part>
        )}

        {(life.length > 0 || lifeItems.length > 0) && (
          <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'حياتها' : 'حياته'} palette={palette} source={lifeSources(lifeItems)}
            row={lifeItems.length > 0 && <IconButton Icon={ArrowLeftRight} label={f ? 'قارن حياتها بغيرها' : 'قارن حياته بغيره'} onPress={() => router.push({ pathname: '/life', params: { slugs: person.slug } })} />}>
            {lifeItems.length > 0 && <LifeTimeline items={lifeItems} palette={palette} inCard />}
            {life.length > 0 ? <>
            {person.islamAge.map((fact, i) => (
              <Line key={`i${i}`} label={f ? 'أسلمت وعمرها' : 'أسلم وعمره'} palette={palette}>
                <Quote fact={fact} palette={palette} many={person.islamAge.length > 1}><Text style={body(palette)}>{ageOf(fact)}</Text></Quote>
              </Line>
            ))}
            {battles.length > 0 && <Line label={f ? 'شهدت' : 'شهد'} palette={palette}><Names links={battles} palette={palette} onShow={showBattle} /></Line>}
            {person.absentFrom.length > 0 && <Line label={f ? 'غابت عن' : 'غاب عن'} palette={palette}><Names links={uniq(person.absentFrom)} palette={palette} onShow={showBattle} /></Line>}
            {person.died.year.map((fact, i) => (
              <Line key={`y${i}`} label={f ? 'وفاتها' : 'وفاته'} palette={palette}>
                <Quote fact={fact} palette={palette} many={person.died.year.length > 1}><Text style={body(palette)}>{yearOf(fact)}</Text></Quote>
              </Line>
            ))}
            {person.died.month.map((fact, i) => (
              <Line key={`m${i}`} label={f ? 'شهر وفاتها' : 'شهر وفاته'} palette={palette}><Quote fact={fact} palette={palette} many={person.died.month.length > 1}><Text style={body(palette)}>{unvowelled(fact.text)}</Text></Quote></Line>
            ))}
            {person.died.age.map((fact, i) => (
              <Line key={`a${i}`} label={f ? 'عمرها' : 'عمره'} palette={palette}><Quote fact={fact} palette={palette} many={person.died.age.length > 1}><Text style={body(palette)}>{ageOf(fact)}</Text></Quote></Line>
            ))}
            <Credit facts={life} palette={palette} quotes />
            </> : null}
          </Part>
        )}

        {tieList.length > 0 && (
          <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'صلاتها' : 'صلاته'} palette={palette}
            above={<Tabs palette={palette} label="كيف تُعرض الصلات" value={tiesView} onChange={setTiesView} options={DRAWING_OR_TEXT} />}
            row={<>
              <IconButton Icon={Waypoints} label={person.sex === 'FEMALE' ? 'تنقّل في صلاتها' : 'تنقّل في صلاته'} onPress={() => router.push({ pathname: '/ties', params: { slug: person.slug } })} />
              <IconButton Icon={Link2} label={person.sex === 'FEMALE' ? 'بينها وبين…' : 'بينه وبين…'} onPress={() => router.push({ pathname: '/between', params: { slugs: person.slug } })} />
            </>}>
            {tiesView === 'drawing'
              ? <TiesRing slug={person.slug} width={Math.min(width - RING_ROOM, 480)} palette={palette} onPick={openPerson} onShow={setTie} />
              : tieList.map(tie => <Line key={tie.label} label={tie.label} palette={palette}><Names links={tie.links} palette={palette} onShow={showLink} /></Line>)}
            <Credit facts={tieList.flatMap(tie => tie.links)} palette={palette} quotes />
          </Part>
        )}

        {person.ayat.length > 0 && (
          <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'آيات فيها' : 'آيات فيه'} palette={palette}>
            {person.ayat.map((fact, i) => (
              <View key={i} style={{ gap: 2 }}>
                <Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>
                  {typeof fact.value === 'string' ? ayahOf(fact.value) : ''}{fact.kind === 'REVEALED_ABOUT' ? (person.sex === 'FEMALE' ? ' · نزلت فيها' : ' · نزلت فيه') : ''}
                </Text>
                <Quote fact={fact} palette={palette} />
              </View>
            ))}
            <Credit facts={person.ayat} palette={palette} />
          </Part>
        )}

        <Part head={head} n={++n} title={person.sex === 'FEMALE' ? 'ترجمتها في الكتاب' : 'ترجمته في الكتاب'} palette={palette}
          source={[{ book: book, author: 'الذهبي', url: siyar.link.url, ...(siyar.edition && { edition: siyar.edition }) }]}>
          {/* An entry that runs into the next volume (the Sira) names both: «السيرة النبوية ١/٢٩ – ٢/٤٩٥». */}
          <Text style={body(palette)}>{person.entry.toVolume !== undefined && part !== undefined
            ? `${book} ${num(part)}/${num(Number(person.entry.from))} – ${num(volumeLabel(person.entry.toVolume).part ?? person.entry.toVolume)}/${num(Number(person.entry.to))}`
            : `${book}${part !== undefined ? ` ${num(part)}` : ''}${person.entry.from ? `، ص ${num(Number(person.entry.from))}${person.entry.to && person.entry.to !== person.entry.from ? `–${num(Number(person.entry.to))}` : ''}` : ''}`}</Text>
        </Part>
      </ScrollView>
      <TieSheet tie={tie} onClose={() => setTie(undefined)} palette={palette} />
    </View>
  );
}

/** A battle named in two places is one name in the line. */
function uniq(links: PersonLink[]) {
  return links.filter((link, i) => links.findIndex(other => other.slug === link.slug) === i);
}
