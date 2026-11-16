import { describe, expect, it } from 'vitest';
import data from '../data/quran/itqanBalagha';
import { DEVICES, deviceOf, exampleReference } from './balaghaPage';

const example = (surah: number, from: number, to: number, source = 'البرهان للزركشي والإتقان للسيوطي') => ({ key: `${surah}:${from}`, surah, from, to, source });

describe("the balagha page's references", () => {
  it("cites al-Suyuti's definition of the device with its page", () => {
    expect(deviceOf(example(1, 2, 7)).name).toBe('الالتفات');
    expect(DEVICES[0].reference.quotes[0].url).toBe('https://shamela.ws/book/11728/1053');
  });

  it("gives an example his whole paragraphs on it under the device's heading, each once, with their pages", () => {
    const reference = exampleReference(example(1, 2, 7), data);
    expect(reference.title).toBe('الإتقان للسيوطي ٣/٢٩٢–٢٩٣');
    expect(reference.quotes.at(-1)).toEqual({ text: 'البرهان للزركشي والإتقان للسيوطي' });
    expect(reference.quotes.length).toBeGreaterThan(0);
    const his = reference.quotes.slice(0, -1);
    expect(new Set(his.map(quote => quote.text)).size).toBe(his.length);
    expect(his.every(quote => quote.url?.startsWith('https://shamela.ws/book/11728/'))).toBe(true);
  });

  it('falls back to the note the example came with where al-Itqan does not give it', () => {
    expect(exampleReference(example(12, 80, 80, 'الكشاف: قول كبيرهم'), data)).toEqual({ title: 'الكشاف', quotes: [{ text: 'الكشاف: قول كبيرهم' }] });
  });
});
