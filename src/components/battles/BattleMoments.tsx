import { courseTitle, type AppMoment } from '@shared/battles/battle';
import Chip from '@/components/common/Chip';
import ExternalLink from '@/components/common/ExternalLink';

/** A numbered moment: our few words naming it, the source's words, where the source says the report is found, its page, and who is in it. */
export function Moment({ moment, n, plain = false }: { moment: AppMoment; n: number;
  /** In a feed card the source is plain text, and its link is a button under the card (the app's `plain`). */
  plain?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-lg font-bold"><span className="text-[var(--home-accent)]">{n}. </span>{moment.title}</h3>
      {moment.isnad && <p className="text-sm leading-7 text-[var(--home-muted)]">{moment.isnad}</p>}
      <p className="text-lg leading-9">{moment.quote}</p>
      <p className="text-sm text-[var(--home-muted)]">{moment.grading} · {plain ? moment.cite : <ExternalLink href={moment.url} className="text-[var(--home-muted)]">{moment.cite}</ExternalLink>}</p>
      {moment.people.length > 0 && <div className="flex flex-wrap gap-1.5">{moment.people.map(person => <Chip key={person.slug} label={person.name} small />)}</div>}
    </div>
  );
}

/**
 * A battle's key moments, as the app's battle page draws them (mobile/src/components/battles/BattleParts.tsx Moment): each
 * a report of its own, so each keeps our few words naming it, then the source's words, where it is found and its page, and
 * who is in it. Only reports the source places in al-Bukhari or Muslim (AGENTS.md, "Established claims only").
 */
export default function BattleMoments({ moments, kind }: { moments: readonly AppMoment[]; kind?: string }) {
  if (!moments.length) return null;
  return (
    <section dir="rtl" className="flex flex-col gap-5 text-[var(--home-ink)]">
      <h2 className="text-2xl">{courseTitle(kind)}</h2>
      {moments.map((moment, i) => <Moment key={moment.title} moment={moment} n={i + 1} />)}
    </section>
  );
}
