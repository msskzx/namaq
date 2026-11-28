import { describe, expect, it } from 'vitest';
import { causeChain, recentErrors, reportError } from './errors';

describe('causeChain', () => {
  it('shows every cause down to the root, so a wrapped error does not hide why it failed', () => {
    const root = new TypeError('JSON.parse: unexpected end of data');
    const wrapped = new Error('could not read bookmarks', { cause: new Error('storage read failed', { cause: root }) });
    const lines = causeChain(wrapped).split('\n');
    expect(lines[0]).toBe('could not read bookmarks');
    expect(lines.at(-1)).toBe('← TypeError: JSON.parse: unexpected end of data');
  });

  it('stops on a cause that points back at itself', () => {
    const error = new Error('loop');
    Object.assign(error, { cause: error });
    expect(causeChain(error)).toBe('loop');
  });
});

describe('reportError', () => {
  it('keeps where the error happened with its reason for the crash screen', () => {
    reportError('bookmarks: save', new Error('quota exceeded'));
    expect(recentErrors()[0]).toMatchObject({ where: 'bookmarks: save', reason: 'quota exceeded' });
  });

  it('counts the same failure again instead of filling the list with it, so an offline download keeps older errors visible', () => {
    reportError('settings: read', new Error('denied'));
    for (let i = 0; i < 50; i++) reportError('listen: download ayah', new TypeError('Network request failed'));
    const kept = recentErrors();
    expect(kept[0]).toMatchObject({ where: 'listen: download ayah', times: 50 });
    expect(kept.some(item => item.where === 'settings: read')).toBe(true);
  });
});
