// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ThemesView from './ThemesView';

afterEach(cleanup);

describe('ThemesView', () => {
  it('says so when the two surahs share no topic', () => {
    render(<ThemesView a={{ number: 7, name: 'الأعراف', ayat: [] }} b={{ number: 11, name: 'هود', ayat: [] }} themes={[]} />);
    expect(screen.getByText('لا مواضع متقابلة مسجلة بين هاتين السورتين.')).toBeTruthy();
    expect(document.querySelector('section')).toBeNull();
  });
});
