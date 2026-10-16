import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Toggle from './Toggle';

describe('Toggle', () => {
  afterEach(cleanup);

  it('exposes a labelled switch that reflects checked', () => {
    render(<Toggle label="Dark mode" checked onChange={() => {}} />);
    expect((screen.getByRole('switch', { name: 'Dark mode' }) as HTMLInputElement).checked).toBe(true);
  });

  it('reports the new state on click', () => {
    const onChange = vi.fn();
    render(<Toggle label="Dark mode" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole('switch', { name: 'Dark mode' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('disables the switch', () => {
    render(<Toggle label="Dark mode" checked={false} disabled onChange={() => {}} />);
    expect((screen.getByRole('switch', { name: 'Dark mode' }) as HTMLInputElement).disabled).toBe(true);
  });

  it('draws a larger switch with icons when size is lg', () => {
    const { container } = render(<Toggle label="Pairs" checked={false} onChange={() => {}} size="lg" offIcon={<i />} onIcon={<i />} />);
    expect(container.querySelector('label')?.className).toContain('h-9 w-[68px]');
  });
});
