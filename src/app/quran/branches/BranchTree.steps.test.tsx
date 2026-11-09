// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import BranchTree from './BranchTree';
import TreeSteps from './TreeSteps';

vi.mock('@/components/common/MushafText', () => ({ default: ({ children }: { children: React.ReactNode }) => children }));
const lang = vi.hoisted(() => ({ language: 'ar' as 'ar' | 'en' }));
vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: lang.language }) }));
const { replace, prefetch, search } = vi.hoisted(() => ({ replace: vi.fn(), prefetch: vi.fn(), search: { params: new URLSearchParams() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, prefetch }), useSearchParams: () => search.params }));

type Props = React.ComponentProps<typeof BranchTree> & { steps?: React.ComponentProps<typeof TreeSteps>['steps'] | null };

beforeEach(() => {
  lang.language = 'ar';
  search.params = new URLSearchParams();
  prefetch.mockClear();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.body.innerHTML = ''; });

const tree = {
  words: ['إِنَّ', 'ٱلْمُتَّقِينَ', 'فِى'],
  ayat: [],
  children: [
    { words: ['جَنَّـٰتٍۢ', 'وَعُيُونٍ'], ayat: ['15:45', '51:15'], children: [] },
    { words: ['مَقَامٍ', 'أَمِينٍۢ'], ayat: ['44:51'], children: [] },
  ],
};

const steps = { previous: '/quran/branches?juz=2&tree=2', next: '/quran/branches?juz=2&tree=4', position: 3, total: 120 };
const AR = { previous: 'الشجرة السابقة', next: 'الشجرة التالية', nav: 'التنقل بين الأشجار' };
const EN = { previous: 'Previous tree', next: 'Next tree', nav: 'Tree navigation' };

function renderTree({ steps: given = steps, ...props }: Partial<Props> = {}) {
  return render(<>{given && <TreeSteps steps={given} />}<BranchTree tree={tree} names={{}} steppable={given ? { next: !!given.next, previous: !!given.previous } : false} {...props} /></>);
}

function recordStepClicks(names: { previous: string; next: string }) {
  const clicks: string[] = [];
  const record = (name: string, step: string) => {
    screen.getByRole('link', { name }).addEventListener('click', event => {
      event.preventDefault();
      clicks.push(step);
    });
  };
  record(names.previous, 'previous');
  record(names.next, 'next');
  return clicks;
}

function swipeBy(viewport: Element, dx: number, dy: number) {
  const start = { clientX: 200, clientY: 200 };
  fireEvent.touchStart(viewport, { touches: [start] });
  fireEvent.touchMove(viewport, { touches: [{ clientX: 200 + dx / 2, clientY: 200 + dy / 2 }] });
  fireEvent.touchMove(viewport, { touches: [{ clientX: 200 + dx, clientY: 200 + dy }] });
  fireEvent.touchEnd(viewport, { touches: [], changedTouches: [{ clientX: 200 + dx, clientY: 200 + dy }] });
}

describe('BranchTree steps in Arabic', () => {
  it('renders the next control as a disabled button, not a link, when there is no next tree', () => {
    renderTree({ steps: { previous: steps.previous, position: 120, total: 120 } });
    const next = screen.getByRole('button', { name: AR.next }) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    expect(screen.queryByRole('link', { name: AR.next })).toBeNull();
    expect((screen.getByRole('link', { name: AR.previous }) as HTMLAnchorElement).getAttribute('href')).toBe(steps.previous);
  });

  it('steps to the next tree on ArrowLeft', () => {
    renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(clicks).toEqual(['next']);
  });

  it('steps to the previous tree on ArrowRight', () => {
    renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(clicks).toEqual(['previous']);
  });

  it.each(['ctrlKey', 'metaKey', 'altKey', 'shiftKey'] as const)('ignores both arrow keys held with %s', modifier => {
    renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.keyDown(window, { key: 'ArrowLeft', [modifier]: true });
    fireEvent.keyDown(window, { key: 'ArrowRight', [modifier]: true });
    expect(clicks).toEqual([]);
  });

  it.each(['input', 'textarea', 'select'] as const)('ignores arrow keys whose target is a <%s> field', element => {
    renderTree();
    const clicks = recordStepClicks(AR);
    const field = document.createElement(element);
    document.body.appendChild(field);
    fireEvent.keyDown(field, { key: 'ArrowLeft', bubbles: true });
    fireEvent.keyDown(field, { key: 'ArrowRight', bubbles: true });
    expect(clicks).toEqual([]);
  });

  it('ignores arrow keys while a dialog is open', () => {
    renderTree();
    const clicks = recordStepClicks(AR);
    const dialog = document.createElement('dialog');
    document.body.appendChild(dialog);
    dialog.showModal();
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(clicks).toEqual([]);
  });

  it('ignores arrow keys another handler already took', () => {
    renderTree();
    const clicks = recordStepClicks(AR);
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    event.preventDefault();
    window.dispatchEvent(event);
    expect(clicks).toEqual([]);
  });

  it('ignores arrow keys once the tree is zoomed in', () => {
    renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.click(screen.getByRole('button', { name: 'تكبير' }));
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(clicks).toEqual([]);
  });

  it('steps to the next tree on a 100px swipe to the right', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    swipeBy(container.querySelector('[data-tree-viewport]')!, 100, 5);
    expect(clicks).toEqual(['next']);
  });

  it('steps to the previous tree on a 100px swipe to the left', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    swipeBy(container.querySelector('[data-tree-viewport]')!, -100, 5);
    expect(clicks).toEqual(['previous']);
  });
});

describe('BranchTree steps in English', () => {
  beforeEach(() => { lang.language = 'en'; });

  it('steps to the next tree on ArrowRight', () => {
    renderTree();
    const clicks = recordStepClicks(EN);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(clicks).toEqual(['next']);
  });

  it('steps to the previous tree on ArrowLeft', () => {
    renderTree();
    const clicks = recordStepClicks(EN);
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(clicks).toEqual(['previous']);
  });

  it('steps to the next tree on a 100px swipe to the left', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(EN);
    swipeBy(container.querySelector('[data-tree-viewport]')!, -100, 5);
    expect(clicks).toEqual(['next']);
  });

  it('steps to the previous tree on a 100px swipe to the right', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(EN);
    swipeBy(container.querySelector('[data-tree-viewport]')!, 100, 5);
    expect(clicks).toEqual(['previous']);
  });
});

describe('BranchTree slide', () => {
  it('drags the tree with the finger and slides back on a short swipe', () => {
    vi.useFakeTimers();
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    const viewport = container.querySelector('[data-tree-viewport]')!;
    const lane = container.querySelector<HTMLElement>('[data-tree-lane]')!;
    fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(viewport, { touches: [{ clientX: 230, clientY: 201 }] });
    expect(lane.style.transform).toBe('translate3d(30px, 0, 0)');
    fireEvent.touchEnd(viewport, { touches: [], changedTouches: [{ clientX: 230, clientY: 201 }] });
    expect(lane.hasAttribute('data-sliding')).toBe(true);
    vi.advanceTimersByTime(300);
    expect(lane.style.transform).toBe('');
    expect(clicks).toEqual([]);
    vi.useRealTimers();
  });

  it('pulls only a quarter of the way towards a side with no tree', () => {
    const { container } = renderTree({ steps: { previous: steps.previous, position: 120, total: 120 } });
    const viewport = container.querySelector('[data-tree-viewport]')!;
    fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(viewport, { touches: [{ clientX: 280, clientY: 200 }] });
    expect(container.querySelector<HTMLElement>('[data-tree-lane]')!.style.transform).toBe('translate3d(20px, 0, 0)');
  });

  it('shows the neighbouring trees as strips at the sides that open them', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.click(container.querySelector('[data-tree-edge="next"]')!);
    // One step at a time: a second press while the first tree is still leaving does nothing.
    fireEvent.click(container.querySelector('[data-tree-edge="previous"]')!);
    expect(clicks).toEqual(['next']);
  });

  it('opens the previous tree from its strip', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.click(container.querySelector('[data-tree-edge="previous"]')!);
    expect(clicks).toEqual(['previous']);
  });

  it('ignores the click a strip gets when a swipe ends on it', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    const strip = container.querySelector('[data-tree-edge="previous"]')!;
    fireEvent.touchStart(strip, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchMove(strip, { touches: [{ clientX: 220, clientY: 200 }] });
    fireEvent.touchEnd(strip, { touches: [], changedTouches: [{ clientX: 220, clientY: 200 }] });
    fireEvent.click(strip);
    expect(clicks).toEqual([]);
  });
});

describe('BranchTree swipe gestures that do not step', () => {
  it('ignores a mostly vertical swipe of 30px across and 120px down', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    swipeBy(container.querySelector('[data-tree-viewport]')!, 30, 120);
    expect(clicks).toEqual([]);
  });

  it('ignores a short swipe of 20px', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    swipeBy(container.querySelector('[data-tree-viewport]')!, 20, 0);
    expect(clicks).toEqual([]);
  });

  it('ignores a long horizontal swipe once the tree is zoomed in', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    fireEvent.click(screen.getByRole('button', { name: 'تكبير' }));
    swipeBy(container.querySelector('[data-tree-viewport]')!, 100, 0);
    expect(clicks).toEqual([]);
  });

  it('ignores a gesture that starts with two fingers down', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    const viewport = container.querySelector('[data-tree-viewport]')!;
    fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 200 }, { clientX: 260, clientY: 200 }] });
    fireEvent.touchEnd(viewport, { touches: [], changedTouches: [{ clientX: 300, clientY: 200 }] });
    expect(clicks).toEqual([]);
  });

  it('ignores a one-finger gesture that a second finger joins before it ends', () => {
    const { container } = renderTree();
    const clicks = recordStepClicks(AR);
    const viewport = container.querySelector('[data-tree-viewport]')!;
    fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 200 }] });
    fireEvent.touchStart(viewport, { touches: [{ clientX: 200, clientY: 200 }, { clientX: 260, clientY: 200 }] });
    fireEvent.touchEnd(viewport, { touches: [], changedTouches: [{ clientX: 300, clientY: 200 }] });
    expect(clicks).toEqual([]);
  });
});

describe('BranchTree steps and the surrounding ayat', () => {
  const contextOf = (name: string) => new URL(within(screen.getByRole('navigation', { name: AR.nav })).getByRole('link', { name }).getAttribute('href')!, 'http://localhost').searchParams.get('c');

  it('leaves the surrounding ayat off in the step links while the page has them off', () => {
    renderTree({ steps: { ...steps, next: `${steps.next}&c=1` } });
    expect(contextOf(AR.next)).toBeNull();
    expect(contextOf(AR.previous)).toBeNull();
  });

  it('turns the surrounding ayat on in the step links while the page has them on', () => {
    search.params = new URLSearchParams('c=1');
    renderTree();
    expect(contextOf(AR.next)).toBe('1');
    expect(contextOf(AR.previous)).toBe('1');
  });
});
