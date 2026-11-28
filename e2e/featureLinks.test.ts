import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { extractLinks } from './featureLinks.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'feature-links-'));
const write = (file: string, text: string) => {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), text);
};
write('lib/ways.ts', `
import { router } from 'expo-router';
const TAB_OF = { trees: '/branches', read: '/read' };
export function toTab(href) { router.navigate(href, { withAnchor: true }); }
export const openIntent = intent => toTab(TAB_OF[intent.tab]);
export const topic = (href, label) => ({ onPress: () => toTab(href), label });
export const openBoth = slug => (slug ? toTab({ pathname: '/battle', params: { slug } }) : router.push({ pathname: '/person', params: { slug } }));
`);
write('components/Sheets.tsx', `
import { toTab } from '@/lib/ways';
export function TieSheet() { return <Button label="افتح الغزوة" onPress={() => toTab('/battle')} />; }
`);
write('components/Again.tsx', `export { TieSheet } from './Sheets';\n`);
write('screens/one.tsx', `
import { router } from 'expo-router';
import { openIntent, topic, openBoth } from '@/lib/ways';
import { TieSheet } from '@/components/Again';
export default function One() {
  const open = () => router.push('/two');
  return <>
    <Card head={topic('/three', 'افتح الثالثة')} />
    <Button label="الثانية" onPress={open} />
    <Button label="في المصحف" onPress={() => openIntent({ tab: 'read' })} />
    <Row onPress={() => openBoth('x')} />
    <TieSheet />
  </>;
}
`);
write('app/_layout.tsx', `export default function Layout() { return null; }\n`);
write('app/one.tsx', `import { lazyScreen } from '@/lib/lazy';\nexport default lazyScreen(() => require('@/screens/one'));\n`);
write('app/two.tsx', `export default function Two() { return null; }\n`);
afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

const { links, sheets } = extractLinks(root);
const found = (route: string) => links.filter(link => link.route === route);

describe('finding links in the code', () => {
  it('reads a helper that passes its route on, and the label beside it', () => {
    expect(found('/three')).toMatchObject([{ owner: 'One', how: 'tab', label: 'افتح الثالثة', screens: ['one'] }]);
  });

  it('labels a function kept in a variable by the button that calls it', () => {
    expect(found('/two')).toMatchObject([{ how: 'push', label: 'الثانية' }]);
  });

  it('picks the route a keyed map gives for the key passed in', () => {
    expect(found('/read').map(link => link.label)).toEqual(['في المصحف']);
    expect(found('/branches')).toEqual([]);
  });

  it('keeps for each route the way its own call opens it', () => {
    expect(found('/battle').find(link => link.file === 'screens/one.tsx')).toMatchObject({ how: 'tab' });
    expect(found('/person')).toMatchObject([{ how: 'push' }]);
  });

  it('follows a screen loaded by require and a component re-exported from another file', () => {
    expect(found('/battle').find(link => link.file === 'components/Sheets.tsx')).toMatchObject({ screens: ['one'], label: 'افتح الغزوة' });
    expect(sheets).toMatchObject([{ sheet: 'TieSheet', screens: ['one'] }]);
  });
});
