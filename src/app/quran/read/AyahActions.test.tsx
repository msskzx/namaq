import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import AyahActions from './AyahActions';

afterEach(cleanup);

const props = { ayah: '2:49', x: 200, y: 300, forgot: 0, saved: false, ar: true, onForgot: vi.fn(), onClear: vi.fn(), onSave: vi.fn(), onClose: vi.fn() };
const one = { href: '/quran/compare?a=2&b=7#c-2-49-7-141', label: 'الأعراف ١٤١', labelEn: 'Al-Araf 141' };
const two = { href: '/quran/compare?a=2&b=14#c-2-49-14-6', label: 'إبراهيم ٦', labelEn: 'Ibrahim 6' };

describe("the reader's ayah buttons", () => {
  it('shows no compare or trees button for an ayah with neither', () => {
    render(<AyahActions {...props} />);
    expect(screen.queryByLabelText('في المقارنة')).toBeNull();
    expect(screen.queryByLabelText('أشجار هذه الآية')).toBeNull();
  });

  it('links straight to the one compare card and to the trees holding the ayah', () => {
    render(<AyahActions {...props} links={{ compare: [one], trees: '/quran/branches?k=2%3A49' }} />);
    expect(screen.getByLabelText('في المقارنة').getAttribute('href')).toBe(one.href);
    expect(screen.getByLabelText('أشجار هذه الآية').getAttribute('href')).toBe('/quran/branches?k=2%3A49');
  });

  it('lists the surahs to pick from when several hold a card of the ayah', () => {
    render(<AyahActions {...props} links={{ compare: [one, two] }} />);
    fireEvent.click(screen.getByLabelText('في المقارنة'));
    expect(screen.getByRole('link', { name: 'الأعراف ١٤١' }).getAttribute('href')).toBe(one.href);
    expect(screen.getByRole('link', { name: 'إبراهيم ٦' }).getAttribute('href')).toBe(two.href);
  });

  it('opens the note, filled when the ayah has one', () => {
    const onNote = vi.fn();
    render(<AyahActions {...props} onNote={onNote} />);
    fireEvent.click(screen.getByLabelText('اكتب تأملًا'));
    expect(onNote).toHaveBeenCalled();
    cleanup();
    render(<AyahActions {...props} noted onNote={onNote} />);
    expect(screen.getByLabelText('تأملك في الآية').getAttribute('aria-pressed')).toBe('true');
  });
});
