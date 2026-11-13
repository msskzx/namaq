// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { shareTarget, shareUrl } from './shareTarget';

describe('shareTarget', () => {
  it('takes the marked part of the card the button sits in', () => {
    document.body.innerHTML = '<div data-share-card id="card"><div data-share-image id="part"></div><div><button id="b"></button></div></div>';
    expect(shareTarget(document.getElementById('b')!)?.id).toBe('part');
  });
  it('takes the whole card when no part is marked, and nothing outside a card', () => {
    document.body.innerHTML = '<section data-share-card id="card"><button id="b"></button></section><button id="lone"></button>';
    expect(shareTarget(document.getElementById('b')!)?.id).toBe('card');
    expect(shareTarget(document.getElementById('lone')!)).toBeNull();
  });
  it('makes the link absolute', () => {
    expect(shareUrl('/quran/branches?tree=x')).toBe(`${window.location.origin}/quran/branches?tree=x`);
    expect(shareUrl()).toBe(window.location.href);
    expect(shareUrl('#c-1-6-4-68')).toBe(`${window.location.href.split('#')[0]}#c-1-6-4-68`);
  });
});
