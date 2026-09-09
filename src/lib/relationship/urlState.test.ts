import { describe, expect, it } from 'vitest';
import { buildRouteFetchParams, formatCapParam, formatExpandParam, formatSubjectParam, parseExplorationInput } from './urlState';
import { subjectId } from './types';

const muhammad = subjectId('person', 'prophet-muhammad');
const aisha = subjectId('person', 'aisha-bint-abi-bakr');

describe('parseExplorationInput', () => {
  it('defaults roots to the target person when `subject` is absent', () => {
    const input = parseExplorationInput({ subjects: [], expands: [], filters: [] }, 'prophet-muhammad');
    expect(input.roots).toEqual([muhammad]);
  });

  it('reads explicit `subject` params as roots, deduplicated', () => {
    const input = parseExplorationInput(
      { subjects: ['person:prophet-muhammad', 'person:aisha-bint-abi-bakr', 'person:prophet-muhammad'], expands: [], filters: [] },
      'prophet-muhammad'
    );
    expect(input.roots).toEqual([muhammad, aisha]);
  });

  it('does not fall back to the default target when `subject` is present but every entry is malformed', () => {
    const input = parseExplorationInput({ subjects: ['not-a-subject-id'], expands: [], filters: [] }, 'prophet-muhammad');
    expect(input.roots).toEqual([]);
  });

  it('parses `expand` entries into subject/relation pairs, dropping malformed ones', () => {
    const input = parseExplorationInput(
      { subjects: [], expands: ['person:prophet-muhammad:WIFE', 'person:aisha-bint-abi-bakr:PATERNAL_LINEAGE', 'garbage', 'person:x:NOT_A_RELATION'], filters: [] },
      'prophet-muhammad'
    );
    expect(input.expansions).toEqual([
      { subject: muhammad, relation: 'WIFE' },
      { subject: aisha, relation: 'PATERNAL_LINEAGE' },
    ]);
  });

  it('parses `filter` entries as global filters, dropping unknown relation types', () => {
    const input = parseExplorationInput({ subjects: [], expands: [], filters: ['FATHER', 'NOT_A_RELATION', 'FATHER'] }, 'prophet-muhammad');
    expect(input.globalFilters).toEqual(['FATHER']);
  });

  it('parses `cap` entries into subject/relation pairs, deduplicated, dropping malformed ones', () => {
    const input = parseExplorationInput(
      {
        subjects: [],
        expands: [],
        filters: [],
        caps: ['person:aisha-bint-abi-bakr:WIFE', 'person:aisha-bint-abi-bakr:WIFE', 'person:x:ANCESTORS', 'garbage'],
      },
      'prophet-muhammad'
    );
    expect(input.caps).toEqual([{ subject: aisha, relation: 'WIFE' }]);
  });

  it('parses `removed` entries as subjects, deduplicated', () => {
    const input = parseExplorationInput(
      { subjects: [], expands: [], filters: [], removed: ['person:aisha-bint-abi-bakr', 'person:aisha-bint-abi-bakr', 'nope'] },
      'prophet-muhammad'
    );
    expect(input.removed).toEqual([aisha]);
  });

  it('reads absent cap and removed params as empty history rather than undefined state', () => {
    const input = parseExplorationInput({ subjects: [], expands: [], filters: [] }, 'prophet-muhammad');
    expect(input.caps).toEqual([]);
    expect(input.removed).toEqual([]);
  });
});

describe('formatSubjectParam / formatExpandParam / formatCapParam', () => {
  it('round-trips through parseExplorationInput', () => {
    const subjectParam = formatSubjectParam(muhammad);
    const expandParam = formatExpandParam({ subject: aisha, relation: 'FATHER' });
    const capParam = formatCapParam({ subject: aisha, relation: 'WIFE' });
    const input = parseExplorationInput(
      { subjects: [subjectParam], expands: [expandParam], filters: [], caps: [capParam], removed: [formatSubjectParam(muhammad)] },
      'prophet-muhammad'
    );
    expect(input.roots).toEqual([muhammad]);
    expect(input.expansions).toEqual([{ subject: aisha, relation: 'FATHER' }]);
    expect(input.caps).toEqual([{ subject: aisha, relation: 'WIFE' }]);
    expect(input.removed).toEqual([muhammad]);
  });
});

describe('buildRouteFetchParams', () => {
  it('routes lineage expand actions to their dedicated route.ts params', () => {
    const params = buildRouteFetchParams([muhammad], [
      { subject: muhammad, relation: 'ANCESTORS' },
      { subject: aisha, relation: 'PATERNAL_LINEAGE' },
      { subject: muhammad, relation: 'DESCENDANTS' },
    ]);
    expect(params.ancestorsOfBothParents).toEqual(['prophet-muhammad']);
    expect(params.ancestorsOf).toEqual(['aisha-bint-abi-bakr']);
    expect(params.descendantsOf).toEqual(['prophet-muhammad']);
  });

  it('routes every root and every expand subject (lineage or not) through relationSubjects', () => {
    const params = buildRouteFetchParams([muhammad], [
      { subject: muhammad, relation: 'WIFE' },
      { subject: aisha, relation: 'PATERNAL_LINEAGE' },
    ]);
    expect(new Set(params.relationSubjects)).toEqual(new Set([muhammad, aisha]));
  });

  it('uses the full relation vocabulary whenever relationSubjects is non-empty, to guarantee bare node data', () => {
    const params = buildRouteFetchParams([muhammad], []);
    expect(params.relationTypes.length).toBeGreaterThan(1);
    expect(params.relationTypes).toContain('WIFE');
    expect(params.relationTypes).toContain('FATHER');
  });

  it('produces no relationTypes when there are no relationSubjects at all', () => {
    const params = buildRouteFetchParams([], []);
    expect(params.relationSubjects).toEqual([]);
    expect(params.relationTypes).toEqual([]);
  });

  it('skips lineage routing for a non-person subject', () => {
    const battle = subjectId('battle', 'battle-of-badr');
    const params = buildRouteFetchParams([], [{ subject: battle, relation: 'ANCESTORS' }]);
    expect(params.ancestorsOfBothParents).toEqual([]);
    expect(params.relationSubjects).toEqual([battle]);
  });
});
