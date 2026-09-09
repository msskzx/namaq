import { relationColor } from './categories';
import { StoredEdge } from './types';
import { GraphLink } from '@/types/graph';

// ParticipationStatus in prisma/schema.prisma, plus the choice that stands for
// an empty status array: a recorded participation whose outcome is unknown.
export const PARTICIPATION_STATUSES = ['MARTYRED', 'DIED', 'INJURED', 'CAPTURED', 'WAS_CAPTURED', 'ABSENT_EXCUSED'] as const;
export const UNRECORDED_STATUS = 'UNRECORDED';
export const PARTICIPATION_STATUS_CHOICES: readonly string[] = [...PARTICIPATION_STATUSES, UNRECORDED_STATUS];

/**
 * Whether a participation edge survives the chosen statuses, which match with
 * OR semantics. `undefined` means the user has made no choice yet and every
 * status is included. Other relation types are never status-filtered.
 */
export function participationMatchesStatuses(edge: StoredEdge, statuses: string[] | undefined): boolean {
  if (!statuses || edge.type !== 'PARTICIPATED_IN') return true;
  const recorded = edge.status ?? [];
  if (recorded.length === 0) return statuses.includes(UNRECORDED_STATUS);
  return recorded.some((status) => statuses.includes(status));
}

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
