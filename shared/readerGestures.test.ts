import { describe, expect, it } from 'vitest';
import { DEFAULT_GESTURES, parseGestures } from './readerGestures';

describe('reader gestures', () => {
  it('falls back to the defaults for missing, damaged or out-of-mode choices', () => {
    expect(parseGestures(null)).toEqual(DEFAULT_GESTURES);
    expect(parseGestures('{')).toEqual(DEFAULT_GESTURES);
    const parsed = parseGestures(JSON.stringify({ read: { tap: 'next-ayah', long: 'save' }, recite: { double: 'back', tap: 'bogus' } }));
    expect(parsed.read).toEqual({ tap: 'tools', double: 'save', long: 'save' });
    expect(parsed.recite).toEqual({ tap: 'next-ayah', double: 'back', long: 'actions' });
  });
});
