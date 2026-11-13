import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatRecord, parseRecord, REQUIRED, toDistillateMdx } from './format';

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
    expect(formatRecord(r.meta, r.body)).toBe(r.text);
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
  });
});
