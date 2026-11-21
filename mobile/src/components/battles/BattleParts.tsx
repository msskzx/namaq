import { View } from 'react-native';
import type { AppBattle, AppCite, AppCited, AppMoment, AppPersonLink } from '@shared/battles/battle';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import ExternalLink from '@/ui/ExternalLink';
import Reference from '@/ui/Reference';
import SplitBar from '@/ui/SplitBar';
import Step from '@/ui/Step';
import type { Palette } from '@/lib/theme';

export { battleLine } from '@shared/battles/battle';

/** A section's folded reference; nothing while the evidence is owed. */
export function Refs({ refs, palette }: { refs: AppCite[]; palette: Palette }) {
  if (!refs.length) return null;
  return <Reference title={refs[0].cite} quotes={refs} palette={palette} />;
}

/** The other readings of the values shown, each as the source words it and with its own reference (owner, 2026-11-18). */
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

/** The two sides' names over the bars: the Muslims on the right, the other side by the battle's kind. */
export function SidesHead({ battle, palette }: { battle: Pick<AppBattle, 'kind'>; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: palette.muted, fontSize: 14 }}>المسلمون</Text>
      <Text style={{ color: palette.muted, fontSize: 14 }}>{battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون'}</Text>
    </View>
  );
}

/**
 * One row of numbers: the Muslims' number, the bar of both, the other side's; a dash where the source gives none. The bar
 * is drawn only when both are given, so one side's number never reads as against nothing.
 */
export function CountRow({ label, ours, theirs, palette }: { label: string; ours?: number; theirs?: number; palette: Palette }) {
  const side = (value: number | undefined) => <Text numberOfLines={1} style={{ color: palette.ink, fontSize: 18, minWidth: 44, textAlign: 'center' }}>{value === undefined ? '—' : num(value)}</Text>;
  return (
    <View style={{ gap: 2 }} accessibilityLabel={`${label}: المسلمون ${ours ? num(ours) : 'غير مذكور'}، ${theirs ? num(theirs) : 'غير مذكور'}`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {side(ours)}
        {ours !== undefined && theirs !== undefined ? <SplitBar first={ours} second={theirs} palette={palette} /> : <View style={{ flex: 1 }} />}
        {side(theirs)}
      </View>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{label}</Text>
    </View>
  );
}

/** How many on each side: the Muslims' bar in the accent, the other side's in the rule colour, both to one scale. */
export function Counts({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const { muslims, others, muslimsKilled, othersKilled } = battle.counts;
  const rows = [
    { label: 'في الميدان', ours: muslims, theirs: others },
    { label: 'القتلى', ours: muslimsKilled, theirs: othersKilled },
  ].filter(row => row.ours || row.theirs);
  if (!rows.length) return null;
  return (
    <View style={{ gap: 10 }}>
      <SidesHead battle={battle} palette={palette} />
      {rows.map(({ label, ours, theirs }) => <CountRow key={label} label={label} ours={ours?.value} theirs={theirs?.value} palette={palette} />)}
      <Refs refs={[muslims, others, muslimsKilled, othersKilled].flatMap(value => value?.refs ?? [])} palette={palette} />
      <Readings values={[muslims, others, muslimsKilled, othersKilled]} palette={palette} />
    </View>
  );
}

export function People({ people, palette, tints, more = [] }: { people: AppPersonLink[]; palette: Palette;
  /** A colour by person slug: in a story's drawing each speaker's chip is in his bubbles' colour, the key to them. */
  tints?: Map<string, string>;
  /** Speakers the story names but has no person page for («صاحب السرية»), each in his colour. */
  more?: { name: string; tint: string }[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {people.map(person => {
        const tint = tints?.get(person.slug);
        return <Chip key={person.slug} label={person.name} on={!!tint} lit={!!tint} tint={tint} role="text" small palette={palette} />;
      })}
      {more.map(one => <Chip key={one.name} label={one.name} on lit tint={one.tint} role="text" small palette={palette} />)}
    </View>
  );
}

/** A numbered moment: our few words naming it, the source's words, where the source says the report is found, and its page. */
export function Moment({ moment, n, palette, plain }: { moment: AppMoment; n: number; palette: Palette;
  /** In a feed card the source is in the card's source line under its buttons (owner, 2026-11-20); the grading stays. */
  plain?: boolean }) {
  return (
    <Step n={n} palette={palette}>
      <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text>
      {moment.isnad ? <Text style={{ color: palette.muted, fontSize: 14, lineHeight: 24, textAlign: 'right' }}>{moment.isnad}</Text> : null}
      <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>{moment.quote}</Text>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>
        {moment.grading}{plain ? null : <> · <ExternalLink url={moment.url} color={palette.muted} size={13}>{moment.cite}</ExternalLink></>}
      </Text>
      {moment.people.length ? <People people={moment.people} palette={palette} /> : null}
    </Step>
  );
}
