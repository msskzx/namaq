import { PROPHET_AGENT, PROPHET_LABEL } from '@shared/hadith';
import { View } from 'react-native';
import { router } from 'expo-router';
import { findPerson } from '@/lib/tarajim';
import { UNIT_WORDS, unitFor, type AppBattle, type AppCite, type AppCited, type AppMoment, type AppPersonLink } from '@shared/battles/battle';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import { LeadLink } from '@/ui/ExternalLink';
import Reference from '@/ui/Reference';
import SplitBar from '@/ui/SplitBar';
import Step from '@/ui/Step';
import UnitDots from '@/ui/UnitDots';
import type { Palette } from '@/lib/theme';

export { battleLine } from '@shared/battles/battle';

export function Refs({ refs, palette }: { refs: AppCite[]; palette: Palette }) {
  if (!refs.length) return null;
  return <Reference title={refs[0].cite} quotes={refs} palette={palette} />;
}

export function Readings({ values, palette }: { values: readonly (AppCited<unknown> | undefined)[]; palette: Palette }) {
  const readings = values.flatMap(value => value?.others ?? []);
  if (!readings.length) return null;
  return (
    <View style={{ gap: 6 }}>
      {readings.map(reading => (
        <View key={reading.text} style={{ gap: 2 }}>
          <Text style={{ color: palette.muted, fontSize: 15, lineHeight: 26, textAlign: 'right' }}>{reading.text}</Text>
          <Refs refs={reading.refs} palette={palette} />
        </View>
      ))}
    </View>
  );
}

export function SidesHead({ battle, palette }: { battle: Pick<AppBattle, 'kind'>; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>المسلمون</Text>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون'}</Text>
    </View>
  );
}

export function CountRow({ label, ours, theirs, palette }: { label: string; ours?: number; theirs?: number; palette: Palette }) {
  const side = (value: number | undefined) => <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 18, minWidth: 44, textAlign: 'center' }}>{value === undefined ? '—' : num(value)}</Text>;
  return (
    <View style={{ gap: 2 }} accessibilityLabel={`${label}: المسلمون ${ours !== undefined ? num(ours) : 'غير مذكور'}، ${theirs !== undefined ? num(theirs) : 'غير مذكور'}`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {side(ours)}
        {ours !== undefined && theirs !== undefined ? <SplitBar first={ours} second={theirs} palette={palette} /> : <View style={{ flex: 1 }} />}
        {side(theirs)}
      </View>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

function Side({ name, value, unit, color, palette }: { name: string; value?: number; unit: number; color: string; palette: Palette }) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={{ color: value === undefined ? palette.muted : color, fontSize: 26 }}>{value === undefined ? '—' : num(value)}</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{name}</Text>
      </View>
      {value === undefined
        ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>لم يذكره المصدر</Text>
        : value > 0 ? <UnitDots count={Math.max(1, Math.round(value / unit))} color={color} /> : null}
    </View>
  );
}

export function Counts({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const { muslims, others, muslimsKilled, othersKilled } = battle.counts;
  const them = battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون';
  const rows = [
    { label: 'في الميدان', ours: muslims?.value, theirs: others?.value, names: ['المسلمون', them] },
    { label: 'القتلى', ours: muslimsKilled?.value, theirs: othersKilled?.value, names: ['استشهد', 'قُتل'] },
  ].filter(row => row.ours !== undefined || row.theirs !== undefined);
  if (!rows.length) return null;
  return (
    <View style={{ gap: 14 }}>
      {rows.map(({ label, ours, theirs, names }) => {
        const unit = unitFor(Math.max(ours ?? 0, theirs ?? 0));
        return (
          <View key={label} style={{ gap: 6 }} accessibilityLabel={`${label}: المسلمون ${ours !== undefined ? num(ours) : 'غير مذكور'}، ${theirs !== undefined ? num(theirs) : 'غير مذكور'}`}>
            <View style={{ flexDirection: 'row', gap: 14 }}>
              <Side name={names[0]} value={ours} unit={unit} color={palette.accent} palette={palette} />
              <View style={{ width: 1, backgroundColor: palette.rule, opacity: 0.4 }} />
              <Side name={names[1]} value={theirs} unit={unit} color={palette.rule} palette={palette} />
            </View>
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{`${label} · كل نقطة ${UNIT_WORDS[unit]}`}</Text>
          </View>
        );
      })}
      <Refs refs={[muslims, others, muslimsKilled, othersKilled].flatMap(value => value?.refs ?? [])} palette={palette} />
      <Readings values={[muslims, others, muslimsKilled, othersKilled]} palette={palette} />
    </View>
  );
}

export function People({ people, palette, tints, more = [] }: { people: AppPersonLink[]; palette: Palette;
  tints?: Map<string, string>;
  more?: { name: string; tint: string }[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {people.map(person => {
        const tint = tints?.get(person.slug);
        const page = !!findPerson(person.slug);
        return <Chip key={person.slug} label={person.slug === PROPHET_AGENT ? PROPHET_LABEL : person.name} on={!!tint} lit={!!tint} tint={tint} small palette={palette}
          role={page ? 'button' : 'text'} onPress={page ? () => router.push({ pathname: '/person', params: { slug: person.slug } }) : undefined} />;
      })}
      {more.map(one => <Chip key={one.name} label={one.name} on lit tint={one.tint} role="text" small palette={palette} />)}
    </View>
  );
}

export function Moment({ moment, n, palette, plain }: { moment: AppMoment; n: number; palette: Palette;
  plain?: boolean }) {
  return (
    <Step n={n} palette={palette}>
      <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text>
      {moment.isnad ? <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{moment.isnad}</Text> : null}
      <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.quote}</Text>
      {plain ? <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>{moment.grading}</Text>
        : <LeadLink lead={`${moment.grading} ·`} url={moment.url} color={palette.muted}>{moment.cite}</LeadLink>}
      {moment.people.length ? <People people={moment.people} palette={palette} /> : null}
    </Step>
  );
}
