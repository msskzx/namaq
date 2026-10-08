// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import EventCard from './EventCard';
import type { TimelineItem } from '@/lib/timeline';

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

function createEvent(overrides: Partial<TimelineItem>): TimelineItem {
  return {
    id: 'event-1',
    slug: 'event-slug',
    kind: 'event',
    name: 'الحدث',
    nameTransliterated: 'Event',
    hijriYear: 5,
    hijriPeriod: null,
    location: null,
    locationTransliterated: null,
    ...overrides,
  };
}

describe('EventCard', () => {
  afterEach(() => cleanup());

  it('displays event name with transliterated name when language is en', () => {
    const event = createEvent({
      name: 'الحدث',
      nameTransliterated: 'Event Name',
    });

    render(<EventCard event={event} />);

    expect(screen.getByText('Event Name')).toBeTruthy();
  });

  it('displays formatted hijriYear when event is dated', () => {
    const event = createEvent({
      hijriYear: 10,
    });

    render(<EventCard event={event} />);

    expect(screen.getByText('10 AH')).toBeTruthy();
  });

  it('does not display hijriYear when event is undated', () => {
    const event = createEvent({
      hijriYear: null,
      interval: undefined,
    });

    render(<EventCard event={event} />);

    expect(screen.queryByText(/AH/)).toBeNull();
  });

  it('shows DerivedInterval when event is undated with interval', () => {
    const event = createEvent({
      hijriYear: null,
      interval: {
        from: {
          slug: 'first',
          kind: 'event',
          name: 'First',
          nameTransliterated: null,
          year: 5,
        },
      },
    });

    render(<EventCard event={event} />);

    expect(screen.getByText('Derived from the text, not a date')).toBeTruthy();
    expect(screen.getByText(/First/)).toBeTruthy();
  });

  it('shows neither date nor interval when undated with no interval', () => {
    const event = createEvent({
      hijriYear: null,
      interval: undefined,
    });

    render(<EventCard event={event} />);

    expect(screen.queryByText('Derived from the text, not a date')).toBeNull();
    expect(screen.queryByText(/AH/)).toBeNull();
  });

  it('displays location when present', () => {
    const event = createEvent({
      location: 'المدينة',
      locationTransliterated: 'Medina',
    });

    render(<EventCard event={event} />);

    expect(screen.getByText('المدينة')).toBeTruthy();
  });

  it('does not display location when null', () => {
    const event = createEvent({
      location: null,
    });

    render(<EventCard event={event} />);

    expect(screen.queryByText('موقع')).toBeNull();
  });

  it('links to /events/<slug> for event kind', () => {
    const event = createEvent({
      kind: 'event',
      slug: 'badr-battle',
    });

    render(<EventCard event={event} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/events/badr-battle');
  });

  it('links to /battles/<slug> for battle kind', () => {
    const event = createEvent({
      kind: 'battle',
      slug: 'badr-battle',
    });

    render(<EventCard event={event} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/battles/badr-battle');
  });

  it('links to /battles/<slug> for ghazwah kind', () => {
    const event = createEvent({
      kind: 'ghazwah',
      slug: 'ghazwah-badr',
    });

    render(<EventCard event={event} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/battles/ghazwah-badr');
  });

  it('links to /battles/<slug> for sariyyah kind', () => {
    const event = createEvent({
      kind: 'sariyyah',
      slug: 'sariyyah-xyz',
    });

    render(<EventCard event={event} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/battles/sariyyah-xyz');
  });

  it('falls back to Arabic name when nameTransliterated is null', () => {
    const event = createEvent({
      name: 'حدث بدون ترجمة',
      nameTransliterated: null,
    });

    render(<EventCard event={event} />);

    expect(screen.getByText('حدث بدون ترجمة')).toBeTruthy();
  });

  it('applies dark mode styling', () => {
    const event = createEvent({});
    const { container } = render(<EventCard event={event} />);

    const card = container.querySelector('.dark\\:bg-gray-800');
    expect(card).toBeTruthy();
  });

  it('shows shield icon for event', () => {
    const event = createEvent({});
    const { container } = render(<EventCard event={event} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeTruthy();
  });
});
