// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Field, { SearchField } from './Field';

afterEach(cleanup);

it('is a framed text box named by its label, a text area with multiline, a left-to-right number with code', () => {
  render(<><Field label="اسمك" defaultValue="" /><Field multiline label="تأملك" defaultValue="" /><Field code label="رقم الاختبار" value="12" onChange={() => {}} /></>);
  expect(screen.getByRole('textbox', { name: 'اسمك' }).tagName).toBe('INPUT');
  expect(screen.getByRole('textbox', { name: 'تأملك' }).tagName).toBe('TEXTAREA');
  expect(screen.getByRole('textbox', { name: 'رقم الاختبار' }).getAttribute('dir')).toBe('ltr');
});

it('searches with a clear button once something is typed', () => {
  const change = vi.fn();
  const { rerender } = render(<SearchField label="ابحث" value="" onChangeText={change} />);
  expect(screen.queryByRole('button', { name: 'مسح' })).toBeNull();
  fireEvent.change(screen.getByRole('searchbox', { name: 'ابحث' }), { target: { value: 'الطور' } });
  expect(change).toHaveBeenCalledWith('الطور');
  rerender(<SearchField label="ابحث" value="الطور" onChangeText={change} />);
  fireEvent.click(screen.getByRole('button', { name: 'مسح' }));
  expect(change).toHaveBeenLastCalledWith('');
});
