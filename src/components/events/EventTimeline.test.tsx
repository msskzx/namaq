// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import EventTimeline from './EventTimeline';
import type { TimelineItem } from '@/lib/timeline';

vi.mock('@/components/events/EventCard', () => ({
  default: ({ event }: { event: { slug: string; name: string } }) => <div data-testid={`${event.slug}`}>{event.name}</div>,
}));

function createEvent(overrides: Partial<TimelineItem>): TimelineItem {
  return {
    id: 'id-1',
    slug: 'event-1',
    kind: 'event',
    name: 'حدث',
    nameTransliterated: 'Event',
    hijriYear: null,
    hijriPeriod: null,
    location: null,
    locationTransliterated: null,
    ...overrides,
  };
}

describe('EventTimeline', () => {
  afterEach(() => cleanup());

  it('returns null when events array is empty', () => {
    const { container } = render(<EventTimeline events={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when events is undefined', () => {
    const { container } = render(<EventTimeline events={undefined as unknown as TimelineItem[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null when events is null', () => {
    const { container } = render(<EventTimeline events={null as unknown as TimelineItem[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders a single event', () => {
    const events = [createEvent({ id: '1', slug: 'event-1', hijriYear: 5 })];

    render(<EventTimeline events={events} />);

    expect(screen.getByTestId('event-1')).toBeTruthy();
  });

  it('sorts events by timelineYear in ascending order', () => {
    const events = [
      createEvent({ id: '1', slug: 'event-1', hijriYear: 10 }),
      createEvent({ id: '2', slug: 'event-2', hijriYear: 5 }),
      createEvent({ id: '3', slug: 'event-3', hijriYear: 15 }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const eventElements = container.querySelectorAll('[data-testid^="event-"]');
    expect(eventElements[0].getAttribute('data-testid')).toBe('event-2');
    expect(eventElements[1].getAttribute('data-testid')).toBe('event-1');
    expect(eventElements[2].getAttribute('data-testid')).toBe('event-3');
  });

  it('places an undated event with an interval between the dated events around it', () => {
    const events = [
      createEvent({ id: '1', slug: 'dated-10', hijriYear: 10 }),
      createEvent({
        id: '2',
        slug: 'undated',
        hijriYear: null,
        interval: {
          from: { slug: 'a', kind: 'event', name: 'a', nameTransliterated: null, year: 5 },
        },
      }),
      createEvent({ id: '3', slug: 'dated-5', hijriYear: 5 }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const eventElements = container.querySelectorAll('[data-testid]');
    const slugs = Array.from(eventElements).map(e => e.getAttribute('data-testid'));
    expect(slugs).toEqual(['dated-5', 'undated', 'dated-10']);
  });

  it('places undated events without intervals last', () => {
    const events = [
      createEvent({ id: '1', slug: 'dated-event', hijriYear: 10 }),
      createEvent({ id: '2', slug: 'undated-event', hijriYear: null }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const eventElements = container.querySelectorAll('[data-testid]');
    const slugs = Array.from(eventElements).map(e => e.getAttribute('data-testid'));
    expect(slugs).toEqual(['dated-event', 'undated-event']);
  });

  it('handles mixed dated, interval-placed, and unplaced events', () => {
    const events = [
      createEvent({ id: '1', slug: 'a-unplaced', hijriYear: null }),
      createEvent({
        id: '2',
        slug: 'b-between-5-10',
        hijriYear: null,
        interval: {
          from: { slug: 'x', kind: 'event', name: 'x', nameTransliterated: null, year: 5 },
          to: { slug: 'y', kind: 'event', name: 'y', nameTransliterated: null, year: 10 },
        },
      }),
      createEvent({ id: '3', slug: 'c-year-2', hijriYear: 2 }),
      createEvent({ id: '4', slug: 'd-year-15', hijriYear: 15 }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const eventElements = container.querySelectorAll('[data-testid]');
    const slugs = Array.from(eventElements).map(e => e.getAttribute('data-testid'));
    expect(slugs).toEqual(['c-year-2', 'b-between-5-10', 'd-year-15', 'a-unplaced']);
  });

  it('preserves input array by creating a copy before sorting', () => {
    const events = [
      createEvent({ id: '1', slug: 'event-1', hijriYear: 10 }),
      createEvent({ id: '2', slug: 'event-2', hijriYear: 5 }),
    ];

    const originalOrder = [...events];

    render(<EventTimeline events={events} />);

    expect(events).toEqual(originalOrder);
  });

  it('renders timeline container with correct styling', () => {
    const events = [createEvent({ id: '1', slug: 'event-1' })];
    const { container } = render(<EventTimeline events={events} />);

    const timeline = container.querySelector('.bg-gray-50');
    expect(timeline).toBeTruthy();
    expect(timeline?.className).toContain('dark:bg-black');
    expect(timeline?.className).toContain('rounded-lg');
  });

  it('renders timeline line and dots for each event', () => {
    const events = [
      createEvent({ id: '1', slug: 'event-1' }),
      createEvent({ id: '2', slug: 'event-2' }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const timelineLine = container.querySelector('.start-8.top-0');
    expect(timelineLine).toBeTruthy();

    const dots = container.querySelectorAll('.bg-amber-400.rounded-full');
    expect(dots.length).toBeGreaterThanOrEqual(2);
  });

  it('renders EventCard for each event', () => {
    const events = [
      createEvent({ id: '1', slug: 'event-1' }),
      createEvent({ id: '2', slug: 'event-2' }),
      createEvent({ id: '3', slug: 'event-3' }),
    ];

    render(<EventTimeline events={events} />);

    expect(screen.getAllByTestId(/^event-/)).toHaveLength(3);
  });

  it('handles negative years (pre-hijra)', () => {
    const events = [
      createEvent({ id: '1', slug: 'pre-hijra', hijriYear: -1 }),
      createEvent({ id: '2', slug: 'post-hijra', hijriYear: 1 }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const eventElements = container.querySelectorAll('[data-testid^="pre"]');
    expect(eventElements[0].getAttribute('data-testid')).toBe('pre-hijra');
    const postElements = container.querySelectorAll('[data-testid^="post"]');
    expect(postElements[0].getAttribute('data-testid')).toBe('post-hijra');
  });

  it('preserves input order for ties with equal years (stable sort)', () => {
    const events = [
      createEvent({ id: '1', slug: 'z-year-5', hijriYear: 5 }),
      createEvent({ id: '2', slug: 'a-year-5', hijriYear: 5 }),
      createEvent({ id: '3', slug: 'm-year-5', hijriYear: 5 }),
    ];

    const { container } = render(<EventTimeline events={events} />);

    const eventElements = container.querySelectorAll('[data-testid$="year-5"]');
    expect(eventElements[0].getAttribute('data-testid')).toBe('z-year-5');
    expect(eventElements[1].getAttribute('data-testid')).toBe('a-year-5');
    expect(eventElements[2].getAttribute('data-testid')).toBe('m-year-5');
  });
});
