// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import CompareLayout from './CompareLayout';

const navigation = { search: 'a=1' };
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(navigation.search) }));
afterEach(() => {
  cleanup();
  localStorage.clear();
});

const show = () => render(<CompareLayout title="السور" current="الواقعة والحاقة" pane={<p>القائمة</p>}><p>المقارنة</p></CompareLayout>);

describe('CompareLayout', () => {
  it('hides the list on wide screens, remembers it, and moves focus to the button that brings it back', () => {
    show();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'إخفاء القائمة' })));
    expect(localStorage.getItem('compare-pane-hidden')).toBe('1');
    expect(screen.getByRole('complementary', { hidden: true }).className).toContain('lg:hidden');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'اعرض قائمة السور' }));
    cleanup();
    show();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'اعرض قائمة السور' })));
    expect(localStorage.getItem('compare-pane-hidden')).toBe('0');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'إخفاء القائمة' }));
  });

  it('opens the list from the phone button and closes it after the page moves to another pair', () => {
    const { rerender } = show();
    const toggle = screen.getByRole('button', { name: /تغيير السورتين/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('complementary').className).toMatch(/(^| )flex( |$)/);
    navigation.search = 'a=2';
    rerender(<CompareLayout title="السور" current="الطور والواقعة" pane={<p>القائمة</p>}><p>المقارنة</p></CompareLayout>);
    expect(screen.getByRole('button', { name: /تغيير السورتين/ }).getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the wide-screen surah list buttons around the bar by default', () => {
    localStorage.setItem('compare-pane-hidden', '1');
    render(<CompareLayout title="السور" current="الواقعة والحاقة" pane={<p>القائمة</p>} bar={<button type="button">شريط</button>}><p>المقارنة</p></CompareLayout>);
    expect(screen.getByRole('button', { name: 'شريط' }).compareDocumentPosition(screen.getByRole('button', { name: 'اعرض قائمة السور' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'اعرض قائمة السور' })));
    expect(within(screen.getByRole('complementary')).getByRole('button', { name: 'إخفاء القائمة' })).toBeTruthy();
  });

  it('with paneToggleFirst keeps one surah list toggle first in the bar, whether the list is shown or hidden', () => {
    render(<CompareLayout title="السور" current="الواقعة والحاقة" pane={<p>القائمة</p>} bar={<button type="button">شريط</button>} paneToggleFirst><p>المقارنة</p></CompareLayout>);
    const bar = screen.getByRole('button', { name: 'شريط' });
    const toggle = screen.getByRole('button', { name: 'أخفِ قائمة السور' });
    expect(toggle.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(within(screen.getByRole('complementary', { hidden: true })).queryByRole('button', { name: 'إخفاء القائمة' })).toBeNull();
    act(() => fireEvent.click(toggle));
    expect(localStorage.getItem('compare-pane-hidden')).toBe('1');
    expect(toggle.textContent).toBe('اعرض قائمة السور');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('with paneToggleFirst puts the phone surah button before the bar', () => {
    render(<CompareLayout title="السور" current="الواقعة والحاقة" pane={<p>القائمة</p>} bar={<button type="button">شريط</button>} paneToggleFirst><p>المقارنة</p></CompareLayout>);
    expect(screen.getByRole('button', { name: /تغيير السورتين/ }).compareDocumentPosition(screen.getByRole('button', { name: 'شريط' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
