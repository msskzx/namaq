import { router, type Href } from 'expo-router';
import type { CompareTarget } from './compare';
import type { CardWay } from './home';
import { setIntent, type Intent } from './intent';
import { branchView } from './settings';

const TAB_OF: Record<Intent['tab'], Href> = { branches: '/branches', compare: '/compare', read: '/read' };

/** Opens a tab. From a page stacked over the tabs (the saved and forgotten list) it closes that page first, so the tabs are not opened a second time over it. */
export function toTab(href: Href) {
  if (router.canDismiss()) router.dismissAll();
  router.navigate(href);
}

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
