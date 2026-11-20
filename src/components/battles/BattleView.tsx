import { num } from '@shared/quran/arabicNumber';
import { battleLine, type AppBattle, type AppCited } from '@shared/battles/battle';
import Chip from '@/components/common/Chip';
import { Refs } from '@/components/stories/StoryView';
import Card from '@/components/common/Card';
import BattleMoments from './BattleMoments';
import BattleMap from './BattleMap';

/** The other readings of the values shown, each as the source words it and with its own reference (the app's Readings). */
function Readings({ values }: { values: readonly (AppCited<unknown> | undefined)[] }) {
  const readings = values.flatMap(value => value?.others ?? []);
  if (!readings.length) return null;
  return <div className="flex flex-col gap-1.5">
    {readings.map(reading => <div key={reading.text} className="flex flex-col gap-0.5"><p className="leading-7 text-[var(--home-muted)]">{reading.text}</p><Refs refs={reading.refs} /></div>)}
  </div>;
}

/** How many on each side, in the field and killed, as the source gives them (the app's Counts, its numbers without the bars). */
/** A count, or a dash read out as «غير مذكور» when the source gives none (the app's label says so). */
const count = (value: AppCited<number> | undefined) => (value ? num(value.value) : <><span aria-hidden>—</span><span className="sr-only">غير مذكور</span></>);

export function Counts({ battle, Heading }: { battle: AppBattle; Heading: 'h2' | 'h3' }) {
  const { muslims, others, muslimsKilled, othersKilled } = battle.counts;
  const rows = [
    { label: 'في الميدان', ours: muslims, theirs: others },
    { label: 'القتلى', ours: muslimsKilled, theirs: othersKilled },
  ].filter(row => row.ours || row.theirs);
  if (!rows.length) return null;
  const them = battle.kind?.value === 'معركة' ? 'العدو' : 'المشركون';
  return <section className="flex flex-col gap-2">
    <Heading className="text-2xl">العدد</Heading>
    {rows.map(({ label, ours, theirs }) => (
      <p key={label} className="text-lg">{label}: المسلمون {count(ours)}، {them} {count(theirs)}</p>
    ))}
    <Refs refs={[muslims, others, muslimsKilled, othersKilled].flatMap(value => value?.refs ?? [])} />
    <Readings values={[muslims, others, muslimsKilled, othersKilled]} />
  </section>;
}

function People({ title, people, Heading }: { title: string; people: AppBattle['present']; Heading: 'h2' | 'h3' }) {
  if (!people.length) return null;
  return <section className="flex flex-col gap-2">
    <Heading className="text-2xl">{title}</Heading>
    <div className="flex flex-wrap gap-1.5">{people.map(person => <Chip key={person.slug} label={person.name} small />)}</div>
  </section>;
}

/**
 * A battle whole, as the app's BattleView (mobile/src/screens/battle.tsx) draws it from the same data: its name, kind, year
 * and place with their readings, the still map, the numbers, the moments and the people. The battle page draws it, and so
 * does the sira quiz's look-up (`inset`: inside the quiz, its name a second-level heading).
 */
export default function BattleView({ battle, inset = false }: { battle: AppBattle; inset?: boolean }) {
  const Name = inset ? 'h2' : 'h1';
  const Heading = inset ? 'h3' : 'h2';
  return <div dir="rtl" lang="ar" className="flex flex-col gap-4 text-[var(--home-ink)]">
    <div className="flex flex-col gap-1">
      <Name className="text-3xl">{battle.name}</Name>
      <p className="text-[var(--home-muted)]">{battleLine(battle)}</p>
      <Refs refs={[battle.kind, battle.year, battle.location].flatMap(value => value?.refs ?? [])} />
      <Readings values={[battle.kind, battle.year, battle.location]} />
    </div>
    {battle.place ? (
      <Card className="overflow-hidden">
        <BattleMap place={battle.place} />
        <p className="p-2.5 text-sm text-[var(--home-muted)]">موضع تقريبي على خريطة اليوم، من عندنا.</p>
      </Card>
    ) : battle.location && <p className="text-lg">{battle.location.value}</p>}
    <Counts battle={battle} Heading={Heading} />
    {battle.moments.length > 0 && <BattleMoments moments={battle.moments} kind={battle.kind?.value} inset={inset} />}
    <People title="من استشهد يومئذ" people={battle.martyrs} Heading={Heading} />
    <People title="ممن شهدها" people={battle.present} Heading={Heading} />
  </div>;
}
