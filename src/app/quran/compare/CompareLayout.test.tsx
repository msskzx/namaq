// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
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
});
