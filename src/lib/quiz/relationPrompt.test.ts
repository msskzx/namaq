import { describe, expect, it } from 'vitest';
import { relationPrompt } from './relationPrompt';

describe('relationPrompt', () => {
  it('asks for the target child when the claim subject is the father', () => {
    expect(relationPrompt('محمد ﷺ', 'FATHER', 'ar')).toBe('محمد ﷺ أب مَن؟');
    expect(relationPrompt('Muhammad', 'FATHER', 'en')).toBe('Muhammad was the father of whom?');
  });

  it('asks for the target parent without assuming their sex when the subject is the son', () => {
    expect(relationPrompt('محمد ﷺ', 'SON', 'ar')).toBe('محمد ﷺ ابن مَن؟');
    expect(relationPrompt('Muhammad', 'SON', 'en')).toBe('Muhammad was the son of whom?');
  });

  it('keeps the wife as subject and asks for her spouse', () => {
    expect(relationPrompt('خديجة', 'WIFE', 'ar')).toBe('خديجة زوجة مَن؟');
    expect(relationPrompt('Khadijah', 'WIFE', 'en')).toBe('Khadijah was the wife of whom?');
  });

  it('distinguishes the caller from the person who answered the call', () => {
    expect(relationPrompt('Zayd', 'CALLED_TO_ISLAM', 'en')).toBe('Whom did Zayd call to Islam?');
    expect(relationPrompt('زيد', 'ANSWERED_CALL_OF', 'ar')).toBe('بدعوة مَن أسلم زيد؟');
  });
});
