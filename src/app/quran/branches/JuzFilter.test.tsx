// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { branchesHref } from '@/lib/quran/branches';
import JuzFilter from './JuzFilter';

afterEach(cleanup);

describe('JuzFilter', () => {
  it('submits the range with the phrase and view kept', () => {
    const { container } = render(<JuzFilter range={{ from: 25, to: 30 }} phrase="فلا اقسم" list />);
    expect((screen.getByLabelText('من الجزء') as HTMLSelectElement).value).toBe('25');
    expect((screen.getByLabelText('إلى الجزء') as HTMLSelectElement).value).toBe('30');
    expect([...container.querySelectorAll('input[type=hidden]')].map(i => `${i.getAttribute('name')}=${i.getAttribute('value')}`)).toEqual(['o=فلا اقسم', 'v=list']);
    expect(screen.getByRole('link', { name: 'كل الأجزاء' }).getAttribute('href')).toBe(branchesHref('فلا اقسم', undefined, true));
  });

  it('starts on the whole mushaf with nothing to reset', () => {
    render(<JuzFilter range={null} phrase="ان المتقين" list={false} />);
    expect((screen.getByLabelText('من الجزء') as HTMLSelectElement).value).toBe('1');
    expect((screen.getByLabelText('إلى الجزء') as HTMLSelectElement).value).toBe('30');
    expect(screen.queryByRole('link', { name: 'كل الأجزاء' })).toBeNull();
  });

  it('shows the whole mushaf again once the range is cleared', () => {
    const { rerender } = render(<JuzFilter range={{ from: 25, to: 30 }} phrase="ان المتقين" list={false} />);
    rerender(<JuzFilter range={null} phrase="ان المتقين" list={false} />);
    expect((screen.getByLabelText('من الجزء') as HTMLSelectElement).value).toBe('1');
  });
});
