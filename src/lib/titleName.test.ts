import { describe, expect, it } from 'vitest';
import { titleName } from './titleName';

const companion = { slug: 'companion', name: 'صحابي', nameTransliterated: 'Companion' };
const caliph = { slug: 'caliph', name: 'خليفة', nameTransliterated: 'Caliph' };

describe('titleName', () => {
  it('uses the feminine form of companion for a woman in Arabic', () => {
    expect(titleName(companion, 'FEMALE', 'ar')).toBe('صحابية');
  });

  it('keeps the masculine form for a man or an unrecorded sex', () => {
    expect(titleName(companion, 'MALE', 'ar')).toBe('صحابي');
    expect(titleName(companion, null, 'ar')).toBe('صحابي');
    expect(titleName(companion, undefined, 'ar')).toBe('صحابي');
  });

  it('leaves English and titles without a feminine form alone', () => {
    expect(titleName(companion, 'FEMALE', 'en')).toBe('Companion');
    expect(titleName(caliph, 'FEMALE', 'ar')).toBe('خليفة');
  });
});
