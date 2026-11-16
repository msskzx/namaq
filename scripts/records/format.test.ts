import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatRecord, parseRecord, REQUIRED, toDistillateMdx, TOPICS } from './format';

const dir = path.join(__dirname, '../../docs/records');
const files = readdirSync(dir).filter((f) => /^\d{4}-.*\.md$/.test(f)).sort();
const records = files.map((f) => ({ text: readFileSync(path.join(dir, f), 'utf8'), ...parseRecord(f.slice(0, -3), readFileSync(path.join(dir, f), 'utf8')) }));
const ids = new Set(records.map((r) => `namaq/${r.slug}`));

describe('docs/records', () => {
  it.each(records.map((r) => [r.slug, r] as const))('%s has Distillate fields and valid links', (_, r) => {
    for (const k of REQUIRED) expect(typeof r.meta[k], k).toBe('string');
    expect(['challenge', 'obstacle', 'detour']).toContain(r.meta.kind);
    expect(['solved', 'failed', 'partial', 'open']).toContain(r.meta.outcome);
    expect(r.meta.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const link of [...((r.meta.buildsOn as string[]) ?? []), ...((r.meta.variantOf as string[]) ?? [])]) {
      if (link.startsWith('namaq/')) expect(ids.has(link), link).toBe(true);
    }
    for (const topic of (r.meta.topics as string[]) ?? []) expect(TOPICS, topic).toContain(topic);
    expect(formatRecord(r.meta, r.body)).toBe(r.text);
  });

  // A bare "Records used: 0031" cannot say which of two records it means.
  // These four numbers were given twice before this check existed.
  it('gives each new record its own number', () => {
    const shared = ['0029', '0031', '0032', '0038'];
    const counts = new Map<string, number>();
    for (const f of files) counts.set(f.slice(0, 4), (counts.get(f.slice(0, 4)) ?? 0) + 1);
    expect([...counts].filter(([n, c]) => c > 1 && !shared.includes(n)).map(([n]) => n)).toEqual([]);
  });

  it('exports to an MDX meta block Distillate can evaluate', () => {
    const mdx = toDistillateMdx({
      slug: 'x',
      meta: { title: 'T', buildsOn: ['namaq/0001-a'] },
      body: 'See [`src/a.ts`](../../src/a.ts), [the plan](../../docs/p.md) and [0001](0001-a.md).',
    });
    const block = /^export const meta = (\{[\s\S]*?\n\});\n/.exec(mdx)!;
    expect(new Function(`return ${block[1]}`)()).toEqual({ title: 'T', buildsOn: ['namaq/0001-a'] });
    expect(mdx).toContain('<RepoLink repo="namaq" path="src/a.ts" />');
    expect(mdx).toContain('<RepoLink repo="namaq" path="docs/p.md">the plan</RepoLink>');
    expect(mdx).toContain('[0001](/records/namaq/0001-a)');
    expect(toDistillateMdx({ slug: 'x', meta: {}, body: 'both «{١ - ٨}», not `{a}`' })).toContain('both «\\{١ - ٨\\}», not `{a}`');
  });
});
