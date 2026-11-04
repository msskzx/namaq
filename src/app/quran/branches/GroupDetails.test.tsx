// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { GroupDetails } from './GroupDetails';
import { groups } from '@/lib/quran/mutashabih/data';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);

const group = groups.find(group => group.citations.some(citation => citation.id === 'K02'))!;
describe('group footer', () => {
  it('hides a citation when the focused places exclude its comparison', () => {
    const messenger = groups.find(group => group.citations.some(citation => citation.id === 'Z03'))!;
    render(<GroupDetails group={messenger} range={null} view={{}} shownKeys={['3:164', '62:2']} />);
    expect(screen.queryByText('الثالث: التقديم والتأخير')).toBeNull();
  });

  it.each(['tree', 'cards'] as const)('applies and clears the difference filter from %s without losing the current group', mode => {
    const view = { mode, query: 'شفاعة', filters: { surahs: '2', sort: 'closest' } };
    render(<GroupDetails group={group} range={{ from: 1, to: 3 }} view={view} />);
    const link = screen.getByRole('link', { name: 'تقديم وتأخير' });
    const url = new URL(link.getAttribute('href')!, 'https://namaq.test');
    expect(url.searchParams.get('o')).toBe(group.id);
    expect(url.searchParams.get('m')).toBe(mode);
    expect(url.searchParams.get('differences')).toBe('order');
    expect(url.searchParams.get('surahs')).toBe('2');
    expect(url.searchParams.get('q')).toBe('شفاعة');
    expect(url.searchParams.get('juzTo')).toBe('3');
    expect(screen.getByText('شفاعة / عدل')).toBeTruthy();
    expect(screen.getByText('قدم الشفاعة … وأخر العدل')).toBeTruthy();
    cleanup();
    render(<GroupDetails group={group} range={null} view={{ ...view, filters: { ...view.filters, differences: 'order' } }} />);
    const selected = screen.getByRole('link', { name: 'تقديم وتأخير' });
    expect(selected.getAttribute('aria-pressed')).toBe('true');
    expect(new URL(selected.getAttribute('href')!, 'https://namaq.test').searchParams.has('differences')).toBe(false);
  });
});
