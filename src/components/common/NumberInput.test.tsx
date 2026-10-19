import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NumberInput from './NumberInput';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
afterEach(cleanup);

const number = () => screen.getByRole('spinbutton', { name: 'Page' }) as HTMLInputElement;

describe('NumberInput', () => {
  it('supports typing a whole number before committing it', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Page" value={1} min={1} max={30} onChange={onChange} />);
    fireEvent.change(number(), { target: { value: '' } });
    fireEvent.change(number(), { target: { value: '2' } });
    fireEvent.change(number(), { target: { value: '25' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(number());
    expect(onChange).toHaveBeenCalledWith(25);
    expect(number().value).toBe('25');
  });

  it('increments and stops at both bounds without submitting the form', () => {
    const submit = vi.fn();
    render(<form onSubmit={submit}><NumberInput label="Page" defaultValue={1} min={1} max={2} /></form>);
    expect(screen.getByRole('button', { name: 'Decrease Page' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Increase Page' }));
    expect(number().value).toBe('2');
    expect(screen.getByRole('button', { name: 'Increase Page' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Decrease Page' }));
    expect(number().value).toBe('1');
    expect(submit).not.toHaveBeenCalled();
  });

  it('snaps typed counts to the configured step', () => {
    render(<NumberInput label="Page" min={5} max={30} step={5} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase Page' }));
    expect(number().value).toBe('10');
    fireEvent.change(number(), { target: { value: '17' } });
    fireEvent.blur(number());
    expect(number().value).toBe('15');
    fireEvent.keyDown(number(), { key: 'ArrowDown' });
    expect(number().value).toBe('10');
  });

  it('increments a typed draft once after the input loses focus', () => {
    const onChange = vi.fn();
    render(<NumberInput label="Page" min={1} max={30} onChange={onChange} />);
    fireEvent.focus(number());
    fireEvent.change(number(), { target: { value: '25' } });
    fireEvent.blur(number(), { relatedTarget: screen.getByRole('button', { name: 'Increase Page' }) });
    fireEvent.click(screen.getByRole('button', { name: 'Increase Page' }));
    expect(number().value).toBe('26');
    expect(onChange.mock.calls.map(call => call[0])).toEqual([25, 26]);
  });

  it('clamps typed numbers and restores a cleared field on blur', () => {
    render(<NumberInput label="Page" defaultValue={3} min={1} max={30} />);
    fireEvent.change(number(), { target: { value: '99' } });
    expect(number().validity.rangeOverflow).toBe(true);
    fireEvent.blur(number());
    expect(number().value).toBe('30');
    fireEvent.change(number(), { target: { value: '' } });
    fireEvent.blur(number());
    expect(number().value).toBe('3');
    fireEvent.change(number(), { target: { value: '0' } });
    fireEvent.blur(number());
    expect(number().value).toBe('1');
  });

  it('supports arrow keys and range endpoints', () => {
    render(<NumberInput label="Page" min={1} max={30} />);
    for (const [key, expected] of [['ArrowUp', '2'], ['End', '30'], ['ArrowUp', '30'], ['ArrowDown', '29'], ['Home', '1'], ['ArrowDown', '1']]) {
      fireEvent.keyDown(number(), { key });
      expect(number().value).toBe(expected);
    }
  });

  it('serializes the typed number when Enter submits a native form', () => {
    const { container } = render(<form><NumberInput label="Page" name="page" min={1} max={30} /></form>);
    fireEvent.change(number(), { target: { value: '25' } });
    fireEvent.keyDown(number(), { key: 'Enter' });
    expect(new FormData(container.querySelector('form')!).get('page')).toBe('25');
  });

  it('follows controlled updates and disables all controls together', () => {
    const { rerender } = render(<NumberInput label="Page" value={2} min={1} max={30} />);
    rerender(<NumberInput label="Page" value={12} min={1} max={30} disabled />);
    expect(number().value).toBe('12');
    expect(number().disabled).toBe(true);
    expect(screen.getAllByRole('button').every(button => button.hasAttribute('disabled'))).toBe(true);
  });
});
