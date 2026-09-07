import { describe, expect, it } from 'vitest';
import { edgeColor, PARTICIPATION_STATUS_COLOR } from './status';

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
