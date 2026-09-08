import { describe, expect, it } from 'vitest';
import { buildRouteFetchParams, formatExpandParam, formatSubjectParam, parseExplorationInput } from './urlState';
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

  it('defaults to family and title filters when the parameter is absent', () => {
    const { globalFilters } = parseExplorationInput({ subjects: [], expands: [] }, 'prophet-muhammad');
    expect(globalFilters).toEqual(expect.arrayContaining(['FATHER', 'SON', 'WIFE', 'HOLDS_TITLE']));
    for (const type of ['COMPANION_OF', 'ACCOMPANIED_BY', 'PARTICIPATED_IN', 'INVOLVED_IN', 'PART_OF']) {
      expect(globalFilters).not.toContain(type);
    }
  });

  it('preserves an explicit empty filter instead of restoring defaults', () => {
    const { globalFilters } = parseExplorationInput({ subjects: [], expands: [], filters: [''] }, 'prophet-muhammad');
    expect(globalFilters).toEqual([]);
  });

  it('lets the companionship switch enable both stored directions', () => {
    const { globalFilters } = parseExplorationInput({ subjects: [], expands: [], filters: ['COMPANION_OF'] }, 'prophet-muhammad');
    expect(globalFilters).toEqual(['COMPANION_OF', 'ACCOMPANIED_BY']);
  });

  it('parses `filter` entries as global filters, dropping unknown relation types', () => {
    const input = parseExplorationInput({ subjects: [], expands: [], filters: ['FATHER', 'NOT_A_RELATION', 'FATHER'] }, 'prophet-muhammad');
    expect(input.globalFilters).toEqual(['FATHER']);
  });
});

describe('formatSubjectParam / formatExpandParam', () => {
  it('round-trips through parseExplorationInput', () => {
    const subjectParam = formatSubjectParam(muhammad);
    const expandParam = formatExpandParam({ subject: aisha, relation: 'FATHER' });
    const input = parseExplorationInput({ subjects: [subjectParam], expands: [expandParam], filters: [] }, 'prophet-muhammad');
    expect(input.roots).toEqual([muhammad]);
    expect(input.expansions).toEqual([{ subject: aisha, relation: 'FATHER' }]);
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
