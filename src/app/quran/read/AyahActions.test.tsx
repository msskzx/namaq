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

  it('previews the compare cards and the trees holding the ayah in a sheet instead of leaving the mushaf', () => {
    const onPreview = vi.fn();
    render(<AyahActions {...props} onPreview={onPreview} links={{ compare: [one, two], trees: '/quran/branches?k=2%3A49' }} />);
    expect(screen.getByLabelText('في المقارنة').getAttribute('href')).toBeNull();
    fireEvent.click(screen.getByLabelText('في المقارنة'));
    expect(onPreview).toHaveBeenLastCalledWith('compare');
    fireEvent.click(screen.getByLabelText('أشجار هذه الآية'));
    expect(onPreview).toHaveBeenLastCalledWith('trees');
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

  it('names each button under its icon, and shows the readings button only for an ayah whose words the readers differ in', () => {
    const onPreview = vi.fn();
    render(<AyahActions {...props} onPreview={onPreview} />);
    expect(screen.getByLabelText('احفظ الآية').textContent).toBe('احفظ');
    expect(screen.queryByLabelText('القراءات العشر في كلمات الآية')).toBeNull();
    cleanup();
    render(<AyahActions {...props} onPreview={onPreview} links={{ compare: [], qiraat: [{ at: [0, 0], readings: [{ text: 'أ', rawis: [10] }, { text: 'ب', rawis: [1] }] }] }} />);
    fireEvent.click(screen.getByLabelText('القراءات العشر في كلمات الآية'));
    expect(onPreview).toHaveBeenLastCalledWith('readings');
  });

  it('opens al-Sa\'di\'s tafsir for every ayah in a sheet', () => {
    const onPreview = vi.fn();
    render(<AyahActions {...props} onPreview={onPreview} />);
    expect(screen.getByLabelText('تفسير السعدي').textContent).toBe('التفسير');
    fireEvent.click(screen.getByLabelText('تفسير السعدي'));
    expect(onPreview).toHaveBeenLastCalledWith('tafsir');
  });
});
