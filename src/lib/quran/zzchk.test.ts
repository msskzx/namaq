import { it } from 'vitest';
import ayat from '@/app/quran/branches/ayat.json';
import { listPhrases, sharedOpenings, startingWith, branch, size, type BranchAyah } from '@/lib/quran/branches';
const all = ayat as BranchAyah[];
it('x', () => {
  let t = performance.now();
  const groups = sharedOpenings(all);
  const phrases = listPhrases(groups);
  console.log('build', performance.now() - t, phrases.length);
  const bad = phrases.filter(p => startingWith(all, p.id).length !== p.count);
  console.log('mismatch', bad.length, bad.slice(0, 5).map(p => [p.id, p.count, startingWith(all, p.id).length]));
  console.log('spaces', phrases.filter(p => p.id.includes('  ')).length);
  t = performance.now();
  for (let i = 0; i < 20; i++) { const g = startingWith(all, phrases[i].id); branch(g); phrases.filter(q => q.id.startsWith('x')); }
  console.log('req x20', performance.now() - t);
}, 600000);
it('one', () => { const t = performance.now(); startingWith(all, 'ان المتقين'); console.log('one startingWith', performance.now() - t);
  console.log('space tokens', all.filter(a => a.words.some(w => w.includes(' '))).length);
});
