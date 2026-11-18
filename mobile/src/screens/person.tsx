import { ScrollView, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Network } from 'lucide-react-native';
import { pageLabel, sayer, volumeLabel, type AppPerson, type PersonFact, type PersonLink } from '@shared/tarajim';
import { surahName } from '@shared/quran/surahNames';
import { num } from '@shared/quran/arabicNumber';
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
function Credit({ facts, palette, quotes = false }: { facts: PersonFact[]; palette: Palette; quotes?: boolean }) {
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

/** Who says it, under a quote: the author's own words carry no line; a narrator's or the Prophet's ﷺ do. */
function Sayer({ fact, palette }: { fact: PersonFact; palette: Palette }) {
  return fact.by.length ? <Text style={muted(palette)}>{sayer(fact)}</Text> : null;
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
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 6, borderBottomWidth: 1, borderColor: palette.rule }}>
      <View style={{ flex: 1 }}>{children}</View>
      <Text style={{ color: palette.muted, fontSize: 13, paddingTop: 4 }}>{label}</Text>
    </View>
  );
}

/** Names in a line: each one with a page in the app opens it. */
function Names({ links, palette }: { links: PersonLink[]; palette: Palette }) {
  return (
    <Text style={body(palette)}>
      {links.map((link, i) => (
        <Text key={link.slug}>
          {i > 0 ? ' · ' : ''}
          {link.inApp
            ? <Text accessibilityRole="link" onPress={() => openPerson(link.slug)} style={{ color: palette.accent }}>{personName(link)}</Text>
            : personName(link)}
        </Text>
      ))}
    </Text>
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
    { label: 'صحب', links: person.companionOf },
  ].filter(tie => tie.links.length > 0);
}

/** «سنة ٣٦هـ», «جمادى الآخرة», «٨٨ سنة»: the number the reader confirmed, else the words as printed. */
const yearOf = (fact: PersonFact) => (typeof fact.value === 'number' ? `سنة ${num(fact.value)}هـ` : unvowelled(fact.text));
const ageOf = (fact: PersonFact) => (typeof fact.value === 'number' ? `${num(fact.value)} سنة` : unvowelled(fact.text));
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
  const names = [...person.kunya.map(fact => ({ label: 'كنيته', fact })), ...person.laqab.map(fact => ({ label: 'لقبه', fact }))];
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
          {person.kunya[0] && <Text style={{ color: palette.muted, fontSize: 16, textAlign: 'right' }}>{unvowelled(person.kunya[0].text)}</Text>}
          {person.titles.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {person.titles.map(title => (
                <Chip key={title.title} label={title.name} on={false} small palette={palette}
                  onPress={() => router.navigate({ pathname: '/tarajim', params: { title: title.title } })} />
              ))}
            </View>
          )}
        </View>

        {person.fullName && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'نسبها' : 'نسبه'} palette={palette}>
            <Text style={body(palette)}>{person.fullName.text}</Text>
            <Row><Button label="الشجرة" onPress={tree} /></Row>
            <Credit facts={[person.fullName]} palette={palette} />
          </Part>
        )}

        {names.length > 0 && (
          <Part n={++n} title="كنيته ولقبه" palette={palette}>
            {names.map(({ label, fact }, i) => (
              <Line key={i} label={label} palette={palette}><Quote fact={fact} palette={palette} /></Line>
            ))}
            <Credit facts={names.map(name => name.fact)} palette={palette} />
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
              <Line key={`i${i}`} label="أسلم وعمره" palette={palette}>
                <Text style={body(palette)}>{ageOf(fact)}</Text><Sayer fact={fact} palette={palette} />
              </Line>
            ))}
            {person.battles.length > 0 && <Line label="شهد" palette={palette}><Names links={uniq(person.battles)} palette={palette} /></Line>}
            {person.absentFrom.length > 0 && <Line label="غاب عن" palette={palette}><Names links={uniq(person.absentFrom)} palette={palette} /></Line>}
            {person.died.year.map((fact, i) => (
              <Line key={`y${i}`} label="وفاته" palette={palette}>
                <Text style={body(palette)}>{yearOf(fact)}</Text><Sayer fact={fact} palette={palette} />
              </Line>
            ))}
            {person.died.month.map((fact, i) => (
              <Line key={`m${i}`} label="شهر وفاته" palette={palette}><Text style={body(palette)}>{unvowelled(fact.text)}</Text><Sayer fact={fact} palette={palette} /></Line>
            ))}
            {person.died.age.map((fact, i) => (
              <Line key={`a${i}`} label="عمره" palette={palette}><Text style={body(palette)}>{ageOf(fact)}</Text><Sayer fact={fact} palette={palette} /></Line>
            ))}
            <Credit facts={life} palette={palette} quotes />
          </Part>
        )}

        {tieList.length > 0 && (
          <Part n={++n} title={person.sex === 'FEMALE' ? 'صلاتها' : 'صلاته'} palette={palette}>
            {tieList.map(tie => <Line key={tie.label} label={tie.label} palette={palette}><Names links={tie.links} palette={palette} /></Line>)}
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
          <Text style={body(palette)}>{book}{part !== undefined ? ` ${num(part)}` : ''}، ص {num(Number(person.entry.from))}–{num(Number(person.entry.to))}</Text>
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
