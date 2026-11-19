import type { AppCite } from '@shared/battles/battle';
import { rangeName, type AppReport, type AppStory } from '@shared/stories/story';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Folded from '@/components/common/Folded';
import ExternalLink from '@/components/common/ExternalLink';
import Reference from '@/components/common/Reference';
import type { AyatPage } from '@/lib/storyAyat';
import StoryAyatLines from './StoryAyatLines';

/** A section's folded reference; nothing while the evidence is owed (the app's Refs). */
export function Refs({ refs }: { refs: AppCite[] }) {
  return refs.length ? <Reference title={refs[0].cite} quotes={refs} /> : null;
}

/**
 * One report whole, as the book prints it (owner, 2026-11-18/19; the app's StoryParts Report): its chain, a paragraph per
 * moment with no titles or numbers, then the book's words on who has it and the page.
 */
export function Report({ report, plain = false, titled = false }: { report: AppReport;
  /** Each moment with our few words naming it above it, small (the quiz's look-up: «ما الذي جاء بعد …؟» asks by them). */
  titled?: boolean;
  /** In a feed card the source is plain text, and its link is a button under the card (the app's `plain`). */
  plain?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {report.isnad && <p className="text-sm leading-7 text-[var(--home-muted)]">{report.isnad}</p>}
      {report.moments.map(moment => <div key={moment.title}>
        {titled && <p className="text-sm font-bold text-[var(--home-accent)]">{moment.title}</p>}
        <p className="text-lg leading-9">{moment.text}</p>
      </div>)}
      <p className="text-sm text-[var(--home-muted)]">
        {report.grading ? `${report.grading} · ` : ''}
        {plain ? report.cite : <ExternalLink href={report.url} className="text-[var(--home-muted)]">{report.cite}</ExternalLink>}
      </p>
    </div>
  );
}

/**
 * A sira story whole (the app's StoryView, mobile/src/screens/story.tsx): its name, its tags as muted words, who is in it,
 * the first report, the ayat it turns on shown in the mushaf's lines, and the source's other reports folded.
 */
export default function StoryView({ story, ayat, titled = false }: { story: AppStory; ayat: AyatPage[][]; titled?: boolean }) {
  const [main, ...rest] = story.reports;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl">{story.name}</h1>
        {story.place && <p className="text-[var(--home-muted)]">{story.place.value}</p>}
        {story.place && <Refs refs={story.place.refs} />}
        {story.tags.length > 0 && <p className="text-sm text-[var(--home-muted)]">{story.tags.join(' · ')}</p>}
        <div className="flex flex-wrap gap-1.5">
          {story.people.map(person => <Chip key={person.slug} label={person.name} small />)}
        </div>
      </div>
      {main && <Card className="p-4"><Report report={main} titled={titled} /></Card>}
      {story.ayat.map((item, i) => (
        <div key={item.from} className="flex flex-col gap-1.5">
          <StoryAyatLines credit={`${item.label}: ${rangeName(item.from, item.to)}`} pages={ayat[i] ?? []} />
          <Refs refs={item.refs} />
          {item.others?.map(other => (
            <div key={other.text} className="flex flex-col gap-0.5">
              <p className="leading-7 text-[var(--home-muted)]">{other.text}</p>
              <Refs refs={other.refs} />
            </div>
          ))}
        </div>
      ))}
      {rest.length > 0 && (
        <Folded credit={rest.length === 1 ? 'رواية أخرى في الكتاب' : 'روايات أخرى في الكتاب'} bare>
          {rest.map(report => <Card key={report.url + (report.isnad ?? '')} className="p-4"><Report report={report} titled={titled} /></Card>)}
        </Folded>
      )}
    </div>
  );
}
