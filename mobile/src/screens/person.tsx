import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Network } from 'lucide-react-native';
import { kunyaName, pageLabel, sayer, volumeLabel, type AppPerson, type PersonFact, type PersonLink } from '@shared/tarajim';
import { surahName } from '@shared/quran/surahNames';
import { counted, num } from '@shared/quran/arabicNumber';
import { sourceById } from '@shared/sources';
import { Text } from '@/ui/Text';
import TopBar from '@/ui/TopBar';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Button, { Row } from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import Folded from '@/ui/Folded';
import ExternalLink from '@/ui/ExternalLink';
import { usePalette, type Palette } from '@/lib/theme';
import { useShrinkOnScroll } from '@/lib/chrome';
import { useTabBarSpace } from '@/ui/tabBarSpace';
import { toTab } from '@/lib/ways';
import { findPerson, personName, unvowelled } from '@/lib/tarajim';

const siyar = sourceById('siyar')!;
const SIYAR = { title: siyar.title.ar, edition: siyar.edition ?? '', url: siyar.link.url };
const body = (palette: Palette) => ({ color: palette.ink, fontSize: 17, lineHeight: 30, textAlign: 'right' as const });
const muted = (palette: Palette) => ({ color: palette.muted, fontSize: 14, textAlign: 'right' as const });
const openPerson = (slug: string) => router.push({ pathname: '/person', params: { slug } });

/** A section: its name in the accent, numbered as on the sketch («١ · نسبه»), then its card. */
function Part({ n, title, palette, children }: { n: number; title: string; palette: Palette; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text accessibilityRole="header" style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>{num(n)} · {title}</Text>
      <Card palette={palette} gap={10}>{children}</Card>
    </View>
  );
}

/** The pages a card rests on, folded at its foot; open, the edition and its page on al-Shamela, then each tie's own words. */
export function Credit({ facts, palette, quotes = false }: { facts: PersonFact[]; palette: Palette; quotes?: boolean }) {
  const refs = facts.flatMap(fact => fact.refs);
  if (refs.length === 0) return null;
  return (
    <Folded credit={pageLabel(refs)} palette={palette}>
      {quotes && facts.filter(fact => fact.text).map((fact, i) => (
        <Text key={i} style={{ color: palette.ink, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>«{fact.text}» <Text style={muted(palette)}>{pageLabel(fact.refs)}</Text></Text>
      ))}
      <Text style={muted(palette)}>{SIYAR.title}، {SIYAR.edition}</Text>
      <ExternalLink url={SIYAR.url} color={palette.accent} size={14} style={{ textAlign: 'right' }}>الكتاب على المكتبة الشاملة</ExternalLink>
    </Folded>
  );
}

/**
 * Who says it, under a quote: a narrator's or the Prophet's ﷺ words always carry the line; the author's own words carry
 * it only where the book gives more than one value (`many`), so each of them reads as one saying among others.
 */
function Sayer({ fact, palette, many = false }: { fact: PersonFact; palette: Palette; many?: boolean }) {
  if (fact.anonymous) return <Text style={muted(palette)}>قيل</Text>;
  return fact.by.length || many ? <Text style={muted(palette)}>{many ? `عند ${sayer(fact)}` : sayer(fact)}</Text> : null;
}

/** One quote from the entry, with who says it. */
function Quote({ fact, palette }: { fact: PersonFact; palette: Palette }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={body(palette)}>{fact.text}</Text>
      <Sayer fact={fact} palette={palette} />
    </View>
  );
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

/** Names in a line: each one with a page in the app is a button that opens it, the others plain text. */
function Names({ links, palette }: { links: PersonLink[]; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 6 }}>
      {links.map(link => (
        <View key={link.slug} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {link.inApp
            ? <Button variant="plain" label={personName(link)} onPress={() => openPerson(link.slug)} />
            : <Text style={body(palette)}>{personName(link)}</Text>}
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
  const fathers = person.parents.filter(p => p.sex !== 'FEMALE');
  const mothers = person.parents.filter(p => p.sex === 'FEMALE');
  return [
    { label: `أبو${s}`, links: fathers },
    { label: `أم${s}`, links: mothers },
    { label: person.spouses.length > 1 ? `أزواج${s}` : `زوج${s}`, links: person.spouses },
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
  const person = findPerson(slug);
  const back = () => (router.canGoBack() ? router.back() : toTab('/tarajim'));
  if (!person) return <View style={{ flex: 1, backgroundColor: palette.paper }}><TopBar back={back} /></View>;
  const tree = () => router.push({ pathname: '/nasab', params: { slug: person.slug } });
  const names = [...person.kunya.map(fact => ({ label: `كنيت${suffixOf(person)}`, fact, kunya: true })), ...person.laqab.map(fact => ({ label: `لقب${suffixOf(person)}`, fact, kunya: false }))];
  const f = person.sex === 'FEMALE';
  const life = [...person.islamAge, ...person.battles, ...person.absentFrom, ...person.died.year, ...person.died.month, ...person.died.age, ...person.died.place];
  const tieList = ties(person);
  const { book, part } = volumeLabel(person.entry.volume);
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
                  onPress={title.shared ? () => router.navigate({ pathname: '/tarajim', params: { title: title.title, at: String(Date.now()) } }) : undefined} />
              ))}
            </View>
          )}
          <Credit facts={person.titles} palette={palette} quotes />
        </View>

        {person.fullName && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'نسبها' : 'نسبه'} palette={palette}>
            <Text style={body(palette)}>{person.fullName.text}</Text>
            {person.otherNames?.length ? <>
              <Sayer fact={person.fullName} palette={palette} many />
              {person.otherNames.map((fact, i) => (
                <View key={i} style={{ gap: 2 }}>
                  <Text style={body(palette)}>وقيل: {fact.text}</Text>
                  <Sayer fact={fact} palette={palette} many />
                </View>
              ))}
            </> : null}
            {person.nameVariants.map((fact, i) => (
              <View key={`v${i}`} style={{ gap: 2 }}>
                <Text style={body(palette)}>{fact.text}</Text>
                <Sayer fact={fact} palette={palette} many />
              </View>
            ))}
            <Row><Button label="الشجرة" onPress={tree} /></Row>
            <Credit facts={[person.fullName, ...(person.otherNames ?? []), ...person.nameVariants]} palette={palette} />
          </Part>
        )}

        {names.length > 0 && (
          <Part n={++n} title={[person.kunya.length ? 'كنيت' : '', person.laqab.length ? 'لقب' : ''].filter(Boolean).map(w => w + suffixOf(person)).join(' و')} palette={palette}>
            {names.map(({ label, fact, kunya }, i) => (
              <Line key={i} label={label} palette={palette}>
                {/* A kunya reads as a name (nominative); the book's own words are in the sources below. */}
                {kunya ? <View style={{ gap: 2 }}><Text style={body(palette)}>{kunyaName(fact.text)}</Text><Sayer fact={fact} palette={palette} /></View>
                  : <Quote fact={fact} palette={palette} />}
              </Line>
            ))}
            <Credit facts={names.map(name => name.fact)} palette={palette} quotes />
          </Part>
        )}

        {person.appearance.length > 0 && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'صفتها' : 'صفته'} palette={palette}>
            {person.appearance.map((fact, i) => <Quote key={i} fact={fact} palette={palette} />)}
            <Credit facts={person.appearance} palette={palette} />
          </Part>
        )}

        {person.virtues.length > 0 && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'مناقبها' : 'مناقبه'} palette={palette}>
            {person.virtues.map((fact, i) => <Quote key={i} fact={fact} palette={palette} />)}
            <Credit facts={person.virtues} palette={palette} />
          </Part>
        )}

        {life.length > 0 && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'حياتها' : 'حياته'} palette={palette}>
            {person.islamAge.map((fact, i) => (
              <Line key={`i${i}`} label={f ? 'أسلمت وعمرها' : 'أسلم وعمره'} palette={palette}>
                <Text style={body(palette)}>{ageOf(fact)}</Text><Sayer fact={fact} palette={palette} many={person.islamAge.length > 1} />
              </Line>
            ))}
            {person.battles.length > 0 && <Line label={f ? 'شهدت' : 'شهد'} palette={palette}><Names links={uniq(person.battles)} palette={palette} /></Line>}
            {person.absentFrom.length > 0 && <Line label={f ? 'غابت عن' : 'غاب عن'} palette={palette}><Names links={uniq(person.absentFrom)} palette={palette} /></Line>}
            {person.died.year.map((fact, i) => (
              <Line key={`y${i}`} label={f ? 'وفاتها' : 'وفاته'} palette={palette}>
                <Text style={body(palette)}>{yearOf(fact)}</Text><Sayer fact={fact} palette={palette} many={person.died.year.length > 1} />
              </Line>
            ))}
            {person.died.month.map((fact, i) => (
              <Line key={`m${i}`} label={f ? 'شهر وفاتها' : 'شهر وفاته'} palette={palette}><Text style={body(palette)}>{unvowelled(fact.text)}</Text><Sayer fact={fact} palette={palette} many={person.died.month.length > 1} /></Line>
            ))}
            {person.died.age.map((fact, i) => (
              <Line key={`a${i}`} label={f ? 'عمرها' : 'عمره'} palette={palette}><Text style={body(palette)}>{ageOf(fact)}</Text><Sayer fact={fact} palette={palette} many={person.died.age.length > 1} /></Line>
            ))}
            <Credit facts={life} palette={palette} quotes />
          </Part>
        )}

        {tieList.length > 0 && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'صلاتها' : 'صلاته'} palette={palette}>
            {tieList.map(tie => <Line key={tie.label} label={tie.label} palette={palette}><Names links={tie.links} palette={palette} /></Line>)}
            <Row>
              <Button label={person.sex === 'FEMALE' ? 'ارسم صلاتها' : 'ارسم صلاته'} onPress={() => router.push({ pathname: '/ties', params: { slug: person.slug } })} />
              <Button label={person.sex === 'FEMALE' ? 'بينها وبين…' : 'بينه وبين…'} onPress={() => router.push({ pathname: '/between', params: { slugs: person.slug } })} />
            </Row>
            <Credit facts={tieList.flatMap(tie => tie.links)} palette={palette} quotes />
          </Part>
        )}

        {person.ayat.length > 0 && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'آيات فيها' : 'آيات فيه'} palette={palette}>
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

        <Part n={++n} title={person.sex === 'FEMALE' ? 'ترجمتها في الكتاب' : 'ترجمته في الكتاب'} palette={palette}>
          <Text style={body(palette)}>{book}{part !== undefined ? ` ${num(part)}` : ''}{person.entry.from ? `، ص ${num(Number(person.entry.from))}${person.entry.to && person.entry.to !== person.entry.from ? `–${num(Number(person.entry.to))}` : ''}` : ''}</Text>
          <Text style={muted(palette)}>{SIYAR.edition}</Text>
          <ExternalLink url={SIYAR.url} color={palette.accent} size={15} style={{ textAlign: 'right' }}>اقرأها على المكتبة الشاملة</ExternalLink>
        </Part>
      </ScrollView>
    </View>
  );
}

/** A battle named in two places is one name in the line. */
function uniq(links: PersonLink[]) {
  return links.filter((link, i) => links.findIndex(other => other.slug === link.slug) === i);
}
