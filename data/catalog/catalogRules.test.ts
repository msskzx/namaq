import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/loadCatalog';
import { legacyUnreviewed, type Cited, type Provenance } from '@/lib/catalog/types';
import { validateCatalog } from '@/lib/catalog/validateCatalog';
import { UNPROFILED_PEOPLE } from '@/lib/catalog/unprofiled';
import { loadBatch } from '@/lib/history/loadBatch';
import { loadModel } from '@/lib/model/load';
import { ANCHORED, hadithText, type SahihBook } from '@/lib/catalog/sahihText';
import { createHash } from 'node:crypto';

// Rules every person, battle, event and ordering must keep, checked over the whole catalog
// rather than one subject at a time. Which batch is approved is a separate
// question (npm run catalog:validate): here every declared claim counts.

const catalog = await loadCatalog();
const claims = readdirSync('data/history/batches').flatMap((dir) => loadBatch(join('data/history/batches', dir)).batch.claims);
const claimByKey = new Map(claims.map((claim) => [claim.key, claim]));
const keysOf = (provenance: Provenance | undefined): readonly string[] =>
  provenance === undefined || provenance === legacyUnreviewed ? [] : provenance;

const COUNTS = ['muslimForceCount', 'nonMuslimForceCount', 'muslimDeathCount', 'nonMuslimDeathCount'];

describe('the whole catalog', () => {
  // One hadith text (owner, 2026-11-24): data/hadith/sahih holds a Sahih hadith's words, and a catalog file names only
  // where they are, sahih('bukhari', 3854, 161, 346). Five words in a row from a hadith the file cites, in any string,
  // fail; a few words (a speaker's name, «رسول الله ﷺ») do not. Notes in comments are not the story's text.
  it('copies no words of a Sahih hadith it cites', () => {
    const BOOK: Record<string, SahihBook> = { 'sahih-al-bukhari': 'bukhari', 'sahih-muslim': 'muslim' };
    const RUN = 5;
    const runs = (text: string) => {
      const words = text.split(/\s+/).filter(Boolean);
      return words.slice(0, Math.max(0, words.length - RUN + 1)).map((_, i) => words.slice(i, i + RUN).join(' '));
    };
    const copies = readdirSync('data/catalog').filter((kind) => !kind.includes('.')).flatMap((kind) =>
      readdirSync(join('data/catalog', kind)).filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts')).flatMap((file) => {
        const source = readFileSync(join('data/catalog', kind, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
          // A witness is another book's words (Fath al-Bari quoting the hadith to name its speaker), not a copy.
          .replace(/witness: \{[^}]*\}/g, '');
        const cited = new Set([
          ...[...source.matchAll(/(?:slug|source): ['"](sahih-al-bukhari|sahih-muslim)['"][^}]*?hadith: (\d+)/g)].map((m) => `${BOOK[m[1]]} ${m[2]}`),
          ...[...source.matchAll(/hadith: (\d+)[^}]*?(?:slug|source): ['"](sahih-al-bukhari|sahih-muslim)['"]/g)].map((m) => `${BOOK[m[2]]} ${m[1]}`),
          ...[...source.matchAll(/sahih\('(bukhari|muslim)', (\d+)/g)].map((m) => `${m[1]} ${m[2]}`),
        ]);
        const inHadith = new Set([...cited].flatMap((ref) => runs(hadithText(ref.split(' ')[0] as SahihBook, Number(ref.split(' ')[1])))));
        return [...source.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g)]
          .map((m) => (m[1] ?? m[2] ?? m[3]).replace(/\\(.)/g, '$1'))
          .filter((literal) => runs(literal).some((run) => inHadith.has(run)))
          .map((literal) => `${kind}/${file}: ${literal.slice(0, 40)}`);
      }));
    expect(copies).toEqual([]);
  });

  // The positions are into the Sahih text as it was when the stories were anchored to it. Rebuilding that text (a fix to
  // a word, a route split another way) moves every position after it, so the stories are re-anchored in the same change.
  it('points into the Sahih text its positions were taken from', () => {
    for (const [book, sha] of Object.entries(ANCHORED)) {
      expect(createHash('sha256').update(readFileSync(`data/hadith/sahih/${book}.json`)).digest('hex').slice(0, 16), `data/hadith/sahih/${book}.json changed: re-anchor the sahih() positions`).toBe(sha);
    }
  });

  it('passes the catalog validator', async () => {
    const people = new Set<string>();
    for (const file of readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))) {
      const seed = (await import(join(process.cwd(), 'prisma', file))) as { people?: { slug: string }[] };
      seed.people?.forEach((person) => people.add(person.slug));
    }
    const spans = new Set(
      loadModel('.').flatMap((folder) => folder.units.flatMap((file) => file.spans.map((span) => `${file.unit.id}#${span.id}`))),
    );
    const claimSources = new Map(claims.map((claim) => [claim.key, [...new Set(claim.citations.map((c) => c.sourceSlug))]]));

    const issues = validateCatalog(catalog, { people, claims: new Set(claimByKey.keys()), spans, claimSources });

    // Relatives a person's entry names who have no profile stay a plain name (src/lib/catalog/unprofiled.ts lists
    // them). Only a person's own relations may name one, and each on the list is still named and still has no record.
    const unprofiled = (issue: { path: string; message: string }) =>
      /^people\/[^.]+\.relations\./.test(issue.path) && UNPROFILED_PEOPLE.has(issue.message.replace(/^unknown person /, ''));
    expect(issues.filter((issue) => !unprofiled(issue))).toEqual([]);
    expect(new Set(issues.filter(unprofiled).map((issue) => issue.message.replace(/^unknown person /, '')))).toEqual(UNPROFILED_PEOPLE);
  });

  // A claim may back a whole sentence (no field) or one value; a count never rests on a claim stating another value.
  it('never cites a battle count with a claim about a different value', () => {
    const counted = catalog.battles.flatMap((battle) =>
      COUNTS.flatMap((column) =>
        keysOf((battle.fields as Record<string, Cited<number> | undefined> | undefined)?.[column]?.claims).map((key) => ({
          at: `battles/${battle.slug}.${column}`, column, key,
        })),
      ),
    );

    expect(counted.length).toBeGreaterThan(0);
    expect(counted.filter(({ column, key }) => { const field = claimByKey.get(key)?.field; return field && field !== column; })).toEqual([]);
  });

  // A competing figure is evidence, not noise: it stays in its batch, marked
  // DISPUTED, and no count takes it.
  it('keeps every count figure no battle takes as a DISPUTED claim', () => {
    const taken = new Set(
      catalog.battles.flatMap((battle) =>
        COUNTS.flatMap((column) => keysOf((battle.fields as Record<string, Cited<number> | undefined> | undefined)?.[column]?.claims)),
      ),
    );
    const untaken = claims.filter((claim) => claim.field && COUNTS.includes(claim.field) && !taken.has(claim.key));

    expect(untaken.length).toBeGreaterThan(0);
    expect(untaken.filter((claim) => claim.confidence !== 'DISPUTED').map((claim) => claim.key)).toEqual([]);
  });
});
