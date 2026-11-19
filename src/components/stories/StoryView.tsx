import type { AppCite } from '@shared/battles/battle';
import { rangeName, type AppReport, type AppStory } from '@shared/stories/story';
import Card from '@/components/common/Card';
import Chip from '@/components/common/Chip';
import Folded from '@/components/common/Folded';
import ExternalLink from '@/components/common/ExternalLink';
import Reference from '@/components/common/Reference';
import type { AyatPage } from '@/lib/storyAyat';
import StoryAyatLines from './StoryAyatLines';

function Refs({ refs }: { refs: AppCite[] }) {
  return refs.length ? <Reference title={refs[0].cite} quotes={refs} /> : null;
}

/**
 * One report whole, as the book prints it (owner, 2026-11-18/19; the app's StoryParts Report): its chain, a paragraph per
 * moment with no titles or numbers, then the book's words on who has it and the page.
 */
export function Report({ report }: { report: AppReport }) {
  return (
    <div className="flex flex-col gap-3">
      {report.isnad && <p className="text-sm leading-7 text-[var(--home-muted)]">{report.isnad}</p>}
      {report.moments.map(moment => <p key={moment.title} className="text-lg leading-9">{moment.text}</p>)}
      <p className="text-sm text-[var(--home-muted)]">
        {report.grading ? `${report.grading} · ` : ''}
        <ExternalLink href={report.url} className="text-[var(--home-muted)]">{report.cite}</ExternalLink>
      </p>
    </div>
  );
}

/**
 * A sira story whole (the app's StoryView, mobile/src/screens/story.tsx): its name, its tags as muted words, who is in it,
 * the first report, the ayat it turns on shown in the mushaf's lines, and the source's other reports folded.
 */
export default function StoryView({ story, ayat }: { story: AppStory; ayat: AyatPage[][] }) {
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
      {main && <Card className="p-4"><Report report={main} /></Card>}
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
          {rest.map(report => <Card key={report.url + (report.isnad ?? '')} className="p-4"><Report report={report} /></Card>)}
        </Folded>
      )}
    </div>
  );
}
