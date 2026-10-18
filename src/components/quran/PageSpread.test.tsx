// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import PageSpread from './PageSpread';
import styles from './PageSpread.module.css';

afterEach(cleanup);

const page = (title: string, rows: string[][]) => ({ title, rows: rows.map((line, k) => line.map((text, i) => ({ number: k * 10 + i + 1, words: text.split(' '), marks: { 0: { kind: 'exact' as const }, 1: { kind: 'root' as const, title: 'جذر' } } }))) });

describe('PageSpread', () => {
  it('lays both pages out on the same number of lines, so facing ayat share a line', () => {
    const { container } = render(<PageSpread pages={[page('أ', [['ا ب ج'], ['د ه و']]), page('ب', [['ز ح ط', 'ي ك ل']])]} />);
    const lines = Array.from(container.querySelectorAll('article')).map(article => article.querySelectorAll('div[lang] > p').length);
    expect(lines).toEqual([2, 2]);
    expect(screen.getByRole('article', { name: 'ب' }).querySelector('div[lang] > p')!.textContent).toBe('ز ح ط ١ ي ك ل ٢');
  });

  it('colours a word shared exactly apart from a word that shares only its root', () => {
    render(<PageSpread pages={[page('أ', [['ا ب ج']])]} />);
    const [exact, root] = Array.from(document.querySelectorAll('mark'));
    expect([exact.textContent, root.textContent]).toEqual(['ا', 'ب']);
    expect(exact.className).not.toContain(styles.root);
    expect(root.className).toContain(styles.root);
    expect(root.title).toBe('جذر');
  });

  it('gives a partner after the first its own colour, and keeps the root cue on a root word of that partner', () => {
    render(<PageSpread pages={[{ title: 'أ', rows: [[{ number: 1, words: ['ا', 'ب', 'ج'], marks: { 0: { kind: 'exact', slot: 1 }, 1: { kind: 'root', slot: 1 }, 2: { kind: 'exact', slot: 5, linked: true } } }]] }]} />);
    const [one, root, five] = Array.from(document.querySelectorAll('mark')).map(m => m.className);
    expect(one).toBe(styles.slot1);
    expect(root).toContain(styles.root);
    expect(root).toContain(styles.slot1);
    expect(five).toContain(styles.slot1);
    expect(five).toContain(styles.linked);
  });

  it('leaves the column of a missing page empty', () => {
    const { container } = render(<PageSpread pages={[null, page('ب', [['ا']])]} />);
    expect(container.firstElementChild!.children[0].tagName).toBe('DIV');
    expect(screen.getByRole('article', { name: 'ب' })).toBeTruthy();
  });
});
