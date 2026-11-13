// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { buildStory } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import ProphetView from './ProphetView';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/components/common/NavBar', () => ({ NavActions: () => null }));
vi.mock('@/components/common/SettingsHelp', () => ({ SettingsHelp: () => null }));
vi.mock('./PlaceReview', () => ({ useReviewMode: () => false }));
vi.mock('./EventPlaces', () => ({ default: ({ event }: { event: { title: string } }) => <h2>{event.title}</h2> }));
vi.mock('./StoryMap', () => ({ default: () => null }));
vi.mock('../OpenLastProphet', () => ({ rememberProphet: () => {} }));

afterEach(() => { cleanup(); window.history.replaceState(null, '', '/'); });

describe('a prophet story opened from the search', () => {
  it('opens the event in ?event=, found by its title in the kept story', () => {
    Element.prototype.scrollIntoView = vi.fn();
    const all = buildStory(STORIES.musa.events, { names: {}, ayah: () => 'نص' });
    // A kept story without the first event: the place in the full story still finds the right one.
    const kept = all.slice(1).map((event, i) => ({ ...event, n: i + 1 }));
    window.history.replaceState(null, '', '/quran/prophets/musa?event=9');
    render(<ProphetView slug="musa" title="" intro="" phases={STORIES.musa.phases} events={kept} compare={{}} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(STORIES.musa.events[9].title);
  });
});
