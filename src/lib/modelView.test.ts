import { describe, expect, it } from 'vitest';
import {
  citationLabel,
  originLabel,
  predicateLabel,
  statusLabel,
  valueLines,
  type ModelEntryDto,
} from './modelView';

const base: ModelEntryDto = {
  unit: 'u',
  assertionId: 'a',
  predicate: 'name.kunya',
  parts: ['أَبُو عَبْدِ اللهِ'],
  text: 'أَبُو عَبْدِ اللهِ',
  parsed: null,
  classified: null,
  object: null,
  objectMention: null,
  origins: [],
  spanIds: ['s1'],
  status: 'PROPOSED',
  identification: 'PROPOSED',
  reviewed: false,
};

describe('modelView', () => {
  it("shows the book's own words for a text value, and each part of a longer one", () => {
    expect(valueLines(base, 'ar')).toEqual(['أَبُو عَبْدِ اللهِ']);
    expect(valueLines({ ...base, predicate: 'appearance', parts: ['a', 'b'] }, 'ar')).toEqual([
      'a',
      'b',
    ]);
  });

  it('uses the joined name for a full name', () => {
    expect(
      valueLines({ ...base, predicate: 'name.full', parts: ['x', 'y'], text: 'x z' }, 'ar'),
    ).toEqual(['x z']);
  });

  it('says a number with its unit, and a sex in words', () => {
    expect(valueLines({ ...base, predicate: 'died.year', parsed: 36 }, 'ar')).toEqual(['36 هـ']);
    expect(valueLines({ ...base, predicate: 'islam.age', parsed: 16 }, 'en')).toEqual(['16 years']);
    expect(valueLines({ ...base, predicate: 'sex', classified: 'MALE' }, 'ar')).toEqual(['ذكر']);
    expect(valueLines({ ...base, predicate: 'sex', classified: 'MALE' }, 'en')).toEqual(['Male']);
  });

  it('shows a related person as the book names them', () => {
    expect(
      valueLines(
        { ...base, predicate: 'CHILD_OF', object: 'x', objectMention: 'العَوَّامِ' },
        'ar',
      ),
    ).toEqual(['العَوَّامِ']);
  });

  it('labels the author and a quoted speaker, in both languages', () => {
    expect(originLabel({ author: 'al-dhahabi' }, 'ar')).toBe('المصنف: الذهبي');
    expect(originLabel({ author: 'al-dhahabi' }, 'en')).toBe('The author: al-Dhahabi');
    expect(originLabel({ mention: 'عُرْوَةَ' }, 'ar')).toBe('ورد عن: عُرْوَةَ');
  });

  it("cites the first span's volume and page, and says whether it is reviewed", () => {
    const spans = [{ unit: 'u', spanId: 's1', volume: 4, page: '41' }];
    expect(citationLabel(base, spans, 'ar')).toBe('سير أعلام النبلاء، مج 4، ص 41');
    expect(citationLabel(base, [], 'ar')).toBeNull();
    expect(statusLabel(base, 'ar')).toBe('غير مراجَع');
    expect(statusLabel({ ...base, reviewed: true }, 'en')).toBe('Reviewed');
  });

  it('labels each predicate and falls back to the predicate itself', () => {
    expect(predicateLabel('islam.age', 'en')).toBe('Age at Islam');
    expect(predicateLabel('unknown', 'ar')).toBe('unknown');
  });
});
