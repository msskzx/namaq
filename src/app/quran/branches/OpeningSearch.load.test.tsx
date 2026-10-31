// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import OpeningSearch from './OpeningSearch';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'en' }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const phrases = [{ id: 'وقعت الواقعة', text: 'وَقَعَتِ ٱلْوَاقِعَةُ', count: 2 }];

it('fetches the phrases once per juz range, says it is loading meanwhile, and retries a failed fetch when typing again', async () => {
  let answer: (value: Response) => void = () => {};
  const fetchMock = vi.fn()
    .mockImplementationOnce(() => new Promise<Response>(resolve => { answer = resolve; }))
    .mockResolvedValueOnce(new Response(null, { status: 503 }))
    .mockImplementation(async () => new Response(JSON.stringify({ phrases })));
  vi.stubGlobal('fetch', fetchMock);
  const { rerender } = render(<OpeningSearch top={[]} juz={{ from: 29, to: 30 }} />);
  expect(fetchMock).toHaveBeenCalledWith('/api/quran/branch-phrases?all=1&juzFrom=29&juzTo=30');
  const box = screen.getByRole('combobox');
  fireEvent.change(box, { target: { value: 'وقعت' } });
  expect(screen.getByRole('status').textContent).toBe('Loading phrases…');
  answer(new Response(JSON.stringify({ phrases })));
  expect(await screen.findByRole('option', { name: /وَقَعَتِ/ })).toBeTruthy();

  rerender(<OpeningSearch top={[]} juz={{ from: 30, to: 30 }} />);
  expect(fetchMock).toHaveBeenLastCalledWith('/api/quran/branch-phrases?all=1&juzFrom=30&juzTo=30');
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(screen.getByRole('status').textContent).toBe('Loading phrases…');
  fireEvent.change(box, { target: { value: '' } });
  fireEvent.change(box, { target: { value: 'وقعت' } });
  expect(await screen.findByRole('option', { name: /وَقَعَتِ/ })).toBeTruthy();
  expect(fetchMock).toHaveBeenCalledTimes(3);

  rerender(<OpeningSearch top={[]} juz={{ from: 29, to: 30 }} />);
  expect(fetchMock).toHaveBeenCalledTimes(3);
});
