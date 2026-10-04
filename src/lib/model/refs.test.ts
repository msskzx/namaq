import { describe, expect, it } from 'vitest';
import { splitRef } from './refs';

describe('splitRef', () => {
  it('reads a span of another unit as unit#span, and a local span as itself', () => {
    expect(splitRef('fath-iman-50#sp_note')).toEqual({ unit: 'fath-iman-50', span: 'sp_note' });
    expect(splitRef('sp_note')).toEqual({ span: 'sp_note' });
  });
});
