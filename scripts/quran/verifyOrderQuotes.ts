import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ORDER_AIMS, ORDER_LINKS } from '../../shared/quran/surahOrder';

const sources = {
  nazm: [9098, 'a875ece57673b31f4c1f3716c9361c6927edc9c9478049247a00919b90bcfa11'],
  masaid: [1404, 'f0e71dc927ddcc9acdea8c48feac32b04547cdf3b38ba01b6e6c96b5b8c078f9'],
  tanasuq: [9992, 'c94d59466b5734f347814c582a4a5c9973fa7a1a224af6c041f9a8c1c219786d'],
} as const;
type Page = { text: string; vol: string; page: number };
const books = new Map<string, Page[]>();
for (const [book, [id, sha]] of Object.entries(sources)) {
  const path = join(tmpdir(), `order-source-${id}-${sha.slice(0, 12)}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${id}.json`], { maxBuffer: 32 * 1024 * 1024 }));
  const bytes = readFileSync(path);
  if (createHash('sha256').update(bytes).digest('hex') !== sha) throw new Error(`Source ${id} changed; verify the edition before updating its checksum`);
  books.set(book, (JSON.parse(bytes.toString()) as { pages: Page[] }).pages);
}

const letters = (text: string) => text.normalize('NFKD').replace(/<[^>]+>/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/[^ء-غف-ي]/g, '');
let checked = 0;
for (const [kind, quotes] of Object.entries({ aim: ORDER_AIMS, link: ORDER_LINKS })) {
  for (const [surah, { text, src }] of Object.entries(quotes)) {
    if (Number(surah) > 41) continue;
    const pages = books.get(src.book)!;
    const first = pages[src.sh - 1];
    if (!first || first.page !== src.page || (src.vol !== undefined && Number(first.vol) !== src.vol)) throw new Error(`${kind} ${surah}: wrong printed page`);
    const passage = pages.slice(src.sh - 1).filter(page => page.vol === first.vol && page.page >= src.page && page.page <= (src.to ?? src.page));
    const source = letters(passage.map(page => page.text.split('_________')[0]).join(' '));
    let at = 0;
    for (const piece of text.split('…').map(letters).filter(Boolean)) {
      const found = source.indexOf(piece, at);
      if (found < 0) throw new Error(`${kind} ${surah}: quotation absent from its cited page`);
      at = found + piece.length;
    }
    checked++;
  }
}
console.log(`Verified ${checked} early-surah quotations against three checksum-pinned source editions.`);
