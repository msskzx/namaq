// One record = docs/records/NNNN-slug.md: a frontmatter block that holds
// Distillate's record fields, one `key: <JSON value>` per line (valid YAML),
// then the Markdown body. toDistillateMdx turns it back into the MDX file
// Distillate keeps under content/records/namaq/, links between records included.

export const FIELD_ORDER = [
  'title', 'summary', 'disclosure', 'sourceProject', 'kind', 'problem', 'approach',
  'outcome', 'conditions', 'evidence', 'implication', 'date', 'topics',
  'buildsOn', 'variantOf', 'lesson',
] as const;

export const REQUIRED = [
  'title', 'summary', 'disclosure', 'sourceProject', 'kind', 'problem', 'approach',
  'outcome', 'conditions', 'evidence', 'implication', 'date',
] as const;

export type Meta = Record<string, unknown>;
export type Record_ = { slug: string; meta: Meta; body: string };

export function parseRecord(slug: string, text: string): Record_ {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error(`${slug}: missing frontmatter`);
  const meta: Meta = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z]+): (.*)$/);
    if (!kv) throw new Error(`${slug}: bad frontmatter line: ${line}`);
    meta[kv[1]] = JSON.parse(kv[2]);
  }
  return { slug, meta, body: text.slice(m[0].length).trim() };
}

export function formatRecord(meta: Meta, body: string): string {
  const keys = [...FIELD_ORDER.filter((k) => k in meta), ...Object.keys(meta).filter((k) => !(FIELD_ORDER as readonly string[]).includes(k))];
  return `---\n${keys.map((k) => `${k}: ${JSON.stringify(meta[k])}`).join('\n')}\n---\n\n${body.trim()}\n`;
}

// Repo links in the body are relative Markdown links (../../path) here and
// <RepoLink> tags in Distillate. Links to other records (NNNN-slug.md) become
// /records/namaq/NNNN-slug.
export function toDistillateMdx({ meta, body }: Record_): string {
  const mdxBody = body
    .replace(/\[`([^`\]]+)`\]\(\.\.\/\.\.\/\1\)/g, (_, p) => `<RepoLink repo="namaq" path="${p}" />`)
    .replace(/\[([^\]]+)\]\(\.\.\/\.\.\/([^)]+)\)/g, (_, label, p) => `<RepoLink repo="namaq" path="${p}">${label}</RepoLink>`)
    .replace(/\]\((\d{4}-[a-z0-9-]+)\.md\)/g, '](/records/namaq/$1)');
  const keys = [...FIELD_ORDER.filter((k) => k in meta), ...Object.keys(meta).filter((k) => !(FIELD_ORDER as readonly string[]).includes(k))];
  return `export const meta = {\n${keys.map((k) => `  ${k}: ${JSON.stringify(meta[k])},`).join('\n')}\n};\n\n${mdxBody}\n`;
}
