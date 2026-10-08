// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import DerivedInterval from './DerivedInterval';
import type { DerivedInterval as Interval } from '@/lib/timeline';

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('DerivedInterval', () => {
  afterEach(() => cleanup());

  const interval: Interval = {
    from: {
      slug: 'first-event',
      kind: 'event',
      name: 'الحدث الأول',
      nameTransliterated: 'First Event',
      year: 5,
    },
    to: {
      slug: 'second-event',
      kind: 'event',
      name: 'الحدث الثاني',
      nameTransliterated: 'Second Event',
      year: 10,
    },
  };

  it('renders interval text with badge in Arabic', () => {
    render(<DerivedInterval interval={interval} language="ar" />);

    expect(screen.getByText(/بين/)).toBeTruthy();
    expect(screen.getByText('مشتق من النص، وليس تاريخًا')).toBeTruthy();
  });

  it('renders interval text with badge in English', () => {
    render(<DerivedInterval interval={interval} language="en" />);

    expect(screen.getByText(/Between/)).toBeTruthy();
    expect(screen.getByText('Derived from the text, not a date')).toBeTruthy();
  });

  it('renders premise names as plain text when linked is false', () => {
    render(<DerivedInterval interval={interval} language="en" linked={false} />);

    const span = screen.getByText('First Event, Second Event');
    expect(span).toBeTruthy();
    expect(span.tagName).toBe('SPAN');
  });

  it('renders premise names as Arabic with comma separator when linked is false', () => {
    render(<DerivedInterval interval={interval} language="ar" linked={false} />);

    const span = screen.getByText('الحدث الأول، الحدث الثاني');
    expect(span).toBeTruthy();
    expect(span.tagName).toBe('SPAN');
  });

  it('renders premise events as links when linked is true', () => {
    render(<DerivedInterval interval={interval} language="en" linked={true} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('/events/first-event');
    expect(links[1].getAttribute('href')).toBe('/events/second-event');
  });

  it('links to battles when the kind is battle', () => {
    const battleInterval: Interval = {
      from: {
        slug: 'battle-one',
        kind: 'battle',
        name: 'معركة الأولى',
        nameTransliterated: 'Battle One',
        year: 5,
      },
    };

    render(<DerivedInterval interval={battleInterval} language="en" linked={true} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/battles/battle-one');
  });

  it('uses nameTransliterated when displaying links', () => {
    render(<DerivedInterval interval={interval} language="en" linked={true} />);

    const links = screen.getAllByRole('link');
    expect(links[0].textContent).toBe('First Event');
    expect(links[1].textContent).toBe('Second Event');
  });

  it('falls back to Arabic name when nameTransliterated is null', () => {
    const arabicOnly: Interval = {
      from: {
        slug: 'event-a',
        kind: 'event',
        name: 'حدث عربي',
        nameTransliterated: null,
        year: 5,
      },
    };

    render(<DerivedInterval interval={arabicOnly} language="en" linked={true} />);

    const link = screen.getByRole('link');
    expect(link.textContent).toBe('حدث عربي');
  });

  it('renders only from bound when to is undefined', () => {
    const fromOnly: Interval = {
      from: {
        slug: 'first-event',
        kind: 'event',
        name: 'الأول',
        nameTransliterated: 'First',
        year: 5,
      },
    };

    render(<DerivedInterval interval={fromOnly} language="en" linked={false} />);

    expect(screen.getByText('First')).toBeTruthy();
  });

  it('renders only to bound when from is undefined', () => {
    const toOnly: Interval = {
      to: {
        slug: 'second-event',
        kind: 'event',
        name: 'الثاني',
        nameTransliterated: 'Second',
        year: 10,
      },
    };

    render(<DerivedInterval interval={toOnly} language="en" linked={false} />);

    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('returns null when interval has no bounds', () => {
    const { container } = render(<DerivedInterval interval={{}} language="en" />);

    expect(container.firstChild).toBeNull();
  });

  it('applies calendar icon styling', () => {
    const { container } = render(<DerivedInterval interval={interval} language="en" />);

    const icon = container.querySelector('svg');
    expect(icon).toBeTruthy();
  });

  it('applies amber color scheme', () => {
    const { container } = render(<DerivedInterval interval={interval} language="en" />);

    const wrapper = container.querySelector('.text-amber-600');
    expect(wrapper).toBeTruthy();
  });

  it('applies dark mode styling', () => {
    const { container } = render(<DerivedInterval interval={interval} language="en" />);

    const wrapper = container.querySelector('.dark\\:text-amber-400');
    expect(wrapper).toBeTruthy();
  });
});
