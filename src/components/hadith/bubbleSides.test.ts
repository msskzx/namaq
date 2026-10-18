import { describe, expect, it } from 'vitest';
import { bubbleSides } from './HadithBody';

const turn = (speaker?: string) => ({ kind: 'turn' as const, speaker });

describe('bubbleSides', () => {
  it('switches side on every change of speaker and keeps it across narration', () => {
    expect(bubbleSides([turn('A'), turn('B'), { kind: 'narration' as const, speaker: 'B' }, turn('C'), turn('C'), turn('A')])).toEqual([false, true, true, false, false, true]);
  });

  it('treats a turn with no named speaker as a speaker of its own', () => {
    expect(bubbleSides([turn(), turn('A')])).toEqual([false, true]);
    expect(bubbleSides([turn('A'), turn(), turn('B')])).toEqual([false, true, false]);
  });
});
