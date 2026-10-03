import { describe, expect, it } from 'vitest';
import { virtueSpeakerHref, virtueSpeakerLabel } from './virtues';

describe('virtues', () => {
  it('words the speaker label in each language', () => {
    expect(virtueSpeakerLabel('عمر', 'ar', 'قال')).toBe('قال عمر:');
    expect(virtueSpeakerLabel('Umar', 'en', 'said:')).toBe('Umar said:');
  });

  it('links a speaker only when a slug is known', () => {
    expect(virtueSpeakerHref({ speakerSlug: 'umar-ibn-al-khattab' })).toBe('/people/umar-ibn-al-khattab');
    expect(virtueSpeakerHref({ speakerSlug: null })).toBeNull();
  });
});
