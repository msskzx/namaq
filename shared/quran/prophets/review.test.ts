import { describe, expect, it } from 'vitest';
import { droppedVerdict, eventPlaceKeys, keptEvents, keptViews, placeKeyOf, type PlaceVerdicts } from './review';
import { seg, placesOf, type EventView, type StoryEvent } from './story';
import { STORIES } from './stories';
import data from './verdicts.json';

const verdicts = data.places as PlaceVerdicts;

describe('story verdicts', () => {
  const keys = Object.entries(STORIES).flatMap(([slug, story]) => story.events.flatMap(event => eventPlaceKeys(slug, event).map(({ key }) => key)));

  it('has one verdict for every dot of every story, and none for a dot that no longer exists', () => {
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.filter(key => !verdicts[key])).toEqual([]);
    expect(Object.keys(verdicts).filter(key => !keys.includes(key))).toEqual([]);
  });

  it('gives every verdict a reason', () => {
    expect(Object.entries(verdicts).filter(([, verdict]) => !verdict.why?.trim()).map(([key]) => key)).toEqual([]);
  });

  it('never leaves a story without events for readers', () => {
    for (const [slug, story] of Object.entries(STORIES)) expect(keptEvents(slug, story.events, verdicts).length, slug).toBeGreaterThan(0);
  });
});

describe('hiding dropped dots', () => {
  const events: StoryEvent[] = [
    { phase: 0, title: 'one', segments: [seg(7, 85), seg(11, 84), seg(7, 80)] },
    { phase: 0, title: 'two', segments: [seg(9, 70)] },
  ];

  it('keys a dot by the first ayah its surah gives the event', () => {
    expect(eventPlaceKeys('x', events[0])).toEqual([{ surah: 7, key: 'x/7:80' }, { surah: 11, key: 'x/11:84' }]);
  });

  it('drops a dot with all its segments, and an event once nothing is left', () => {
    const cut = keptEvents('x', events, { 'x/7:80': { keep: false, why: '' }, 'x/9:70': { keep: false, why: '', checked: true } });
    expect(cut).toEqual([{ phase: 0, title: 'one', segments: [seg(11, 84)] }]);
  });

  it('keeps a dropped dot that still has a question for the owner', () => {
    expect(droppedVerdict({ keep: false, why: '', ask: 'owner: discuss' })).toBe(false);
    expect(keptEvents('x', events, { 'x/9:70': { keep: false, why: '', ask: 'owner: discuss' } })).toHaveLength(2);
  });

  it('cuts the built story the same way, recounting ayat and numbering events again', () => {
    const line = (ayah: number) => ({ ayah, text: '', words: [], norm: [] });
    const view = (surah: number, lo: number, hi = lo) => ({ surah, name: '', range: [lo, hi] as [number, number], lines: Array.from({ length: hi - lo + 1 }, (_, k) => line(lo + k)) });
    const built: EventView[] = [
      { n: 1, title: 'gone', phase: 0, segments: [view(9, 70)], count: 1 },
      { n: 2, title: 'one', phase: 0, segments: [view(7, 85, 86), view(11, 84)], count: 3 },
    ];
    const cut = keptViews('x', built, { 'x/9:70': { keep: false, why: '' }, 'x/11:84': { keep: false, why: '' } });
    expect(cut.map(e => [e.n, e.title, e.count, e.segments.map(g => g.surah)])).toEqual([[1, 'one', 2, [7]]]);
    expect(placesOf(built[1]).map(p => placeKeyOf('x', p))).toEqual(['x/7:85', 'x/11:84']);
  });
});
