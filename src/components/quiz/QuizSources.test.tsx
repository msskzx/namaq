// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuizSources from './QuizSources';

afterEach(cleanup);

describe('QuizSources', () => {
  it('names each book once on the book line, its author beside it, and opens to the places and words cited (owner, 2026-11-19 and 2026-11-20)', () => {
    render(<QuizSources sources={[
      { book: 'سير أعلام النبلاء', author: 'الذهبي', at: '١/٤١', quote: 'كان يكنى أبا حفص', url: 'https://shamela.ws/book/10906/41' },
      { book: 'سير أعلام النبلاء', author: 'الذهبي', at: '١/٤٤', quote: 'وقيل غير ذلك' },
      { book: 'زاد المعاد', author: 'ابن القيم', at: '١/٧٧' },
    ]} />);
    const line = screen.getByRole('button', { name: 'المصدر: سير أعلام النبلاء · الذهبي، زاد المعاد · ابن القيم' });
    expect(screen.queryByRole('link', { name: /١\/٤١/ })).toBeNull();
    fireEvent.click(line);
    expect(screen.getByRole('link', { name: /١\/٤١/ }).getAttribute('href')).toBe('https://shamela.ws/book/10906/41');
    expect(screen.getByText('«وقيل غير ذلك»، ١/٤٤')).toBeTruthy();
  });
});
