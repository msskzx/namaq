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
    expect(screen.queryByLabelText('متشابهات الآية')).toBeNull();
  });

  it('previews the compare cards and the trees holding the ayah in a sheet instead of leaving the mushaf', () => {
    const onPreview = vi.fn();
    render(<AyahActions {...props} onPreview={onPreview} links={{ compare: [one, two], trees: '/quran/branches?k=2%3A49' }} />);
    expect(screen.getByLabelText('في المقارنة').getAttribute('href')).toBeNull();
    fireEvent.click(screen.getByLabelText('في المقارنة'));
    expect(onPreview).toHaveBeenLastCalledWith('compare');
    fireEvent.click(screen.getByLabelText('متشابهات الآية'));
    expect(onPreview).toHaveBeenLastCalledWith('trees');
  });

  it("opens the surah's topics, since the page header names none", () => {
    const onTopics = vi.fn();
    render(<AyahActions {...props} onTopics={onTopics} />);
    fireEvent.click(screen.getByLabelText('موضوع الآية في السورة'));
    expect(onTopics).toHaveBeenCalled();
  });

  it('opens the note, filled when the ayah has one', () => {
    const onNote = vi.fn();
    render(<AyahActions {...props} onNote={onNote} />);
    fireEvent.click(screen.getByLabelText('دوّن عن الآية'));
    expect(screen.getByLabelText('دوّن عن الآية').textContent).toBe('دوّن');
    expect(onNote).toHaveBeenCalled();
    cleanup();
    render(<AyahActions {...props} noted onNote={onNote} />);
    expect(screen.getByLabelText('ما دوّنته عن الآية').getAttribute('aria-pressed')).toBe('true');
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

  it('opens a pressed word\'s i\'rab on its tab, and has no tab or i\'rab button when no word was pressed', () => {
    const onPreview = vi.fn();
    render(<AyahActions {...props} onPreview={onPreview} />);
    expect(screen.queryByLabelText('إعراب الكلمة')).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
    cleanup();
    const onScope = vi.fn();
    render(<AyahActions {...props} onPreview={onPreview} irab words={{ key: '2:49', from: 1, to: 1 }} text="نَجَّيۡنَٰكُم" onScope={onScope} />);
    // The long press opens on the ayah's buttons; the tab turns to the word's.
    expect(screen.getByRole('tab', { name: 'الآية' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByLabelText('إعراب الكلمة')).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: 'الكلمة' }));
    expect(onScope).toHaveBeenLastCalledWith('word');
    cleanup();
    render(<AyahActions {...props} onPreview={onPreview} irab words={{ key: '2:49', from: 1, to: 1 }} scope="word" text="نَجَّيۡنَٰكُم" onScope={onScope} onCopy={vi.fn()} />);
    expect(screen.getByLabelText('نسيت الكلمة').textContent).toBe('نسيت');
    expect(screen.queryByLabelText('احفظ الآية')).toBeNull();
    fireEvent.click(screen.getByLabelText('إعراب الكلمة'));
    expect(onPreview).toHaveBeenLastCalledWith('irab');
  });

  it('acts on several dragged words with one forgot button, their places, copy and share', () => {
    const onForgot = vi.fn(), onPlaces = vi.fn(), onCopy = vi.fn(), onShareWords = vi.fn();
    render(<AyahActions {...props} onPreview={vi.fn()} irab words={{ key: '2:49', from: 0, to: 2 }} scope="words" text="وَإِذۡ نَجَّيۡنَٰكُم مِّنۡ" onScope={vi.fn()}
      onForgot={onForgot} onPlaces={onPlaces} onCopy={onCopy} onShareWords={onShareWords} />);
    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('«وَإِذۡ نَجَّيۡنَٰكُم مِّنۡ»');
    expect(screen.getByRole('tab', { name: 'الكلمات' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByLabelText('إعراب الكلمة')).toBeNull();
    fireEvent.click(screen.getByLabelText('نسيت هذه الكلمات'));
    fireEvent.click(screen.getByLabelText('مواضع «وَإِذۡ نَجَّيۡنَٰكُم مِّنۡ» في القرآن'));
    fireEvent.click(screen.getByLabelText('انسخ الكلمات'));
    fireEvent.click(screen.getByLabelText('مشاركة الكلمات'));
    expect([onForgot, onPlaces, onCopy, onShareWords].every(fn => fn.mock.calls.length === 1)).toBe(true);
  });
});
