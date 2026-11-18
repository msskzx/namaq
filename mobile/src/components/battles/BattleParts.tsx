import { View } from 'react-native';
import type { AppBattle, AppCite, AppMoment, AppPersonLink } from '@shared/battles/battle';
import { num } from '@shared/quran/arabicNumber';
import { Text } from '@/ui/Text';
import Chip from '@/ui/Chip';
import ExternalLink from '@/ui/ExternalLink';
import Reference from '@/ui/Reference';
import SplitBar from '@/ui/SplitBar';
import Step from '@/ui/Step';
import type { Palette } from '@/lib/theme';

/** «غزوة · السنة ٢ للهجرة» */
export const battleLine = (battle: Pick<AppBattle, 'kind' | 'year'>) =>
  [battle.kind?.value, battle.year && `السنة ${num(battle.year.value)} للهجرة`].filter(Boolean).join(' · ');

/** A section's folded reference; nothing while the evidence is owed. */
export function Refs({ refs, palette }: { refs: AppCite[]; palette: Palette }) {
  if (!refs.length) return null;
  return <Reference title={refs[0].cite} quotes={refs} palette={palette} />;
}

/** How many on each side: the Muslims' bar in the accent, the other side's in the rule colour, both to one scale. */
export function Counts({ battle, palette }: { battle: AppBattle; palette: Palette }) {
  const { muslims, others, muslimsKilled, othersKilled } = battle.counts;
  const rows = [
    { label: 'في الميدان', ours: muslims, theirs: others },
    { label: 'القتلى', ours: muslimsKilled, theirs: othersKilled },
  ].filter(row => row.ours || row.theirs);
  if (!rows.length) return null;
  const side = (value: number | undefined) => <Text style={{ color: palette.ink, fontSize: 18, width: 44, textAlign: 'center' }}>{value === undefined ? '—' : num(value)}</Text>;
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: palette.muted, fontSize: 14 }}>المسلمون</Text>
        <Text style={{ color: palette.muted, fontSize: 14 }}>{battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون'}</Text>
      </View>
      {rows.map(({ label, ours, theirs }) => {
        return (
          <View key={label} style={{ gap: 2 }} accessibilityLabel={`${label}: المسلمون ${ours ? num(ours.value) : 'غير مذكور'}، ${theirs ? num(theirs.value) : 'غير مذكور'}`}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {side(ours?.value)}
              <SplitBar first={ours?.value} second={theirs?.value} palette={palette} />
              {side(theirs?.value)}
            </View>
            <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'center' }}>{label}</Text>
          </View>
        );
      })}
      <Refs refs={[muslims, others, muslimsKilled, othersKilled].flatMap(value => value?.refs ?? [])} palette={palette} />
    </View>
  );
}

export function People({ people, palette }: { people: AppPersonLink[]; palette: Palette }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {people.map(person => <Chip key={person.slug} label={person.name} on={false} role="text" small palette={palette} />)}
    </View>
  );
}

/** A numbered moment: our few words naming it, the source's words, where the source says the report is found, and its page. */
export function Moment({ moment, n, palette }: { moment: AppMoment; n: number; palette: Palette }) {
  return (
    <Step n={n} palette={palette}>
      <Text style={{ color: palette.ink, fontSize: 18, fontWeight: '700', textAlign: 'right' }}>{moment.title}</Text>
      <Text style={{ color: palette.ink, fontSize: 18, lineHeight: 34, textAlign: 'right' }}>«{moment.quote}»</Text>
      <Text style={{ color: palette.muted, fontSize: 13, textAlign: 'right' }}>
        {moment.grading} · <ExternalLink url={moment.url} color={palette.muted} size={13}>{moment.cite}</ExternalLink>
      </Text>
      {moment.people.length ? <People people={moment.people} palette={palette} /> : null}
    </Step>
  );
}
