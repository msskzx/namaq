import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import corpus from '@shared/quran/quranText/corpus';
import { num } from '@shared/quran/arabicNumber';
import { orderSurahs } from '@shared/quran/surahOrder';
import OrderView from './OrderView';

const pageWords = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const data = (key: string) => pageWords.get(key);
const surahs = orderSurahs(data, num);

afterEach(cleanup);

describe('OrderView', () => {
  it('lists every surah with its aim, and a link before each but the first', () => {
    render(<OrderView surahs={surahs} />);
    const list = screen.getByRole('list', { name: 'السور' });
    expect(within(list).getAllByRole('heading')).toHaveLength(114);
    expect(within(list).getAllByLabelText('الصلة بما قبلها')).toHaveLength(113);
    expect(screen.getAllByRole('link', { name: 'السيوطي، تناسق الدرر ص١٦٠' })[0].getAttribute('href')).toBe('https://shamela.ws/book/9992/166');
  });

  it('shows the early surahs and their source links under juz one', () => {
    render(<OrderView surahs={surahs} />);
    fireEvent.click(screen.getByRole('button', { name: '١' }));
    const list = screen.getByRole('list', { name: 'السور' });
    expect(within(list).getAllByRole('heading').map(h => h.textContent)).toEqual(['الفاتحة١', 'البقرة٢']);
    expect(within(list).getAllByLabelText('الصلة بما قبلها')).toHaveLength(1);
    expect(within(list).getByRole('link', { name: 'السيوطي، تناسق الدرر ص٥٣' }).getAttribute('href')).toBe('https://shamela.ws/book/9992/51');
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
