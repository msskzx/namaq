'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import ForceGraph2D from 'react-force-graph-2d';
import { fetcher } from '@/lib/swr';
import { GraphData, GraphLink, GraphNodeFull } from '@/types/graph';
import { useLanguage } from '@/components/language/LanguageContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

interface BattleParticipantsGraphProps {
  slug: string;
}

// Mirrors the status color convention already used in BattleParticipationCard.
const STATUS_COLOR: Record<string, string> = {
  MARTYRED: '#ef4444',
  DIED: '#ef4444',
  INJURED: '#f97316',
  CAPTURED: '#a855f7',
  WAS_CAPTURED: '#a855f7',
  ABSENT_EXCUSED: '#3b82f6',
};
const STATUS_LABEL: Record<string, { en: string; ar: string }> = {
  MARTYRED: { en: 'Martyred', ar: 'استشهد' },
  DIED: { en: 'Died', ar: 'توفي' },
  INJURED: { en: 'Injured', ar: 'جُرح' },
  CAPTURED: { en: 'Captured', ar: 'أُسر' },
  WAS_CAPTURED: { en: 'Was Captured', ar: 'أُسر' },
  ABSENT_EXCUSED: { en: 'Absent (Excused)', ar: 'غائب بعذر' },
};
const DEFAULT_PERSON_COLOR = '#9ca3af';
const BATTLE_COLOR = '#fbbf24';

function statusesForNode(nodeId: string, links: GraphLink[]): string[] {
  return links
    .filter((link) => (typeof link.target === 'string' ? link.target : link.target.id) === nodeId)
    .flatMap((link) => link.status ?? []);
}

function personColor(nodeId: string, links: GraphLink[]): string {
  const statuses = statusesForNode(nodeId, links);
  const known = statuses.find((status) => STATUS_COLOR[status]);
  return known ? STATUS_COLOR[known] : DEFAULT_PERSON_COLOR;
}

export default function BattleParticipantsGraph({ slug }: BattleParticipantsGraphProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const { data: graphData, error, isLoading } = useSWR<GraphData>(`/api/graph?battle=${slug}`, fetcher);

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorMessage
        title={language === 'ar' ? 'تعذر تحميل شبكة المشاركين' : 'Failed to load the participants graph'}
      />
    );
  }
  if (!graphData || graphData.nodes.length === 0) return null;

  const isDark = resolvedTheme === 'dark';
  const usedStatuses = [...new Set(graphData.links.flatMap((link) => link.status ?? []))];

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="h-[400px] w-full">
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="label"
          backgroundColor={isDark ? '#1f2937' : '#f9fafb'}
          nodeColor={(node) => {
            const n = node as GraphNodeFull;
            return n.type === 'Battle' ? BATTLE_COLOR : personColor(n.id, graphData.links);
          }}
          linkColor={() => (isDark ? '#4b5563' : '#d1d5db')}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={0.9}
          onNodeClick={(node) => {
            const n = node as GraphNodeFull;
            if (n.type === 'Person') router.push(`/people/${n.slug}`);
          }}
        />
      </div>
      {usedStatuses.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {usedStatuses.map((status) => (
            <span key={status} className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[status] ?? DEFAULT_PERSON_COLOR }}
              />
              {language === 'ar' ? STATUS_LABEL[status]?.ar ?? status : STATUS_LABEL[status]?.en ?? status}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
