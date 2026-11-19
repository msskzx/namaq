import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import AyahActions from './AyahActions';

afterEach(cleanup);

const props = { ayah: '2:49', x: 200, y: 300, forgot: false, saved: false, ar: true, onForgot: vi.fn(), onSave: vi.fn(), onClose: vi.fn() };
const one = { href: '/quran/compare?a=2&b=7#c-2-49-7-141', label: 'الأعراف ١٤١', labelEn: 'Al-Araf 141' };
const two = { href: '/quran/compare?a=2&b=14#c-2-49-14-6', label: 'إبراهيم ٦', labelEn: 'Ibrahim 6' };
const everything = {
  ...props, irab: true, lit: { text: 'نَجَّيۡنَٰكُم', forgot: false }, onListen: vi.fn(), onRecite: vi.fn(), onNote: vi.fn(), onPreview: vi.fn(), onTopics: vi.fn(),
  onPlaces: vi.fn(), onCopy: vi.fn(), onShare: vi.fn(), links: { compare: [one], trees: '/quran/branches?k=2%3A49', qiraat: [{ at: [0, 0] as [number, number], readings: [{ text: 'أ', rawis: [10] }, { text: 'ب', rawis: [1] }] }] },
};

describe("the reader's ayah buttons", () => {
  it('lays every button in the owner\'s three groups: your actions, the Quran\'s, sending, with share last', () => {
    render(<AyahActions {...everything} />);
    const names = screen.getAllByRole('button').map(button => button.textContent);
    expect(names).toEqual(['استمع', 'سمّع', 'نسيت', 'احفظ', 'دوّن', 'التفسير', 'الإعراب', 'المعنى', 'البلاغة', 'القراءات', 'المتشابهات', 'المقارنة', 'المواضع', 'الموضوعات', 'نسخ', 'مشاركة']);
  });

  it("opens each of the Quran's books on the ayah, and the pressed word's i'rab and meaning, in a sheet", () => {
    render(<AyahActions {...everything} />);
    const opened = [['تفسير السعدي', 'tafsir'], ['إعراب الكلمة', 'irab'], ['معنى الكلمة', 'gharib'], ['البلاغة في الآية', 'balagha'], ['القراءات العشر في كلمات الآية', 'readings']].map(([label, kind]) => {
      fireEvent.click(screen.getByLabelText(label));
      return [label, everything.onPreview.mock.lastCall?.[0] === kind];
    });
    expect(opened.filter(([, right]) => !right)).toEqual([]);
  });

  it('shows a button only where there is something behind it', () => {
    render(<AyahActions {...props} onPreview={vi.fn()} />);
    for (const label of ['في المقارنة', 'متشابهات الآية', 'القراءات العشر في كلمات الآية', 'إعراب الكلمة', 'معنى الكلمة']) expect(screen.queryByLabelText(label)).toBeNull();
    expect(screen.getByLabelText('تفسير السعدي')).toBeTruthy();
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

  it('with no word lit, «نسيت» toggles the ayah at once as a bulb, crossed while forgotten', () => {
    const onForgot = vi.fn();
    render(<AyahActions {...props} onForgot={onForgot} />);
    fireEvent.click(screen.getByLabelText('نسيت الآية'));
    expect(onForgot).toHaveBeenLastCalledWith('ayah');
    expect(screen.queryByRole('group')).toBeNull();
    cleanup();
    render(<AyahActions {...props} forgot onForgot={onForgot} />);
    expect(screen.getByLabelText('تذكّرت الآية').getAttribute('aria-pressed')).toBe('true');
  });

  it('with words lit, «نسيت» and «نسخ» open a bubble: the ayah, or the lit words', () => {
    const onForgot = vi.fn(), onCopy = vi.fn();
    render(<AyahActions {...everything} lit={{ text: 'وَإِذۡ نَجَّيۡنَٰكُم', forgot: true }} onForgot={onForgot} onCopy={onCopy} />);
    fireEvent.click(screen.getByLabelText('نسيت: الآية أو ما أضاءته'));
    const forgot = within(screen.getByRole('group', { name: 'ما نسيت' }));
    expect(forgot.getByLabelText('نسيت الآية').getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(forgot.getByLabelText('تذكّرت «وَإِذۡ نَجَّيۡنَٰكُم»'));
    expect(onForgot).toHaveBeenLastCalledWith('lit');
    fireEvent.click(screen.getByLabelText('انسخ الآية أو ما أضاءته'));
    fireEvent.click(within(screen.getByRole('group', { name: 'ما تنسخ' })).getByLabelText('انسخ «وَإِذۡ نَجَّيۡنَٰكُم»'));
    expect(onCopy).toHaveBeenLastCalledWith('lit');
  });

  it('opens the note, filled when the ayah has one', () => {
    render(<AyahActions {...props} noted onNote={vi.fn()} />);
    expect(screen.getByLabelText('ما دوّنته عن الآية').getAttribute('aria-pressed')).toBe('true');
  });
});
