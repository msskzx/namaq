import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import data from '@shared/data/quran/surahOrder.json';
import { num } from '@shared/quran/arabicNumber';
import { orderSurahs } from '@shared/quran/surahOrder';
import OrderView from './OrderView';

const surahs = orderSurahs(data, num);

afterEach(cleanup);

describe('OrderView', () => {
  it('lists every surah with its aim, and a link before each but the first', () => {
    render(<OrderView surahs={surahs} />);
    const list = screen.getByRole('list', { name: 'السور' });
    expect(within(list).getAllByRole('heading')).toHaveLength(74);
    expect(within(list).getAllByLabelText('الصلة بما قبلها')).toHaveLength(73);
    expect(screen.getAllByRole('link', { name: 'السيوطي، تناسق الدرر ص١٦٠' })[0].getAttribute('href')).toBe('https://shamela.ws/book/9992/166');
  });

  it('narrows to a juz and drops the link into its first surah', () => {
    render(<OrderView surahs={surahs} />);
    fireEvent.click(screen.getByRole('button', { name: '٣٠' }));
    const list = screen.getByRole('list', { name: 'السور' });
    const headings = within(list).getAllByRole('heading');
    expect(headings).toHaveLength(37);
    expect(headings[0].textContent).toContain('النبأ');
    expect(within(list).getAllByLabelText('الصلة بما قبلها')).toHaveLength(36);
    expect(screen.getByRole('button', { name: '٣٠' }).getAttribute('aria-pressed')).toBe('true');
  });
});
