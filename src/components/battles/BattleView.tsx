import { num } from '@shared/quran/arabicNumber';
import { battleLine, type AppBattle, type AppCited } from '@shared/battles/battle';
import Chip from '@/components/common/Chip';
import { Refs } from '@/components/stories/StoryView';
import BattleMoments from './BattleMoments';

/** The other readings of the values shown, each as the source words it and with its own reference (the app's Readings). */
function Readings({ values }: { values: readonly (AppCited<unknown> | undefined)[] }) {
  const readings = values.flatMap(value => value?.others ?? []);
  if (!readings.length) return null;
  return <div className="flex flex-col gap-1.5">
    {readings.map(reading => <div key={reading.text} className="flex flex-col gap-0.5"><p className="leading-7 text-[var(--home-muted)]">{reading.text}</p><Refs refs={reading.refs} /></div>)}
  </div>;
}

/** How many on each side, in the field and killed, as the source gives them (the app's Counts, its numbers without the bars). */
function Counts({ battle }: { battle: AppBattle }) {
  const { muslims, others, muslimsKilled, othersKilled } = battle.counts;
  const rows = [
    { label: 'في الميدان', ours: muslims, theirs: others },
    { label: 'القتلى', ours: muslimsKilled, theirs: othersKilled },
  ].filter(row => row.ours || row.theirs);
  if (!rows.length) return null;
  const them = battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون';
  return <section className="flex flex-col gap-2">
    <h2 className="text-2xl">العدد</h2>
    {rows.map(({ label, ours, theirs }) => (
      <p key={label} className="text-lg">{label}: المسلمون {ours ? num(ours.value) : '—'}، {them} {theirs ? num(theirs.value) : '—'}</p>
    ))}
    <Refs refs={[muslims, others, muslimsKilled, othersKilled].flatMap(value => value?.refs ?? [])} />
    <Readings values={[muslims, others, muslimsKilled, othersKilled]} />
  </section>;
}

function People({ title, people }: { title: string; people: AppBattle['present'] }) {
  if (!people.length) return null;
  return <section className="flex flex-col gap-2">
    <h2 className="text-2xl">{title}</h2>
    <div className="flex flex-wrap gap-1.5">{people.map(person => <Chip key={person.slug} label={person.name} small />)}</div>
  </section>;
}

/**
 * A battle whole, as the app's BattleView (mobile/src/screens/battle.tsx) draws it from the same data: its name, kind, year
 * and place with their readings, the numbers, the moments and the people. The sira quiz's look-up draws it.
 */
export default function BattleView({ battle }: { battle: AppBattle }) {
  return <div dir="rtl" lang="ar" className="flex flex-col gap-4 text-[var(--home-ink)]">
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl">{battle.name}</h1>
      <p className="text-[var(--home-muted)]">{battleLine(battle)}</p>
      <Refs refs={[battle.kind, battle.year, battle.location].flatMap(value => value?.refs ?? [])} />
      <Readings values={[battle.kind, battle.year, battle.location]} />
    </div>
    {battle.location && <p className="text-lg">{battle.location.value}</p>}
    <Counts battle={battle} />
    <BattleMoments moments={battle.moments} kind={battle.kind?.value} />
    <People title="من استشهد يومئذ" people={battle.martyrs} />
    <People title="ممن شهدها" people={battle.present} />
  </div>;
}
