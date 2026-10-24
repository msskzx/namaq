import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Button from './Button';

afterEach(cleanup);

describe('Button', () => {
  it('defaults to a type="button" element so it never submits a surrounding form', () => {
    render(<Button>Deselect</Button>);
    expect(screen.getByRole('button', { name: 'Deselect' }).getAttribute('type')).toBe('button');
  });

  it('renders a link to the requested destination', () => {
    const { container } = render(<>
      <Button>Deselect</Button>
      <Button href="/people/x">View profile</Button>
    </>);
    const link = container.querySelector('a')!;
    expect(link.getAttribute('href')).toBe('/people/x');
  });

  it('forwards clicks and honours disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Show full graph</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Show full graph' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
