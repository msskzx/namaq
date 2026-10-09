import { describe, expect, it } from 'vitest';
import { hasModelVirtues, virtueSpeakerHref, virtueSpeakerLabel } from './virtues';

describe('virtues', () => {
  it('words the speaker label in each language', () => {
    expect(virtueSpeakerLabel('عمر', 'ar', 'قال')).toBe('قال عمر:');
    expect(virtueSpeakerLabel('Umar', 'en', 'said:')).toBe('Umar said:');
  });

  it('links a speaker only when a slug is known', () => {
    expect(virtueSpeakerHref({ speakerSlug: 'umar-ibn-al-khattab' })).toBe('/people/umar-ibn-al-khattab');
    expect(virtueSpeakerHref({ speakerSlug: null })).toBeNull();
  });

  it('shows the model virtues in place of the old entries only when the model has some', () => {
    expect(hasModelVirtues([{ predicate: 'title' }, { predicate: 'virtue' }])).toBe(true);
    expect(hasModelVirtues([{ predicate: 'title' }])).toBe(false);
    expect(hasModelVirtues(undefined)).toBe(false);
  });
});
