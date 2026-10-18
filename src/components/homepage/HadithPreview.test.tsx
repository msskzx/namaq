import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import HadithPreview from './HadithPreview';
import { hadithView } from '@/lib/model/hadithView';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
afterEach(cleanup);

describe('complete hadith example', () => {
  it('shows all conversation lines as bubbles and can switch to the original full text', () => {
    const view = hadithView('muslim-jibril')!;
    const { container } = render(<HadithPreview view={view} />);
    for (const line of view.reports[0].scenes.flatMap(scene => scene.lines)) expect(container.textContent).toContain(line.text);
    expect(screen.getByRole('heading', { name: 'Scene 1' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Scene 2' })).toBeTruthy();
    fireEvent.click(screen.getByRole('switch', { name: 'Isnad and bubbles' }));
    expect(screen.queryByRole('heading', { name: 'Scene 1' })).toBeNull();
    expect(container.textContent).toContain(view.reports[0].fullText!);
    fireEvent.click(screen.getByRole('switch', { name: 'Isnad and bubbles' }));
    expect(screen.getByRole('heading', { name: 'Scene 2' })).toBeTruthy();
  });

  it('puts each new speaker on the other side, so the Prophet and Umar do not share one', () => {
    const { container } = render(<HadithPreview view={hadithView('muslim-jibril')!} />);
    const rows = Array.from(container.querySelectorAll('[class*="rounded-2xl"]')).map(bubble => ({
      speaker: bubble.querySelector('span')?.textContent, start: bubble.parentElement!.className.includes('justify-start'),
    }));
    expect(rows.length).toBeGreaterThan(10);
    rows.slice(1).forEach((row, k) => { if (row.speaker !== rows[k].speaker) expect(row.start).not.toBe(rows[k].start); });
  });
});
