import { expect, it } from 'vitest';
import { DEFAULT_LEAVES, parseLeaves } from './types';

it('accepts difficulty one through ten and defaults invalid values', () => {
  for (let value = 1; value <= 10; value++) expect(parseLeaves(String(value))).toBe(value);
  for (const value of [null, '0', '11', '1.5', 'invalid']) expect(parseLeaves(value)).toBe(DEFAULT_LEAVES);
});
