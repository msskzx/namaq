export type Poem = {
  title: string;
  author: string;
  composed: number;
  transcription: string;
  corrected: number[];
  edition: { name: string; url: string; checked: boolean };
  chapters: { title: string; verses: [string, string][] }[];
};

export type NumberedVerse = { number: number; first: string; second: string };

export function numberVerses(poem: Poem): { title: string; verses: NumberedVerse[] }[] {
  let number = 0;
  return poem.chapters.map(({ title, verses }) => ({
    title,
    verses: verses.map(([first, second]) => ({ number: ++number, first, second })),
  }));
}
