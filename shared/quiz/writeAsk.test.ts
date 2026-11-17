import { describe, expect, it } from 'vitest';
import { writeAsk } from './writeAsk';

describe('a recited ayah asked in a party', () => {
  it('asks what the host\'s pen asks, past the words the question shows, in the page\'s own words', () => {
    const whole = writeAsk('112:1', { shows: 0, recite: true }, 'whole')!;
    expect(whole.words).toHaveLength(4);
    expect(whole.asked).toEqual([0, 1, 2, 3]);
    expect(writeAsk('112:1', { shows: 2, recite: true }, 'whole')!.asked).toEqual([2, 3]);
  });
  it('never asks a quarter sign, and asks nothing of a page question that is not recited', () => {
    const quarter = writeAsk('2:26', { shows: 0, recite: true }, 'whole')!;
    expect(quarter.words[0]).toBe('۞');
    expect(quarter.asked[0]).toBe(1);
    expect(writeAsk('2:26', { title: 'hidden' }, 'whole')).toBeNull();
  });
});
