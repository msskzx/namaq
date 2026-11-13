import { describe, expect, it } from 'vitest';
import { clock, END_MS, HOLD_MS, PART_LIMIT_MS, partLengths, segmentAt, SLIDE_MS, stepEnds, TITLE_MS, videoLength, videoParts, videoTimeline } from './pageVideo';

const card = (seconds: number) => [seconds * 1000];

describe('the page video', () => {
  it('opens on the title, reads each card, slides between them and ends on the link', () => {
    const segments = videoTimeline([card(10), card(20)]);
    expect(segments.map(segment => segment.kind)).toEqual(['title', 'card', 'slide', 'card', 'end']);
    expect(videoLength(segments)).toBe(TITLE_MS + 10_000 + HOLD_MS + SLIDE_MS + 20_000 + HOLD_MS + END_MS);
    segments.slice(1).forEach((segment, i) => expect(segment.start).toBe(segments[i].end));
  });

  it("keeps a single card's video as before: the card alone", () => {
    const segments = videoTimeline([card(10)], false);
    expect(segments).toEqual([{ kind: 'card', card: 0, ends: [10_000], start: 0, end: 10_000 + HOLD_MS }]);
  });

  it('finds the segment playing at a time', () => {
    const segments = videoTimeline([card(10), card(20)]);
    expect(segmentAt(segments, 0).segment.kind).toBe('title');
    expect(segmentAt(segments, TITLE_MS + 500)).toMatchObject({ segment: { kind: 'card', card: 0 }, local: 500 });
    expect(segmentAt(segments, 10 ** 9).segment.kind).toBe('end');
  });

  it('splits into parts of about 3 minutes at most, never cutting a card', () => {
    const cards = Array.from({ length: 12 }, () => card(40));
    const parts = videoParts(cards);
    expect(parts.flat()).toEqual(cards.map((_, i) => i));
    expect(parts.length).toBeGreaterThan(1);
    partLengths(cards).forEach(length => expect(length).toBeLessThanOrEqual(PART_LIMIT_MS));
    expect(parts[0].length).toBe(4);
  });

  it('gives a card longer than the limit a part of its own', () => {
    expect(videoParts([card(30), card(200), card(30)])).toEqual([[0], [1], [2]]);
  });

  it('keeps a short page in one part', () => {
    expect(videoParts([card(10), card(10), card(10)])).toEqual([[0, 1, 2]]);
  });

  it('adds up step times and shows lengths in Arabic digits', () => {
    expect(stepEnds([100, 200, 300])).toEqual([100, 300, 600]);
    expect(clock(125_000)).toBe('٢:٠٥');
  });
});
