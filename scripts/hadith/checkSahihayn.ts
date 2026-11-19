// Checks the built Sahihayn (scripts/hadith/buildSahihayn.ts) against a second copy of both books: the fawazahmed0
// hadith-api Arabic editions, which carry Abd al-Baqi's numbers. It is a check witness only, never shipped. Every hadith
// (every Muslim route) is matched to the witness text it shares the most four-word runs with, and its number must be that
// text's number. It lists what disagrees and stops; a fix goes in data/hadith/{bukhari,muslim}-numbers.json. The
// disagreements still to be settled from the printed books are listed in data/hadith/sahihayn-check-known.json, a list
// that only shrinks; UPDATE_KNOWN=1 writes it.
// Run: npx tsx scripts/hadith/checkSahihayn.ts
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { SahihSlug, SahihText } from '../../shared/sahih';

interface Witness { hadithnumber: number; arabicnumber?: string | number; text: string }

function witness(slug: SahihSlug): Witness[] {
  const path = join('/tmp', `hadith-api-ara-${slug}.json`);
  if (!existsSync(path)) writeFileSync(path, execFileSync('curl', ['-fsSL', `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${slug}.json`], { maxBuffer: 64 * 1024 * 1024 }));
  return (JSON.parse(readFileSync(path, 'utf8')) as { hadiths: Witness[] }).hadiths;
}

const words = (text: string) => text
  .replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
  .replace(/[^ء-ي ]/g, ' ').split(/\s+/).filter(Boolean);
const runs = (text: string) => {
  const w = words(text);
  return new Set(w.slice(0, Math.max(0, w.length - 3)).map((_, i) => w.slice(i, i + 4).join(' ')));
};

/** The witness's number for each four-word run, so a text's best match is found without comparing it with every entry. */
function lookup(entries: { n: number; text: string }[]) {
  const index = new Map<string, number[]>();
  entries.forEach((entry, i) => { for (const run of runs(entry.text)) index.set(run, [...(index.get(run) ?? []), i]); });
  return (text: string) => {
    const mine = runs(text);
    const hits = new Map<number, number>();
    for (const run of mine) for (const i of new Set(index.get(run) ?? [])) hits.set(i, (hits.get(i) ?? 0) + 1);
    // Every entry as close as the best counts: the witness repeats a record's whole text under each of its numbers.
    const top = Math.max(0, ...hits.values());
    const ns = [...hits].filter(([, count]) => count >= top * 0.97).map(([i]) => entries[i].n);
    return { ns, share: mine.size ? top / mine.size : 0 };
  };
}

function check(slug: SahihSlug) {
  const files = (JSON.parse(readFileSync(`data/hadith/sahih/${slug}.json`, 'utf8')) as SahihText).kitabs;
  const entries = witness(slug).flatMap(w => {
    const n = Math.floor(Number(slug === 'bukhari' ? w.hadithnumber : w.arabicnumber));
    return Number.isFinite(n) && n > 0 && w.text ? [{ n, text: w.text }] : [];
  });
  const best = lookup(entries);
  const wrong: string[] = [];
  let checked = 0;
  for (const file of files) for (const hadith of file.hadith) for (const route of hadith.routes) {
    const { ns, share } = best(route.text);
    // A short text («بمثله») shares too little to tell; it is left to the routes around it.
    if (share < 0.5) continue;
    checked++;
    const mine = [hadith.n, ...(hadith.also ?? [])];
    if (!ns.some(n => mine.includes(n))) wrong.push(`${slug} ${hadith.n}${route.route ? ` («${route.route}», Shamela page ${route.shamela})` : ` (Shamela page ${route.shamela})`}: the witness has it as ${[...new Set(ns)].join(' or ')} (${Math.round(share * 100)}% shared)`);
  }
  console.log(`${slug}: ${checked} texts matched, ${wrong.length} disagree`);
  return wrong;
}

if (process.argv[1]?.endsWith('checkSahihayn.ts')) {
  const wrong = [...check('bukhari'), ...check('muslim')];
  const knownPath = 'data/hadith/sahihayn-check-known.json';
  if (process.env.UPDATE_KNOWN) writeFileSync(knownPath, `${JSON.stringify(wrong, null, 1)}\n`);
  const known = new Set(JSON.parse(readFileSync(knownPath, 'utf8')) as string[]);
  const fresh = wrong.filter(line => !known.has(line));
  console.log(`${known.size} known disagreements to settle from the print; ${fresh.length} new`);
  if (fresh.length) {
    console.log(fresh.join('\n'));
    process.exit(1);
  }
}
