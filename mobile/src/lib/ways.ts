import { router, type Href } from 'expo-router';
import type { CompareTarget } from './compare';
import type { CardWay } from './home';
import { setIntent, type Intent } from './intent';
import { branchView } from './settings';

const TAB_OF: Record<Intent['tab'], Href> = { branches: '/branches', compare: '/compare', read: '/read' };

let overTabs = false;

/** The root stack names the page in front (app/_layout.tsx): the tabs, or a page stacked over them. */
export const noteRootPage = (name: string) => { overTabs = name !== '(tabs)'; };

/**
 * Opens a tab. From a page stacked over the tabs (the saved and forgotten list) it closes that page first, so the tabs are not opened a second time over it.
 * Inside the tabs it only opens the page, so the home and Quran stacks keep the way back (a tree's compare goes back to the tree).
 */
export function toTab(href: Href) {
  if (overTabs && router.canDismiss()) router.dismissAll();
  // A stack's first page (home, the Quran hub) is gone back to, not opened again over the pages above it.
  const path = typeof href === 'string' ? href : href.pathname;
  // withAnchor puts the stack's first page under a page opened in a stack that has not been drawn yet (lib/stackOptions.ts).
  router.navigate(href, { withAnchor: true });
  if (path === '/' || path === '/quran') router.dismissAll();
}

/**
 * The back arrow of a page in the home or Quran stack: one page back, as the swipe from the right edge goes (lib/stackOptions.ts).
 * Each stack keeps its first page (home, the Quran hub) under the rest, so a tool opened from anywhere goes back to the Quran hub.
 */
export const back = () => router.back();

/** Opens the tab an intent is for, which then takes it. */
export const openIntent = (intent: Intent) => { setIntent(intent); toTab(TAB_OF[intent.tab]); };

/** Opens a compare page on its surah pair, scrolled to the card of the target's two ayat. */
export function openCompare(target: CompareTarget) {
  setIntent({ tab: 'compare', lead: target.lead, other: target.other, ayat: [`${target.lead}:${target.ayat[0]}`, `${target.other}:${target.ayat[1]}`] });
  toTab('/compare');
}

/** Opens the trees tab on the trees that hold one ayah. */
export function openTreesOf(ayah: string) {
  setIntent({ tab: 'branches', ayah });
  toTab('/branches');
}

/** Follows one way out of a saved card; a compare way with several pages is picked first, so it takes the picked one. */
export function followWay(way: CardWay, target?: CompareTarget) {
  if (way.to === 'mushaf') { setIntent({ tab: 'read', at: way.at }); toTab('/read'); return; }
  if (way.to === 'trees') { openTreesOf(way.ayah); return; }
  if (way.to === 'compare') { const picked = target ?? way.targets[0]; if (picked) openCompare(picked); return; }
  branchView.set(way.to);
  if (way.tree) toTab({ pathname: '/branches', params: { tree: way.tree } });
  else if (way.open) { setIntent(way.open); toTab('/branches'); }
}
