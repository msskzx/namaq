import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { faBullseye, faCircleNodes } from '@fortawesome/free-solid-svg-icons';
import ScopeToggle from './ScopeToggle';

afterEach(cleanup);

const options = [
  { value: 'selected' as const, label: 'Selected subject', icon: faBullseye },
  { value: 'exploration' as const, label: 'Entire exploration', icon: faCircleNodes },
] as const;

it('shows both options and flips to the other one on press', () => {
  const onChange = vi.fn();
  render(<ScopeToggle value="selected" options={options} onChange={onChange} ariaLabel="Apply them to the entire exploration instead" />);

  const toggle = screen.getByRole('button');
  expect(toggle.textContent).toContain('Selected subject');
  expect(toggle.textContent).toContain('Entire exploration');

  fireEvent.click(toggle);
  expect(onChange).toHaveBeenCalledWith('exploration');
});

it('flips back from the second option', () => {
  const onChange = vi.fn();
  render(<ScopeToggle value="exploration" options={options} onChange={onChange} ariaLabel="Apply them to the selected subject instead" />);

  fireEvent.click(screen.getByRole('button'));
  expect(onChange).toHaveBeenCalledWith('selected');
});
