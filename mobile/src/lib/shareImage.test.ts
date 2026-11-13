import { afterEach, describe, expect, it, vi } from 'vitest';
import { MODAL_GAP, closeShare, readShare, shareCard, shareCardLater } from './shareImage';

const request = { content: () => null, link: 'https://namaq.vercel.app/quran/branches', onVideo: () => {} };

describe('share as image', () => {
  afterEach(() => { closeShare(); vi.useRealTimers(); });
  it('opens the sheet on a card and closes it', () => {
    expect(readShare()).toBeNull();
    shareCard(request);
    expect(readShare()).toBe(request);
    closeShare();
    expect(readShare()).toBeNull();
  });
  it('waits for a closing sheet before opening', () => {
    vi.useFakeTimers();
    shareCardLater(request);
    expect(readShare()).toBeNull();
    vi.advanceTimersByTime(MODAL_GAP);
    expect(readShare()).toBe(request);
  });
});
