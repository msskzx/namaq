// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { num } from '@/lib/quran/arabicNumber';
import { MUSA } from '@/lib/quran/prophets/musa';
import { buildStory } from '@/lib/quran/prophets/story';
import { AYAT } from '../ayat';
import ProphetView from './ProphetView';

afterEach(cleanup);

const events = buildStory(MUSA.events, AYAT.musa);
const view = () => render(<ProphetView name="موسى" phases={MUSA.phases} events={events} />);
const list = () => within(screen.getByRole('list', { name: 'أحداث قصة موسى' }));

describe('ProphetView', () => {
  it('lists one station per event, in order', () => {
    view();
    expect(list().getAllByRole('heading', { level: 3 }).map(h => h.textContent)).toEqual(MUSA.events.map(e => e.title));
  });

  it('renders every ayah of every event', () => {
    const { container } = view();
    const total = events.reduce((t, e) => t + e.count, 0);
    expect(container.querySelectorAll('details p')).toHaveLength(total);
  });

  it('folds every segment until it is opened', () => {
    const { container } = view();
    expect([...container.querySelectorAll('details')].some(d => d.open)).toBe(false);
  });

  it('shows the topic of each station in the index, under its phase', () => {
    view();
    const nav = within(screen.getByRole('navigation', { name: 'فهرس المحطات' }));
    expect(nav.getAllByRole('heading', { level: 2 }).map(h => h.firstChild?.textContent)).toEqual([...MUSA.phases]);
    for (const e of events) expect(nav.getByText(e.title)).toBeTruthy();
  });

  it('counts the stations, ayat and surahs', () => {
    view();
    const total = events.reduce((n, e) => n + e.count, 0);
    const surahs = new Set(events.flatMap(e => e.segments.map(g => g.surah))).size;
    expect(within(screen.getByRole('list', { name: 'ملخص' })).getAllByRole('listitem').map(li => li.textContent)).toEqual([
      `${num(events.length)} محطة`,
      `${num(total)} آية`,
      `${num(surahs)} سورة`,
    ]);
  });

  it('jumps to a station from the index and marks it', () => {
    const { container } = view();
    const into = vi.fn();
    (container.querySelector('[data-event="3"]') as HTMLElement).scrollIntoView = into;
    const chip = screen.getByRole('button', { name: events[2].title });
    fireEvent.click(chip);
    expect(into).toHaveBeenCalledOnce();
    expect(into.mock.calls[0][0]).toMatchObject({ inline: 'center', block: 'start' });
    expect(chip.getAttribute('aria-current')).toBe('true');
  });

  it('scrolls the track with the buttons', () => {
    const { container } = view();
    const track = container.querySelector('[data-timeline-track]') as HTMLElement;
    const by = vi.fn();
    track.scrollBy = by;
    fireEvent.click(screen.getByRole('button', { name: /التالي/ }));
    fireEvent.click(screen.getByRole('button', { name: /السابق/ }));
    expect(by.mock.calls.map(c => Math.sign(c[0].left))).toEqual([-1, 1]);
  });
});
