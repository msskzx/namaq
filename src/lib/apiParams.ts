import { ApiValidationError } from '@/lib/apiError';

// See docs/plans/backend-issues.md, item 3: one clamp shared by every list
// route instead of each hand-rolling its own parseInt/NaN check.
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
export const MAX_SUBJECTS_PER_REQUEST = 50;

interface LimitOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

function parsePositiveInt(raw: string | null, paramName: string, fallback: number): number {
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) {
    throw new ApiValidationError(`Invalid ${paramName}: ${raw}`);
  }
  return value;
}

export function parseLimit(searchParams: URLSearchParams, options: LimitOptions = {}): number {
  const defaultLimit = options.defaultLimit ?? DEFAULT_LIMIT;
  const maxLimit = options.maxLimit ?? MAX_LIMIT;
  return Math.min(parsePositiveInt(searchParams.get('limit'), 'limit', defaultLimit), maxLimit);
}

export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(searchParams: URLSearchParams, options: LimitOptions = {}): Pagination {
  const page = parsePositiveInt(searchParams.get('page'), 'page', 1);
  const limit = parseLimit(searchParams, options);
  return { page, limit, skip: (page - 1) * limit };
}

// Truncates rather than rejects: a request naming too many subjects still
// gets an answer, just a bounded one, rather than a hard error for what is
// only a cost control.
export function clampSubjects(values: string[], max = MAX_SUBJECTS_PER_REQUEST): string[] {
  return values.slice(0, max);
}
