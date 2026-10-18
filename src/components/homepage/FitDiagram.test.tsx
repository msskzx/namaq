import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import FitDiagram from './FitDiagram';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('fitting complete diagrams', () => {
  it('scales the entire diagram to the available width and reserves its complete height', () => {
    let width = 300;
    let resize = () => {};
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => width);
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: () => void) { resize = callback; }
      observe() {} disconnect() {}
    });
    render(<FitDiagram><span>complete diagram</span></FitDiagram>);
    const content = screen.getByText('complete diagram').parentElement!;
    expect(content.style.transform).toBe('scale(0.5)');
    expect(content.parentElement!.style.height).toBe('200px');
    width = 900;
    act(() => resize());
    expect(content.style.transform).toBe('scale(1)');
    expect(content.parentElement!.style.height).toBe('400px');
    expect(content.style.insetInlineStart).toBe('150px');
  });
});
