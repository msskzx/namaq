import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

export type MergedPr = { number: number; title: string; body: string | null; mergedAt: string };
export type Unresolved = { text: string; reason: string };
export type UsedLine = { used: string[]; unresolved: Unresolved[] };
export type UsagePr = { number: number; title: string; mergedAt: string; line: string } & UsedLine;
export type Usage = {
  repo: string;
  records: Record<string, { file: string; createdIn: number | null }>;
  prs: UsagePr[];
};

export const REPO = 'msskzx/namaq';

export function usedLine(body: string | null): string | null {
  const m = body?.match(/^Records used:(.*)$/im);
  return m ? m[1].trim() : null;
}

export const RENUMBERED: Record<string, string> = { R0044: '0029', R0045: '0031', R0046: '0032', R0047: '0038' };

// see R0045
export const oldSlug = (slug: string) => `${RENUMBERED[slug.slice(0, 5)] ?? slug.slice(1, 5)}${slug.slice(5)}`;

// see R0020
const otherProject = /(?<![\w/.-])([a-z]+)\/(R?\d{4}(?:-[a-z0-9-]*[a-z0-9])?)/g;

// see R0008, R0027, R0048
// see R0005
// see R0005
// see ADR 0035, ADR 0037
export function parseUsedLine(line: string, slugs: string[], project = 'namaq'): UsedLine {
  const used: string[] = [];
  const unresolved: Unresolved[] = [];
  const resolve = (whole: string, matches: string[], num: string) => {
    if (matches.length === 1) used.push(`${project}/${matches[0]}`);
    else unresolved.push({ text: whole, reason: matches.length ? `${matches.length} records share the number ${num}` : 'no such record' });
  };
  if (/\bR\d{4}\b/.test(line)) {
    for (const [, from, id] of line.matchAll(otherProject)) if (from !== project) used.push(`${from}/${id.startsWith('R') ? id : `R${id}`}`);
    for (const m of line.matchAll(/(?<![\w/.-])(?:([a-z]+)\/)?(R\d{4})(?:-([a-z0-9-]*[a-z0-9]))?/g)) {
      const [whole, from = project, num, rest] = m;
      if (from !== project) continue;
      resolve(whole, rest ? slugs.filter((s) => s === `${num}-${rest}`) : slugs.filter((s) => s.startsWith(`${num}-`)), num);
    }
    return { used: [...new Set(used)], unresolved };
  }
  const text = line.replace(/\([^)]*\)/g, ' ').split(/\.(?:\s|$)/)[0].trim();
  if (/^none\b/i.test(text)) return { used, unresolved };
  let afterAdr = false;
  for (const item of text.split(',')) {
    if (/^\s*ADR\b/i.test(item)) {
      afterAdr = true;
      continue;
    }
    for (const m of item.matchAll(/\b(?:([a-z]+)\/)?(\d{4})(?:-([a-z0-9-]*[a-z0-9]))?/g)) {
      const [whole, from = project, num, rest] = m;
      if (from !== project) {
        used.push(`${from}/R${num}${rest ? `-${rest}` : ''}`);
        continue;
      }
      if (afterAdr && !rest) {
        unresolved.push({ text: whole, reason: 'a bare number after an ADR may name an ADR' });
        continue;
      }
      resolve(whole, rest ? slugs.filter((s) => oldSlug(s) === `${num}-${rest}`) : slugs.filter((s) => oldSlug(s).startsWith(`${num}-`)), num);
    }
  }
  return { used: [...new Set(used)], unresolved };
}

export function mergedPrs(argv: string[]): MergedPr[] {
  const file = argv.indexOf('--prs');
  if (file > -1) return JSON.parse(readFileSync(argv[file + 1], 'utf8'));
  const at = argv.indexOf('--limit');
  const limit = at > -1 ? argv[at + 1] : '5000';
  const prs: MergedPr[] = JSON.parse(
    execFileSync('gh', ['pr', 'list', '--repo', REPO, '--state', 'merged', '--limit', limit, '--json', 'number,title,body,mergedAt'], {
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
    }),
  );
  if (prs.length >= Number(limit)) throw new Error(`gh returned ${prs.length} PRs, the --limit; raise it so older PRs are not dropped`);
  return prs;
}

export function createdIn(file: string, cwd: string): number | null {
  const git = (...args: string[]) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  const added = git('log', '--follow', '--diff-filter=A', '--format=%H%x09%s', '--', file).split('\n').pop();
  if (!added) return null;
  const [sha, subject] = added.split('\t');
  const squash = subject.match(/\(#(\d+)\)$/);
  if (squash) return Number(squash[1]);
  const merge = git('log', '--merges', '--ancestry-path', '--format=%s', `${sha}..HEAD`).split('\n').pop()?.match(/Merge pull request #(\d+)/);
  return merge ? Number(merge[1]) : null;
}

export function buildUsage(prs: MergedPr[], slugs: string[], created: (slug: string) => number | null): Usage {
  return {
    repo: REPO,
    records: Object.fromEntries(slugs.map((s) => [`namaq/${s}`, { file: `docs/records/${s}.md`, createdIn: created(s) }])),
    prs: prs
      .flatMap((pr) => {
        const line = usedLine(pr.body);
        return line === null ? [] : [{ number: pr.number, title: pr.title, mergedAt: pr.mergedAt.slice(0, 10), line, ...parseUsedLine(line, slugs) }];
      })
      .sort((a, b) => a.number - b.number),
  };
}
