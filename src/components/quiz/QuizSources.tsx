import Reference from '@/components/common/Reference';
import { referenceGroups, type QuizSource } from '@shared/quiz/sources';

/**
 * Where a quiz answer comes from, under it once answered (owner, 2026-11-19): one collapsed line for each book, a tap
 * opening the places and words cited (shared/quiz/sources.ts). The phone app has the same in mobile/src/components/QuizSources.tsx.
 */
export default function QuizSources({ sources }: { sources?: QuizSource[] }) {
  if (!sources?.length) return null;
  return (
    <div dir="rtl" lang="ar" className="flex flex-col gap-2">
      {referenceGroups(sources).map(group => <Reference key={group.title} title={group.title} quotes={group.lines} />)}
    </div>
  );
}
