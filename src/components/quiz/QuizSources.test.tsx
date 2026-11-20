// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuizSources from './QuizSources';

afterEach(cleanup);

describe('QuizSources', () => {
  it('starts collapsed to each book once, its author beside it, and opens to the places and words cited (owner, 2026-11-19)', () => {
    const { container } = render(<QuizSources sources={[
      { book: 'سير أعلام النبلاء', author: 'الذهبي', at: '١/٤١', quote: 'كان يكنى أبا حفص', url: 'https://shamela.ws/book/10906/41' },
      { book: 'سير أعلام النبلاء', author: 'الذهبي', at: '١/٤٤', quote: 'وقيل غير ذلك' },
      { book: 'زاد المعاد', author: 'ابن القيم', at: '١/٧٧' },
    ]} />);
    const lines = [...container.querySelectorAll('details')];
    expect(lines.map(line => line.querySelector('summary')!.textContent)).toEqual(['سير أعلام النبلاء · الذهبي', 'زاد المعاد · ابن القيم']);
    expect(lines.every(line => !line.open)).toBe(true);
    fireEvent.click(screen.getByText('سير أعلام النبلاء · الذهبي'));
    expect(lines[0].open).toBe(true);
    expect(screen.getByRole('link', { name: /١\/٤١/ }).getAttribute('href')).toBe('https://shamela.ws/book/10906/41');
    expect(screen.getByText('«وقيل غير ذلك»، ١/٤٤')).toBeTruthy();
  });
});
