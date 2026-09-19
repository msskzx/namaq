import { describe, expect, it } from 'vitest';
import { governingRelationType, relationColor, relationGroup, sortRelationTypes } from './categories';

describe('relationColor', () => {
  it('groups paired relation types onto the same color', () => {
    expect(relationColor('FATHER')).toBe(relationColor('MOTHER'));
    expect(relationColor('SON')).toBe(relationColor('DAUGHTER'));
    expect(relationColor('FATHER')).not.toBe(relationColor('SON'));
  });

  it('gives an unknown relation type a deterministic fallback color', () => {
    expect(relationColor('SOME_FUTURE_TYPE')).toBe(relationColor('SOME_FUTURE_TYPE'));
  });
});

describe('governingRelationType', () => {
  it('resolves ACCOMPANIED_BY to its governing COMPANION_OF toggle', () => {
    expect(governingRelationType('ACCOMPANIED_BY')).toBe('COMPANION_OF');
  });

  it('returns any other type unchanged', () => {
    expect(governingRelationType('FATHER')).toBe('FATHER');
  });
});

describe('relationGroup', () => {
  it('groups battle/title/event relation types by their entity kind', () => {
    expect(relationGroup('PARTICIPATED_IN')).toBe('battles');
    expect(relationGroup('HOLDS_TITLE')).toBe('titles');
    expect(relationGroup('INVOLVED_IN')).toBe('events');
  });

  it('defaults every person-to-person relation type to family', () => {
    expect(relationGroup('FATHER')).toBe('family');
    expect(relationGroup('COMPANION_OF')).toBe('family');
  });

  // PACT_BROTHER shares COMPANION_OF's colour rather than the sibling one, so
  // the graph does not read a مؤاخاة as a blood tie.
  it('colours the pact brotherhood as companionship, not as a sibling tie', () => {
    expect(relationColor('PACT_BROTHER')).toBe(relationColor('COMPANION_OF'));
    expect(relationColor('PACT_BROTHER')).not.toBe(relationColor('BROTHER'));
    expect(relationGroup('PACT_BROTHER')).toBe('family');
  });
});

describe('sortRelationTypes', () => {
  it('orders known types by RELATION_ORDER and puts unknown types last, alphabetically', () => {
    expect(sortRelationTypes(['SON', 'FATHER', 'ZZZ_UNKNOWN', 'AAA_UNKNOWN'])).toEqual([
      'FATHER',
      'SON',
      'AAA_UNKNOWN',
      'ZZZ_UNKNOWN',
    ]);
  });
});
