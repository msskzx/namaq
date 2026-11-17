import { describe, expect, it } from 'vitest';
import { ayahAudioUrl, ayatOf, FIRST, isRepeatPlan, nextStep, ONCE, pauseAfter, RECITERS, reciterOf, stepTo, surahEnd, type Step } from './recitation';

const counts = new Map([[1, 7], [2, 286], [114, 6]]);

const run = (length: number, plan = ONCE, limit = 100) => {
  const steps: Step[] = [];
  for (let step: Step | null = FIRST; step && steps.length < limit; step = nextStep(step, length, plan)) steps.push(step);
  return steps;
};

describe('recitation', () => {
  it('names each ayah by its six-digit file in the reciter folder', () => {
    expect(ayahAudioUrl(reciterOf(7), '2:255')).toBe('https://verses.quran.com/Alafasy/mp3/002255.mp3');
    expect(ayahAudioUrl(reciterOf(6), '114:6')).toBe('https://mirrors.quranicaudio.com/everyayah/Husary_64kbps/114006.mp3');
    expect(new Set(RECITERS.map(r => r.id)).size).toBe(RECITERS.length);
  });

  it('lists a range across surahs, from and to included, either way round', () => {
    expect(ayatOf({ from: '1:6', to: '2:2' }, counts)).toEqual(['1:6', '1:7', '2:1', '2:2']);
    expect(ayatOf({ from: '2:2', to: '1:6' }, counts)).toEqual(['1:6', '1:7', '2:1', '2:2']);
    expect(ayatOf({ from: '2:5', to: '2:5' }, counts)).toEqual(['2:5']);
    expect(surahEnd('2:5', counts)).toBe('2:286');
  });

  it('plays each ayah its times, then the range its times, then stops', () => {
    const plan = { ...ONCE, eachAyah: 2, rangeTimes: 2 };
    expect(run(2, plan).map(s => `${s.pass}.${s.at}.${s.repeat}`)).toEqual(['0.0.0', '0.0.1', '0.1.0', '0.1.1', '1.0.0', '1.0.1', '1.1.0', '1.1.1']);
    expect(run(3)).toHaveLength(3);
  });

  it('repeats without end when a count is 0', () => {
    expect(run(2, { ...ONCE, rangeTimes: 0 }, 9).map(s => s.at)).toEqual([0, 1, 0, 1, 0, 1, 0, 1, 0]);
    expect(run(2, { ...ONCE, eachAyah: 0 }, 4).map(s => s.at)).toEqual([0, 0, 0, 0]);
  });

  it('steps one ayah back or on inside the range only', () => {
    expect(stepTo({ at: 1, repeat: 2, pass: 1 }, 1, 3)).toEqual({ at: 2, repeat: 0, pass: 1 });
    expect(stepTo(FIRST, -1, 3)).toBeNull();
    expect(stepTo({ at: 2, repeat: 0, pass: 0 }, 1, 3)).toBeNull();
  });

  it('pauses after an ayah as asked, as long as it took at the chosen speed, never after the last', () => {
    expect(pauseAfter(ONCE, 8, FIRST)).toBe(0);
    expect(pauseAfter({ ...ONCE, pause: 5 }, 8, FIRST)).toBe(5);
    expect(pauseAfter({ ...ONCE, pause: 'ayah', speed: 1.25 }, 10, FIRST)).toBe(8);
    expect(pauseAfter({ ...ONCE, pause: 'ayah' }, 10, null)).toBe(0);
  });

  it('accepts only plans the sheet can set', () => {
    expect(isRepeatPlan(ONCE)).toBe(true);
    expect(isRepeatPlan({ ...ONCE, eachAyah: 7 })).toBe(false);
    expect(isRepeatPlan({ ...ONCE, pause: 3 })).toBe(false);
    expect(isRepeatPlan(null)).toBe(false);
  });
});

