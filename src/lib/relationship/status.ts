import { relationColor } from './categories';
import { GraphLink } from '@/types/graph';

// Mirrors the status values BattleParticipation.status can hold (see
// prisma/schema.prisma) -- colors a PARTICIPATED_IN edge by outcome instead
// of by relation type, since every such edge shares that one type and a
// single color would say nothing about what happened.
export const PARTICIPATION_STATUS_COLOR: Record<string, string> = {
  MARTYRED: '#ef4444',
  DIED: '#ef4444',
  INJURED: '#f97316',
  CAPTURED: '#a855f7',
  WAS_CAPTURED: '#a855f7',
  ABSENT_EXCUSED: '#3b82f6',
};

export function edgeColor(link: Pick<GraphLink, 'label' | 'status'>): string {
  const status = link.status?.find((value) => PARTICIPATION_STATUS_COLOR[value]);
  return status ? PARTICIPATION_STATUS_COLOR[status] : relationColor(link.label);
}
