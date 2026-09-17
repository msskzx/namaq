import { relationColor } from './categories';
import { StoredEdge } from './types';
import { GraphLink } from '@/types/graph';

// ParticipationStatus in prisma/schema.prisma, plus the choice that stands for
// an empty status array: a recorded participation whose outcome is unknown.
// ABSENT_EXCUSED is here too, but it qualifies an ABSENT_FROM edge rather than
// a participation -- see docs/adr/0013-separate-attendance-from-outcome.md.
export const PARTICIPATION_STATUSES = ['MARTYRED', 'DIED', 'INJURED', 'CAPTURED', 'WAS_CAPTURED', 'ABSENT_EXCUSED'] as const;

/** The two edge types a battle roster is drawn from, both status-filtered. */
export const PARTICIPATION_RELATIONS = ['PARTICIPATED_IN', 'ABSENT_FROM'] as const;
export const UNRECORDED_STATUS = 'UNRECORDED';
export const PARTICIPATION_STATUS_CHOICES: readonly string[] = [...PARTICIPATION_STATUSES, UNRECORDED_STATUS];

/**
 * Whether a participation edge survives the chosen statuses, which match with
 * OR semantics. `undefined` means the user has made no choice yet and every
 * status is included. Other relation types are never status-filtered.
 */
export function participationMatchesStatuses(edge: StoredEdge, statuses: string[] | undefined): boolean {
  if (!statuses || !(PARTICIPATION_RELATIONS as readonly string[]).includes(edge.type)) return true;
  const recorded = edge.status ?? [];
  if (recorded.length === 0) return statuses.includes(UNRECORDED_STATUS);
  return recorded.some((status) => statuses.includes(status));
}

// Mirrors the status values BattleParticipation.status can hold (see
// prisma/schema.prisma) -- colors a roster edge by outcome instead of by
// relation type, since participations share one type and a single color would
// say nothing about what happened. An absence has one status, so its color and
// its relation say the same thing.
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
