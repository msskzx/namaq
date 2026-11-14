// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import GrowVideo, { openVideo } from './GrowVideo';

const growth = vi.hoisted(() => ({ mode: 'watch', status: 'playing', at: 0, total: 1, left: 1 }));
vi.mock('./Grow', () => ({
  askLeft: () => growth.left,
  growRoot: () => document.querySelector('[data-matrix-content], [data-node]'),
  growthState: () => growth,
  useGrowth: () => growth,
  openStudio: vi.fn(), pause: vi.fn(), play: vi.fn(), stop: vi.fn(),
}));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));

afterEach(() => { document.documentElement.style.removeProperty('--home-green'); cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function setupVideo() {
  growth.mode = 'watch';
  growth.left = 1;
  let frame: FrameRequestCallback = () => {};
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frame = callback; return 1; });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('MediaRecorder', class {
    static isTypeSupported() { return true; }
    state = 'inactive';
    start() {}
    stop() {}
  });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  vi.stubGlobal('Path2D', class { constructor(public path: string) {} });
  const drawnWords: { text: string; color: string; font: string }[] = [];
  const fillText = vi.fn<(text: string, x?: number, y?: number, maxWidth?: number) => void>(text => { drawnWords.push({ text, color: context.fillStyle, font: context.font }); });
  const colors: string[] = [];
  const stroke = vi.fn<(path?: unknown) => void>(() => { colors.push(context.strokeStyle); });
  const context = { save: vi.fn(), restore: vi.fn(), fillRect: vi.fn(), translate: vi.fn(), scale: vi.fn(), beginPath: vi.fn(), moveTo: vi.fn(), lineTo: vi.fn(), roundRect: vi.fn(), arc: vi.fn(), fill: vi.fn<(path?: unknown) => void>(), setLineDash: vi.fn(), fillText, stroke, strokeStyle: '', fillStyle: '', lineDashOffset: 0, font: '', measureText: vi.fn((text: string) => ({ width: text.length * 16 })) };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context as unknown as CanvasRenderingContext2D);
  HTMLCanvasElement.prototype.captureStream = () => ({ getTracks: () => [] }) as unknown as MediaStream;
  return { context, fillText, drawnWords, colors, stroke, tick: (time: number) => act(() => frame(time)) };
}

it('exports without a title or URL, uses the plural prompt, and follows live path colors', () => {
  const { context, fillText, colors, stroke, tick } = setupVideo();
  document.documentElement.style.setProperty('--home-green', '#4b644a');
  const fills: string[] = [];
  context.fill.mockImplementation(() => { fills.push(context.fillStyle); });
  render(<><div data-tree-content><div data-node="n-1" style={{ opacity: 1 }} /><span aria-hidden="true" data-line style={{ opacity: 1, borderTop: '2px solid rgb(1, 2, 3)' }} /></div><GrowVideo /></>);
  act(() => openVideo());
  tick(0);
  expect(fillText).not.toHaveBeenCalled();
  expect(fills).toContain('#4b644a');
  expect(stroke).toHaveBeenCalled();
  expect(colors).toContain('rgb(1, 2, 3)');
  const line = document.querySelector<HTMLElement>('[data-line]')!;
  line.style.borderTopColor = 'rgb(4, 5, 6)';
  growth.mode = 'ask';
  tick(30);
  expect(colors).toContain('rgb(4, 5, 6)');
  expect(fillText.mock.calls.map(call => call[0])).toEqual(['اكمل الايات']);
  const node = document.querySelector<HTMLElement>('[data-node]')!;
  node.setAttribute('data-ask', '');
  node.setAttribute('data-left', '٣');
  node.style.borderStyle = 'solid';
  const fill = context.fill;
  tick(60);
  expect(fillText.mock.calls.at(-1)?.[0]).toBe('٣');
  const full = fill.mock.calls.map(call => call[0]).filter(Boolean);
  growth.left = 0.3;
  node.setAttribute('data-left', '١');
  tick(90);
  const drained = fill.mock.calls.map(call => call[0]).filter(Boolean).slice(-2);
  expect(drained).not.toEqual(full.slice(-2));
  expect(fillText.mock.calls.at(-1)?.[0]).toBe('١');
  expect(context.setLineDash).not.toHaveBeenCalledWith([4, 3]);
  expect(fillText.mock.calls.map(call => call[0])).not.toContain('؟');

});

it('exports curved tree links at their SVG origins, tracks growth, and omits hidden legacy lines', () => {
  const { context, colors, stroke, tick } = setupVideo();
  const rect = (left: number, top: number, width: number, height: number) => ({ left, top, right: left + width, bottom: top + height, x: left, y: top, width, height, toJSON: () => ({}) });
  render(<><div data-tree-content>
    <div data-node="n-1" style={{ opacity: 1, backgroundColor: 'rgb(20, 30, 40)', borderRadius: '6px 12px' }} />
    <span aria-hidden="true" data-line style={{ opacity: 1, visibility: 'hidden', borderTop: '2px solid rgb(9, 8, 7)' }} />
    <span aria-hidden="true" data-stem style={{ opacity: 1, visibility: 'hidden', borderLeft: '2px solid rgb(9, 8, 7)' }} />
    <span aria-hidden="true" data-line style={{ opacity: 1, borderTop: '2px solid rgb(3, 2, 1)' }} />
    <svg data-tree-links><path d="M 0 0 C 0 10, 20 10, 20 20" pathLength="1" style={{ opacity: 1, stroke: 'rgb(1, 2, 3)', strokeWidth: 2, strokeDashoffset: 0.5 }} /></svg>
  </div><GrowVideo /></>);
  const content = document.querySelector<HTMLElement>('[data-tree-content]')!;
  content.getBoundingClientRect = () => rect(100, 100, 800, 400);
  Object.defineProperties(content, { offsetWidth: { value: 400 }, offsetHeight: { value: 200 } });
  document.querySelector('svg[data-tree-links]')!.getBoundingClientRect = () => rect(300, 200, 200, 100);
  const path = document.querySelector<SVGPathElement>('[data-tree-links] path')!;
  path.getTotalLength = () => 100;
  const progress: number[] = [];
  const strokes = stroke.getMockImplementation()!;
  stroke.mockImplementation(curve => { if (curve) progress.push(context.lineDashOffset); strokes(curve); });
  const fills: string[] = [];
  context.fill.mockImplementation(() => { fills.push(context.fillStyle); });
  act(() => openVideo());
  tick(0);
  expect(stroke.mock.calls.some(([curve]) => (curve as { path?: string } | undefined)?.path === path.getAttribute('d'))).toBe(true);
  expect(context.translate).toHaveBeenCalledWith(100, 50);
  expect(progress).toEqual([50]);
  expect(colors).toContain('rgb(1, 2, 3)');
  expect(colors).toContain('rgb(3, 2, 1)');
  expect(colors).not.toContain('rgb(9, 8, 7)');
  expect(fills).toContain('rgb(20, 30, 40)');
  path.style.strokeDashoffset = '0.25';
  tick(30);
  expect(progress).toEqual([50, 25]);
  path.setAttribute('data-hide', '');
  tick(60);
  expect(progress).toEqual([50, 25]);
});

it('draws a node\'s ayah tab as a rounded frame in the node\'s fill, and leaves the top-down header bare', () => {
  const { context, colors, tick } = setupVideo();
  render(<><div data-tree-content>
    <div data-node="n-1" style={{ opacity: 1, backgroundColor: 'rgb(20, 30, 40)' }}><span data-tab style={{ border: '1px solid rgb(7, 7, 7)', borderRadius: '8px' }} /></div>
    <div data-node="n-2" style={{ opacity: 1 }}><span data-tab style={{ borderBottom: '1px solid rgb(6, 6, 6)' }} /></div>
  </div><GrowVideo /></>);
  act(() => openVideo());
  tick(0);
  expect(colors).toContain('rgb(7, 7, 7)');
  expect(colors).not.toContain('rgb(6, 6, 6)');
  expect(context.roundRect.mock.calls.some(call => call[4] === 8)).toBe(true);
});

it('exports only the current matrix column, draws its live SVG curves and countdown, and renders its timer', () => {
  const { context, fillText, drawnWords, stroke, tick } = setupVideo();
  const rect = (x: number, y: number, width: number, height: number) => ({ x, y, left: x, top: y, right: x + width, bottom: y + height, width, height, toJSON: () => ({}) });
  Range.prototype.getBoundingClientRect = () => rect(410, 20, 40, 20);
  render(<><div data-matrix-content>
    <div data-col="0"><article>Hidden column</article></div>
    <div data-col="1" data-current><article style={{ opacity: 1 }}>Visible ayah</article></div>
    <svg data-word-connectors data-connection-group="test-group"><g data-connection><path d="M 420 40 C 420 60, 440 60, 440 80" style={{ stroke: 'rgb(2, 3, 4)', strokeWidth: 1.25, strokeDashoffset: 0.5 }} /></g></svg>
  </div><div data-connection-legend="test-group">
    <span><button data-connection-chip="order" aria-pressed="true" style={{ backgroundColor: 'rgb(2, 3, 4)', color: 'rgb(240, 230, 210)', fontFamily: 'Amiri', fontWeight: 700 }}>تقديم وتأخير</button><span data-connection-words style={{ fontFamily: 'Amiri', fontWeight: 400 }}>شفاعة / عدل</span></span>
    <span><button data-connection-chip="word" aria-pressed="true" style={{ backgroundColor: 'rgb(50, 60, 70)', color: 'rgb(240, 230, 210)' }}>إبدال كلمة</button><span data-connection-words>يؤخذ منها / تنفعها</span></span>
    <button data-connection-chip="particle" aria-pressed="false">Inactive chip</button>
  </div><div data-connection-legend="other-group"><button data-connection-chip="word" aria-pressed="true">Other group</button></div><GrowVideo /></>);
  const lane = document.querySelector<HTMLElement>('[data-matrix-content]')!;
  lane.getBoundingClientRect = () => rect(0, 0, 1000, 300);
  Object.defineProperty(lane, 'offsetWidth', { value: 1000 });
  const article = document.querySelector<HTMLElement>('[data-current] article')!;
  article.getBoundingClientRect = () => rect(400, 0, 300, 200);
  const path = document.querySelector<SVGPathElement>('[data-connection] path')!;
  path.getTotalLength = () => 100;
  act(() => openVideo());
  tick(0);
  expect(fillText.mock.calls.map(call => call[0])).toContain('Visible');
  expect(fillText.mock.calls.map(call => call[0])).not.toContain('Hidden');
  expect(drawnWords).toEqual(expect.arrayContaining([expect.objectContaining({ text: 'تقديم وتأخير', color: 'rgb(240, 230, 210)', font: '700 30px Amiri' }), expect.objectContaining({ text: 'إبدال كلمة', color: 'rgb(240, 230, 210)' }), expect.objectContaining({ text: 'شفاعة / عدل', font: '400 30px Amiri' })]));
  expect(fillText.mock.calls.map(call => call[0])).not.toContain('Inactive chip');
  expect(fillText.mock.calls.map(call => call[0])).not.toContain('Other group');
  expect(context.translate).toHaveBeenCalledWith(-400, 0);
  expect(fillText.mock.calls.map(call => call[0])).toContain('شفاعة / عدل');
  expect(fillText.mock.calls.map(call => call[0])).toContain('يؤخذ منها / تنفعها');
  const diagramBottom = context.translate.mock.calls[0][1] + 200 * context.scale.mock.calls[0][0];
  expect(fillText.mock.calls.find(call => call[0] === 'تقديم وتأخير')?.[2]).toBeGreaterThan(diagramBottom);
  expect(context.setLineDash).toHaveBeenCalledWith([100]);
  expect(stroke.mock.calls.length).toBeGreaterThan(0);
  const drawPath = stroke.mock.calls.find(call => call.length > 0);
  expect(drawPath).toBeTruthy();
  const curveCall = stroke.mock.calls.findIndex(call => call.length > 0);
  expect(stroke.mock.invocationCallOrder[curveCall]).toBeGreaterThan(fillText.mock.invocationCallOrder[fillText.mock.calls.findIndex(call => call[0] === 'Visible')]);
  const prompt = document.createElement('div');
  prompt.setAttribute('data-matrix-prompt', '');
  prompt.setAttribute('data-ask', '');
  prompt.setAttribute('data-left', '١');
  prompt.style.left = '430px';
  prompt.style.top = '100px';
  lane.append(prompt);
  growth.mode = 'ask';
  tick(30);
  expect(fillText.mock.calls.map(call => call[0])).toContain('تذكّر الرابط');
  expect(fillText.mock.calls.map(call => call[0])).toContain('١');
  path.style.strokeDashoffset = '0';
  tick(60);
  expect(context.lineDashOffset).toBe(0);
});

it('places the same colored chips and their words below a tree, including initially inactive chips', () => {
  const { context, fillText, drawnWords, tick } = setupVideo();
  render(<><div data-connection-group="tree-group"><div data-tree-content><div data-node="n-1" style={{ opacity: 1 }} /></div></div>
    <div data-connection-legend="tree-group"><span>
      <button data-connection-chip="order" aria-pressed="false" style={{ color: 'rgb(2, 3, 4)' }}>تقديم وتأخير</button>
      <span data-connection-words style={{ fontFamily: 'Amiri', fontWeight: 400 }}>شفاعة / عدل</span>
    </span></div><GrowVideo /></>);
  const root = document.querySelector<HTMLElement>('[data-tree-content]')!;
  Object.defineProperties(root, { offsetWidth: { value: 300 }, offsetHeight: { value: 200 } });
  act(() => openVideo());
  tick(0);
  expect(fillText.mock.calls.map(call => call[0])).toContain('تقديم وتأخير');
  expect(fillText.mock.calls.map(call => call[0])).toContain('شفاعة / عدل');
  const diagramBottom = context.translate.mock.calls[0][1] + 200 * context.scale.mock.calls[0][0];
  expect(fillText.mock.calls.find(call => call[0] === 'تقديم وتأخير')?.[2]).toBeGreaterThan(diagramBottom);
  expect(drawnWords.find(word => word.text === 'شفاعة / عدل')).toBeTruthy();
});

it('waits for page fonts before measuring and recording', async () => {
  const { context, tick } = setupVideo();
  let ready: () => void = () => {};
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: new Promise<void>(resolve => { ready = resolve; }) } });
  try {
    render(<><div data-tree-content><div data-node="n-1" style={{ opacity: 1 }} /></div><GrowVideo /></>);
    act(() => openVideo());
    tick(0);
    expect(context.fillRect).not.toHaveBeenCalled();
    await act(async () => { ready(); });
    tick(16);
    expect(context.fillRect).toHaveBeenCalled();
  } finally { Reflect.deleteProperty(document, 'fonts'); }
});
