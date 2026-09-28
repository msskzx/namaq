import { describe, expect, it } from 'vitest';
import { ApiValidationError } from '@/lib/apiError';
import { clampSubjects, parseLimit, parsePagination } from '@/lib/apiParams';

function params(query: string) {
  return new URLSearchParams(query);
}

describe('parseLimit', () => {
  it('defaults when no limit is given', () => {
    expect(parseLimit(params(''), { defaultLimit: 20 })).toBe(20);
  });

  it('clamps a limit above the max', () => {
    expect(parseLimit(params('limit=1000'), { maxLimit: 100 })).toBe(100);
  });

  it('throws for a non-numeric limit', () => {
    expect(() => parseLimit(params('limit=abc'))).toThrow(ApiValidationError);
  });

  it('throws for a zero or negative limit', () => {
    expect(() => parseLimit(params('limit=0'))).toThrow(ApiValidationError);
    expect(() => parseLimit(params('limit=-5'))).toThrow(ApiValidationError);
  });
});

describe('parsePagination', () => {
  it('defaults to page 1 and computes skip', () => {
    expect(parsePagination(params(''), { defaultLimit: 12 })).toEqual({ page: 1, limit: 12, skip: 0 });
  });

  it('computes skip from page and limit', () => {
    expect(parsePagination(params('page=3&limit=10'))).toEqual({ page: 3, limit: 10, skip: 20 });
  });

  it('throws for an invalid page', () => {
    expect(() => parsePagination(params('page=0'))).toThrow(ApiValidationError);
  });
});

describe('clampSubjects', () => {
  it('leaves a short list untouched', () => {
    expect(clampSubjects(['a', 'b'], 5)).toEqual(['a', 'b']);
  });

  it('truncates a list past the max', () => {
    const values = Array.from({ length: 10 }, (_, i) => `s${i}`);
    expect(clampSubjects(values, 5)).toEqual(['s0', 's1', 's2', 's3', 's4']);
  });
});
