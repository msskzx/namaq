// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import GrowVideo, { openVideo } from './GrowVideo';

const growth = vi.hoisted(() => ({ mode: 'watch', status: 'playing', at: 0, total: 1, left: 1 }));
vi.mock('./Grow', () => ({
  askLeft: () => growth.left,
  growRoot: () => document.querySelector('[data-node]'),
  growthState: () => growth,
  useGrowth: () => growth,
  pause: vi.fn(), play: vi.fn(), stop: vi.fn(),
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('exports without a title or URL, uses the plural prompt, and follows live path colors', () => {
  let frame: FrameRequestCallback = () => {};
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frame = callback; return 1; });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('MediaRecorder', class {
    static isTypeSupported() { return true; }
    state = 'inactive';
    start() {}
    stop() {}
  });
  HTMLDialogElement.prototype.showModal = vi.fn();
  vi.stubGlobal('Path2D', class { constructor(public path: string) {} });
  const fillText = vi.fn();
  const colors: string[] = [];
  const stroke = vi.fn(() => { colors.push(context.strokeStyle); });
  const context = { save: vi.fn(), restore: vi.fn(), fillRect: vi.fn(), translate: vi.fn(), scale: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), roundRect: vi.fn(), fill: vi.fn<(path?: unknown) => void>(), setLineDash: vi.fn(), fillText, stroke, strokeStyle: '', fillStyle: '' };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  HTMLCanvasElement.prototype.captureStream = () => ({ getTracks: () => [] }) as unknown as MediaStream;
  render(<><div data-tree-content><div data-node="n-1" style={{ opacity: 1 }} /><span aria-hidden="true" data-line style={{ opacity: 1, borderTop: '2px solid rgb(1, 2, 3)' }} /></div><GrowVideo /></>);
  act(() => openVideo());
  act(() => frame(0));
  expect(fillText).not.toHaveBeenCalled();
  expect(stroke).toHaveBeenCalled();
  expect(colors).toContain('rgb(1, 2, 3)');
  const line = document.querySelector<HTMLElement>('[data-line]')!;
  line.style.borderTopColor = 'rgb(4, 5, 6)';
  growth.mode = 'ask';
  act(() => frame(30));
  expect(colors).toContain('rgb(4, 5, 6)');
  expect(fillText.mock.calls.map(call => call[0])).toEqual(['اكمل الايات']);
  const node = document.querySelector<HTMLElement>('[data-node]')!;
  node.setAttribute('data-ask', '');
  node.setAttribute('data-left', '٣');
  node.style.borderStyle = 'solid';
  const fill = context.fill;
  act(() => frame(60));
  expect(fillText.mock.calls.at(-1)?.[0]).toBe('٣');
  const full = fill.mock.calls.map(call => call[0]).filter(Boolean);
  growth.left = 0.3;
  node.setAttribute('data-left', '١');
  act(() => frame(90));
  const drained = fill.mock.calls.map(call => call[0]).filter(Boolean).slice(-2);
  expect(drained).not.toEqual(full.slice(-2));
  expect(fillText.mock.calls.at(-1)?.[0]).toBe('١');
  expect(context.setLineDash).not.toHaveBeenCalledWith([4, 3]);
  expect(fillText.mock.calls.map(call => call[0])).not.toContain('؟');

});
