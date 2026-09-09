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

  it('renders a link when given href, sharing the same classes as a button', () => {
    const { container } = render(<>
      <Button>Deselect</Button>
      <Button href="/people/x">View profile</Button>
    </>);
    const [button, link] = [container.querySelector('button')!, container.querySelector('a')!];
    expect(link.getAttribute('href')).toBe('/people/x');
    expect(link.className).toBe(button.className);
  });

  it('keeps className for layout without dropping its own styling', () => {
    render(<Button className="shrink-0">Profile</Button>);
    const button = screen.getByRole('button', { name: 'Profile' });
    expect(button.className).toContain('shrink-0');
    expect(button.className).toContain('rounded');
  });

  it('forwards clicks and honours disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Show full graph</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Show full graph' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
