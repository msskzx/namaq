// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { GroupDetails } from './GroupDetails';
import { GroupConnections } from './GroupConnections';
import { groups } from '@/lib/quran/mutashabih/data';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

const group = groups.find(group => group.citations.some(citation => citation.id === 'K02'))!;
const footer = () => render(<GroupConnections group={group} defaultOn><GroupDetails group={group} /></GroupConnections>);

describe('group footer', () => {
  it('names the words for each difference type independently', () => {
    footer();
    const order = screen.getByRole('button', { name: 'تقديم وتأخير' });
    const replacement = screen.getByRole('button', { name: 'إبدال كلمة' });
    expect(order.parentElement?.textContent).toContain('شفاعة / عدل');
    expect(replacement.parentElement?.textContent).toContain('يؤخذ منها / تنفعها');
    expect(replacement.parentElement?.textContent).not.toContain('شفاعة / عدل');
  });

  it('hides a citation when the focused places exclude its comparison', () => {
    const messenger = groups.find(group => group.citations.some(citation => citation.id === 'Z03'))!;
    render(<GroupConnections group={messenger}><GroupDetails group={messenger} shownKeys={['3:164', '62:2']} /></GroupConnections>);
    expect(screen.queryByText('الثالث: التقديم والتأخير')).toBeNull();
  });

  it('starts on the first type and switches or hides connectors without changing filters', () => {
    window.history.replaceState(null, '', '/quran/branches?m=cards&differences=order');
    footer();
    const order = screen.getByRole('button', { name: 'تقديم وتأخير' });
    const replacement = screen.getByRole('button', { name: 'إبدال كلمة' });
    expect(order.getAttribute('aria-pressed')).toBe('true');
    expect(replacement.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(replacement);
    expect(replacement.getAttribute('aria-pressed')).toBe('true');
    expect(order.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(replacement);
    expect(replacement.getAttribute('aria-pressed')).toBe('false');
    expect(order.getAttribute('aria-pressed')).toBe('false');
    expect(window.location.search).toBe('?m=cards&differences=order');
  });
});
