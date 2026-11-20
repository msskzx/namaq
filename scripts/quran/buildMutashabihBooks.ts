import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chaptersOf, type TurathPage } from './mutashabihBooks';
import type { MutashabihBookData } from '../../shared/readerBooks';

// The three books of mutashabih whole, for the book reader: Turath's exports of the editions the branches' citations quote
// (shared/sources.ts), pinned by hash like scripts/quran/buildGharib.ts.
const OUT = join(__dirname, '../../shared/data/quran');
const BOOKS = [
  { id: 'kirmani', turath: 3580, sha: '7283591e943c74a82f6ffba22691bcb8229b7fde8a3c41d989b2c4554a89fe9a', from: [1, 0] },
  // Aydin's edition is his doctoral thesis: his study fills volume 1 up to the author's text on page 215.
  // Two pages of his notes sit among the author's: vol. 1 p. 404, before al-Nisa's heading, and p. 467.
  { id: 'iskafi', turath: 1340, sha: 'fa4e85be5a16f073b1131e6ed3ae7d6b3fca0b60483e2cddf829f5194c727628', from: [1, 215], notes: ['1:404', '1:467'] },
  { id: 'zubayr', turath: 1419, sha: 'da6eac6d6c79ac3e19ff3005e2fe9564e2ffacba6edcf775cb81797a620e11ce', from: [1, 0] },
] as const;

type Turath = { pages: TurathPage[]; '٘': { 'ٚ': { level: number }[] } };

for (const { id, turath, sha, from, ...more } of BOOKS) {
  const path = join(tmpdir(), `turath-${turath}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${turath}.json`], { maxBuffer: 32 * 1024 * 1024 }));
  const raw = readFileSync(path);
  const got = createHash('sha256').update(raw).digest('hex');
  if (got !== sha) throw new Error(`Turath ${turath}: sha ${got}, expected ${sha}`);
  const book = JSON.parse(raw.toString('utf8')) as Turath;
  const notes: readonly string[] = 'notes' in more ? more.notes : [];
  const pages = book.pages
    .filter(page => page.page !== null && (Number(page.vol) > from[0] || page.page >= from[1]))
    .map(page => (notes.includes(`${page.vol}:${page.page}`) ? { ...page, text: page.text.slice(Math.max(0, page.text.indexOf('<span'))).replace(/^[^<][\s\S]*$/, '') } : page));
  const { chapters, breaks } = chaptersOf(pages, book['٘']['ٚ'].map(item => item.level));
  const data: MutashabihBookData = { source: { book: turath, sha }, entries: chapters.map(({ surah, text }) => [surah, text]), breaks };
  const name = `mutashabih${id[0].toUpperCase()}${id.slice(1)}`;
  writeFileSync(join(OUT, `${name}.js`), `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});\n`);
  writeFileSync(join(OUT, `${name}.d.ts`), `// Generated next to this file by \`npm run quran:mutashabih-books\`.\nimport type { MutashabihBookData } from '../../readerBooks';\ndeclare const data: MutashabihBookData;\nexport default data;\n`);
  console.log(id, chapters.length, 'chapters', breaks.length, 'pages', Math.round(JSON.stringify(data).length / 1024), 'KB');
}
