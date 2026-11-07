// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { GroupDetails } from './GroupDetails';
import { GroupConnections } from './GroupConnections';
import BranchTree from './BranchTree';
import { groups } from '@/lib/quran/mutashabih/data';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }));
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

  it('associates tree video legends with the same group and exposes each chip word example', () => {
    const { container } = render(<GroupConnections group={group}>
      <BranchTree tree={{ words: ['مشترك'], ayat: ['2:48', '2:123'], children: [] }} names={{}} showSpellings={false} />
      <GroupDetails group={group} />
    </GroupConnections>);
    expect(container.querySelector('[data-tree]')?.getAttribute('data-connection-group')).toBe(group.id);
    expect(container.querySelector('[data-connection-legend]')?.getAttribute('data-connection-legend')).toBe(group.id);
    const chip = screen.getByRole('button', { name: 'تقديم وتأخير' });
    expect(chip.parentElement?.querySelector('[data-connection-words]')?.textContent).toContain('شفاعة / عدل');
  });

  it('hides a citation when the focused places exclude its comparison', () => {
    const messenger = groups.find(group => group.citations.some(citation => citation.id === 'Z03'))!;
    render(<GroupConnections group={messenger}><GroupDetails group={messenger} shownKeys={['3:164', '62:2']} /></GroupConnections>);
    expect(screen.queryByText('الثالث: التقديم والتأخير')).toBeNull();
    expect(screen.queryByRole('button', { name: 'تقديم وتأخير' })).toBeNull();
    expect(screen.queryByText('ويعلمهم / ويزكيهم')).toBeNull();
  });

  it('does not render unsupported generated chips or their examples', () => {
    const uncited = groups.find(group => group.tags.includes('gender') && !group.citations.length)!;
    const { container } = render(<GroupConnections group={uncited} defaultOn><GroupDetails group={uncited} /></GroupConnections>);
    expect(screen.queryByRole('button', { name: /تذكير وتأنيث/ })).toBeNull();
    expect(container.querySelector('[data-connection-words]')).toBeNull();
    expect(screen.queryByText('تحديد آلي')).toBeNull();
  });

  it('shows a source-backed case difference without an extension warning', () => {
    const grammar = groups.find(group => group.citations.some(citation => citation.id === 'I06'))!;
    render(<GroupConnections group={grammar}><GroupDetails group={grammar} /></GroupConnections>);
    expect(screen.getByRole('button', { name: 'رفع ونصب' })).toBeTruthy();
    expect(screen.queryByText(/امتداد نمق/)).toBeNull();
  });

  it('starts with all types and toggles each without changing filters', () => {
    window.history.replaceState(null, '', '/quran/branches?m=cards&differences=order');
    footer();
    const order = screen.getByRole('button', { name: 'تقديم وتأخير' });
    const replacement = screen.getByRole('button', { name: 'إبدال كلمة' });
    expect(order.getAttribute('aria-pressed')).toBe('true');
    expect(replacement.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(replacement);
    expect(replacement.getAttribute('aria-pressed')).toBe('false');
    expect(order.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(replacement);
    expect(replacement.getAttribute('aria-pressed')).toBe('true');
    expect(order.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(order);
    expect(order.getAttribute('aria-pressed')).toBe('false');
    expect(replacement.getAttribute('aria-pressed')).toBe('true');
    expect(window.location.search).toBe('?m=cards&differences=order');
  });
});
