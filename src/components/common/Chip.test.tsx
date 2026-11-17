// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Chip from './Chip';

vi.mock('next/link', () => ({ default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a> }));
afterEach(cleanup);

it('is a pressed button, filled when on, with its count', () => {
  const pick = vi.fn();
  render(<Chip label="الثناء" on count={3} onClick={pick} />);
  const chip = screen.getByRole('button', { name: /الثناء/ });
  expect(chip.getAttribute('aria-pressed')).toBe('true');
  expect(chip.className).toContain('bg-[var(--home-accent)]');
  expect(chip.textContent).toContain('٣');
  fireEvent.click(chip);
  expect(pick).toHaveBeenCalled();
});

it('stays framed when lit, and is a tab with role tab', () => {
  render(<Chip label="كفوا" role="tab" lit on quran onClick={() => {}} />);
  const tab = screen.getByRole('tab', { name: 'كفوا' });
  expect(tab.getAttribute('aria-selected')).toBe('true');
  expect(tab.className).toContain('bg-[var(--home-paper-deep)]');
  expect(tab.className).not.toContain('bg-[var(--home-accent)]');
});

it('is only a label without onClick, and a removable filter with clearHref', () => {
  render(<><Chip label="البقرة" /><Chip label="سورة الطور" clearHref="/quran/branches" clearLabel="إزالة السورة" /></>);
  expect(screen.queryByRole('button', { name: 'البقرة' })).toBeNull();
  expect(screen.getByRole('link', { name: 'إزالة السورة' }).getAttribute('href')).toBe('/quran/branches');
});
