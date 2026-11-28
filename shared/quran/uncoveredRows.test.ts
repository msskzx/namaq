import { expect, it } from 'vitest';
import { uncoveredRows } from './branches';

it('draws an ayah once: a row already inside another row\'s passage is left out', () => {
  expect(uncoveredRows([['13:33'], ['39:36', '39:37'], ['39:37'], ['42:44'], ['42:46']])).toEqual([0, 1, 3, 4]);
});

it('keeps a row that reads on past the passage holding its first ayah, and one of two identical rows', () => {
  expect(uncoveredRows([['39:36', '39:37'], ['39:37', '39:38']])).toEqual([0, 1]);
  expect(uncoveredRows([['2:1'], ['2:1']])).toEqual([0]);
});
