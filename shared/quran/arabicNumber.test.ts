import { describe, expect, it } from 'vitest';
import { num } from './arabicNumber';

describe('num', () => {
  it('writes Arabic-Indic digits with no thousands separator', () => {
    expect(num(6236)).toBe('٦٢٣٦');
    expect(num(114)).toBe('١١٤');
    expect(num(0)).toBe('٠');
  });
});
