import { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { Search } from 'lucide-react-native';
import type { QuizLook } from '@shared/quiz/choiceKinds';
import { LOOKED_POINTS, POINTS } from '@shared/quiz/score';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Button from '@/ui/Button';
import Card from '@/ui/Card';
import Chip from '@/ui/Chip';
import Empty from '@/ui/Empty';
import Sheet from '@/ui/Sheet';
import { SearchField } from '@/ui/Field';
import type { Palette } from '@/lib/theme';
import { findPerson, personName, searchPeople } from '@/lib/tarajim';
import terms from '@shared/data/quran/balaghaTerms';
import { plainName, termNamed } from '@shared/quran/balaghaTerms';
import { searchForty } from '@shared/hadith';
import { FORTY, fortyEntry } from '@/lib/hadith';
import { FortyCard } from '@/screens/hadith';
import { FortyHadith } from '@/screens/hadithForty';
import { NasabTree } from '@/screens/nasab';
import { Virtues } from '@/screens/person';
import TiesRing from './TiesRing';
import { TermQuotes } from './BalaghaTerm';

/** Names a search lists before asking for more letters. */
const FOUND = 20;

/** A person's ties round him, any person found by a search or tapped on the ring moving to the middle; the trail goes back. */
function TiesLook({ slug, mark, width, palette }: { slug: string; mark?: string; width: number; palette: Palette }) {
  const [trail, setTrail] = useState([slug]);
  const [query, setQuery] = useState('');
  const at = trail[trail.length - 1];
  const go = (to: string) => { setTrail([...trail, to]); setQuery(''); };
  const found = query.trim() ? searchPeople(query).slice(0, FOUND) : [];
  return (
    <View style={{ gap: 12 }}>
      <SearchField palette={palette} label="ابحث عن شخص" placeholder="ابحث عن شخص" value={query} onChangeText={setQuery} />
      {query.trim()
        ? found.length
          ? <Card palette={palette} pad={[4, 14]}>{found.map(p => <Button key={p.slug} variant="plain" label={personName(p)} onPress={() => go(p.slug)} />)}</Card>
          : <Empty text="لا أحد بهذا الاسم في التراجم المضافة." palette={palette} />
        : <>
          {trail.length > 1 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 4 }}>
              {trail.map((s, i) => (i < trail.length - 1
                ? <Button key={`${s}${i}`} variant="plain" label={`${personName(findPerson(s)!)} ←`} onPress={() => setTrail(trail.slice(0, i + 1))} />
                : <Text key={`${s}${i}`} style={{ color: palette.ink, fontSize: 15 }}>{personName(findPerson(s)!)}</Text>))}
            </View>
          )}
          <TiesRing slug={at} width={width} palette={palette} onPick={go} marked={mark} />
        </>}
    </View>
  );
}

/** The virtues each offered person's entry gives, one person at a time; once shown, the asked one is green. */
function VirtuesLook({ slugs, mark, palette }: { slugs: string[]; mark?: { slug: string; index: number }; palette: Palette }) {
  const people = slugs.map(findPerson).filter(p => !!p);
  const [at, setAt] = useState(mark?.slug ?? people[0]?.slug);
  const person = people.find(p => p.slug === at) ?? people[0];
  if (!person) return null;
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {people.map(p => <Chip key={p.slug} label={personName(p)} on={p.slug === person.slug} palette={palette} onPress={() => setAt(p.slug)} />)}
      </View>
      <Card palette={palette} gap={10}>
        <Text style={{ color: palette.accent, fontSize: 15, textAlign: 'right' }}>{person.sex === 'FEMALE' ? 'مناقبها' : 'مناقبه'}</Text>
        {person.virtues.length
          ? <Virtues person={person} palette={palette} marked={mark?.slug === person.slug ? mark.index : undefined} />
          : <Empty text="لم تُنقل له مناقب بعد." palette={palette} />}
      </Card>
    </View>
  );
}

/** The definition of each term offered, one at a time («مصطلحات البلاغة»'s own card); once shown, the asked one first. */
function TermsLook({ names, mark, palette }: { names: string[]; mark?: string; palette: Palette }) {
  const offered = names.filter(name => termNamed(terms, name));
  const [at, setAt] = useState(mark ?? offered[0]);
  const term = termNamed(terms, at ?? '');
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {offered.map(name => <Chip key={name} label={plainName(name)} on={name === at} palette={palette} onPress={() => setAt(name)} />)}
      </View>
      {term && <TermQuotes term={term} palette={palette} />}
    </View>
  );
}

/** Al-Nawawi's Forty with a search over their words; a hadith opens whole, as on its page. Once shown, the asked one is open. */
function HadithLook({ mark, palette }: { mark?: number; palette: Palette }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(mark);
  const entry = open !== undefined ? fortyEntry(open) : undefined;
  if (entry) return (
    <View style={{ gap: 14 }}>
      <View style={{ alignItems: 'flex-start' }}><Button label="رجوع إلى الأحاديث" onPress={() => setOpen(undefined)} /></View>
      <FortyHadith entry={entry} palette={palette} />
    </View>
  );
  const found = searchForty(FORTY.entries, query);
  return (
    <View style={{ gap: 12 }}>
      <SearchField palette={palette} label="ابحث في الأربعين" placeholder="ابحث بكلمات من الحديث" value={query} onChangeText={setQuery} />
      {found.length
        ? found.map(item => <FortyCard key={item.n} entry={item} palette={palette} onPress={() => setOpen(item.n)} />)
        : <Empty text="لا حديث فيه هذه الكلمات." palette={palette} />}
    </View>
  );
}

/**
 * The feature's own view a question looks its answer up in (owner, 2026-11-19; sketch /mnt/project-files/quiz-lookup): the
 * same drawing as the feature's page and feed card. `shown` once the answer is: then what the look marks is lit.
 */
export function LookView({ look, shown, palette }: { look: QuizLook; shown: boolean; palette: Palette }) {
  const { width } = useWindowDimensions();
  const drawW = Math.min(width - 32, 480);
  switch (look.view) {
    case 'ties': return <TiesLook key={look.slug} slug={look.slug} mark={shown ? look.mark : undefined} width={drawW} palette={palette} />;
    case 'nasab': return <View style={{ gap: 16 }}><NasabTree slugs={look.slugs} palette={palette} meetings={shown && !!look.mark} linked={false} /></View>;
    case 'virtues': return <VirtuesLook slugs={look.slugs} mark={shown ? look.mark : undefined} palette={palette} />;
    case 'terms': return <TermsLook names={look.names} mark={shown ? look.mark : undefined} palette={palette} />;
    case 'hadith': return <HadithLook mark={shown ? look.mark : undefined} palette={palette} />;
  }
}

/**
 * «ابحث عن الجواب» under a question's choices: opens its view in a sheet. `onLook` runs as it opens (a party counts the
 * look then, whether or not the answer is found). `costs` says under the button what a look costs in a party.
 */
export function LookButton({ look, onLook, costs = false, palette }: { look: QuizLook; onLook?: () => void; costs?: boolean; palette: Palette }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 4, alignItems: 'flex-start' }}>
      <Button Icon={Search} label="ابحث عن الجواب" onPress={() => { setOpen(true); onLook?.(); }} />
      {costs && <Text style={{ color: palette.muted, fontSize: 14, textAlign: 'right', alignSelf: 'stretch' }}>
        {`الإجابة الصحيحة بعد البحث بـ${num(LOOKED_POINTS)} نقاط بدل ${num(POINTS)}.`}
      </Text>}
      <Sheet open={open} onClose={() => setOpen(false)} palette={palette} tall>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
          <LookView look={look} shown={false} palette={palette} />
          <View style={{ alignItems: 'flex-start' }}><Button label="رجوع إلى السؤال" onPress={() => setOpen(false)} /></View>
        </ScrollView>
      </Sheet>
    </View>
  );
}

/** What a party player sees after looking: the look costs half the points of a right answer. */
export function LookedNote({ palette }: { palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
      <Search size={15} color={palette.amber} />
      <Text style={{ color: palette.amber, fontSize: 15 }}>{`بحثتَ عنه · الإجابة الصحيحة بـ${num(LOOKED_POINTS)} نقاط`}</Text>
    </View>
  );
}
