import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Badge from './Badge';

afterEach(cleanup);

describe('Badge', () => {
  it('renders a plain span with no href or onClick', () => {
    render(<Badge text="موضوع" />);
    expect(screen.getByText('موضوع').tagName).toBe('SPAN');
  });

  it('renders a link when given href', () => {
    render(<Badge text="موضوع" href="/x" />);
    expect(screen.getByRole('link').getAttribute('href')).toBe('/x');
  });

  it('renders a button sharing the same classes when given onClick', () => {
    const onClick = vi.fn();
    render(<>
      <Badge text="أ" size="sm" />
      <Badge text="ب" size="sm" onClick={onClick} />
    </>);
    const span = screen.getByText('أ');
    const button = screen.getByRole('button', { name: 'ب' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toBe(span.className);
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
