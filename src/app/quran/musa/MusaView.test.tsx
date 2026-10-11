// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { num } from '@/lib/quran/arabicNumber';
import { buildMusa, MUSA_EVENTS, PHASES } from '@/lib/quran/musa';
import data from './ayat.json';
import MusaView from './MusaView';

afterEach(cleanup);

const events = buildMusa(data);
const list = () => within(screen.getByRole('list', { name: 'أحداث قصة موسى' }));

describe('MusaView', () => {
  it('lists one station per event, in order', () => {
    render(<MusaView events={events} />);
    expect(list().getAllByRole('heading', { level: 2 })).toHaveLength(MUSA_EVENTS.length);
  });

  it('renders every ayah of every event', () => {
    const { container } = render(<MusaView events={events} />);
    const total = events.reduce((t, e) => t + e.count, 0);
    expect(container.querySelectorAll('details p')).toHaveLength(total);
  });

  it('folds every segment until it is opened', () => {
    const { container } = render(<MusaView events={events} />);
    expect([...container.querySelectorAll('details')].some(d => d.open)).toBe(false);
  });

  it('shows the topic of each station in the index', () => {
    render(<MusaView events={events} />);
    const nav = within(screen.getByRole('navigation', { name: 'فهرس المحطات' }));
    for (const e of events) expect(nav.getByText(e.title)).toBeTruthy();
  });

  it('names the phases and counts the totals', () => {
    render(<MusaView events={events} />);
    for (const p of PHASES) expect(screen.getAllByText(p).length).toBeGreaterThan(0);
    const total = events.reduce((n, e) => n + e.count, 0);
    expect(within(screen.getByRole('list', { name: 'ملخص' })).getAllByRole('listitem').map(li => li.textContent)).toEqual([`${num(total)} آية`, `${num(new Set(events.flatMap(e => e.segments.map(g => g.surah))).size)} سورة`]);
  });

  it('jumps to a station from the index', () => {
    const { container } = render(<MusaView events={events} />);
    const into = vi.fn();
    (container.querySelector('[data-event="3"]') as HTMLElement).scrollIntoView = into;
    fireEvent.click(screen.getByRole('button', { name: events[2].title }));
    expect(into).toHaveBeenCalledOnce();
    expect(into.mock.calls[0][0]).toMatchObject({ inline: 'center', block: 'start' });
  });

  it('scrolls the track with the buttons', () => {
    const { container } = render(<MusaView events={events} />);
    const track = container.querySelector('[data-timeline-track]') as HTMLElement;
    const by = vi.fn();
    track.scrollBy = by;
    fireEvent.click(screen.getByRole('button', { name: /التالي/ }));
    fireEvent.click(screen.getByRole('button', { name: /السابق/ }));
    expect(by.mock.calls.map(c => Math.sign(c[0].left))).toEqual([-1, 1]);
  });
});
