import { describe, expect, it } from 'vitest';
import { StoredEdge } from './types';
import { edgeColor, PARTICIPATION_STATUS_COLOR, participationMatchesStatuses, UNRECORDED_STATUS } from './status';

describe('edgeColor', () => {
  it('colors an edge by its recorded status when it has one', () => {
    expect(edgeColor({ label: 'PARTICIPATED_IN', status: ['MARTYRED'] })).toBe(PARTICIPATION_STATUS_COLOR.MARTYRED);
  });

  it('falls back to relation-type color when the edge has no status', () => {
    expect(edgeColor({ label: 'FATHER' })).not.toBe(PARTICIPATION_STATUS_COLOR.MARTYRED);
  });

  it('falls back to relation-type color when the status is unrecognized', () => {
    const withStatus = edgeColor({ label: 'PARTICIPATED_IN', status: ['SOME_FUTURE_STATUS'] });
    const withoutStatus = edgeColor({ label: 'PARTICIPATED_IN' });
    expect(withStatus).toBe(withoutStatus);
  });
});

describe('participationMatchesStatuses', () => {
  const injured: StoredEdge = { source: 'person:a', target: 'battle:badr', type: 'PARTICIPATED_IN', status: ['INJURED'] };
  const unrecorded: StoredEdge = { source: 'person:a', target: 'battle:badr', type: 'PARTICIPATED_IN', status: [] };

  it('includes every participation while the user has made no choice', () => {
    expect(participationMatchesStatuses(injured, undefined)).toBe(true);
    expect(participationMatchesStatuses(unrecorded, undefined)).toBe(true);
  });

  it('matches the chosen statuses with OR', () => {
    expect(participationMatchesStatuses(injured, ['CAPTURED', 'INJURED'])).toBe(true);
    expect(participationMatchesStatuses(injured, ['CAPTURED'])).toBe(false);
  });

  it('answers for an empty status array through the unrecorded choice alone', () => {
    expect(participationMatchesStatuses(unrecorded, [UNRECORDED_STATUS])).toBe(true);
    expect(participationMatchesStatuses(unrecorded, ['INJURED'])).toBe(false);
  });

  it('leaves other relation types alone', () => {
    const wife: StoredEdge = { source: 'person:a', target: 'person:b', type: 'WIFE' };
    expect(participationMatchesStatuses(wife, [])).toBe(true);
  });
});
