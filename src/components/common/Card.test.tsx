// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import Card from './Card';

afterEach(cleanup);

it('draws the card frame on the element it is given', () => {
  render(<Card as="article" aria-label="card" className="p-4">text</Card>);
  const card = screen.getByRole('article', { name: 'card' });
  expect(card.className).toContain('bg-[var(--home-card)]');
  expect(card.className).toContain('border-[var(--home-rule)]');
  expect(card.className).toContain('p-4');
});

it('is one link with href, and marks picked, dashed and faded cards', () => {
  render(<Card href="/quran/oaths" picked dashed faded>oaths</Card>);
  const link = screen.getByRole('link', { name: 'oaths' });
  expect(link.getAttribute('href')).toBe('/quran/oaths');
  expect(link.className).toContain('border-[var(--home-ink)]');
  expect(link.className).toContain('border-dashed');
  expect(link.className).toContain('opacity-60');
});

it('is one button with as="button", and a book with spine', () => {
  render(<Card as="button" spine onClick={() => {}}>book</Card>);
  const button = screen.getByRole('button', { name: 'book' });
  expect(button.getAttribute('type')).toBe('button');
  expect(button.className).toContain('border-s-[5px]');
});
