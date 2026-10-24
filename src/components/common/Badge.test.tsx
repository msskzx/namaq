import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Badge from './Badge';

afterEach(cleanup);

describe('Badge', () => {
  it('renders a link when given href', () => {
    render(<Badge text="موضوع" href="/x" />);
    expect(screen.getByRole('link').getAttribute('href')).toBe('/x');
  });

  it('invokes its action through a non-submit button', () => {
    const onClick = vi.fn();
    render(<>
      <Badge text="أ" size="sm" />
      <Badge text="ب" size="sm" onClick={onClick} />
    </>);
    const button = screen.getByRole('button', { name: 'ب' });
    expect(button.getAttribute('type')).toBe('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
