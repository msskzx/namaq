// See docs/feature-map.md, "How the links are found".
import { extractLinks } from './featureLinks.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCREENS, renderDoc, urlOf } from './featureMap.mjs';
import { brokenRules } from './featureRules.mjs';

export const SHARED_ACROSS = 20;

const pattern = route => route.replace(/\[[^\]]+\]/g, '[param]');
const byRoute = new Map(SCREENS.map(screen => [pattern(urlOf(screen.file)), screen]));
const byFile = new Map(SCREENS.map(screen => [screen.file, screen]));
export const screenOfRoute = route => byRoute.get(pattern(route)) ?? null;
export const pageOf = screen => (urlOf(screen.file).slice(1).replace(/\[([^\]]+)\]/g, '$1').replaceAll('/', '-') || 'home');

const quote = text => `"${String(text).replaceAll('"', '#quot;')}"`;
const cell = text => String(text ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
const where = item => `[${item.file}:${item.line}](../../mobile/src/${item.file}#L${item.line})`;
const linkTo = screen => `[${screen.name}](${pageOf(screen)}.md)`;

export function mapData() {
  const { links, sheets, uses } = extractLinks();
  const shared = item => item.everywhere || item.screens.length >= SHARED_ACROSS;
  const named = item => ({ ...item, target: item.route ? screenOfRoute(item.route) : null, in: item.screens.map(file => byFile.get(file)).filter(Boolean) });
  return { links: links.map(named), sheets: sheets.map(named), shared, uses };
}

function screenDiagram(screen, inbound, outbound, sheets) {
  const lines = ['```mermaid', 'flowchart RL', `  me[${quote(screen.name)}]`, '  style me stroke-width:3px'];
  inbound.forEach((from, i) => lines.push(`  in${i}([${quote(from.name)}]) --> me`));
  outbound.forEach(([to, label], i) => lines.push(`  me -- ${quote(label || '…')} --> out${i}[${quote(to.name)}]`));
  sheets.forEach((sheet, i) => lines.push(`  me -.-> sheet${i}{{${quote(sheet)}}}`));
  lines.push('```');
  return lines.join('\n');
}

const firstLabel = items => items.map(item => item.label).find(label => label && !/^‹›/.test(label)) ?? '';

function screenPage(screen, data) {
  const own = item => !data.shared(item) && item.in.includes(screen);
  const links = data.links.filter(own);
  const sheets = [...new Set(data.sheets.filter(own).map(item => item.sheet))].sort();
  const inbound = [...new Set(data.links.filter(item => !data.shared(item) && item.target === screen).flatMap(item => item.in))]
    .filter(from => from !== screen);
  const targets = new Map();
  for (const item of links) if (item.target && item.target !== screen) targets.set(item.target, [...(targets.get(item.target) ?? []), item]);
  const outbound = [...targets].map(([to, items]) => [to, firstLabel(items)]);
  const grouped = new Map();
  for (const item of links) grouped.set(item.owner, [...(grouped.get(item.owner) ?? []), item]);
  const rows = [...grouped].flatMap(([owner, items]) => items.map((item, i) =>
    `| ${i ? '' : `\`${owner}\``} | ${cell(item.label ?? (item.key ? `(${item.key})` : ''))} | ${item.target ? linkTo(item.target) : `\`${item.route}\``} | ${where(item)} |`));
  return `# ${screen.name}

\`mobile/src/app/${screen.file}.tsx\` · [the whole map](../feature-map.md)

${screenDiagram(screen, inbound.length > 8 ? [] : inbound, outbound.length > 12 ? [] : outbound, sheets)}

## Ways in

${screen.tabBar ? `- The tab bar's «${screen.tabBar}».\n` : ''}${inbound.map(from => `- ${linkTo(from)}`).join('\n') || (screen.tabBar ? '' : '- None found in the code.')}

## What it opens

${rows.length ? `| Part of the screen | Label | Opens | Code |\n| --- | --- | --- | --- |\n${rows.join('\n')}` : 'Nothing of its own: only the bars every screen has.'}

## Sheets

${sheets.map(sheet => `- \`${sheet}\``).join('\n') || 'None of its own.'}
`;
}

function sharedSection(data) {
  const rows = new Map();
  for (const item of [...data.links, ...data.sheets].filter(data.shared)) {
    const key = `${item.file}:${item.line}:${item.route ?? item.sheet}`;
    rows.set(key, `| \`${item.owner}\` | ${cell(item.label ?? (item.key ? `(${item.key})` : ''))} | ${item.sheet ? `sheet \`${item.sheet}\`` : item.target ? linkTo(item.target).replace('](', '](feature-map/') : `\`${item.route}\``} | ${where(item).replace('../../', '../')} |`);
  }
  return `| Part | Label | Opens | Code |\n| --- | --- | --- | --- |\n${[...rows.values()].join('\n')}`;
}

export function renderPages() {
  const data = mapData();
  const pages = new Map(SCREENS.map(screen => [`docs/feature-map/${pageOf(screen)}.md`, screenPage(screen, data)]));
  const list = data.links.map(({ file, line, owner, key, label, route, how, target, in: on, everywhere }) =>
    ({ file: `mobile/src/${file}`, line, owner, key, label, how, route, opens: target?.name ?? null, on: everywhere ? 'every screen' : on.map(screen => screen.name) }));
  pages.set('docs/feature-map/links.json', `${JSON.stringify(list, null, 1)}\n`);
  const rules = Object.entries(brokenRules(data)).map(([rule, list]) => {
    const unique = [...new Set(list)].sort();
    return `### ${rule}\n\n${unique.length ? `Broken in ${unique.length} places today:\n\n${unique.map(item => `- ${item}`).join('\n')}` : 'Holds everywhere today.'}`;
  }).join('\n\n');
  pages.set('docs/feature-map.md', renderDoc({ shared: sharedSection(data), pageOf, sharedAcross: SHARED_ACROSS, rules }));
  return pages;
}

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function routeFiles(dir = path.join(REPO, 'mobile/src/app'), prefix = '') {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return routeFiles(path.join(dir, entry.name), rel);
    return entry.name.endsWith('.tsx') && entry.name !== '_layout.tsx' ? [rel.slice(0, -4)] : [];
  }).sort();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.rmSync(path.join(REPO, 'docs/feature-map'), { recursive: true, force: true });
  fs.mkdirSync(path.join(REPO, 'docs/feature-map'));
  for (const [file, text] of renderPages()) fs.writeFileSync(path.join(REPO, file), text);
  console.log('Wrote docs/feature-map.md and docs/feature-map/');
}
