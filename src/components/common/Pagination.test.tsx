// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Pagination from './Pagination';

const { language } = vi.hoisted(() => ({ language: { current: 'en' } }));
vi.mock('@/components/language/LanguageContext', () => ({
  useLanguage: () => ({ language: language.current }),
}));

afterEach(() => {
  cleanup();
  language.current = 'en';
});

describe('Pagination', () => {
  it('reports where the reader is', () => {
    render(<Pagination page={2} pageCount={5} onChange={vi.fn()} />);

    expect(screen.getByText('Page 2 of 5')).toBeTruthy();
  });

  it('prefers a caller-supplied summary', () => {
    render(<Pagination page={1} pageCount={3} onChange={vi.fn()} summary="1–10 of 25" />);

    expect(screen.getByText('1–10 of 25')).toBeTruthy();
    expect(screen.queryByText('Page 1 of 3')).toBeNull();
  });

  it('moves one page at a time', () => {
    const onChange = vi.fn();
    render(<Pagination page={2} pageCount={5} onChange={onChange} />);

    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Previous'));

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });

  it('stops at both ends', () => {
    const { rerender } = render(<Pagination page={1} pageCount={5} onChange={vi.fn()} />);
    expect(screen.getByText('Previous').closest('button')?.hasAttribute('disabled')).toBe(true);

    rerender(<Pagination page={5} pageCount={5} onChange={vi.fn()} />);
    expect(screen.getByText('Next').closest('button')?.hasAttribute('disabled')).toBe(true);
  });

  it('renders nothing for a single page', () => {
    const { container } = render(<Pagination page={1} pageCount={1} onChange={vi.fn()} />);

    expect(container.querySelector('nav')).toBeNull();
  });

  it('jumps to a chosen page when a selector is offered', () => {
    const onChange = vi.fn();
    const { container } = render(<Pagination page={1} pageCount={19} onChange={onChange} showSelect />);

    fireEvent.change(container.querySelector('select')!, { target: { value: '7' } });

    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('offers no selector unless asked', () => {
    const { container } = render(<Pagination page={1} pageCount={19} onChange={vi.fn()} />);

    expect(container.querySelector('select')).toBeNull();
  });

  it('reads in Arabic on an Arabic page', () => {
    language.current = 'ar';
    render(<Pagination page={2} pageCount={5} onChange={vi.fn()} />);

    expect(screen.getByText('صفحة 2 من 5')).toBeTruthy();
    expect(screen.getByText('التالي')).toBeTruthy();
  });
});
