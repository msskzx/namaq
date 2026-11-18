import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { readParagraphs, type TurathPage } from './itqanBalagha';
import itqan from '../../shared/data/quran/itqanBalagha';
import { termOf, type BalaghaTerm, type BalaghaTermsData, type TermQuote } from '../../shared/quran/balaghaTerms';

// The balagha terms page (shared/quran/balaghaTerms.ts): each term's defining words, quoted whole from al-Itqan (Turath's
// export of Shamela 11728, the edition buildItqanBalagha.ts reads) or, where al-Suyuti gives none, from al-Qazwini's
// Talkhis al-Miftah as printed above al-Subki's commentary in 'Arus al-Afrah (Shamela 11151, Hindawi's edition). Both
// exports are pinned by their hash. Which paragraphs define a term is read by hand: scripts/quran/balaghaTermDefinitions.json.
const OUT = join(__dirname, '../../shared/data/quran');
const ITQAN = { book: 11728, sha: '56e52b86c23a0d363a6e51d8fee677eec4f582ceb580e14d2beb8c851400d9f9' };
const TALKHIS = { book: 11151, sha: '80f9cd10c22d479048ababaf4c29e7e080e8ee3e39a692c8142839b66f2013a2' };
// The same pages as buildItqanBalagha.ts: kinds 52 to 58, without the stray page 942.
const FIRST = 884;
const LAST = 1095;
const STRAY = 942;

function turath({ book, sha }: { book: number; sha: string }): { pages: TurathPage[]; sha: string } {
  const path = join(tmpdir(), `turath-${book}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://files.turath.io/books-v3/${book}.json`], { maxBuffer: 64 * 1024 * 1024 }));
  const raw = readFileSync(path);
  const got = createHash('sha256').update(raw).digest('hex');
  if (sha && got !== sha) throw new Error(`Turath ${book}: sha ${got}, expected ${sha}`);
  return { pages: JSON.parse(raw.toString('utf8')).pages, sha: got };
}

type Definitions = Record<string, { defines: boolean; itqan: [number, string][]; talkhis?: [number, string][] }>;
const definitions = JSON.parse(readFileSync(join(__dirname, 'balaghaTermDefinitions.json'), 'utf8')) as Definitions;
delete (definitions as Record<string, unknown>)._note;

const itqanBook = turath(ITQAN);
const { paragraphs } = readParagraphs(itqanBook.pages.map((page, i) => ({ ...page, id: i + 1 })).filter(page => page.id >= FIRST && page.id <= LAST && page.id !== STRAY));
const talkhisBook = turath(TALKHIS);
// Al-Qazwini's text is the top of each printed page, above the rule «ــ» under which al-Subki's commentary runs.
const matn = (id: number) => talkhisBook.pages[id - 1].text.split('ــ')[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ');

// The terms in the order of his paragraphs, each with the chapter it falls in.
const kinds = new Map<string, number>();
for (const [kind, heading] of itqan.entries) {
  const term = termOf(kind, heading);
  if (term && !kinds.has(term)) kinds.set(term, kind);
}
const missing = [...kinds.keys()].filter(term => !definitions[term]);
if (missing.length) throw new Error(`no definition read for: ${missing.join('، ')}`);
const unused = Object.keys(definitions).filter(term => !kinds.has(term));
if (unused.length) throw new Error(`definitions for terms the cards do not use: ${unused.join('، ')}`);

const terms: BalaghaTerm[] = [...kinds].map(([name, kind]) => {
  const definition = definitions[name];
  const talkhis: TermQuote[] = (definition.talkhis ?? []).map(([id, text]) => {
    if (!matn(id).includes(text)) throw new Error(`${name}: «${text}» is not on Talkhis page ${id}`);
    const page = talkhisBook.pages[id - 1];
    return { book: 'talkhis', part: Number(page.vol), pages: [page.page, page.page], id, text };
  });
  const quotes: TermQuote[] = definition.itqan.map(([id, start]) => {
    const found = paragraphs.filter(paragraph => paragraph.id === id && paragraph.text.startsWith(start));
    if (found.length !== 1) throw new Error(`${name}: ${found.length} paragraphs on page ${id} start «${start}»`);
    const [{ part, first, last, text }] = found;
    return { book: 'itqan', part, pages: [first, last], id, text };
  });
  // Al-Qazwini's lines come first where they are the definition; al-Suyuti's own words under the heading follow.
  return { name, kind, defines: definition.defines, quotes: [...talkhis, ...quotes] };
});

const data: BalaghaTermsData = { terms };
writeFileSync(join(OUT, 'balaghaTerms.js'), `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});\n`);
writeFileSync(join(OUT, 'balaghaTerms.d.ts'), `// Generated next to this file by \`npm run quran:balagha-terms\`.\nimport type { BalaghaTermsData } from '../../quran/balaghaTerms';\ndeclare const data: BalaghaTermsData;\nexport default data;\n`);
console.log(`balagha terms: ${terms.length}, ${terms.filter(term => term.defines).length} defined; Talkhis sha ${talkhisBook.sha}`);
